// Types shared by the computer players (docs/rules/ai.md 4).

import type { GameState, Player } from '../state.ts';

/**
 * Which computer player plays a side. 'original': the port of the 1992 program (Communist: WARRIORS.KIM,
 * UN: WARRIORS.WALTON). 'improved': a remake AI (planned, not written yet; docs/rules/ai.md 5).
 */
export type AiLevel = 'original' | 'improved';

/** What the computer did in one orders phase (for the phase banner; it does not reveal positions). */
export interface AiReport {
  player: Player;
  phase: number;
  /** Id of the computer player (ComputerPlayer.id). */
  ai: string;
  /** Force leaders that ended the phase in another hex. */
  moved: number[];
  /** Forces with an assault plotted at the end of the phase. */
  assaults: number;
  /** Two forces merged into one (KIM CONSOLIDATE). */
  merged: number;
  /** Original messages (KIM 2841: "<unit> in hex <x,y> has been eliminated" on the first turn). */
  notices: { unit: string; hex: [number, number] }[];
}

/**
 * A computer player. `orders` gives every order of its side for the current orders phase (g.phase 1 or 3,
 * g.player = this.player) by changing `g` through the engine, exactly like a human player's phase would;
 * the turn loop (turn.ts) then goes on. It may draw random numbers with `rnd(g, ...)` only (reproducible games).
 */
export interface ComputerPlayer {
  /** 'kim' (original Communist), 'walton' (original UN). Planned: 'kim-improved', 'walton-improved'. */
  id: string;
  player: Player;
  level: AiLevel;
  orders(g: GameState): AiReport;
}
