// The original Communist computer player, WARRIORS.KIM, ported from the code (docs/rules/ai.md 2). Pure logic.
//
//   kimOrders        KIM 29DF: opening scripts, the driver, the airfield sweep, the opening notices
//   driver           nested 269D: for the NKPA and (1950s) the CPLA: movement passes over every force, then combat plans
//   moveForce        nested 1E41: FIND_OBJECTIVE, then MOVE_TO_OBJECTIVE or the route march, then CONSOLIDATE
//   findObjective    nested 0F4D (+ 0E25 .. 0EF4): the target hex of a force (MODE 0) or its assault target (MODE 1)
//   planCombat       nested 1F3F (+ 1EBF): plot assaults north to south, cancel weak ones, let others join
//   consolidate      nested 0C85 (+ 068C, 0B7C): merge two forces of the same army sharing a hex, name the division
//
// The random draws (STRONGER, ties, wandering, OVERRUN through MOVE_COST, the cancel roll) happen in the original
// order, so a game with the same seed always plays the same. The computer reads the real positions of the UN forces
// (TERRAIN bytes), not only what it has spotted, as the original does.

import type { GameState, UnitState } from '../state.ts';
import { STATUS_MOVED, idx, onMap, unit, forceUnits, corpsOf, rnd } from '../state.ts';
import { hexDistance } from '../hex.ts';
import { nationalMovementRate, enemyAdjacent, plottedAssault } from '../movement.ts';
import { forceStrength, decodeDirection } from '../combat.ts';
import { strongNeighbour } from '../endturn.ts';
import {
  codeAt, possAt, leadersAt, forceFlag, isArty, terrainOk, roadCode, nearTheFront, assaulting, othersAttacking,
  friendAdjacent, stronger, surrounded, withdraw, plotAttack, clearPlotsFull, moveToObjective, routeOf, followRoute,
  sortForce, NO_ROUTE,
} from './common.ts';
import type { AiReport } from './types.ts';

const CITY = 0x93;
const UN = 1;
const COMMUNIST = 2;

const inRange = (id: number, lo: number, hi: number) => id >= lo && id <= hi;
/** EURSUBS1.ENEMY_ADJACENT(x, y, false): a strong force (lethality >= 300) of the other possession next door. */
const strongEnemyNear = (g: GameState, x: number, y: number) => strongNeighbour(g, x, y, false);
const deployment = (g: GameState) => /s$/.test(g.scenarioId);

// ---------- KIM ----------

export function kimOrders(g: GameState): AiReport {
  const second = g.phase === 3;
  const report: AiReport = { player: 1, phase: g.phase, ai: 'kim', moved: [], assaults: 0, merged: 0, notices: [] };

  // 2A1D / 2A58: the Dragon Wakes opening. The script assumes the deployment edition (korea1s), which the original
  // always loads for a computer Communist player; the remake only applies it there (docs/rules/ai.md 2.1).
  if (g.turn === 0 && g.scenarioNo === 1 && deployment(g)) {
    if (!second) openingSeoul(g);
    else for (const id of [10, 18]) { const u = g.units.get(id); if (u) u.move = 18; }
  }

  // 2B1E: the first orders phase of an opening turn keeps the moves and assaults planned in the deployment edition
  const opening = g.turn === 0 || (g.scenarioNo === 2 && g.turn === 11) || (g.scenarioNo === 3 && g.turn === 20);
  if (!opening || second) driver(g, report);

  // 2B4C: the computer's movers do not go through MOVE_UNIT, so Communist-held airfields are put out of action here
  for (const af of g.airfields) if (g.possession[idx(g, af.x, af.y)] === COMMUNIST) af.current = 0;

  // the assaults standing at the end of the phase (planned now, or by the deployment edition on an opening turn)
  for (let id = 1; id < g.firstUnUnit; id++) if (forceFlag(g, id) && plottedAssault(unit(g, id).move)) report.assaults++;

  // 2BA3 (nested 2841): "... has been eliminated / Hex ... has been overrun!" (the deployment edition already removed them)
  if (g.turn === 0 && !second && deployment(g)) {
    if (g.scenarioNo === 1) report.notices.push({ unit: 'ROK 3/7 Inf Rgt', hex: [15, 38] }, { unit: 'ROK 8/7 Inf Rgt', hex: [15, 39] });
    else if (g.scenarioNo === 4) report.notices.push({ unit: 'ROK 11 Inf Bde', hex: [22, 34] });
  }
  return report;
}

