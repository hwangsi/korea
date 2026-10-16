// The original UN computer player, WARRIORS.WALTON, ported from the code (docs/rules/ai.md 8). Pure logic.
//
//   waltonOrders     WALTON 5CF5: the driver, then the airfield repair of UN-held fields
//   driver           nested 5B63: for the ROK army and the other UN forces: three movement passes, then combat plans
//   moveForce        nested 52F8: OBJECTIVE, then MOVE_TO_OBJECTIVE or the route march, then MERGE_STACK
//   findObjective    nested 3C54 (+ 368C .. 3B0E): the target hex of a force (mode 0) or its assault target (mode 1),
//                    with the scenario scripts, the Inch'on / Kunsan landing (38CA) and the shuttle from Japan (39C9)
//   planCombat       nested 53E9 (+ 5369): plot assaults north to south, call off the weak ones, let others join
//   mergeStack       nested 34FC (+ 329B, 2C85): merge two forces sharing a hex, name the division / ROK corps
//
// Random numbers are drawn in the original order (STRONGER, ties, the landing rolls, the pull-back column, the
// wandering of idle forces, OVERRUN through MOVE_COST), so the same seed plays the same game. Like KIM, WALTON reads
// the real positions of the enemy (TERRAIN bytes), not only what it has spotted.

import type { GameState, UnitState } from '../state.ts';
import { STATUS_MOVED, idx, onMap, unit, forceUnits, corpsOf, rnd } from '../state.ts';
import { hexDistance } from '../hex.ts';
import { nationalMovementRate, enemyAdjacent, plottedAssault } from '../movement.ts';
import { forceStrength, decodeDirection } from '../combat.ts';
import { strongNeighbour } from '../endturn.ts';
import { COMMUNIST_SUPPLY_POINTS } from '../supply.ts';
import {
  codeAt, possAt, leadersAt, forceFlag, isArty, terrainOk, roadCode, nearTheFront, assaulting, othersAttacking,
  friendAdjacent, stronger, surrounded, withdraw, plotAttack, clearPlotsFull, moveToObjective, routeOf, followRoute,
  sortForce, teleport, mergeIntoStackmate, NO_ROUTE,
} from './common.ts';
import type { AiReport } from './types.ts';

const CITY = 0x93;
const UN = 1;
const COMMUNIST = 2;
/** SCENARIO = 4: Tomorrow's War (1995). */
const is1995 = (g: GameState) => g.scenarioNo === 4;
const nat = (u: Pick<UnitState, 'symbol'>) => Math.trunc(u.symbol / 10);
const isInfantry = (u: UnitState) => u.symbol % 10 === 2;
/** EURSUBS1.ENEMY_ADJACENT(x, y, false): a strong force (lethality >= 300) of the other possession next door. */
const strongEnemyNear = (g: GameState, x: number, y: number) => strongNeighbour(g, x, y, false);
/** WEATHER[0][0] mod 10 = 3. */
const storm = (g: GameState) => g.sky === 3;

// ---------- WALTON (5CF5) ----------

export function waltonOrders(g: GameState): AiReport {
  const report: AiReport = { player: 2, phase: g.phase, ai: 'walton', moved: [], assaults: 0, merged: 0, notices: [] };
  driver(g, report);
  // 5D9D: the computer's movers do not go through MOVE_UNIT; UN-held airfields out of action are put back to grade 1
  for (const af of g.airfields) if (g.possession[idx(g, af.x, af.y)] === UN && af.current === 0) af.current = 1;
  for (let id = g.firstUnUnit; id <= g.lastUnUnit; id++) if (forceFlag(g, id) && plottedAssault(unit(g, id).move)) report.assaults++;
  return report;
}

/** 5B3A: true outside the UN offensive window (turn 11 until the Chinese intervene). */
function cautious(g: GameState): boolean {
  return !(g.turn > 10 && g.turn < g.ccfIntervention);
}

interface CorpsPass {
  /** CORPS index: 2 ROK, 3 other UN. */
  k: number;
  /** 0 .. 2 */
  pass: number;
  /** NATIONAL_MOVEMENT_RATE of the corps' first unit */
  rate: number;
  /** 5B63 [bp-13h]: an amphibious landing was made this phase (no shuttle from Japan after it) */
  landed: { value: boolean };
}

