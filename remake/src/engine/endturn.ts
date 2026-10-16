// General Resolution Phase procedures of module ENDTURN (docs/rules/turn.md 4). Pure logic (no DOM).
//
//   unspotEverything      UNSPOT_EVERYTHING
//   groundReinforcements  GROUND_REINFORCEMENTS (stockpile shipments, arrivals, replacement pools,
//                         equipment distribution, rebuilding destroyed units; nested 0228/0283/02FF/03ED/056F)
//   checkChina            CHECK_CHINA (CCF intervention decision)
//   mineWarfare           MINE_WARFARE
//   doPatrols             DO_PATROLS (ground patrols + guerrillas + P'yongyang/Hamhung reversion)
//   doIntel               DO_INTEL (nested HEX_INTEL)
//   checkBigHexes         CHECK_BIGHEXES (big-city news, nested CITY_NEWS)
//   terrainHeld           EURSUBS1.TERRAIN_HELD
//   territoryBalance      EURSUBS1.TERRITORY_BALANCE (victory level)
//   gameOverResult        ENDTURN.GAME_OVER (final news)

import type { Nation } from '../data/types.ts';
import { neighbor, hexDistance } from './hex.ts';
import type { GameState, Side, UnitState } from './state.ts';
import { idx, onMap, rnd, corpsOf, newsFlash } from './state.ts';
import { unitStrength, STATUS_BURIED } from './combat.ts';
import { enemyAdjacent, nationalMovementRate } from './movement.ts';
import { roadHex, COMMUNIST_SUPPLY_POINTS } from './supply.ts';

const NATIONS: Nation[] = ['US', 'USMC', 'CW', 'UN', 'ROK', 'NKPA', 'CPLA'];
const CITY = 0x93;
const STATUS_SUPPLIED = 0x01;

const codeAt = (g: GameState, x: number, y: number) => g.hexes[idx(g, x, y)].code;
const inGrid = (g: GameState, x: number, y: number) => x >= 0 && y >= 0 && x < g.width && y < g.height;
/** TERRAIN byte 3 / 4 (first / second force leader, 0 if none). */
const slot = (g: GameState, x: number, y: number, k: 0 | 1) => (inGrid(g, x, y) ? g.stacks[idx(g, x, y)][k] ?? 0 : 0);

// ---------- territory ----------

export interface Held { cities: Record<Side, number>; hexes: Record<Side, number>; }

/** EURSUBS1.TERRAIN_HELD: urban and other hexes per side (Manchuria, map edge and water excluded). */
export function terrainHeld(g: GameState): Held {
  const out: Held = { cities: { un: 0, communist: 0 }, hexes: { un: 0, communist: 0 } };
  for (let i = 0; i < g.possession.length; i++) {
    const p = g.possession[i];
    if (p !== 1 && p !== 2) continue;
    const c = g.hexes[i].code;
    if (c === 0x94 || c === 0x8f || c >= 0xa5) continue;
    const side: Side = p === 1 ? 'un' : 'communist';
    if (c === CITY) out.cities[side]++;
    else out.hexes[side]++;
  }
  return out;
}

/**
 * EURSUBS1.TERRITORY_BALANCE: victory level, + for the UN, - for the Communists (-9..9).
 * 100 points per city, 1 per other hex, relative to 25 June 1950 (181 points) or 1995 (346, stockpiles count).
 * `final`: evaluated by GAME_OVER (SCENARIO[5] = 99), when the no-intervention rule can cancel a UN win.
 */
