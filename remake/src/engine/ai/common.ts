// Shared infrastructure of the original computer players (docs/rules/ai.md 3). Pure logic (no DOM).
// AISUBS, the module-level WARRIORS procedures that KIM and WALTON both call (0000, 0278, 0605, ROUTE) and
// REPORTS.SORT_FORCE, ported from the code. Side-generic (player 1 = Communist / KIM, 2 = UN / WALTON), so a port
// of WALTON or an improved AI can reuse every piece.
//
// The computer moves forces with its own code, not MOVE_UNIT (docs/rules/ai.md 3.3): MOVE_TO_OBJECTIVE and the
// route march call MOVE_COST step by step (its enemy branch may really roll OVERRUN), UPDATE_FORCE_STATE books
// the step, the TERRAIN bytes are written directly. No CHEK_HEX spotting, no 12-point rule, no airfield capture.

import type { GameState, Player, UnitState } from '../state.ts';
import { STATUS_MOVED, STATUS_READY, idx, onMap, unit, forceUnits, forceHex, corpsOf, rnd } from '../state.ts';
import { hexDistance } from '../hex.ts';
import { nationalMovementRate, stepCost, enemyAdjacent, isWater } from '../movement.ts';
import { forceStrength, rollOverrun, decodeDirection } from '../combat.ts';

// ---------- small queries ----------

/** TERRAIN bounds of the original array (x 0..33, y 0..65), wider than ON_MAP (the holding box counts). */
export function inGrid(g: GameState, x: number, y: number): boolean {
  return x >= 0 && y >= 0 && x < g.width && y < g.height;
}

export function codeAt(g: GameState, x: number, y: number): number {
  return inGrid(g, x, y) ? g.hexes[idx(g, x, y)].code : 0;
}

export function possAt(g: GameState, x: number, y: number): number {
  return inGrid(g, x, y) ? g.possession[idx(g, x, y)] : 0;
}

/** Force leaders of a hex in TERRAIN byte order (byte 3, byte 4). */
export function leadersAt(g: GameState, x: number, y: number): number[] {
  return inGrid(g, x, y) ? g.stacks[idx(g, x, y)] : [];
}

/** EURSUBS1.VALID_UNIT + FORCE_FLAG: `id` leads a force on the map. */
export function forceFlag(g: GameState, id: number): boolean {
  return g.units.has(id) && forceHex(g, id) >= 0;
}

/** The six neighbours in the original scan order (x ascending, then y ascending). */
export function neighbours(x: number, y: number): [number, number][] {
  const out: [number, number][] = [];
  for (let i = x - 1; i <= x + 1; i++) for (let j = y - 1; j <= y + 1; j++) if (hexDistance(x, y, i, j) === 1) out.push([i, j]);
  return out;
}

/** AISUBS.ARTY: heavy artillery (SYMBOL mod 10 = 4), or any artillery (also 5) with `alsoArtillery`. */
export function isArty(u: Pick<UnitState, 'symbol'>, alsoArtillery: boolean): boolean {
  const b = u.symbol % 10;
  return b === 4 || (alsoArtillery && b === 5);
}

/** AISUBS.TERRAIN_CHECK: terrain code in lo..hi. */
export function terrainCheck(g: GameState, x: number, y: number, lo: number, hi: number): boolean {
  const c = codeAt(g, x, y);
  return c >= lo && c <= hi;
}

/** The two TERRAIN_CHECK ranges the AI uses as "road hex" (HEXSTUFF.ROAD_HEX without the storm rule). */
export function roadCode(g: GameState, x: number, y: number): boolean {
  return terrainCheck(g, x, y, 0x0b, 0x57) || terrainCheck(g, x, y, 0x68, 0x7c);
}

/** AISUBS.TERRAIN_OK: land (code < 0xA5, mountains, cities, edge and Manchuria included). Its unit parameter is unused. */
export function terrainOk(g: GameState, x: number, y: number): boolean {
  return inGrid(g, x, y) && codeAt(g, x, y) < 0xa5;
}

