// Ground movement, reproduced from the original code. Rules, sources and deviations:
// docs/rules/movement.md. Pure logic (no DOM).
//
//   nationalMovementRate   EURSUBS1.NATIONAL_MOVEMENT_RATE
//   stepCost               MOVEUNIT.MOVE_COST (+ nested road / rail / river helpers)
//   reach / pathTo         multi-hex orders for the mouse UI (Dijkstra over the per-step rules)
//   moveForce              MOVE_UNIT step loop (allowance, readiness, possession, stacks)
//   railMove / canEntrain  rail movement (CAN_ENTRAIN, interdiction, finish rules)
//   bugOut                 zero-allowance bug-out order (MOVE_UNIT nested 317F + BUGOUT)
//   turnStartMove          start-of-turn allowance (SUPPLY nested code, called by REST_UP)

import { neighbor } from './hex.ts';
import type { GameState, Side, UnitState } from './state.ts';
import {
  POSSESSION_CODE, DUAL_INDEX, STATUS_MOVED, STATUS_READY, idx, onMap, unit, sideOf, enemyOf, forceUnits,
  forceHex, corpsOf, isStorm, rnd, snapshot, restore,
} from './state.ts';

export type MoveMode = 'tactical' | 'rail';

export type BlockReason =
  | 'offMap' // outside the playable map (ON_MAP)
  | 'notAdjacent'
  | 'impassable' // map edge (0x8F) or Manchuria (0x94)
  | 'water' // ocean / estuary / reservoir without sea or amphibious movement
  | 'noRail' // rail movement: hex is not a connected friendly rail hex
  | 'stackFull' // two friendly forces already in the hex
  | 'enemy' // enemy-occupied: assault / overrun (combat, not implemented yet)
  | 'allowance'; // not enough movement points left

export type CostItemKind = 'terrain' | 'river' | 'cpla' | 'congestion' | 'enemyTerritory' | 'disengage' | 'rail' | 'amphibious';

export interface CostItem {
  kind: CostItemKind;
  points: number;
  /** terrain items: terrain kind of the hex entered */
  terrain?: string;
  /** terrain items: entered along a road */
  road?: boolean;
  /** terrain items: the hex has a river that is included in the fixed value */
  river?: boolean;
}

export interface StepCost {
  /** Movement points to enter the hex (meaningless when blocked). */
  cost: number;
  blocked?: BlockReason;
  items: CostItem[];
  /** USMC amphibious exception: entered an estuary/reservoir at no cost, the force cannot stop there. */
  amphibious: boolean;
  /** The hex was not friendly controlled: entering it captures it and the order cannot be taken back. */
  captures: boolean;
}

// ---------- terrain codes ----------

const isDeepOcean = (c: number) => c >= 0xa5 && c < 0xdb;
const isWater = (c: number) => c >= 0xa5;
const isRailCode = (c: number) => (c >= 0x1e && c <= 0x57) || (c >= 0x7f && c <= 0x8e) || (c >= 0x95 && c <= 0x9e) || c === 0x93;
const CITY = 0x93;

/** Direction bit of the side of hex A that faces adjacent hex B (0 if not adjacent). */
export function sideMask(ax: number, ay: number, bx: number, by: number): number {
  for (let d = 0; d < 6; d++) {
    const [nx, ny] = neighbor(ax, ay, d);
    if (nx === bx && ny === by) return 1 << d;
  }
  return 0;
}

// ---------- allowance ----------

/** EURSUBS1.NATIONAL_MOVEMENT_RATE: full movement allowance by nationality (SYMBOL div 10). */
export function nationalMovementRate(g: Pick<GameState, 'scenarioNo'>, u: Pick<UnitState, 'symbol'>): number {
  const nat = Math.trunc(u.symbol / 10);
  let rate: number;
  if (g.scenarioNo < 4) {
    if (nat >= 0 && nat <= 3) rate = 24;
    else if (nat >= 4 && nat <= 5) rate = 18;
    else if (nat === 6) rate = 12;
    else if (nat === 7) rate = 18;
    else rate = 98;
  } else rate = 24;
  if (nat === 8) rate = 98; // 81 sea, 82 air, 83 rail: "unlimited"
  return rate;
}

