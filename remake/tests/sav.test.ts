// Original .SAV import (docs/rules/save.md 4, tools/extract/sav2json.ts). There is no original save file in the
// project, so the tests build saves from the scenario .DAT files (the same GLOBALS block) by setting the fields the
// original main loop writes while a game is running: UTILITY_SPACE[11], GOTO_SECONDPHASE, SAVEORDER, GOTO_PLAYERPHASE.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { MapData, Scenario } from '../src/data/types.ts';
import { createGameState } from '../src/engine/state.ts';
import { saveToText, parseSave, loadGame, resumeGame } from '../src/engine/save.ts';
import { endPlayerPhase } from '../src/engine/turn.ts';
import { layoutFromExe, convertSav, resumeFields } from '../tools/extract/lib/sav.ts';
import type { Layout } from '../tools/extract/lib/scenario.ts';

const ORIG = join(import.meta.dirname, '..', '..', 'Conflict-Korea-The-First-Year-1950-51_DOS_EN', 'confkorea');
const DATA = join(import.meta.dirname, '..', 'data', 'extracted');
const HAVE = existsSync(join(ORIG, 'KOREA.EXE')) && existsSync(join(DATA, 'map.json'));
const opts = { skip: HAVE ? false : 'original KOREA.EXE / data/extracted missing' };
const map: MapData = HAVE ? JSON.parse(readFileSync(join(DATA, 'map.json'), 'utf8')) : (null as unknown as MapData);
const layout: Layout = HAVE ? layoutFromExe(readFileSync(join(ORIG, 'KOREA.EXE'))) : (null as unknown as Layout);
const scenarioJson = (id: string) => JSON.parse(readFileSync(join(DATA, 'scenarios', `${id}.json`), 'utf8')) as Scenario;

/** A "saved game" made from a scenario file: started, in phase 1 or 3, `order`, the `step`-th player giving orders. */
function fakeSave(dat: string, o: { second: boolean; order: [number, number]; step: 1 | 2; playMode?: number; competence?: number }) {
  const buf = Buffer.from(readFileSync(join(ORIG, dat)));
  const off = (name: string) => layout.vars.get(name)!.offset - layout.base;
  buf[off('UTILITY_SPACE') + 11] = 1;
  buf[off('GOTO_SECONDPHASE')] = o.second ? 1 : 0;
  buf.writeInt16LE(o.order[0], off('SAVEORDER'));
  buf.writeInt16LE(o.order[1], off('SAVEORDER') + 2);
  buf.writeInt16LE(o.step, off('GOTO_PLAYERPHASE'));
  if (o.playMode !== undefined) buf[off('SCENARIO') + 3] = o.playMode;
  if (o.competence !== undefined) buf[off('SCENARIO') + 2] = o.competence;
  return buf;
}

test('the base scenario files are new games, not saves; a wrong size is refused', opts, () => {
  for (const f of ['KOREA1.DAT', 'KOREA2.DAT', 'KOREA3.DAT', 'KOREA4.DAT', 'KOREA2S.DAT']) {
    const buf = readFileSync(join(ORIG, f));
    assert.equal(resumeFields(buf, layout).started, false, f);
    const res = convertSav(buf, layout, map, { file: f, seed: 1 });
    assert.equal(res.ok, false);
    if (!res.ok) assert.equal(res.error, 'notStarted');
  }
  const short = convertSav(readFileSync(join(ORIG, 'KOREA2.DAT')).subarray(0, 1000), layout, map);
  assert.ok(!short.ok && short.error === 'size');
});

