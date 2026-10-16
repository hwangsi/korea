// Sea and airborne movement, reproduced from the original code. Rules, sources and deviations:
// docs/rules/naval.md. Pure logic (no DOM).
//
//   seaMoveBlock / seaStartCost  MOVEUNIT.AMPHIBIOUS (+ nested 19A0): who may move by sea, sealift cost
//   seaReach / seaMove           MOVE_UNIT with SYMBOL 81: deep ocean at any distance, then one step ashore
//   seaAssaultPreview / seaAssault  MOVE_COST enemy branch from the sea: OVERRUN, or the assault plot
//                                (MOVE_UNIT 23F2 / 22E3, at most two per turn: UTILITY_SPACE[9])
//   airMoveBlock                 MOVEUNIT.UNIT_COCKED: the 187th RCT at an airfield or in Japan
//   airReach / airDrop           MOVE_UNIT with SYMBOL 82, drop losses (nested 2645), drop on enemies (274D, 24A1)
//   orderReach                   reach of any mode for the UI
//
// Seaborne assaults in the combat phase (evacuation to Japan, advance) are in combat.ts.

import { neighbor } from './hex.ts';
import type { GameState } from './state.ts';
import {
  POSSESSION_CODE, STATUS_MOVED, STATUS_READY, idx, onMap, unit, forceUnits, forceHex, isStorm, rnd, sideOfId,
} from './state.ts';
import {
  stepCost, reach, isDeepOcean, isWater, inPort, oceanAdjacent, enemyAdjacent, nationalMovementRate, usedMove,
  clearForcePlots, relocate, capture, bugOutUnit, unitAttrition, fail, SPECIAL_RATE,
} from './movement.ts';
import type { MoveMode, MoveResult, Reach, ReachNode, StepCost, StepRecord } from './movement.ts';
import { overrunCheck, bury, directionCode, estimateCombat } from './combat.ts';
import type { CombatEstimate, OverrunCheck } from './combat.ts';

/** 1950s sealift: 4 points per turn (AMPHIBIOUS 1AC6). */
export const MAX_SEALIFT = 4;
/** Assault orders from the sea per turn (MOVE_UNIT 243F: UTILITY_SPACE[9] must be 0 or 1). */
export const MAX_SEA_ASSAULTS = 2;
/** AIRLIFT_DEMAND added by an airborne move (MOVE_UNIT 47EF). */
export const AIRLIFT_COST = 2;
/** Japan column (x 33, y 59..64): airborne take-off point and seaborne evacuation area. */
export const JAPAN_X = 33;
export const JAPAN_Y: [number, number] = [59, 64];

const xy = (g: GameState, i: number): [number, number] => [i % g.width, Math.floor(i / g.width)];

function hexDist(ax: number, ay: number, bx: number, by: number): number {
  const toCube = (x: number, y: number) => { const q = x; const r = y - (x + (x & 1)) / 2; return [q, r, -q - r]; };
  const a = toCube(ax, ay), b = toCube(bx, by);
  return Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]), Math.abs(a[2] - b[2]));
}

// ---------- sea movement ----------

/** AMPHIBIOUS nested 19A0: sealift points to begin a sea move here (deep ocean 0, port 2, other land 3). */
export function seaStartCost(g: GameState, x: number, y: number): number {
  if (isDeepOcean(g.hexes[idx(g, x, y)].code)) return 0;
  return inPort(g, x, y) ? 2 : 3;
}

export type SeaBlock =
  | 'notOnMap' | 'notCoastal' | 'moved' | 'storm' | 'phase' | 'notUn' | 'sealift' | 'sealift1995' | 'usmcOnly';

/** MOVEUNIT.AMPHIBIOUS: why the force cannot move by sea now (null = it can). */
export function seaMoveBlock(g: GameState, leader: number): SeaBlock | null {
  const at = forceHex(g, leader);
  if (at < 0) return 'notOnMap';
  const [x, y] = xy(g, at);
  const lead = unit(g, leader);
  const atSeaNow = isDeepOcean(g.hexes[at].code);
  if (!oceanAdjacent(g, x, y) && !atSeaNow) return 'notCoastal';
  if (lead.status & STATUS_MOVED) return 'moved';
  if (isStorm(g) && !atSeaNow) return 'storm';
  if (g.phase !== 1) return 'phase';
  if (sideOfId(g, leader) !== 'un') return 'notUn';
  if (MAX_SEALIFT - g.sealiftDemand < seaStartCost(g, x, y)) return 'sealift';
  if (g.scenarioNo === 4) {
    if (g.sealiftDemand !== 0) return 'sealift1995';
    if (lead.attached > 0 || Math.trunc(lead.symbol / 10) !== 1) return 'usmcOnly';
  }
  return null;
}

