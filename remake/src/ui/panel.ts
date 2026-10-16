// Right-hand information panel (Korean UI): scenario summary, hex report, movement orders.
// Buttons carry data-action attributes; main.ts handles them with one delegated listener.

import type { EquipmentType, Force, Hex, MapData, Scenario } from '../data/types.ts';
import { effectiveStrength, displayStrength } from '../engine/strength.ts';
import type { GameState, UnitState } from '../engine/state.ts';
import { forceUnits, sideOf, unit, activeSide } from '../engine/state.ts';
import { allowance, canEntrain, canBugOut } from '../engine/movement.ts';
import type { MoveMode, Reach } from '../engine/movement.ts';
import { assaultTarget } from '../engine/combat.ts';
import type { AssaultPreview, CombatReport } from '../engine/combat.ts';
import type { ResolutionReport } from '../engine/turn.ts';
import {
  airUnitsOf, airProjections, displayedStrengths, expectedAirChanges, canPlanAir, pendingAirstrike, groundAttackStrength,
  strikeLethality, strikeTargetError,
} from '../engine/air.ts';
import type { AirReport, AirStrikeResult } from '../engine/air.ts';
import type { AirUnitState, Player } from '../engine/state.ts';
import { territoryBalance, BIG_CITIES } from '../engine/endturn.ts';
import type { GameResult } from '../engine/endturn.ts';
import { gameDate } from '../engine/weather.ts';
import {
  TERRAIN_KO, NATION_KO, KIND_KO, EXPERIENCE_KO, EQUIPMENT_KO, POSSESSION_KO, SIDE_OF, SIDE_KO,
  TEMPERATURE_KO, SKY_KO, unitNameKo, forceNameKo, newsKo, dateKo, MOVE_MODE_KO, MOVE_UI_KO, BLOCK_KO, costItemKo,
  COMBAT_UI_KO, ARMY_NAME_KO, combatEventKo, TURN_UI_KO, PHASE_KO, PLAYER_KO, victoryKo, END_REASON_KO, PLACE_KO, NATURE_KO,
  AIR_UI_KO, MISSION_KO, MISSION_HINT_KO, BASE_KO, AIR_WEATHER_KO, STRIKE_SEVERITY_KO, AIRCRAFT_KO, airUnitNameKo,
} from '../i18n/ko.ts';
import { NATION_COLOR } from './mapView.ts';
import { placeAt, hexToLatLon, featureAt } from '../data/places.ts';
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
  /** Supply net of the current possession (SUPPLY.DETERMINE_SUPPLY), computed on demand. */
  supplyNet: () => Uint8Array;
}

/** What the panel shows when no hex is selected after the turn moved on. */
export interface TurnView {
  combat: CombatReport[] | null;
  /** DO_AIR_COMBAT of the combat phase that just ran. */
  air: AirReport | null;
  resolution: ResolutionReport | null;
  result: GameResult | null;
}

const weatherKo = (w: number) => {
  const t = TEMPERATURE_KO[Math.trunc(w / 10)], s = SKY_KO[((w % 10) + 10) % 10];
  return t && s ? `${t} · ${s}` : '-';
};

function dateOfTurn(g: GameState, turn: number): string {
  const d = gameDate(g, turn);
  return dateKo(d.year, d.month, d.day);
}

function newsItems(ctx: PanelContext): { date: string; text: string }[] {
  const g = ctx.game;
  const own = g.news.map((n) => ({ date: dateOfTurn(g, n.turn), text: newsKo(n.text).text }));
  return [...own.reverse(), ...ctx.scenario.news.map(newsKo).reverse()];
}

export interface OrdersView {
  leader: number;
  mode: MoveMode;
  reach: Reach;
  /** Previewed path (hex indices, origin excluded). */
  path: number[] | null;
  pinned: boolean;
  /** Adjacent enemy hex under the mouse or pinned, with what an assault would do. */
  assault: { hex: number; pinned: boolean; preview: AssaultPreview } | null;
}

export interface PanelMessage { kind: 'ok' | 'warn' | 'error'; text: string; }

function forceTitle(g: GameState, leader: number): string {
  const members = forceUnits(g, leader);
  const lead = members[0];
  const name = lead.forceName.replace(/\+$/, '').trim();
  return members.length > 1 && name ? forceNameKo(name) : unitNameKo(lead.name);
}

function placeName(ctx: PanelContext, i: number): string {
  const { game } = ctx;
  const x = i % game.width, y = Math.floor(i / game.width);
  const place = placeAt(x, y, game.scenarioNo === 4);
  return `${place?.label ?? TERRAIN_KO[game.hexes[i].terrain]} (${x}, ${y})`;
}

const latLonKo = (x: number, y: number) => {
  const { lat, lon } = hexToLatLon(x, y);
  return `북위 ${lat.toFixed(2)}° · 동경 ${lon.toFixed(2)}°`;
};

