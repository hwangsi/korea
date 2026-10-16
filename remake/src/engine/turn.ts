// Turn sequence, reproduced from the original main loop (docs/rules/turn.md). Pure logic (no DOM).
//
//   startNewGame     TACSUBS.LOAD_NEW_GAME (weather, intelligence option) + KOREA.INIT_GAME turn-0 events
//                    + the first PHASE_PULSE(1)
//   initiative       KOREA.PHASE_PULSE 1E76 (who moves first, recomputed for each orders phase)
//   endPlayerPhase   KOREA.NEXT_PLAYER + the PHASE_PULSE player loop + the main loop:
//                    PHASE 1 orders -> PHASE 2 (FORCE_SPOTTING, DO_AIR_COMBAT, DO_GROUND_COMBAT) -> PHASE 3 orders
//                    -> PHASE 4 (UNSPOT_EVERYTHING, REST_UP, GROUND_REINFORCEMENTS, RED_AIR, CHECK_CHINA,
//                    MINE_WARFARE, DO_PATROLS, DO_INTEL, CHECK_BIGHEXES, END_TEST) -> NEXT_TURN

import type { GameState, NewsItem, Player } from './state.ts';
import { idx, onMap, rnd, newsFlash } from './state.ts';
import { enemyAdjacent } from './movement.ts';
import { resolveGroundCombat } from './combat.ts';
import type { CombatReport } from './combat.ts';
import { restUp } from './supply.ts';
import type { ResupplyReport } from './supply.ts';
import { doWeather, initWeather } from './weather.ts';
import { beginAirCombat, continueAirCombat, delegateAirstrikes, checkAirForces } from './air.ts';
import type { AirReport } from './air.ts';
import {
  unspotEverything, groundReinforcements, checkChina, mineWarfare, doPatrols, doIntel, checkBigHexes, terrainHeld,
  gameOverResult,
} from './endturn.ts';
import type { ReinforcementReport, PatrolReport, MineReport, IntelReport, CityChange, GameResult } from './endturn.ts';

export const PHASE_FIRST_ORDERS = 1;
export const PHASE_COMBAT = 2;
export const PHASE_SECOND_ORDERS = 3;
export const PHASE_RESOLUTION = 4;

export interface StartOptions {
  /** SCENARIO[2]: 1 Pushover .. 5 Hideous (3 = Challenging, historical), 6 = Random (RND(1,5) at the start). */
  competence?: number;
  /** SCENARIO[3]: 0 two players, 1 computer plays Communist, 2 computer plays UN. */
  computerSide?: number;
  /** REALITY[4]: limited intelligence. false = complete (every hex spotted to level 2). */
  limitedIntel?: boolean;
  /** SCENARIO[6]: Fixed CCF intervention (default Historical). */
  ccfFixed?: boolean;
  /** REALITY[2] Air Campaign: Player Control (default) or Program Control. */
  airPlayerControl?: boolean;
}

export type TurnEvent =
  | { kind: 'ordersPhase'; phase: number; player: Player; reinforcements: boolean }
  | { kind: 'noFirstPhase'; player: Player }
  | { kind: 'computerPhase'; phase: number; player: Player }
  | { kind: 'airstrikes'; player: Player; count: number }
  | { kind: 'air'; report: AirReport }
  | { kind: 'combat'; reports: CombatReport[] }
  | { kind: 'resolution'; report: ResolutionReport }
  | { kind: 'gameOver'; reason: string };

export interface ResolutionReport {
  /** Turn that just ended. */
  turn: number;
  supply: ResupplyReport;
  reinforcements: ReinforcementReport;
  mines: MineReport;
  /** Ground patrols, guerrillas and the P'yongyang / Hamhung reversion (DO_PATROLS). */
  patrols: PatrolReport;
  intel: IntelReport;
  cities: CityChange[];
  /** CHECK_CHINA made its decision this turn. */
  chinaDecided: boolean;
  /** Stockpiles [Communist, UN] before and after the phase (replacement shipments, draws, demands). */
  stockpileBefore: [number, number];
  stockpileAfter: [number, number];
  refugees: boolean;
  news: NewsItem[];
  gameOver: string | null;
}

// ---------- initiative ----------