/** MOVEUNIT.NEAR_THE_FRONT(x, y, PLAYER) with a positive player: a land neighbour held by PLAYER's enemy (possession = PLAYER). */
export function nearTheFront(g: GameState, x: number, y: number, player: Player): boolean {
  for (const [i, j] of neighbours(x, y)) {
    if (!onMap(g, i, j)) continue;
    if (codeAt(g, i, j) < 0xa5 && possAt(g, i, j) === player) return true;
  }
  return false;
}

// ---------- strengths (AISUBS ASSAULTING, OTHERS_ATTACKING, FRIEND_ADJACENT, STRONGER, SURROUNDED) ----------

/** AISUBS.ASSAULTING: attack strength (mode 1, L div 10 + S div 10) if force `id` plots an assault on (x, y), else 0. */
export function assaulting(g: GameState, id: number, x: number, y: number): number {
  if (!forceFlag(g, id)) return 0;
  const u = unit(g, id);
  if (u.move <= 100) return 0;
  const [dx, dy] = decodeDirection(Math.trunc(u.move / 100) % 10);
  if (u.x + dx !== x || u.y + dy !== y) return 0;
  const s = forceStrength(g, id, u.x, u.y, 1);
  return Math.trunc(s.L / 10) + Math.trunc(s.S / 10);
}

/** AISUBS.OTHERS_ATTACKING: another force of CORPS[corps] already plots an assault on (x, y). */
export function othersAttacking(g: GameState, id: number, x: number, y: number, corps: number): boolean {
  const c = g.corps[corps];
  if (!c) return false;
  let r = false;
  for (let k = c.from; k <= c.to; k++) if (k !== id && assaulting(g, k, x, y) > 0) r = true;
  return r;
}

/**
 * AISUBS.FRIEND_ADJACENT(C, X, Y): a neighbour of (X, Y) whose possession differs from it holds a force whose
 * FIRST leader belongs to corps C (1995 NKPA heavy artillery, SYMBOL 54, does not count). C < 0: any corps other
 * than |C| (C = 0 cannot express "other than NKPA": −0 is 0, as in the original).
 */
export function friendAdjacent(g: GameState, c: number, x: number, y: number): boolean {
  const p0 = possAt(g, x, y);
  let r = false;
  for (const [i, j] of neighbours(x, y)) {
    if (!onMap(g, i, j)) continue;
    const s = leadersAt(g, i, j);
    if (!s.length || possAt(g, i, j) === p0) continue;
    const lead = s[0];
    const lc = corpsOf(g, lead);
    if (lc === c && unit(g, lead).symbol !== 54) r = true;
    if (c < 0) for (let k = 0; k <= 4; k++) if (k !== Math.abs(c) && lc === k) r = true;
  }
  return r;
}

/**
 * AISUBS.STRONGER: the forces in the 13x13 box around (x, y) held by the force's side outweigh the others
 * (L div 100 + S div 100, mode 0). RND(1,5) is always drawn; the Communist side only looks when competence >= it.
 */
export function stronger(g: GameState, id: number, x: number, y: number): boolean {
  const side = id < g.firstUnUnit ? 1 : 2;
  let sum = 0;
  const roll = rnd(g, 1, 5);
  if (g.competence >= roll || side === 2) {
    for (let i = x - 6; i <= x + 6; i++) {
      for (let j = y - 6; j <= y + 6; j++) {
        if (!onMap(g, i, j)) continue;
        const p = possAt(g, i, j);
        if (p === 3) continue;
        for (const f of leadersAt(g, i, j)) {
          const s = forceStrength(g, f, i, j, 0);
          const v = Math.trunc(s.S / 100) + Math.trunc(s.L / 100);
          sum += p === 3 - side ? v : -v;
        }
      }
    }
  }
  return sum > 0;
}