test('KOREA1S/3S/4S.DAT are real original saves: two players, saved in the Communist first orders phase', opts, () => {
  for (const [f, id] of [['KOREA1S.DAT', 'korea1'], ['KOREA3S.DAT', 'korea3'], ['KOREA4S.DAT', 'korea4']] as const) {
    const buf = readFileSync(join(ORIG, f));
    const r = resumeFields(buf, layout);
    assert.deepEqual(r, { started: true, gotoSecondPhase: false, saveOrder: [2, 1], gotoPlayerPhase: 2 }, f);
    const res = convertSav(buf, layout, map, { file: f, seed: 5 });
    assert.ok(res.ok, f);
    if (!res.ok) continue;
    // SCENARIO[3] = 0: a two-player game, so the base edition rebuilds the map and equipment table
    assert.deepEqual([res.info.scenarioId, res.info.phase, res.info.player, res.info.options.playMode, res.info.options.competence], [id, 1, 1, 0, 3], f);
    const p = parseSave(saveToText(res.save));
    assert.ok(p.ok);
    if (!p.ok) continue;
    const g = loadGame(p.file, map, scenarioJson(id));
    const ev = resumeGame(g);
    assert.equal(ev[0]?.kind, 'ordersPhase');
    // the Communist opening orders of the file are there (assault plots: MOVE > 100) and the game plays on
    assert.ok([...g.units.values()].some((u) => u.move > 100), `${f}: plotted assaults`);
    const turn0 = g.turn;
    endPlayerPhase(g); // on to combat (1995 may stop there for the players' airstrikes), second orders, ...
    assert.ok(g.phase !== 1 || g.turn > turn0, `${f}: the Communist first orders phase is over (phase ${g.phase})`);
  }
});

test('a saved two-player game resumes in the saved player\'s orders phase with the file\'s state', opts, () => {
  const buf = fakeSave('KOREA2.DAT', { second: true, order: [1, 2], step: 2, playMode: 0, competence: 4 });
  const res = convertSav(buf, layout, map, { file: 'TEST.SAV', seed: 7, now: new Date(0) });
  assert.ok(res.ok, res.ok ? '' : res.detail);
  if (!res.ok) return;
  assert.deepEqual([res.info.scenarioId, res.info.phase, res.info.player, res.info.order], ['korea2', 3, 2, [1, 2]]);
  // through the remake's own load path (what "파일 올리기" does)
  const parsed = parseSave(saveToText(res.save));
  assert.ok(parsed.ok);
  if (!parsed.ok) return;
  const base = scenarioJson('korea2');
  const g = loadGame(parsed.file, map, base);
  const ev = resumeGame(g);
  assert.deepEqual(ev.map((e) => [e.kind, (e as { phase?: number }).phase, (e as { player?: number }).player]), [['ordersPhase', 3, 2]]);
  assert.equal(g.competence, 4);
  assert.equal(g.computerSide, 0);
  assert.equal(g.utility[11], 1);
  assert.deepEqual(g.notes, base.news, 'the news lines of the file');
  // same units, stacks and possession as the scenario data the file was made from
  const ref = createGameState(map, base, 7);
  assert.equal(g.units.size, ref.units.size);
  for (const [id, u] of ref.units) {
    const v = g.units.get(id)!;
    assert.deepEqual([v.x, v.y, v.move, v.readiness, v.status, v.attached], [u.x, u.y, u.move, u.readiness, u.status, u.attached], `unit ${id}`);
  }
  assert.deepEqual(g.stacks, ref.stacks);
  assert.deepEqual([...g.possession], [...ref.possession]);
  assert.deepEqual(g.weather, ref.weather);
  // and the game goes on: the UN ends its second orders phase, the turn is resolved, the next turn begins
  const turn = g.turn;
  endPlayerPhase(g);
  assert.equal(g.turn, turn + 1);
  assert.equal(g.phase, 1);
});

test('play mode picks the scenario edition and the computer side; saves in the computer\'s phase are refused', opts, () => {
  // UN Solitaire (computer = Communist) came from koreaNs.dat; the human UN player saved in the first orders phase
  const un = convertSav(fakeSave('KOREA1S.DAT', { second: false, order: [1, 2], step: 2, playMode: 1 }), layout, map, { seed: 3 });
  assert.ok(un.ok);
  if (un.ok) {
    assert.equal(un.info.scenarioId, 'korea1s');
    const p = parseSave(saveToText(un.save));
    assert.ok(p.ok);
    if (p.ok) {
      const g = loadGame(p.file, map, scenarioJson('korea1s'));
      assert.equal(g.computerSide, 1);
      assert.equal(g.player, 2);
      assert.equal(g.phase, 1);
    }
  }
  // the Communist (computer) player's phase cannot have been saved in the original
  const bad = convertSav(fakeSave('KOREA1S.DAT', { second: false, order: [1, 2], step: 1, playMode: 1 }), layout, map);
  assert.ok(!bad.ok && bad.error === 'notResumable');
  // nonsense order
  const odd = convertSav(fakeSave('KOREA3.DAT', { second: false, order: [2, 2], step: 1, playMode: 0 }), layout, map);
  assert.ok(!odd.ok && odd.error === 'notResumable');
});