function messageCard(m: PanelMessage | null): string {
  if (!m) return '';
  return `<section class="card toast ${m.kind}" role="status">${esc(m.text)}</section>`;
}

export function renderSummary(el: HTMLElement, ctx: PanelContext, message: PanelMessage | null = null) {
  const s = ctx.scenario;
  const g = ctx.game;
  const onMap = g.stacks.flat().flatMap((l) => forceUnits(g, l));
  const side = (k: 'un' | 'communist') => onMap.filter((u) => SIDE_OF[u.nation] === k).length;
  const waiting = [...g.units.values()].filter((u) => u.x < -1).length;
  const news = newsItems(ctx).slice(0, 12);
  const lvl = territoryBalance(g);
  el.innerHTML = `
    ${messageCard(message)}
    <section class="card">
      <p class="eyebrow">시나리오 ${s.scenario}${s.variant === 'S' ? ' · 편성 배치' : ''}</p>
      <h2>${esc(s.title.ko)}</h2>
      <p class="muted">${esc(s.title.en)} · ${dateOfTurn(g, g.turn)} · ${g.turn}턴</p>
      <p class="phase-line"><span class="chip ${g.player === 2 ? 'un-bg' : 'red-bg'}"></span><b>${esc(PHASE_KO[g.phase] ?? '')}</b> · ${esc(PLAYER_KO[g.player])}${g.gameOver ? ` · <span class="tag warn">${esc(TURN_UI_KO.gameOver)}</span>` : ''}</p>
      <div class="stats">
        <div><span class="label">유엔군 유닛</span><span class="value un">${side('un')}</span></div>
        <div><span class="label">공산군 유닛</span><span class="value red">${side('communist')}</span></div>
        <div><span class="label">증원 대기</span><span class="value">${waiting}</span></div>
      </div>
      <div class="stats">
        <div><span class="label">${esc(TURN_UI_KO.weather)}</span><span class="value small">${esc(weatherKo(g.weather[0][0]))}${g.freezeLine > 0 ? ` · ${esc(TURN_UI_KO.freezeLine)} ${g.freezeLine}행` : ''}</span></div>
        <div><span class="label">${esc(TURN_UI_KO.stockpile)} (유엔/공산)</span><span class="value small">${g.stockpile[1]} / ${g.stockpile[0]}</span></div>
        <div><span class="label">${esc(TURN_UI_KO.victory)}</span><span class="value small ${lvl > 0 ? 'un' : lvl < 0 ? 'red' : ''}">${g.victoryVoid ? '-' : esc(victoryKo(lvl))}</span></div>
      </div>
      ${forecastLine(g)}
      <div class="stats compact three">
        <div><span class="label">${esc(AIR_UI_KO.unil)}</span><span class="value small">${g.interdiction[1]}</span></div>
        ${g.scenarioNo < 4
          ? `<div><span class="label">${esc(AIR_UI_KO.cilShort)}</span><span class="value small">${g.redAir}</span></div>`
          : `<div><span class="label">${esc(AIR_UI_KO.communistIl)}</span><span class="value small">${g.interdiction[0]}</span></div>`}
      </div>
      ${g.refugees ? `<p class="note warn">${esc(TURN_UI_KO.refugees)}</p>` : ''}
    </section>
    ${news.length ? `<section class="card"><h3>최근 소식</h3><ul class="news">${news.map((n) => `<li><span class="muted">${esc(n.date)}</span>${esc(n.text)}</li>`).join('')}</ul></section>` : ''}
    <section class="card help">
      <h3>조작</h3>
      <ul>
        <li>자기 진영 부대가 있는 헥스 클릭: 부대 선택, 갈 수 있는 범위 표시</li>
        <li>범위 안 헥스에 마우스: 경로·비용 미리보기</li>
        <li>목적지 클릭: 경로 고정 → 한 번 더 클릭: 이동</li>
        <li>같은 헥스 다시 클릭: 겹친 다른 부대 선택</li>
        <li>옆의 적 부대 클릭: 공격 미리보기 → 한 번 더: 공격 명령(또는 돌파)</li>
        <li>상단 ${esc(AIR_UI_KO.button)}: 항공대 임무(1차 명령 단계) → 전투 단계에서 지도의 적 헥스를 클릭해 공습</li>
        <li>상단 ▶ ${esc(TURN_UI_KO.endPhase)}: 다음 진영·단계로 (1차 명령 → 전투 → 2차 명령 → 정리)</li>
        <li>오른쪽 클릭 또는 Esc: 취소 · Ctrl+Z: 되돌리기</li>
        <li>드래그 또는 방향키: 지도 이동 (Shift+방향키: 빠르게) · 휠: 확대·축소</li>
      </ul>
      <p class="muted small">두 사람이 번갈아 하는 방식입니다 (컴퓨터 AI는 아직 없음). 안개·정찰은 아직 "완전 정보"로 표시합니다.</p>
    </section>`;
}

