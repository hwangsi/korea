// Report screens of the orders-phase menu (docs/rules/reports.md). Pure logic: the data each report shows.
//
//   strategicReport        REPORTS.STRATEGIC_REPORT 2F75 (menu 12h; also at GAME_OVER): hexes held, stockpiles, air levels,
//                          the friendly replacement pool (PLAYER's side only), CCF status (Communist player), last 8 news
//   portsAirfieldsReport   REPORTS.PORTS_AIRFIELDS_REPORT 0356 (15h): airfields 0..8 and ports 0..11 with occupier, levels, mines
//   weatherReport          REPORTS.W_REPORT 3699 (13h): PLAYER's forecast row (WEATHER_STRING), effects of the real weather
//   overviewCells          EURSUBS1.DO_OVERVIEW 4421 (button "Ovrvw"): terrain class, known force side, possession per hex
// None of them draws a random number or changes the game.

import type { Nation } from '../data/types.ts';
import type { GameState, Player, Side, NewsItem } from './state.ts';
import { idx, PLAYER_SIDE } from './state.ts';
import { terrainHeld } from './endturn.ts';
import { knownForces } from './intel.ts';
import { supplyNet } from './supply.ts';

// ---------- strategic report ----------

export interface PoolRow {
  nation: Nation;
  /** pool byte of REPLACEMENTS[nation][type − 1] for types 1..15, or null: "Not available in this scenario." */
  values: number[] | null;
}

export type CcfStatus = 'undecided' | 'willNotIntervene' | 'intervening';

export interface StrategicReport {
  held: Record<Side, { urban: number; other: number; stockpile: number }>;
  /** United Nations Interdiction Level (INTERDICTION[1]) */
  unInterdiction: number;
  /** 1950s: Communist Interception Level (RED_AIR); 1995: Communist Interdiction Level (INTERDICTION[0]) */
  communistAir: { kind: 'interception' | 'interdiction'; value: number };
  /** the friendly replacement pool: PLAYER's side only */
  poolSide: Side;
  pool: PoolRow[];
  /** "CCF Intervention Status:", only to the Communist player in the 1950s */
  ccf: CcfStatus | null;
  /** the last eight news lines, oldest first (NOTES) */
  news: NewsItem[];
  /** "Game Turn:" counts from 1 within the scenario (start turns 0, 11, 20, 0) */
  gameTurn: number;
}

const POOL_NATIONS: Record<Side, Nation[]> = { communist: ['NKPA', 'CPLA'], un: ['US', 'USMC', 'CW', 'UN', 'ROK'] };
export const SCENARIO_START_TURN = [0, 0, 11, 20, 0];

export function strategicReport(g: GameState, player: Player = g.player): StrategicReport {
  const h = terrainHeld(g);
  const side = PLAYER_SIDE[player];
  const pool: PoolRow[] = [];
  for (const nation of POOL_NATIONS[side]) {
    if (nation === 'CPLA' && g.scenarioNo >= 4) continue; // no Chinese row in 1995
    if (g.scenarioNo >= 4 && (nation === 'CW' || nation === 'UN')) { pool.push({ nation, values: null }); continue; }
    const rows = g.replacements[nation] ?? [];
    pool.push({ nation, values: Array.from({ length: 15 }, (_, k) => rows[k]?.[1] ?? 0) });
  }
  const ccf: CcfStatus | null = side === 'communist' && g.scenarioNo < 4
    ? g.ccfIntervention === 99 ? 'undecided' : g.ccfIntervention === 88 ? 'willNotIntervene' : 'intervening'
    : null;
  return {
    held: {
      un: { urban: h.cities.un, other: h.hexes.un, stockpile: g.stockpile[1] },
      communist: { urban: h.cities.communist, other: h.hexes.communist, stockpile: g.stockpile[0] },
    },
    unInterdiction: g.interdiction[1],
    communistAir: g.scenarioNo < 4 ? { kind: 'interception', value: g.redAir } : { kind: 'interdiction', value: g.interdiction[0] },
    poolSide: side,
    pool,
    ccf,
    news: g.news.slice(-8),
    gameTurn: g.turn - (SCENARIO_START_TURN[g.scenarioNo] ?? 0) + 1,
  };
}

// ---------- airfields and ports ----------

/** Names of the report, by array index (the original hard-codes them; the Japan ports 12..17 are not listed). */
export const AIRFIELD_NAMES = ['Taegu "K-2"', 'Pohang "K-3"', 'Pusan East "K-9"', 'Chinhae "K-10"', 'Suwon "K-13"', 'Kimpo "K-14"', 'Pusan "K-1"', "P'yongYang", 'Kunsan "K-8"'];
export const PORT_NAMES = ["Namp'o", "Inch'on", 'Kunsan', "Mokp'o", 'Yosu', 'Pusan', 'Ulsan', 'Wonsan', 'Hungnam', "Sinp'o", "Ch'ongjin", 'Unggi'];

export interface FacilityRow {
  index: number;
  name: string;
  x: number;
  y: number;
  /** possession of the hex: 0 none, 1 United Nations, 2 Communist */
  occupier: number;
}

