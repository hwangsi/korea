// New game option tests (docs/rules/options.md).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { MapData, Scenario } from '../src/data/types.ts';
import { createGameState, rnd } from '../src/engine/state.ts';
import { startNewGame } from '../src/engine/turn.ts';
import {
  ORIGINAL_DEFAULTS, REMAKE_DEFAULTS, RANDOM_COMPETENCE, scenarioFileId, usesDeploymentFile, optionsForFile, ccfStatus,
  airShownAsProgram, toStartOptions,
} from '../src/engine/options.ts';
import type { GameOptions, PlayMode, ScenarioNo } from '../src/engine/options.ts';

const DATA = join(import.meta.dirname, '..', 'data', 'extracted');
const HAVE_DATA = existsSync(join(DATA, 'map.json'));
const map: MapData = HAVE_DATA ? JSON.parse(readFileSync(join(DATA, 'map.json'), 'utf8')) : (null as unknown as MapData);
const scenario = (id: string): Scenario => JSON.parse(readFileSync(join(DATA, 'scenarios', `${id}.json`), 'utf8'));
const opts = { skip: HAVE_DATA ? false : 'data/extracted missing (run tools/extract/extract.ts)' };

test('menu defaults of LOAD_NEW_GAME and the remake', () => {
  assert.deepEqual(ORIGINAL_DEFAULTS, {
    scenario: 1, ccfFixed: false, competence: 3, playMode: 1, airPlayerControl: true, limitedIntel: true, variant: 'auto',
  });
  assert.equal(REMAKE_DEFAULTS.playMode, 0, 'two players until there is an AI');
  assert.equal(REMAKE_DEFAULTS.limitedIntel, true);
});

test('scenario file: UN Solitaire loads the deployment edition (koreaNs.dat)', () => {
  const o = (scenario: ScenarioNo, playMode: PlayMode, variant: GameOptions['variant'] = 'auto') => ({ scenario, playMode, variant });
  assert.equal(scenarioFileId(o(1, 0)), 'korea1');
  assert.equal(scenarioFileId(o(2, 1)), 'korea2s');
  assert.equal(scenarioFileId(o(3, 2)), 'korea3');
  assert.equal(scenarioFileId(o(4, 0, 'deployment')), 'korea4s');
  assert.equal(scenarioFileId(o(4, 1, 'base')), 'korea4');
  assert.equal(usesDeploymentFile({ playMode: 1, variant: 'auto' }), true);
  // ids of the old scenario list map back to menu values
  for (const id of ['korea1', 'korea1s', 'korea2', 'korea3s', 'korea4']) {
    for (const playMode of [0, 1, 2] as PlayMode[]) {
      const back = optionsForFile(id, { ...REMAKE_DEFAULTS, playMode });
      assert.equal(scenarioFileId(back), id, `${id} / mode ${playMode}`);
      assert.equal(back.playMode, playMode);
    }
  }
});

test('what the menu shows: CCF line and Air Campaign', () => {
  assert.equal(ccfStatus(1), 'choose');
  assert.equal(ccfStatus(2), 'choose');
  assert.equal(ccfStatus(3), 'inProgress');
  assert.equal(ccfStatus(4), 'notAllowed');
  assert.equal(airShownAsProgram({ airPlayerControl: true, scenario: 1, playMode: 0 }), false);
  assert.equal(airShownAsProgram({ airPlayerControl: false, scenario: 1, playMode: 0 }), true);
  assert.equal(airShownAsProgram({ airPlayerControl: true, scenario: 2, playMode: 2 }), true, '1950s Red Solitaire');
  assert.equal(airShownAsProgram({ airPlayerControl: true, scenario: 4, playMode: 2 }), false, '1995 Communist air units');
});

test('starting a game with the menu values', opts, () => {
  for (const s of [1, 2, 3, 4] as ScenarioNo[]) {
    for (const playMode of [0, 1, 2] as PlayMode[]) {
      const o: GameOptions = { ...REMAKE_DEFAULTS, scenario: s, playMode, competence: 2, ccfFixed: true, airPlayerControl: false, limitedIntel: false };
      const id = scenarioFileId(o);
      const g = createGameState(map, scenario(id), 3);
      const events = startNewGame(g, toStartOptions(o));
      assert.equal(g.scenarioNo, s);
      assert.equal(g.computerSide, playMode);
      assert.equal(g.competence, 2);
      assert.equal(g.ccfFixed, true);
      assert.equal(g.airPlayerControl, false);
      assert.equal(g.limitedIntel, false);
      assert.ok(g.spotted.every((v) => v === 2), 'complete intelligence');
      // the computer side's orders phase passes (no AI yet); a human side gets an orders phase
      if (playMode !== 0) assert.ok(events.some((e) => e.kind === 'computerPhase' || e.kind === 'ordersPhase'));
      if (playMode === 0) assert.ok(events.every((e) => e.kind !== 'computerPhase'));
    }
  }
});

test('Random competence is rolled first with RND(1,5)', opts, () => {
  const seen = new Set<number>();
  for (let seed = 1; seed <= 40; seed++) {
    const g = createGameState(map, scenario('korea2'), seed);
    const probe = createGameState(map, scenario('korea2'), seed);
    const expected = rnd(probe, 1, 5);
    startNewGame(g, { competence: RANDOM_COMPETENCE });
    assert.equal(g.competence, expected);
    seen.add(g.competence);
  }
  assert.deepEqual([...seen].sort(), [1, 2, 3, 4, 5]);
  // a fixed competence draws nothing for it
  const a = createGameState(map, scenario('korea2'), 9);
  const b = createGameState(map, scenario('korea2'), 9);
  startNewGame(a, { competence: 4 });
  rnd(b, 1, 5);
  startNewGame(b, { competence: 4 });
  assert.notEqual(a.rng, b.rng);
});