/** EURSUBS1.MASK: movement points used, without the plotted-assault digits. */
export function usedMove(move: number): number {
  return move % 100;
}

/** Hundreds digit of MOVE: plotted assault direction code (3*dy + dx + 5), 0 if none. */
export function plottedAssault(move: number): number {
  return move >= 100 ? Math.trunc(move / 100) % 10 : 0;
}

/** MOVEUNIT.CLEAR_PLOTS on a single MOVE value: drop plotted assaults, refund the 5 reserved points. */
export function clearPlots(move: number): number {
  let m = move;
  for (const p of [1000, 100]) if (m > p) m += -Math.trunc(m / p) * p - 5;
  return m;
}

export interface Allowance {
  rate: number;
  used: number;
  remaining: number;
  moved: boolean;
  /** A plotted assault that starting a move would cancel. */
  assault: number;
}

export function allowance(g: GameState, leader: number): Allowance {
  const lead = unit(g, leader);
  const rate = nationalMovementRate(g, lead);
  const used = usedMove(clearPlots(lead.move));
  return { rate, used, remaining: Math.max(0, rate - used), moved: (lead.status & STATUS_MOVED) !== 0, assault: plottedAssault(lead.move) };
}

/**
 * Start-of-turn MOVE for a force (SUPPLY nested code at 0252:0531, called from REST_UP after resupply).
 * `supplied` is the supply state of the force's hex for its side.
 */
export function turnStartMove(g: GameState, leader: number, supplied: boolean): number {
  const members = forceUnits(g, leader);
  const lead = members[0];
  const avg = Math.trunc(members.reduce((a, u) => a + u.readiness, 0) / members.length);
  const rate = nationalMovementRate(g, lead);
  let used = avg >= 75 && supplied ? 0 : Math.trunc(rate / 2);
  if (avg === 50 && !supplied) used = rate;
  if (corpsOf(g, leader) === 1 && used !== 0) used = 3;
  const code = g.hexes[idx(g, lead.x, lead.y)]?.code ?? 0;
  if (isDeepOcean(code)) used = 0;
  if (independentCommando(g, lead)) used = 0;
  return used;
}

// ---------- adjacency helpers ----------

export type PossessionLookup = (i: number) => number;

/** EURSUBS1.OCEAN_ADJACENT: next to a deep ocean hex. */
export function oceanAdjacent(g: GameState, x: number, y: number): boolean {
  if (!onMap(g, x, y)) return false;
  for (let d = 0; d < 6; d++) {
    const [nx, ny] = neighbor(x, y, d);
    if (onMap(g, nx, ny) && isDeepOcean(g.hexes[idx(g, nx, ny)].code)) return true;
  }
  return false;
}

/** EURSUBS1.FROZEN: rivers are ignored north of the freeze line (coastal hexes thaw within 5 rows). */
export function frozen(g: GameState, x: number, y: number): boolean {
  const fl = g.freezeLine;
  if (y > fl) return false;
  if (fl - 5 >= y) return true;
  return !oceanAdjacent(g, x, y);
}

/**
 * EURSUBS1.ENEMY_ADJACENT(x, y, true): an adjacent hex holds forces and its possession differs from
 * this hex's possession (possession 3 is ignored, as in the original).
 */
export function enemyAdjacent(g: GameState, x: number, y: number, possAt: PossessionLookup = (i) => g.possession[i]): boolean {
  if (!onMap(g, x, y)) return false;
  const p = possAt(idx(g, x, y));
  if (p === 3) return false;
  for (let d = 0; d < 6; d++) {
    const [nx, ny] = neighbor(x, y, d);
    if (!onMap(g, nx, ny)) continue;
    const ni = idx(g, nx, ny);
    const pn = possAt(ni);
    if (pn === 3) continue;
    if (g.stacks[ni].length > 0 && pn !== p) return true;
  }
  return false;
}