export function canSeaMove(g: GameState, leader: number): boolean {
  return seaMoveBlock(g, leader) === null;
}

/** Deep ocean hex next to (tx, ty) the force would sail to: its own hex if it is one, else the nearest open one. */
export function launchHex(g: GameState, leader: number, tx: number, ty: number): number {
  const origin = forceHex(g, leader);
  if (origin < 0) return -1;
  const [ox, oy] = xy(g, origin);
  let best = -1, bestKey = Infinity;
  for (let d = 0; d < 6; d++) {
    const [nx, ny] = neighbor(tx, ty, d);
    if (!onMap(g, nx, ny)) continue;
    const ni = idx(g, nx, ny);
    if (!isDeepOcean(g.hexes[ni].code)) continue;
    if (ni !== origin) {
      const sc = stepCost(g, leader, ox, oy, nx, ny, 'sea');
      if (sc.blocked) continue; // two forces already at sea there
    }
    const key = ni === origin ? -1 : hexDist(ox, oy, nx, ny) * 10 + g.stacks[ni].length;
    if (key < bestKey) { bestKey = key; best = ni; }
  }
  return best;
}

/**
 * Sea movement reach: every deep ocean hex (any distance, not landable), and every land hex the force can
 * come ashore in from an ocean hex next to it (the end of the move). Enemy-occupied coast goes to `blocked`
 * as 'enemy' (assault from the sea).
 */
export function seaReach(g: GameState, leader: number): Reach {
  const origin = forceHex(g, leader);
  const r: Reach = { leader, mode: 'sea', origin, rate: SPECIAL_RATE, usedStart: 0, nodes: new Map(), blocked: new Map(), cannot: null };
  r.cannot = seaMoveBlock(g, leader);
  if (r.cannot) return r;
  const [ox, oy] = xy(g, origin);
  const start: ReachNode = { hex: origin, used: 0, steps: 0, prev: -1, canStop: false, captures: false, step: { cost: 0, items: [], amphibious: false, captures: false } };
  r.nodes.set(origin, start);
  const oceans = new Set<number>();
  if (isDeepOcean(g.hexes[origin].code)) oceans.add(origin);
  for (let i = 0; i < g.hexes.length; i++) {
    if (i === origin || !isDeepOcean(g.hexes[i].code)) continue;
    const [x, y] = xy(g, i);
    if (!onMap(g, x, y)) continue;
    const sc = stepCost(g, leader, ox, oy, x, y, 'sea');
    if (sc.blocked) { r.blocked.set(i, sc.blocked); continue; }
    r.nodes.set(i, { hex: i, used: 0, steps: 1, prev: origin, step: sc, canStop: false, captures: false });
    oceans.add(i);
  }
  for (let i = 0; i < g.hexes.length; i++) {
    if (oceans.has(i) || i === origin || isDeepOcean(g.hexes[i].code)) continue;
    const [x, y] = xy(g, i);
    if (!onMap(g, x, y)) continue;
    let touches = false;
    for (let d = 0; d < 6 && !touches; d++) {
      const [nx, ny] = neighbor(x, y, d);
      touches = onMap(g, nx, ny) && oceans.has(idx(g, nx, ny));
    }
    if (!touches) continue;
    const from = launchHex(g, leader, x, y);
    if (from < 0) continue;
    const [fx, fy] = xy(g, from);
    const sc = stepCost(g, leader, fx, fy, x, y, 'sea');
    if (sc.blocked) { r.blocked.set(i, sc.blocked); continue; }
    r.nodes.set(i, { hex: i, used: 0, steps: from === origin ? 1 : 2, prev: from, step: sc, canStop: true, captures: sc.captures });
  }
  return r;
}

