// Air operations, reproduced from the original code (docs/rules/air.md). Pure logic (no DOM).
//
//   startFinish / airUnitsOf          OPSSUBS.STARTFINISH, UNIT_AVAILABLE, unit list 03BC
//   airDivisor                        OPSSUBS.EFFECTIVE_STRENGTH (weather / basing divisor)
//   groundAttackStrength              OPSSUBS.GROUND_ATTACK_STRENGTH (Communist interception level, MiG Alley)
//   determineInterdiction / determineInterception / determineRedAir
//   chooseBases                       OPSSUBS.CHOOSE_BASES
//   airProjections / setMission       AIR_OPERATIONS nested 166E (Projections), 1B90 (re-select = next mission)
//   autoMissions                      AIRCMBT nested 0294 (+ 01A5 "UN in trouble")
//   superiorityLosses                 AIRCMBT nested 1C7A (1995 air superiority combat)
//   interdictionEffect                AIRCMBT nested 0051 (news + enemy stockpile)
//   strikeUnits / chooseStrikeTarget / resolveAirstrike   AIRCMBT nested 1A84 / 0B8E
//   beginAirCombat / continueAirCombat                    AIRCMBT.DO_AIR_COMBAT, split so a human can pick targets
//   checkAirForces                    ENDTURN.NEXT_TURN nested 1023 (1995 "air force has been neutralized")

import type { AirUnitState, GameState, Player } from './state.ts';
import { idx, onMap, rnd, newsFlash, corpsOf, forceUnits, unit, STATUS_READY } from './state.ts';
import { enemyAdjacent } from './movement.ts';
import { neighbor } from './hex.ts';

export const MISSION_SUPERIORITY = 0;
export const MISSION_GROUND = 1;
export const MISSION_INTERDICTION = 2;
export const BASE_JAPAN = 0;
export const BASE_KOREA = 1;
export const BASE_CARRIER = 2;

const MANCHURIA = 0x94;
const CITY = 0x93;
const USMC_INFANTRY = 12;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** GROUND_ATTACK_STRENGTH: MiG Alley, where the 1950s Communist interception level weakens airstrikes (x <= 14, y <= 26). */
export function inMigAlley(x: number, y: number): boolean {
  return x < 15 && y < 27;
}

export function airUnit(g: GameState, id: number): AirUnitState | undefined {
  return g.airUnits.find((a) => a.id === id);
}

/** OPSSUBS.UNIT_AVAILABLE: ENTRY_TURN <= TURN < EXIT_TURN (shot-down units get EXIT_TURN 0). */
export function unitAvailable(g: GameState, a: AirUnitState): boolean {
  return a.entryTurn <= g.turn && g.turn < a.exitTurn;
}

/**
 * OPSSUBS.STARTFINISH: air unit numbers of a player (Communist 1-13, UN 1-34 in the 1950s, 14-34 in 1995).
 * As in the original, asking for the 1950s UN range also copies RED_AIR into INTERCEPTION[Communist]
 * (the Communist interception level of the Strategic Report).
 */
export function startFinish(g: GameState, player: Player): [number, number] {
  if (player === 1) return [1, 13];
  if (g.scenarioNo < 4) { g.interception[0] = g.redAir; return [1, 34]; }
  return [14, 34];
}

function rangeUnits(g: GameState, from: number, to: number): AirUnitState[] {
  return g.airUnits.filter((a) => a.id >= from && a.id <= to).sort((a, b) => a.id - b.id);
}

/** CHOOSE_BASES nested 03BC: the active air units listed on the Air Operations screen (1950s 1-29). */
export function airUnitsOf(g: GameState, player: Player): AirUnitState[] {
  const [from, to] = g.scenarioNo < 4 ? [1, 29] : player === 1 ? [1, 13] : [14, 34];
  return rangeUnits(g, from, to).filter((a) => unitAvailable(g, a));
}

/** Air units of the player's STARTFINISH range that are active this turn. */
function activeUnits(g: GameState, player: Player): AirUnitState[] {
  const [from, to] = startFinish(g, player);
  return rangeUnits(g, from, to).filter((a) => unitAvailable(g, a));
}

