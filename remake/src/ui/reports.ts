// Report screens (docs/rules/reports.md): one dialog with a tab per report of the original orders-phase menu
// (strategic report, airfields and ports, weather, scenario info) and the strategic overview map with its supply-net mode.

import type { GameState, Side } from '../engine/state.ts';
import type { GameOptions } from '../engine/options.ts';
import { ccfStatus, airShownAsProgram, RANDOM_COMPETENCE } from '../engine/options.ts';
import { strategicReport, portsAirfieldsReport, weatherReport, overviewCells, PARALLEL_38_ROW } from '../engine/reports.ts';
import type { OverviewCell, OverviewTerrain } from '../engine/reports.ts';
import { terrainHeld, territoryBalance } from '../engine/endturn.ts';
import { gameDate } from '../engine/weather.ts';
import { placeAt } from '../data/places.ts';
import {
  REPORT_UI_KO as T, NATION_KO, PLAYER_KO, SIDE_KO, EQUIPMENT_KO, TEMPERATURE_KO, SKY_KO, OPTIONS_UI_KO as O, SCENARIO_INFO_KO,
  dateKo, newsKo, victoryKo,
} from '../i18n/ko.ts';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export type ReportTab = 'strategic' | 'facilities' | 'weather' | 'scenario' | 'overview';
export const REPORT_TABS: ReportTab[] = ['strategic', 'facilities', 'weather', 'scenario', 'overview'];

export interface ReportsView {
  tab: ReportTab;
  game: GameState;
  options: GameOptions | null;
  /** 'S' for the deployment edition */
  variant: string | undefined;
  /** the human side whose view the reports show */
  viewer: Side;
  overviewMode: 'terrain' | 'supply';
}

const playerOf = (side: Side) => (side === 'communist' ? 1 : 2);
const occupierKo = (p: number) => (p === 1 ? SIDE_KO.un : p === 2 ? SIDE_KO.communist : '-');
const dateOf = (g: GameState, turn = g.turn) => { const d = gameDate(g, turn); return dateKo(d.year, d.month, d.day); };

function strategic(v: ReportsView): string {
  const g = v.game;
  const r = strategicReport(g, playerOf(v.viewer));
  const held = terrainHeld(g);
  const pts = (s: Side) => 100 * held.cities[s] + held.hexes[s];
  const row = (s: Side) => `<tr><th>${esc(SIDE_KO[s])}</th><td>${r.held[s].urban}</td><td>${r.held[s].other}</td><td>${r.held[s].stockpile}</td><td class="muted">${pts(s)}</td></tr>`;
  // equipment columns that exist in this scenario
  const types = Array.from({ length: 15 }, (_, k) => k + 1).filter((t) => { const n = g.equipmentTypes.get(t)?.name; return n && n !== 'nothing'; });
  const head = types.map((t) => `<th title="${esc(g.equipmentTypes.get(t)!.name)}">${esc(EQUIPMENT_KO[g.equipmentTypes.get(t)!.name] ?? g.equipmentTypes.get(t)!.name)}</th>`).join('');
  const pool = r.pool.map((p) => `<tr><th>${esc(NATION_KO[p.nation])}</th>${p.values
    ? types.map((t) => `<td${p.values![t - 1] ? '' : ' class="muted"'}>${p.values![t - 1]}</td>`).join('')
    : `<td colspan="${types.length}" class="muted">${esc(T.notAvailable)}</td>`}</tr>`).join('');
  const news = r.news.map((n) => `<li><span class="muted">${esc(dateOf(g, n.turn))}</span> ${esc(newsKo(n.text).text)}</li>`).join('');
  return `
    <h3>${esc(T.general)}</h3>
    <table class="rp-table"><thead><tr><th></th><th>${esc(T.urban)}</th><th>${esc(T.other)}</th><th>${esc(T.stockpile)}</th><th class="muted" title="${esc(T.remakeAdded)}">${esc(T.points)}*</th></tr></thead>
      <tbody>${row('un')}${row('communist')}</tbody></table>
    <p class="rp-line">${esc(T.unInterdiction)} <b>${r.unInterdiction}</b> · ${esc(r.communistAir.kind === 'interception' ? T.redInterception : T.redInterdiction)} <b>${r.communistAir.value}</b>
      · <span class="muted">${esc(T.victory)}* ${g.victoryVoid ? '-' : esc(victoryKo(territoryBalance(g)))}</span></p>
    <h3>${esc(T.pool(SIDE_KO[r.poolSide]))}</h3>
    <div class="rp-scroll"><table class="rp-table pool"><thead><tr><th></th>${head}</tr></thead><tbody>${pool}</tbody></table></div>
    <p class="rp-hint">${esc(T.poolHint)}</p>
    ${r.ccf ? `<p class="rp-line">${esc(T.ccf)}: <b>${esc(T.ccfValues[r.ccf])}</b></p>` : ''}
    <h3>${esc(T.news)}</h3>
    <ul class="rp-news">${news || '<li class="muted">-</li>'}</ul>
    <p class="rp-foot">${esc(dateOf(g))} · ${esc(T.gameTurn(r.gameTurn))} <span class="muted">· * ${esc(T.remakeAdded)}</span></p>`;
}