/** Put the force to sea at `origin` (MOVE_UNIT 4858): sealift points, beach embarkation losses. */
function embark(g: GameState, leader: number): { sealift: number; beachLoss: boolean } {
  const at = forceHex(g, leader);
  const [x, y] = xy(g, at);
  if (isDeepOcean(g.hexes[at].code)) return { sealift: 0, beachLoss: false };
  if (inPort(g, x, y)) { g.sealiftDemand += 2; return { sealift: 2, beachLoss: false }; }
  g.sealiftDemand += 3;
  bugOutUnit(g, unit(g, leader)); // the leader unit only, as coded (the manual says the force)
  return { sealift: 3, beachLoss: true };
}

/** One step of a sea move: ocean hexes reset MOVE to 0, the step ashore captures the hex and ends the move. */
function seaStep(g: GameState, leader: number, from: number, to: number) {
  const members = forceUnits(g, leader);
  const lead = members[0];
  const [tx, ty] = xy(g, to);
  relocate(g, leader, from, to);
  const ashore = !isDeepOcean(g.hexes[to].code);
  if (ashore) {
    capture(g, 'un', to);
    if (enemyAdjacent(g, tx, ty) && g.spotted[to] === 0) g.spotted[to] = 1;
  }
  const move = ashore ? nationalMovementRate(g, lead) : 0;
  for (const u of members) {
    u.x = tx; u.y = ty; u.move = move;
    u.status = (u.status | STATUS_MOVED) & ~STATUS_READY;
  }
}

/**
 * Sea movement along `path` (deep ocean hexes, then the hex ashore). Not reversible. The move has to end
 * ashore: the original offers no "Finished" while the force is at sea (only a landing or an assault ends it).
 */
export function seaMove(g: GameState, leader: number, path: number[]): MoveResult {
  const why = seaMoveBlock(g, leader);
  if (why) return fail(why);
  if (!path.length) return fail('emptyPath');
  const origin = forceHex(g, leader);
  const lead = unit(g, leader);
  const usedBefore = usedMove(lead.move);
  // validate first: sea orders cannot be taken back
  let at = origin;
  const costs: StepCost[] = [];
  for (let k = 0; k < path.length; k++) {
    const [fx, fy] = xy(g, at);
    const [tx, ty] = xy(g, path[k]);
    const sc = stepCost(g, leader, fx, fy, tx, ty, 'sea');
    if (sc.blocked === 'enemy' && g.limitedIntel && g.spotted[path[k]] === 0) {
      // limited intelligence: the landing hex hides enemy forces. Spot it; the player may now assault it.
      g.spotted[path[k]] = 1;
      g.version++;
      return { ...fail('enemyFound', usedBefore), revealed: [path[k]] };
    }
    if (sc.blocked) return fail(sc.blocked, usedBefore);
    if (sc.lands && k !== path.length - 1) return fail('cannotStop', usedBefore);
    costs.push(sc);
    at = path[k];
  }
  if (isWater(g.hexes[at].code)) return fail('cannotStop', usedBefore);

  const e = embark(g, leader);
  clearForcePlots(g, leader);
  const steps: StepRecord[] = [];
  at = origin;
  path.forEach((to, k) => {
    seaStep(g, leader, at, to);
    steps.push({ hex: to, cost: 0, items: costs[k].items, captured: costs[k].captures });
    at = to;
  });
  let sealift = e.sealift;
  const [ex, ey] = xy(g, at);
  if (inPort(g, ex, ey)) { g.sealiftDemand -= 1; sealift -= 1; } // MOVE_UNIT 4550: a port returns a point
  g.undo = null;
  g.version++;
  return {
    ok: true, steps, usedBefore, usedAfter: usedMove(lead.move), readinessLoss: 0, undoable: false, sealift, beachLoss: e.beachLoss,
  };
}

export interface SeaAssaultPreview {
  allowed: boolean;
  error?: string;
  /** Deep ocean hex the assault is launched from (-1 if none). */
  from: number;
  overrun: OverrunCheck | null;
  estimate: CombatEstimate | null;
  /** UTILITY_SPACE[9]: assault orders from the sea already given this turn. */
  assaultsUsed: number;
  /** A plot is still possible (fewer than two this turn); otherwise only an overrun can land the force. */
  canPlot: boolean;
  /** Sealift points to put to sea, and whether the leader takes beach losses. */
  sealift: number;
  beachLoss: boolean;
}