/** EURSUBS1.COMMANDO(unit, true): 1995 North Korean commando operating alone. */
function independentCommando(g: GameState, u: UnitState): boolean {
  return g.scenarioNo === 4 && u.symbol === 53 && u.attached === 0;
}

/** MOVE_COST local [bp-18h]: the force contains a 1995 commando unit (COMMANDO(unit, false)). */
function hasCommando(g: GameState, members: UnitState[]): boolean {
  return g.scenarioNo === 4 && members.some((u) => u.symbol === 53);
}

/** MOVE_COST nested 0B57: entering the target hex along a road. */
function roadConnected(g: GameState, side: Side, fx: number, fy: number, tx: number, ty: number): boolean {
  const h = g.hexes[idx(g, tx, ty)];
  if (!((h.code >= 0x0b && h.code <= 0x7c) || h.code === CITY)) return false;
  if ((h.road & sideMask(tx, ty, fx, fy)) === 0) return false;
  if (isStorm(g) && g.scenarioNo < 4) return false;
  if (side === 'un' && g.refugees) return false;
  return true;
}

/** MOVE_COST nested 0CC3: rail link into the target hex through friendly, enemy-free territory. */
function railConnected(g: GameState, own: number, fx: number, fy: number, tx: number, ty: number, possAt: PossessionLookup): boolean {
  const s = g.hexes[idx(g, fx, fy)];
  const t = g.hexes[idx(g, tx, ty)];
  let linked: boolean;
  if (t.code === CITY) {
    // cities have no rail mask: the original checks the source hex's rail toward the city instead
    linked = s.code === CITY || (isRailCode(s.code) && (s.rail & sideMask(fx, fy, tx, ty)) !== 0);
  } else {
    linked = isRailCode(t.code) && (t.rail & sideMask(tx, ty, fx, fy)) !== 0;
  }
  if (!linked) return false;
  const ti = idx(g, tx, ty);
  if (!(possAt(ti) === own || isWater(t.code))) return false;
  if (enemyAdjacent(g, tx, ty, possAt)) return false;
  if (enemyAdjacent(g, fx, fy, possAt)) return false;
  return true;
}

/** MOVE_COST nested 0DF6: cost of a river hex. */
function riverCost(g: GameState, tx: number, ty: number, commando: boolean): number {
  let c = 4;
  if (frozen(g, tx, ty)) c = 0;
  else if (isStorm(g)) c = 6;
  if (commando) c = 0;
  return c;
}

export interface StepContext {
  /** Possession lookup, so path searches can treat hexes already entered as captured. */
  possAt?: PossessionLookup;
  /** Leader MOVE at this step (defaults to the live value, plots cleared). */
  leaderMove?: number;
}

/**
 * MOVEUNIT.MOVE_COST for tactical and rail movement. Sea and air movement are not implemented yet;
 * enemy-occupied hexes return `blocked: 'enemy'` instead of running OVERRUN.
 */