/** Nested 5B63. */
function driver(g: GameState, report: AiReport) {
  const moved = new Set<number>();
  const landed = { value: false };
  for (let k = 2; k <= 3; k++) {
    const c = g.corps[k];
    if (!c || !g.units.has(c.from)) continue;
    const flag = cautious(g) ? 1 : 0;
    const rate = nationalMovementRate(g, unit(g, c.from));
    for (let pass = 0; pass <= 2; pass++) {
      for (let id = c.from; id <= c.to; id++) {
        if (!g.units.has(id) || !forceFlag(g, id)) continue;
        const u = unit(g, id);
        if (u.x < 0 || u.y <= 1) continue;
        const before = idx(g, u.x, u.y);
        moveForce(g, { k, pass, rate, landed }, id, flag, report);
        if (forceFlag(g, id) && idx(g, u.x, u.y) !== before) moved.add(id);
      }
    }
    if (g.phase !== 3) planCombat(g, { k, pass: 2, rate, landed });
  }
  report.moved = [...moved].filter((id) => forceFlag(g, id));
}

/** Nested 52F8. */
function moveForce(g: GameState, cp: CorpsPass, id: number, flag: number, report: AiReport) {
  const obj = findObjective(g, cp, id, flag, 0);
  // remake: a force merged into another one by its own scripts (1995 MERGE_STACK calls) no longer moves on its own
  // (the original would move the unit out of its force's chain)
  if (forceFlag(g, id)) {
    if (obj.score > 4 || routeOf(g, id) === NO_ROUTE) moveToObjective(g, 2, id, obj.x, obj.y);
    else followRoute(g, id, routeOf(g, id));
  }
  if (mergeStack(g, id)) report.merged++;
}

// ---------- OBJECTIVE (nested 3C54) ----------

interface Objective { score: number; x: number; y: number; }

/** 1995 forces kept east of column 18 (3CDD). */
const EAST_1995 = new Set([0x84, 0x92, 0x96, 0x97, 0x98, 0x99, 0x9b, 0x9c, 0x9e]);

/**
 * mode 0: where force `id` should go (score > 4: march there; <= 4: its route if it has one). mode 1: which adjacent
 * Communist hex it should assault. `flag` 0 is the offensive window (a 5-hex box, bypassed pockets count), 1 the
 * cautious rest of the war (3 rows north, 6 south; roads and cities to the north count).
 */