/** OPSSUBS.EFFECTIVE_STRENGTH: divisor = sky (1 fair, 2 cloudy, 3 storm), -1 if all-weather, x2 if short range in Japan. */
export function airDivisor(g: GameState, a: AirUnitState): number {
  let d = g.sky;
  if (a.allWeather && d > 1) d--;
  if (a.base === BASE_JAPAN && !a.longRange) d *= 2;
  return Math.max(1, d); // the original divides by zero if the weather was never set
}

/**
 * OPSSUBS.GROUND_ATTACK_STRENGTH(unit, x, y): effective air-to-ground strength. In the 1950s interdiction
 * missions and strikes into MiG Alley lose (RED_AIR - air-to-air), and long-range ground attack units are halved.
 */
export function groundAttackStrength(g: GameState, a: AirUnitState, x: number, y: number): number {
  let s = a.airToGround;
  if (g.scenarioNo < 4 && (a.mission === MISSION_INTERDICTION || inMigAlley(x, y))) {
    s = clamp(a.airToGround - (g.redAir - a.airToAir), 0, a.airToGround);
  }
  if (a.longRange && a.mission === MISSION_GROUND && g.scenarioNo < 4) s = Math.trunc(s / 2);
  return Math.trunc(s / airDivisor(g, a));
}

/** Strengths shown on the Air Operations screen (nested 0889 / 1B90): long-range 1950s units halved on the matching mission. */
export function displayedStrengths(g: GameState, a: AirUnitState): { airToAir: number; airToGround: number } {
  const d = airDivisor(g, a);
  const half = (m: number) => (a.longRange && a.mission === m && g.scenarioNo < 4 ? 2 : 1);
  return {
    airToAir: Math.trunc(a.airToAir / (d * half(MISSION_SUPERIORITY))),
    airToGround: Math.trunc(a.airToGround / (d * half(MISSION_GROUND))),
  };
}

/** OPSSUBS.DETERMINE_INTERDICTION: INTERDICTION[player] = sum of interdiction units' GROUND_ATTACK_STRENGTH div 10. */
export function determineInterdiction(g: GameState, player: Player): number {
  let sum = 0;
  for (const a of activeUnits(g, player)) if (a.mission === MISSION_INTERDICTION) sum += groundAttackStrength(g, a, 0, 0);
  g.interdiction[player - 1] = Math.trunc(sum / 10);
  return g.interdiction[player - 1];
}

/** OPSSUBS.DETERMINE_RED_AIR (1950s): UN air superiority missions lower RED_AIR by (air-to-air div divisor) / 5, 0..200. */
export function determineRedAir(g: GameState): number {
  let sum = 0;
  for (const a of rangeUnits(g, 1, 34)) {
    if (!unitAvailable(g, a) || a.mission !== MISSION_SUPERIORITY) continue;
    const d = airDivisor(g, a) * (a.longRange && g.scenarioNo < 4 ? 2 : 1);
    sum += Math.trunc(a.airToAir / d);
  }
  g.redAir = clamp(g.redAir - Math.trunc(sum / 5), 0, 200);
  return g.redAir;
}

/** OPSSUBS.DETERMINE_INTERCEPTION (1995): air superiority units count fully, the others a fifth. */
export function determineInterception(g: GameState, player: Player): number {
  let sum = 0;
  for (const a of activeUnits(g, player)) {
    const d = airDivisor(g, a);
    sum += a.mission === MISSION_SUPERIORITY ? Math.trunc(a.airToAir / d) : Math.trunc(a.airToAir / (5 * d));
  }
  g.interception[player - 1] = sum;
  return sum;
}

/**
 * OPSSUBS.CHOOSE_BASES: airfield level 1 bases one propeller unit, level 2 one unit of any type, level 3 two.
 * Jets (no POOR_RUNWAYS) take the "any" places first, propeller units the rest; carrier units stay at sea and
 * long-range 1950s units in Japan. Marine Air Group 33 (11) and 12 (24) swap places (appendix F).
 */