/** Weather forecast of the active player (WEATHER rows 1 and 2), as the original Weather Report. */
function forecastLine(g: GameState): string {
  const row = g.weather[g.player === 1 ? 1 : 2];
  if (!row) return '';
  const items = [1, 2, 3].map((k) => `<span><b>${k}주 뒤</b> ${esc(weatherKo(row[k]))}</span>`).join('');
  return `<p class="forecast muted small">${esc(TURN_UI_KO.forecast)} (${esc(PLAYER_KO[g.player])}) ${items}</p>`;
}

/** Combat results and/or the General Resolution report of the turn that just ended. */
export function renderTurnView(el: HTMLElement, ctx: PanelContext, view: TurnView, message: PanelMessage | null) {
  const parts: string[] = [messageCard(message)];
  if (view.result) parts.push(resultCard(ctx, view.result));
  if (view.resolution) parts.push(resolutionCard(ctx, view.resolution));
  if (view.air) parts.push(airReportCard(ctx, view.air));
  if (view.combat) parts.push(combatCard(ctx, view.combat));
  el.innerHTML = parts.join('');
}

// ---------- air operations (docs/rules/air.md) ----------

function aircraftNames(ctx: PanelContext, a: AirUnitState): string {
  return [a.aircraft1, a.aircraft2].filter((id) => id > 0).map((id) => {
    const n = ctx.scenario.aircraftTypes.find((t) => t.id === id)?.name ?? `#${id}`;
    return AIRCRAFT_KO[n] ?? n;
  }).join(', ');
}

const strengthKo = (eff: number, raw: number) => eff === 0 && raw > 0 ? `<b>0</b> <span class="muted small">(${esc(AIR_UI_KO.zero)})</span>` : `<b>${eff}</b>`;

function airUnitRow(ctx: PanelContext, a: AirUnitState, editable: boolean): string {
  const s = displayedStrengths(ctx.game, a);
  const tags = [
    `<span class="tag">${esc(BASE_KO[a.base] ?? '?')}</span>`,
    a.longRange ? `<span class="tag">${esc(AIR_UI_KO.longRange)}</span>` : '',
    a.allWeather ? `<span class="tag">${esc(AIR_UI_KO.allWeather)}</span>` : '',
    `<span class="tag">${esc(a.poorRunways ? AIR_UI_KO.runwayAny : AIR_UI_KO.runwayImproved)}</span>`,
  ].join(' ');
  const seg = [0, 1, 2].map((m) => `<button type="button" data-action="mission" data-unit="${a.id}" data-mission="${m}" aria-pressed="${a.mission === m}" title="${esc(MISSION_HINT_KO[m])}" ${editable ? '' : 'disabled'}>${esc(MISSION_KO[m])}</button>`).join('');
  return `
    <li class="air-unit m${a.mission}">
      <div class="air-head"><b>${esc(airUnitNameKo(a.name))}</b><span class="air-str">${esc(AIR_UI_KO.a2a)} ${strengthKo(s.airToAir, a.airToAir)} · ${esc(AIR_UI_KO.a2g)} ${strengthKo(s.airToGround, a.airToGround)}</span></div>
      <div class="muted small">${esc(a.name)} · ${esc(aircraftNames(ctx, a))}</div>
      <p class="tags">${tags}</p>
      <div class="seg three" role="group">${seg}</div>
    </li>`;
}

function airLockReason(g: GameState, p: Player): string {
  if (p === 1 && g.scenarioNo < 4) return AIR_UI_KO.communist1950s;
  if (g.utility[p + 11]) return AIR_UI_KO.neutralized;
  if (!g.airPlayerControl || g.computerSide === p) return AIR_UI_KO.programControl;
  if (g.phase !== 1) return AIR_UI_KO.onlyFirstPhase;
  return '';
}