function findObjective(g: GameState, cp: CorpsPass, id: number, flag: number, mode: 0 | 1): Objective {
  const u = unit(g, id);
  const K = cp.k;
  const x0 = u.x, y0 = u.y;
  const isRok = nat(u) === 4;
  // [bp-29h] idle in the second orders phase, may wander on the last pass
  let mayRedeploy = g.phase === 3 && g.turn > 11 && !isArty(u, false) && (u.status & STATUS_MOVED) === 0;
  // [bp-24h] Seoul is back in UN hands (or 1995, or the ROK): the UN may go north of row 37
  const advance = (possAt(g, 14, 40) === UN || is1995(g) || isRok) && g.turn > 9;
  const eastOnly = is1995(g) && EAST_1995.has(id);
  // [bp-23h] the Pusan perimeter: before turn 9, or before 14 while the Communists hold a hex in row 49
  let crisis = false;
  if (g.turn < 14) {
    crisis = g.turn < 9;
    for (let x = 0; x <= 33; x++) if (possAt(g, x, 49) === COMMUNIST) crisis = true;
  }
  // [bp-25h] China will not come; [bp-26h] row 29 is clear of Communists between columns 7 and 16
  const noChina = g.ccfIntervention === 88;
  let row29Clear = true;
  if (!noChina) for (let x = 7; x <= 16; x++) if (possAt(g, x, 29) === COMMUNIST) row29Clear = false;
  let xr = flag === 0 ? 5 : 4;
  const strong = stronger(g, id, x0, y0);
  let north = 0, south = 0;
  if (mode === 1) { north = 1; south = 1; xr = 2; }
  else if (flag === 0) { north = 5; south = 5; }
  else { north = 3; south = 6; }

  // nested 368C / 36BB / 36DF: the target, and the score that goes with it
  let best = 0, chosen = 0, tx = x0, ty = y0;
  const setTarget = (x: number, y: number) => { tx = x; ty = y; chosen = best; };
  const forceTarget = (x: number, y: number) => { best = 20; setTarget(x, y); mayRedeploy = false; };
  const forceIfWeak = (x: number, y: number) => { if (best < 5) { best = 20; setTarget(x, y); } };
  // nested 3966: hold the hex while the force is its first force
  const holdIfAt = (x: number, y: number) => {
    if (u.x === x && u.y === y && leadersAt(g, x, y)[0] === id) forceTarget(x, y);
  };
  // nested 372E: scripted hops out of map pockets while the area is quiet
  const waypoint = (ax: number, ay: number, bx: number, by: number) => {
    if (x0 === ax && y0 === ay && mode !== 1 && !strongEnemyNear(g, ax, ay) && !strongEnemyNear(g, bx, by)) setTarget(bx, by);
  };

  setTarget(x0, y0);
  for (let cy = y0 - north; cy <= y0 + south; cy++) {
    for (let cx = x0 - xr; cx <= x0 + xr; cx++) {
      if (!onMap(g, cx, cy) || !terrainOk(g, cx, cy)) continue;
      if (cx <= 18 && eastOnly) continue;
      if (!advance && cy <= 37) continue;
      const northOf = cy < y0; // nested 3705
      let s = 0;
      if (isArty(u, false)) {
        // heavy artillery: just behind the line, with friends
        if (northOf && flag !== 0) s = 2;
        else if (cx === x0 && cy === y0) s = 1;
        if (leadersAt(g, cx, cy).length > 0 && possAt(g, cx, cy) === UN) s += 2;
        if (strongEnemyNear(g, cx, cy) || nearTheFront(g, cx, cy, 2)) s = 0;
      } else if (possAt(g, cx, cy) === COMMUNIST) {
        if (flag !== 0 && northOf) {
          if (roadCode(g, cx, cy)) s = 3;
          if (codeAt(g, cx, cy) === CITY) s = 5;
        }
        if (!friendAdjacent(g, K, cx, cy) && !friendAdjacent(g, -K, cx, cy)) s++;
        const occupied = leadersAt(g, cx, cy).length > 0;
        const joining = () => othersAttacking(g, id, cx, cy, K) && hexDistance(x0, y0, cx, cy) === 1;
        if (strong) {
          if (occupied) {
            if (friendAdjacent(g, K, cx, cy)) { s = 6; if (joining()) s = 7; }
            else if (friendAdjacent(g, -K, cx, cy)) s = 0;
            else s = 5;
            s += 6 - hexDistance(x0, y0, cx, cy);
          }
        } else if (occupied) {
          if (friendAdjacent(g, K, cx, cy)) { s = 5; if (joining()) s = 6; }
          else if (friendAdjacent(g, -K, cx, cy)) s = 5;
          else s = 7;
          s += 6 - hexDistance(x0, y0, cx, cy);
          // 41A8: early war, the ROK holds its ground near the enemy
          if (g.turn < 8 && g.scenarioNo < 4 && hexDistance(x0, y0, cx, cy) <= 3 && isRok) forceTarget(x0, y0);
        }
        // 41DC: in the offensive window, bypassed Communist hexes behind the line count
        if (flag === 0 && s > 0 && !northOf) s += 8;
        // 41F7: north of row 36, each army keeps to its sector (ROK east of column 13, the others west)
        if (cy < 36 && s > 0) {
          if (isRok) { if (cx >= 14) s += 4; }
          else if (cx <= 13) s += 4;
        }
        if (!occupied) {
          // 421F: empty Communist hexes that are not worth taking
          if (cy >= 62) s = 0;
          if (cx <= 14 && cy >= 41 && cy <= 51) s = 0;
          if (cx <= 6 && cy <= 28) s = 0;
          if (cx <= 5 && cy <= 31) s = 0;
          if (cx <= 6 && cy >= 25) s = 0;
          if (advance && g.turn < g.ccfIntervention) s = 0;
          if (cy < 29 && !noChina) s = 0;
        }
      }

      // 42F7: better wins; on a tie above 4 the closer (or as close) hex, from 1 to 4 a 1-in-3 roll (0 never)
      if (s > best) { best = s; setTarget(cx, cy); }
      else if (s === best && s > 0) {
        if (s > 4) {
          if (hexDistance(tx, ty, x0, y0) >= hexDistance(cx, cy, x0, y0)) { best = s; setTarget(cx, cy); }
        } else if (rnd(g, 1, 3) === 1) { best = s; setTarget(cx, cy); }
      }
    }
  }

  if (mode === 0) {
    // 43B3: nothing found and the UN may advance: the nearest Communist city (+80 in the army's own sector), in 20-hex steps
    if (best === 0 && advance && (noChina || y0 > 30)) {
      for (let cx = 0; cx <= 33; cx++) {
        for (let cy = 0; cy <= 65; cy++) {
          if (codeAt(g, cx, cy) !== CITY || possAt(g, cx, cy) !== COMMUNIST) continue;
          let v = 61 - hexDistance(cx, cy, x0, y0);
          if (isRok) { if (cx >= 14) v += 80; }
          else if (cx <= 13) v += 80;
          const w = Math.trunc(v / 20);
          if (w > best) { best = w; setTarget(cx, cy); }
        }
      }
    }
    // 449A: while China may come, no UN force stays north of row 29
    if (y0 < 29 && !noChina) {
      if (x0 <= 15) forceTarget(x0, 29);
      else forceTarget(rnd(g, 14, 16), 29);
    }
    // 44D5: China will not come and nothing is left: the Communist supply points
    if (advance && best === 0 && noChina) {
      const [sx, sy] = COMMUNIST_SUPPLY_POINTS[id % 7];
      if (possAt(g, sx, sy) === COMMUNIST) forceTarget(sx, sy);
    }
    scripts(g, cp, id, { x0, y0, crisis, advance, noChina, row29Clear }, forceTarget, forceIfWeak, holdIfAt);
  }

  // 5006: idle forces wander on the last pass of the second orders phase
  if (mayRedeploy && cp.pass === 2 && codeAt(g, x0, y0) !== CITY && !isArty(u, false) && !enemyAdjacent(g, x0, y0)) {
    const nx = x0 + rnd(g, 1, 7) - 4;
    const ny = y0 + rnd(g, 1, 5) - 3;
    forceTarget(nx, ny);
  }

  // 5081: map pockets
  waypoint(9, 38, 10, 37); waypoint(19, 39, 19, 40); waypoint(15, 18, 16, 18); waypoint(5, 38, 6, 36);
  waypoint(11, 51, 14, 50); waypoint(12, 50, 14, 50); waypoint(1, 25, 4, 23); waypoint(2, 24, 4, 23); waypoint(3, 24, 4, 23);
  waypoint(17, 30, 16, 29); waypoint(12, 45, 13, 47); waypoint(9, 46, 13, 47); waypoint(13, 47, 15, 46);
  waypoint(21, 61, 20, 59); waypoint(19, 61, 17, 61);
  if (best < 20) waypoint(12, 52, 17, 50);
  if (g.scenarioNo < 4) waypoint(12, 41, 14, 41);

  // 51E2: surrounded (WALTON moves second in this phase, or the second phase) and not stronger: fall back south
  const movesSecond = g.orderStep === 1 || g.phase === 3;
  if (movesSecond && mode === 0 && !strong && surrounded(g, x0, y0) && codeAt(g, x0, y0) !== CITY) {
    [tx, ty] = withdraw(g, -1, tx, ty);
    best = 5; setTarget(tx, ty);
  }
  // 5251: heavy artillery in contact falls back too
  if (g.turn > 0 && mode === 0 && isArty(u, false) && enemyAdjacent(g, x0, y0)) {
    [tx, ty] = withdraw(g, -1, tx, ty);
    best = 5; setTarget(tx, ty);
  }

  // 52A7: in the Pusan crisis, and north of row 37 while China may come, every force marches straight to its target
  if (crisis && y0 < 46) chosen += 5;
  if (!noChina && y0 < 37) chosen += 5;
  return { score: chosen, x: Math.max(0, Math.min(33, tx)), y: Math.max(0, Math.min(64, ty)) };
}

