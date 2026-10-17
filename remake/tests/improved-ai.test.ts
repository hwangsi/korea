// Improved computer player (docs/rules/ai.md 9): registered for both sides, plays legal orders through the engine,
// deterministic, and does better than standing still.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { MapData, Scenario } from '../src/data/types.ts';
import { createGameState, sideOf, unit } from '../src/engine/state.ts';
import type { GameState, Player } from '../src/engine/state.ts';
import { startNewGame, endPlayerPhase } from '../src/engine/turn.ts';
import { territoryBalance } from '../src/engine/endturn.ts';
import { aiAvailable, computerPlayer } from '../src/engine/ai/index.ts';
import { improvedOrders } from '../src/engine/ai/improved.ts';

const DATA = join(import.meta.dirname, '..', 'data', 'extracted');
const HAVE_DATA = existsSync(join(DATA, 'map.json'));
const opts = { skip: HAVE_DATA ? false : 'data/extracted missing (run tools/extract/extract.ts)' };
const map: MapData = HAVE_DATA ? JSON.parse(readFileSync(join(DATA, 'map.json'), 'utf8')) : (null as unknown as MapData);
const load = (id: string, seed: number) => createGameState(map, JSON.parse(readFileSync(join(DATA, 'scenarios', `${id}.json`), 'utf8')) as Scenario, seed);

/** `turns` turns with the engine playing `engineSide` (original AI) and the improved AI the other side. */
function play(id: string, seed: number, engineSide: Player, turns: number, hand: (g: GameState, p: Player) => void) {
  const g = load(id, seed);
  startNewGame(g, { computerSide: engineSide, airPlayerControl: false });
  const me = (3 - engineSide) as Player;
  const last = g.turn + turns;
  const log: string[] = [];
  for (let k = 0; k < turns * 6 + 10 && !g.gameOver && g.turn < last; k++) {
    if ((g.phase === 1 || g.phase === 3) && g.player === me) {
      hand(g, me);
      // every own force is where the engine put it: on the map, in a hex whose stack lists it, at most two per hex
      g.stacks.forEach((s, i) => {
        assert.ok(s.length <= 2, `stack limit at ${i}`);
        for (const l of s) { const u = unit(g, l); assert.equal(u.y * g.width + u.x, i, `force ${l} is where its hex says`); }
      });
      log.push(g.stacks.map((s) => s.join('.')).join(','));
    }
    endPlayerPhase(g);
  }
  return { g, log };
}

test('the improved player is registered for both sides and chosen by AiLevel', () => {
  assert.ok(aiAvailable(1, 'improved') && aiAvailable(2, 'improved'));
  assert.equal(computerPlayer(1, 'improved')?.id, 'kim-improved');
  assert.equal(computerPlayer(2, 'improved')?.id, 'walton-improved');
});

test('improved orders are legal and deterministic for both sides in every scenario', opts, () => {
  for (const [id, engineSide] of [['korea1s', 1], ['korea1', 2], ['korea2s', 1], ['korea3', 2], ['korea4s', 1], ['korea4', 2]] as const) {
    const a = play(id, 77, engineSide, 3, (g, p) => { improvedOrders(g, p); });
    const b = play(id, 77, engineSide, 3, (g, p) => { improvedOrders(g, p); });
    assert.deepEqual(a.log, b.log, `${id}: same seed, same orders`);
    const me = engineSide === 1 ? 'un' : 'communist';
    const mine = [...a.g.units.values()].filter((u) => sideOf(u) === me && u.x >= 0);
    assert.ok(mine.length > 0, `${id}: forces left`);
  }
});

test('the improved UN does better than standing still against KIM (Operation Chromite, 8 turns)', opts, () => {
  const seeds = [1000, 8919];
  const avg = (f: (g: GameState, p: Player) => void) => seeds.reduce((s, seed) => s + territoryBalance(play('korea2s', seed, 1, 8, f).g), 0) / seeds.length;
  const passive = avg(() => {});
  const improved = avg((g, p) => { improvedOrders(g, p); });
  assert.ok(improved > passive, `improved ${improved} > passive ${passive}`);
});