export function stepCost(
  g: GameState, leader: number, fx: number, fy: number, tx: number, ty: number,
  mode: MoveMode = 'tactical', ctx: StepContext = {},
): StepCost {
  const lead = unit(g, leader);
  const side = sideOf(lead);
  const own = POSSESSION_CODE[side];
  const possAt = ctx.possAt ?? ((i: number) => g.possession[i]);
  const rail = mode === 'rail';
  const members = forceUnits(g, leader);
  const commando = hasCommando(g, members);
  const items: CostItem[] = [];
  const out = (cost: number, blocked?: BlockReason, extra: Partial<StepCost> = {}): StepCost =>
    ({ cost, blocked, items, amphibious: false, captures: false, ...extra });

  if (!onMap(g, tx, ty)) return out(0, 'offMap');
  if (!sideMask(fx, fy, tx, ty)) return out(0, 'notAdjacent');
  const ti = idx(g, tx, ty);
  const t = g.hexes[ti];
  const s = g.hexes[idx(g, fx, fy)];
  const code = t.code;
  const occupants = g.stacks[ti].length;
  const ownOrWater = possAt(ti) === own || isWater(code);
  const roadOk = () => roadConnected(g, side, fx, fy, tx, ty);
  const railOk = () => railConnected(g, own, fx, fy, tx, ty, possAt);
  const terrain = (points: number, road = false, river = false) => {
    items.push({ kind: 'terrain', points, terrain: t.terrain, road, river });
    return points;
  };
  const railStep = (): number | null => {
    if (railOk()) { items.push({ kind: 'rail', points: 0 }); return 0; }
    return null;
  };

  // ---- terrain (case on the target hex code) ----
  let cost: number | null; // null = prohibited
  let amphibious = false;
  if (code === 0x00) cost = terrain(2);
  else if (code === 0x58) cost = terrain(3);
  else if (code === 0x92) cost = terrain(4);
  else if (code === CITY) cost = rail ? railStep() ?? terrain(2) : terrain(2);
  else if (code === 0x8f || code === 0x94) return out(0, 'impassable');
  else if (isWater(code)) {
    if (code >= 0xdb) {
      // USMC organic amphibious capability (manual 3.41210)
      const move = ctx.leaderMove ?? usedMove(clearPlots(lead.move));
      if (lead.symbol === 12 && move === 0 && lead.attached === 0 && g.computerSide !== 2 && s.code < 0xdb && !rail) {
        cost = 0;
        amphibious = true;
        items.push({ kind: 'amphibious', points: 0 });
      } else return out(0, 'water');
    } else return out(0, 'water'); // deep ocean: sea movement only
  } else if (code >= 0x01 && code <= 0x0a) {
    const r = riverCost(g, tx, ty, commando);
    cost = terrain(2) + r;
    items.push({ kind: 'river', points: r });
  } else if (code >= 0x0b && code <= 0x0f) cost = roadOk() ? terrain(2, true, true) : terrain(3, false, true);
  else if (code >= 0x10 && code <= 0x1d) cost = roadOk() ? terrain(1, true) : terrain(2);
  else if (code >= 0x1e && code <= 0x46) cost = rail ? railStep() : roadOk() ? terrain(1, true) : terrain(2);
  else if (code >= 0x47 && code <= 0x57) cost = rail ? railStep() : roadOk() ? terrain(code === 0x50 ? 1 : 2, true, true) : terrain(3, false, true);
  else if (code >= 0x59 && code <= 0x66) {
    const r = riverCost(g, tx, ty, commando);
    cost = terrain(3) + r;
    items.push({ kind: 'river', points: r });
  } else if (code >= 0x68 && code <= 0x6f) cost = roadOk() ? terrain(g.scenarioNo === 4 ? 2 : 3, true, true) : terrain(4, false, true);
  else if (code >= 0x71 && code <= 0x7c) cost = roadOk() ? terrain(g.scenarioNo === 4 ? 1 : 2, true) : terrain(3);
  else if (code >= 0x7f && code <= 0x89) cost = rail ? railStep() : terrain(3);
  else if (code >= 0x8c && code <= 0x8e) cost = rail ? railStep() : terrain(4, false, true);
  else if (code >= 0x95 && code <= 0x9c) cost = rail ? railStep() : terrain(2);
  else if (code >= 0x9d && code <= 0x9e) cost = rail ? railStep() : terrain(3, false, true);
  else return out(0, 'impassable'); // codes the original leaves undefined (not present on the map)

  if (cost === null) return out(0, 'noRail');

  // ---- modifiers, in the original order ----
  if (corpsOf(g, leader) === 1 && (cost === 3 || cost === 4)) {
    cost--;
    items.push({ kind: 'cpla', points: -1 });
  }
  if (rail && cost > 0) return out(0, 'noRail');
  if (occupants > 0 && ownOrWater) {
    cost++;
    items.push({ kind: 'congestion', points: 1 });
  }
  if (occupants > 1 && ownOrWater && !rail) return out(0, 'stackFull');
  const captures = !ownOrWater && occupants === 0;
  if (captures && !commando) {
    cost++;
    items.push({ kind: 'enemyTerritory', points: 1 });
  }
  if (enemyAdjacent(g, fx, fy, possAt) && (occupants === 0 || ownOrWater) && !independentCommando(g, lead)) {
    cost += 4;
    items.push({ kind: 'disengage', points: 4 });
  }
  if (occupants > 0 && !ownOrWater) return out(cost, 'enemy');
  if (rail) {
    cost = 0; // rail ignores congestion etc. (original: cost < rate -> 0)
    for (let i = items.length - 1; i >= 0; i--) if (items[i].kind !== 'rail') items.splice(i, 1);
  }
  if (amphibious) cost = 0;
  return out(cost, undefined, { amphibious, captures: captures && !isWater(code) });
}