export function chooseBases(g: GameState, player: Player = 2) {
  const list = airUnitsOf(g, player);
  let prop = 0, any = 0;
  for (const af of g.airfields) {
    if (af.current === 1) prop++;
    else if (af.current === 2) any++;
    else if (af.current === 3) any += 2;
  }
  if (g.scenarioNo < 4) {
    for (const a of list) {
      if (a.base === BASE_CARRIER || a.longRange || a.poorRunways) continue;
      if (any > 0) { any--; a.base = BASE_KOREA; } else a.base = BASE_JAPAN;
    }
    prop += any;
    for (const a of list) {
      if (a.base === BASE_CARRIER && !(g.turn > 11 && a.id === 11)) continue;
      if (a.longRange || !a.poorRunways) continue;
      if (prop > 0) { prop--; a.base = BASE_KOREA; } else a.base = a.id === 11 ? BASE_CARRIER : BASE_JAPAN;
    }
    const mag33 = airUnit(g, 11), mag12 = airUnit(g, 24);
    if (mag33 && mag12) {
      if (mag33.base === BASE_KOREA) {
        mag33.aircraft2 = 7; mag33.airToAir = 9; mag33.airToGround = 18; mag12.base = BASE_CARRIER; // + Tigercats
      } else {
        mag33.aircraft2 = 0; mag33.airToAir = 6; mag33.airToGround = 12; mag12.base = BASE_JAPAN;
      }
    }
  } else if (player === 2) {
    for (const a of list) {
      if (a.base === BASE_CARRIER || a.poorRunways) continue;
      if (any > 0 && (a.id < 24 || !a.longRange)) { any--; a.base = BASE_KOREA; } else a.base = BASE_JAPAN;
    }
    prop += any;
    for (const a of list) {
      if (a.base === BASE_CARRIER || !a.poorRunways) continue;
      if (prop > 0) { prop--; a.base = BASE_KOREA; } else a.base = BASE_JAPAN;
    }
  }
  g.version++;
}

// ---------- Air Operations screen (first orders phase) ----------

/** The player gives air orders himself (not the computer side, Air Campaign "Player Control" = REALITY[2]). */
export function airControlledByPlayer(g: GameState, player: Player): boolean {
  return g.computerSide !== player && g.airPlayerControl;
}

/**
 * KOREA 1A26: the Air Operations menu item exists for the UN (both sides in 1995) in the first orders phase,
 * with Player Control, while that side's air force has not been neutralized (UTILITY_SPACE[player + 11]).
 */
export function canPlanAir(g: GameState, player: Player = g.player): boolean {
  return (player === 2 || g.scenarioNo === 4) && g.phase === 1 && !g.gameOver &&
    airControlledByPlayer(g, player) && g.utility[player + 11] === 0 && airUnitsOf(g, player).length > 0;
}

/** Give an air unit its mission (the original cycles 0 -> 1 -> 2 -> 0 when a unit is re-selected). */
export function setMission(g: GameState, id: number, mission: number): boolean {
  const a = airUnit(g, id);
  if (!a || !canPlanAir(g) || !airUnitsOf(g, g.player).includes(a) || mission < 0 || mission > 2) return false;
  a.mission = mission;
  g.version++;
  return true;
}

export interface AirProjections {
  /** Active ground attack units (nested 035B). */
  strikes: number;
  interdiction: number;
  /** 1950s: Communist interception level during this turn's airstrikes, and at the start of the next turn. */
  cilNow: number | null;
  cilNext: number | null;
  /** 1995: friendly air superiority strength this turn. */
  superiority: number | null;
}