/** AIR_OPERATIONS: the side's air units with their missions, the Projections and expected changes. */
export function renderAirOps(el: HTMLElement, ctx: PanelContext, message: PanelMessage | null) {
  const g = ctx.game;
  const p = g.player;
  const editable = canPlanAir(g, p);
  const units = airUnitsOf(g, p);
  const lock = editable ? '' : airLockReason(g, p);
  const proj = airProjections(g, p);
  const stats = [
    [AIR_UI_KO.strikesAvailable, `${proj.strikes}회`],
    [AIR_UI_KO.interdictionLevel, String(proj.interdiction)],
    ...(proj.cilNow !== null ? [[AIR_UI_KO.cilNow, String(proj.cilNow)], [AIR_UI_KO.cilNext, String(proj.cilNext)]] : []),
    ...(proj.superiority !== null ? [[AIR_UI_KO.superiority, String(proj.superiority)]] : []),
  ].map(([l, v]) => `<div><span class="label">${esc(l)}</span><span class="value small">${esc(v)}</span></div>`).join('');
  let changes = '';
  if (g.scenarioNo < 4 && p === 2) {
    const { withdrawals, reinforcements } = expectedAirChanges(g);
    const li = (a: AirUnitState, turn: number) => `<li><span class="muted">${esc(dateOfTurn(g, turn))}</span>${esc(airUnitNameKo(a.name))}</li>`;
    changes = withdrawals.length || reinforcements.length
      ? `${withdrawals.length ? `<h3>${esc(AIR_UI_KO.withdrawals)}</h3><ul class="news">${withdrawals.map((a) => li(a, a.exitTurn)).join('')}</ul>` : ''}
         ${reinforcements.length ? `<h3>${esc(AIR_UI_KO.reinforcements)}</h3><ul class="news">${reinforcements.slice(0, 10).map((a) => li(a, a.entryTurn)).join('')}</ul>` : ''}`
      : `<p class="muted small">${esc(AIR_UI_KO.noChanges)}</p>`;
  }
  el.innerHTML = `
    ${messageCard(message)}
    <section class="card air-ops">
      <p class="eyebrow">${esc(PLAYER_KO[p])} · ${esc(PHASE_KO[g.phase] ?? '')} · ${esc(AIR_WEATHER_KO[g.sky] ?? '-')}</p>
      <header class="orders-head"><h2>${esc(AIR_UI_KO.title)}</h2><button class="btn small" data-action="air-close">${esc(AIR_UI_KO.close)}</button></header>
      ${lock ? `<p class="note warn">${esc(lock)}</p>` : `<p class="muted small">${esc(AIR_UI_KO.hint)}</p>`}
      <ul class="air-units">${units.map((a) => airUnitRow(ctx, a, editable)).join('')}</ul>
    </section>
    <section class="card">
      <h3>${esc(AIR_UI_KO.projections)}</h3>
      <div class="stats compact two">${stats}</div>
      <p class="muted small">${esc(g.scenarioNo < 4 ? AIR_UI_KO.migAlleyNote : AIR_UI_KO.migAlley1995)}</p>
    </section>
    ${changes ? `<section class="card">${changes}</section>` : ''}`;
}

function strikeTargetName(ctx: PanelContext, r: AirStrikeResult): string {
  return placeName(ctx, r.target[1] * ctx.game.width + r.target[0]);
}