export function territoryBalance(g: GameState, final = false): number {
  const h = terrainHeld(g);
  const base = g.scenarioNo < 4 ? 181 : 346;
  let otherUn = h.hexes.un, otherCom = h.hexes.communist;
  if (g.scenarioNo === 4) { otherUn += g.stockpile[1]; otherCom += g.stockpile[0]; }
  const ptsUn = 100 * h.cities.un + otherUn;
  const ptsCom = 100 * h.cities.communist + otherCom;
  let lvl = Math.max(-9, Math.min(9, Math.trunc((ptsUn - ptsCom - base) / 200)));
  if (g.turn === 24 && g.scenarioNo < 4 && final && lvl >= 1) {
    let c = h.cities.communist > 0 ? 2 : 0;
    for (const [x, y] of COMMUNIST_SUPPLY_POINTS) {
      const code = codeAt(g, x, y);
      if (g.possession[idx(g, x, y)] === 2 && code < 0xa5 && code !== 0x94) c++;
    }
    if (c >= 2) lvl = 0;
  }
  return lvl;
}

// ---------- UNSPOT_EVERYTHING ----------

export function unspotEverything(g: GameState) {
  g.spotted.fill(0);
}

// ---------- GROUND_REINFORCEMENTS ----------

export interface ReinforcementReport {
  /** Stockpile change from new shipments minus rail / sea / air transport use, [Communist, UN]. */
  shipments: [number, number];
  /** Force leaders placed on the map. */
  arrived: number[];
  /** Units due this turn that could not be placed (hex not available). */
  held: number[];
  /** Destroyed units rebuilt and scheduled to return. */
  rebuilt: number[];
  /** Equipment pieces handed out from the replacement pools. */
  replaced: number;
}

const natOf = (u: UnitState) => NATIONS.indexOf(u.nation);

function pool(g: GameState, u: UnitState, type: number): [number, number] | undefined {
  return g.replacements[u.nation]?.[type - 1];
}

/** Nested 0283: turn a pending unit is due. CPLA turns are relative to the intervention turn. */
export function arrivalTurn(g: GameState, u: UnitState): number {
  const ccf = g.ccfIntervention;
  const adj = ccf > 20 ? Math.trunc((ccf - 17) / 4) : 0;
  let a = Math.abs(Math.trunc(u.x / 100));
  if (ccf < 50 && natOf(u) === 6) a -= 50 - (ccf - adj);
  return a;
}

/** Pending reinforcement: MAP_X = -(arrival turn * 100 + x code); code 99/88/77 = general entry lists. */
export function pendingArrival(g: GameState, u: UnitState): { turn: number; code: number; y: number } | null {
  if (!(u.x < -1)) return null;
  return { turn: arrivalTurn(g, u), code: Math.abs(u.x) % 100, y: u.y };
}

/** Communist general entry hexes (code 99): supply points and Hamhung; the last available one wins. */
const ENTRY_99: [number, number][] = [[2, 20], [9, 17], [14, 10], [29, 5], [33, 6], [0, 22], [17, 24], [7, 29]];