/**
 * AISUBS.SURROUNDED: more than 11 − water div 2 of the hexes within 2 are held by another possession, or more than
 * 3 neighbours hold forces of another possession. Off-map cells count as neither (the original reads memory
 * outside the map there).
 */
export function surrounded(g: GameState, x: number, y: number): boolean {
  const p0 = possAt(g, x, y);
  let other = 0, enemyNb = 0, water = 0;
  for (let i = x - 2; i <= x + 2; i++) {
    for (let j = y - 3; j <= y + 3; j++) {
      const d = hexDistance(x, y, i, j);
      if (d < 3) {
        if (inGrid(g, i, j) && isWater(codeAt(g, i, j))) water++;
        else if (onMap(g, i, j) && possAt(g, i, j) !== 3 && possAt(g, i, j) !== p0) other++;
      }
      if (d === 1 && inGrid(g, i, j) && possAt(g, i, j) !== p0 && leadersAt(g, i, j).length > 0) enemyNb++;
    }
  }
  return other > 11 - Math.trunc(water / 2) || enemyNb > 3;
}

/**
 * AISUBS.WITHDRAW(D, var X, Y): an empty or own, not full neighbour in rows Y .. Y−D (RND(1,3) from the second
 * candidate on, the same column preferred); a hex of another possession gets spotting 1. Nothing moves here.
 * The FOR loop counts up, so D > 0 finds nothing: KIM passes +1 and its withdrawal never happens (WALTON passes −1).
 */
export function withdraw(g: GameState, d: number, x: number, y: number): [number, number] {
  let bx = x, by = y;
  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y; j <= y - d; j++) {
      if (!onMap(g, i, j) || hexDistance(x, y, i, j) !== 1) continue;
      const s = leadersAt(g, i, j);
      if (!(s.length === 0 || possAt(g, i, j) === possAt(g, x, y))) continue;
      if (s.length >= 2) continue;
      if (bx === x && by === y) { bx = i; by = j; }
      else if (rnd(g, 1, 3) === 1) { bx = i; by = j; }
      else if (i === x) { bx = i; by = j; }
    }
  }
  if (inGrid(g, bx, by) && possAt(g, bx, by) !== possAt(g, x, y)) g.spotted[idx(g, bx, by)] = 1;
  return [bx, by];
}

// ---------- orders written directly (PLOT_ATTACK, CLEAR_PLOTS, UPDATE_FORCE_STATE, stacks) ----------

/** AISUBS.PLOT_ATTACK: MOVE += (3dy + dx + 5)*100 + 6 for every unit of the force. No checks (the caller makes them). */
export function plotAttack(g: GameState, id: number, fx: number, fy: number, tx: number, ty: number) {
  const code = (3 * (ty - fy) + (tx - fx) + 5) * 100 + 6;
  for (const u of forceUnits(g, id)) {
    u.move += code;
    u.status = (u.status | STATUS_MOVED) & ~STATUS_READY;
  }
}

/**
 * MOVEUNIT.CLEAR_PLOTS with its computer branch: the plot digits go and 5 points come back; a unit of the computer
 * side that ends at MOVE 1 gets MOVE 0, STATUS 0x40 (dug in) and loses "moved" (its cancelled assault costs nothing).
 */
export function clearPlotsFull(g: GameState, id: number) {
  const side = id < g.firstUnUnit ? 1 : 2;
  for (const u of forceUnits(g, id)) {
    for (const p of [1000, 100]) {
      if (u.move <= p) continue;
      u.move += -Math.trunc(u.move / p) * p - 5;
      if (u.move === 1 && g.computerSide === side) {
        u.status = (u.status | STATUS_READY) & ~STATUS_MOVED;
        u.move = 0;
      }
    }
  }
}

