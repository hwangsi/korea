// Save / load dialog (docs/rules/save.md): browser storage slots, the autosave, and save files to download / upload.
// Buttons carry data-sv (action) and data-slot; main.ts handles them with one delegated listener.

import type { SaveSummary } from '../engine/save.ts';
import { SAVE_UI_KO as T, SCENARIO_INFO_KO, PLAYER_KO, PHASE_KO, dateKo } from '../i18n/ko.ts';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export interface SlotView {
  /** 'auto' or '1'..'5' */
  key: string;
  summary: SaveSummary | null;
  savedAt: string | null;
  /** The slot holds something that is not a readable save. */
  broken?: boolean;
}

export interface SaveDialogView {
  slots: SlotView[];
  /** Why saving is not possible now (null = it is). */
  blocked: string | null;
  /** The browser storage cannot be used (only files). */
  noStorage: boolean;
  message: { kind: 'ok' | 'warn' | 'error'; text: string } | null;
}

export function summaryText(s: SaveSummary): string {
  const title = SCENARIO_INFO_KO[s.scenarioNo - 1]?.title ?? `${s.scenarioNo}`;
  const who = s.computerSide ? ` · ${T.vsComputer(PLAYER_KO[3 - s.computerSide])}` : '';
  return `${s.scenarioNo}. ${title} · ${dateKo(s.date.year, s.date.month, s.date.day)} · ${s.turn}턴 · ${PLAYER_KO[s.player]} ${PHASE_KO[s.phase] ?? ''}${who}`;
}

function savedAtText(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function slotRow(s: SlotView, v: SaveDialogView): string {
  const auto = s.key === 'auto';
  const name = auto ? T.autoSlot : T.slot(s.key);
  const body = s.broken ? `<span class="warn-text">${esc(T.broken)}</span>`
    : s.summary ? `${esc(summaryText(s.summary))}<span class="sv-time">${esc(savedAtText(s.savedAt))}</span>`
    : `<span class="muted">${esc(auto ? T.autoEmpty : T.empty)}</span>`;
  const canSave = !auto && !v.blocked && !v.noStorage;
  const buttons = [
    auto ? '' : `<button type="button" class="btn" data-sv="save" data-slot="${s.key}"${canSave ? '' : ' disabled'}${v.blocked ? ` title="${esc(v.blocked)}"` : ''}>${esc(T.save)}</button>`,
    `<button type="button" class="btn" data-sv="load" data-slot="${s.key}"${s.summary ? '' : ' disabled'}>${esc(T.load)}</button>`,
    auto ? '' : `<button type="button" class="btn ghost" data-sv="delete" data-slot="${s.key}"${s.summary || s.broken ? '' : ' disabled'} title="${esc(T.delete)}">${esc(T.deleteShort)}</button>`,
  ].join('');
  return `<li class="sv-slot${auto ? ' auto' : ''}"><span class="sv-name">${esc(name)}</span><span class="sv-body">${body}</span><span class="sv-buttons">${buttons}</span></li>`;
}

export function renderSaveDialog(el: HTMLElement, v: SaveDialogView) {
  const msg = v.message ? `<p class="sv-msg ${v.message.kind}">${esc(v.message.text)}</p>` : '';
  el.innerHTML = `
    <div class="box newgame savegame" role="dialog" aria-modal="true" aria-labelledby="sv-title">
      <p class="eyebrow">${esc(T.eyebrow)}</p>
      <h2 id="sv-title">${esc(T.title)}</h2>
      ${v.blocked ? `<p class="ng-hint">${esc(v.blocked)}</p>` : ''}
      ${v.noStorage ? `<p class="ng-hint warn-text">${esc(T.noStorage)}</p>` : ''}
      <ul class="sv-slots">${v.slots.map((s) => slotRow(s, v)).join('')}</ul>
      <div class="sv-files">
        <button type="button" class="btn" data-sv="download"${v.blocked ? ' disabled' : ''}>${esc(T.download)}</button>
        <button type="button" class="btn" data-sv="upload">${esc(T.upload)}</button>
        <span class="ng-hint">${esc(T.fileHint)}</span>
      </div>
      ${msg}
      <div class="actions">
        <button type="button" class="btn ghost" data-sv="close">${esc(T.close)} <span class="kbd">Esc</span></button>
      </div>
    </div>`;
}
