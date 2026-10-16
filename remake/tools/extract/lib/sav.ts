// Original saved games (*.SAV) -> remake save JSON (docs/rules/save.md 4).
//
// TACSUBS.SAVE_GAME (1EE0) writes the same GLOBALS block as a scenario .DAT (UNITS .. VICTORY, 33792 bytes), so the
// scenario parser reads it. What makes it a saved game, and where the main loop resumes (KOREA 1FFB, PHASE_PULSE 1E49):
//   UTILITY_SPACE[11] = 1      the game has started (a .DAT has 0 and is a new game)
//   GOTO_SECONDPHASE           true: saved in the second orders phase (phases 1 and 2 are skipped)
//   SAVEORDER[0..1]            the player order of that phase (no new initiative roll)
//   GOTO_PLAYERPHASE (1 or 2)  which of the two was giving orders: PLAYER = SAVEORDER[GOTO_PLAYERPHASE - 1]
// PLAYER and PHASE themselves lie after VICTORY and are not in the file. The random state is not saved either.
// The start menu values are in SCENARIO[0..7] / REALITY[1..4] (docs/rules/options.md 1).

import { readMzHeader, imageEnd } from './mz.ts';
import { parseTdInfo, globals, findDataSegment } from './tdinfo.ts';
import { buildLayout, parseScenario } from './scenario.ts';
import type { Layout } from './scenario.ts';
import type { MapData, Scenario as DataScenario } from '../../../src/data/types.ts';
import { createGameState } from '../../../src/engine/state.ts';
import type { Player } from '../../../src/engine/state.ts';
import { saveGame } from '../../../src/engine/save.ts';
import type { SaveFile } from '../../../src/engine/save.ts';
import { scenarioFileId } from '../../../src/engine/options.ts';
import type { GameOptions, PlayMode, ScenarioNo } from '../../../src/engine/options.ts';

/** The GLOBALS layout from the debug information appended to KOREA.EXE. */
export function layoutFromExe(exe: Buffer): Layout {
  const td = parseTdInfo(exe, imageEnd(readMzHeader(exe)));
  return buildLayout(globals(td, findDataSegment(td)));
}

export interface ResumeFields {
  /** UTILITY_SPACE[11]: the game has started (INIT_GAME done). */
  started: boolean;
  gotoSecondPhase: boolean;
  saveOrder: [number, number];
  gotoPlayerPhase: number;
}

export function resumeFields(buf: Buffer, layout: Layout): ResumeFields {
  const off = (name: string) => {
    const g = layout.vars.get(name);
    if (!g) throw new Error(`global ${name} missing`);
    return g.offset - layout.base;
  };
  return {
    started: buf[off('UTILITY_SPACE') + 11] === 1,
    gotoSecondPhase: buf[off('GOTO_SECONDPHASE')] !== 0,
    saveOrder: [buf.readInt16LE(off('SAVEORDER')), buf.readInt16LE(off('SAVEORDER') + 2)],
    gotoPlayerPhase: buf.readInt16LE(off('GOTO_PLAYERPHASE')),
  };
}

/** The start menu values kept in the file: SCENARIO[0] scenario, [2] competence (Random already rolled), [3] play mode,
 *  [6] CCF; REALITY[2] air campaign player control, REALITY[4] limited intelligence (REALITY is 1-based). */
export function savOptions(settings: number[], reality: number[]): GameOptions {
  const comp = settings[2];
  const mode = settings[3];
  return {
    scenario: settings[0] as ScenarioNo,
    ccfFixed: settings[6] === 1,
    competence: comp >= 1 && comp <= 5 ? comp : 3,
    playMode: (mode === 1 || mode === 2 ? mode : 0) as PlayMode,
    airPlayerControl: reality[1] !== 0,
    limitedIntel: reality[3] !== 0,
    variant: 'auto',
    aiLevel: 'original',
  };
}

export type SavError = 'size' | 'scenario' | 'notStarted' | 'notResumable';

export interface SavInfo {
  scenarioId: string;
  options: GameOptions;
  turn: number;
  phase: 1 | 3;
  player: Player;
  order: [Player, Player];
  notes: number;
  victoryVoid: boolean;
}

export type SavResult = { ok: true; save: SaveFile; info: SavInfo } | { ok: false; error: SavError; detail: string };

const isPlayer = (p: number): p is Player => p === 1 || p === 2;

/**
 * Convert an original saved game. `seed` starts the remake's random generator (the original's RandSeed is not in
 * the file, so a loaded original game also went on with new random numbers).
 */
export function convertSav(buf: Buffer, layout: Layout, map: MapData, opts: { file?: string; seed?: number; now?: Date } = {}): SavResult {
  const file = opts.file ?? 'GAME.SAV';
  if (buf.length !== layout.size) return { ok: false, error: 'size', detail: `${buf.length} bytes, a saved game has ${layout.size}` };
  const parsed = parseScenario(buf, layout, file);
  if (!(parsed.scenario >= 1 && parsed.scenario <= 4)) return { ok: false, error: 'scenario', detail: `SCENARIO[0] = ${parsed.scenario}` };
  const r = resumeFields(buf, layout);
  if (!r.started) return { ok: false, error: 'notStarted', detail: 'UTILITY_SPACE[11] = 0: new game data (a scenario .DAT), not a saved game' };
  const [a, b] = r.saveOrder;
  if (!isPlayer(a) || !isPlayer(b) || a === b || (r.gotoPlayerPhase !== 1 && r.gotoPlayerPhase !== 2)) {
    return { ok: false, error: 'notResumable', detail: `SAVEORDER = ${a},${b}, GOTO_PLAYERPHASE = ${r.gotoPlayerPhase}` };
  }
  const options = savOptions(parsed.settingsRaw, parsed.realityRaw);
  const saver = r.saveOrder[r.gotoPlayerPhase - 1];
  if (options.playMode === saver) {
    // the computer's phases have no menu, so the original cannot save there
    return { ok: false, error: 'notResumable', detail: `saved in the computer's phase (player ${saver}, play mode ${options.playMode})` };
  }
  const scenarioId = scenarioFileId(options); // UN Solitaire games came from koreaNs.dat (options.md 2)
  const data = { id: scenarioId, ...parsed } as unknown as DataScenario;
  const seed = (opts.seed ?? Date.now()) >>> 0 || 1950;
  const g = createGameState(map, data, seed);
  // what LOAD_NEW_GAME copied from the menu (startNewGame is not run: weather, turn-0 events are in the file)
  g.competence = options.competence;
  g.computerSide = options.playMode;
  g.limitedIntel = options.limitedIntel;
  g.ccfFixed = options.ccfFixed;
  g.airPlayerControl = options.airPlayerControl;
  g.aiLevel = 'original';
  // where the main loop resumes
  g.phase = r.gotoSecondPhase ? 3 : 1;
  g.order = [a, b];
  g.orderStep = r.gotoPlayerPhase - 1;
  g.player = g.order[g.orderStep];
  g.gameOver = null;
  // OVERRIDE (KOREA 19D3) leaves only its news lines behind; the remake keeps the flag
  g.victoryVoid = parsed.news.some((n) => /Victory conditions are no longer valid/.test(n));
  const save = saveGame(g, options, opts.now);
  return {
    ok: true, save,
    info: { scenarioId, options, turn: g.turn, phase: g.phase as 1 | 3, player: g.player, order: g.order, notes: g.notes.length, victoryVoid: g.victoryVoid },
  };
}