/** 2A32..2A53: NKPA 4th Division (force 18) leaves (15,40) for (14,39) and plots its assault south onto Seoul. */
function openingSeoul(g: GameState) {
  const from = idx(g, 15, 40), to = idx(g, 14, 39);
  if (g.stacks[from][1] !== 18 || g.stacks[to].length) return; // not the deployment position (edited data)
  g.stacks[from].splice(1, 1);
  g.possession[to] = COMMUNIST;
  g.spotted[to] = 2;
  g.stacks[to].push(18);
  // the original writes only the leader (MOVE 816 = direction 8 (south) + 16 points); the remake keys forces on
  // their leader's hex, so every unit of the force goes along
  for (const u of forceUnits(g, 18)) { u.x = 14; u.y = 39; u.move = 816; }
}

/** 2674: the NKPA attacks in turns 0..11 and again once the Chinese have intervened (DIR 1); in between DIR 0. */
function offensive(g: GameState): boolean {
  return !(g.turn < g.ccfIntervention && g.turn > 11);
}

interface CorpsPass {
  /** CORPS index: 0 NKPA, 1 CPLA. */
  k: number;
  /** 0 .. competence div 3 */
  pass: number;
  /** NATIONAL_MOVEMENT_RATE of the corps' first unit */
  rate: number;
}

/** Nested 269D. */
function driver(g: GameState, report: AiReport) {
  const moved = new Set<number>();
  for (let k = 0; k <= 1; k++) {
    if (k !== 0 && g.scenarioNo >= 4) continue; // no Chinese in 1995
    const c = g.corps[k];
    if (!c || !g.units.has(c.from)) continue;
    const dir = k === 1 || offensive(g) ? 1 : 0;
    const rate = nationalMovementRate(g, unit(g, c.from));
    const passes = Math.trunc(g.competence / 3);
    for (let pass = 0; pass <= passes; pass++) {
      for (let id = c.from; id <= c.to; id++) {
        if (!g.units.has(id) || !forceFlag(g, id)) continue;
        const u = unit(g, id);
        if (u.x < 0 || u.y <= 1) continue;
        const before = idx(g, u.x, u.y);
        moveForce(g, { k, pass, rate }, id, dir, report);
        if (forceFlag(g, id) && idx(g, u.x, u.y) !== before) moved.add(id);
      }
    }
    if (g.phase !== 3) planCombat(g, { k, pass: 0, rate });
  }
  report.moved = [...moved].filter((id) => forceFlag(g, id));
}

/** Nested 1E41. */
function moveForce(g: GameState, cp: CorpsPass, id: number, dir: number, report: AiReport) {
  const obj = findObjective(g, cp, id, dir, 0);
  if (obj.score > 4 || routeOf(g, id) === NO_ROUTE || corpsOf(g, id) === 1) moveToObjective(g, 1, id, obj.x, obj.y);
  else followRoute(g, id, routeOf(g, id));
  if (consolidate(g, id)) report.merged++;
}

// ---------- FIND_OBJECTIVE (nested 0F4D) ----------

interface Objective { score: number; x: number; y: number; }

/**
 * MODE 0: where force `id` should go (score > 4: march there; <= 4: its route if it has one). MODE 1: which adjacent
 * UN hex it should assault. `dir` is 1 when advancing south (a bigger box to the south, roads and cities count).
 */
