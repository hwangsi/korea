// Improved computer player for either side (docs/rules/ai.md 9). It plays by a human player's rules and knowledge:
//   - it knows what its side has spotted (intel.ts perceivedState; everything with complete intelligence)
//   - it orders through the same engine calls as the map screen: orderReach + pathTo and moveForce / railMove,
//     seaMove for forces that must cross the sea, assault for attacks (overrun roll, six-point rule, plots),
//     cancelAssault to take a plot back; no teleporting, no unit-number scripts, no hidden enemy positions
//   - the combat estimate is the one the assault preview shows a player (combat.ts estimateCombat)
//
// One orders phase:
//   1. first orders phase only: attacks. Every known enemy hex next to our forces is weighed (city, weak defenders),
//      attackers of one army are plotted strongest first until the estimate is good; if it never is, the plots are
//      taken back
//   2. the front: own land hexes next to known enemy forces want a defender (two when the enemy there is strong)
//   3. every other force moves to the best hex in reach (rail when far): holes in the front first, then, when the
//      side is the stronger one, empty enemy ground and cities; otherwise it closes on the front. Forces that hold a
//      front hex alone stay; worn-out forces in the rear rest
// Deterministic: no random numbers (ties broken by hex and force number).

import type { GameState, Player, Side } from '../state.ts';
import { POSSESSION_CODE, forceUnits, sideOf, unit, corpsOf } from '../state.ts';
import { perceivedState, fogActive } from '../intel.ts';
import { pathTo, moveForce, railMove, allowance, canEntrain, cannotMove, isDeepOcean } from '../movement.ts';
import type { MoveMode, Reach } from '../movement.ts';
import { orderReach, seaMove, seaMoveBlock } from '../naval.ts';
import { assault, assaultPreview, cancelAssault, estimateCombat, shownStrength, assaultTarget } from '../combat.ts';
import type { CombatEstimate } from '../combat.ts';
import { neighbor, hexDistance } from '../hex.ts';
import { BIG_CITIES } from '../endturn.ts';
import type { AiReport } from './types.ts';

const MANCHURIA = 0x94;
const WATER = 0xa5;
const FAR = 1 << 20;

interface Ctx {
  g: GameState;
  side: Side;
  own: number;
  enemy: number;
  /** The board as the side knows it (refreshed after moves: its stack lists are copies). */
  pv: GameState;
  aggressive: boolean;
}

const xyOf = (g: GameState, i: number): [number, number] => [i % g.width, Math.floor(i / g.width)];
const passable = (g: GameState, i: number) => {
  const h = g.hexes[i];
  return h.code < WATER && h.code !== MANCHURIA && h.terrain !== 'offmap' && h.terrain !== 'japan';
};

function neighboursOf(g: GameState, i: number): number[] {
  const [x, y] = xyOf(g, i);
  const out: number[] = [];
  for (let d = 0; d < 6; d++) {
    const [nx, ny] = neighbor(x, y, d);
    if (nx >= 0 && ny >= 0 && nx < g.width && ny < g.height) out.push(ny * g.width + nx);
  }
  return out;
}

/** Leaders of the side's forces on the map, by hex. */
function ownForces(c: Ctx): { leader: number; hex: number }[] {
  const out: { leader: number; hex: number }[] = [];
  c.g.stacks.forEach((s, i) => { for (const l of s) if (sideOf(unit(c.g, l)) === c.side) out.push({ leader: l, hex: i }); });
  return out;
}

/** Known enemy leaders in a hex. */
function knownEnemies(c: Ctx, i: number): number[] {
  return c.pv.stacks[i].filter((l) => sideOf(unit(c.g, l)) !== c.side);
}

const strengthL = (g: GameState, leader: number) => shownStrength(g, forceUnits(g, leader)).L;

/** Known enemy strength next to a hex (shown strength, the player's counter numbers). */
function enemyPressure(c: Ctx, i: number): number {
  let s = 0;
  for (const n of neighboursOf(c.g, i)) for (const l of knownEnemies(c, n)) s += strengthL(c.g, l);
  return s;
}

function ownStrengthIn(c: Ctx, i: number): number {
  return c.g.stacks[i].filter((l) => sideOf(unit(c.g, l)) === c.side).reduce((s, l) => s + strengthL(c.g, l), 0);
}

