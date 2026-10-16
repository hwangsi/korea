// Ground combat, reproduced from the original code (docs/rules/combat.md). Pure logic (no DOM).
//
//   unitStrength / forceStrength   EURSUBS1.GET_STRENGTH / GET_FORCE_STRENGTH (modes 0-4)
//   overrunCheck / assault         MOVE_COST enemy branch + MOVEUNIT.OVERRUN + the assault plot (MOVE += d*100 + 6)
//   cancelAssault                  MOVEUNIT.CLEAR_PLOTS (refunds the 5 reserved points, 1 MP stays spent)
//   resolveGroundCombat            GRCMBT.DO_GROUND_COMBAT (armies in turn, support, loss ratios, losses,
//                                  elimination, retreat, bug-out)

import { neighbor } from './hex.ts';
import type { GameState, Side, UnitState } from './state.ts';
import {
  POSSESSION_CODE, STATUS_MOVED, STATUS_READY, idx, onMap, unit, sideOf, enemyOf, forceUnits, forceHex, corpsOf,
  isStorm, rnd,
} from './state.ts';
import {
  nationalMovementRate, stepCost, stepAllowed, clearPlots, usedMove, plottedAssault, frozen, oceanAdjacent,
  bugOutUnit, unitAttrition, sideMask,
} from './movement.ts';
import type { StepCost } from './movement.ts';

/** Strength modes of GET_STRENGTH. 0 plain, 1 attacker, 2 defender, 3 authorised (full) strength, 4 overrun attacker. */
export type StrengthMode = 0 | 1 | 2 | 3 | 4;

export interface Strength { L: number; S: number; }

export const STATUS_RETREATED = 0x02;
export const STATUS_BURIED = 0x08;
const SOFT_TYPES = new Set([12, 13]); // Rifle Platoon, Weapons Platoon (Appendix B: everything else is hard)
const MEDIUM_TANK = 2;

const isClosed = (c: number) => (c >= 0x58 && c <= 0x8e) || c === 0x92;
const isRiverCode = (c: number) =>
  (c >= 0x01 && c <= 0x0f) || (c >= 0x47 && c <= 0x57) || (c >= 0x59 && c <= 0x6f) || (c >= 0x8c && c <= 0x8e) || (c >= 0x9d && c <= 0x9e);
const isArtillery = (u: UnitState) => u.symbol % 10 >= 4;
const isHeavyArtillery = (u: UnitState) => u.symbol % 10 === 4;

function codeAt(g: GameState, x: number, y: number): number {
  return x >= 0 && y >= 0 && x < g.width && y < g.height ? g.hexes[idx(g, x, y)].code : 0;
}

/** EURSUBS1.GET_STRENGTH for one unit standing (or assumed to stand) in hex x, y. */
export function unitStrength(g: GameState, u: UnitState, x: number, y: number, mode: StrengthMode): Strength {
  const code = codeAt(g, x, y);
  let soft = 2, hard = 2; // multipliers in halves
  if (mode === 2 || mode === 4) {
    if (code === 0x93) { soft = 6; hard = 4; }
    else if (isClosed(code)) { soft = 4; hard = code === 0x92 ? 1 : 2; }
  }
  let L = 0, S = 0;
  for (const e of u.equipment) {
    const n = mode === 3 ? e.authorized : e.assigned;
    if (n <= 0) continue;
    const t = g.equipmentTypes.get(e.type);
    if (!t) continue;
    const r = mode === 3 ? 100 : u.readiness;
    const l = Math.trunc((n * t.lethality * r) / 100);
    const s = Math.trunc((n * t.survivability * r) / 100);
    L += l;
    S += Math.trunc((s * (SOFT_TYPES.has(e.type) ? soft : hard)) / 2);
    if (mode === 4 && g.scenarioNo < 4 && (code <= 0x57 || code >= 0x95) && e.type === MEDIUM_TANK) {
      L += 5 * l; // overrun tank bonus: lethality x6, survivability x4 (open-family hexes, 1950s)
      S += 3 * s;
    }
  }
  if (g.scenarioNo === 4 && u.symbol === 53 && g.turn < 4) L *= 4 - g.turn; // 1995 commandos
  S += Math.trunc(S / 4) * (u.experience - 1);
  L += Math.trunc(L / 4) * (u.experience - 1);
  const loneCommando = g.scenarioNo === 4 && u.symbol === 53 && u.attached === 0;
  if (mode === 1 && !isArtillery(u) && !loneCommando && !frozen(g, x, y) && isRiverCode(code)) L = Math.trunc(L / 2);
  if (mode === 2 && u.status & STATUS_READY) {
    L = Math.trunc((5 * L) / 3); // entrenched: x1.667 (manual 1.65)
    S = Math.trunc((5 * S) / 2);
  }
  if (sideOf(u) === 'communist') {
    S += Math.trunc(S / 10) * (g.competence - 3);
    L += Math.trunc(L / 10) * (g.competence - 3);
  }
  return { L, S };
}