function strikeResultHtml(ctx: PanelContext, r: AirStrikeResult): string {
  const g = ctx.game;
  const a = g.airUnits.find((x) => x.id === r.airUnit);
  const forces = r.found
    ? r.forces.map((f) => `<li>${esc(f.named ? forceTitle(g, f.leader) : AIR_UI_KO.enemyUnit)}: <b>${esc(STRIKE_SEVERITY_KO[f.severity])}</b> · ${esc(AIR_UI_KO.strikeLethality)} ${f.lethality}% · ${esc(AIR_UI_KO.equipmentLost(f.equipmentLost))}${f.readinessLost ? ` · ${esc(AIR_UI_KO.readinessLost(f.readinessLost))}` : ''}</li>`).join('')
    : `<li class="muted">${esc(AIR_UI_KO.noTarget)}</li>`;
  const aa = r.aaHit ? `<li class="warn">${esc(AIR_UI_KO.aaHit)}${r.airUnitDestroyed ? ` · ${esc(AIR_UI_KO.aaDestroyed)}` : ''}</li>` : '';
  return `<article class="report strike ${r.found ? 'win' : 'hold'}">
    <header><b>${esc(a ? airUnitNameKo(a.name) : `#${r.airUnit}`)} → ${esc(strikeTargetName(ctx, r))}</b>${r.auto ? `<span class="tag">${esc(AIR_UI_KO.autoTag)}</span>` : ''}</header>
    <ul class="events">${forces}${aa}</ul></article>`;
}

/** Combat phase: the human player picks the target of each airstrike on the map. */
export function renderAirstrikes(el: HTMLElement, ctx: PanelContext, hover: [number, number] | null, message: PanelMessage | null) {
  const g = ctx.game;
  const air = g.air;
  if (!air) { el.innerHTML = messageCard(message); return; }
  const next = pendingAirstrike(g);
  const p = air.players[Math.min(air.index, air.players.length - 1)];
  const side = air.report.sides.find((s) => s.player === p);
  let head: string;
  if (next) {
    const a = next.unit;
    const k = next.planned - next.left + 1;
    const hoverPct = hover ? strikeLethalityAt(g, a, hover) : null;
    head = `
      <section class="card orders strike-card">
        <p class="eyebrow">${esc(PHASE_KO[2])} · ${esc(AIR_UI_KO.strikeTitle(PLAYER_KO[next.player]))}</p>
        <header class="orders-head"><div><h2>${esc(AIR_UI_KO.strikeN(k, next.planned))}</h2><span class="muted">${esc(airUnitNameKo(a.name))} · ${esc(aircraftNames(ctx, a))} · ${esc(BASE_KO[a.base] ?? '')}</span></div></header>
        <div class="mp">
          <div class="mp-num"><b>${hoverPct ?? groundAttackStrength(g, a, 0, 99)}</b><span>%</span></div>
          <div class="mp-label">${esc(AIR_UI_KO.strikeLethality)}${hover ? ` <span class="muted">· ${esc(placeName(ctx, hover[1] * g.width + hover[0]))}</span>` : ''}</div>
        </div>
        <p class="muted small">${esc(AIR_UI_KO.strikeHint)}</p>
        <p class="muted small">${esc(AIR_UI_KO.strikeLethalityNote)}</p>
        <div class="actions"><button class="btn" data-action="strike-auto">${esc(AIR_UI_KO.auto)}</button><button class="btn ghost" data-action="strike-auto-all">${esc(AIR_UI_KO.autoAll)}</button></div>
      </section>`;
  } else {
    head = `<section class="card"><p class="eyebrow">${esc(PHASE_KO[2])}</p><h2>${esc(AIR_UI_KO.allFlown)}</h2>
      <div class="actions"><button class="btn primary" data-action="strike-continue">${esc(AIR_UI_KO.continue)}</button></div></section>`;
  }
  const done = side ? side.strikes.slice().reverse().map((r) => strikeResultHtml(ctx, r)).join('') : '';
  el.innerHTML = messageCard(message) + head + (done ? `<section class="card"><h3>${esc(AIR_UI_KO.strikesSoFar)}</h3>${done}</section>` : '') + airReportCard(ctx, air.report, air.index);
}

/** Lethality % of the next strike on a hex (shown while aiming), null if it is not a legal target. */
function strikeLethalityAt(g: GameState, a: AirUnitState, hex: [number, number]): number | null {
  const p = g.air ? g.air.players[Math.min(g.air.index, g.air.players.length - 1)] : g.player;
  if (strikeTargetError(g, p, hex[0], hex[1])) return null;
  return Math.max(1, Math.min(100, strikeLethality(g, a, hex[0], hex[1])));
}

/** DO_AIR_COMBAT results: Communist interception level / 1995 air superiority, interdiction, airstrikes. */
function airReportCard(ctx: PanelContext, r: AirReport, upto: number | null = null): string {
  const inProgress = upto !== null;
  const g = ctx.game;
  const lines: string[] = [];
  if (r.redAir) lines.push(`<li>${esc(AIR_UI_KO.cil(r.redAir[0], r.redAir[1]))}</li>`);
  for (const s of r.superiority) lines.push(`<li>${esc(AIR_UI_KO.superiorityLoss(PLAYER_KO[s.player], s.loss, s.own, s.enemy))}</li>`);
  const sides = r.sides.filter((_, k) => upto === null || k <= upto).map((s) => {
    const enemy = PLAYER_KO[3 - s.player];
    const strikes = inProgress ? '' : s.strikes.map((x) => strikeResultHtml(ctx, x)).join('');
    return `<article class="report">
      <header><b>${esc(PLAYER_KO[s.player])}</b>${s.autoMissions ? `<span class="tag">${esc(AIR_UI_KO.programMissions)}</span>` : ''}</header>
      <p class="small muted">${esc(AIR_UI_KO.missionsLine(s.missions))}</p>
      <p class="small">${esc(AIR_UI_KO.interdictionResult(s.interdiction, s.stockpileHit, enemy))}${s.noTargets ? ` · ${esc(AIR_UI_KO.noTargets)}` : ''}${!inProgress && !s.strikes.length ? ` · ${esc(AIR_UI_KO.noStrikes)}` : ''}</p>
      ${strikes}
    </article>`;
  }).join('');
  return `<section class="card"><p class="eyebrow">${esc(AIR_UI_KO.results)} · ${dateOfTurn(g, r.turn)}</p>
    ${lines.length ? `<ul class="events">${lines.join('')}</ul>` : ''}${sides}</section>`;
}

function resultCard(ctx: PanelContext, r: GameResult): string {
  const g = ctx.game;
  const head = r.winner === 'un' ? '유엔군 승리' : r.winner === 'communist' ? '공산군 승리' : '교착 (무승부)';
  return `<section class="card result"><p class="eyebrow">${esc(TURN_UI_KO.result)}</p><h2>${esc(head)}</h2>
    <p>${esc(TURN_UI_KO.victory)}: <b>${esc(victoryKo(r.level))}</b> · ${dateOfTurn(g, g.turn)}</p>
    <p class="muted small">승리 수준: 1950년 6월 25일(1995년은 개전 시점)보다 더 가진 점령 점수 200점마다 1 (도시 100점, 그 외 헥스 1점)</p></section>`;
}

function resolutionCard(ctx: PanelContext, r: ResolutionReport): string {
  const g = ctx.game;
  const s = r.supply;
  const rows: string[] = [];
  const row = (label: string, value: string) => rows.push(`<div><span class="label">${esc(label)}</span><span class="value small">${value}</span></div>`);
  row(`${TURN_UI_KO.resupplied} (유엔/공산)`, `${s.resupplied.un} / ${s.resupplied.communist}`);
  row(`${TURN_UI_KO.unsupplied} (유엔/공산)`, `${s.unsupplied.un} / ${s.unsupplied.communist}`);
  if (s.airSupplied) row(TURN_UI_KO.airSupplied, String(s.airSupplied));
  row(TURN_UI_KO.interdiction, String(s.unil));
  row(`${TURN_UI_KO.stockpile} (유엔/공산)`, `${r.stockpileBefore[1]}→${r.stockpileAfter[1]} / ${r.stockpileBefore[0]}→${r.stockpileAfter[0]}`);
  row(`${TURN_UI_KO.replaced}`, `${r.reinforcements.replaced}개`);
  const lines: string[] = [];
  const forceList = (ids: number[]) => ids.slice(0, 8).map((id) => esc(forceTitle(g, id))).join(', ') + (ids.length > 8 ? ` 외 ${ids.length - 8}` : '');
  if (r.reinforcements.arrived.length) lines.push(`<li><b>${esc(TURN_UI_KO.reinforcementsArrived)}</b> ${r.reinforcements.arrived.length}개: ${forceList(r.reinforcements.arrived)}</li>`);
  if (r.reinforcements.held.length) lines.push(`<li>${esc(TURN_UI_KO.heldOff)}: ${r.reinforcements.held.length}개</li>`);
  if (r.reinforcements.rebuilt.length) lines.push(`<li>${esc(TURN_UI_KO.rebuilt)}: ${r.reinforcements.rebuilt.map((id) => esc(unitNameKo(unit(g, id).name))).join(', ')}</li>`);
  if (s.attrition.length) lines.push(`<li>${esc(TURN_UI_KO.attrition)}: ${s.attrition.length}개 유닛</li>`);
  const p = r.patrols;
  if (p.patrols.un || p.patrols.communist) lines.push(`<li>${esc(TURN_UI_KO.patrols)}: 유엔 ${p.patrols.un} · 공산 ${p.patrols.communist}</li>`);
  if (p.guerrillas.un || p.guerrillas.communist) lines.push(`<li>${esc(TURN_UI_KO.guerrillas)}: 공산군에 넘어간 헥스 ${p.guerrillas.communist} · 소탕으로 되찾은 헥스 ${p.guerrillas.un}</li>`);
  const cityKo = (x: number, y: number) => {
    const c = BIG_CITIES.find((b) => b.x === x && b.y === y);
    return c ? PLACE_KO[c.name] ?? c.name : `${x},${y}`;
  };
  if (p.reverted.length) lines.push(`<li>${esc(TURN_UI_KO.reverted)}: ${p.reverted.map(([x, y]) => esc(cityKo(x, y))).join(', ')}</li>`);
  const portName = (id: number) => ctx.map.ports.find((q) => q.id === id)?.ko ?? `#${id}`;
  if (r.mines.mined.length) lines.push(`<li>${esc(TURN_UI_KO.mined)}: ${r.mines.mined.map((id) => esc(portName(id))).join(', ')}</li>`);
  if (r.mines.swept.length) lines.push(`<li>${esc(TURN_UI_KO.swept)}: ${r.mines.swept.map((id) => esc(portName(id))).join(', ')}</li>`);
  if (r.refugees) lines.push(`<li class="warn">${esc(TURN_UI_KO.refugees)}</li>`);
  const news = r.news.map((n) => `<li><span class="muted">${dateOfTurn(g, n.turn)}</span>${esc(newsKo(n.text).text)}</li>`).join('');
  return `
    <section class="card">
      <p class="eyebrow">${esc(TURN_UI_KO.turnReport)} · ${dateOfTurn(g, r.turn)} (${r.turn}턴)</p>
      <h2>${esc(TURN_UI_KO.beginPhase(PLAYER_KO[g.player], PHASE_KO[g.phase] ?? ''))}</h2>
      <p class="muted small">${dateOfTurn(g, g.turn)} · ${esc(TURN_UI_KO.weather)} ${esc(weatherKo(g.weather[0][0]))}${g.freezeLine > 0 ? ` · ${esc(TURN_UI_KO.freezeLine)} ${g.freezeLine}행` : ''}</p>
      <div class="stats compact two">${rows.join('')}</div>
      ${lines.length ? `<ul class="events">${lines.join('')}</ul>` : ''}
      ${news ? `<h3>${esc(TURN_UI_KO.news)}</h3><ul class="news">${news}</ul>` : ''}
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
      ${plotLine(ctx, o.leader)}
      ${!r.cannot ? `<p class="muted small">${esc(COMBAT_UI_KO.hint)}</p>` : ''}
      ${g.undo ? `<button class="btn ghost" data-action="undo">↶ ${esc(MOVE_UI_KO.undo)} <span class="muted small">Ctrl+Z</span></button>` : ''}
    </section>`;
  return card + (o.assault ? assaultCard(ctx, o) : previewCard(ctx, o));
}