/**
 * AISUBS.UPDATE_FORCE_STATE: one step of the whole force. MOVE += cost (each unit clamped 0..its rate), readiness
 * −(cost − 1) for cost >= 2 (MOVE_UNIT takes the full cost), "moved", not dug in. A negative cost (TELEPORT) means
 * "use all points, no readiness loss".
 */
export function updateForceState(g: GameState, id: number, x: number, y: number, cost: number) {
  let c = cost, loss = cost;
  if (c < 0) { loss = 0; c = -c; }
  if (loss > 1) loss--;
  for (const u of forceUnits(g, id)) {
    u.x = x; u.y = y;
    u.move = Math.max(0, Math.min(nationalMovementRate(g, u), u.move + c));
    u.readiness -= loss;
    u.status = (u.status | STATUS_MOVED) & ~STATUS_READY;
  }
}

/** Take a force leader out of its hex (TERRAIN byte 3 takes byte 4's force when byte 3 leaves). */
export function leaveHex(g: GameState, id: number, x: number, y: number) {
  if (!inGrid(g, x, y)) return;
  const s = g.stacks[idx(g, x, y)];
  const k = s.indexOf(id);
  if (k >= 0) s.splice(k, 1);
}

/** Put a force leader into a hex: byte 3 if free, else byte 4 (the original overwrites byte 4 without a check). */
export function enterHex(g: GameState, id: number, x: number, y: number) {
  const s = g.stacks[idx(g, x, y)];
  if (s.length >= 2) s[1] = id;
  else s.push(id);
}

/**
 * REPORTS.SORT_FORCE(x, y, slot): the force's units are re-chained infantry first (branch 2, not nationality 3),
 * the others after them, each group in the old order; the first infantry unit becomes the leader. If any unit had
 * moved, all of them are marked as moved.
 */
export function sortForce(g: GameState, x: number, y: number, slot: number) {
  const s = g.stacks[idx(g, x, y)];
  const lead = s[slot];
  if (!lead || unit(g, lead).attached <= 0) return;
  const arr: number[] = [];
  let moved = false;
  for (let id = lead; id > 0 && arr.length < 6; id = unit(g, id).attached) {
    arr.push(id);
    if (unit(g, id).status & STATUS_MOVED) moved = true;
  }
  for (const id of arr) {
    const u = unit(g, id);
    u.attached = 0;
    if (moved) u.status |= STATUS_MOVED;
  }
  let first = 0, prev = 0;
  for (let k = 0; k < arr.length; k++) {
    const u = unit(g, arr[k]);
    if (u.symbol % 10 !== 2 || Math.trunc(u.symbol / 10) === 3) continue;
    if (!first) first = arr[k];
    else unit(g, prev).attached = arr[k];
    prev = arr[k];
    arr[k] = 0;
  }
  if (!prev) { first = arr[0]; prev = arr[0]; arr[0] = 0; }
  for (const id of arr) {
    if (!id) continue;
    unit(g, prev).attached = id;
    prev = id;
  }
  s[slot] = first;
}

/** WARRIORS 0000: append force `id` to the other force of its hex (WALTON's scripted merges). */
export function mergeIntoStackmate(g: GameState, id: number) {
  if (!forceFlag(g, id)) return;
  const u = unit(g, id);
  const s = g.stacks[idx(g, u.x, u.y)];
  if (s.length < 2) return;
  s.splice(s.indexOf(id), 1);
  let j = s[0];
  while (unit(g, j).attached !== 0) j = unit(g, j).attached;
  unit(g, j).attached = id;
}

/** AISUBS.TELEPORT (WALTON only): put a force anywhere at once; possession by the id's side unless water, MOVE = rate. */
export function teleport(g: GameState, id: number, x: number, y: number) {
  if (!forceFlag(g, id)) return;
  const u = unit(g, id);
  if (u.x === x && u.y === y) return;
  enterHex(g, id, x, y);
  if (!isWater(codeAt(g, x, y))) g.possession[idx(g, x, y)] = id < g.firstUnUnit ? 2 : 1;
  leaveHex(g, id, u.x, u.y);
  updateForceState(g, id, x, y, -nationalMovementRate(g, u));
}

