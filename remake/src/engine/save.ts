// Save / load (docs/rules/save.md). Pure logic (no DOM).
//
// The original saves from the orders-phase menu (KOREA.DO_ITEM item 1Eh -> GAME_SAVE 0A3A -> TACSUBS.SAVE_GAME 1EE0):
// it writes the whole global data area (GAMEFILESIZE bytes, the layout of a scenario .DAT). INIT_GAME offers
// "A saved game" at the start (LOAD_OLD_GAME 3BF4) and the main loop resumes where the game was saved through
// GOTO_SECONDPHASE (second orders phase: skip phases 1 and 2) and GOTO_PLAYERPHASE / SAVEORDER (PHASE_PULSE 1E55:
// the same player order, no new initiative roll, FORCE_SPOTTING then PLAYER_PHASE of the player who saved).
//
// The remake saves GameState as JSON: every dynamic field (also the random state, so a loaded game goes on exactly
// as the saved one would), the start menu values and a summary for the slot list. The map (hexes) and the
// equipment table are static and rebuilt from the scenario data; the one-step undo is not kept.

import type { MapData, Scenario } from '../data/types.ts';
import type { GameState, Player } from './state.ts';
import { createGameState } from './state.ts';
import type { GameOptions } from './options.ts';
import { forceSpotting, recordFront } from './turn.ts';
import type { TurnEvent } from './turn.ts';
import { gameDate } from './weather.ts';

export const SAVE_FORMAT = 'conflict-korea-remake-save';
/** Bump when a saved field changes meaning; `loadGame` refuses newer versions. */
export const SAVE_VERSION = 1;

/** Fields rebuilt from the scenario data, and transient ones that are not saved. */
const NOT_SAVED = new Set(['hexes', 'equipmentTypes', 'undo']);

export interface SaveSummary {
  scenarioNo: number;
  turn: number;
  phase: number;
  player: Player;
  /** SCENARIO[3]: 0 two players, 1 computer plays Communist, 2 computer plays UN. */
  computerSide: number;
  date: { year: number; month: number; day: number };
}

export interface SaveFile {
  format: string;
  version: number;
  /** ISO time of saving. */
  savedAt: string;
  /** Scenario data id (korea1 .. korea4s) the state was built from. */
  scenarioId: string;
  /** Start menu values of the game (docs/rules/options.md), for the settings line and the next new game. */
  options: GameOptions | null;
  summary: SaveSummary;
  /** GameState fields, Maps and typed arrays tagged (see encode). */
  state: Record<string, unknown>;
}

// ---------- JSON encoding of Map / Uint8Array ----------

type Json = null | boolean | number | string | Json[] | { [k: string]: Json };

function encode(v: unknown): Json {
  if (v === null || v === undefined) return null;
  if (typeof v === 'number' || typeof v === 'string' || typeof v === 'boolean') return v;
  if (v instanceof Map) return { $map: [...v.entries()].map(([k, x]) => [encode(k), encode(x)]) };
  if (v instanceof Uint8Array) return { $u8: Array.from(v) };
  if (Array.isArray(v)) return v.map(encode);
  if (typeof v === 'object') {
    const out: { [k: string]: Json } = {};
    for (const [k, x] of Object.entries(v as Record<string, unknown>)) if (x !== undefined) out[k] = encode(x);
    return out;
  }
  throw new Error(`cannot save a ${typeof v}`);
}

function decode(v: unknown): unknown {
  if (v === null || typeof v !== 'object') return v;
  if (Array.isArray(v)) return v.map(decode);
  const o = v as Record<string, unknown>;
  if (Array.isArray(o.$map)) return new Map((o.$map as unknown[][]).map(([k, x]) => [decode(k), decode(x)]));
  if (Array.isArray(o.$u8)) return Uint8Array.from(o.$u8 as number[]);
  const out: Record<string, unknown> = {};
  for (const [k, x] of Object.entries(o)) out[k] = decode(x);
  return out;
}

// ---------- saving ----------

/**
 * Why the game cannot be saved now, or null. Like the original, only in an orders phase (the menu is not
 * available while the program resolves combat or the end of the turn); not while the end-of-game question is open.
 */
export function saveBlocked(g: GameState): 'phase' | 'gameOver' | null {
  if (g.gameOver) return 'gameOver';
  if (g.phase !== 1 && g.phase !== 3) return 'phase';
  if (g.air) return 'phase';
  return null;
}

export function saveSummary(g: GameState): SaveSummary {
  const d = gameDate(g);
  return {
    scenarioNo: g.scenarioNo, turn: g.turn, phase: g.phase, player: g.player, computerSide: g.computerSide,
    date: { year: d.year, month: d.month, day: d.day },
  };
}

/** The game as a JSON-ready save file. */
export function saveGame(g: GameState, options: GameOptions | null = null, now = new Date()): SaveFile {
  const state: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(g)) if (!NOT_SAVED.has(k)) state[k] = encode(v);
  return {
    format: SAVE_FORMAT, version: SAVE_VERSION, savedAt: now.toISOString(), scenarioId: g.scenarioId,
    options: options ? { ...options } : null, summary: saveSummary(g), state,
  };
}

/** A save file as text (what the UI writes to the browser storage or a downloaded .json file). */
export function saveToText(file: SaveFile): string {
  return JSON.stringify(file);
}

// ---------- loading ----------

export type LoadError = 'notSave' | 'newerVersion' | 'scenarioMismatch';

/** Parse and check a save file; the scenario data `file.scenarioId` is needed next. */
export function parseSave(text: string): { ok: true; file: SaveFile } | { ok: false; error: LoadError } {
  let f: SaveFile;
  try { f = JSON.parse(text) as SaveFile; } catch { return { ok: false, error: 'notSave' }; }
  if (!f || f.format !== SAVE_FORMAT || typeof f.version !== 'number' || !f.state || typeof f.scenarioId !== 'string') {
    return { ok: false, error: 'notSave' };
  }
  if (f.version > SAVE_VERSION) return { ok: false, error: 'newerVersion' };
  return { ok: true, file: f };
}

/** Rebuild the game of a save file on its scenario data (the map and equipment table come from there). */
export function loadGame(file: SaveFile, map: MapData, scenario: Scenario): GameState {
  if (scenario.id !== file.scenarioId) throw new Error(`scenarioMismatch: ${file.scenarioId} != ${scenario.id}`);
  const g = createGameState(map, scenario);
  const target = g as unknown as Record<string, unknown>;
  for (const [k, v] of Object.entries(file.state)) {
    if (NOT_SAVED.has(k)) continue;
    target[k] = decode(v);
  }
  g.undo = null;
  g.version++;
  return g;
}

/**
 * Resume a loaded game like the original main loop: the orders phase of the player who saved begins again
 * (PHASE_PULSE with GOTO_PLAYERPHASE: no new initiative roll, FORCE_SPOTTING, then PLAYER_PHASE).
 */
export function resumeGame(g: GameState): TurnEvent[] {
  if (g.gameOver || (g.phase !== 1 && g.phase !== 3)) return [];
  // saves made before the front-line chart (or converted original saves) start their history now
  if (!g.history?.length) { g.history = []; recordFront(g); }
  forceSpotting(g);
  g.version++;
  return [{ kind: 'ordersPhase', phase: g.phase, player: g.player, reinforcements: false }];
}
