// Supply, reproduced from the original code (docs/rules/supply.md). Pure logic (no DOM).
//
//   supplyNet          SUPPLY.DETERMINE_SUPPLY (sources + nested sweeps 0DA4 / 0CA5)
//   interdictionLevel  REST_UP nested 0000 (UN interdiction level from air units, OPSSUBS.EFFECTIVE_STRENGTH)
//   restUp             SUPPLY.REST_UP body 01AE (unit resupply, stockpile draw, air supply, attrition)
//                      + 0532 (start-of-turn movement allowance, STATUS 0x40)

import type { GameState, Side } from './state.ts';
import { idx, onMap, corpsOf, rnd, forceUnits, STATUS_SUPPLIED, STATUS_READY } from './state.ts';
import { turnStartMove, unitAttrition } from './movement.ts';

/** STATUS 0x80: not resupplied, but kept supplied by air (no readiness loss, no replacements). */
export const STATUS_AIR_SUPPLIED = 0x80;

/** DETERMINE_SUPPLY seeds (x, y) for the Communist side; also SUPPLY_POINTS (x3 re-ready rate). */
export const COMMUNIST_SUPPLY_POINTS: readonly [number, number][] = [[0, 22], [2, 20], [7, 29], [9, 17], [14, 10], [29, 5], [33, 6]];
const SEOUL: [number, number] = [14, 40];
const CITY = 0x93;

/** Possession code of each side, as stored in the supply net. */
const CODE: Record<Side, number> = { un: 1, communist: 2 };

/**
 * SUPPLY.DETERMINE_SUPPLY: per hex 0 = unsupplied, 1 = UN supply net, 2 = Communist supply net.
 * Not a flood fill: the original makes two left/right double sweeps per side, so supply can only bend a
 * limited number of times. Reproduced exactly.
 */
export function supplyNet(g: GameState): Uint8Array {
  const net = new Uint8Array(g.width * g.height);
  const seed = (x: number, y: number, side: number) => {
    if (onMap(g, x, y) && g.possession[idx(g, x, y)] === side) net[idx(g, x, y)] = side;
  };
  for (const [x, y] of COMMUNIST_SUPPLY_POINTS) seed(x, y, 2);
  for (const p of g.ports) if (!p.mined) seed(p.x, p.y, 1);
  seed(33, 59, 2); // as coded (a Japan hex seeded for the Communist side: no effect unless captured)

  // 0CA5: target (tx, ty) joins the net if the source hex is in it and the target is friendly land
  const spread = (tx: number, ty: number, sx: number, sy: number, side: number) => {
    if (!onMap(g, tx, ty) || !onMap(g, sx, sy)) return;
    const ti = idx(g, tx, ty);
    if (g.hexes[ti].code >= 0xa5) return; // WATERHEX(x, y, true): ocean, estuary, reservoir
    if (net[ti] === side) return;
    if (net[idx(g, sx, sy)] !== side) return;
    if (g.possession[ti] !== side) return;
    net[ti] = side;
  };
  // 0DA4: one column x from its neighbour column x + dir, then up and down the column itself
  const column = (x: number, dir: number, side: number) => {
    for (let y = 1; y <= 65; y++) spread(x, y, x + dir, y, side);
    if (x & 1) for (let y = 1; y <= 65; y++) spread(x, y, x + dir, y - 1, side);
    else for (let y = 1; y <= 64; y++) spread(x, y, x + dir, y + 1, side);
    for (let y = 64; y >= 1; y--) spread(x, y, x, y + 1, side);
    for (let y = 2; y <= 65; y++) spread(x, y, x, y - 1, side);
  };
  for (let k = 0; k < 2; k++) {
    for (let x = 0; x <= 33; x++) column(x, -1, 1);
    for (let x = 33; x >= 0; x--) column(x, 1, 1);
  }
  for (let k = 0; k < 2; k++) {
    for (let x = 33; x >= 0; x--) column(x, 1, 2);
    for (let x = 0; x <= 33; x++) column(x, -1, 2);
  }
  return net;
}

/** OPSSUBS.EFFECTIVE_STRENGTH: weather / basing divisor of an air unit's strength. */
export function airDivisor(g: GameState, a: GameState['airUnits'][number]): number {
  let d = g.sky;
  if (a.allWeather && d > 1) d--;
  if (a.base === 0 && !a.longRange) d *= 2;
  return Math.max(1, d);
}

/**
 * REST_UP nested 0000: United Nations interdiction level (UNIL) = sum of air-to-ground strength of
 * active interdiction units (mission 2), each divided by its weather/basing divisor, then div 10.
 */
export function interdictionLevel(g: GameState): number {
  const [from, to] = g.scenarioNo < 4 ? [1, 29] : [14, 34];
  let sum = 0;
  for (const a of g.airUnits) {
    if (a.id < from || a.id > to) continue;
    if (a.entryTurn > g.turn || a.exitTurn <= g.turn || a.mission !== 2) continue;
    sum += Math.trunc(a.airToGround / airDivisor(g, a));
  }
  return Math.trunc(sum / 10);
}