function plotLine(ctx: PanelContext, leader: number): string {
  const t = assaultTarget(ctx.game, leader);
  if (!t) return '';
  return `<div class="note plot"><b>${esc(COMBAT_UI_KO.plotted)}</b> → ${esc(placeName(ctx, t[1] * ctx.game.width + t[0]))}
    <button class="btn small" data-action="cancel-plot">${esc(COMBAT_UI_KO.cancelPlot)}</button></div>`;
}

function assaultCard(ctx: PanelContext, o: OrdersView): string {
  const a = o.assault!;
  const p = a.preview;
  const g = ctx.game;
  const est = p.estimate;
  const overrun = p.overrun?.possible;
  const rows = (ids: number[]) => ids.map((l) => `<li>${esc(forceTitle(g, l))}</li>`).join('');
  const body = est ? `
      <div class="versus">
        <div><span class="label">${esc(COMBAT_UI_KO.attackerSide)}</span><b>${est.aL}</b><span class="muted"> / ${est.aS}</span><ul>${rows(est.attackers)}</ul></div>
        <div><span class="label">${esc(COMBAT_UI_KO.defenderSide)}</span><b>${est.dL}</b><span class="muted"> / ${est.dS}</span><ul>${rows(est.defenders)}</ul></div>
      </div>
      <p class="muted small">${esc(COMBAT_UI_KO.lethality)} / ${esc(COMBAT_UI_KO.survivability)} (원작 전투 합산 단위: 살상÷5, 생존÷50)${est.artillery.attacker || est.artillery.defender ? ` · ${esc(COMBAT_UI_KO.artillery)} ${est.artillery.attacker}/${est.artillery.defender}` : ''}${est.naval ? ` · ${esc(COMBAT_UI_KO.naval)} ${est.naval}` : ''}</p>
      <div class="stats compact">
        <div><span class="label">${esc(COMBAT_UI_KO.lossRatio)} (${esc(COMBAT_UI_KO.attackerSide)})</span><span class="value small">${est.attackerLoss}%</span></div>
        <div><span class="label">${esc(COMBAT_UI_KO.lossRatio)} (${esc(COMBAT_UI_KO.defenderSide)})</span><span class="value small">${est.defenderLoss}%</span></div>
        <div><span class="label">${esc(COMBAT_UI_KO.retreatChance)}</span><span class="value small">${est.retreatChance}%</span></div>
      </div>
      ${est.attackers.length > 1 ? `<p class="muted small">${esc(COMBAT_UI_KO.joined)}</p>` : ''}` : '';
  const mode = overrun ? COMBAT_UI_KO.overrunChance : p.overrunRollPossible ? COMBAT_UI_KO.overrunNo : '';
  return `
    <section class="card preview assault ${a.pinned ? 'pinned' : ''}">
      <p class="eyebrow">${esc(COMBAT_UI_KO.assaultPreview)}</p>
      <h3>${esc(placeName(ctx, a.hex))}</h3>
      ${body}
      ${mode ? `<p class="note">${esc(mode)}</p>` : ''}
      ${p.allowed ? `<p class="muted small">${esc(COMBAT_UI_KO.plotNote)}</p>` : `<p class="note warn">${esc(BLOCK_KO[p.error ?? ''] ?? p.error ?? '')}</p>`}
      ${a.pinned && p.allowed ? `<div class="actions"><button class="btn primary danger-fill" data-action="confirm-assault">${esc(overrun ? COMBAT_UI_KO.tryOverrun : COMBAT_UI_KO.plot)} <span class="kbd">Enter</span></button><button class="btn ghost" data-action="cancel">${esc(MOVE_UI_KO.cancel)}</button></div>` : ''}
    </section>`;
}