// ---------- start-of-move checks ----------

export type CannotMove = 'notOnMap' | 'noAllowance';

/** MOVE_UNIT nested 317F: can the force start a tactical move? (bug-out is offered separately) */
export function cannotMove(g: GameState, leader: number): CannotMove | null {
  if (forceHex(g, leader) < 0) return 'notOnMap';
  const a = allowance(g, leader);
  if (a.used >= a.rate) return 'noAllowance';
  return null;
}

/** Bug-out is offered to unmoved forces that have no allowance left (manual 3.411, 5.22). */
export function canBugOut(g: GameState, leader: number): boolean {
  return cannotMove(g, leader) === 'noAllowance' && !allowance(g, leader).moved;
}

/** Per-step legality (MOVE_UNIT nested code at 3806): the "minimum move" exception included. */
export function stepAllowed(used: number, cost: number, rate: number, movedThisTurn: boolean): boolean {
  if (used + cost <= rate) return true;
  return !movedThisTurn && cost <= rate;
}

// ---------- reach (all hexes a force can get to this order) ----------

export interface ReachNode {
  hex: number;
  /** movement points used after entering the hex */
  used: number;
  steps: number;
  prev: number;
  step: StepCost;
  /** The force may end its move here. */
  canStop: boolean;
  /** Some step on the way captures enemy-controlled territory. */
  captures: boolean;
}

export interface Reach {
  leader: number;
  mode: MoveMode;
  origin: number;
  rate: number;
  usedStart: number;
  nodes: Map<number, ReachNode>;
  /** Hexes next to the reachable area that the force cannot enter, with the reason. */
  blocked: Map<number, BlockReason>;
  cannot: CannotMove | 'cannotEntrain' | null;
}

