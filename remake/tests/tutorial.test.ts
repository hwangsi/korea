// Tutorial (docs/tutorial.md): steps, texts, the "try it" checks and the card.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TUTORIAL_STEPS, TUT_CHAPTERS, chapterStart, stepText, taskDone, renderTutorial, inline } from '../src/ui/tutorial.ts';
import type { TutProbe } from '../src/ui/tutorial.ts';
import { TUTORIAL_KO } from '../src/i18n/ko.ts';

test('every step has a Korean text, every text is used, chapters in the order asked for', () => {
  const ids = TUTORIAL_STEPS.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(Object.keys(TUTORIAL_KO.steps).sort(), [...ids].sort());
  for (const s of TUTORIAL_STEPS) {
    const t = stepText(s);
    assert.ok(t.title && t.body.length, s.id);
    assert.ok(/[가-힣]/.test(t.title), `${s.id}: Korean title`);
    if (s.task) assert.ok(t.task, `${s.id}: a task needs its text`);
    if (t.table) for (const r of t.table.rows) assert.equal(r.length, t.table.head?.length ?? r.length, `${s.id}: table row width`);
    assert.ok(TUTORIAL_KO.chapters[s.chapter], s.chapter);
  }
  // phases, movement, assaults, combat strength, victory, air support and sea supply (the user's list), in that order
  const order = TUT_CHAPTERS.map((c) => chapterStart(c));
  assert.deepEqual([...order].sort((a, b) => a - b), order);
  for (const c of TUT_CHAPTERS) assert.ok(chapterStart(c) >= 0, c);
  assert.deepEqual(TUT_CHAPTERS, ['start', 'phases', 'move', 'attack', 'strength', 'victory', 'air', 'supply', 'end']);
});

test('the key rules of the manual are in the texts', () => {
  const of = (c: string) => TUTORIAL_STEPS.filter((s) => s.chapter === c).map((s) => {
    const t = stepText(s);
    return [t.title, ...t.body, ...(t.after ?? []), ...(t.table?.rows.flat() ?? [])].join(' ');
  }).join(' ');
  assert.match(of('phases'), /1차 명령.*전투 해결.*2차 명령.*정리/s);
  assert.match(of('move'), /75/);
  assert.match(of('move'), /24/);
  assert.match(of('move'), /\+4/);
  assert.match(of('attack'), /6점/);
  assert.match(of('attack'), /2배/);
  assert.match(of('strength'), /살상력/);
  assert.match(of('strength'), /1\.65/);
  assert.match(of('strength'), /2\.5/);
  assert.match(of('victory'), /100점/);
  assert.match(of('victory'), /200점/);
  assert.match(of('air'), /차단/);
  assert.match(of('air'), /제공/);
  assert.match(of('supply'), /항구/);
  assert.match(of('supply'), /기뢰/);
  assert.match(of('supply'), /턴당 4점/);
});

test('try-it tasks', () => {
  const base: TutProbe = { selected: false, moves: 2, assaults: 1, preview: false, airOpen: false, supplyLayer: false, phaseKey: '11-1-2' };
  assert.equal(taskDone('select', base, base), false);
  assert.equal(taskDone('select', base, { ...base, selected: true }), true);
  assert.equal(taskDone('move', base, base), false);
  assert.equal(taskDone('move', base, { ...base, moves: 3 }), true);
  assert.equal(taskDone('assaultPreview', base, { ...base, preview: true }), true);
  assert.equal(taskDone('assaultPreview', base, { ...base, assaults: 2 }), true);
  assert.equal(taskDone('assaultPreview', base, base), false);
  assert.equal(taskDone('airOpen', base, { ...base, airOpen: true }), true);
  assert.equal(taskDone('supplyLayer', base, { ...base, supplyLayer: true }), true);
  assert.equal(taskDone('endPhase', base, base), false);
  assert.equal(taskDone('endPhase', base, { ...base, phaseKey: '11-2-0' }), true);
});

test('the card: chapters, progress, task state, last step, folded', () => {
  const el = { innerHTML: '' } as unknown as HTMLElement;
  const k = TUTORIAL_STEPS.findIndex((s) => s.task === 'move');
  renderTutorial(el, { step: k, done: false, minimized: false });
  assert.match(el.innerHTML, /data-tut="chapter" data-value="move" aria-current="true"/);
  assert.match(el.innerHTML, new RegExp(TUTORIAL_KO.tryIt));
  assert.match(el.innerHTML, /data-tut="next"/);
  renderTutorial(el, { step: k, done: true, minimized: false });
  assert.match(el.innerHTML, /tut-task done/);
  renderTutorial(el, { step: 0, done: false, minimized: false });
  assert.match(el.innerHTML, /data-tut="prev" disabled/);
  renderTutorial(el, { step: TUTORIAL_STEPS.length - 1, done: false, minimized: false });
  assert.match(el.innerHTML, new RegExp(`data-tut="close">${TUTORIAL_KO.finish}`));
  renderTutorial(el, { step: 3, done: false, minimized: true });
  assert.match(el.innerHTML, /data-tut="restore"/);
  assert.equal(inline('<b>x</b> **굵게**'), '&lt;b&gt;x&lt;/b&gt; <b>굵게</b>');
});