const terrainBonus = (g: GameState, i: number) => {
  const t = g.hexes[i].terrain;
  return t === 'mountain' ? 10 : t === 'urban' ? 12 : t === 'rough' ? 6 : 0;
};

const bigCityAt = (g: GameState, i: number) => BIG_CITIES.some((b) => b.y * g.width + b.x === i);
/** City hexes are what the victory level counts (100 points each, 1 for any other hex; endturn.ts territoryBalance). */
const CITY = 0x93;
const cityAt = (g: GameState, i: number) => g.hexes[i].code === CITY;

/**
 * Defenders a hex still wants: own land hexes next to known enemy forces (the line), and own cities with known
 * enemy forces within three hexes (garrisoned before the enemy arrives: a city is worth 100 hexes).
 */
function frontNeeds(c: Ctx): Map<number, number> {
  const need = new Map<number, number>();
  const { g } = c;
  const enemyHexes: [number, number][] = [];
  c.pv.stacks.forEach((s, i) => { if (s.some((l) => sideOf(unit(g, l)) !== c.side)) enemyHexes.push(xyOf(g, i)); });
  for (let i = 0; i < g.possession.length; i++) {
    if (g.possession[i] !== c.own || !passable(g, i)) continue;
    const p = enemyPressure(c, i);
    if (p <= 0) {
      if (!cityAt(g, i)) continue;
      const [x, y] = xyOf(g, i);
      if (!enemyHexes.some(([ex, ey]) => hexDistance(x, y, ex, ey) <= 3)) continue;
      const have = g.stacks[i].filter((l) => sideOf(unit(g, l)) === c.side).length;
      if (have < 2) need.set(i, 2 - have);
      continue;
    }
    // an attacking side keeps contact without a full line; cities are always held
    if (c.aggressive && !cityAt(g, i)) continue;
    const have = g.stacks[i].filter((l) => sideOf(unit(g, l)) === c.side).length;
    const want = p > ownStrengthIn(c, i) * 1.5 + 20 || cityAt(g, i) ? 2 : 1;
    if (want > have) need.set(i, want - have);
  }
  return need;
}

/** Multi-source distance (in hexes over land) to the goal hexes. */
function distanceField(g: GameState, goals: Iterable<number>): Int32Array {
  const d = new Int32Array(g.possession.length).fill(FAR);
  const q: number[] = [];
  for (const i of goals) { d[i] = 0; q.push(i); }
  for (let k = 0; k < q.length; k++) {
    const i = q[k];
    for (const n of neighboursOf(g, i)) if (passable(g, n) && d[n] === FAR) { d[n] = d[i] + 1; q.push(n); }
  }
  return d;
}

/** Enemy-held land next to own ground (where an advance goes), and the enemy's big cities. */
function enemyFrontier(c: Ctx): number[] {
  const { g } = c;
  const out: number[] = [];
  for (let i = 0; i < g.possession.length; i++) {
    if (g.possession[i] !== c.enemy || !passable(g, i)) continue;
    if (cityAt(g, i) || neighboursOf(g, i).some((n) => g.possession[n] === c.own)) out.push(i);
  }
  return out;
}

// ---------- 1. attacks ----------

/**
 * Worth attacking? Open ground: the defenders should likely retreat. A city (worth 100 times a hex, and half the
 * retreat chance, combat.md) is worn down instead: enough defender losses for the attacker's.
 */
const goodOdds = (e: CombatEstimate, aggressive: boolean, city: boolean) => city
  ? e.attackerLoss <= (aggressive ? 45 : 30) && e.defenderLoss >= Math.max(20, e.attackerLoss + 5)
  : e.attackerLoss <= (aggressive ? 40 : 30)
    && e.defenderLoss >= e.attackerLoss + (aggressive ? 5 : 8)
    && (e.retreatChance >= (aggressive ? 40 : 45) || e.defenderLoss >= (aggressive ? 50 : 40));