/** AIR_OPERATIONS nested 166E (Projections): compute with the current orders, then restore the globals. */
export function airProjections(g: GameState, player: Player = g.player): AirProjections {
  const saved = { redAir: g.redAir, interdiction: [...g.interdiction], interception: [...g.interception] };
  const strikes = activeUnits(g, player).filter((a) => a.mission === MISSION_GROUND).length;
  let cilNow: number | null = null, cilNext: number | null = null, superiority: number | null = null;
  if (g.scenarioNo < 4) {
    determineRedAir(g);
    determineInterdiction(g, player);
    cilNow = g.redAir;
    cilNext = g.redAir + (g.turn > 8 ? 10 : 0) + (g.turn > 24 ? 5 : 0);
  } else {
    superiority = determineInterception(g, player);
    determineInterdiction(g, player);
  }
  const interdiction = g.interdiction[player - 1];
  g.redAir = saved.redAir;
  g.interdiction = [saved.interdiction[0], saved.interdiction[1]];
  g.interception = [saved.interception[0], saved.interception[1]];
  return { strikes, interdiction, cilNow, cilNext, superiority };
}

/** Expected air reinforcements and withdrawals (nested 0889, 1950s UN). */
export function expectedAirChanges(g: GameState): { withdrawals: AirUnitState[]; reinforcements: AirUnitState[] } {
  const all = rangeUnits(g, 1, 34);
  return {
    withdrawals: all.filter((a) => a.entryTurn <= g.turn && a.exitTurn < 99 && a.exitTurn > g.turn),
    reinforcements: all.filter((a) => a.entryTurn > g.turn),
  };
}

// ---------- combat resolution phase (AIRCMBT.DO_AIR_COMBAT) ----------

/** AIRCMBT 01A5: the UN holds fewer hexes than RND(1,100), or Communists are in the Pusan area (or refugees, 1 in 5). */
function unInTrouble(g: GameState): boolean {
  let held = 0;
  for (let i = 0; i < g.possession.length; i++) if (g.possession[i] === 1) held++;
  for (let x = 23; x <= 28; x++) {
    for (let y = 51; y <= 59; y++) {
      const i = idx(g, x, y);
      if (g.possession[i] === 2 && g.stacks[i].length > 0) held = 0;
    }
  }
  let trouble = rnd(g, 1, 100) > held;
  if (g.refugees && rnd(g, 1, 5) === 1) trouble = true;
  return trouble;
}

/** AIRCMBT 0294: missions chosen by the program (computer side, or Air Campaign "Program Control"). */
export function autoMissions(g: GameState, player: Player) {
  const units = activeUnits(g, player);
  if (g.scenarioNo < 4) {
    for (const a of units) {
      if (a.airToAir > a.airToGround) a.mission = MISSION_SUPERIORITY;
      else if (a.longRange) a.mission = MISSION_INTERDICTION;
      else if (rnd(g, 1, g.redAir) >= 10) a.mission = MISSION_SUPERIORITY;
      else a.mission = rnd(g, 1, 3) > 1 ? MISSION_GROUND : MISSION_INTERDICTION;
      if (player === 2 && unInTrouble(g)) a.mission = MISSION_GROUND;
    }
  } else if (player === 1) {
    for (const a of units) a.mission = a.airToAir >= a.airToGround ? MISSION_SUPERIORITY : MISSION_GROUND;
  } else {
    for (const a of units) {
      const fight = a.airToAir > a.airToGround && g.utility[12] === 0;
      if (g.turn < 6) a.mission = fight ? MISSION_SUPERIORITY : rnd(g, 1, 2);
      else a.mission = fight ? rnd(g, 0, 2) : rnd(g, 1, 2);
    }
  }
  g.version++;
}

/** AIRCMBT 1C7A (1995): loss % = 10 * enemy INTERCEPTION / own (90 if none), applied to both strengths of every unit. */
export function superiorityLosses(g: GameState, player: Player): number {
  const own = g.interception[player - 1], enemy = g.interception[2 - player];
  const loss = clamp(own > 0 ? Math.trunc((10 * enemy) / own) : 90, 0, 90);
  for (const a of activeUnits(g, player)) {
    a.airToAir = Math.trunc((a.airToAir * (100 - loss)) / 100);
    a.airToGround = Math.trunc((a.airToGround * (100 - loss)) / 100);
    if (a.airToAir + a.airToGround === 0) a.exitTurn = 0;
  }
  g.version++;
  return loss;
}

