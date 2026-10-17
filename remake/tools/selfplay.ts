// Computer against computer, headless (docs/rules/ai.md 9.3): compares the improved AI with the original players.
//
//   node --preserve-symlinks --preserve-symlinks-main tools/selfplay.ts [turns=10] [seeds=3] [scenarios=1,2,3,4]
//
// For each scenario and seed, the engine's computer side plays as in a solitaire game and this script plays the other
// side with each candidate (passive = no orders, the original KIM / WALTON, the improved AI). Air campaigns are under
// program control. Printed: the victory level (territoryBalance, + = UN) after the last turn, averaged over the seeds.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { MapData, Scenario } from '../src/data/types.ts';
import { createGameState } from '../src/engine/state.ts';
import type { GameState, Player } from '../src/engine/state.ts';
import { startNewGame, endPlayerPhase } from '../src/engine/turn.ts';
import { territoryBalance } from '../src/engine/endturn.ts';
import { scenarioFileId } from '../src/engine/options.ts';
import { kimOrders } from '../src/engine/ai/kim.ts';
import { waltonOrders } from '../src/engine/ai/walton.ts';
import { improvedOrders } from '../src/engine/ai/improved.ts';

const DATA = join(import.meta.dirname, '..', 'data', 'extracted');
const map: MapData = JSON.parse(readFileSync(join(DATA, 'map.json'), 'utf8'));
const [turnsArg, seedsArg, scenArg] = process.argv.slice(2);
const TURNS = Number(turnsArg ?? 10);
const SEEDS = Number(seedsArg ?? 3);
const SCENARIOS = (scenArg ?? '1,2,3,4').split(',').map(Number) as (1 | 2 | 3 | 4)[];

type Hand = (g: GameState, p: Player) => void;
const HANDS: Record<string, Hand> = {
  passive: () => {},
  original: (g, p) => { if (p === 1) kimOrders(g); else waltonOrders(g); },
  improved: (g, p) => { improvedOrders(g, p); },
};

/** Play `turns` turns; the engine runs `engineSide` (with its level), `hand` gives the other side's orders. */
export function play(scenario: 1 | 2 | 3 | 4, seed: number, engineSide: Player, engineLevel: 'original' | 'improved', hand: Hand, turns: number): number {
  const id = scenarioFileId({ scenario, playMode: engineSide, variant: 'auto' });
  const sc: Scenario = JSON.parse(readFileSync(join(DATA, 'scenarios', `${id}.json`), 'utf8'));
  const g = createGameState(map, sc, seed);
  startNewGame(g, { computerSide: engineSide, aiLevel: engineLevel, airPlayerControl: false });
  const handSide = (3 - engineSide) as Player;
  const last = g.turn + turns;
  for (let guard = 0; guard < turns * 6 + 10 && !g.gameOver && g.turn < last; guard++) {
    if ((g.phase === 1 || g.phase === 3) && g.player === handSide) hand(g, handSide);
    endPlayerPhase(g);
  }
  return territoryBalance(g);
}

if (import.meta.main ?? process.argv[1]?.endsWith('selfplay.ts')) {
  const avg = (xs: number[]) => (xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(1);
  for (const s of SCENARIOS) {
    const seeds = Array.from({ length: SEEDS }, (_, k) => 1000 + k * 7919);
    // the UN hand against the original KIM, the Communist hand against the original WALTON
    const un: string[] = [], red: string[] = [];
    for (const name of ['passive', 'original', 'improved']) {
      un.push(`${name} ${avg(seeds.map((seed) => play(s, seed, 1, 'original', HANDS[name], TURNS)))}`);
      red.push(`${name} ${avg(seeds.map((seed) => play(s, seed, 2, 'original', HANDS[name], TURNS)))}`);
    }
    console.log(`scenario ${s}, ${TURNS} turns, ${SEEDS} seeds (victory level, + = UN)`);
    console.log(`  UN side vs KIM:        ${un.join(' | ')}   (higher is better)`);
    console.log(`  Communist side vs WALTON: ${red.join(' | ')}   (lower is better)`);
  }
}