function planAttacks(c: Ctx, report: AiReport) {
  const { g } = c;
  // targets: known enemy hexes next to our forces
  const targets = new Set<number>();
  for (const f of ownForces(c)) for (const n of neighboursOf(g, f.hex)) if (knownEnemies(c, n).length) targets.add(n);
  const scored = [...targets].map((t) => ({ t, value: (cityAt(g, t) ? 150 : 0) + (bigCityAt(g, t) ? 50 : 0) - terrainBonus(g, t) + 100 - enemyPressureAt(c, t) / 10 }))
    .sort((a, b) => b.value - a.value || a.t - b.t);
  for (const { t } of scored) {
    const [tx, ty] = xyOf(g, t);
    if (!knownEnemies(c, t).length) continue; // already overrun this phase
    // attackers next to the target, by army (only one army's forces fight together, combat.ts resolveGroundCombat)
    const cands = neighboursOf(g, t).flatMap((n) => g.stacks[n].filter((l) => sideOf(unit(g, l)) === c.side))
      .filter((l) => !assaultTarget(g, l) && assaultPreview(g, l, tx, ty).allowed)
      .sort((a, b) => strengthL(g, b) - strengthL(g, a) || a - b);
    const byArmy = new Map<number, number[]>();
    for (const l of cands) { const k = corpsOf(g, l); if (!byArmy.has(k)) byArmy.set(k, []); byArmy.get(k)!.push(l); }
    const city = cityAt(g, t);
    for (const group of byArmy.values()) {
      // plot the strongest first and add forces until the estimate is good; a lone force only if it is good alone
      const plotted: number[] = [];
      let good = false;
      for (const l of group) {
        const est = estimateCombat(g, l, tx, ty);
        if (!plotted.length && group.length === 1 && !goodOdds(est, c.aggressive, city)) break;
        const out = assault(g, l, tx, ty);
        if (!out.ok) continue;
        if (out.result === 'overrun') { good = true; report.moved.push(l); break; }
        plotted.push(l);
        if (goodOdds(estimateCombat(g, l, tx, ty), c.aggressive, city)) { good = true; break; }
      }
      if (!good) for (const l of plotted) cancelAssault(g, l);
      if (good) break;
    }
    c.pv = perceivedState(g, c.side);
  }
}

function enemyPressureAt(c: Ctx, t: number): number {
  return knownEnemies(c, t).reduce((s, l) => s + strengthL(c.g, l), 0);
}

// ---------- 2-3. movement ----------

function bestMove(c: Ctx, leader: number, from: number, need: Map<number, number>, field: Int32Array, mode: MoveMode): { hex: number; score: number; reach: Reach } | null {
  const { g } = c;
  const r = orderReach(c.pv, leader, mode);
  if (r.cannot) return null;
  const myStr = strengthL(g, leader);
  const ready = forceUnits(g, leader).reduce((s, u) => s + u.readiness, 0) / Math.max(1, forceUnits(g, leader).length);
  const scoreAt = (i: number, staying: boolean) => {
    let s = -(c.aggressive ? 3 : 2) * Math.min(field[i], 60);
    const n = need.get(i) ?? 0;
    const pressure = enemyPressure(c, i);
    if (n > 0) s += (cityAt(g, i) ? 90 : 60) * n + terrainBonus(g, i);
    if (g.possession[i] === c.enemy) {
      // taking ground: cities above all (the victory level), empty land when the side is the stronger one
      const city = cityAt(g, i) ? 150 : 0;
      if (pressure < myStr * (city ? 2 : 1.2)) s += (c.aggressive ? 20 : 6) + city;
      else s -= 30; // a lone salient against stronger forces
    } else if (c.aggressive && pressure > 0) s += 8; // keep contact for the next attack
    if (!c.aggressive && pressure > myStr * 3 && !cityAt(g, i) && terrainBonus(g, i) < 10) s -= 35; // hopeless spot
    if (staying) {
      s += 4; // moving costs readiness
      if (ready < 60 && pressure === 0) s += 15; // rest
    }
    return s;
  };
  let best = { hex: from, score: scoreAt(from, true) };
  for (const node of r.nodes.values()) {
    if (node.hex === from || !node.canStop) continue;
    if (mode === 'sea' && !node.step.lands) continue;
    const s = scoreAt(node.hex, false);
    if (s > best.score || (s === best.score && node.hex < best.hex)) best = { hex: node.hex, score: s };
  }
  return { ...best, reach: r };
}