function facilities(v: ReportsView): string {
  const g = v.game;
  const r = portsAirfieldsReport(g);
  const name = (x: number, y: number, orig: string) => {
    const p = placeAt(x, y, g.scenarioNo === 4);
    return `${esc(p?.label ?? orig)} <span class="muted">${esc(orig)}</span>`;
  };
  const occ = (p: number) => `<span class="${p === 1 ? 'occ-un' : p === 2 ? 'occ-red' : 'muted'}">${esc(occupierKo(p))}</span>`;
  const af = r.airfields.map((a) => `<tr><th>${name(a.x, a.y, a.name)}</th><td>${a.x},${a.y}</td><td>${occ(a.occupier)}</td><td>${a.current}</td><td>${a.best}</td></tr>`).join('');
  const pt = r.ports.map((p) => `<tr><th>${name(p.x, p.y, p.name)}</th><td>${p.x},${p.y}</td><td>${occ(p.occupier)}</td><td class="${p.mined ? 'warn-text' : ''}">${esc(p.mined ? T.mined : T.clear)}</td></tr>`).join('');
  return `
    <h3>${esc(T.airfields)}</h3>
    <table class="rp-table"><thead><tr><th></th><th>${esc(T.hex)}</th><th>${esc(T.occupier)}</th><th>${esc(T.current)}</th><th>${esc(T.best)}</th></tr></thead><tbody>${af}</tbody></table>
    <p class="rp-hint">${esc(T.levelHint)}</p>
    <h3>${esc(T.ports)}</h3>
    <table class="rp-table"><thead><tr><th></th><th>${esc(T.hex)}</th><th>${esc(T.occupier)}</th><th>${esc(T.status)}</th></tr></thead><tbody>${pt}</tbody></table>`;
}

function weather(v: ReportsView): string {
  const g = v.game;
  const r = weatherReport(g, playerOf(v.viewer));
  const rows = r.forecast.map((f, k) => `<tr><th>${esc(T.forecastRows[k])}</th><td>${esc(TEMPERATURE_KO[f.temperature] ?? '-')}</td><td>${esc(SKY_KO[f.sky] ?? '-')}</td></tr>`).join('');
  return `
    <h3>${esc(T.forecastTitle)} <span class="muted">(${esc(SIDE_KO[v.viewer])})</span></h3>
    <table class="rp-table"><tbody>${rows}</tbody></table>
    <p class="rp-hint">${esc(T.forecastHint)}</p>
    <h3>${esc(T.effects)}</h3>
    <table class="rp-table"><tbody>
      <tr><th>${esc(T.readiness)}</th><td>${esc(r.readiness ? T.readinessLoss(r.readiness) : T.readinessStd)}</td></tr>
      <tr><th>${esc(T.movement)}</th><td>${esc(r.stormMovement ? T.movementStorm : T.movementStd)}</td></tr>
      <tr><th>${esc(T.airOps)}</th><td>${esc(T.airValues[r.air])}</td></tr>
      <tr><th>${esc(T.freeze)}</th><td>${esc(r.freezeLine ? T.freezeRow(r.freezeLine) : T.thawed)}</td></tr>
    </tbody></table>`;
}