export function groundReinforcements(g: GameState): ReinforcementReport {
  const report: ReinforcementReport = { shipments: [0, 0], arrived: [], held: [], rebuilt: [], replaced: 0 };
  const comp = g.competence;
  // A. supply shipments (06BA)
  let t = g.scenarioNo < 4 ? Math.trunc(g.turn / 4) + 10 : 14;
  t += comp >> 2;
  if (g.computerSide === 1) t += Math.trunc(comp / 3);
  if (g.scenarioNo < 4) {
    if (g.ccfIntervention !== 99) t += 10;
    if (g.ccfIntervention + 4 === g.turn) t += 20;
  }
  report.shipments[0] = t - g.railDemand[0];
  g.stockpile[0] += t - g.railDemand[0];
  g.railDemand[0] = 0;
  let u = g.scenarioNo < 4 ? g.turn + 2 : 15;
  if (g.computerSide === 2) u++;
  u = Math.max(0, Math.min(15, u));
  g.airliftDemand += g.sealiftDemand;
  if (g.sky === 3) g.airliftDemand = 4;
  g.airliftDemand += g.railDemand[1];
  if (g.airliftDemand > u) g.airliftDemand = u;
  report.shipments[1] = u - g.airliftDemand;
  g.stockpile[1] += u - g.airliftDemand;
  const cap = g.scenarioNo < 4 ? 100 : 200;
  for (const k of [0, 1]) g.stockpile[k] = Math.max(1, Math.min(cap, g.stockpile[k]));
  // forces at sea are charged next turn
  g.sealiftDemand = 0;
  for (let i = 0; i < g.stacks.length; i++) {
    const c = g.hexes[i].code;
    if (c >= 0xa5 && c < 0xdb) g.sealiftDemand += g.stacks[i].length;
  }
  g.airliftDemand = 0;
  g.railDemand[1] = 0;

  // B, C. arrivals
  g.utility[18] = 0;
  g.utility[19] = 0;
  const isAttached = (id: number) => { for (const v of g.units.values()) if (v.attached === id) return true; return false; };
  for (let id = g.lastUnUnit; id >= 1; id--) {
    const unit = g.units.get(id);
    if (!unit || !(unit.x < -1)) continue;
    if (!(g.turn + 1 >= arrivalTurn(g, unit))) continue;
    let x = Math.abs(unit.x) % 100;
    let y = unit.y;
    const tryHex = (X: number, Y: number, side: number) => {
      if (g.possession[idx(g, X, Y)] === side && slot(g, X, Y, 1) === 0) { x = X; y = Y; }
    };
    if (x === 99) for (const [X, Y] of ENTRY_99) tryHex(X, Y, 2);
    if (x === 88) for (let Y = 59; Y >= 40; Y--) for (let X = 26; X >= 13; X--) if (codeAt(g, X, Y) === CITY) tryHex(X, Y, 1);
    if (x === 77) for (let Y = 64; Y >= 59; Y--) tryHex(33, Y, 1);
    if (corpsOf(g, id) === 1 && inGrid(g, x, y) && slot(g, x, y, 0) === 0) g.possession[idx(g, x, y)] = 2;
    const owner = onMap(g, x, y) ? g.possession[idx(g, x, y)] : 0;
    const placeable = owner > 0 && !(id < g.firstUnUnit && owner === 1) && !(id >= g.firstUnUnit && owner === 2);
    if (!placeable || slot(g, x, y, 1) !== 0) {
      if (!isAttached(id)) report.held.push(id);
      continue;
    }
    // nested 056F: only force leaders are placed; the rest of the force follows
    if (isAttached(id)) continue;
    g.utility[id < g.firstUnUnit ? 19 : 18] = 1;
    g.stacks[idx(g, x, y)].push(id);
    let cur: UnitState | undefined = unit;
    const seen = new Set<number>();
    while (cur && !seen.has(cur.id)) {
      seen.add(cur.id);
      cur.x = x; cur.y = y; cur.status = STATUS_SUPPLIED;
      cur = cur.attached > 0 ? g.units.get(cur.attached) : undefined;
    }
    report.arrived.push(id);
  }

  // D. replacement pools grow by their per-turn rate (REPLACEMENTS[n][e] = [rate, pool])
  NATIONS.forEach((n, k) => {
    const grow = g.scenarioNo === 4 || k > 3 || (k === 0 && g.turn > 1) || (k === 1 && g.turn > 4) || (k === 2 && g.turn > 8) || (k === 3 && g.turn > 15);
    if (!grow) return;
    for (const row of g.replacements[n] ?? []) row[1] = row[0] + row[1] > 255 ? 255 : row[1] + row[0];
  });
  // E. one-time grants (byte adds, no cap, as coded)
  if (g.scenarioNo < 4) {
    const grant = (n: Nation, type: number, amount: number) => {
      const row = g.replacements[n]?.[type - 1];
      if (row) row[1] = (row[1] + amount) & 0xff;
    };
    if (g.turn === 4) { grant('US', 5, 12); grant('US', 12, 18); grant('US', 13, 12); }
    if (g.turn === 8) { grant('US', 5, 30); grant('US', 12, 45); grant('US', 13, 30); }
    if (g.turn === 13 || g.turn === 32) { grant('CW', 5, 6); grant('CW', 12, 12); grant('CW', 13, 2); }
    if (g.turn === 26) grant('CW', 5, 18);
  }

  // F, G. needs of supplied units on the map, turned into a ratio pool*100/need
  const eligible = (v: UnitState) => (v.status & STATUS_SUPPLIED) !== 0 && (v.status & STATUS_BURIED) === 0 && onMap(g, v.x, v.y);
  const need = new Map<string, number>();
  const key = (v: UnitState, type: number) => `${v.nation}:${type}`;
  for (let id = 1; id <= g.lastUnUnit; id++) {
    const v = g.units.get(id);
    if (!v || !eligible(v)) continue;
    for (const e of v.equipment) if (e.authorized > e.assigned) need.set(key(v, e.type), (need.get(key(v, e.type)) ?? 0) + e.authorized - e.assigned);
  }
  const ratio = new Map<string, number>();
  for (const [k, n] of need) {
    const [nation, type] = k.split(':');
    const p = g.replacements[nation as Nation]?.[Number(type) - 1]?.[1] ?? 0;
    ratio.set(k, n > 0 ? Math.trunc((p * 100) / n) : 0);
  }
  // H. distribution: each missing piece is drawn with chance ratio / (100 + distance from the base area)
  for (let id = 1; id <= g.lastUnUnit; id++) {
    const v = g.units.get(id);
    if (!v || !eligible(v)) continue;
    let chance = 100;
    if (g.scenarioNo < 4) {
      if (corpsOf(g, id) === 1) { if (v.y > 26) chance += v.y - 26; }
      else if (v.y < 38) chance += 38 - v.y;
    }
    const mult = (id < g.firstUnUnit && g.computerSide === 1) || (id >= g.firstUnUnit && g.computerSide === 2) ? 2 : 1;
    for (const e of v.equipment) {
      if (!(e.authorized > e.assigned)) continue;
      const d = e.authorized - e.assigned;
      const row = pool(g, v, e.type);
      for (let k = 0; k < d; k++) {
        const R = (((ratio.get(key(v, e.type)) ?? 0) * mult) << 16) >> 16; // int16, as coded
        if (rnd(g, 1, chance) < R && row && row[1] > 0) {
          e.assigned++;
          report.replaced++;
          if (rnd(g, 1, mult + 1) < 3) row[1]--;
        }
      }
    }
  }

  // I. rebuild destroyed units (holding box 1,0) when the pool can fill 2/3 of their main equipment
  for (let id = 1; id <= g.lastUnUnit; id++) {
    const v = g.units.get(id);
    if (!v || !canRebuild(g, v)) continue;
    for (const e of v.equipment) {
      if (!(e.authorized > 0)) continue;
      const row = pool(g, v, e.type);
      const n = Math.max(0, Math.min(row?.[1] ?? 0, e.authorized));
      if (row) row[1] -= n;
      e.assigned = n;
    }
    v.status = STATUS_SUPPLIED;
    v.readiness = 75;
    const nat = natOf(v);
    if (nat >= 0 && nat <= 3) { v.x = -126; v.y = 59; }
    else if (nat === 4) { v.x = -188; v.y = 99; }
    else if (nat === 5) { v.x = -199; v.y = 99; }
    else if (nat === 6) { v.x = -100; v.y = 22; }
    report.rebuilt.push(id);
  }
  g.version++;
  return report;
}