interface ScriptState {
  x0: number; y0: number;
  crisis: boolean; advance: boolean; noChina: boolean; row29Clear: boolean;
}

/** 4547..5006: scenario and unit scripts of OBJECTIVE mode 0 (the historical moves, garrisons, landings). */
function scripts(
  g: GameState, cp: CorpsPass, id: number, st: ScriptState,
  forceTarget: (x: number, y: number) => void, forceIfWeak: (x: number, y: number) => void, holdIfAt: (x: number, y: number) => void,
) {
  const T = g.turn;
  const { x0, y0, crisis, advance, noChina } = st;
  const at = (x: number, y: number) => x0 === x && y0 === y;
  const pos = (uid: number): [number, number] => { const v = g.units.get(uid); return v ? [v.x, v.y] : [0, 0]; };

  if (g.scenarioNo === 1) {
    // Dragon Wakes: the ROK army falls back on the Pusan perimeter, the US divisions come over from Japan
    if (id === 0xa6 && T === 1 && !storm(g)) { teleport(g, id, 28, 56); g.sealiftDemand++; }
    if (id === 0xad) {
      if (T === 0) forceTarget(x0, y0);
      if (T === 1) { teleport(g, id, 24, 50); g.sealiftDemand++; }
      if (T > 1 && T < 11) forceTarget(22, 50);
    }
    if (id === 0xb2) {
      if (T === 0) forceTarget(17, 61);
      else if (T < 6) forceTarget(23, 53);
      else if (T < 11) forceTarget(23, 54);
    }
    if (T < 11) {
      if (id === 0xa1) forceTarget(24, 40);
      if (id === 0xa5) forceTarget(17, 41);
      if (id === 0xa7) forceTarget(14, 40);
      if (id === 0xb0) forceTarget(24, 40);
      if (id === 0xa9) forceTarget(17, 43);
      if (id === 0xb1) forceTarget(17, 49);
      if (id === 0xaa) forceTarget(16, 47);
      if (id === 0x9f) forceTarget(16, 45);
      if (id === 0xac) forceTarget(18, 45);
      if (T >= 1 && id === 0xae) forceTarget(19, 43);
      if (T >= 2) {
        if (id === 0xa8) forceTarget(27, 49);
        if (id === 0xbb) forceTarget(27, 46);
        if (id >= 0xbc && id <= 0xbf && T < 7 && crisis) forceTarget(26, 51);
        if ((id === 0xc1 || id === 0xc4) && crisis) forceTarget(24, 50);
        if (id === 0xbe && crisis) forceTarget(24, 50);
        if (id === 0xc0) {
          if (T < 5) forceTarget(26, 52);
          else { const [cx, cy] = pos(0xc2); forceTarget(cx, cy + 1); }
        }
        if (id === 0xa6) forceTarget(23, 57);
        if (crisis) {
          if (id === 0xc8) forceTarget(24, 57);
          if (id === 0xc9) forceTarget(24, 59);
        }
      }
      // 47E3: turn 3, the 1st Cavalry Division forms in Japan and lands at P'ohang (or Kuryongp'o)
      if (T === 3) {
        mergeIntoStackmate(g, 0xc5);
        mergeIntoStackmate(g, 0xc7);
        const [cx, cy] = pos(0xc5);
        teleport(g, 0xc6, cx, cy);
        mergeIntoStackmate(g, 0xc6);
        const cav = g.units.get(0xc2);
        if (cav) cav.forceName = 'US 1st Cav Div';
        if (possAt(g, 27, 52) === UN) teleport(g, 0xc2, 27, 52);
        else teleport(g, 0xc2, 28, 56);
      }
      if (T >= 3) {
        if (id === 0xad) forceTarget(22, 50);
        if (id === 0xc3) forceTarget(26, 52);
        if (T < 9 && id <= 0xba && at(17, 51)) forceTarget(x0, y0);
        if (id === 0xd2 || id === 0xd3) forceTarget(pos(0xce)[0], unit(g, id).y);
        if (id === 0xc2 && T < 7) forceTarget(27, 52);
        if (crisis) {
          if (id === 0xcd) forceTarget(24, 57);
          if (id === 0xcc) forceTarget(24, 59);
          if (id === 0xce || id === 0xd0 || id === 0xd2) {
            forceTarget(23, 53);
            const div = g.units.get(0xce);
            if (div) div.forceName = 'US 2nd Div';
          }
        }
      }
    }
    // 493E: P'yongyang and Hamhung are held once taken
    if (noChina || st.row29Clear) holdIfAt(7, 29);
    if (noChina) holdIfAt(17, 24);
  }

  if (g.scenarioNo <= 2 && g.phase !== 3) {
    // 4972: the landing at Inch'on (or Kunsan) while the 7th Division's 17th RCT waits in Japan
    const rct = g.units.get(0xd8);
    if (!storm(g) && rct && rct.x === 33 && rct.y > 20) amphibiousInvasion(g, cp);
    // 499D: forces in Japan or at sea are shipped to the northernmost free UN port
    const u = unit(g, id);
    if (((u.x === 33 && u.y > 20) || codeAt(g, u.x, u.y) >= 0xa5) && g.sealiftDemand < 4 && !cp.landed.value) shipFromJapan(g, id);
  }

  if (g.scenarioNo < 4) {
    if (id === 0xd7 && !advance) forceTarget(x0, y0);
    // garrisons of the small UN contingents
    if (id === 0xe2) forceTarget(13, 59);
    if (id === 0xe7) forceTarget(24, 54);
    if (id === 0xeb) forceTarget(16, 45);
    if (id === 0xec) forceTarget(22, 34);
    if (id === 0xf3) forceTarget(14, 34);
    if (!crisis && !advance) forceIfWeak(14, 41);
    if (T >= 43 && codeAt(g, x0, y0) === CITY) forceTarget(x0, y0);
    return;
  }

  // 4ACD: Tomorrow's War (1995)
  if (at(17, 51)) forceIfWeak(15, 43);
  if (at(24, 54)) forceIfWeak(17, 39);
  if (at(13, 53)) forceIfWeak(14, 52);
  if (id === 0xba) {
    const [bx, by] = pos(0xb6);
    if (onMap(g, bx, by)) forceIfWeak(bx, by);
  }
  if (id === 0xbc || id === 0xbd) {
    const [bx, by] = pos(0xba);
    if (onMap(g, bx, by)) forceIfWeak(bx, 0xbd - id + by);
  }
  if (T === 0) {
    // 4B75: the corps artillery groups are formed, the line along the DMZ is manned
    mergeRename(g, x0, y0, 0x86, 15, 41, 'ROK 1 Army Arty');
    mergeRename(g, x0, y0, 0x88, 15, 41, 'ROK 1 Army Arty');
    mergeRename(g, x0, y0, 0x89, 15, 41, 'ROK 1 Army Arty');
    mergeRename(g, x0, y0, 0x8a, 15, 41, 'ROK 1 Army Arty');
    mergeRename(g, x0, y0, 0x85, 17, 40, 'ROK 2 Army Arty');
    mergeRename(g, x0, y0, 0x87, 17, 40, 'ROK 2 Army Arty');
    mergeRename(g, x0, y0, 0x84, 20, 38, 'ROK 3 Army Arty');
    mergeRename(g, x0, y0, 0x8b, 20, 38, 'ROK 3 Army Arty');
    const line: [number, number, number][] = [
      [0x9e, 22, 38], [0x9b, 20, 36], [0x98, 19, 38], [0x9c, 21, 37], [0x8e, 16, 38], [0x95, 15, 39], [0x9d, 15, 39],
      [0x8f, 17, 38], [0x94, 21, 37], [0xb6, 17, 39], [0xb9, 16, 40], [0x7f, 13, 40], [0x8c, 13, 40], [0x82, 22, 38],
      [0x92, 20, 36], [0x7c, 17, 38], [0x93, 14, 39], [0x8d, 14, 39], [0x90, 14, 38],
    ];
    for (const [uid, x, y] of line) if (id === uid) forceTarget(x, y);
  }
  if (T === 1) {
    for (const [x, y] of [[13, 40], [14, 39], [15, 39], [16, 38], [17, 38], [14, 40], [17, 39]]) if (at(x, y)) forceTarget(x0, y0);
    if (id === 0x8f) forceTarget(17, 38);
    if (id === 0x91) forceTarget(17, 38);
    if (id === 0x97) forceTarget(23, 39);
    if (id === 0x96) forceTarget(15, 40);
    if (id === 0xa1) { mergeStack(g, id); forceTarget(16, 38); }
    if (id === 0xa3) { mergeStack(g, id); forceTarget(15, 39); }
    if (id === 0xa5) { mergeStack(g, id); forceTarget(15, 40); }
  }
  if (T === 2) {
    if (at(14, 40)) forceTarget(x0, y0);
    if (id === 0x96) forceTarget(17, 41);
    if (id === 0xa8) forceTarget(25, 40);
    if (id === 0xae) { mergeStack(g, id); forceTarget(16, 40); }
    if (id === 0xb0) { mergeStack(g, id); forceTarget(14, 41); }
    if (id === 0xb2) { mergeStack(g, id); forceTarget(14, 42); }
  }
  if (T > 0 && T < 5) {
    if (isArty(unit(g, id), false) && y0 < 42) forceTarget(x0, y0);
    if (at(19, 38)) forceTarget(x0, y0);
    if (T > 2 && id === 0x96) forceTarget(20, 39);
  }
  if (T >= 14 && codeAt(g, x0, y0) === CITY) forceTarget(x0, y0);
}