const SIDE_EN: Record<Player, string> = { 1: 'Communist', 2: 'U.N.' };

/** AIRCMBT 0051: interdiction news and RND(1, IL) off the enemy stockpile. Returns the points destroyed. */
export function interdictionEffect(g: GameState, player: Player): number {
  const il = g.interdiction[player - 1];
  const v = Math.trunc(il / 10);
  const adverb = v <= 1 ? 'lightly' : v === 2 ? 'moderately' : 'strongly';
  if (il !== 0) newsFlash(g, `${SIDE_EN[player]} aircraft ${adverb} interdict ${SIDE_EN[(3 - player) as Player]} supply lines.`);
  let drawn = 0;
  const enemy = 2 - player;
  if (il > 0) {
    drawn = rnd(g, 1, il);
    g.stockpile[enemy] -= drawn;
  }
  g.stockpile[enemy] = clamp(g.stockpile[enemy], 0, 255);
  return drawn;
}

/** AIRCMBT 1E1B, as coded: some land hex (not Manchuria) is held by the UN. */
export function anyStrikeTargets(g: GameState): boolean {
  for (let i = 0; i < g.possession.length; i++) {
    const c = g.hexes[i].code;
    if (c < 0xa5 && c !== MANCHURIA && g.possession[i] === 1) return true;
  }
  return false;
}

/** AIRCMBT 1A84: one airstrike for each active ground attack unit with GROUND_ATTACK_STRENGTH(i, 0, 99) > 0. */
export function strikeUnits(g: GameState, player: Player): AirUnitState[] {
  return activeUnits(g, player).filter((a) => a.mission === MISSION_GROUND && groundAttackStrength(g, a, 0, 99) > 0);
}

/** AIRCMBT 0916: a neighbouring force is led by a USMC infantry unit. */
export function marineAdjacent(g: GameState, x: number, y: number): boolean {
  for (let d = 0; d < 6; d++) {
    const [nx, ny] = neighbor(x, y, d);
    if (!onMap(g, nx, ny)) continue;
    for (const leader of g.stacks[idx(g, nx, ny)].slice(0, 2)) if (g.units.get(leader)?.symbol === USMC_INFANTRY) return true;
  }
  return false;
}

export type StrikeTargetError = 'manchuria' | 'friendly';

/** Player target check (0F94 loop): any enemy-held hex, even an apparently empty one, but not Manchuria. */
export function strikeTargetError(g: GameState, player: Player, x: number, y: number): StrikeTargetError | null {
  if (x < 0 || y < 0 || x >= g.width || y >= g.height) return 'friendly';
  const i = idx(g, x, y);
  if (g.hexes[i].code === MANCHURIA) return 'manchuria';
  // possession 1 = UN, 2 = Communist; PLAYER 1 = Communist: possession == PLAYER is an enemy hex
  if (g.possession[i] !== player) return 'friendly';
  return null;
}

/** AIRCMBT 0B8E (program): the best scoring spotted enemy force, else a random enemy hex. */
export function chooseStrikeTarget(g: GameState, player: Player, a: AirUnitState): [number, number] {
  let best = { x: 0, y: 0, p: 0 };
  for (let x = 0; x <= 33; x++) {
    for (let y = 0; y <= 65; y++) {
      const i = idx(g, x, y);
      if (g.possession[i] !== player || g.spotted[i] <= 0) continue;
      g.stacks[i].slice(0, 2).forEach((leader, slot) => {
        const lead = unit(g, leader);
        let p = rnd(g, 1, 8);
        if (enemyAdjacent(g, x, y)) {
          const code = g.hexes[i].code;
          if (code === CITY) p++;
          if (code >= 0x0b && code <= 0x57) p++;
          p += 2;
          if (g.scenarioNo < 4 && g.possession[i] === 2 && a.base === BASE_CARRIER && marineAdjacent(g, x, y)) p += 2;
          for (let k = 0; k <= 3; k++) if (60 + 10 * k < lead.readiness) p++;
        }
        if (player === 2 && x >= 23 && y >= 51) p += 2;
        if (lead.move > 0) p++;
        if (lead.attached > 0) p++;
        if (slot === 1) p++;
        if (p > best.p) best = { x, y, p };
      });
    }
  }
  if (best.p > 0) return [best.x, best.y];
  let sx = 14, sy = 10, found = false, tries = 0;
  while (!found) {
    const x = rnd(g, 0, 33), y = rnd(g, 1, 64);
    if (g.possession[idx(g, x, y)] === player) { sx = x; sy = y; found = true; }
    if (++tries > 19) {
      for (let cx = 0; cx <= 33; cx++) {
        for (let cy = 0; cy <= 65; cy++) {
          const c = g.hexes[idx(g, cx, cy)].code;
          if (c < 0xa5 && c !== MANCHURIA && g.possession[idx(g, cx, cy)] === player) { sx = cx; sy = cy; }
        }
      }
      found = true;
    }
  }
  return [sx, sy];
}