/** Nested 02FF. */
export function canRebuild(g: GameState, v: UnitState): boolean {
  if (!(v.x === 1 && v.y === 0)) return false;
  if (g.scenarioNo < 4 && v.id === 187) return false; // TF Smith
  let best = 0, typ = 0;
  for (const e of v.equipment) if (e.authorized > best) { best = e.authorized; typ = e.type; }
  if (!typ) return false;
  return (pool(g, v, typ)?.[1] ?? 0) > Math.trunc((best * 2) / 3);
}

// ---------- CHECK_CHINA ----------

/** CHECK_CHINA: a non-ROK UN force north of the 38th parallel (row 37) makes China decide. */
export function checkChina(g: GameState): boolean {
  if (g.ccfIntervention !== 99) return false;
  let trigger = false;
  for (let x = 0; x <= 33; x++) for (let y = 0; y <= 37; y++) {
    if (y === 37 && (x & 1) === 0) continue;
    if (codeAt(g, x, y) >= 0xa5) continue;
    if (slot(g, x, y, 0) >= 187 || slot(g, x, y, 1) >= 187) trigger = true;
  }
  if (!trigger) return false;
  if (g.ccfFixed || rnd(g, 1, 3) > 1) g.ccfIntervention = g.turn > 16 ? g.turn + 1 : g.turn + rnd(g, 1, 4);
  else g.ccfIntervention = 88;
  g.utility[8] = g.turn & 0xff;
  newsFlash(g, 'United Nations units enter North Korea.');
  newsFlash(g, 'China pledges to halt imperialist aggression in Korea.');
  return true;
}

