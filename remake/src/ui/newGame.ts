// New game dialog: the original start menu (docs/rules/options.md) as a mouse-first dialog over the map.
// Buttons carry data-ng (field) and data-value; main.ts handles them with one delegated listener.

import type { GameOptions } from '../engine/options.ts';
import { aiAvailable } from '../engine/ai/index.ts';
import { ccfStatus, airShownAsProgram, scenarioFileId, usesDeploymentFile } from '../engine/options.ts';
import { SCENARIO_INFO_KO, OPTIONS_UI_KO as T, SAVE_UI_KO, TUTORIAL_KO } from '../i18n/ko.ts';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export interface NewGameView {
  options: GameOptions;
  /** A game is running: the dialog can be closed without starting a new one. */
  canClose: boolean;
}

/** One row of choices: a label, buttons (the current one pressed), a hint under them. */
function row(label: string, field: string, choices: { value: string; label: string; title?: string; disabled?: boolean }[], current: string, hint: string, cls = ''): string {
  const buttons = choices.map((c) =>
    `<button type="button" data-ng="${field}" data-value="${c.value}" aria-pressed="${c.value === current}"${c.disabled ? ' disabled' : ''}${c.title ? ` title="${esc(c.title)}"` : ''}>${esc(c.label)}</button>`).join('');
  return `
    <div class="ng-row">
      <span class="ng-label">${esc(label)}</span>
      <div class="ng-choices">
        <div class="seg ng-seg ${cls}" role="group" aria-label="${esc(label)}">${buttons}</div>
        ${hint ? `<p class="ng-hint">${hint}</p>` : ''}
      </div>
    </div>`;
}

export function renderNewGame(el: HTMLElement, v: NewGameView) {
  const o = v.options;
  const cards = SCENARIO_INFO_KO.map((s) => `
      <button type="button" class="scen-card" data-ng="scenario" data-value="${s.no}" aria-pressed="${o.scenario === s.no}">
        <span class="scen-no">${s.no}</span>
        <b>${esc(s.title)}</b>
        <span class="scen-date">${esc(s.date)}</span>
        <span class="scen-desc">${esc(s.desc)}</span>
        <span class="scen-en">${esc(s.en)}</span>
      </button>`).join('');

  const ccf = ccfStatus(o.scenario);
  const ccfRow = ccf === 'choose'
    ? row(T.ccf, 'ccf', T.ccfValues.map((label, k) => ({ value: String(k), label })), o.ccfFixed ? '1' : '0', esc(T.ccfHint[o.ccfFixed ? 1 : 0]))
    : row(T.ccf, 'ccf', [{ value: 'x', label: ccf === 'inProgress' ? T.ccfInProgress : T.ccfNotAllowed, disabled: true }], '', '', 'one');

  const competence = row(T.competence, 'competence',
    T.competenceValues.map((label, k) => ({ value: String(k + 1), label, title: T.competenceEn[k] })), String(o.competence), esc(T.competenceHint), 'six');

  // the computer side of UN Solitaire is PLAYER 1 (Communist), of Red Solitaire PLAYER 2 (UN)
  const computer = o.playMode === 0 ? null : (o.playMode as 1 | 2);
  const noAi = computer !== null && !aiAvailable(computer, 'original');
  const modeHint = esc(T.playModeHint[o.playMode]) + (noAi ? `<br><span class="warn-text">${esc(T.noAi)}</span>` : '');
  const mode = row(T.playMode, 'playMode',
    T.playModeValues.map((label, k) => ({ value: String(k), label, title: T.playModeEn[k] })), String(o.playMode), modeHint, 'three');
  const levels = ['original', 'improved'] as const;
  const aiRow = computer !== null && !noAi
    ? row(T.ai, 'ai', levels.map((lv, k) => {
      const ok = aiAvailable(computer, lv);
      return { value: lv, label: ok ? T.aiValues[k] : `${T.aiValues[k]} (${T.aiSoon})`, title: T.aiTitles[k], disabled: !ok };
    }), o.aiLevel ?? 'original', esc(T.aiHint(computer, o.aiLevel ?? 'original')))
    : '';

  const program = airShownAsProgram(o);
  const airHint = esc(T.airHint[o.airPlayerControl ? 0 : 1]) + (o.airPlayerControl && program ? `<br><span class="muted">${esc(T.airShownProgram)}</span>` : '');
  const air = row(T.air, 'air', T.airValues.map((label, k) => ({ value: String(k), label })), o.airPlayerControl ? '0' : '1', airHint);

  const intel = row(T.intel, 'intel', T.intelValues.map((label, k) => ({ value: String(k), label })), o.limitedIntel ? '0' : '1', esc(T.intelHint[o.limitedIntel ? 0 : 1]));

  const variants = ['auto', 'base', 'deployment'];
  const variant = row(T.variantLabel, 'variant', T.variantValues.map((label, k) => ({ value: variants[k], label })), o.variant,
    `${esc(T.variantHint)}<br><span class="muted">${esc(T.file(scenarioFileId(o) + '.dat'))}${usesDeploymentFile(o) ? ` · ${esc(T.deployment)}` : ''}</span>`, 'three');

  el.innerHTML = `
    <div class="box newgame" role="dialog" aria-modal="true" aria-labelledby="ng-title">
      <p class="eyebrow">${esc(T.eyebrow)}</p>
      <h2 id="ng-title">${esc(T.title)}</h2>
      <div class="scen-grid" role="group" aria-label="${esc(T.scenario)}">${cards}</div>
      <div class="ng-rows">
        ${ccfRow}
        ${competence}
        ${mode}
        ${aiRow}
        ${air}
        ${intel}
      </div>
      <details class="ng-advanced" ${o.variant !== 'auto' ? 'open' : ''}>
        <summary>${esc(T.advanced)}</summary>
        ${variant}
      </details>
      <div class="actions">
        <button type="button" class="btn primary" data-ng="start">${esc(T.start)} <span class="kbd">Enter</span></button>
        <button type="button" class="btn" data-ng="load">${esc(SAVE_UI_KO.fromNewGame)}</button>
    <button type="button" class="btn ghost" data-ng="tutorial" title="${esc(TUTORIAL_KO.buttonTitle)}">${esc(TUTORIAL_KO.newGame)}</button>
        ${v.canClose ? `<button type="button" class="btn ghost" data-ng="close">${esc(T.cancel)}</button>` : ''}
      </div>
    </div>`;
}

/** Apply a dialog button to the options (returns the new options, or null for start / close). */
export function applyChoice(o: GameOptions, field: string, value: string): GameOptions {
  switch (field) {
    case 'scenario': return { ...o, scenario: Number(value) as GameOptions['scenario'] };
    case 'ccf': return value === 'x' ? o : { ...o, ccfFixed: value === '1' };
    case 'competence': return { ...o, competence: Number(value) };
    case 'playMode': return { ...o, playMode: Number(value) as GameOptions['playMode'] };
    case 'air': return { ...o, airPlayerControl: value === '0' };
    case 'intel': return { ...o, limitedIntel: value === '0' };
    case 'variant': return { ...o, variant: value as GameOptions['variant'] };
    case 'ai': return { ...o, aiLevel: value as GameOptions['aiLevel'] };
    default: return o;
  }
}