export interface ResupplyReport {
  net: Uint8Array;
  unil: number;
  /** Units resupplied (STATUS 0x01), air supplied (0x80), unsupplied (readiness -5), by side. */
  resupplied: Record<Side, number>;
  airSupplied: number;
  unsupplied: Record<Side, number>;
  /** Unit ids that suffered 10% attrition (unsupplied at readiness 50). */
  attrition: number[];
  /** Stockpile points drawn by resupply, DUAL order [Communist, UN]. */
  drawn: [number, number];
}

const isPortAt = (g: GameState, x: number, y: number) => g.ports.some((p) => p.x === x && p.y === y && !p.mined);
const isSupplyPoint = (x: number, y: number) => COMMUNIST_SUPPLY_POINTS.some(([px, py]) => px === x && py === y);

/** HEXSTUFF.ROAD_HEX: a road terrain code (storms cancel roads in the 1950s). */
export function roadHex(g: GameState, x: number, y: number): boolean {
  const c = g.hexes[idx(g, x, y)].code;
  const road = (c >= 0x0b && c <= 0x57) || (c >= 0x68 && c <= 0x7c);
  return road && !(g.scenarioNo < 4 && g.sky === 3);
}

/** SUPPLY.REST_UP: resupply every unit on the map, then give every force its movement allowance for the turn. */
export function restUp(g: GameState): ResupplyReport {
  const net = supplyNet(g);
  let unil = interdictionLevel(g);
  if (g.computerSide === 1) unil = Math.max(0, Math.min(95, unil - 5));
  const seoulUN = g.possession[idx(g, SEOUL[0], SEOUL[1])] === 1;
  const report: ResupplyReport = {
    net, unil, resupplied: { un: 0, communist: 0 }, airSupplied: 0, unsupplied: { un: 0, communist: 0 }, attrition: [], drawn: [0, 0],
  };

  for (let id = 1; id <= g.lastUnUnit; id++) {
    const u = g.units.get(id);
    if (!u || !onMap(g, u.x, u.y)) continue;
    const { x, y } = u;
    const un = id >= g.firstUnUnit;
    const side: Side = un ? 'un' : 'communist';
    const code = CODE[side];
    const dual = un ? 1 : 0;
    let rate: number;
    if (un) {
      rate = 10;
      if (y < 30) rate--;
      if (g.computerSide === 2) rate += 2;
    } else {
      rate = g.competence + 7;
      if (y > 50) rate--;
      if (g.computerSide === 1) rate += Math.trunc(g.competence / 2);
    }
    const corps = corpsOf(g, id);
    u.status = 0;
    // nested 010B: Communist units must get through UN interdiction (and Seoul if the UN holds it)
    const getsThrough = () => {
      let ok = corps > 1 || rnd(g, 1, 100) > Math.trunc((unil * y) / 30);
      if (corps < 2 && seoulUN && rnd(g, 1, 100) <= 50 && y > 41) ok = false;
      return ok;
    };
    if (net[idx(g, x, y)] === code && getsThrough() && rnd(g, 1, 100) <= g.stockpile[dual]) {
      u.status |= STATUS_SUPPLIED;
      report.resupplied[side]++;
      if (u.readiness < 100) {
        if (rnd(g, 1, 100) < 100 - u.readiness && g.stockpile[dual] > 10) {
          const computer = g.computerSide === (un ? 2 : 1);
          if (!computer || rnd(g, 1, 9) < 7) { g.stockpile[dual]--; report.drawn[dual]++; }
        }
        let mult = roadHex(g, x, y) ? 2 : 1;
        if (corps === 1) mult = u.readiness * u.readiness - 900 < rnd(g, 1, 700) ? 3 : 2;
        if (g.hexes[idx(g, x, y)].code === CITY) mult = 3;
        if (un ? isPortAt(g, x, y) : isSupplyPoint(x, y)) mult = 3;
        u.readiness += rate * mult;
      }
    } else if (un && g.turn >= 2 && (g.turn >= 25 || id >= 187) && g.sky !== 3) {
      g.airliftDemand = 1;
      u.status |= STATUS_AIR_SUPPLIED;
      report.airSupplied++;
    } else {
      u.readiness -= 5;
      u.status &= ~STATUS_SUPPLIED;
      report.unsupplied[side]++;
      if (u.readiness <= 50 && corps !== 1) { unitAttrition(g, u, 10); report.attrition.push(id); }
    }
    u.readiness = Math.max(50, Math.min(100, u.readiness));
  }

  // 0532: movement allowance of every force for the coming turn
  for (let i = 0; i < g.stacks.length; i++) {
    const x = i % g.width, y = Math.floor(i / g.width);
    for (const leader of g.stacks[i]) {
      const members = forceUnits(g, leader);
      for (const v of members) if (v.readiness >= 75) v.status |= STATUS_READY;
      const side: Side = leader >= g.firstUnUnit ? 'un' : 'communist';
      const used = turnStartMove(g, leader, net[idx(g, x, y)] === CODE[side]);
      for (const v of members) v.move = used;
    }
  }
  g.version++;
  return report;
}