// ---------- MINE_WARFARE ----------

export interface MineReport { mined: number[]; swept: number[]; }

export function mineWarfare(g: GameState): MineReport {
  const out: MineReport = { mined: [], swept: [] };
  if (g.turn <= 6 && g.scenarioNo !== 4) return out;
  for (const p of g.ports) {
    const before = p.mined;
    if (g.possession[idx(g, p.x, p.y)] === 2) {
      if ((p.y < 36 || g.turn > 10) && rnd(g, 1, 100) < g.turn + 20) p.mined = true;
      if (g.scenarioNo === 4) p.mined = true;
    } else if (rnd(g, 1, 2) === 1) p.mined = false;
    if (p.mined && !before) out.mined.push(p.id);
    if (!p.mined && before) out.swept.push(p.id);
  }
  return out;
}

// ---------- DO_PATROLS ----------

/** EURSUBS1 2D99: a force leader in the hex has raw lethality of at least 300 (shown as 30). */
function strongHex(g: GameState, x: number, y: number): boolean {
  if (!inGrid(g, x, y)) return false;
  for (const leader of g.stacks[idx(g, x, y)]) {
    const u = g.units.get(leader);
    if (u && unitStrength(g, u, x, y, 0).L >= 300) return true;
  }
  return false;
}

/**
 * EURSUBS1.ENEMY_ADJACENT(x, y, false): a strong force of the other possession next door.
 * friendly = the original's negative-x call (same possession, strength of the centre hex).
 */
export function strongNeighbour(g: GameState, x: number, y: number, friendly: boolean): boolean {
  if (!onMap(g, x, y)) return false;
  const p = g.possession[idx(g, x, y)];
  if (p === 3) return false;
  for (let d = 0; d < 6; d++) {
    const [nx, ny] = neighbor(x, y, d);
    if (!onMap(g, nx, ny)) continue;
    const ni = idx(g, nx, ny);
    const pn = g.possession[ni];
    if (pn === 3 || g.stacks[ni].length === 0) continue;
    if (!friendly && pn !== p && strongHex(g, nx, ny)) return true;
    if (friendly && pn === p && strongHex(g, x, y)) return true;
  }
  return false;
}

/** Nested 1896. */
const patrolHex = (g: GameState, x: number, y: number) => {
  const c = codeAt(g, x, y);
  return c < 0xa5 && c !== CITY && c !== 0x94 && !(x === 33 && y > 7);
};