/** EURSUBS1.GET_FORCE_STRENGTH: every unit of the force, evaluated in the same hex. */
export function forceStrength(g: GameState, leader: number, x: number, y: number, mode: StrengthMode): Strength {
  const out = { L: 0, S: 0 };
  for (const u of forceUnits(g, leader)) {
    const s = unitStrength(g, u, x, y, mode);
    out.L += s.L;
    out.S += s.S;
  }
  return out;
}

// ---------- overrun (MOVEUNIT.OVERRUN) ----------

export interface OverrunCheck {
  /** Strength ratios: aL div dS (> 95 needed) and dL div aS (< 2 needed). */
  r1: number;
  r2: number;
  strongEnough: boolean;
  /** At least 6 movement points left (raw MOVE of the leader). */
  enoughMove: boolean;
  /** strongEnough and enoughMove: the 50% roll decides. */
  possible: boolean;
}

export function overrunCheck(
  g: GameState, leader: number, sx: number, sy: number, tx: number, ty: number, leaderMove = unit(g, leader).move,
): OverrunCheck {
  let dL = 0, dS = 0;
  for (const d of g.stacks[idx(g, tx, ty)]) {
    const s = forceStrength(g, d, tx, ty, 2);
    dL += Math.trunc(s.L / 5);
    dS += Math.trunc(s.S / 50);
    if (isArtillery(unit(g, d))) { dL = Math.trunc(dL / 4); dS = Math.trunc(dS / 4); } // running totals, as coded
  }
  if (dS === 0) dS = 1;
  const a = forceStrength(g, leader, sx, sy, 4);
  const aL = Math.trunc(a.L / 5);
  const aS = Math.max(1, Math.trunc(a.S / 50));
  const r1 = Math.trunc(aL / dS);
  const r2 = Math.trunc(dL / aS);
  const lead = unit(g, leader);
  const strongEnough = r1 > 95 && r2 < 2;
  const enoughMove = nationalMovementRate(g, lead) - leaderMove >= 6;
  return { r1, r2, strongEnough, enoughMove, possible: strongEnough && enoughMove };
}

/** EURSUBS1.BURY: remove a unit from play; half its equipment goes to the recovered-equipment pool. */
export function bury(g: GameState, v: UnitState) {
  for (const other of g.units.values()) if (other.attached === v.id) other.attached = v.attached;
  const pool = g.replacements[v.nation];
  for (const e of v.equipment) {
    if (pool && pool[e.type - 1]) {
      const p = pool[e.type - 1];
      p[1] = p[1] + e.assigned > 255 ? 255 : p[1] + Math.trunc(e.assigned / 2);
    }
    e.assigned = 0;
  }
  v.x = 1; v.y = 0; v.attached = 0; v.readiness = 50; v.experience = 1; v.move = 0; v.status = STATUS_BURIED;
}

/** GRCMBT.ELIMINATE_UNIT: the next unit of the force takes over as leader. */
export function eliminateUnit(g: GameState, v: UnitState) {
  if (onMap(g, v.x, v.y)) {
    const s = g.stacks[idx(g, v.x, v.y)];
    const k = s.indexOf(v.id);
    if (k >= 0) {
      if (v.attached > 0) s[k] = v.attached;
      else s.splice(k, 1);
    }
  }
  bury(g, v);
}

/** GRCMBT.CHECK_ELIM: units whose raw survivability fell below 10 (displayed 1) are eliminated. */
export function checkElim(g: GameState, leader: number): number[] {
  const gone: number[] = [];
  for (const v of forceUnits(g, leader)) {
    if (unitStrength(g, v, 0, 0, 0).S < 10) { eliminateUnit(g, v); gone.push(v.id); }
  }
  return gone;
}

// ---------- assault orders (movement side) ----------

/** Direction code stored in MOVE's hundreds digit: 3*dy + dx + 5 (rectangular offset, 1..9). */
export function directionCode(sx: number, sy: number, tx: number, ty: number): number {
  return 3 * (ty - sy) + (tx - sx) + 5;
}

export function decodeDirection(code: number): [number, number] {
  return [((code - 1) % 3) - 1, Math.trunc((code - 1) / 3) - 1];
}