/** Nested 3B0E: teleport force `uid` to (x, y); if it became the hex's second force, it joins the first, which is renamed. */
function mergeRename(g: GameState, x0: number, y0: number, uid: number, x: number, y: number, name: string) {
  if (!onMap(g, x0, y0)) return;
  teleport(g, uid, x, y);
  const s = g.stacks[idx(g, x, y)];
  if (s[1] !== uid) return;
  s.splice(1, 1);
  const lead = unit(g, s[0]);
  lead.forceName = name.slice(0, 20);
  let last = lead.id;
  while (unit(g, last).attached > 0) last = unit(g, last).attached;
  unit(g, last).attached = uid;
}

/** Nested 3787: an empty or Communist-held beach that is not a mined port. */
function canLand(g: GameState, x: number, y: number): boolean {
  let r = leadersAt(g, x, y).length === 0 || possAt(g, x, y) === COMMUNIST;
  for (const p of g.ports) if (p.x === x && p.y === y && p.mined) r = false;
  return r;
}

/** Nested 3828: the 1st Marines (215) and the 17th RCT (216) come ashore at (x1, y1), or assault it from the sea hex (x2, y2). */
function land(g: GameState, cp: CorpsPass, x1: number, y1: number, x2: number, y2: number) {
  cp.landed.value = true;
  g.sealiftDemand += 3;
  if (leadersAt(g, x1, y1).length === 0) {
    teleport(g, 0xd7, x1, y1);
    teleport(g, 0xd8, x1, y1);
  } else {
    teleport(g, 0xd7, x2, y2);
    teleport(g, 0xd8, x2, y2);
    if (forceFlag(g, 0xd7)) plotAttack(g, 0xd7, x2, y2, x1, y1);
    if (forceFlag(g, 0xd8)) plotAttack(g, 0xd8, x2, y2, x1, y1);
  }
}

