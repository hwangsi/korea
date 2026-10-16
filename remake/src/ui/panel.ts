// Right-hand information panel (Korean UI): scenario summary, hex report, movement orders.
// Buttons carry data-action attributes; main.ts handles them with one delegated listener.

import type { EquipmentType, Force, Hex, MapData, Scenario } from '../data/types.ts';
import { effectiveStrength, displayStrength } from '../engine/strength.ts';
import type { GameState, UnitState } from '../engine/state.ts';
import { forceUnits, sideOf, unit } from '../engine/state.ts';
import { allowance, canEntrain, canBugOut } from '../engine/movement.ts';
import type { MoveMode, Reach } from '../engine/movement.ts';
import {
  TERRAIN_KO, NATION_KO, KIND_KO, EXPERIENCE_KO, EQUIPMENT_KO, POSSESSION_KO, SIDE_OF, SIDE_KO,
  TEMPERATURE_KO, SKY_KO, unitNameKo, forceNameKo, newsKo, dateKo, MOVE_MODE_KO, MOVE_UI_KO, BLOCK_KO, costItemKo,
} from '../i18n/ko.ts';
import { NATION_COLOR } from './mapView.ts';
import { directionsOf, DIRECTIONS } from '../engine/hex.ts';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const DIR_KO: Record<string, string> = { N: '북', NE: '북동', SE: '남동', S: '남', SW: '남서', NW: '북서' };
const dirsKo = (mask: number) => directionsOf(mask).map((d) => DIR_KO[DIRECTIONS[d]]).join('·');

export interface PanelContext {
  map: MapData;
  hexes: Hex[];
  scenario: Scenario;
  game: GameState;
  forcesAt: (x: number, y: number) => Force[];
}

export interface OrdersView {
  leader: number;
  mode: MoveMode;
  reach: Reach;
  /** Previewed path (hex indices, origin excluded). */
  path: number[] | null;
  pinned: boolean;
}

export interface PanelMessage { kind: 'ok' | 'warn' | 'error'; text: string; }

function forceTitle(g: GameState, leader: number): string {
  const members = forceUnits(g, leader);
  const lead = members[0];
  const name = lead.forceName.replace(/\+$/, '').trim();
  return members.length > 1 && name ? forceNameKo(name) : unitNameKo(lead.name);
}

function placeName(ctx: PanelContext, i: number): string {
  const { map, game } = ctx;
  const x = i % game.width, y = Math.floor(i / game.width);
  const is1995 = game.scenarioNo === 4;
  const city = map.cities.find((c) => c.x === x && c.y === y && (!c.only1995 || is1995));
  return `${city?.ko ?? TERRAIN_KO[game.hexes[i].terrain]} (${x}, ${y})`;
}

function messageCard(m: PanelMessage | null): string {
  if (!m) return '';
  return `<section class="card toast ${m.kind}" role="status">${esc(m.text)}</section>`;
}

export function renderSummary(el: HTMLElement, ctx: PanelContext, message: PanelMessage | null = null) {
  const s = ctx.scenario;
  const g = ctx.game;
  const onMap = g.stacks.flat().flatMap((l) => forceUnits(g, l));
  const side = (k: 'un' | 'communist') => onMap.filter((u) => SIDE_OF[u.nation] === k).length;
  const waiting = s.units.length - onMap.length;
  const news = s.news.map(newsKo);
  el.innerHTML = `
    ${messageCard(message)}
    <section class="card">
      <p class="eyebrow">시나리오 ${s.scenario}${s.variant === 'S' ? ' · 편성 배치' : ''}</p>
      <h2>${esc(s.title.ko)}</h2>
      <p class="muted">${esc(s.title.en)} · ${dateKo(s.date.year, s.date.month, s.date.day)} · ${s.turn}턴</p>
      <div class="stats">
        <div><span class="label">유엔군 유닛</span><span class="value un">${side('un')}</span></div>
        <div><span class="label">공산군 유닛</span><span class="value red">${side('communist')}</span></div>
        <div><span class="label">지도 밖·대기</span><span class="value">${waiting}</span></div>
      </div>
      <div class="stats">
        <div><span class="label">날씨</span><span class="value small">${TEMPERATURE_KO[s.weatherNow.temperature] ? `${TEMPERATURE_KO[s.weatherNow.temperature]} · ${SKY_KO[s.weatherNow.sky] ?? '-'}` : '시작 시 결정'}</span></div>
        <div><span class="label">보급 비축 (유엔/공산)</span><span class="value small">${s.stockpile.un} / ${s.stockpile.communist}</span></div>
      </div>
    </section>
    ${news.length ? `<section class="card"><h3>최근 소식</h3><ul class="news">${news.map((n) => `<li><span class="muted">${esc(n.date)}</span>${esc(n.text)}</li>`).join('')}</ul></section>` : ''}
    <section class="card help">
      <h3>조작</h3>
      <ul>
        <li>부대가 있는 헥스 클릭: 부대 선택, 갈 수 있는 범위 표시</li>
        <li>범위 안 헥스에 마우스: 경로·비용 미리보기</li>
        <li>목적지 클릭: 경로 고정 → 한 번 더 클릭: 이동</li>
        <li>같은 헥스 다시 클릭: 겹친 다른 부대 선택</li>
        <li>오른쪽 클릭 또는 Esc: 취소 · Ctrl+Z: 되돌리기</li>
        <li>드래그: 지도 이동 · 휠: 확대·축소</li>
      </ul>
      <p class="muted small">${esc(MOVE_UI_KO.sandbox)}</p>
    </section>`;
}