/** Target hex of a force's plotted assault, or null. */
export function assaultTarget(g: GameState, leader: number): [number, number] | null {
  const lead = unit(g, leader);
  const code = plottedAssault(lead.move);
  if (!code) return null;
  const [dx, dy] = decodeDirection(code);
  return [lead.x + dx, lead.y + dy];
}

export type AssaultBlock = 'notOnMap' | 'notAdjacent' | 'notEnemy' | 'blocked' | 'needSixPoints' | 'phase';

export interface AssaultOutcome {
  ok: boolean;
  error?: AssaultBlock | string;
  /** 'overrun': defenders destroyed and the force moved in; 'plotted': assault order for the combat phase;
   *  'stopped': Second Orders Phase, movement ended. */
  result?: 'overrun' | 'plotted' | 'stopped';
  cost?: number;
}

/** What clicking an adjacent enemy hex would do (no randomness, no side effects). */
export interface AssaultPreview {
  allowed: boolean;
  error?: AssaultBlock | string;
  step: StepCost | null;
  overrun: OverrunCheck | null;
  /** The overrun roll can only happen while the terrain cost is still affordable. */
  overrunRollPossible: boolean;
  estimate: CombatEstimate | null;
}

function remaining(g: GameState, u: UnitState): number {
  return nationalMovementRate(g, u) - usedMove(u.move);
}

export function assaultPreview(g: GameState, leader: number, tx: number, ty: number): AssaultPreview {
  const at = forceHex(g, leader);
  const none = (error: AssaultBlock | string): AssaultPreview => ({ allowed: false, error, step: null, overrun: null, overrunRollPossible: false, estimate: null });
  if (at < 0) return none('notOnMap');
  const sx = at % g.width, sy = Math.floor(at / g.width);
  if (!sideMask(sx, sy, tx, ty)) return none('notAdjacent');
  const sc = stepCost(g, leader, sx, sy, tx, ty, 'tactical');
  if (sc.blocked !== 'enemy') return none(sc.blocked ? 'blocked' : 'notEnemy');
  const lead = unit(g, leader);
  const rate = nationalMovementRate(g, lead);
  const move = usedMove(clearPlots(lead.move));
  const overrunRollPossible = move + sc.cost < rate + 1 && g.hexes[at].code < 0xdb;
  const ov = overrunRollPossible ? overrunCheck(g, leader, sx, sy, tx, ty, clearPlots(lead.move)) : null;
  const units = forceUnits(g, leader);
  const sixOk = units.every((u) => nationalMovementRate(g, u) - usedMove(clearPlots(u.move)) >= 6);
  const estimate = estimateCombat(g, leader, tx, ty);
  if (g.phase === 3) return { allowed: true, step: sc, overrun: ov, overrunRollPossible, estimate };
  if (!sixOk && !(ov && ov.possible)) return { allowed: false, error: 'needSixPoints', step: sc, overrun: ov, overrunRollPossible, estimate };
  return { allowed: true, step: sc, overrun: ov, overrunRollPossible, estimate };
}

/**
 * Order a force into an adjacent enemy hex: MOVE_COST's enemy branch (overrun roll) followed by the
 * step code (move in) or the assault plot. Not undoable (random roll).
 */