function moveForces(c: Ctx, report: AiReport) {
  const { g } = c;
  const need = frontNeeds(c);
  // goals: an attacking side heads for enemy cities and the enemy's edge; a defending one for the holes in its line
  const goals = c.aggressive ? [] : [...need.keys()];
  if (c.aggressive || !goals.length) {
    const frontier = enemyFrontier(c);
    const cities = frontier.filter((i) => cityAt(g, i));
    goals.push(...(c.aggressive && cities.length ? [...cities, ...frontier.filter((i) => !cityAt(g, i) && enemyPressure(c, i) === 0)] : frontier));
    for (const i of need.keys()) if (cityAt(g, i)) goals.push(i);
  }
  const field = distanceField(g, goals);
  // closest to the front first, so the line is filled by the nearest reserves
  const forces = ownForces(c)
    .filter((f) => !assaultTarget(g, f.leader) && !cannotMove(g, f.leader))
    .sort((a, b) => field[a.hex] - field[b.hex] || a.leader - b.leader);
  let railUsed = false;
  for (const f of forces) {
    const at = g.stacks.findIndex((s) => s.includes(f.leader));
    if (at < 0) continue;
    // a force holding a front hex alone does not leave it (a defending side; cities always). Self-play: letting
    // outmatched forces fall back opened gaps and lost more cities than it saved (docs/rules/ai.md 9.3)
    const own = g.stacks[at].filter((l) => sideOf(unit(g, l)) === c.side);
    if (enemyPressure(c, at) > 0 && own.length === 1 && g.possession[at] === c.own && (cityAt(g, at) || !c.aggressive)) continue;
    const a = allowance(g, f.leader);
    if (a.remaining <= 0) continue;
    const atSea = isDeepOcean(g.hexes[at].code) || g.hexes[at].terrain === 'japan';
    let choice: { hex: number; score: number; reach: Reach } | null = null;
    if (atSea && !seaMoveBlock(g, f.leader)) choice = bestMove(c, f.leader, at, need, field, 'sea');
    if (!choice) choice = bestMove(c, f.leader, at, need, field, 'tactical');
    // far from the front: try the railway (the engine limits rail moves per turn)
    if (!atSea && field[at] > 8 && !railUsed && canEntrain(g, f.leader)) {
      const rail = bestMove(c, f.leader, at, need, field, 'rail');
      if (rail && rail.hex !== at && (!choice || field[rail.hex] < field[choice.hex] - 3)) choice = rail;
    }
    if (!choice || choice.hex === at) continue;
    const path = pathTo(choice.reach, choice.hex);
    if (!path || !path.length) continue;
    const res = choice.reach.mode === 'rail' ? railMove(g, f.leader, path)
      : choice.reach.mode === 'sea' ? seaMove(g, f.leader, path)
        : moveForce(g, f.leader, path);
    if (!res.ok) { if (choice.reach.mode === 'rail') railUsed = true; continue; }
    report.moved.push(f.leader);
    const left = need.get(choice.hex);
    if (left) { if (left > 1) need.set(choice.hex, left - 1); else need.delete(choice.hex); }
    c.pv = perceivedState(g, c.side);
  }
}

/** Is the side the stronger one on what it knows? (unspotted enemy forces are allowed for under limited intel) */
function stronger(c: Ctx): boolean {
  const { g } = c;
  let own = 0, enemy = 0;
  g.stacks.forEach((s, i) => {
    for (const l of s) {
      if (sideOf(unit(g, l)) === c.side) own += strengthL(g, l);
      else if (c.pv.stacks[i].includes(l)) enemy += strengthL(g, l);
    }
  });
  return own >= enemy * (fogActive(g) ? 1.35 : 1.1);
}

/** The orders phase of `player` (g.player): attacks in the first orders phase, then movement. */
export function improvedOrders(g: GameState, player: Player): AiReport {
  const side: Side = player === 1 ? 'communist' : 'un';
  const report: AiReport = { player, phase: g.phase, ai: player === 1 ? 'kim-improved' : 'walton-improved', moved: [], assaults: 0, merged: 0, notices: [] };
  const c: Ctx = { g, side, own: POSSESSION_CODE[side], enemy: POSSESSION_CODE[side === 'un' ? 'communist' : 'un'], pv: perceivedState(g, side), aggressive: false };
  c.aggressive = stronger(c);
  if (g.phase === 1) planAttacks(c, report);
  moveForces(c, report);
  g.stacks.forEach((s) => { for (const l of s) if (sideOf(unit(g, l)) === side && assaultTarget(g, l)) report.assaults++; });
  report.moved = [...new Set(report.moved)];
  return report;
}