export function renderPanel(
  el: HTMLElement, ctx: PanelContext, x: number, y: number, orders: OrdersView | null, message: PanelMessage | null,
) {
  el.innerHTML = messageCard(message) + (orders ? ordersCards(ctx, orders) : '') + hexCard(ctx, x, y, orders?.leader ?? null);
}

// ---------- movement orders ----------

function ordersCards(ctx: PanelContext, o: OrdersView): string {
  const g = ctx.game;
  const lead = unit(g, o.leader);
  const members = forceUnits(g, o.leader);
  const a = allowance(g, o.leader);
  const r = o.reach;
  const avgReady = Math.trunc(members.reduce((s, u) => s + u.readiness, 0) / members.length);
  const railOk = canEntrain(g, o.leader);
  const pct = a.rate ? Math.round((a.remaining / a.rate) * 100) : 0;
  const reachable = [...r.nodes.values()].filter((n) => n.hex !== r.origin && n.canStop).length;
  const status = [
    a.moved ? `<span class="tag">${MOVE_UI_KO.moved}</span>` : `<span class="tag">${MOVE_UI_KO.notMoved}</span>`,
    a.assault ? `<span class="tag warn">${esc(MOVE_UI_KO.assaultPlotted)}</span>` : '',
  ].join(' ');
  let body: string;
  if (r.cannot) {
    body = `<p class="note warn">${esc(BLOCK_KO[r.cannot] ?? r.cannot)}</p>`;
    if (canBugOut(g, o.leader)) body += `<button class="btn danger" data-action="bugout">${esc(MOVE_UI_KO.bugOut)}</button>`;
  } else {
    body = `<p class="muted small">${esc(MOVE_UI_KO.hint)} ${ctx.forcesAt(r.origin % g.width, Math.floor(r.origin / g.width)).length > 1 ? esc(MOVE_UI_KO.cycleHint) : ''}</p>
      <p class="muted small">${esc(o.mode === 'rail' ? MOVE_UI_KO.railStops : MOVE_UI_KO.reachable)} ${reachable}개${!a.moved && o.mode === 'tactical' ? ` · ${esc(MOVE_UI_KO.minMoveNote)}` : ''}</p>`;
  }
  const card = `
    <section class="card orders">
      <p class="eyebrow">${esc(MOVE_UI_KO.orders)} · ${esc(MOVE_MODE_KO[o.mode])}</p>
      <header class="orders-head"><span class="chip" style="background:${NATION_COLOR[lead.nation]}"></span>
        <div><h2>${esc(forceTitle(g, o.leader))}</h2><span class="muted">${esc(NATION_KO[lead.nation])} · ${esc(SIDE_KO[sideOf(lead)])} · 유닛 ${members.length}개</span></div></header>
      <div class="mp">
        <div class="mp-num"><b>${a.remaining}</b><span>/ ${a.rate} ${esc(MOVE_UI_KO.points)}</span></div>
        <div class="mp-label">${esc(MOVE_UI_KO.remaining)}<span class="muted"> · ${esc(MOVE_UI_KO.readiness)} ${avgReady}%</span></div>
        <div class="bar mp-bar"><i style="width:${pct}%"></i></div>
      </div>
      <p class="tags">${status}</p>
      <div class="seg" role="group">
        <button type="button" data-action="mode" data-mode="tactical" aria-pressed="${o.mode === 'tactical'}">${esc(MOVE_MODE_KO.tactical)}</button>
        <button type="button" data-action="mode" data-mode="rail" aria-pressed="${o.mode === 'rail'}" ${railOk || o.mode === 'rail' ? '' : `disabled title="${esc(BLOCK_KO.cannotEntrain)}"`}>${esc(MOVE_MODE_KO.rail)}</button>
      </div>
      ${body}
      ${g.undo ? `<button class="btn ghost" data-action="undo">↶ ${esc(MOVE_UI_KO.undo)} <span class="muted small">Ctrl+Z</span></button>` : ''}
    </section>`;
  return card + previewCard(ctx, o);
}