/** Results of the ground combat phase. */
export function renderCombatReports(el: HTMLElement, ctx: PanelContext, reports: CombatReport[], message: PanelMessage | null) {
  el.innerHTML = messageCard(message) + combatCard(ctx, reports);
}

function combatCard(ctx: PanelContext, reports: CombatReport[]): string {
  const g = ctx.game;
  const name = (id: number) => forceTitle(g, id);
  const cards = reports.map((r) => {
    const target = placeName(ctx, r.target[1] * g.width + r.target[0]);
    const events = r.events.filter((e) => e.kind !== 'expGain').map((e) => {
      const leader = 'leader' in e ? e.leader : undefined;
      return `<li>${esc(combatEventKo(e as { kind: string; name?: string; to?: [number, number] }, name, leader))}</li>`;
    }).join('');
    const head = r.moveIn ? COMBAT_UI_KO.moveIn : r.retreated ? COMBAT_UI_KO.retreated : COMBAT_UI_KO.held;
    return `
      <article class="report ${r.moveIn ? '' : r.retreated ? 'win' : 'hold'}">
        <header><b>${esc(ARMY_NAME_KO[r.army] ?? '')} ${esc(COMBAT_UI_KO.attacks)} → ${esc(target)}</b><span class="tag">${esc(head)}</span></header>
        ${r.moveIn ? '' : `<p class="muted small">${esc(r.attackers.map((a) => unitNameKo(a.name)).join(', '))} vs ${esc(r.defenders.map((d) => unitNameKo(d.name)).join(', '))}</p>
        <p class="small">${esc(COMBAT_UI_KO.lossRatio)}: ${esc(COMBAT_UI_KO.attackerSide)} ${r.attackerLoss}% · ${esc(COMBAT_UI_KO.defenderSide)} ${r.defenderLoss}% · ${esc(COMBAT_UI_KO.retreatChance)} ${r.retreatChance}%</p>`}
        ${events ? `<ul class="events">${events}</ul>` : ''}
      </article>`;
  }).join('');
  return `<section class="card"><p class="eyebrow">${esc(COMBAT_UI_KO.results)}</p><h2>${reports.length}건</h2>${cards || `<p class="muted">${esc(COMBAT_UI_KO.noAssaults)}</p>`}</section>`;
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
  const place = placeAt(x, y, is1995);
  const feature = featureAt(x, y);
  const port = map.ports.find((p) => p.x === x && p.y === y);
  const portState = port ? g.ports.find((p) => p.id === port.id) : undefined;
  const net = ctx.supplyNet()[y * map.width + x];
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
      <h2>${esc(place?.label ?? feature?.label ?? TERRAIN_KO[hex.terrain])}</h2>
      <dl class="facts">
        ${feature ? `<dt>${esc(NATURE_KO[feature.kind])}</dt><dd>${esc(feature.ko)}${feature.elevation ? ` · ${esc(NATURE_KO.elevation(feature.elevation))}` : ''}${feature.historic ? ` <span class="muted">(${esc(NATURE_KO.historic(feature.historic))})</span>` : ''}${feature.built ? ` <span class="muted small">· ${esc(NATURE_KO.built(feature.built))}</span>` : ''}${feature.estimated ? ` <span class="tag">${esc(NATURE_KO.estimated)}</span>` : ''}${feature.note ? `<br><span class="muted small">${esc(feature.note)}</span>` : ''}</dd>` : ''}
        ${place ? `<dt>지명</dt><dd>${esc(place.ko)}${place.historic ? ` <span class="muted">(옛 이름: ${esc(place.historic)})</span>` : ''}${place.original ? ` <span class="muted small">· 원작 표기 ${esc(place.original)}</span>` : ''}</dd>` : ''}
        ${place?.note ? `<dt>비고</dt><dd>${esc(place.note)}</dd>` : ''}
        <dt>실제 위치</dt><dd>${latLonKo(x, y)} <span class="muted small">(헥스 보정 추정, 오차 약 10km)</span></dd>
        <dt>지형</dt><dd>${esc(TERRAIN_KO[hex.terrain])}${hex.closed ? ' <span class="tag">험한 지형</span>' : ''}</dd>
        <dt>지형 요소</dt><dd>${features.length ? esc(features.join(', ')) : '없음'}</dd>
        <dt>점령</dt><dd>${owner ? `<span class="${owner === 1 ? 'un' : 'red'}">${POSSESSION_KO[owner]}</span>` : '-'}</dd>
        ${port ? `<dt>항구</dt><dd>${esc(port.ko)}${portState?.mined ? ' <span class="tag warn">기뢰 부설</span>' : ''}</dd>` : ''}
        ${airfield ? `<dt>비행장</dt><dd>${esc(airfield.ko)}${airfield.code ? ` (${airfield.code})` : ''} · 등급 ${afState?.current ?? 0}/${afState?.best ?? airfield.best}</dd>` : ''}
        ${supply ? '<dt>보급 거점</dt><dd>공산군 보급 거점</dd>' : ''}
        ${owner && hex.code < 0xa5 ? `<dt>보급망</dt><dd>${net ? `<span class="${net === 1 ? 'un' : 'red'}">${esc(TURN_UI_KO.inNet(net === 1 ? '유엔군' : '공산군'))}</span>` : `<span class="tag warn">${esc(TURN_UI_KO.outOfNet)}</span>`}</dd>` : ''}
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
  const mine = sideOf(lead) === activeSide(g) && (g.phase === 1 || g.phase === 3) && !g.gameOver;
  const action = active ? `<span class="tag on">${esc(MOVE_UI_KO.selected)}</span>`
    : mine ? `<button class="btn small" data-action="select-force" data-leader="${f.leader}">${esc(MOVE_UI_KO.select)}</button>`
      : `<span class="tag">${esc(TURN_UI_KO.enemyForce)}</span>`;
  return `
    <article class="force ${active ? 'active' : ''}">
      <header><span class="chip" style="background:${NATION_COLOR[lead.nation]}"></span>
        <div><b>${esc(forceTitle(g, f.leader))}</b><span class="muted">${esc(NATION_KO[lead.nation])} · ${esc(SIDE_KO[SIDE_OF[lead.nation]])} · 이동력 ${a.remaining}/${a.rate}</span></div>
        ${action}
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