/** Nested 38CA: 70% Inch'on (12,41) from (11,42), else 70% Kunsan (12,52) from (11,53). */
function amphibiousInvasion(g: GameState, cp: CorpsPass) {
  if (g.scenarioNo === 1) {
    // the two forces at Sasebo (33,59) change places and the 89th Tank Battalion joins the other one
    const s = g.stacks[idx(g, 33, 59)];
    if (s.length === 2) [s[0], s[1]] = [s[1], s[0]];
    mergeIntoStackmate(g, 0xcb);
  }
  if (rnd(g, 1, 10) < 7 && canLand(g, 12, 41)) { land(g, cp, 12, 41, 11, 42); return; }
  if (rnd(g, 1, 10) < 7 && canLand(g, 12, 52)) land(g, cp, 12, 52, 11, 53);
}

/** Nested 39C9: a force in Japan (fair weather) or at sea goes to the northernmost UN-held, unmined port with room. */
function shipFromJapan(g: GameState, id: number) {
  if (!forceFlag(g, id)) return;
  const u = unit(g, id);
  if (!((!storm(g) && u.x === 33 && u.y > 20) || codeAt(g, u.x, u.y) >= 0xa5)) return;
  let by = 99, bx = 0;
  for (const p of g.ports) {
    if (p.y >= by) continue;
    const s = leadersAt(g, p.x, p.y);
    if (s.length < 2 && possAt(g, p.x, p.y) === UN && !p.mined) { by = p.y; bx = p.x; }
  }
  if (by < 99) { teleport(g, id, bx, by); g.sealiftDemand++; }
}