export function assault(g: GameState, leader: number, tx: number, ty: number): AssaultOutcome {
  const pv = assaultPreview(g, leader, tx, ty);
  if (!pv.allowed || !pv.step) return { ok: false, error: pv.error };
  const at = forceHex(g, leader);
  const sx = at % g.width, sy = Math.floor(at / g.width);
  const lead = unit(g, leader);
  const side = sideOf(lead);
  const rate = nationalMovementRate(g, lead);
  const members = forceUnits(g, leader);
  for (const u of members) u.move = clearPlots(u.move); // movement start clears plots (CLEAR_PLOTS)
  let cost = pv.step.cost;
  let overran = false;
  if (pv.overrunRollPossible) {
    // MOVEUNIT.OVERRUN(unit, sx, sy, tx, ty, 2, ...)
    const ov = overrunCheck(g, leader, sx, sy, tx, ty);
    if (ov.strongEnough && rnd(g, 1, 2) === 1 && ov.enoughMove) {
      unitAttrition(g, lead, ov.r2);
      const ti = idx(g, tx, ty);
      for (const d of g.stacks[ti].slice()) for (const v of forceUnits(g, d)) bury(g, v);
      g.stacks[ti] = [];
      overran = true;
      if (lead.move + cost < rate) cost++;
    }
  }
  g.undo = null;
  if (overran) {
    // normal step: allowance, readiness, stacks, possession
    const moved = (lead.status & STATUS_MOVED) !== 0;
    if (!stepAllowed(lead.move, cost, rate, moved)) return { ok: false, error: 'allowance' };
    lead.move = Math.max(0, Math.min(rate, cost < rate ? lead.move + cost : rate));
    const from = g.stacks[at];
    from.splice(from.indexOf(leader), 1);
    const ti = idx(g, tx, ty);
    g.stacks[ti].push(leader);
    if (g.possession[ti] === POSSESSION_CODE[enemyOf(side)]) {
      g.spotted[ti] = 1;
      for (const af of g.airfields) if (af.x === tx && af.y === ty) af.current = side === 'communist' ? 0 : 1;
    }
    g.possession[ti] = POSSESSION_CODE[side];
    for (const u of members) {
      u.x = tx; u.y = ty; u.move = lead.move;
      if (cost < rate + 1) u.readiness -= cost;
      u.status = (u.status | STATUS_MOVED) & ~STATUS_READY;
    }
    g.version++;
    return { ok: true, result: 'overrun', cost };
  }
  if (g.phase === 3 && g.computerSide !== (side === 'communist' ? 1 : 2)) {
    // Second Orders Phase: no assault orders, the move simply ends
    for (const u of members) { u.move = nationalMovementRate(g, u); u.status = (u.status | STATUS_MOVED) & ~STATUS_READY; }
    g.version++;
    return { ok: true, result: 'stopped' };
  }
  if (!members.every((u) => remaining(g, u) >= 6)) { g.version++; return { ok: false, error: 'needSixPoints' }; }
  const d = directionCode(sx, sy, tx, ty);
  for (const u of members) {
    u.move += d * 100 + 6; // 5 reserved (refunded on cancel) + 1 for the assault
    u.status = (u.status | STATUS_MOVED) & ~STATUS_READY;
  }
  g.version++;
  return { ok: true, result: 'plotted' };
}

/** Cancel a plotted assault (MOVEUNIT.CLEAR_PLOTS): the 5 reserved points come back, 1 point stays spent. */
export function cancelAssault(g: GameState, leader: number): boolean {
  if (!plottedAssault(unit(g, leader).move)) return false;
  for (const u of forceUnits(g, leader)) u.move = clearPlots(u.move);
  g.version++;
  return true;
}

// ---------- combat resolution (GRCMBT) ----------

/** Armies for command control: CORPS index 0 NKPA, 1 CPLA, 2 ROK, 3 other UN. */
export const ARMY_KO = ['북한군', '중공군', '국군', '유엔군'];

/** GRCMBT.NAVAL_GUNS: naval gunfire support by turn (UN side, targets next to deep ocean). */
export function navalGuns(g: GameState): number {
  if (g.scenarioNo === 4) return 0;
  let n = g.turn <= 4 ? 0 : g.turn <= 8 ? 50 : g.turn <= 20 ? 100 : 125;
  if (isStorm(g)) n = Math.trunc(n / 2);
  return n;
}

function hexDist(ax: number, ay: number, bx: number, by: number): number {
  // even-q offset -> cube distance (equals the original DIST)
  const toCube = (x: number, y: number) => { const q = x; const r = y - (x + (x & 1)) / 2; return [q, r, -q - r]; };
  const a = toCube(ax, ay), b = toCube(bx, by);
  return Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]), Math.abs(a[2] - b[2]));
}

/** Heavy artillery of a side within 1-2 hexes of the target (GRCMBT 0B39), any nationality. */
function supportingArtillery(g: GameState, side: Side, tx: number, ty: number): UnitState[] {
  const out: UnitState[] = [];
  for (const u of g.units.values()) {
    if (sideOf(u) !== side || !isHeavyArtillery(u) || !onMap(g, u.x, u.y) || u.status & STATUS_BURIED) continue;
    const d = hexDist(u.x, u.y, tx, ty);
    if (d >= 1 && d <= 2) out.push(u);
  }
  return out;
}

/** GRCMBT 0B39 (one call): lethality (mode 1) or survivability (mode 2) support. Costs 2 readiness per gun. */
function support(g: GameState, corps: number, tx: number, ty: number, what: 'L' | 'S', apply: boolean): number {
  const side: Side = corps < 2 ? 'communist' : 'un';
  let sum = 0;
  for (const a of supportingArtillery(g, side, tx, ty)) {
    const s = unitStrength(g, a, a.x, a.y, 2);
    sum += what === 'L' ? Math.trunc(s.L / 5) : Math.trunc(s.S / 50);
    if (apply) { a.readiness -= 2; g.spotted[idx(g, a.x, a.y)] = 1; }
  }
  const naval = navalGuns(g);
  if (corps >= 2 && naval > 0 && oceanAdjacent(g, tx, ty)) sum += what === 'L' ? naval : Math.trunc(naval / 10);
  return sum;
}