export interface PortsAirfieldsReport {
  airfields: (FacilityRow & { current: number; best: number })[];
  ports: (FacilityRow & { mined: boolean })[];
}

/** Everything, both sides: no intelligence rule applies (possession is always known). */
export function portsAirfieldsReport(g: GameState): PortsAirfieldsReport {
  const occ = (x: number, y: number) => g.possession[idx(g, x, y)] ?? 0;
  return {
    airfields: g.airfields.slice(0, 9).map((a, k) => ({ index: k, name: AIRFIELD_NAMES[k] ?? `#${a.id}`, x: a.x, y: a.y, occupier: occ(a.x, a.y), current: a.current, best: a.best })),
    ports: g.ports.slice(0, 12).map((p, k) => ({ index: k, name: PORT_NAMES[k] ?? `#${p.id}`, x: p.x, y: p.y, occupier: occ(p.x, p.y), mined: p.mined })),
  };
}

// ---------- weather ----------

export interface WeatherReport {
  /** "Current Conditions" and the 1..3 week forecasts of PLAYER's row: temperature 1 cold 2 mild 3 hot, sky 1 fair 2 cloudy 3 storms */
  forecast: { temperature: number; sky: number }[];
  /** "additional -5 per combat" when it is hot or stormy (real weather) */
  readiness: number;
  /** "+1 road/rough hex" in storms (also printed in 1995, where storms do not cut roads) */
  stormMovement: boolean;
  /** air operations: 1 full strength, 2 impaired, 3 severely impaired */
  air: number;
  /** "Hexrow N", 0 = thawed */
  freezeLine: number;
}

export function weatherReport(g: GameState, player: Player = g.player): WeatherReport {
  const row = g.weather[player] ?? g.weather[0];
  const w = g.weather[0][0];
  const sky = ((w % 10) + 10) % 10, temp = Math.trunc(w / 10);
  return {
    forecast: [0, 1, 2, 3].map((k) => ({ temperature: Math.trunc((row[k] ?? 0) / 10), sky: ((row[k] ?? 0) % 10 + 10) % 10 })),
    readiness: sky === 3 || temp === 3 ? -5 : 0,
    stormMovement: sky === 3,
    air: sky === 3 ? 3 : sky === 2 ? 2 : 1,
    freezeLine: g.freezeLine > 0 ? g.freezeLine : 0,
  };
}

// ---------- strategic overview ----------

export type OverviewTerrain = 'open' | 'river' | 'rough' | 'mountain' | 'city' | 'sea' | 'lake' | 'edge';

export interface OverviewCell {
  terrain: OverviewTerrain;
  /** side of the first known force in the hex (Units on), or null */
  force: Side | null;
  possession: number;
  road: boolean;
  rail: boolean;
  /** supply-net display (menu 14h): the hex is in its holder's supply net */
  supplied: boolean;
}

/** DO_OVERVIEW 5.2: terrain class by code, in the original's order of checks. */
export function overviewTerrain(code: number): OverviewTerrain {
  if (code >= 0xdb) return 'lake';
  if (code >= 0xa5) return 'sea';
  if (code === 0x93) return 'city';
  if (code === 0x92) return 'mountain';
  if (code === 0x8f || code === 0x90 || code === 0x91 || code === 0x94) return 'edge';
  if ((code >= 0x59 && code <= 0x70) || (code >= 0x01 && code <= 0x0f) || (code >= 0x47 && code <= 0x57)) return 'river';
  if (code >= 0x58 && code <= 0x8e) return 'rough';
  return 'open';
}

const isRoad = (c: number) => (c >= 0x0b && c <= 0x57) || (c >= 0x68 && c <= 0x7c) || c === 0x93;
const isRail = (c: number) => (c >= 0x1e && c <= 0x57) || (c >= 0x7f && c <= 0x8e) || (c >= 0x95 && c <= 0x9e) || c === 0x93;

/**
 * One cell per hex (rows 1..65 in the original). Enemy forces follow the intelligence rule of the main map (the viewer's
 * known forces; with complete intelligence all of them). The supply net is the current one (after this phase's moves).
 */
export function overviewCells(g: GameState, viewer: Side): OverviewCell[] {
  const net = supplyNet(g);
  const out: OverviewCell[] = [];
  for (let i = 0; i < g.hexes.length; i++) {
    const code = g.hexes[i].code;
    const known = knownForces(g, viewer, i);
    const first = known[0];
    const lead = first ? g.units.get(first.leader) : undefined;
    const p = g.possession[i];
    out.push({
      terrain: overviewTerrain(code),
      force: lead ? (lead.id < g.firstUnUnit ? 'communist' : 'un') : null,
      possession: p,
      road: isRoad(code),
      rail: isRail(code),
      supplied: p > 0 && net[i] === p,
    });
  }
  return out;
}

/** The 38th parallel of the overview (1950s): a straight line between rows 36 and 37 (no data table, hard-coded). */
export const PARALLEL_38_ROW = 37;