export interface StrikeForceResult {
  leader: number;
  /** Spotting level 2: the report names the force, otherwise "Enemy unit". */
  named: boolean;
  /** 1 slightly, 2 moderately, 3 heavily damaged. */
  severity: number;
  /** Strike lethality % against this force (before the prepared-position reduction). */
  lethality: number;
  units: number;
  equipmentLost: number;
  readinessLost: number;
}

export interface AirStrikeResult {
  player: Player;
  airUnit: number;
  target: [number, number];
  /** Target chosen by the program. */
  auto: boolean;
  /** "Current Strike Lethality" before the target is known (GROUND_ATTACK_STRENGTH(i, 0, 99)). */
  baseLethality: number;
  found: boolean;
  forces: StrikeForceResult[];
  /** Explosions shown in the hex (severity of the last force hit). */
  explosions: number;
  /** 1995 anti-aircraft fire hit the striking unit (-1 / -1); destroyed if both strengths reached 0. */
  aaHit: boolean;
  airUnitDestroyed: boolean;
}

/** Lethality % of an airstrike by this unit on hex x, y (before prepared positions), as AIRCMBT 14E8..15BA. */
export function strikeLethality(g: GameState, a: AirUnitState, x: number, y: number): number {
  let L = groundAttackStrength(g, a, x, y);
  if (g.scenarioNo < 4 && (a.name.includes('Marine') || a.name.includes('Carrier')) && marineAdjacent(g, x, y)) L = Math.trunc((L * 3) / 2);
  const code = g.hexes[idx(g, x, y)].code;
  if (code >= 0x58 && code <= CITY) L = Math.trunc((L * 3) / 4);
  return L;
}

/** AIRCMBT 0B8E 131B..1987: spot the hex, hit every unit's equipment and readiness, AA fire in 1995. */
export function resolveAirstrike(g: GameState, player: Player, a: AirUnitState, x: number, y: number, auto = false): AirStrikeResult {
  const i = idx(g, x, y);
  const result: AirStrikeResult = {
    player, airUnit: a.id, target: [x, y], auto, baseLethality: groundAttackStrength(g, a, 0, 99),
    found: false, forces: [], explosions: 0, aaHit: false, airUnitDestroyed: false,
  };
  const stack = g.stacks[i].slice(0, 2);
  // CPLA forces are not spotted by airstrikes until six turns after the intervention
  const canSpot = !(g.scenarioNo < 4 && g.ccfIntervention + 6 > g.turn && stack.length > 0 && corpsOf(g, stack[0]) === 1);
  if (canSpot && g.spotted[i] === 0) g.spotted[i] = 1;
  let hit = 0, severity = 0;
  if (stack.length > 0 && g.spotted[i] !== 0) {
    result.found = true;
    for (const leader of stack) {
      const L0 = strikeLethality(g, a, x, y);
      const L = clamp(L0, 1, 100);
      const members = forceUnits(g, leader);
      let lost = 0, readinessLost = 0;
      for (const u of members) {
        const Lu = u.status & STATUS_READY ? Math.trunc((L * 3) / 4) : L;
        for (const e of u.equipment) {
          const n = e.assigned;
          const surv = g.equipmentTypes.get(e.type)?.survivability ?? 0;
          for (let j = 2; j <= n; j++) {
            if (rnd(g, 1, 100) <= Lu && surv < rnd(g, 1, 15)) { e.assigned--; lost++; }
          }
        }
        const before = u.readiness;
        u.readiness = clamp(u.readiness - Math.trunc(Lu / 2), 50, 100);
        readinessLost += before - u.readiness;
        hit++;
      }
      severity = clamp(Math.trunc((rnd(g, 1, 10) + L0) / 10), 1, 3);
      result.forces.push({ leader, named: g.spotted[i] > 1, severity, lethality: L, units: members.length, equipmentLost: lost, readinessLost });
    }
  }
  result.explosions = severity;
  if (rnd(g, 1, 10) < hit && g.scenarioNo >= 4) {
    if (a.airToAir > 0) a.airToAir--;
    if (a.airToGround > 0) a.airToGround--;
    if (a.airToAir + a.airToGround === 0) { a.exitTurn = 0; result.airUnitDestroyed = true; }
    result.aaHit = true;
  }
  g.version++;
  return result;
}