/** GRCMBT 0715: loss ratios (percent) from the combat sums. Integer steps, clamped to 1..100. */
export function lossRatios(g: GameState, aL: number, aS: number, dL: number, dS: number): [number, number] {
  const L = [0, aL, dL], S = [0, aS, dS], R = [0, 0, 0];
  for (const i of [1, 2]) {
    if (S[i] < 1) S[i] = 1;
    L[3 - i] = Math.trunc(L[3 - i] / 2);
    R[i] = Math.trunc((3 * L[3 - i]) / S[i]);
    if (g.scenarioNo === 4) R[i] = g.turn === 0 ? R[i] * 2 : Math.trunc((7 * R[i]) / 4);
    R[i] = Math.max(1, Math.min(100, R[i]));
  }
  return [R[1], R[2]];
}

export interface CombatEstimate {
  attackers: number[];
  defenders: number[];
  aL: number; aS: number; dL: number; dS: number;
  attackerLoss: number;
  defenderLoss: number;
  /** Percent chance that the defenders retreat (before their own losses decide anything else). */
  retreatChance: number;
  naval: number;
  artillery: { attacker: number; defender: number };
}

function plottedAgainst(g: GameState, corps: number, tx: number, ty: number): number[] {
  const out: number[] = [];
  g.stacks.forEach((s) => {
    for (const l of s) {
      if (corpsOf(g, l) !== corps) continue;
      const t = assaultTarget(g, l);
      if (t && t[0] === tx && t[1] === ty) out.push(l);
    }
  });
  return out;
}

/** Expected result if `leader` (plus forces of the same army already plotted there) assaulted tx, ty. */
export function estimateCombat(g: GameState, leader: number, tx: number, ty: number): CombatEstimate {
  const corps = corpsOf(g, leader);
  const attackers = plottedAgainst(g, corps, tx, ty);
  if (!attackers.includes(leader)) attackers.push(leader);
  const defenders = g.stacks[idx(g, tx, ty)].slice();
  let aL = 0, aS = 0, dL = 0, dS = 0;
  for (const a of attackers) {
    const u = unit(g, a);
    const s = forceStrength(g, a, u.x, u.y, 1);
    aL += Math.trunc(s.L / 5); aS += Math.trunc(s.S / 50);
  }
  const artA = support(g, corps, tx, ty, 'L', false);
  aL += artA; aS += support(g, corps, tx, ty, 'S', false);
  for (const d of defenders) {
    const s = forceStrength(g, d, tx, ty, 2);
    dL += Math.trunc(s.L / 5); dS += Math.trunc(s.S / 50);
  }
  const dCorps = defenders.length ? corpsOf(g, defenders[0]) : corps < 2 ? 2 : 0;
  const artD = support(g, dCorps, tx, ty, 'L', false);
  dL += artD; dS += support(g, dCorps, tx, ty, 'S', false);
  const [ra, rd] = lossRatios(g, aL, aS, dL, dS);
  const urban = codeAt(g, tx, ty) === 0x93 ? 2 : 1;
  const green = defenders.some((d) => unit(g, d).experience === 1) ? 20 : 0;
  const retreatChance = Math.max(0, Math.min(100, Math.trunc((2 * rd) / urban) + retreatBonus(g, defenders[0]) + green));
  const naval = corps >= 2 && oceanAdjacent(g, tx, ty) ? navalGuns(g) : 0;
  return { attackers, defenders, aL, aS, dL, dS, attackerLoss: ra, defenderLoss: rd, retreatChance, naval, artillery: { attacker: artA, defender: artD } };
}

function retreatBonus(g: GameState, defender: number | undefined): number {
  if (!defender || !g.computerSide) return 0;
  const comm = sideOf(unit(g, defender)) === 'communist';
  if (g.computerSide === 1) return comm ? -5 : 5;
  return comm ? 5 : -5;
}

// ----- events / reports -----

export type CombatEvent =
  | { kind: 'moveIn'; leader: number; to: [number, number] }
  | { kind: 'advance'; leader: number; to: [number, number] }
  | { kind: 'eliminated'; unit: number; name: string }
  | { kind: 'retreat'; leader: number; to: [number, number] }
  | { kind: 'blocked'; leader: number }
  | { kind: 'bugout'; unit: number; name: string }
  | { kind: 'expGain'; unit: number };