function findObjective(g: GameState, cp: CorpsPass, id: number, dir: number, mode: 0 | 1): Objective {
  const u = unit(g, id);
  const K = cp.k;
  const ux = u.x, uy = u.y;
  const second = g.phase === 3;
  let idle2 = second && !isArty(u, false) && (u.status & STATUS_MOVED) === 0;
  const ccfWait = g.scenarioNo < 4 && g.turn < 40 && inRange(id, 116, 127) && mode === 0;
  const corps = corpsOf(g, id);
  const holdNorth = possAt(g, 14, 40) === UN && g.turn > 8 && g.turn <= g.ccfIntervention && uy > 36
    && codeAt(g, ux, uy) !== CITY && !strongEnemyNear(g, ux, uy);
  let xr = dir === 0 ? 5 : 4;
  const strong = stronger(g, id, ux, uy);
  let north = 0, south = 0;
  if (mode === 1) { north = 1; south = 1; xr = 2; }
  else if (dir === 0) { north = g.competence + 1; south = g.competence + 1; }
  else { north = g.competence + 2; south = 3; }

  // nested 0E25 / 0E54 / 0E70: the target and the score that goes with it
  let best = 0, chosen = 0, tx = ux, ty = uy;
  const setTarget = (x: number, y: number) => { tx = x; ty = y; chosen = best; };
  const forceTarget = (x: number, y: number) => { best = 20; setTarget(x, y); };
  const historicTarget = (x: number, y: number) => { if (best < 5 && g.turn < g.ccfIntervention) { best = 20; setTarget(x, y); } };
  let cx = 0, cy = 0;
  // nested 0E9F: the candidate lies in direction DIR (south)
  const inDir = () => (dir > 0 && cy > uy) || (dir < 0 && cy < uy);
  // nested 0EF4: scripted hops out of map pockets while the area is quiet
  const moveIfAt = (ax: number, ay: number, bx: number, by: number) => {
    if (ux === ax && uy === ay && mode !== 1 && !strongEnemyNear(g, ax, ay) && !strongEnemyNear(g, bx, by)) setTarget(bx, by);
  };

  setTarget(ux, uy);
  for (cy = uy - north; cy <= uy + south; cy++) {
    for (cx = ux - xr; cx <= ux + xr; cx++) {
      if (!onMap(g, cx, cy) || !terrainOk(g, cx, cy)) continue;
      if (idle2 && cx <= 13 && cy >= 12) continue;
      if (ccfWait) continue;
      if (cy < uy && (id === 10 || id === 18 || id === 20) && g.turn <= 4 && g.scenarioNo !== 4) continue;
      if (corps === 1 && cx >= 19) continue;
      if (cy >= uy && holdNorth) continue;

      let s = 0;
      if (isArty(u, true)) {
        if (inDir()) s = 2;
        else if (cx === ux && cy === uy) s = 1;
        if (strongEnemyNear(g, cx, cy) || nearTheFront(g, cx, cy, 1)) s = 0;
        if ((id === 82 || id === 83) && cx < ux) s = 0;
      } else if (possAt(g, cx, cy) === UN) {
        if (dir !== 0 && inDir()) {
          if (roadCode(g, cx, cy)) s = 3;
          if (codeAt(g, cx, cy) === CITY) s = 5;
        }
        if (!friendAdjacent(g, K, cx, cy) && !friendAdjacent(g, -K, cx, cy)) s++;
        if (leadersAt(g, cx, cy).length > 0) {
          const joining = () => othersAttacking(g, id, cx, cy, K) && hexDistance(ux, uy, cx, cy) === 1;
          if (strong) {
            if (friendAdjacent(g, K, cx, cy)) { s = 6; if (joining()) s = 7; }
            else if (friendAdjacent(g, -K, cx, cy)) s = 0;
            else s = 5;
          } else {
            if (friendAdjacent(g, K, cx, cy)) { s = 5; if (joining()) s = 6; }
            else if (friendAdjacent(g, -K, cx, cy)) s = 0;
            else s = 7;
          }
          s += 6 - hexDistance(ux, uy, cx, cy);
        }
        if ((dir === 0 || !strong) && !inDir()) s += 8;
      }

      // 148A: better wins; on a tie above 4 the closer (or as close) hex, at 4 or below a 1-in-3 roll
      if (s > best) { best = s; setTarget(cx, cy); }
      else if (s === best) {
        if (s > 4) {
          if (hexDistance(tx, ty, ux, uy) >= hexDistance(cx, cy, ux, uy)) { best = s; setTarget(cx, cy); }
        } else if (rnd(g, 1, 3) === 1) { best = s; setTarget(cx, cy); }
      }
    }
  }

  // 1540: nothing found -> the nearest UN-held city, in 20-hex buckets
  if (mode === 0 && best === 0) {
    for (cx = 0; cx < g.width; cx++) {
      for (cy = 0; cy < g.height; cy++) {
        if (codeAt(g, cx, cy) !== CITY || possAt(g, cx, cy) !== UN || !(cy < uy || !holdNorth)) continue;
        const v = Math.trunc((61 - hexDistance(cx, cy, ux, uy)) / 20);
        if (v > best) { best = v; setTarget(cx, cy); }
      }
    }
  }

  if (mode === 0) {
    // 1601: historical objectives by scenario and unit
    if (g.scenarioNo === 1) {
      if (g.turn < 6) {
        if (id === 55 || id === 56) historicTarget(0, 22);
        if (id === 57 || id === 58) historicTarget(33, 6);
      } else {
        if (id === 55 || id === 56) historicTarget(2, 22);
        if (id === 57 || id === 58) historicTarget(29, 5);
      }
      if (inRange(id, 75, 77)) forceTarget(14, 40);
      if (id === 50) { best = 20; if (g.turn <= 8) setTarget(17, 27); else setTarget(17, 24); }
      if (id === 78 || id === 81 || id === 82) historicTarget(10, 22);
      if (inRange(id, 84, 86)) forceTarget(7, 29);
    }
    if (g.scenarioNo === 2) {
      if (id === 53) forceTarget(14, 40);
      if (inRange(id, 68, 70)) historicTarget(ux, uy);
      if (id === 84 || id === 85) forceTarget(17, 24);
      if (id === 65 || id === 66) forceTarget(7, 29);
      if (id === 63) forceTarget(33, 6);
      if (id === 67) forceTarget(2, 22);
    }
    if (g.scenarioNo === 3 && inRange(id, 75, 78)) {
      let found = false;
      for (cx = 21; cx <= 33; cx++) for (cy = 0; cy <= 10; cy++) {
        const c = codeAt(g, cx, cy);
        if (c < 0xa5 && c !== 0x94 && possAt(g, cx, cy) === UN) found = true;
      }
      if (!found) forceTarget(31, 6);
    }
    if (ccfWait) {
      // 182B: the Chinese 20th and 26th Armies keep to their sectors until turn 40
      best = 0; chosen = 0;
      const sector = (x0: number, x1: number, y0: number, y1: number, fx: number, fy: number) => {
        for (cx = x0; cx <= x1; cx++) for (cy = y0; cy <= y1; cy++) {
          if (possAt(g, cx, cy) !== UN || !terrainOk(g, cx, cy)) continue;
          best = 40 - hexDistance(ux, uy, cx, cy);
          if (best > chosen) setTarget(cx, cy);
        }
        if (best === 0) { forceTarget(fx, fy); idle2 = false; }
      };
      if (inRange(id, 116, 121)) sector(0, 18, 0, 24, 14, 17);
      if (inRange(id, 122, 127)) sector(7, 22, 29, 36, 12, 29);
    }
    if (g.scenarioNo === 4) {
      if (id === 23 && possAt(g, 14, 41) === COMMUNIST) forceTarget(14, 41);
      if (id === 119 && (best < 5 || ty < 43)) forceTarget(25, 45);
      if (id === 120 && (best < 5 || ty < 43)) forceTarget(23, 46);
      if (id === 121) forceTarget(17, 24);
      if (id === 122) forceTarget(7, 29);
      if (g.turn >= 14 && codeAt(g, ux, uy) === CITY) forceTarget(ux, uy);
    } else if (g.turn >= 43 && codeAt(g, ux, uy) === CITY) forceTarget(ux, uy);
  }

  // 1A71: an NKPA force sharing its hex with a Chinese force makes room (two rows north)
  if (mode === 0 && tx === ux && ty === uy && corpsOf(g, id) === 0) {
    for (const l of leadersAt(g, ux, uy).slice()) if (l !== id && corpsOf(g, l) === 1) forceTarget(ux, uy - 2);
  }

  // 1B4B: idle forces wander on the last pass of the second orders phase (competence 3 and up)
  if (idle2 && cp.pass !== 0 && Math.trunc(g.competence / 3) === cp.pass && codeAt(g, ux, uy) !== CITY
    && !isArty(u, false) && !enemyAdjacent(g, ux, uy)) {
    tx = ux + rnd(g, 1, 7) - 4;
    ty = uy + rnd(g, 1, 5) - 3;
  }

  // 1BE6: map pockets
  moveIfAt(9, 38, 10, 37); moveIfAt(19, 39, 19, 40); moveIfAt(15, 18, 16, 18);
  moveIfAt(5, 38, 6, 36); moveIfAt(11, 51, 14, 50); moveIfAt(12, 50, 14, 50);
  moveIfAt(1, 25, 4, 23); moveIfAt(2, 24, 4, 23); moveIfAt(3, 24, 4, 23);

  // 1C9A / 1D02: surrounded in the second phase, or heavy artillery in contact: WITHDRAW(+1) from the target
  // (a no-op in the original, see withdraw()), then go there with score 5
  if (mode === 0 && !strong && second && surrounded(g, ux, uy) && codeAt(g, ux, uy) !== CITY) {
    [tx, ty] = withdraw(g, 1, tx, ty);
    best = 5; setTarget(tx, ty);
  }
  if (mode === 0 && isArty(u, false) && enemyAdjacent(g, ux, uy)) {
    [tx, ty] = withdraw(g, 1, tx, ty);
    best = 5; setTarget(tx, ty);
  }

  // 1D51: the spearheads keep to their routes in the first ten turns (competence 3 and up)
  if (mode === 0 && g.scenarioNo < 4 && g.turn < 10 && g.competence > 2) {
    if (((id === 1 || id === 10 || id === 18) && (uy < 51 || possAt(g, 17, 51) === COMMUNIST)) || id === 20) {
      if (routeOf(g, id) !== NO_ROUTE) chosen = 4;
    }
  }

  // 1DA1: after the landings, even-numbered forces in the south turn back on Inch'on / Kunsan while the UN holds them
  if (mode === 0 && id % 2 === 0 && g.turn >= 11 && g.turn < g.ccfIntervention && uy > 41
    && (possAt(g, 12, 41) === UN || possAt(g, 12, 52) === UN) && !enemyAdjacent(g, ux, uy)) {
    if (possAt(g, 12, 41) === UN) forceTarget(12, 41);
    if (possAt(g, 12, 52) === UN) forceTarget(12, 52);
    chosen = best;
  }

  return { score: chosen, x: Math.max(0, Math.min(33, tx)), y: Math.max(0, Math.min(64, ty)) };
}