function previewCard(ctx: PanelContext, o: OrdersView): string {
  if (!o.path || !o.path.length) return '';
  const g = ctx.game;
  const r = o.reach;
  const end = r.nodes.get(o.path[o.path.length - 1]);
  if (!end) return '';
  const rail = o.mode === 'rail';
  const spent = rail ? 0 : end.used - r.usedStart;
  const captures = o.path.some((i) => r.nodes.get(i)?.step.captures);
  const warn: string[] = [];
  if (rail) warn.push(MOVE_UI_KO.railWarn);
  else if (captures) warn.push(MOVE_UI_KO.capturesWarn);
  const rows = o.path.map((i, k) => {
    const n = r.nodes.get(i)!;
    const items = n.step.items.filter((it) => it.points !== 0 || it.kind === 'terrain' || it.kind === 'rail' || it.kind === 'amphibious')
      .map((it) => `${esc(costItemKo(it))} ${it.points > 0 && it.kind !== 'terrain' ? '+' : ''}${it.points}`).join(' · ');
    return `<li><span class="step-n">${k + 1}</span><div><b>${esc(placeName(ctx, i))}</b><div class="muted small">${items}</div></div><span class="pts">${rail ? 0 : n.step.cost}</span></li>`;
  }).join('');
  const dest = o.path[o.path.length - 1];
  return `
    <section class="card preview ${o.pinned ? 'pinned' : ''}">
      <p class="eyebrow">${esc(MOVE_UI_KO.preview)}</p>
      <h3>${esc(placeName(ctx, dest))}</h3>
      <div class="stats compact">
        <div><span class="label">${esc(MOVE_UI_KO.steps)}</span><span class="value small">${o.path.length}</span></div>
        <div><span class="label">${esc(MOVE_UI_KO.cost)}</span><span class="value small">${rail ? '-' : spent}</span></div>
        <div><span class="label">${esc(MOVE_UI_KO.after)}</span><span class="value small">${rail ? 0 : r.rate - end.used}</span></div>
        <div><span class="label">${esc(MOVE_UI_KO.readinessLoss)}</span><span class="value small">${rail ? 0 : `−${spent}`}</span></div>
      </div>
      ${warn.map((w) => `<p class="note warn">${esc(w)}</p>`).join('')}
      <details ${o.pinned && !rail ? 'open' : ''}><summary class="muted small">${esc(MOVE_UI_KO.breakdown)}</summary><ol class="steps">${rows}</ol></details>
      ${o.pinned ? `<div class="actions"><button class="btn primary" data-action="confirm">${esc(MOVE_UI_KO.confirm)} <span class="kbd">Enter</span></button><button class="btn ghost" data-action="cancel">${esc(MOVE_UI_KO.cancel)}</button></div>` : ''}
    </section>`;
}

// ---------- hex report ----------