function scenario(v: ReportsView): string {
  const g = v.game;
  const o = v.options;
  const info = SCENARIO_INFO_KO[g.scenarioNo - 1];
  const ccf = ccfStatus(g.scenarioNo as 1 | 2 | 3 | 4);
  const comp = O.competenceValues[g.competence - 1] ?? String(g.competence);
  const rows: [string, string][] = [
    [O.scenario, `${g.scenarioNo}. ${info?.title ?? ''} (${info?.en ?? ''})${v.variant === 'S' ? ` · ${O.deployment}` : ''}`],
    [O.ccf, ccf === 'choose' ? O.ccfValues[g.ccfFixed ? 1 : 0] : ccf === 'inProgress' ? O.ccfInProgress : O.ccfNotAllowed],
    [O.competence, o?.competence === RANDOM_COMPETENCE ? O.randomRolled(comp) : comp],
    [O.playMode, O.playModeValues[g.computerSide] ?? ''],
    ...(g.computerSide ? [[O.ai, O.aiValues[g.aiLevel === 'improved' ? 1 : 0]] as [string, string]] : []),
    [O.air, O.airValues[airShownAsProgram({ airPlayerControl: g.airPlayerControl, scenario: g.scenarioNo as 1 | 2 | 3 | 4, playMode: g.computerSide as 0 | 1 | 2 }) ? 1 : 0]],
    [O.intel, O.intelValues[g.limitedIntel ? 0 : 1]],
  ];
  return `<h3>${esc(T.scenarioTitle)}</h3>
    <table class="rp-table"><tbody>${rows.map(([k, val]) => `<tr><th>${esc(k)}</th><td>${esc(val)}</td></tr>`).join('')}</tbody></table>
    <p class="rp-hint">${esc(info?.desc ?? '')}</p>`;
}

function overview(v: ReportsView): string {
  const modes = (['terrain', 'supply'] as const).map((m) => `<button type="button" data-rp="mode" data-value="${m}" aria-pressed="${v.overviewMode === m}">${esc(T.mode[m])}</button>`).join('');
  return `<div class="seg rp-modes" role="group">${modes}</div>
    <canvas class="rp-overview" width="${34 * CELL_W + 8}" height="${66 * CELL_H + CELL_H / 2 + 8}"></canvas>
    <p class="rp-hint">${esc(v.overviewMode === 'supply' ? T.supplyHint : T.overviewHint)}</p>`;
}

export function renderReports(el: HTMLElement, v: ReportsView) {
  const tabs = REPORT_TABS.map((t) => `<button type="button" data-rp="tab" data-value="${t}" aria-pressed="${v.tab === t}">${esc(T.tabs[t])}</button>`).join('');
  const body = v.tab === 'strategic' ? strategic(v) : v.tab === 'facilities' ? facilities(v) : v.tab === 'weather' ? weather(v) : v.tab === 'scenario' ? scenario(v) : overview(v);
  el.innerHTML = `
    <div class="box newgame reports" role="dialog" aria-modal="true" aria-labelledby="rp-title">
      <p class="eyebrow">${esc(T.eyebrow)} · ${esc(PLAYER_KO[playerOf(v.viewer)])}</p>
      <h2 id="rp-title">${esc(T.tabs[v.tab])}</h2>
      <div class="seg rp-tabs" role="tablist">${tabs}</div>
      <div class="rp-body">${body}</div>
      <div class="actions"><button type="button" class="btn ghost" data-rp="close">${esc(T.close)} <span class="kbd">Esc</span></button></div>
    </div>`;
  const canvas = el.querySelector<HTMLCanvasElement>('canvas.rp-overview');
  if (canvas) drawOverview(canvas, v.game, overviewCells(v.game, v.viewer), v.overviewMode);
}

