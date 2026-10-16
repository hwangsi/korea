// Calendar, weather and the freeze line, reproduced from the original (docs/rules/turn.md 5).
//
//   calendar        EURSUBS1.CALENDAR
//   rollWeather     TACSUBS.DO_WEATHER nested 3C51 (monthly temperature / sky table)
//   doWeather       TACSUBS.DO_WEATHER (shift, roll three turns ahead, freeze line, forecasts)
//   initWeather     TACSUBS.LOAD_NEW_GAME 4C58 (four rolls, then the fixed first-turn weather)

import type { GameState } from './state.ts';
import { rnd, syncWeather } from './state.ts';

export interface GameDate { year: number; month: number; day: number; }

/** EURSUBS1.CALENDAR: turn 0 = 25 June, then four turns per month on the 1st, 8th, 15th and 22nd. */
export function calendar(turn: number, baseYear: number): GameDate {
  if (turn <= 0) return { year: baseYear, month: 6, day: 25 };
  const m0 = 6 + Math.floor((turn - 1) / 4);
  return { year: baseYear + Math.floor(m0 / 12), month: (m0 % 12) + 1, day: [1, 8, 15, 22][(turn - 1) % 4] };
}

export function gameDate(g: Pick<GameState, 'turn' | 'scenarioNo'>, turn = g.turn): GameDate {
  return calendar(turn, g.scenarioNo === 4 ? 1995 : 1950);
}

/**
 * Cumulative thresholds of 3C51 by m = (turn - 2) div 4 (0 = July ... 10 = May):
 * RND above [0] = mild, above [1] = hot; second RND above [2] = cloudy, above [3] = storms.
 * Same numbers as the manual 6.4 table, but the month index lags the calendar by one turn.
 */
export const WEATHER_TABLE: readonly (readonly [number, number, number, number])[] = [
  [0, 25, 50, 75], [0, 20, 55, 75], [5, 45, 60, 80], [20, 90, 70, 85], [50, 100, 70, 85], [80, 100, 70, 85],
  [90, 100, 70, 85], [80, 100, 70, 85], [50, 100, 70, 85], [20, 100, 70, 85], [5, 80, 65, 85],
];

/** 3C51: weather of `turn` as temperature*10 + sky (temperature 1 cold, 2 mild, 3 hot; sky 1 fair, 2 cloudy, 3 storms). */
export function rollWeather(g: GameState, turn: number): number {
  const r1 = rnd(g, 1, 100);
  const r2 = rnd(g, 1, 100);
  // the original leaves the thresholds undefined after May 1951; the game always ends before that
  const row = WEATHER_TABLE[Math.max(0, Math.min(WEATHER_TABLE.length - 1, Math.trunc((turn - 2) / 4)))];
  let temp = 10, sky = 1;
  if (r1 > row[0]) temp = 20;
  if (r1 > row[1]) temp = 30;
  if (r2 > row[2]) sky = 2;
  if (r2 > row[3]) sky = 3;
  if (g.scenarioNo === 1 && g.computerSide === 2 && turn === 3 && sky === 3) sky = 2;
  return temp + sky;
}

/** TACSUBS.DO_WEATHER, run once per turn after TURN is incremented. */
export function doWeather(g: GameState) {
  const W = g.weather;
  for (let i = 0; i < 3; i++) W[0][i] = W[0][i + 1];
  W[0][3] = rollWeather(g, g.turn + 3);
  const t = Math.trunc(W[0][0] / 10);
  if (t === 1) {
    g.freezeLine += 5;
    if (g.freezeLine < 21) g.freezeLine = 21;
  } else if (t === 2) g.freezeLine -= 4;
  else if (t === 3) g.freezeLine -= 9;
  g.freezeLine = Math.max(0, Math.min(65, g.freezeLine));
  // forecasts: this turn is known; 1, 2, 3 turns ahead are re-rolled with 15 / 30 / 45 % chance
  for (let r = 1; r <= 2; r++) {
    W[r][0] = W[0][0];
    for (let k = 1; k <= 3; k++) W[r][k] = rnd(g, 1, 100) <= k * 15 ? rollWeather(g, g.turn + k) : W[0][k];
  }
  syncWeather(g);
}

/** LOAD_NEW_GAME 4C58: fill the forecast table, then force the first turn (mild/cloudy, Cold Steel cold/fair). */
export function initWeather(g: GameState) {
  if (g.scenarioNo === 2) g.turn -= 4;
  for (let k = 0; k < 4; k++) {
    if (g.scenarioNo === 2) g.turn++;
    doWeather(g);
  }
  for (let r = 0; r < 3; r++) {
    if (g.turn === 20) {
      g.weather[r][0] = 11;
      g.freezeLine = 23;
    } else {
      g.weather[r][0] = 22;
      g.freezeLine = 0;
    }
  }
  syncWeather(g);
}