/** Nested 1704: no force in a hex of possession `side` within 7 hexes. */
function noForcesNear(g: GameState, x: number, y: number, side: number): boolean {
  for (let i = x - 7; i <= x + 7; i++) for (let j = y - 8; j <= y + 8; j++) {
    if (!onMap(g, i, j) || hexDistance(x, y, i, j) >= 8) continue;
    const k = idx(g, i, j);
    if (g.possession[k] === side && g.stacks[k].length > 0) return false;
  }
  return true;
}

/** Nested 17D0: a land hex of possession `side` next door. */
function adjacentSide(g: GameState, x: number, y: number, side: number): boolean {
  for (let d = 0; d < 6; d++) {
    const [nx, ny] = neighbor(x, y, d);
    if (!onMap(g, nx, ny)) continue;
    const k = idx(g, nx, ny);
    if (g.hexes[k].code < 0xa5 && g.possession[k] === side) return true;
  }
  return false;
}

const portOrAirfield = (g: GameState, x: number, y: number) =>
  g.ports.some((p) => p.x === x && p.y === y) || g.airfields.some((a) => a.x === x && a.y === y);

export interface PatrolReport {
  /** Empty hexes taken by patrols, by the side that took them. */
  patrols: Record<Side, number>;
  /** Hexes changed by guerrillas (to Communist) and counter-guerrilla operations (to UN). */
  guerrillas: Record<Side, number>;
  /** P'yongyang / Hamhung returned to the Communists because no UN force holds them. */
  reverted: [number, number][];
}

export function doPatrols(g: GameState): PatrolReport {
  const out: PatrolReport = { patrols: { un: 0, communist: 0 }, guerrillas: { un: 0, communist: 0 }, reverted: [] };
  // pass 1: an empty hex next to a strong enemy force changes hands
  for (let x = 0; x <= 33; x++) for (let y = 0; y <= 65; y++) {
    if (!patrolHex(g, x, y)) continue;
    const i = idx(g, x, y);
    const p = g.possession[i];
    if (p <= 0 || p >= 3 || g.stacks[i].length !== 0) continue;
    if (!strongNeighbour(g, x, y, false)) continue;
    // the friendly check: x = 0 cannot be negated, so the original repeats the enemy test there
    if (x === 0 ? strongNeighbour(g, x, y, false) : strongNeighbour(g, x, y, true)) continue;
    g.possession[i] = 3 - p;
    out.patrols[p === 1 ? 'communist' : 'un']++;
  }
  if (g.scenarioNo >= 4) return out;
  // pass 2: guerrillas (cascades along the x-major scan, as coded)
  for (let x = 0; x <= 33; x++) for (let y = 0; y <= 65; y++) {
    if (!patrolHex(g, x, y)) continue;
    const i = idx(g, x, y);
    if (g.possession[i] === 1) {
      const cand = rnd(g, 1, 100) <= 10 || (rnd(g, 1, 100) <= 20 && adjacentSide(g, x, y, 2));
      if (cand && noForcesNear(g, x, y, 1) && !portOrAirfield(g, x, y)) { g.possession[i] = 2; out.guerrillas.communist++; }
    }
    if (g.possession[i] === 2) {
      if (rnd(g, 1, 100) <= 50 && adjacentSide(g, x, y, 1) && noForcesNear(g, x, y, 2) && !noForcesNear(g, x, y, 1)) {
        g.possession[i] = 1;
        out.guerrillas.un++;
      }
    }
  }
  for (const [x, y] of [[7, 29], [17, 24]] as [number, number][]) {
    const i = idx(g, x, y);
    if (g.stacks[i].length === 0) {
      if (g.possession[i] !== 2) out.reverted.push([x, y]);
      g.possession[i] = 2;
    }
  }
  if (out.guerrillas.communist) newsFlash(g, 'Communist guerrillas active behind U.N. lines.');
  if (out.guerrillas.un) newsFlash(g, 'U.N. forces engaged in counter guerrilla operations.');
  g.version++;
  return out;
}

// ---------- DO_INTEL ----------

