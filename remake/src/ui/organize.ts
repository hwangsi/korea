// Force organisation dialog (docs/rules/forces.md): the original FULL HEX REPORT as two force columns side by side,
// with a transfer button on every unit, the force names, the hex's terrain multipliers and + Hex / - Hex.

import type { GameState, UnitState } from '../engine/state.ts';
import { forceUnits, unit } from '../engine/state.ts';
import { unitStrength } from '../engine/combat.ts';
import { hexSlots, forcePresence, hexModifiers, transferCheck, canRename, FORCE_NAME_MAX } from '../engine/forces.ts';
import type { TransferCheck } from '../engine/forces.ts';
import { placeAt, featureAt } from '../data/places.ts';
import {
  FORCES_UI_KO as T, NATION_KO, KIND_KO, EXPERIENCE_KO, TERRAIN_KO, PLAYER_KO, PHASE_KO, unitNameKo, forceNameKo, LAYOUT_KO,
} from '../i18n/ko.ts';
import { NATION_COLOR } from './mapView.ts';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export interface OrganizeView {
  game: GameState;
  x: number;
  y: number;
  message: { kind: 'ok' | 'warn' | 'error'; text: string } | null;
  /** Slot whose name is being edited. */
  renaming: 0 | 1 | null;
}

/** The name a force shows (as in the hex panel): the force name for two units or more, else the unit's own. */
export function forceTitleKo(g: GameState, leader: number): string {
  const members = forceUnits(g, leader);
  const name = members[0].forceName.replace(/\+$/, '').trim();
  return members.length > 1 && name ? forceNameKo(name) : unitNameKo(members[0].name);
}

const factor = (n: number) => `×${n.toFixed(1)}`;

function effectLine(g: GameState, c: TransferCheck): string {
  if (!c.allowed) return '';
  const parts: string[] = [];
  if (c.kind === 'merge') parts.push(T.merge(unitNameKo(unit(g, c.mergeInto).name)));
  if (c.cost > 0) parts.push(T.cost(c.cost));
  if (c.joinsAssault) parts.push(T.joinsAssault);
  if (c.dropsAssault) parts.push(T.dropsAssault);
  return parts.length ? `<p class="og-effect">${esc(parts.join(' · '))}</p>` : '';
}

function unitRow(v: OrganizeView, u: UnitState, slot: 0 | 1, first: boolean, targetExists: boolean): string {
  const g = v.game;
  const s = unitStrength(g, u, v.x, v.y, 0);
  const ready = Math.max(0, Math.min(100, u.readiness));
  const c = transferCheck(g, v.x, v.y, u.id);
  const to = targetExists ? T.moveTo(slot === 0 ? 2 : 1) : T.splitTo;
  const label = slot === 0 ? `${to} →` : `← ${to}`;
  const why = c.allowed ? '' : T.blocked[c.reason ?? ''] ?? '';
  return `
    <li class="og-unit ${c.allowed ? '' : 'blocked'}">
      <div class="og-unit-main">
        <div class="unit-title"><b>${esc(unitNameKo(u.name))}</b><span class="muted en">${esc(u.name)}</span></div>
        <div class="unit-meta">
          ${first ? `<span class="tag on">${esc(T.leader)}</span>` : ''}
          <span class="tag">${esc(KIND_KO[u.kind] ?? u.kind)}</span>
          <span class="tag">${esc(EXPERIENCE_KO[u.experience] ?? '?')}</span>
          <span class="strength" title="${esc(T.strength)}">${Math.trunc(s.L / 10)}-${Math.trunc(s.S / 10)}</span>
        </div>
        <div class="bar" title="준비도 ${ready}%"><i style="width:${ready}%"></i></div>
        ${effectLine(g, c)}
      </div>
      <button type="button" class="btn small og-xfer" data-og="xfer" data-unit="${u.id}" ${c.allowed ? '' : 'disabled'} title="${esc(why || label)}">${esc(label)}</button>
      ${why ? `<p class="og-why" title="${esc(why)}">${esc(T.blockedShort[c.reason ?? ''] ?? why)}</p>` : ''}
    </li>`;
}