export interface CombatReport {
  army: number;
  target: [number, number];
  attackers: { leader: number; name: string }[];
  defenders: { leader: number; name: string }[];
  aL: number; aS: number; dL: number; dS: number;
  attackerLoss: number;
  defenderLoss: number;
  retreatChance: number;
  retreated: boolean;
  events: CombatEvent[];
  /** No combat: the target was empty or friendly, the force moved in. */
  moveIn?: boolean;
}

/** GRCMBT 015F: MOVE := MOVE mod 100, capped at the national rate (no refund of the 5 reserved points). */
function executePlot(g: GameState, leader: number) {
  for (const u of forceUnits(g, leader)) {
    u.move = u.move % 100;
    const rate = nationalMovementRate(g, u);
    if (u.move > rate) u.move = rate;
  }
}

function forceName(g: GameState, leader: number): string {
  const members = forceUnits(g, leader);
  const n = members[0].forceName.replace(/\+$/, '').trim();
  return members.length > 1 && n ? n : members[0].name;
}

function spotAround(g: GameState, x: number, y: number, own: number) {
  for (let dd = 0; dd < 6; dd++) {
    const [nx, ny] = neighbor(x, y, dd);
    if (!onMap(g, nx, ny)) continue;
    const ni = idx(g, nx, ny);
    if (g.possession[ni] && g.possession[ni] !== own) g.spotted[ni] = 2;
  }
}

/** Move a whole force into a hex (assault move-in / advance). */
function enterHex(g: GameState, leader: number, tx: number, ty: number) {
  const lead = unit(g, leader);
  const side = sideOf(lead);
  const from = forceHex(g, leader);
  if (from >= 0) g.stacks[from].splice(g.stacks[from].indexOf(leader), 1);
  const ti = idx(g, tx, ty);
  g.stacks[ti].push(leader);
  for (const u of forceUnits(g, leader)) { u.x = tx; u.y = ty; }
  if (g.possession[ti] === POSSESSION_CODE[enemyOf(side)]) {
    g.possession[ti] = POSSESSION_CODE[side];
    g.spotted[ti] = 1;
  }
  spotAround(g, tx, ty, POSSESSION_CODE[side]);
}

/** GRCMBT 0846: equipment losses, experience, readiness for every unit of a force. */
function applyLosses(g: GameState, leader: number, ratio: number, noExp: boolean, events: CombatEvent[]) {
  let bonus = 0;
  let expChance = 51;
  const side = sideOf(unit(g, leader));
  if (ratio < 100) {
    if (side === 'communist' && g.computerSide === 1) { bonus = Math.trunc(ratio / (13 - g.competence)); expChance = 61; }
    if (side === 'un' && g.computerSide === 2) { bonus = Math.trunc(ratio / 10); expChance = 61; }
  }
  const weather = g.temperature === 3 || isStorm(g) ? -5 : 0;
  for (const v of forceUnits(g, leader)) {
    for (const e of v.equipment) {
      const n = e.assigned;
      for (let k = 0; k < n; k++) if (rnd(g, 1, 100) <= ratio - bonus) e.assigned--;
    }
    if (v.experience < 3 && !noExp && rnd(g, 1, 100) < expChance) { v.experience++; events.push({ kind: 'expGain', unit: v.id }); }
    v.readiness = Math.max(50, Math.min(100, v.readiness - (ratio - bonus) + weather));
  }
}

function checkElimEvents(g: GameState, leader: number, events: CombatEvent[]) {
  const names = new Map(forceUnits(g, leader).map((u) => [u.id, u.name]));
  for (const id of checkElim(g, leader)) events.push({ kind: 'eliminated', unit: id, name: names.get(id) ?? '' });
}

/** GRCMBT 12D8 / 1129: hexes a defending force may retreat into. */
export function retreatHexes(g: GameState, leader: number): [number, number][] {
  const lead = unit(g, leader);
  const side = sideOf(lead);
  const own = POSSESSION_CODE[side];
  const { x, y } = lead;
  const scored: { n: [number, number]; s: number }[] = [];
  for (let dd = 0; dd < 6; dd++) {
    const [nx, ny] = neighbor(x, y, dd);
    let s = 98;
    if (!onMap(g, nx, ny)) s = 99;
    else {
      const ni = idx(g, nx, ny);
      if (g.possession[ni] !== own) {
        if (side === 'un') s = 99;
        else if (g.stacks[ni].length > 0) s = 99;
      }
      if (s < 99) {
        if (side === 'un' && ny > y) s = 0;
        if (side === 'communist' && ny < y) s = 0;
      }
      const code = g.hexes[ni].code;
      if (g.stacks[ni].length >= 2) s = 99;
      if (!frozen(g, nx, ny) && ((code >= 0x01 && code <= 0x0a) || (code >= 0x59 && code <= 0x66))) s = 99;
      if (code >= 0xa5 || code === 0x94) s = 99;
    }
    scored.push({ n: [nx, ny], s });
  }
  const best = scored.filter((c) => c.s === 0);
  return (best.length ? best : scored.filter((c) => c.s < 99)).map((c) => c.n);
}