/**
 * PHASE_PULSE 1E76: players of an orders phase in order. A RND(1,200) roll against
 * STOCKPILE[Communist] + 100 - STOCKPILE[UN] picks a player; the first orders phase reverses it,
 * so the side with the larger stockpile tends to move second in phase 1 and first in phase 3.
 */
export function initiative(g: GameState, phase: number): [Player, Player] {
  let p: Player = g.stockpile[0] + 100 - g.stockpile[1] >= rnd(g, 1, 200) ? 1 : 2;
  if (g.turn === 0) p = 1;
  if (g.turn === 11 && g.scenarioNo === 2) p = 2;
  if (g.turn === 20 && g.scenarioNo === 3) p = 1;
  if (phase === PHASE_FIRST_ORDERS) p = (3 - p) as Player;
  return [p, (3 - p) as Player];
}

/** PHASE_PULSE 1F1A: the UN has no first orders phase on the first turn of Dragon Wakes, Cold Steel, 1995. */
export function hasOrdersPhase(g: GameState, player: Player, phase: number): boolean {
  const opening = g.scenarioNo === 3 ? g.turn <= 20 : g.turn <= 0;
  return !(opening && player === 2 && phase !== PHASE_SECOND_ORDERS);
}

/** KOREA.FORCE_SPOTTING: occupied unspotted hexes next to enemy forces become spotted (level 1). */
export function forceSpotting(g: GameState) {
  for (let i = 0; i < g.stacks.length; i++) {
    if (g.spotted[i] !== 0 || g.stacks[i].length === 0) continue;
    const x = i % g.width, y = Math.floor(i / g.width);
    if (enemyAdjacent(g, x, y)) g.spotted[i] = 1;
  }
}

// ---------- phases ----------

function beginOrdersPhase(g: GameState, phase: number, events: TurnEvent[]) {
  g.phase = phase;
  g.order = initiative(g, phase);
  g.orderStep = -1;
  advancePlayer(g, events);
}

/** Move to the next player of the current orders phase; false when the phase is over. */
function advancePlayer(g: GameState, events: TurnEvent[]): boolean {
  while (++g.orderStep < 2) {
    const p = g.order[g.orderStep];
    if (!hasOrdersPhase(g, p, g.phase)) { events.push({ kind: 'noFirstPhase', player: p }); continue; }
    forceSpotting(g);
    g.player = p;
    g.undo = null;
    if (g.computerSide === p) {
      // computer player (WARRIORS.KIM / WALTON) not implemented yet: its forces stand still
      events.push({ kind: 'computerPhase', phase: g.phase, player: p });
      continue;
    }
    // PLAYER_PHASE 1C70: "Reinforcements have arrived" (UTILITY_SPACE[19] Communist, [18] UN)
    events.push({ kind: 'ordersPhase', phase: g.phase, player: p, reinforcements: g.phase === PHASE_FIRST_ORDERS && g.utility[20 - p] === 1 });
    g.version++;
    return true;
  }
  return false;
}

/** Start a freshly loaded scenario: weather, intelligence option, turn-0 events, then the first orders phase. */
export function startNewGame(g: GameState, opts: StartOptions = {}): TurnEvent[] {
  // LOAD_NEW_GAME 4A0B: "Random?" is rolled before the scenario file is read (docs/rules/options.md 2)
  g.competence = opts.competence === 6 ? rnd(g, 1, 5) : opts.competence ?? 3;
  g.computerSide = opts.computerSide ?? 0;
  g.limitedIntel = opts.limitedIntel ?? false;
  g.ccfFixed = opts.ccfFixed ?? false;
  g.airPlayerControl = opts.airPlayerControl ?? true;
  g.air = null;
  g.utility[11] = 0; // LOAD_NEW_GAME 4C17: not started yet
  initWeather(g);
  if (!g.limitedIntel) g.spotted.fill(2);
  // INIT_GAME 06D9: first turn of a new game
  if (g.turn === 0 && g.utility[11] === 0) {
    g.sealiftDemand = 0;
    g.airliftDemand = 0;
    g.railDemand = [0, 0];
    if (g.scenarioNo === 4 && g.computerSide !== 1) {
      newsFlash(g, 'North Korean forces invade South Korea.');
      newsFlash(g, 'North Korean commandos attack South Korean supply dumps.');
      g.stockpile[1] -= rnd(g, 1, 10);
    }
    if (g.scenarioNo === 1) {
      g.refugees = true;
      if (g.computerSide !== 1) newsFlash(g, 'Civilian refugees clog Korean roads.');
    }
    g.utility[11] = 1;
  }
  g.gameOver = null;
  const events: TurnEvent[] = [];
  beginOrdersPhase(g, PHASE_FIRST_ORDERS, events);
  return events;
}