// ---------- PLAN_COMBAT (nested 1F3F) ----------

/** Nested 1EBF: a UN-held, occupied land hex next to the force. */
function attackTargetOk(g: GameState, ux: number, uy: number, tx: number, ty: number): boolean {
  return possAt(g, tx, ty) === UN && leadersAt(g, tx, ty).length > 0 && terrainOk(g, tx, ty) && hexDistance(ux, uy, tx, ty) === 1;
}

function planCombat(g: GameState, cp: CorpsPass) {
  const c = g.corps[cp.k];
  const mark = new Set<number>();
  const fresh = (u: UnitState) => u.move < cp.rate - 6;

  // part 1: every force next to the enemy, north to south, picks an adjacent target and plots the assault
  for (let row = 1; row <= 64; row++) {
    for (let id = c.from; id <= c.to; id++) {
      if (!forceFlag(g, id)) continue;
      const u = unit(g, id);
      if (u.y !== row) continue;
      const ux = u.x, uy = u.y;
      if (ux >= 0 && uy > 0 && fresh(u) && enemyAdjacent(g, ux, uy)) {
        const t = findObjective(g, cp, id, 0, 1);
        if (attackTargetOk(g, ux, uy, t.x, t.y)) plotAttack(g, id, ux, uy, t.x, t.y);
      }
      mark.add(id);
    }
  }

  // part 2: each assault group once: attackers + nearby artillery against the defenders; weak or unlucky ones are called off
  for (let id = c.from; id <= c.to; id++) {
    if (!forceFlag(g, id) || !mark.has(id)) continue;
    const u = unit(g, id);
    if (u.move <= 100) continue;
    const [dx, dy] = decodeDirection(Math.trunc(u.move / 100) % 10);
    const tx = u.x + dx, ty = u.y + dy;
    const own = forceStrength(g, id, u.x, u.y, 1);
    if (Math.trunc((own.S + own.L) / 10) <= 0) continue;
    let sum = 0;
    for (let v = c.from; v <= c.to; v++) {
      const a = assaulting(g, v, tx, ty);
      if (a > 0 && mark.has(v)) { mark.delete(v); sum += a; }
    }
    for (let hx = tx - 2; hx <= tx + 2; hx++) {
      for (let hy = ty - 3; hy <= ty + 3; hy++) {
        if (!onMap(g, hx, hy) || hexDistance(tx, ty, hx, hy) > 2) continue;
        for (const f of leadersAt(g, hx, hy)) {
          if (!isArty(unit(g, f), false)) continue;
          const L = Math.trunc(forceStrength(g, f, hx, hy, 0).L / 10);
          sum += possAt(g, hx, hy) === UN ? -L : L;
        }
      }
    }
    sum = Math.trunc((sum * 3) / 4);
    if (sum > 0) {
      for (const f of leadersAt(g, tx, ty)) {
        const s = forceStrength(g, f, tx, ty, 2);
        sum -= Math.trunc(s.L / 10) + Math.trunc(s.S / 10);
      }
    }
    if (sum < 0 || rnd(g, 1, g.competence + 4) === 1) {
      for (let v = c.from; v <= c.to; v++) if (assaulting(g, v, tx, ty) > 0) clearPlotsFull(g, v);
    }
  }

  // part 3: forces with points left (not heavy artillery) join one assault that others already plot next to them
  for (let id = c.from; id <= c.to; id++) {
    if (!forceFlag(g, id)) continue;
    const u = unit(g, id);
    const ux = u.x, uy = u.y;
    if (!(ux >= 0 && uy > 0 && fresh(u) && !isArty(u, false))) continue;
    for (let hx = ux - 1; hx <= ux + 1; hx++) {
      for (let hy = uy - 2; hy <= uy + 2; hy++) {
        if (hexDistance(hx, hy, ux, uy) !== 1 || !onMap(g, hx, hy)) continue;
        if (othersAttacking(g, id, hx, hy, cp.k) && fresh(u) && terrainOk(g, hx, hy)) plotAttack(g, id, ux, uy, hx, hy);
      }
    }
  }
}

