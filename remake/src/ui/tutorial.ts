// Tutorial (docs/tutorial.md): a guided tour of the main rules on a live game of Operation Chromite, after the
// original manual (2.2 turn sequence, 3.41 movement, 3.41203 assaults, 4.2 combat strengths, 8.0 victory,
// 3.21 / 4.1 air operations, 6.1 supply and 3.41207 seaborne movement). Steps are data, the texts are in ko.ts
// (TUTORIAL_KO.steps), and main.ts supplies what the game looks like (TutProbe) and where the map marks go.

import { TUTORIAL_KO as T } from '../i18n/ko.ts';
import type { TutorialText } from '../i18n/ko.ts';

export type TutChapter = 'start' | 'phases' | 'move' | 'attack' | 'strength' | 'victory' | 'air' | 'supply' | 'end';
export const TUT_CHAPTERS: TutChapter[] = ['start', 'phases', 'move', 'attack', 'strength', 'victory', 'air', 'supply', 'end'];

/** "Try it" tasks: checked against the game every moment the card is open (see taskDone). */
export type TutTask = 'select' | 'move' | 'assaultPreview' | 'airOpen' | 'supplyLayer' | 'endPhase';

/** Hexes marked on the map for a step (main.ts finds them in the running game). */
export type TutMarks = 'force' | 'attackPair' | 'cities' | 'ports' | 'xCorps';

export interface TutStep {
  /** key of TUTORIAL_KO.steps */
  id: string;
  chapter: TutChapter;
  /** CSS selector(s) of the screen parts to outline */
  focus?: string;
  marks?: TutMarks;
  task?: TutTask;
  /** open the Air Operations screen when the step begins (if the phase allows it) */
  openAir?: boolean;
}

export const TUTORIAL_STEPS: TutStep[] = [
  { id: 'welcome', chapter: 'start' },
  { id: 'screen', chapter: 'start', focus: '#date, #phase, #weather, #victory, #panel' },
  { id: 'counters', chapter: 'start', marks: 'force', task: 'select' },
  { id: 'turn', chapter: 'phases', focus: '#phase' },
  { id: 'order', chapter: 'phases', focus: '#phase' },
  { id: 'endphase', chapter: 'phases', focus: '#end-phase' },
  { id: 'select', chapter: 'move', marks: 'force', task: 'move' },
  { id: 'allowance', chapter: 'move', focus: '.key-stats' },
  { id: 'costs', chapter: 'move' },
  { id: 'special', chapter: 'move', focus: '[data-action="mode"]' },
  { id: 'plot', chapter: 'attack', marks: 'attackPair', task: 'assaultPreview', focus: '.card.preview.assault' },
  { id: 'overrun', chapter: 'attack' },
  { id: 'result', chapter: 'attack' },
  { id: 'numbers', chapter: 'strength', marks: 'force', focus: '.key-stats .str' },
  { id: 'modifiers', chapter: 'strength' },
  { id: 'terrain', chapter: 'strength' },
  { id: 'level', chapter: 'victory', focus: '#victory', marks: 'cities' },
  { id: 'end', chapter: 'victory' },
  { id: 'airops', chapter: 'air', focus: '#air-ops', task: 'airOpen' },
  { id: 'airweather', chapter: 'air', focus: '.card.air-ops', openAir: true },
  { id: 'strike', chapter: 'air' },
  { id: 'net', chapter: 'supply', focus: '#layers-btn', marks: 'ports', task: 'supplyLayer' },
  { id: 'resupply', chapter: 'supply', focus: '#reports-btn' },
  { id: 'sea', chapter: 'supply', marks: 'xCorps', focus: '[data-action="mode"][data-mode="sea"]' },
  { id: 'finish', chapter: 'end', focus: '#end-phase', task: 'endPhase' },
];

/** The text of a step (every step has one: tests/tutorial.test.ts). */
export const stepText = (s: TutStep): TutorialText => T.steps[s.id];

/** First step of a chapter. */
export const chapterStart = (c: TutChapter): number => TUTORIAL_STEPS.findIndex((s) => s.chapter === c);