// ---------- movement (MOVE_COST as the AI calls it, MOVE_TO_OBJECTIVE) ----------

export interface AiStepCost { cost: number; overran: boolean; }

/**
 * MOVEUNIT.MOVE_COST(target, from, unit, no air / sea / rail) for the computer's movers: an impossible step costs
 * rate + 1. An enemy-occupied target that the force could still afford, entered from land, rolls OVERRUN for real:
 * success buries the defenders and costs the terrain (+1 while points are left), failure costs 100.
 */
export function aiMoveCost(g: GameState, id: number, fx: number, fy: number, tx: number, ty: number): AiStepCost {
  const lead = unit(g, id);
  const rate = nationalMovementRate(g, lead);
  const sc = stepCost(g, id, fx, fy, tx, ty, 'tactical');
  if (sc.blocked === 'enemy') {
    if (lead.move + sc.cost < rate + 1 && codeAt(g, fx, fy) < 0xdb && rollOverrun(g, id, fx, fy, tx, ty)) {
      return { cost: lead.move + sc.cost < rate ? sc.cost + 1 : sc.cost, overran: true };
    }
    return { cost: 100, overran: false };
  }
  if (sc.blocked) return { cost: rate + 1, overran: false };
  return { cost: sc.cost, overran: false };
}

/** MOVE_TO_OBJECTIVE nested 0835: 1950s forces stack only within their army; ROK forces not at all before turn 8. */
function stackBlocked(g: GameState, id: number, x: number, y: number): boolean {
  const s = leadersAt(g, x, y);
  let r = false;
  if (s.length > 0 && g.scenarioNo < 4 && corpsOf(g, s[0]) !== corpsOf(g, id)) r = true;
  if (g.turn < 8 && g.scenarioNo < 4 && Math.trunc(unit(g, id).symbol / 10) === 4 && s.length > 0) r = true;
  return r;
}

/**
 * AISUBS.MOVE_TO_OBJECTIVE(PLAYER, unit, TX, TY): walk the force hex by hex toward (TX, TY), always to the cheapest
 * neighbour that is strictly closer (ties go to open/road/rail/river codes 0x47..0x57), until its points are gone,
 * nothing is closer or it arrives. Artillery keeps off the front line. Returns the number of steps taken.
 */
export function moveToObjective(g: GameState, player: Player, id: number, tx: number, ty: number): number {
  const own = player === 2 ? 1 : 2;
  const lead = unit(g, id);
  let steps = 0;
  let go = true;
  while (nationalMovementRate(g, lead) > lead.move && go) {
    // nested 090F: the next hex
    let overran = false;
    let nx = lead.x, ny = lead.y, best = 99;
    const art = isArty(lead, true);
    const here = hexDistance(lead.x, lead.y, tx, ty);
    for (let i = lead.x - 1; i <= lead.x + 1; i++) {
      for (let j = lead.y - 2; j <= lead.y + 2; j++) {
        if (!onMap(g, i, j) || overran) continue;
        if (hexDistance(lead.x, lead.y, i, j) !== 1) continue;
        if (!(hexDistance(i, j, tx, ty) < here)) continue;
        const st = aiMoveCost(g, id, lead.x, lead.y, i, j);
        if (st.overran) { overran = true; nx = i; ny = j; continue; }
        const code = codeAt(g, i, j);
        if (st.cost < best || (st.cost === best && code >= 0x47 && code <= 0x57)) {
          if (art && (enemyAdjacent(g, i, j) || nearTheFront(g, i, j, player))) continue;
          if (stackBlocked(g, id, i, j)) continue;
          best = st.cost; nx = i; ny = j;
        }
      }
    }
    if (tx === lead.x && ty === lead.y) go = false;
    if (nx === lead.x && ny === lead.y) go = false;
    // nested 0B39: the cost is asked again (always), the step must fit unless it overran
    const again = aiMoveCost(g, id, lead.x, lead.y, nx, ny);
    if (lead.move + again.cost > nationalMovementRate(g, lead) && !overran && !again.overran) go = false;
    else if (go) {
      leaveHex(g, id, lead.x, lead.y);
      updateForceState(g, id, nx, ny, again.cost);
      enterHex(g, id, nx, ny);
      const ni = idx(g, nx, ny);
      if (g.possession[ni] !== own || enemyAdjacent(g, nx, ny)) g.spotted[ni] = Math.min(255, g.spotted[ni] + 1);
      g.possession[ni] = own;
      steps++;
    }
  }
  return steps;
}