/** GRCMBT 15D7: retreat one defending force, or take a second round of losses if it cannot. */
function retreat(g: GameState, leader: number, ratio: number, events: CombatEvent[]) {
  const lead = unit(g, leader);
  const side = sideOf(lead);
  const cands = retreatHexes(g, leader);
  if (cands.length) {
    const [nx, ny] = cands[rnd(g, 1, cands.length) - 1];
    for (const v of forceUnits(g, leader)) {
      v.move = nationalMovementRate(g, v);
      v.status = (v.status | STATUS_RETREATED) & ~STATUS_READY;
      if (v.experience === 1 && rnd(g, 1, 100) < ratio) { bugOutUnit(g, v); events.push({ kind: 'bugout', unit: v.id, name: v.name }); }
    }
    const from = forceHex(g, leader);
    if (from >= 0) g.stacks[from].splice(g.stacks[from].indexOf(leader), 1);
    const ni = idx(g, nx, ny);
    g.stacks[ni].push(leader);
    for (const v of forceUnits(g, leader)) { v.x = nx; v.y = ny; }
    g.spotted[ni] = 2;
    if (g.possession[ni] === POSSESSION_CODE.un && side === 'communist') g.possession[ni] = POSSESSION_CODE.communist;
    events.push({ kind: 'retreat', leader, to: [nx, ny] });
  } else {
    applyLosses(g, leader, ratio, true, events);
    for (const v of forceUnits(g, leader)) {
      v.move = nationalMovementRate(g, v);
      v.status = (v.status | STATUS_RETREATED) & ~STATUS_READY;
    }
    events.push({ kind: 'blocked', leader });
    checkElimEvents(g, leader, events);
  }
}