function hexCard(ctx: PanelContext, x: number, y: number, activeLeader: number | null): string {
  const { map, game: g } = ctx;
  const s = ctx.scenario;
  const hex = g.hexes[y * map.width + x];
  const is1995 = g.scenarioNo === 4;
  const city = map.cities.find((c) => c.x === x && c.y === y && (!c.only1995 || is1995));
  const port = map.ports.find((p) => p.x === x && p.y === y);
  const portState = port ? s.ports.find((p) => p.id === port.id) : undefined;
  const airfield = map.airfields.find((a) => a.x === x && a.y === y);
  const afState = airfield ? g.airfields.find((a) => a.id === airfield.id) : undefined;
  const supply = !is1995 && map.supplyPoints.some((p) => p.x === x && p.y === y);
  const owner = g.possession[y * map.width + x];
  const features: string[] = [];
  if (hex.river) features.push(`강 (${dirsKo(hex.river)})`);
  if (hex.road) features.push(`도로 (${dirsKo(hex.road)})`);
  if (hex.rail) features.push(`철도 (${dirsKo(hex.rail)})`);
  const forces = ctx.forcesAt(x, y);
  const unitCount = forces.reduce((a, f) => a + f.units.length, 0);

  return `
    <section class="card">
      <p class="eyebrow">헥스 ${x}, ${y}</p>
      <h2>${esc(city?.ko ?? TERRAIN_KO[hex.terrain])}</h2>
      <dl class="facts">
        <dt>지형</dt><dd>${esc(TERRAIN_KO[hex.terrain])}${hex.closed ? ' <span class="tag">험한 지형</span>' : ''}</dd>
        <dt>지형 요소</dt><dd>${features.length ? esc(features.join(', ')) : '없음'}</dd>
        <dt>점령</dt><dd>${owner ? `<span class="${owner === 1 ? 'un' : 'red'}">${POSSESSION_KO[owner]}</span>` : '-'}</dd>
        ${port ? `<dt>항구</dt><dd>${esc(port.ko)}${portState?.mined ? ' <span class="tag warn">기뢰 부설</span>' : ''}</dd>` : ''}
        ${airfield ? `<dt>비행장</dt><dd>${esc(airfield.ko)}${airfield.code ? ` (${airfield.code})` : ''} · 등급 ${afState?.current ?? 0}/${afState?.best ?? airfield.best}</dd>` : ''}
        ${supply ? '<dt>보급</dt><dd>공산군 보급 거점</dd>' : ''}
        <dt>원본 코드</dt><dd class="muted">0x${hex.code.toString(16).padStart(2, '0')} · ${esc(hex.label)}</dd>
      </dl>
    </section>
    ${forces.length ? `<section class="card"><h3>부대 <span class="muted">${forces.length}개 편성 · ${unitCount}개 유닛</span></h3>
      ${forces.map((f) => forceCard(g, f, f.leader === activeLeader)).join('')}</section>` : ''}`;
}

function forceCard(g: GameState, f: Force, active: boolean): string {
  const members = forceUnits(g, f.leader);
  const lead = members[0];
  if (!lead) return '';
  const a = allowance(g, f.leader);
  return `
    <article class="force ${active ? 'active' : ''}">
      <header><span class="chip" style="background:${NATION_COLOR[lead.nation]}"></span>
        <div><b>${esc(forceTitle(g, f.leader))}</b><span class="muted">${esc(NATION_KO[lead.nation])} · ${esc(SIDE_KO[SIDE_OF[lead.nation]])} · 이동력 ${a.remaining}/${a.rate}</span></div>
        ${active ? `<span class="tag on">${esc(MOVE_UI_KO.selected)}</span>` : `<button class="btn small" data-action="select-force" data-leader="${f.leader}">${esc(MOVE_UI_KO.select)}</button>`}
      </header>
      <ul class="units">${members.map((u) => unitRow(u, g.equipmentTypes)).join('')}</ul>
    </article>`;
}

function unitRow(u: UnitState, types: Map<number, EquipmentType>): string {
  const st = displayStrength(effectiveStrength(u, types));
  const ready = Math.max(0, Math.min(100, u.readiness));
  return `
    <li><details>
      <summary>
        <div class="unit-title"><b>${esc(unitNameKo(u.name))}</b><span class="muted en">${esc(u.name)}</span></div>
        <div class="unit-meta">
          <span class="tag">${esc(KIND_KO[u.kind] ?? u.kind)}</span>
          <span class="tag">${esc(EXPERIENCE_KO[u.experience] ?? '?')}</span>
          <span class="strength" title="살상력-생존력 (원작 표기, 1/10)">${st.lethality}-${st.survivability}</span>
        </div>
        <div class="bar" title="준비도 ${ready}%"><i style="width:${ready}%"></i></div>
      </summary>
      <table class="equip">
        <thead><tr><th>장비</th><th>보유</th><th>정원</th><th>살상/생존</th></tr></thead>
        <tbody>${u.equipment.map((e) => {
          const t = types.get(e.type);
          return `<tr><td>${esc(EQUIPMENT_KO[t?.name ?? ''] ?? t?.name ?? `#${e.type}`)}</td><td>${e.assigned}</td><td>${e.authorized}</td><td class="muted">${t ? `${t.lethality}/${t.survivability}` : '-'}</td></tr>`;
        }).join('')}</tbody>
      </table>
      <p class="muted small">준비도 ${ready}% · 원본 SYMBOL ${u.symbol} · 상태값 0x${u.status.toString(16)} · MOVE ${u.move}</p>
    </details></li>`;
}