// ---------- the invasion routes (AISUBS.ROUTE, filled by the WARRIORS unit initialisation 5E4A) ----------

type Pt = readonly [number, number];

/** ROUTE[0]: west, Sinuiju - P'yongyang - Seoul - Suwon - Taejon - Kwangju - south coast - Pusan (71 points). */
const ROUTE_WEST: Pt[] = [
  [0, 22], [0, 23], [1, 24], [2, 23], [3, 24], [4, 23], [5, 24], [6, 24], [6, 25], [6, 26], [6, 27], [7, 28], [7, 29], [7, 30],
  [7, 31], [7, 32], [8, 32], [9, 33], [10, 33], [10, 34], [11, 35], [11, 36], [11, 37], [12, 36], [12, 35], [13, 35], [14, 34],
  [15, 35], [15, 36], [15, 37], [15, 38], [15, 39], [15, 40], [14, 40], [14, 41], [14, 42], [15, 43], [15, 44], [15, 45], [15, 46],
  [16, 46], [16, 47], [16, 48], [17, 49], [17, 50], [16, 50], [16, 51], [15, 52], [14, 52], [14, 53], [14, 54], [13, 55], [13, 56],
  [12, 56], [12, 57], [12, 58], [13, 59], [14, 58], [14, 59], [15, 60], [16, 60], [17, 61], [18, 60], [19, 60], [20, 59], [21, 59],
  [22, 59], [23, 59], [24, 59], [25, 60], [26, 59],
];
/** ROUTE[1]: east, Unggi - Ch'ongjin - Hamhung - Wonsan - over the Taebaek ridge - east coast - P'ohang - Pusan (72 points). */
const ROUTE_EAST: Pt[] = [
  [33, 6], [32, 6], [31, 7], [31, 8], [30, 8], [30, 9], [29, 10], [28, 10], [28, 11], [28, 12], [29, 13], [29, 14], [29, 15],
  [28, 15], [27, 16], [26, 16], [25, 17], [25, 18], [25, 19], [25, 20], [24, 20], [23, 21], [22, 21], [21, 22], [20, 22], [19, 23],
  [18, 23], [17, 24], [16, 24], [16, 25], [16, 26], [15, 27], [15, 28], [16, 28], [16, 29], [16, 30], [17, 31], [17, 32], [18, 32],
  [18, 33], [19, 34], [20, 34], [21, 35], [22, 35], [22, 36], [23, 37], [23, 38], [24, 38], [24, 39], [25, 40], [25, 41], [26, 41],
  [26, 42], [27, 43], [27, 44], [27, 45], [28, 45], [28, 46], [28, 47], [28, 48], [28, 49], [28, 50], [27, 51], [27, 52], [27, 53],
  [27, 54], [27, 55], [27, 56], [27, 57], [26, 57], [26, 58], [26, 59],
];