/**
 * PHASE 2 after FORCE_SPOTTING: DO_AIR_COMBAT, then DO_GROUND_COMBAT. Returns true when it stopped because
 * a human player has to pick airstrike targets (flyAirstrike / delegateAirstrikes, then endPlayerPhase again).
 */
function runCombatPhase(g: GameState, events: TurnEvent[]): boolean {
  const air = g.air ?? (g.air = beginAirCombat(g));
  if (continueAirCombat(g, air)) {
    const p = air.players[air.index];
    g.player = p;
    g.version++;
    events.push({ kind: 'airstrikes', player: p, count: air.queue.length });
    return true;
  }
  g.air = null;
  events.push({ kind: 'air', report: air.report });
  events.push({ kind: 'combat', reports: resolveGroundCombat(g) });
  return false;
}

/** Airstrikes are waiting for the human player's targets (combat phase). */
export function airstrikesPending(g: GameState): boolean {
  return g.phase === PHASE_COMBAT && !!g.air && g.air.queue.length > 0;
}

/**
 * The current player ends his orders phase (NEXT_PLAYER). Runs everything up to the next human
 * orders phase: the other player's phase, combat, second orders, general resolution and the next turn.
 * In the combat phase it continues after the human player's airstrikes; strikes he has not flown yet
 * get targets chosen by the program.
 */
export function endPlayerPhase(g: GameState): TurnEvent[] {
  const events: TurnEvent[] = [];
  if (g.gameOver) return events;
  for (let guard = 0; guard < 8; guard++) {
    if (g.phase === PHASE_COMBAT) {
      if (g.air && g.air.queue.length) delegateAirstrikes(g, true);
      if (runCombatPhase(g, events)) return events;
      beginOrdersPhase(g, PHASE_SECOND_ORDERS, events);
      if (g.orderStep < 2) return events;
      continue;
    }
    if (g.phase === PHASE_FIRST_ORDERS || g.phase === PHASE_SECOND_ORDERS) {
      if (advancePlayer(g, events)) return events;
      if (g.phase === PHASE_FIRST_ORDERS) {
        // PHASE 2: combat resolution
        g.phase = PHASE_COMBAT;
        g.undo = null;
        g.air = null;
        forceSpotting(g);
        continue;
      }
      // PHASE 4: general resolution, then the next turn
      const report = generalResolution(g);
      events.push({ kind: 'resolution', report });
      if (report.gameOver) { events.push({ kind: 'gameOver', reason: report.gameOver }); return events; }
      nextTurn(g);
      beginOrdersPhase(g, PHASE_FIRST_ORDERS, events);
      if (g.orderStep < 2) return events;
      continue;
    }
    break;
  }
  return events;
}

/** PHASE 4 of the main loop (KOREA 2086..20EA). */
export function generalResolution(g: GameState): ResolutionReport {
  g.phase = PHASE_RESOLUTION;
  g.undo = null;
  const newsFrom = g.news.length;
  const stockpileBefore: [number, number] = [g.stockpile[0], g.stockpile[1]];
  unspotEverything(g);
  const supply = restUp(g);
  const reinforcements = groundReinforcements(g);
  if (g.turn > 8) g.redAir += 10;
  if (g.turn > 24) g.redAir += 5;
  const chinaDecided = checkChina(g);
  const mines = mineWarfare(g);
  const patrols = doPatrols(g);
  const intel = doIntel(g);
  const cities = checkBigHexes(g);
  const gameOver = g.victoryVoid ? null : endTest(g);
  g.gameOver = gameOver;
  g.version++;
  return {
    turn: g.turn, supply, reinforcements, mines, patrols, intel, cities, chinaDecided,
    stockpileBefore, stockpileAfter: [g.stockpile[0], g.stockpile[1]],
    refugees: g.refugees, news: g.news.slice(newsFrom), gameOver,
  };
}

