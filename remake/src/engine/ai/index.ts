// Computer players (docs/rules/ai.md). Pure logic (no DOM).
//
//   COMPUTER_PLAYERS  the registry. Now: KIM (original Communist, ai/kim.ts).
//                     To add one: write `orders(g)` (ai/common.ts has the original AISUBS / route / merge code for both
//                     sides), register it here with its side and level, and allow it in the new game dialog
//                     (aiAvailable is what the dialog asks).
//   computerOrders    KOREA.PLAYER_PHASE 1AF4: the computer side's orders phase (turn.ts calls it); without a player
//                     for that side and level nothing happens (its forces stand still, as before the AI existed)

import type { GameState, Player } from '../state.ts';
import type { AiLevel, AiReport, ComputerPlayer } from './types.ts';
import { kimOrders } from './kim.ts';

/** WARRIORS.KIM, the original Communist player. */
const KIM: ComputerPlayer = { id: 'kim', player: 1, level: 'original', orders: kimOrders };

export const COMPUTER_PLAYERS: ComputerPlayer[] = [KIM];

export function computerPlayer(player: Player, level: AiLevel): ComputerPlayer | null {
  return COMPUTER_PLAYERS.find((p) => p.player === player && p.level === level) ?? null;
}

/** Is there a computer player for this side and level? */
export function aiAvailable(player: Player, level: AiLevel = 'original'): boolean {
  return !!computerPlayer(player, level);
}

/** The orders phase of the computer side (g.player = player). The report is null when no AI plays that side. */
export function computerOrders(g: GameState, player: Player): AiReport | null {
  const ai = computerPlayer(player, g.aiLevel) ?? computerPlayer(player, 'original');
  if (!ai) return null;
  const report = ai.orders(g);
  g.undo = null;
  g.version++;
  return report;
}
