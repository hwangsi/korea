// Save / load tests (docs/rules/save.md).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { MapData, Scenario } from '../src/data/types.ts';
import { createGameState, idx, onMap, sideOf, unit } from '../src/engine/state.ts';
import type { GameState } from '../src/engine/state.ts';
import { startNewGame, endPlayerPhase } from '../src/engine/turn.ts';
import { assault, assaultPreview } from '../src/engine/combat.ts';
import { neighbor } from '../src/engine/hex.ts';
import { saveGame, saveToText, parseSave, loadGame, resumeGame, saveBlocked, SAVE_VERSION } from '../src/engine/save.ts';
import { REMAKE_DEFAULTS } from '../src/engine/options.ts';

const DATA = join(import.meta.dirname, '..', 'data', 'extracted');
const HAVE_DATA = existsSync(join(DATA, 'map.json'));
const map: MapData = HAVE_DATA ? JSON.parse(readFileSync(join(DATA, 'map.json'), 'utf8')) : (null as unknown as MapData);
const scenario = (id: string): Scenario => JSON.parse(readFileSync(join(DATA, 'scenarios', `${id}.json`), 'utf8'));
const opts = { skip: HAVE_DATA ? false : 'data/extracted missing (run tools/extract/extract.ts)' };

/** Saved state without the change counter (it moves on load). */
function stateOf(g: GameState) {
  const s = saveGame(g, null, new Date(0)).state;
  delete s.version;
  return s;
}

/** The side whose phase it is plots every assault it can (some ground combat to resolve). */
function plotAssaults(g: GameState) {
  for (let i = 0; i < g.stacks.length; i++) {
    for (const leader of g.stacks[i].slice()) {
      const u = unit(g, leader);
      if (sideOf(u) !== (g.player === 1 ? 'communist' : 'un')) continue;
      for (let d = 0; d < 6; d++) {
        const [nx, ny] = neighbor(u.x, u.y, d);
        if (!onMap(g, nx, ny)) continue;
        if (assaultPreview(g, leader, nx, ny).allowed) { assault(g, leader, nx, ny); break; }
      }
    }
  }
}

function play(g: GameState, phases: number) {
  for (let k = 0; k < phases && !g.gameOver; k++) {
    if (g.phase === 1 || g.phase === 3) plotAssaults(g);
    endPlayerPhase(g);
  }
}

test('save -> text -> load gives the same state', opts, () => {
  const g = createGameState(map, scenario('korea1'), 4242);
  startNewGame(g, { limitedIntel: true });
  play(g, 3);
  assert.equal(saveBlocked(g), null);
  const text = saveToText(saveGame(g, { ...REMAKE_DEFAULTS }));
  const parsed = parseSave(text);
  assert.ok(parsed.ok);
  const file = parsed.ok ? parsed.file : null!;
  assert.equal(file.version, SAVE_VERSION);
  assert.equal(file.scenarioId, 'korea1');
  assert.equal(file.summary.turn, g.turn);
  assert.equal(file.summary.phase, g.phase);
  assert.deepEqual(file.options, REMAKE_DEFAULTS);
  const h = loadGame(file, map, scenario('korea1'));
  assert.deepEqual(stateOf(h), stateOf(g));
  assert.ok(h.units instanceof Map && h.possession instanceof Uint8Array && h.spotted instanceof Uint8Array);
  assert.equal(h.hexes.length, g.hexes.length);
  assert.equal(h.equipmentTypes.size, g.equipmentTypes.size);
  assert.equal(h.undo, null);
});

test('a loaded game goes on exactly like the saved one (random state included)', opts, () => {
  for (const id of ['korea1', 'korea3', 'korea4']) {
    const g = createGameState(map, scenario(id), 777);
    startNewGame(g, { limitedIntel: true, computerSide: 0 });
    play(g, 4);
    const parsed = parseSave(saveToText(saveGame(g)));
    assert.ok(parsed.ok);
    const h = loadGame(parsed.ok ? parsed.file : null!, map, scenario(id));
    // resuming repeats FORCE_SPOTTING (nothing changes right after it ran) and draws no random numbers
    const rng = h.rng;
    resumeGame(h);
    resumeGame(g);
    assert.equal(h.rng, rng);
    for (let k = 0; k < 10; k++) {
      play(g, 1);
      play(h, 1);
      assert.deepEqual(stateOf(h), stateOf(g), `${id} after ${k + 1} more phases`);
    }
    assert.ok(g.turn >= 2, `${id} played on into later turns`);
  }
});

test('saving only in an orders phase; bad files are refused', opts, () => {
  const g = createGameState(map, scenario('korea2'), 5);
  startNewGame(g, {});
  assert.equal(saveBlocked(g), null);
  g.phase = 2;
  assert.equal(saveBlocked(g), 'phase');
  g.phase = 1;
  g.gameOver = 'lastTurn';
  assert.equal(saveBlocked(g), 'gameOver');
  g.gameOver = null;

  assert.deepEqual(parseSave('not json'), { ok: false, error: 'notSave' });
  assert.deepEqual(parseSave('{"a":1}'), { ok: false, error: 'notSave' });
  const f = saveGame(g);
  assert.deepEqual(parseSave(JSON.stringify({ ...f, version: SAVE_VERSION + 1 })), { ok: false, error: 'newerVersion' });
  assert.throws(() => loadGame(f, map, scenario('korea3')), /scenarioMismatch/);
  // the resumed phase belongs to the player who saved
  const ev = resumeGame(loadGame(f, map, scenario('korea2')));
  assert.deepEqual(ev, [{ kind: 'ordersPhase', phase: g.phase, player: g.player, reinforcements: false }]);
  assert.equal(idx(g, 0, 0), 0);
});