/** What clicking an enemy-held coastal hex in sea mode would do (no randomness, no side effects). */
export function seaAssaultPreview(g: GameState, leader: number, tx: number, ty: number): SeaAssaultPreview {
  const used = g.utility[9] ?? 0;
  const none = (error: string): SeaAssaultPreview =>
    ({ allowed: false, error, from: -1, overrun: null, estimate: null, assaultsUsed: used, canPlot: used < MAX_SEA_ASSAULTS, sealift: 0, beachLoss: false });
  const why = seaMoveBlock(g, leader);
  if (why) return none(why);
  if (!onMap(g, tx, ty)) return none('offMap');
  const from = launchHex(g, leader, tx, ty);
  if (from < 0) return none('noLaunch');
  const [fx, fy] = xy(g, from);
  const sc = stepCost(g, leader, fx, fy, tx, ty, 'sea');
  if (sc.blocked !== 'enemy') return none(sc.blocked ?? 'notEnemy');
  const origin = forceHex(g, leader);
  const [ox, oy] = xy(g, origin);
  const startCost = seaStartCost(g, ox, oy);
  // at sea MOVE is 0 and the special rate 98 always leaves room for the overrun roll (MOVE_COST 14F4)
  const ov = overrunCheck(g, leader, fx, fy, tx, ty, 0);
  const canPlot = used < MAX_SEA_ASSAULTS;
  const estimate = estimateCombat(g, leader, tx, ty, [fx, fy]);
  const base = { from, overrun: ov, estimate, assaultsUsed: used, canPlot, sealift: startCost, beachLoss: startCost === 3 };
  if (!canPlot && !ov.possible) return { allowed: false, error: 'seaAssaultLimit', ...base };
  return { allowed: true, ...base };
}

export interface SeaAssaultOutcome {
  ok: boolean;
  error?: string;
  /** 'overrun': defenders destroyed, the force came ashore; 'plotted': assault from the sea in the combat
   *  phase; 'stranded': overrun failed and no assault order was left, the force stays at sea this turn. */
  result?: 'overrun' | 'plotted' | 'stranded';
  from?: number;
  sealift?: number;
  beachLoss?: boolean;
}

/**
 * Sail next to an enemy-held coastal hex and go in: MOVE_COST rolls OVERRUN from the sea (50%), a success
 * lands the force at once; otherwise MOVE_UNIT 23F2 plots an assault from the sea (MOVE = rate + d*100 + 5,
 * UTILITY_SPACE[9] + 1). With two such orders already given the order ends at sea ("Illegal move!").
 */
export function seaAssault(g: GameState, leader: number, tx: number, ty: number): SeaAssaultOutcome {
  const pv = seaAssaultPreview(g, leader, tx, ty);
  if (!pv.allowed) return { ok: false, error: pv.error };
  const origin = forceHex(g, leader);
  const members = forceUnits(g, leader);
  const lead = members[0];
  const e = embark(g, leader);
  clearForcePlots(g, leader);
  const from = pv.from;
  const [fx, fy] = xy(g, from);
  if (from !== origin) seaStep(g, leader, origin, from);
  else for (const u of members) u.move = 0;
  const ti = idx(g, tx, ty);
  let sealift = e.sealift;
  const ov = overrunCheck(g, leader, fx, fy, tx, ty, 0);
  g.undo = null;
  g.version++;
  if (ov.strongEnough && rnd(g, 1, 2) === 1 && ov.enoughMove) {
    // OVERRUN success: leader attrition, defenders buried, the force comes ashore (cost = rate)
    unitAttrition(g, lead, ov.r2);
    for (const d of g.stacks[ti].slice()) for (const v of forceUnits(g, d)) bury(g, v);
    g.stacks[ti] = [];
    seaStep(g, leader, from, ti);
    if (inPort(g, tx, ty)) { g.sealiftDemand -= 1; sealift -= 1; }
    return { ok: true, result: 'overrun', from, sealift, beachLoss: e.beachLoss };
  }
  const rate = nationalMovementRate(g, lead);
  const sixOk = members.every((u) => usedMove(u.move) <= nationalMovementRate(g, u) - 6);
  if (!pv.canPlot || !sixOk) {
    for (const u of members) u.move = rate;
    return { ok: true, result: 'stranded', from, sealift, beachLoss: e.beachLoss };
  }
  // 22E3 at sea: spot the target, MOVE = rate + direction*100 + 5 for the whole force, one more sea assault
  if (g.spotted[ti] === 0) g.spotted[ti] = 1;
  const move = rate + directionCode(fx, fy, tx, ty) * 100 + 5;
  for (const u of members) { u.move = move; u.status = (u.status | STATUS_MOVED) & ~STATUS_READY; }
  g.utility[9] = (g.utility[9] ?? 0) + 1;
  return { ok: true, result: 'plotted', from, sealift, beachLoss: e.beachLoss };
}