// ---------- the overview mini map (DO_OVERVIEW / supply-net display) ----------

export const CELL_W = 9;
export const CELL_H = 6;
const PAD = 4;
const TERRAIN_COLOR: Record<OverviewTerrain, string> = {
  open: '#8fb46e', river: '#5e8f4f', rough: '#9a7b4f', mountain: '#7a5c3a', city: '#c9c9c9', sea: '#1f4f8f', lake: '#4f8fd0', edge: '#111',
};

/** Top-left pixel of hex (x, y): even columns are half a cell lower (even-q). */
export function overviewCell(x: number, y: number): [number, number] {
  return [PAD + x * CELL_W, PAD + y * CELL_H + (x % 2 === 0 ? CELL_H / 2 : 0)];
}

/** Hex under a canvas point, or null. */
export function overviewHexAt(px: number, py: number): [number, number] | null {
  const x = Math.floor((px - PAD) / CELL_W);
  if (x < 0 || x > 33) return null;
  const y = Math.floor((py - PAD - (x % 2 === 0 ? CELL_H / 2 : 0)) / CELL_H);
  if (y < 0 || y > 65) return null;
  return [x, y];
}

function drawOverview(c: HTMLCanvasElement, g: GameState, cells: OverviewCell[], mode: 'terrain' | 'supply') {
  const ctx = c.getContext('2d');
  if (!ctx) return;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, c.width, c.height);
  for (let i = 0; i < cells.length; i++) {
    const x = i % g.width, y = Math.floor(i / g.width);
    if (y === 0) continue; // row 0 is not drawn in the original
    const cell = cells[i];
    const [px, py] = overviewCell(x, y);
    const water = cell.terrain === 'sea' || cell.terrain === 'lake' || cell.terrain === 'edge';
    if (mode === 'supply') {
      ctx.fillStyle = water ? '#000' : cell.supplied ? (cell.possession === 1 ? '#3b6fd8' : '#d84a3b') : '#000';
      ctx.fillRect(px, py, CELL_W, CELL_H);
      if (!water && cell.possession && !cell.supplied) {
        ctx.fillStyle = cell.possession === 1 ? '#6f9cff' : '#ff7a6b';
        ctx.fillRect(px + CELL_W / 2 - 1, py + CELL_H / 2 - 1, 2, 2);
      }
      continue;
    }
    ctx.fillStyle = cell.force ? (cell.force === 'communist' ? '#e0483a' : '#f4f4f4') : TERRAIN_COLOR[cell.terrain];
    ctx.fillRect(px, py, CELL_W, CELL_H);
    if (cell.possession && !water) {
      ctx.fillStyle = cell.possession === 1 ? '#2f63c7' : '#b8261c';
      ctx.fillRect(px + CELL_W - 3, py + 1, 2, 2);
    }
    if (cell.road && !cell.force) { ctx.fillStyle = '#fff'; ctx.fillRect(px + 2, py + CELL_H - 2, 2, 1); }
    if (cell.rail && !cell.force) { ctx.fillStyle = '#222'; ctx.fillRect(px + 5, py + CELL_H - 2, 2, 1); }
  }
  // the 38th parallel (1950s): a straight line at the top of row 37
  if (g.scenarioNo < 4) {
    const y = PAD + PARALLEL_38_ROW * CELL_H;
    ctx.strokeStyle = '#ffeb3b';
    ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.moveTo(PAD, y); ctx.lineTo(PAD + 34 * CELL_W, y); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#ffeb3b';
    ctx.font = '11px sans-serif';
    ctx.fillText(T.parallel, PAD + 34 * CELL_W - 30, y - 3);
  }
}