export interface IntelReport { level1: number; level2: number; }

/** DO_INTEL: spotting levels for the coming turn (complete intelligence: everything level 2). */
export function doIntel(g: GameState): IntelReport {
  const out: IntelReport = { level1: 0, level2: 0 };
  for (let x = 0; x <= 33; x++) for (let y = 0; y <= 65; y++) {
    const i = idx(g, x, y);
    let lvl = 2;
    if (g.limitedIntel) {
      const road = roadHex(g, x, y) ? 1 : 0;
      lvl = g.spotted[i];
      if (enemyAdjacent(g, x, y)) lvl = 2;
      else if (g.scenarioNo >= 4) {
        if (g.possession[i] === 2) { if (rnd(g, 1, 3) < road + 3) lvl++; }
        else {
          if (g.turn + 1 < rnd(g, 1, 3) + road) lvl++;
          if (g.hexes[i].code === CITY) lvl = 2;
        }
      }
      lvl = Math.max(0, Math.min(2, lvl));
    }
    g.spotted[i] = lvl;
    if (lvl === 1) out.level1++;
    if (lvl === 2) out.level2++;
  }
  return out;
}

// ---------- CHECK_BIGHEXES ----------

/** The seven big cities tracked for news: UTILITY_SPACE[k] holds the last known owner. */
export const BIG_CITIES: { x: number; y: number; name: string; south: boolean }[] = [
  { x: 14, y: 40, name: 'Seoul', south: true }, { x: 7, y: 29, name: "P'yongYang", south: false },
  { x: 17, y: 24, name: 'Hamhung/Hungnam', south: false }, { x: 17, y: 51, name: 'Taejon', south: true },
  { x: 13, y: 59, name: 'Kwangju', south: true }, { x: 24, y: 54, name: 'Taegu', south: true },
  { x: 26, y: 59, name: 'Pusan', south: true },
];

export interface CityChange { name: string; owner: number; }

export function checkBigHexes(g: GameState): CityChange[] {
  const out: CityChange[] = [];
  BIG_CITIES.forEach((c, k) => {
    const p = g.possession[idx(g, c.x, c.y)];
    if (p === g.utility[k]) return;
    if (p === 1 || p === 2) newsFlash(g, `${p === 1 ? 'United Nations' : 'Communist'} forces occupy ${c.name}.`);
    g.utility[k] = p;
    if (p === 1 && c.south) g.utility[14] = 1;
    out.push({ name: c.name, owner: p });
  });
  return out;
}

// ---------- GAME_OVER ----------

export interface GameResult { level: number; winner: Side | null; }

/** ENDTURN.GAME_OVER: final victory level and news; every hex becomes visible, no more movement. */
export function gameOverResult(g: GameState): GameResult {
  const lvl = territoryBalance(g, true);
  const adj = (v: number) => (v >= 5 ? 'Decisive' : v >= 3 ? 'Significant' : 'Marginal');
  const winner: Side | null = lvl > 0 ? 'un' : lvl < 0 ? 'communist' : null;
  if (!winner) newsFlash(g, 'Stalemate in Korea.');
  else if (winner === 'un') {
    newsFlash(g, `${adj(lvl)} United Nations victory in Korea.`);
    if (lvl >= 3) newsFlash(g, 'Korea to be unified under United Nations supervision.');
  } else {
    newsFlash(g, `${adj(-lvl)} Communist victory in Korea.`);
    if (lvl <= -2) newsFlash(g, "American press demands President's resignation.");
    if (lvl <= -3) {
      newsFlash(g, 'Peace groups insist on withdrawal of U.S. forces from overseas.');
      newsFlash(g, 'Seoul is to be renamed "Kim Il-Sung City".');
    }
  }
  g.spotted.fill(2);
  for (const u of g.units.values()) u.move = nationalMovementRate(g, u);
  g.version++;
  return { level: lvl, winner };
}