// ---------- CONSOLIDATE (nested 0C85, 068C, 0B7C) ----------

/** Nested 0B7C: forces kept separate (garrisons, reinforcements, the Chinese 20th/26th Armies; 1995 artillery groups). */
function mayMerge(g: GameState, id: number): boolean {
  switch (g.scenarioNo) {
    case 1:
      return !(inRange(id, 55, 58) || id === 78 || id === 81 || id === 82 || id === 50 || inRange(id, 116, 127));
    case 2:
      return !(id === 53 || inRange(id, 68, 70) || id === 67 || id === 63 || id === 61 || inRange(id, 116, 127));
    case 3:
      return !(inRange(id, 75, 78) || inRange(id, 116, 127));
    case 4:
      return !((isArty(unit(g, id), true) && unit(g, id).attached > 0) || inRange(id, 119, 122));
    default:
      return true;
  }
}

/** After a move: two forces of the same army in the hex become one (at most 6 units, 4 of them infantry). */
function consolidate(g: GameState, id: number): boolean {
  const u0 = unit(g, id);
  if (!onMap(g, u0.x, u0.y)) return false;
  const x = u0.x, y = u0.y;
  const s = g.stacks[idx(g, x, y)];
  if (s.length < 2) return false;
  const [a, b] = s;
  const ua = forceUnits(g, a), ub = forceUnits(g, b);
  const inf = (us: UnitState[]) => us.filter((v) => v.symbol % 10 === 2).length;
  if (corpsOf(g, b) !== corpsOf(g, a) || ua.length + ub.length > 6 || inf(ua) + inf(ub) > 4 || !mayMerge(g, a) || !mayMerge(g, b)) return false;
  mergeAndRename(g, x, y, a, b, inf(ua) + inf(ub));
  return true;
}