// ---------- airborne movement ----------

export type AirBlock = 'notOnMap' | 'notAirborne' | 'scenario' | 'notAirfield' | 'moved' | 'storm' | 'notAlone';

/** At an airfield (any of the nine, whoever holds it) or in Japan: UNIT_COCKED 18F9..1961. */
export function airTakeoffHex(g: GameState, x: number, y: number): boolean {
  if (g.airfields.some((a) => a.x === x && a.y === y)) return true;
  return x === JAPAN_X && y >= JAPAN_Y[0] && y <= JAPAN_Y[1];
}

/** MOVEUNIT.UNIT_COCKED: why the unit cannot move by air (null = it can). No phase check in the original. */
export function airMoveBlock(g: GameState, leader: number): AirBlock | null {
  const at = forceHex(g, leader);
  if (at < 0) return 'notOnMap';
  const lead = unit(g, leader);
  if (lead.symbol !== 3) return 'notAirborne';
  if (g.scenarioNo >= 4) return 'scenario';
  const [x, y] = xy(g, at);
  if (!airTakeoffHex(g, x, y)) return 'notAirfield';
  if (lead.status & STATUS_MOVED) return 'moved';
  if (isStorm(g)) return 'storm';
  if (lead.attached > 0) return 'notAlone';
  return null;
}

export function canAirMove(g: GameState, leader: number): boolean {
  return airMoveBlock(g, leader) === null;
}

/** MOVE_UNIT nested 2536 (air): no drop in water, nor in a friendly hex that already holds two forces. */
export function airCanStop(g: GameState, hex: number): boolean {
  if (isWater(g.hexes[hex].code)) return false;
  return !(g.possession[hex] === POSSESSION_CODE.un && g.stacks[hex].length >= 2);
}

/**
 * MOVE_UNIT nested 2645: equipment loss ratio of a drop. Open and urban 5, rough 10, mountain 25,
 * +5 if not clear, + the Communist interception level in MiG Alley (x <= 14, y <= 26); 0 on an airfield
 * hex that was already friendly.
 */
export function airdropLoss(g: GameState, x: number, y: number, possessionBefore = g.possession[idx(g, x, y)]): number {
  return airdropLossParts(g, x, y, possessionBefore).total;
}

/** The parts of `airdropLoss` for the preview: terrain, weather, MiG Alley, friendly airfield. */
export function airdropLossParts(g: GameState, x: number, y: number, possessionBefore = g.possession[idx(g, x, y)]) {
  const code = g.hexes[idx(g, x, y)].code;
  let terrain = code < 0x58 || code > 0x94 || code === 0x93 ? 5 : 10;
  if (code === 0x92) terrain = 25;
  const weather = g.sky > 1 ? 5 : 0;
  const mig = y <= 26 && x <= 14 ? g.redAir : 0;
  const airfield = possessionBefore === POSSESSION_CODE.un && g.airfields.some((a) => a.x === x && a.y === y);
  return { terrain, weather, mig, airfield, total: airfield ? 0 : terrain + weather + mig };
}

/** The drop hex holds enemy forces: the 187th has to overrun them at once (manual 3.41209). */
export function dropOnEnemy(g: GameState, hex: number): boolean {
  return g.possession[hex] === POSSESSION_CODE.communist && g.stacks[hex].length > 0;
}

