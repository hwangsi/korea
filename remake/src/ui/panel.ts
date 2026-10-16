// Right-hand information panel (Korean UI).

import type { EquipmentType, Force, Hex, MapData, Scenario, Unit } from '../data/types.ts';
import { effectiveStrength, displayStrength } from '../engine/strength.ts';
import {
  TERRAIN_KO, NATION_KO, KIND_KO, EXPERIENCE_KO, EQUIPMENT_KO, POSSESSION_KO, SIDE_OF, SIDE_KO,
  TEMPERATURE_KO, SKY_KO, unitNameKo, forceNameKo, newsKo, dateKo,
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
  forcesAt: (x: number, y: number) => Force[];
}

export function renderSummary(el: HTMLElement, ctx: PanelContext) {
  const s = ctx.scenario;
  const onMap = s.units.filter((u) => u.onMap);
  const side = (k: 'un' | 'communist') => onMap.filter((u) => SIDE_OF[u.nation] === k).length;
  const waiting = s.units.filter((u) => !u.onMap).length;
  const news = s.news.map(newsKo);
  el.innerHTML = `
    <section class="card">
      <p class="eyebrow">시나리오 ${s.scenario}${s.variant === 'S' ? ' · 편성 배치' : ''}</p>
      <h2>${esc(s.title.ko)}</h2>
      <p class="muted">${esc(s.title.en)} · ${dateKo(s.date.year, s.date.month, s.date.day)} · ${s.turn}턴</p>
      <div class="stats">
        <div><span class="label">유엔군 부대</span><span class="value un">${side('un')}</span></div>
        <div><span class="label">공산군 부대</span><span class="value red">${side('communist')}</span></div>
        <div><span class="label">증원 대기</span><span class="value">${waiting}</span></div>
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
        <li>왼쪽 버튼 드래그: 지도 이동</li>
        <li>휠 또는 +/− 버튼: 확대·축소</li>
        <li>헥스 클릭: 지형과 부대 정보</li>
        <li>오른쪽 클릭: 선택 해제</li>
      </ul>
    </section>`;
}

export function renderHex(el: HTMLElement, ctx: PanelContext, x: number, y: number) {
  const { map, scenario: s } = ctx;
  const hex = ctx.hexes[y * map.width + x];
  const is1995 = s.scenario === 4;
  const city = map.cities.find((c) => c.x === x && c.y === y && (!c.only1995 || is1995));
  const port = map.ports.find((p) => p.x === x && p.y === y);
  const portState = port ? s.ports.find((p) => p.id === port.id) : undefined;
  const airfield = map.airfields.find((a) => a.x === x && a.y === y);
  const afState = airfield ? s.airfields.find((a) => a.id === airfield.id) : undefined;
  const supply = !is1995 && map.supplyPoints.some((p) => p.x === x && p.y === y);
  const owner = s.possession[y * map.width + x];
  const features: string[] = [];
  if (hex.river) features.push(`강 (${dirsKo(hex.river)})`);
  if (hex.road) features.push(`도로 (${dirsKo(hex.road)})`);
  if (hex.rail) features.push(`철도 (${dirsKo(hex.rail)})`);
  const types = new Map(s.equipmentTypes.map((e) => [e.id, e]));
  const units = new Map(s.units.map((u) => [u.id, u]));
  const forces = ctx.forcesAt(x, y);
  const unitCount = forces.reduce((a, f) => a + f.units.length, 0);

  el.innerHTML = `
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
      ${forces.map((f) => forceCard(f, units, types)).join('')}</section>` : ''}`;
}

function forceCard(f: Force, units: Map<number, Unit>, types: Map<number, EquipmentType>): string {
  const members = f.units.map((id) => units.get(id)).filter((u): u is Unit => !!u);
  const lead = members[0];
  if (!lead) return '';
  const name = f.name && members.length > 1 ? forceNameKo(f.name) : unitNameKo(lead.name);
  return `
    <article class="force">
      <header><span class="chip" style="background:${NATION_COLOR[lead.nation]}"></span>
        <div><b>${esc(name)}</b><span class="muted">${esc(NATION_KO[lead.nation])} · ${esc(SIDE_KO[SIDE_OF[lead.nation]])}</span></div></header>
      <ul class="units">${members.map((u) => unitRow(u, types)).join('')}</ul>
    </article>`;
}

function unitRow(u: Unit, types: Map<number, EquipmentType>): string {
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
      <p class="muted small">준비도 ${ready}% · 원본 SYMBOL ${u.symbol} · 상태값 0x${u.status.toString(16)}</p>
    </details></li>`;
}