// ---------- PLAN_COMBAT (nested 53E9) ----------

/** Nested 5369: a Communist-held, occupied land hex next to the force. */
function attackTargetOk(g: GameState, ux: number, uy: number, tx: number, ty: number): boolean {
  return possAt(g, tx, ty) === COMMUNIST && leadersAt(g, tx, ty).length > 0 && terrainOk(g, tx, ty) && hexDistance(ux, uy, tx, ty) === 1;
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

  // part 2: each assault group once: attackers + nearby heavy artillery against the defenders; the weak ones are called
  // off (no random cancel, unlike KIM)
  for (let id = c.from; id <= c.to; id++) {
    if (!forceFlag(g, id) || !mark.has(id)) continue;
    const u = unit(g, id);
    if (!onMap(g, u.x, u.y) || codeAt(g, u.x, u.y) >= 0xa5) continue;
    if (u.move <= 100) continue;
    const [dx, dy] = decodeDirection(Math.trunc(u.move / 100) % 10);
    const tx = u.x + dx, ty = u.y + dy;
    const own = forceStrength(g, id, u.x, u.y, 1);
    if (Math.trunc((own.S + own.L) / 10) <= 0) continue;
    let sum = 0;
    for (let v = c.from; v <= c.to; v++) {
      const a = assaulting(g, v, tx, ty);
      if (a > 0 && mark.has(v)) { mark.delete(v); sum += assaulting(g, v, tx, ty); }
    }
    for (let hx = tx - 2; hx <= tx + 2; hx++) {
      for (let hy = ty - 3; hy <= ty + 3; hy++) {
        if (!onMap(g, hx, hy) || hexDistance(tx, ty, hx, hy) > 2) continue;
        for (const f of leadersAt(g, hx, hy)) {
          if (!isArty(unit(g, f), false)) continue;
          const L = Math.trunc(forceStrength(g, f, hx, hy, 0).L / 10);
          sum += possAt(g, hx, hy) === COMMUNIST ? -L : L;
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
    if (sum < 0) {
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

// ---------- MERGE_STACK (nested 34FC, 329B, 2C85) ----------

/** Nested 329B: may force `a` take force `b` in (each pair is asked both ways). */
function canMerge(g: GameState, a: number, b: number): boolean {
  const ua = unit(g, a), ub = unit(g, b);
  let r = true;
  if (g.scenarioNo < 4) {
    if (nat(ua) === 4) {
      if (g.turn < 12) r = false;
      if (ua.x === 17 && ua.y === 51 && g.turn > 3) r = true; // Taejon
      if (nat(ub) !== 4) r = false;
    }
    if (g.turn < 5 && a === 0xbe) r = false;
    if (nat(ua) === 1 && nat(ub) !== 1) r = false; // USMC with USMC
    if (nat(ua) === 2 && nat(ub) !== 2) r = false; // Commonwealth with Commonwealth
    if (a === 0xdd) r = false; // 187th Airborne
    if (g.scenarioNo === 1 && a === 0xc2) r = false;
    if (a === 0xe2 || a === 0xe7 || a === 0xeb || a === 0xec || a === 0xf3) r = false; // garrisons
    if ((ua.x === 7 && ua.y === 29) || (ua.x === 17 && ua.y === 24)) r = false; // P'yongyang, Hamhung
    if (codeAt(g, ua.x, ua.y) >= 0xa5) r = false;
  } else {
    if (nat(ub) !== nat(ua)) r = false;
    if (nat(ua) === 4 && g.turn > 5) r = false;
    if (g.turn === 0 && a === 0x9c) r = false;
    if (g.turn === 1 && a === 0xa1 && ua.attached !== 0) r = false;
    if (isArty(ua, false) && !isArty(ub, false)) r = false;
  }
  return r;
}

/** Nested 34FC: two forces in the hex of unit `id` become one (at most 6 units, 4 infantry, both ways allowed). */
function mergeStack(g: GameState, id: number): boolean {
  const u0 = unit(g, id);
  if (!onMap(g, u0.x, u0.y)) return false;
  const x = u0.x, y = u0.y;
  const s = g.stacks[idx(g, x, y)];
  if (s.length < 2) return false;
  const [a, b] = s;
  const ua = forceUnits(g, a), ub = forceUnits(g, b);
  const infA = ua.filter(isInfantry).length, infB = ub.filter(isInfantry).length;
  if (ua.length + ub.length > 6 || infA + infB > 4 || !canMerge(g, a, b) || !canMerge(g, b, a)) return false;
  mergeAndName(g, x, y, a, b, infA + infB);
  return true;
}

/** TACSUBS.ROMANSTR (numbers below 100). */
function roman(n: number): string {
  if (n >= 100) return String(n);
  const tens = ['', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC'];
  const ones = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
  return tens[Math.trunc(n / 10)] + ones[n % 10];
}

/** Nested 2C85: the second force joins the first; a division (or 1995 ROK corps) gets its name. */
function mergeAndName(g: GameState, x: number, y: number, first: number, second: number, infantry: number) {
  const s = g.stacks[idx(g, x, y)];
  s.splice(1, 1);
  let last = first;
  while (unit(g, last).attached !== 0) last = unit(g, last).attached;
  unit(g, last).attached = second;
  // as in KIM: compares the second leader's MOVE but takes each unit's own (meant: the largest MOVE of all)
  let mv = 0;
  for (const u of forceUnits(g, first)) if (unit(g, second).move > mv) mv = u.move;
  for (const u of forceUnits(g, first)) u.move = mv;
  sortForce(g, x, y, 0);
  const lead = unit(g, s[0]);
  const threshold = g.scenarioNo < 4 || corpsOf(g, lead.id) === 3 ? 2 : 1;
  if (infantry <= threshold) return;

  // "US 8/1 Cav RCT" -> division "1" (the text after '/' up to the blank) -> "1st"
  let k = lead.name.indexOf('/') + 1;
  let num = '';
  while (k < lead.name.length && lead.name[k] !== ' ') num += lead.name[k++];
  const c = num[num.length - 1] ?? '', p = num.length > 1 ? num[num.length - 2] : '';
  const ord = num + (p === '1' ? 'th' : c === '1' ? 'st' : c === '2' ? 'nd' : c === '3' ? 'rd' : 'th');
  const regiments = forceUnits(g, lead.id).filter((v) => isInfantry(v) && v.name.includes(`/${num}`)).length;
  const rokCorps = g.scenarioNo === 4 && corpsOf(g, lead.id) === 2;
  if (regiments <= 1 && !rokCorps) return;
  if (rokCorps) {
    // 1995: a merged ROK force that still has its "+" name becomes the next ROK corps (UTILITY_SPACE[17], IV skipped)
    if (lead.forceName.includes('+')) {
      g.utility[17] = (g.utility[17] + 1) & 0xff;
      if (g.utility[17] === 4) g.utility[17]++;
      lead.forceName = `ROK ${roman(g.utility[17])} Corps`.slice(0, 20);
    }
  } else {
    const sp = lead.name.indexOf(' ');
    lead.forceName = (lead.name.slice(0, sp + 1) + ord + ' Div').slice(0, 20);
  }
  if (lead.name.includes('Cap')) lead.forceName = 'ROK Cap Div';
  if (lead.symbol === 22) lead.forceName = 'CW Div';
  if (lead.symbol === 12) lead.forceName = g.scenarioNo === 4 ? 'USMC 3rd Div' : 'USMC 1st Div';
}