const ordinal = (n: string) => {
  const c = n[n.length - 1], c1 = n.length > 1 ? n[n.length - 2] : '';
  if (c1 === '1') return `${n}th`;
  return n + (c === '1' ? 'st' : c === '2' ? 'nd' : c === '3' ? 'rd' : 'th');
};

/** Nested 068C. */
function mergeAndRename(g: GameState, x: number, y: number, first: number, second: number, infantry: number) {
  const s = g.stacks[idx(g, x, y)];
  s.splice(1, 1);
  let last = first;
  while (unit(g, last).attached !== 0) last = unit(g, last).attached;
  unit(g, last).attached = second;
  // the original compares the second leader's MOVE but takes each unit's own (meant: the largest MOVE of all);
  // kept as coded, since MOVE also carries the plotted assault
  let mv = 0;
  for (const u of forceUnits(g, first)) if (unit(g, second).move > mv) mv = u.move;
  for (const u of forceUnits(g, first)) u.move = mv;
  sortForce(g, x, y, 0);
  if (g.scenarioNo >= 4 || infantry <= 2) return;
  // "NKPA 50/15 Inf Rgt" -> division "15" -> "NKPA 15th Div" (CPLA: "20th Army"), if two or more of its regiments are here
  const lead = unit(g, s[0]);
  let k = lead.name.indexOf('/') + 1;
  let div = '';
  while (k < lead.name.length && lead.name[k] !== ' ') div += lead.name[k++];
  if (!div) return;
  const regiments = forceUnits(g, lead.id).filter((v) => v.symbol % 10 === 2 && v.name.includes(`/${div}`)).length;
  const title = ordinal(div) + (corpsOf(g, lead.id) === 1 ? ' Army' : ' Div');
  if (regiments > 1) lead.forceName = (lead.name.slice(0, 5) + title).slice(0, 20);
}