/** GRCMBT.DO_GROUND_COMBAT: execute every plotted assault, army by army. */
export function resolveGroundCombat(g: GameState): CombatReport[] {
  const reports: CombatReport[] = [];
  const order = rnd(g, 1, 10) <= 6 ? [2, 3, 0, 1] : [0, 1, 2, 3];
  for (const corps of order) {
    const range = g.corps[corps];
    if (!range || range.from <= 0) continue;
    const enemyCode = corps < 2 ? POSSESSION_CODE.un : POSSESSION_CODE.communist;
    const table: { leader: number; x: number; y: number; active: boolean }[] = [];
    for (let id = range.from; id <= range.to; id++) {
      const u = g.units.get(id);
      if (!u || forceHex(g, id) < 0 || u.move <= 100) continue;
      const [dx, dy] = decodeDirection(Math.trunc(u.move / 100) % 10);
      const tx = u.x + dx, ty = u.y + dy;
      let r = 3;
      if (tx >= 0 && ty >= 0 && tx < g.width && ty < g.height && u.symbol > 0) {
        const ti = idx(g, tx, ty);
        const s = g.stacks[ti];
        if (s.length === 0) r = 1;
        else if (g.possession[ti] !== enemyCode && s.length < 2) r = 1;
        else if (g.possession[ti] === enemyCode && s.length > 0) r = 2;
      }
      if (r === 1) {
        executePlot(g, id);
        enterHex(g, id, tx, ty);
        for (const v of forceUnits(g, id)) v.readiness -= 3;
        reports.push({
          army: corps, target: [tx, ty], attackers: [{ leader: id, name: forceName(g, id) }], defenders: [], aL: 0, aS: 0, dL: 0, dS: 0,
          attackerLoss: 0, defenderLoss: 0, retreatChance: 0, retreated: false, moveIn: true, events: [{ kind: 'moveIn', leader: id, to: [tx, ty] }],
        });
      } else if (r === 2) {
        table.push({ leader: id, x: tx, y: ty, active: true });
        for (const v of forceUnits(g, id)) v.readiness -= 3;
      } else executePlot(g, id);
    }

    for (let i = 0; i < table.length; i++) {
      const entry = table[i];
      if (!entry.active) continue;
      const { x, y } = entry;
      const ti = idx(g, x, y);
      const same = table.filter((e, j) => j >= i && e.active && e.x === x && e.y === y);
      if (g.stacks[ti].length === 0) {
        // target vacated: advance (original bug fixed: the other entries are retired too)
        const events: CombatEvent[] = [];
        for (const e of same) {
          e.active = false;
          executePlot(g, e.leader);
          if (unit(g, e.leader).readiness > rnd(g, 1, 100) && g.stacks[ti].length === 0) {
            enterHex(g, e.leader, x, y);
            events.push({ kind: 'advance', leader: e.leader, to: [x, y] });
          }
        }
        reports.push({
          army: corps, target: [x, y], attackers: same.map((e) => ({ leader: e.leader, name: forceName(g, e.leader) })), defenders: [],
          aL: 0, aS: 0, dL: 0, dS: 0, attackerLoss: 0, defenderLoss: 0, retreatChance: 0, retreated: false, moveIn: true, events,
        });
        continue;
      }
      const defenders = g.stacks[ti].slice();
      const report: CombatReport = {
        army: corps, target: [x, y],
        attackers: same.map((e) => ({ leader: e.leader, name: forceName(g, e.leader) })),
        defenders: defenders.map((d) => ({ leader: d, name: forceName(g, d) })),
        aL: 0, aS: 0, dL: 0, dS: 0, attackerLoss: 0, defenderLoss: 0, retreatChance: 0, retreated: false, events: [],
      };
      for (const e of same) executePlot(g, e.leader);
      // SHOW_SUPPORT: heavy artillery in range may gain experience
      const dCorps = corpsOf(g, defenders[0]);
      for (const c of [corps, dCorps]) {
        for (const a of supportingArtillery(g, c < 2 ? 'communist' : 'un', x, y)) if (a.experience < 3 && rnd(g, 1, 100) < 51) a.experience++;
      }
      // COMBAT 1F9D
      let aL = 0, aS = 0, dL = 0, dS = 0;
      for (const e of same) {
        e.active = false;
        for (const v of forceUnits(g, e.leader)) v.status = (v.status | 0x20) & ~0x10;
        const lead = unit(g, e.leader);
        const s = forceStrength(g, e.leader, lead.x, lead.y, 1);
        aL += Math.trunc(s.L / 5); aS += Math.trunc(s.S / 50);
      }
      aL += support(g, corps, x, y, 'L', true);
      aS += support(g, corps, x, y, 'S', true);
      for (const d of defenders) {
        for (const v of forceUnits(g, d)) v.status = (v.status | 0x20) & ~0x10;
        const s = forceStrength(g, d, x, y, 2);
        dL += Math.trunc(s.L / 5); dS += Math.trunc(s.S / 50);
      }
      dL += support(g, dCorps, x, y, 'L', true);
      dS += support(g, dCorps, x, y, 'S', true);
      const [ra, rd] = lossRatios(g, aL, aS, dL, dS);
      const urban = g.hexes[ti].code === 0x93 ? 2 : 1;
      const green = defenders.some((d) => unit(g, d).experience === 1) ? 20 : 0;
      const chance = Math.trunc((2 * rd) / urban) + retreatBonus(g, defenders[0]) + green;
      const retreated = chance >= rnd(g, 1, 100);
      Object.assign(report, { aL, aS, dL, dS, attackerLoss: ra, defenderLoss: rd, retreatChance: Math.max(0, Math.min(100, chance)), retreated });
      for (const e of same) {
        applyLosses(g, e.leader, ra, false, report.events);
        checkElimEvents(g, e.leader, report.events);
      }
      for (const d of defenders) {
        applyLosses(g, d, rd, retreated, report.events);
        checkElimEvents(g, d, report.events);
      }
      if (retreated) {
        // second force first (TERRAIN byte 4, then byte 3), as the original
        const still = g.stacks[ti].slice().reverse();
        for (const d of still) if (g.stacks[ti].includes(d)) retreat(g, d, rd, report.events);
      }
      reports.push(report);
    }
  }
  g.undo = null;
  g.version++;
  return reports;
}

/** Forces whose leader has an assault plotted, with their targets (for drawing arrows). */
export function plottedAssaults(g: GameState): { leader: number; from: [number, number]; to: [number, number] }[] {
  const out: { leader: number; from: [number, number]; to: [number, number] }[] = [];
  g.stacks.forEach((s, i) => {
    for (const l of s) {
      const t = assaultTarget(g, l);
      if (t) out.push({ leader: l, from: [i % g.width, Math.floor(i / g.width)], to: t });
    }
  });
  return out;
}

