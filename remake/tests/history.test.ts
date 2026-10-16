// Front-line history of the summary chart (GameState.history, turn.ts recordFront): remake addition, no rule effect.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { MapData, Scenario } from '../src/data/types.ts';
import { createGameState } from '../src/engine/state.ts';
import { startNewGame, endPlayerPhase } from '../src/engine/turn.ts';
import { terrainHeld } from '../src/engine/endturn.ts';
import { saveGame, saveToText, parseSave, loadGame } from '../src/engine/save.ts';

const DATA = join(import.meta.dirname, '..', 'data', 'extracted');
const HAVE_DATA = existsSync(join(DATA, 'map.json'));
const opts = { skip: HAVE_DATA ? false : 'data/extracted missing (run tools/extract/extract.ts)' };
const map: MapData = HAVE_DATA ? JSON.parse(readFileSync(join(DATA, 'map.json'), 'utf8')) : (null as unknown as MapData);
const scen = (id: string) => JSON.parse(readFileSync(join(DATA, 'scenarios', `${id}.json`), 'utf8')) as Scenario;

test('one history row per turn: hexes held by each side at the start of the turn', opts, () => {
  const g = createGameState(map, scen('korea1'), 3);
  startNewGame(g, { computerSide: 1 });
  assert.equal(g.history.length, 1);
  assert.equal(g.history[0].turn, 0);
  for (let k = 0; k < 12 && g.turn < 3; k++) endPlayerPhase(g);
  assert.deepEqual(g.history.map((r) => r.turn), [0, 1, 2, 3]);
  // the first row is the scenario's possession (later rows were taken before this turn's moves)
  const fresh = createGameState(map, scen('korea1'), 3);
  const h = terrainHeld(fresh);
  assert.deepEqual(g.history[0], { turn: 0, un: h.cities.un + h.hexes.un, communist: h.cities.communist + h.hexes.communist });
  assert.ok(g.history.at(-1)!.communist > g.history[0].communist, 'the invasion gains ground');
  // the history is saved with the game
  const p = parseSave(saveToText(saveGame(g)));
  assert.ok(p.ok);
  if (p.ok) assert.deepEqual(loadGame(p.file, map, scen('korea1')).history, g.history);
});