export function reach(g: GameState, leader: number, mode: MoveMode = 'tactical'): Reach {
  const origin = forceHex(g, leader);
  const lead = unit(g, leader);
  const own = POSSESSION_CODE[sideOf(lead)];
  const a = allowance(g, leader);
  const r: Reach = { leader, mode, origin, rate: a.rate, usedStart: a.used, nodes: new Map(), blocked: new Map(), cannot: null };
  if (mode === 'rail') {
    if (!canEntrain(g, leader)) { r.cannot = origin < 0 ? 'notOnMap' : 'cannotEntrain'; return r; }
  } else {
    r.cannot = cannotMove(g, leader);
    if (r.cannot) return r;
  }

  const W = g.width;
  const nodes = r.nodes;
  const start: ReachNode = {
    hex: origin, used: a.used, steps: 0, prev: -1, canStop: false, captures: false,
    step: { cost: 0, items: [], amphibious: false, captures: false },
  };
  nodes.set(origin, start);
  const done = new Set<number>();
  // small binary heap keyed by (used, steps)
  const heap: ReachNode[] = [start];
  const less = (p: ReachNode, q: ReachNode) => p.used < q.used || (p.used === q.used && p.steps < q.steps);
  const push = (n: ReachNode) => {
    heap.push(n);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (!less(heap[i], heap[p])) break;
      [heap[i], heap[p]] = [heap[p], heap[i]];
      i = p;
    }
  };
  const pop = (): ReachNode => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length) {
      heap[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1, rr = l + 1;
        let m = i;
        if (l < heap.length && less(heap[l], heap[m])) m = l;
        if (rr < heap.length && less(heap[rr], heap[m])) m = rr;
        if (m === i) break;
        [heap[i], heap[m]] = [heap[m], heap[i]];
        i = m;
      }
    }
    return top;
  };

  while (heap.length) {
    const cur = pop();
    if (done.has(cur.hex)) continue;
    done.add(cur.hex);
    const sx = cur.hex % W, sy = Math.floor(cur.hex / W);
    // hexes entered on the way are captured (land only), the origin keeps its real possession
    const possAt: PossessionLookup = (i) =>
      i === cur.hex && i !== origin && !isWater(g.hexes[i].code) ? own : g.possession[i];
    for (let d = 0; d < 6; d++) {
      const [tx, ty] = neighbor(sx, sy, d);
      if (!onMap(g, tx, ty)) continue;
      const ti = idx(g, tx, ty);
      if (done.has(ti)) continue;
      const sc = stepCost(g, leader, sx, sy, tx, ty, mode, { possAt, leaderMove: cur.used });
      if (sc.blocked) {
        if (!nodes.has(ti)) r.blocked.set(ti, sc.blocked);
        continue;
      }
      let used = cur.used;
      if (mode === 'tactical') {
        const first = cur.hex === origin;
        if (!stepAllowed(cur.used, sc.cost, a.rate, a.moved || !first)) {
          if (!nodes.has(ti)) r.blocked.set(ti, 'allowance');
          continue;
        }
        used = Math.min(a.rate, cur.used + sc.cost);
      }
      const prev = nodes.get(ti);
      const cand: ReachNode = {
        hex: ti, used, steps: cur.steps + 1, prev: cur.hex, step: sc,
        canStop: canStopAt(g, leader, ti, mode),
        captures: cur.captures || sc.captures,
      };
      if (!prev || less(cand, prev)) {
        nodes.set(ti, cand);
        r.blocked.delete(ti);
        push(cand);
      }
    }
  }
  return r;
}

/** MOVE_UNIT nested 2536: may the force end its move in this hex? */
export function canStopAt(g: GameState, leader: number, hex: number, mode: MoveMode): boolean {
  if (isWater(g.hexes[hex].code)) return false;
  const others = g.stacks[hex].filter((l) => l !== leader).length;
  if (mode === 'rail' && others >= 2) return false; // "Force can't stop here!"
  return others < 2;
}

/** Hex indices from the origin (exclusive) to `target` (inclusive), or null if unreachable. */
export function pathTo(r: Reach, target: number): number[] | null {
  const end = r.nodes.get(target);
  if (!end || target === r.origin) return null;
  const path: number[] = [];
  let n: ReachNode | undefined = end;
  while (n && n.hex !== r.origin) {
    path.push(n.hex);
    n = r.nodes.get(n.prev);
  }
  return path.reverse();
}

// ---------- executing orders ----------

export interface StepRecord { hex: number; cost: number; items: CostItem[]; captured: boolean; }

export interface MoveResult {
  ok: boolean;
  error?: BlockReason | CannotMove | 'cannotStop' | 'cannotEntrain' | 'emptyPath';
  steps: StepRecord[];
  usedBefore: number;
  usedAfter: number;
  readinessLoss: number;
  undoable: boolean;
  /** Rail movement: interdiction loss suffered by the leader unit (percent), 0 if none. */
  interdictionLoss?: number;
}

function fail(error: MoveResult['error'], usedBefore = 0): MoveResult {
  return { ok: false, error, steps: [], usedBefore, usedAfter: usedBefore, readinessLoss: 0, undoable: false };
}

/** CLEAR_PLOTS for every unit of the force (called when a force starts moving). */
function clearForcePlots(g: GameState, leader: number) {
  for (const u of forceUnits(g, leader)) u.move = clearPlots(u.move);
}

function relocate(g: GameState, leader: number, from: number, to: number) {
  const a = g.stacks[from];
  const k = a.indexOf(leader);
  if (k >= 0) a.splice(k, 1);
  g.stacks[to].push(leader);
}