const ROUTE_LEN = 72;
const pad = (r: Pt[]): Pt[] => [...r, ...Array.from({ length: ROUTE_LEN - r.length }, () => [0, 0] as Pt)];
const R0 = pad(ROUTE_WEST);
const R1 = pad(ROUTE_EAST);
/** ROUTE[0..3]: the Communist routes (north to south) and, for the UN, the same routes reversed (ROUTE[k+2][j] = ROUTE[k][71−j]). */
export const ROUTES: readonly (readonly Pt[])[] = [R0, R1, R0.slice().reverse(), R1.slice().reverse()];
/** WARRIORS 0605: no route. */
export const NO_ROUTE = 99;

/**
 * Point i of route k. The original reads one point past the end of a row into the next row (route 1 ends on
 * route 2's (0,0); route 2's Sinuiju continues to route 3's Pusan). Past route 3 it reads other memory; the remake
 * treats that as the end (a UN force at Unggi only).
 */
export function routePoint(k: number, i: number): Pt {
  if (i < ROUTE_LEN) return ROUTES[k][i];
  if (i === ROUTE_LEN && k < 3) return ROUTES[k + 1][0];
  return [0, 0];
}

/** WARRIORS 054F: the force stands on route k at a point that has a next one. */
function onRoute(u: UnitState, k: number): boolean {
  let found = false;
  for (let i = 0; i < ROUTE_LEN; i++) {
    const p = ROUTES[k][i];
    if (p[0] !== u.x || p[1] !== u.y) continue;
    const n = routePoint(k, i + 1);
    if (n[0] !== 0 || n[1] !== 0) found = true;
  }
  return found;
}

/** WARRIORS 0605: the route the force stands on (Communist 0/1, the first that matches; UN 2/3, the last), or 99. */
export function routeOf(g: GameState, id: number): number {
  const u = unit(g, id);
  const un = id >= g.firstUnUnit;
  const lo = un ? 2 : 0;
  let best = NO_ROUTE;
  for (let k = lo; k <= lo + 1; k++) if ((best === NO_ROUTE || un) && onRoute(u, k)) best = k;
  return best;
}

/** WARRIORS 0278 nested 011D: stop before this step (artillery behind the line; the UN north of row 38 while Seoul is Communist). */
function routeStop(g: GameState, id: number, nx: number, ny: number): boolean {
  let stop = false;
  if (isArty(unit(g, id), true)) {
    const s = leadersAt(g, nx, ny);
    if (s.length > 0 && !isArty(unit(g, s[0]), true)) stop = true;
    if (enemyAdjacent(g, nx, ny)) stop = true;
  }
  if (id >= 187 && possAt(g, 14, 40) === 2 && ny < 38) stop = true;
  return stop;
}

/**
 * WARRIORS 0278: the road march along route k while the next step fits the force's points. Each hex entered takes
 * the possession of the hex left (spotting 1 if that changes it). Returns the number of steps.
 */
export function followRoute(g: GameState, id: number, k: number): number {
  const p = unit(g, id);
  let nxt = -1;
  let nx = 0, ny = 0;
  for (let i = 0; i < ROUTE_LEN; i++) {
    const pt = ROUTES[k][i];
    if (pt[0] === p.x && pt[1] === p.y) { nxt = i + 1; [nx, ny] = routePoint(k, nxt); }
  }
  if (nxt < 0) return 0;
  let steps = 0;
  for (;;) {
    // nested 01DD: MOVE_COST (may roll OVERRUN), the leader's points
    const st = aiMoveCost(g, id, p.x, p.y, nx, ny);
    if (!(p.move + st.cost <= nationalMovementRate(g, p) && ny !== 0)) break;
    if (routeStop(g, id, nx, ny)) break;
    const from = idx(g, p.x, p.y);
    leaveHex(g, id, p.x, p.y);
    const own = g.possession[from];
    updateForceState(g, id, nx, ny, st.cost);
    enterHex(g, id, nx, ny);
    const ni = idx(g, nx, ny);
    if (g.possession[ni] !== own) g.spotted[ni] = 1;
    g.possession[ni] = own;
    steps++;
    nxt++;
    [nx, ny] = routePoint(k, nxt);
  }
  return steps;
}