function forceColumn(v: OrganizeView, slot: 0 | 1, ids: number[], otherIds: number[]): string {
  const g = v.game;
  if (!ids.length) {
    return `<section class="og-force empty"><header><h3>${esc(T.newForce)}</h3></header><p class="muted small">${esc(T.newForceHint)}</p></section>`;
  }
  const leader = ids[0];
  const lead = unit(g, leader);
  const p = forcePresence(g, leader, v.x, v.y);
  const renamable = canRename(g, leader);
  const title = forceTitleKo(g, leader);
  const head = v.renaming === slot
    ? `<div class="og-rename">
        <input type="text" id="og-name-${slot}" maxlength="${FORCE_NAME_MAX}" value="${esc(title.slice(0, FORCE_NAME_MAX))}" aria-label="${esc(T.rename)}" />
        <button type="button" class="btn primary small" data-og="rename-ok" data-slot="${slot}">${esc(T.renameOk)}</button>
        <button type="button" class="btn ghost small" data-og="rename-cancel">${esc(T.renameCancel)}</button>
      </div><p class="muted small">${esc(T.renameHint)}</p>`
    : `<div class="og-title"><span class="chip" style="background:${NATION_COLOR[lead.nation]}"></span>
        <div><p class="eyebrow">${esc(T.force(slot + 1))}</p><h3>${esc(title)}</h3>
        <span class="muted small">${esc(NATION_KO[lead.nation])} · ${esc(T.units(ids.length))}</span></div>
        <button type="button" class="btn small" data-og="rename" data-slot="${slot}" ${renamable ? '' : 'disabled'} title="${esc(renamable ? T.rename : T.renameLone)}">${esc(T.rename)}</button></div>`;
  const stats = `<div class="og-stats">
      <div><span class="label">${esc(T.strength)}</span><b>${p.lethality}-${p.survivability}</b></div>
      <div><span class="label">${esc(T.readiness)}</span><b>${p.readiness}%</b></div>
      <div><span class="label">${esc(T.movement)}</span><b>${p.movement}</b>${p.assault ? ` <span class="tag warn">${esc(T.assault)}</span>` : ''}</div>
    </div>`;
  const rows = ids.map((id, k) => unitRow(v, unit(g, id), slot, k === 0, otherIds.length > 0)).join('');
  return `<section class="og-force"><header>${head}</header>${stats}<ul class="og-units">${rows}</ul></section>`;
}

export function renderOrganize(el: HTMLElement, v: OrganizeView) {
  const g = v.game;
  const [a, b] = hexSlots(g, v.x, v.y);
  const place = placeAt(v.x, v.y, g.scenarioNo === 4);
  const feature = featureAt(v.x, v.y);
  const hex = g.hexes[v.y * g.width + v.x];
  const m = hexModifiers(g, v.x, v.y);
  const msg = v.message ? `<p class="og-msg ${v.message.kind}" role="status">${esc(v.message.text)}</p>` : '';
  el.innerHTML = `
    <div class="box newgame organize side-${g.player === 2 ? 'un' : 'red'}" role="dialog" aria-modal="true" aria-labelledby="og-title">
      <p class="eyebrow">${esc(T.eyebrow)} · ${esc(PLAYER_KO[g.player])} ${esc(PHASE_KO[g.phase] ?? '')}</p>
      <div class="og-head">
        <h2 id="og-title">${esc(place?.label ?? feature?.label ?? TERRAIN_KO[hex.terrain])} <span class="muted og-xy">(${v.x}, ${v.y})</span></h2>
        <div class="og-nav" title="${esc(T.hexNavTitle)}">
          <button type="button" class="btn small" data-og="prev">${esc(T.prevHex)}</button>
          <button type="button" class="btn small" data-og="next">${esc(T.nextHex)}</button>
        </div>
      </div>
      <p class="og-terrain"><span class="muted">${esc(T.terrain)} · ${esc(TERRAIN_KO[hex.terrain])}</span>
        <span class="og-mod ${m.lethality !== 1 ? 'on' : ''}" title="${esc(T.lethalityNote)}">${esc(T.lethality)} <b>${factor(m.lethality)}</b></span>
        <span class="og-mod ${m.hardSurvival !== 1 ? 'on' : ''}">${esc(T.hardSurvival)} <b>${factor(m.hardSurvival)}</b></span>
        <span class="og-mod ${m.softSurvival !== 1 ? 'on' : ''}">${esc(T.softSurvival)} <b>${factor(m.softSurvival)}</b></span></p>
      <div class="og-cols">${forceColumn(v, 0, a, b)}${forceColumn(v, 1, b, a)}</div>
      ${msg}
      <details class="hint og-rules"><summary>${esc(LAYOUT_KO.help)}</summary><p class="rp-hint">${esc(T.rules)}</p></details>
      <div class="actions"><button type="button" class="btn ghost" data-og="close">${esc(T.close)} <span class="kbd">Esc</span></button></div>
    </div>`;
}