/** Possession and airfield changes when a force enters a land hex (MOVE_UNIT nested code at 3E07). */
function capture(g: GameState, side: Side, hex: number) {
  if (isWater(g.hexes[hex].code)) return;
  const own = POSSESSION_CODE[side];
  const enemy = POSSESSION_CODE[enemyOf(side)];
  if (g.possession[hex] === enemy) {
    g.spotted[hex] = 1;
    const x = hex % g.width, y = Math.floor(hex / g.width);
    for (const af of g.airfields) if (af.x === x && af.y === y) af.current = side === 'communist' ? 0 : 1;
  }
  g.possession[hex] = own;
}

/**
 * Tactical movement along `path` (hex indices, origin excluded), one hex at a time with the original
 * per-step rules. Atomic: if any step is illegal, nothing changes.
 */
export function moveForce(g: GameState, leader: number, path: number[]): MoveResult {
  const why = cannotMove(g, leader);
  if (why) return fail(why);
  if (!path.length) return fail('emptyPath');
  const before = snapshot(g);
  const lead = unit(g, leader);
  const side = sideOf(lead);
  const rate = nationalMovementRate(g, lead);
  clearForcePlots(g, leader);
  const usedBefore = usedMove(lead.move);
  const members = forceUnits(g, leader);
  const readinessBefore = lead.readiness;
  const steps: StepRecord[] = [];
  let at = forceHex(g, leader);
  let captured = false;
  for (const to of path) {
    const fx = at % g.width, fy = Math.floor(at / g.width);
    const tx = to % g.width, ty = Math.floor(to / g.width);
    const sc = stepCost(g, leader, fx, fy, tx, ty, 'tactical', { leaderMove: lead.move });
    const moved = (lead.status & STATUS_MOVED) !== 0;
    const err = sc.blocked ?? (stepAllowed(lead.move, sc.cost, rate, moved) ? undefined : 'allowance');
    if (err) {
      restore(g, before);
      return fail(err, usedBefore);
    }
    // MOVE_UNIT step: allowance, stacks, possession, then every unit of the force
    lead.move = sc.cost < rate ? lead.move + sc.cost : rate;
    lead.move = Math.max(0, Math.min(rate, lead.move));
    relocate(g, leader, at, to);
    if (sc.captures) captured = true;
    capture(g, side, to);
    if (enemyAdjacent(g, tx, ty) && g.spotted[to] === 0) g.spotted[to] = 1;
    for (const u of members) {
      u.x = tx;
      u.y = ty;
      u.move = lead.move;
      if (sc.cost < rate + 1) u.readiness -= sc.cost;
      u.status = (u.status | STATUS_MOVED) & ~STATUS_READY;
    }
    steps.push({ hex: to, cost: sc.cost, items: sc.items, captured: sc.captures });
    at = to;
  }
  if (!canStopAt(g, leader, at, 'tactical')) {
    restore(g, before);
    return fail('cannotStop', usedBefore);
  }
  const undoable = !captured;
  g.undo = undoable ? { leader, snapshot: before } : null;
  g.version++;
  return {
    ok: true, steps, usedBefore, usedAfter: usedMove(lead.move), readinessLoss: readinessBefore - lead.readiness, undoable,
  };
}

/** Undo the last movement order (one level). */
export function undoMove(g: GameState): number | null {
  const u = g.undo;
  if (!u) return null;
  restore(g, u.snapshot);
  g.undo = null;
  return u.leader;
}

// ---------- rail movement ----------

/** MOVEUNIT.CAN_ENTRAIN */
export function canEntrain(g: GameState, leader: number): boolean {
  const at = forceHex(g, leader);
  if (at < 0) return false;
  const lead = unit(g, leader);
  const side = sideOf(lead);
  const x = at % g.width, y = Math.floor(at / g.width);
  if (!isRailCode(g.hexes[at].code)) return false;
  if (enemyAdjacent(g, x, y)) return false;
  if (lead.status & STATUS_MOVED) return false;
  if (g.phase !== 1) return false;
  if (g.railDemand[DUAL_INDEX[side]] > 4) return false;
  for (let d = 0; d < 6; d++) {
    const [nx, ny] = neighbor(x, y, d);
    if (!onMap(g, nx, ny)) continue;
    const sc = stepCost(g, leader, x, y, nx, ny, 'rail');
    if (!sc.blocked && sc.cost === 0) return true;
  }
  return false;
}