/** What the game looks like now, for the tasks. Counters only grow; `phaseKey` changes with the phase. */
export interface TutProbe {
  /** a force of the human side is selected for orders */
  selected: boolean;
  /** moves made since the tutorial began */
  moves: number;
  /** assault orders given since the tutorial began */
  assaults: number;
  /** an assault preview is on screen */
  preview: boolean;
  airOpen: boolean;
  supplyLayer: boolean;
  phaseKey: string;
}

/** Is the task done, compared with the moment the step began (`base`)? Pure logic. */
export function taskDone(task: TutTask, base: TutProbe, now: TutProbe): boolean {
  switch (task) {
    case 'select': return now.selected;
    case 'move': return now.moves > base.moves;
    case 'assaultPreview': return now.preview || now.assaults > base.assaults;
    case 'airOpen': return now.airOpen;
    case 'supplyLayer': return now.supplyLayer;
    case 'endPhase': return now.phaseKey !== base.phaseKey;
  }
  return false;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
/** Escaped text with **bold**. */
export const inline = (s: string) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');

function paragraphs(list: string[] = []): string {
  let out = '';
  let inList = false;
  for (const p of list) {
    const item = p.startsWith('• ');
    if (item && !inList) { out += '<ul>'; inList = true; }
    if (!item && inList) { out += '</ul>'; inList = false; }
    out += item ? `<li>${inline(p.slice(2))}</li>` : `<p>${inline(p)}</p>`;
  }
  return inList ? out + '</ul>' : out;
}

export interface TutView {
  step: number;
  /** the step's task is done */
  done: boolean;
  /** folded to a small button */
  minimized: boolean;
}

/** The tutorial card (buttons carry data-tut; main.ts handles them). */
export function renderTutorial(el: HTMLElement, v: TutView) {
  const n = TUTORIAL_STEPS.length;
  const s = TUTORIAL_STEPS[v.step];
  if (v.minimized) {
    el.innerHTML = `<button type="button" class="btn tut-pill" data-tut="restore">${esc(T.restore(v.step + 1, n))}</button>`;
    return;
  }
  const text = stepText(s);
  const chapters = TUT_CHAPTERS.map((c, k) =>
    `<button type="button" class="tut-chap${c === s.chapter ? ' on' : ''}" data-tut="chapter" data-value="${c}" aria-current="${c === s.chapter}">${k + 1}. ${esc(T.chapters[c])}</button>`).join('');
  const table = text.table
    ? `<table class="tut-table">${text.table.head ? `<thead><tr>${text.table.head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead>` : ''}
        <tbody>${text.table.rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`
    : '';
  const task = text.task
    ? `<div class="tut-task${v.done ? ' done' : ''}"><b>${v.done ? `✓ ${esc(T.done)}` : esc(T.tryIt)}</b><span>${inline(text.task)}</span></div>`
    : '';
  const last = v.step === n - 1;
  el.innerHTML = `
    <div class="tut-card" role="dialog" aria-label="${esc(T.title)}">
      <div class="tut-top">
        <span class="tut-kicker">${esc(T.title)} · ${esc(T.stepOf(v.step + 1, n))}</span>
        <span class="tut-tools">
          <button type="button" class="tut-icon" data-tut="min" title="${esc(T.minimize)}" aria-label="${esc(T.minimize)}">–</button>
          <button type="button" class="tut-icon" data-tut="close" title="${esc(T.close)}" aria-label="${esc(T.close)}">✕</button>
        </span>
      </div>
      <nav class="tut-chaps">${chapters}</nav>
      <h3>${esc(text.title)}</h3>
      <div class="tut-body">${paragraphs(text.body)}${table}${paragraphs(text.after)}</div>
      ${task}
      ${text.manual ? `<p class="tut-ref">${esc(T.manual(text.manual))}</p>` : ''}
      <div class="tut-nav">
        <button type="button" class="btn small" data-tut="prev" ${v.step === 0 ? 'disabled' : ''}>${esc(T.prev)}</button>
        <div class="tut-bar"><i style="width:${(((v.step + 1) / n) * 100).toFixed(1)}%"></i></div>
        <button type="button" class="btn small primary" data-tut="${last ? 'close' : 'next'}">${esc(last ? T.finish : T.next)}</button>
      </div>
    </div>`;
}
