// New game options: the start menu of the original (TACSUBS.SCENARIO_DISPLAY / S_DATA / LOAD_NEW_GAME,
// docs/rules/options.md). Pure logic (no DOM).
//
//   GameOptions        the menu values: SCENARIO[0] scenario, [6] CCF, [2] competence, [3] play mode, REALITY[2], [4]
//   ORIGINAL_DEFAULTS  LOAD_NEW_GAME 49A2: Dragon Wakes, Historical, Challenging, UN Solitaire, Player Control, Limited
//   scenarioFileId     49A2 4A2A: UN Solitaire (or TEST_BOTH_PLAYERS) loads the deployment edition koreaNs.dat
//   ccfStatus          S_DATA 45A3: "In progress" for Cold Steel, "Not allowed" for Tomorrow's War
//   airShownAsProgram  S_DATA 467F: Program Control, or Player Control shown as Program Control (1950s Red Solitaire)
//   toStartOptions     the values startNewGame takes (competence 6 = Random is rolled there)

import type { StartOptions } from './turn.ts';
import type { AiLevel } from './ai/types.ts';

export type ScenarioNo = 1 | 2 | 3 | 4;
/** SCENARIO[3]: 0 two players, 1 UN Solitaire (the computer plays the Communists), 2 Red Solitaire (the computer plays the UN). */
export type PlayMode = 0 | 1 | 2;
/** Which scenario file: the original rule, or one edition chosen directly (remake). */
export type ScenarioVariant = 'auto' | 'base' | 'deployment';

/** SCENARIO[2] = 6 in the menu: rolled RND(1,5) when the game starts. */
export const RANDOM_COMPETENCE = 6;

export interface GameOptions {
  scenario: ScenarioNo;
  /** SCENARIO[6]: false Historical (the Chinese may bluff), true Fixed. */
  ccfFixed: boolean;
  /** SCENARIO[2]: 1 Pushover .. 5 Hideous!, 6 Random. */
  competence: number;
  playMode: PlayMode;
  /** REALITY[2]: Air Campaign Player Control. */
  airPlayerControl: boolean;
  /** REALITY[4]: limited intelligence. */
  limitedIntel: boolean;
  variant: ScenarioVariant;
  /** Remake: which computer player plays the computer side (docs/rules/ai.md 4). Only 'original' exists so far. */
  aiLevel?: AiLevel;
}

/** The menu as LOAD_NEW_GAME sets it up (49A2). */
export const ORIGINAL_DEFAULTS: GameOptions = {
  scenario: 1, ccfFixed: false, competence: 3, playMode: 1, airPlayerControl: true, limitedIntel: true, variant: 'auto',
};

/**
 * Remake defaults: the original's (UN Solitaire against KIM, docs/rules/ai.md) since the Communist computer player
 * exists; the computer player is the original program.
 */
export const REMAKE_DEFAULTS: GameOptions = { ...ORIGINAL_DEFAULTS, aiLevel: 'original' };

/** Does this choice load the deployment edition (koreaNs.dat)? */
export function usesDeploymentFile(o: Pick<GameOptions, 'playMode' | 'variant'>): boolean {
  if (o.variant === 'deployment') return true;
  if (o.variant === 'base') return false;
  return o.playMode === 1;
}

/** Scenario data id: korea1 .. korea4, or korea1s .. korea4s for the deployment edition. */
export function scenarioFileId(o: Pick<GameOptions, 'scenario' | 'playMode' | 'variant'>): string {
  return `korea${o.scenario}${usesDeploymentFile(o) ? 's' : ''}`;
}

/** The menu values of a scenario data id (`korea2s` -> scenario 2, deployment edition). */
export function optionsForFile(id: string, base: GameOptions): GameOptions {
  const m = /^korea([1-4])(s?)$/.exec(id);
  if (!m) return base;
  const scenario = Number(m[1]) as ScenarioNo;
  const deployment = m[2] === 's';
  const variant: ScenarioVariant = deployment === usesDeploymentFile({ playMode: base.playMode, variant: 'auto' }) ? 'auto' : deployment ? 'deployment' : 'base';
  return { ...base, scenario, variant };
}

/** What the CCF Intervention line shows: the choice, or "In progress" (Cold Steel) / "Not allowed" (1995). */
export function ccfStatus(scenario: ScenarioNo): 'choose' | 'inProgress' | 'notAllowed' {
  if (scenario === 4) return 'notAllowed';
  if (scenario === 3) return 'inProgress';
  return 'choose';
}

/**
 * S_DATA shows "Program Control" when REALITY[2] is false, and also in the 1950s with Red Solitaire: the Communists
 * have no air units then and the UN's belong to the computer, so the human player has nothing to plan.
 */
export function airShownAsProgram(o: Pick<GameOptions, 'airPlayerControl' | 'scenario' | 'playMode'>): boolean {
  return !o.airPlayerControl || (o.scenario < 4 && o.playMode === 2);
}

/** The options as `startNewGame` takes them (play mode = SCENARIO[3] = computer side). */
export function toStartOptions(o: GameOptions): StartOptions {
  return {
    competence: o.competence,
    computerSide: o.playMode,
    limitedIntel: o.limitedIntel,
    ccfFixed: o.ccfFixed,
    airPlayerControl: o.airPlayerControl,
    aiLevel: o.aiLevel ?? 'original',
  };
}