/** MOVEUNIT.UNIT_ATTRITION: each piece of equipment beyond the first is lost with `percent`% chance. */
export function unitAttrition(g: GameState, u: UnitState, percent: number) {
  if (percent <= 0) return;
  for (const e of u.equipment) {
    const count = e.assigned;
    for (let j = 2; j <= count; j++) if (rnd(g, 1, 100) < percent) e.assigned--;
  }
  u.readiness = Math.max(20, Math.min(100, u.readiness - percent));
}

/**
 * Rail movement to the end of `path`. Entraining rolls for enemy interdiction (leader unit only) and
 * counts against the five rail moves per side and turn; afterwards the force cannot move again.
 */
export function railMove(g: GameState, leader: number, path: number[]): MoveResult {
  if (!canEntrain(g, leader)) return fail('cannotEntrain');
  if (!path.length) return fail('emptyPath');
  const lead = unit(g, leader);
  const side = sideOf(lead);
  const usedBefore = usedMove(clearPlots(lead.move));
  // validate the whole route first: rail orders are not reversible
  let at = forceHex(g, leader);
  for (const to of path) {
    const sc = stepCost(g, leader, at % g.width, Math.floor(at / g.width), to % g.width, Math.floor(to / g.width), 'rail');
    if (sc.blocked) return fail(sc.blocked, usedBefore);
    at = to;
  }
  if (!canStopAt(g, leader, at, 'rail')) return fail('cannotStop', usedBefore);

  clearForcePlots(g, leader);
  g.railDemand[DUAL_INDEX[side]]++;
  const level = g.interdiction[DUAL_INDEX[enemyOf(side)]];
  let loss = 0;
  if (rnd(g, 1, 100) < level) {
    loss = rnd(g, 25, 90);
    unitAttrition(g, lead, loss);
  }
  const steps: StepRecord[] = [];
  at = forceHex(g, leader);
  for (const to of path) {
    relocate(g, leader, at, to);
    g.possession[to] = POSSESSION_CODE[side];
    g.spotted[to] = 1;
    steps.push({ hex: to, cost: 0, items: [{ kind: 'rail', points: 0 }], captured: false });
    at = to;
  }
  const rate = nationalMovementRate(g, lead);
  const x = at % g.width, y = Math.floor(at / g.width);
  for (const u of forceUnits(g, leader)) {
    u.x = x;
    u.y = y;
    u.move = rate;
    u.status = (u.status | STATUS_MOVED) & ~STATUS_READY;
  }
  g.undo = null;
  g.version++;
  return { ok: true, steps, usedBefore, usedAfter: rate, readinessLoss: 0, undoable: false, interdictionLoss: loss };
}

// ---------- bug-out ----------

/** MOVEUNIT.BUGOUT: panicked troops abandon equipment; readiness drops to 50 at most. */
export function bugOutUnit(g: GameState, u: UnitState) {
  for (const e of u.equipment) {
    const count = e.assigned;
    const surv = g.equipmentTypes.get(e.type)?.survivability ?? 0;
    for (let j = 2; j <= count; j++) if (surv < rnd(g, 1, 15)) e.assigned--;
  }
  u.readiness = Math.max(0, Math.min(50, u.readiness));
}

/** Bug-out order: losses for every unit, then 6 movement points (MOVE = rate - 6). */
export function bugOut(g: GameState, leader: number): boolean {
  if (!canBugOut(g, leader)) return false;
  clearForcePlots(g, leader);
  const rate = nationalMovementRate(g, unit(g, leader));
  for (const u of forceUnits(g, leader)) {
    bugOutUnit(g, u);
    u.move = rate - 6;
  }
  g.undo = null;
  g.version++;
  return true;
}