/** Airborne reach: every land hex on the map (water and the map edge excluded, full friendly hexes pass-through). */
export function airReach(g: GameState, leader: number): Reach {
  const origin = forceHex(g, leader);
  const r: Reach = { leader, mode: 'air', origin, rate: SPECIAL_RATE, usedStart: 0, nodes: new Map(), blocked: new Map(), cannot: null };
  r.cannot = airMoveBlock(g, leader);
  if (r.cannot) return r;
  const [ox, oy] = xy(g, origin);
  r.nodes.set(origin, { hex: origin, used: 0, steps: 0, prev: -1, canStop: false, captures: false, step: { cost: 0, items: [], amphibious: false, captures: false } });
  for (let i = 0; i < g.hexes.length; i++) {
    if (i === origin) continue;
    const [x, y] = xy(g, i);
    if (!onMap(g, x, y) || isWater(g.hexes[i].code)) continue;
    const sc = stepCost(g, leader, ox, oy, x, y, 'air');
    if (sc.blocked) continue;
    r.nodes.set(i, { hex: i, used: 0, steps: 1, prev: origin, step: sc, canStop: airCanStop(g, i), captures: g.possession[i] !== POSSESSION_CODE.un });
  }
  return r;
}

/**
 * Airborne move of the 187th RCT to `hex`: AIRLIFT_DEMAND + 2, MOVE = 24 (no further movement), drop losses.
 * A drop on enemy forces runs OVERRUN with the allowance already spent, so it always fails and the unit is
 * destroyed ("airborne unit has been destroyed!", original code). Otherwise the hex becomes friendly.
 */
export function airDrop(g: GameState, leader: number, hex: number): MoveResult {
  const why = airMoveBlock(g, leader);
  if (why) return fail(why);
  const origin = forceHex(g, leader);
  const [tx, ty] = xy(g, hex);
  if (!onMap(g, tx, ty) || hex === origin) return fail('emptyPath');
  const [ox, oy] = xy(g, origin);
  const sc = stepCost(g, leader, ox, oy, tx, ty, 'air');
  if (sc.blocked) return fail(sc.blocked);
  if (!airCanStop(g, hex)) return fail('cannotStop');
  const lead = unit(g, leader);
  const usedBefore = usedMove(lead.move);
  g.airliftDemand += AIRLIFT_COST;
  clearForcePlots(g, leader);
  const possBefore = g.possession[hex];
  const enemy = dropOnEnemy(g, hex);
  lead.move = 24; // MOVE_UNIT 4245 (literal 24)
  const loss = airdropLoss(g, tx, ty, possBefore);
  unitAttrition(g, lead, loss);
  const step: StepRecord = { hex, cost: 0, items: sc.items, captured: possBefore !== POSSESSION_CODE.un };
  g.undo = null;
  g.version++;
  if (enemy) {
    // 274D: OVERRUN(unit, x, y, x, y, 1, ...) needs 6 points left, but MOVE is already 24
    const ov = overrunCheck(g, leader, tx, ty, tx, ty, lead.move);
    if (!(ov.strongEnough && rnd(g, 1, 1) === 1 && ov.enoughMove)) {
      const s = g.stacks[origin];
      s.splice(s.indexOf(leader), 1);
      bury(g, lead);
      return { ok: true, steps: [step], usedBefore, usedAfter: 24, readinessLoss: 0, undoable: false, dropLoss: loss, destroyed: true };
    }
    unitAttrition(g, lead, ov.r2);
    for (const d of g.stacks[hex].slice()) for (const v of forceUnits(g, d)) bury(g, v);
    g.stacks[hex] = [];
  }
  relocate(g, leader, origin, hex);
  // the hop marks the hex friendly and spotted (3BDF); airborne movement does not touch airfield ratings
  g.possession[hex] = POSSESSION_CODE.un;
  g.spotted[hex] = 1;
  lead.x = tx; lead.y = ty;
  lead.status = (lead.status | STATUS_MOVED) & ~STATUS_READY;
  return { ok: true, steps: [step], usedBefore, usedAfter: 24, readinessLoss: 0, undoable: false, dropLoss: loss };
}

// ---------- any mode ----------

/** The mode a force gets when selected: a force at sea can only move by sea (HEXSTUFF 07DC). */
export function defaultMode(g: GameState, leader: number): MoveMode {
  const at = forceHex(g, leader);
  return at >= 0 && isDeepOcean(g.hexes[at].code) ? 'sea' : 'tactical';
}

export function orderReach(g: GameState, leader: number, mode: MoveMode): Reach {
  if (mode === 'sea') return seaReach(g, leader);
  if (mode === 'air') return airReach(g, leader);
  return reach(g, leader, mode);
}