export interface AirSideReport {
  player: Player;
  /** Missions were given by the program this turn (computer side or Program Control). */
  autoMissions: boolean;
  /** Active units by mission: [air superiority, ground attack, interdiction]. */
  missions: [number, number, number];
  interdiction: number;
  /** Enemy stockpile points destroyed by interdiction. */
  stockpileHit: number;
  /** "Airstrikes cancelled. No targets!" */
  noTargets: boolean;
  strikesPlanned: number;
  strikes: AirStrikeResult[];
}

export interface AirReport {
  turn: number;
  /** 1950s: Communist interception level before and after the UN air superiority missions. */
  redAir: [number, number] | null;
  /** 1995 air superiority combat: loss % of each side's air units and the strengths compared. */
  superiority: { player: Player; loss: number; own: number; enemy: number }[];
  sides: AirSideReport[];
}

/** DO_AIR_COMBAT in progress (GameState.air): players with air operations, the current one, his remaining strikes. */
export interface AirPhaseState {
  report: AirReport;
  players: Player[];
  index: number;
  /** Interdiction and the strike list of players[index] are done. */
  started: boolean;
  /** Air units of players[index] that still have to fly their airstrike. */
  queue: number[];
}

function missionCounts(g: GameState, player: Player): [number, number, number] {
  const out: [number, number, number] = [0, 0, 0];
  for (const a of airUnitsOf(g, player)) if (a.mission >= 0 && a.mission <= 2) out[a.mission]++;
  return out;
}

/** DO_AIR_COMBAT up to the airstrikes: bases, program missions, Communist interception level / 1995 air superiority. */
export function beginAirCombat(g: GameState): AirPhaseState {
  const players: Player[] = g.scenarioNo === 4 ? [1, 2] : [2];
  const report: AirReport = { turn: g.turn, redAir: null, superiority: [], sides: [] };
  chooseBases(g, 2);
  const opening = g.turn === 0 || (g.turn === 11 && g.scenarioNo === 2) || (g.turn === 20 && g.scenarioNo === 3);
  for (const p of players) {
    const auto = !opening && !airControlledByPlayer(g, p);
    if (auto) autoMissions(g, p);
    if (g.scenarioNo >= 4) determineInterception(g, p);
    report.sides.push({
      player: p, autoMissions: auto, missions: missionCounts(g, p), interdiction: 0, stockpileHit: 0, noTargets: false,
      strikesPlanned: 0, strikes: [],
    });
  }
  if (g.scenarioNo < 4) {
    const before = g.redAir;
    determineRedAir(g);
    report.redAir = [before, g.redAir];
  } else if (g.utility[12] === 0 && g.utility[13] === 0) {
    const strength: [number, number] = [g.interception[0], g.interception[1]];
    for (const p of [1, 2] as Player[]) {
      report.superiority.push({ player: p, loss: superiorityLosses(g, p), own: strength[p - 1], enemy: strength[2 - p] });
    }
    for (const p of [1, 2] as Player[]) determineInterception(g, p);
  }
  return { report, players, index: 0, started: false, queue: [] };
}