// ---------- end of game (KOREA.END_TEST) ----------

/** KOREA.END_TEST: reason the game ends after this turn, or null. */
export function endTest(g: GameState): string | null {
  if (g.turn === 44) return 'lastTurn';
  if (g.turn === 26 && g.ccfIntervention >= 88) return 'noIntervention';
  if (g.turn === 15 && g.scenarioNo === 4) return 'lastTurn1995';
  let communistHex = false, unCity = false;
  for (let i = 0; i < g.possession.length; i++) {
    const x = i % g.width, y = Math.floor(i / g.width);
    if (!onMap(g, x, y)) continue;
    if (g.possession[i] === 2) communistHex = true;
    if (g.hexes[i].code === 0x93 && g.possession[i] === 1) unCity = true;
  }
  if (!communistHex) return 'unHoldsAll';
  if (!unCity) return 'communistHoldsCities';
  return null;
}

/** "Peace talks have begun" -> End game: ENDTURN.GAME_OVER. The game stays over. */
export function finishGame(g: GameState): GameResult {
  return gameOverResult(g);
}

/** "Peace talks have begun" -> OVERRIDE (KOREA 19D3): play on, victory conditions no longer count. */
export function continuePastEnd(g: GameState): TurnEvent[] {
  if (!g.gameOver) return [];
  newsFlash(g, '***Player has elected to continue past end of game*******');
  newsFlash(g, '***Victory conditions are no longer valid****************');
  g.gameOver = null;
  // the original asks again whenever END_TEST fires; the remake asks once
  g.victoryVoid = true;
  const events: TurnEvent[] = [];
  nextTurn(g);
  beginOrdersPhase(g, PHASE_FIRST_ORDERS, events);
  return events;
}

// ---------- NEXT_TURN ----------

/** ENDTURN.NEXT_TURN: news and refugee checks, TURN + 1, weather, airfield repairs. */
export function nextTurn(g: GameState) {
  const held = terrainHeld(g);
  checkAirForces(g); // 1995: "... air force has been neutralized."

  const unPoints = 100 * held.cities.un + held.hexes.un;
  if (unPoints - g.unHexes > 10 && g.utility[10] === 0) {
    g.utility[10] = 1;
    newsFlash(g, "U.N. forces discover bodies of POW's executed by NKPA.");
  }
  if (g.utility[14] === 1) {
    g.utility[14] = 0;
    newsFlash(g, 'U.N. forces uncover mass graves of executed civilians.');
  }
  if (g.scenarioNo === 4 && g.turn === 7) {
    // 1995: the extra US forces (units 198-202) arrive 4 turns earlier .. 5 turns later than planned
    const r = rnd(g, 0, 9);
    g.utility[15] = r + 7;
    for (let id = 198; id <= 202; id++) {
      const u = g.units.get(id);
      if (!u) continue;
      u.x = (Math.trunc(u.x / 100) + 4 - r) * 100 - (Math.abs(u.x) % 100);
    }
  }
  if (g.scenarioNo === 4 && g.turn > 0 && g.turn + 1 === g.utility[15]) newsFlash(g, 'Additional U.S. reinforcements due next week.', g.turn + 1);
  if (g.unHexes - unPoints > 10 || g.utility[7] > 4) {
    g.refugees = true;
    newsFlash(g, 'Civilian refugees clog Korean roads.', g.turn + 1);
  } else g.refugees = false;
  g.unHexes = unPoints;
  g.utility[7] = 0;
  g.utility[9] = 0;
  // LOSS_INFLATOR[1..2] := RND(0,3) with limited intelligence. Nothing in KOREA.EXE ever reads it (docs/rules/intel.md 3.2):
  // only the two draws are kept so the random sequence matches the original.
  if (g.limitedIntel) { rnd(g, 0, 3); rnd(g, 0, 3); }
  g.player = 1;
  g.phase = 0;
  g.turn++;
  doWeather(g);
  for (const af of g.airfields) {
    if (g.possession[idx(g, af.x, af.y)] === 1) {
      if (af.current < af.best && rnd(g, 1, 100) <= (4 - af.current) * 25) af.current++;
    } else af.current = 0;
  }
  g.version++;
}