function sideReport(air: AirPhaseState, p: Player): AirSideReport {
  return air.report.sides.find((s) => s.player === p)!;
}

/**
 * The rest of DO_AIR_COMBAT, player by player: interdiction and its effect, then the airstrikes. Strikes of a
 * program-controlled player are flown at once. Returns true while a human player still has to pick targets.
 */
export function continueAirCombat(g: GameState, air: AirPhaseState): boolean {
  while (air.index < air.players.length) {
    const p = air.players[air.index];
    const side = sideReport(air, p);
    if (!air.started) {
      air.started = true;
      side.interdiction = determineInterdiction(g, p);
      side.stockpileHit = interdictionEffect(g, p);
      air.queue = [];
      if (!anyStrikeTargets(g)) side.noTargets = true;
      else if (activeUnits(g, p).some((a) => a.mission === MISSION_GROUND)) air.queue = strikeUnits(g, p).map((a) => a.id);
      side.strikesPlanned = air.queue.length;
    }
    if (air.queue.length && airControlledByPlayer(g, p)) return true;
    while (air.queue.length) programStrike(g, air);
    air.index++;
    air.started = false;
  }
  return false;
}

/** The player whose airstrike is next, and the striking unit. */
export function pendingAirstrike(g: GameState): { player: Player; unit: AirUnitState; left: number; planned: number } | null {
  const air = g.air;
  if (!air || !air.started || !air.queue.length) return null;
  const p = air.players[air.index];
  const a = airUnit(g, air.queue[0]);
  if (!a) return null;
  return { player: p, unit: a, left: air.queue.length, planned: sideReport(air, p).strikesPlanned };
}

function programStrike(g: GameState, air: AirPhaseState): AirStrikeResult | null {
  const p = air.players[air.index];
  const a = airUnit(g, air.queue.shift()!);
  if (!a) return null;
  const [x, y] = chooseStrikeTarget(g, p, a);
  const r = resolveAirstrike(g, p, a, x, y, true);
  sideReport(air, p).strikes.push(r);
  return r;
}

export type AirstrikeOutcome = { ok: true; result: AirStrikeResult } | { ok: false; error: StrikeTargetError | 'none' };

/** The human player strikes hex x, y with his next air unit. */
export function flyAirstrike(g: GameState, x: number, y: number): AirstrikeOutcome {
  const next = pendingAirstrike(g);
  if (!next || !g.air) return { ok: false, error: 'none' };
  const err = strikeTargetError(g, next.player, x, y);
  if (err) return { ok: false, error: err };
  g.air.queue.shift();
  const r = resolveAirstrike(g, next.player, next.unit, x, y, false);
  sideReport(g.air, next.player).strikes.push(r);
  return { ok: true, result: r };
}

/** "Let the computer pick": the program chooses the target of the next airstrike (all = every remaining one). */
export function delegateAirstrikes(g: GameState, all = false): AirStrikeResult[] {
  const out: AirStrikeResult[] = [];
  if (!g.air || !pendingAirstrike(g)) return out;
  do {
    const r = programStrike(g, g.air);
    if (r) out.push(r);
  } while (all && g.air.queue.length);
  return out;
}

// ---------- NEXT_TURN ----------

/** ENDTURN.NEXT_TURN nested 1023 (1995): a side without any air unit left (EXIT_TURN > 0) is neutralized. */
export function checkAirForces(g: GameState) {
  if (g.scenarioNo < 4) return;
  const check = (from: number, to: number, flag: number, name: string) => {
    if (g.utility[flag] !== 0) return;
    if (rangeUnits(g, from, to).some((a) => a.exitTurn > 0)) return;
    g.utility[flag] = 1;
    newsFlash(g, `${name} air force has been neutralized.`);
  };
  check(1, 13, 12, 'North Korean');
  check(14, 34, 13, 'United Nations');
}
