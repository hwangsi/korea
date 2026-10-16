// Prototype entry point: loads the extracted data, builds the game state and wires the Korean UI.
// Turn sequence (docs/rules/turn.md): each player's First Orders Phase -> combat -> Second Orders Phase
// -> General Resolution -> next turn. "단계 종료" ends the current player's phase.
// Movement orders: click a force -> reachable hexes, hover -> path preview, click -> pin, click again
// -> move. Right click / Esc cancels, Ctrl+Z undoes the last move (docs/rules/movement.md).
// Sea and airborne movement are modes of the same orders (docs/rules/naval.md).

import type { MapData, Scenario } from './data/types.ts';
import { MapView, forcesInHex } from './ui/mapView.ts';
import type { Layers, StrikeMarker } from './ui/mapView.ts';
import { renderPanel, renderSummary, renderTurnView, renderAirOps, renderAirstrikes } from './ui/panel.ts';
import type { PanelContext, PanelMessage, TurnView } from './ui/panel.ts';
import { createGameState, forceHex, idx, unit, sideOf, activeSide } from './engine/state.ts';
import type { GameState } from './engine/state.ts';
import { pathTo, moveForce, railMove, undoMove, bugOut, sideMask } from './engine/movement.ts';
import { orderReach, defaultMode, seaMove, seaAssault, seaAssaultPreview, airDrop, airdropLoss, dropOnEnemy } from './engine/naval.ts';
import { assault, assaultPreview, cancelAssault } from './engine/combat.ts';
import type { MoveMode, Reach } from './engine/movement.ts';
import { startNewGame, endPlayerPhase, finishGame, continuePastEnd } from './engine/turn.ts';
import {
  canPlanAir, chooseBases, setMission, pendingAirstrike, flyAirstrike, delegateAirstrikes, strikeLethality, strikeTargetError,
} from './engine/air.ts';
import type { AirReport, AirStrikeResult } from './engine/air.ts';
import type { TurnEvent } from './engine/turn.ts';
import { territoryBalance } from './engine/endturn.ts';
import { gameDate } from './engine/weather.ts';
import {
  TERRAIN_KO, POSSESSION_KO, dateKo, TEMPERATURE_KO, SKY_KO, BLOCK_KO, MOVE_UI_KO, COMBAT_UI_KO, TURN_UI_KO, PHASE_KO,
  PLAYER_KO, END_REASON_KO, victoryKo, unitNameKo, newsKo, AIR_UI_KO, STRIKE_SEVERITY_KO, NAVAL_UI_KO,
} from './i18n/ko.ts';
import { placeAt, featureAt } from './data/places.ts';

const DATA = 'data/extracted';

const SCENARIOS: { id: string; label: string }[] = [
  { id: 'korea1', label: '1. 용이 깨어나다 (1950.6.25)' },
  { id: 'korea1s', label: '1. 용이 깨어나다 · 편성 배치' },
  { id: 'korea2', label: '2. 크로마이트 작전 (1950.9.15)' },
  { id: 'korea2s', label: '2. 크로마이트 작전 · 편성 배치' },
  { id: 'korea3', label: '3. 차가운 강철 (1950.11.22)' },
  { id: 'korea3s', label: '3. 차가운 강철 · 편성 배치' },
  { id: 'korea4', label: '4. 내일의 전쟁 (1995.6.25)' },
  { id: 'korea4s', label: '4. 내일의 전쟁 · 편성 배치' },
];

const $ = <T extends HTMLElement>(sel: string) => document.querySelector(sel) as T;
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

async function getJson<T>(path: string): Promise<T> {
  // standalone.html embeds the data so it also works when opened from the file system
  const embedded = (globalThis as { __EMBEDDED_DATA__?: Record<string, unknown> }).__EMBEDDED_DATA__;
  if (embedded && path in embedded) return embedded[path] as T;
  const res = await fetch(path);
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return (await res.json()) as T;
}

interface Orders {
  leader: number;
  mode: MoveMode;
  reach: Reach;
  /** destination pinned by a first click (hex index) */
  pinned: number | null;
  /** hex under the mouse (hex index) */
  hover: number | null;
  /** adjacent enemy hex pinned for an assault (hex index) */
  assault: number | null;
}

interface Banner {
  side: 1 | 2 | 0;
  eyebrow: string;
  title: string;
  lines: string[];
  buttons: { label: string; action: string; kind?: string }[];
}

async function main() {
  const panel = $('#panel');
  const status = $('#status');
  const bannerEl = $('#banner');
  let map: MapData;
  try {
    map = await getJson<MapData>(`${DATA}/map.json`);
  } catch (err) {
    panel.innerHTML = `<section class="card"><h2>데이터를 찾을 수 없어요</h2><p>먼저 원본 데이터를 추출하세요:</p><pre>node tools/extract/extract.ts</pre><p class="muted">${String(err)}</p></section>`;
    return;
  }

  const view = new MapView($('#map') as unknown as HTMLCanvasElement);
  let scenario: Scenario | null = null;
  let game: GameState | null = null;
  let ctx: PanelContext | null = null;
  let sel: [number, number] | null = null;
  let orders: Orders | null = null;
  let message: PanelMessage | null = null;
  let turnView: TurnView | null = null;
  let banner: Banner | null = null;
  let first = true;
  /** Air Operations panel open (first orders phase). */
  let airOpen = false;
  /** Hex under the mouse while aiming an airstrike. */
  let strikeHover: [number, number] | null = null;
  /** Airstrikes of this turn, drawn on the map until the next turn begins. */
  let strikeMarks: StrikeMarker[] = [];

  const select = $('#scenario') as unknown as HTMLSelectElement;
  select.innerHTML = SCENARIOS.map((s) => `<option value="${s.id}">${s.label}</option>`).join('');

  /** Orders can be given in an orders phase, to forces of the side whose phase it is. */
  const canCommand = (leader: number) =>
    !!game && !game.gameOver && (game.phase === 1 || game.phase === 3) && sideOf(unit(game, leader)) === activeSide(game);
  /** Combat phase with DO_AIR_COMBAT waiting for the human player's airstrikes. */
  const inStrikes = () => !!game && game.phase === 2 && !!game.air;

  const marker = (r: AirStrikeResult): StrikeMarker => ({ hex: idx(game!, r.target[0], r.target[1]), explosions: r.explosions, found: r.found, player: r.player });
  const reportMarks = (rep: AirReport) => rep.sides.flatMap((s) => s.strikes.map(marker));

  // ---------- rendering ----------

  /** Enemy-occupied hex next to the selected force (assault target); sea mode: any enemy-held coast in reach. */
  function isEnemyNeighbor(i: number): boolean {
    if (!orders || !game || orders.reach.origin < 0 || orders.reach.cannot) return false;
    if (orders.mode === 'air') return false;
    if (orders.mode === 'sea') return orders.reach.blocked.get(i) === 'enemy';
    const o = orders.reach.origin;
    if (!sideMask(o % game.width, Math.floor(o / game.width), i % game.width, Math.floor(i / game.width))) return false;
    return orders.reach.blocked.get(i) === 'enemy';
  }

  function assaultView() {
    if (!orders || !game) return null;
    const hex = orders.assault ?? (orders.pinned === null && orders.hover !== null && isEnemyNeighbor(orders.hover) ? orders.hover : null);
    if (hex === null) return null;
    const x = hex % game.width, y = Math.floor(hex / game.width);
    if (orders.mode === 'sea') return { hex, pinned: orders.assault !== null, preview: null, sea: seaAssaultPreview(game, orders.leader, x, y) };
    return { hex, pinned: orders.assault !== null, preview: assaultPreview(game, orders.leader, x, y), sea: null };
  }

  function previewPath(): { path: number[] | null; pinned: boolean } {
    if (!orders || orders.assault !== null) return { path: null, pinned: false };
    if (orders.pinned !== null) return { path: pathTo(orders.reach, orders.pinned), pinned: true };
    if (orders.hover !== null) return { path: pathTo(orders.reach, orders.hover), pinned: false };
    return { path: null, pinned: false };
  }

  function syncView() {
    const p = previewPath();
    view.selected = sel;
    view.selectedLeader = orders?.leader ?? null;
    // a force that cannot move keeps its highlight but gets no reach overlay
    const av = assaultView();
    const dest = p.path?.length ? p.path[p.path.length - 1] : null;
    view.movement = orders && !orders.reach.cannot
      ? {
        reach: orders.reach, path: p.path, pinned: p.pinned,
        assault: av && { hex: av.hex, pinned: av.pinned, allowed: av.sea ? av.sea.allowed : av.preview!.allowed, from: av.sea?.from },
        dropLoss: orders.mode === 'air' && dest !== null && game ? airdropLoss(game, dest % game.width, Math.floor(dest / game.width)) : null,
      }
      : null;
    view.airstrikes = strikeMarks;
    view.showMigAlley = !!game && game.scenarioNo < 4 && (airOpen || inStrikes() || orders?.mode === 'air');
    if (!inStrikes() || !pendingAirstrike(game!)) view.strikeAim = null;
    view.invalidate();
  }

  function renderHeader() {
    if (!game) return;
    const d = gameDate(game);
    $('#date').textContent = `${dateKo(d.year, d.month, d.day)} · ${game.turn}턴`;
    const t = TEMPERATURE_KO[game.temperature];
    const freeze = game.freezeLine > 0 ? ` · 결빙선 ${game.freezeLine}행` : '';
    $('#weather').textContent = (t ? `${t} · ${SKY_KO[game.sky] ?? '-'}` : '-') + freeze;
    $('#weather').title = `승리 수준 ${game.victoryVoid ? '-' : victoryKo(territoryBalance(game))}`;
    const pill = $('#phase');
    const ordersPhase = game.phase === 1 || game.phase === 3;
    pill.className = `phase-pill ${ordersPhase ? (game.player === 2 ? 'un' : 'red') : ''}`;
    pill.innerHTML = game.gameOver
      ? esc(TURN_UI_KO.gameOver)
      : `<span class="dot"></span>${esc(PLAYER_KO[game.player])} · ${esc(PHASE_KO[game.phase] ?? '')}`;
    ($('#end-phase') as HTMLButtonElement).disabled = !(ordersPhase || inStrikes()) || !!game.gameOver || !!banner;
    const airBtn = $('#air-ops') as HTMLButtonElement;
    const airOk = canPlanAir(game);
    airBtn.disabled = !airOk || !!banner;
    airBtn.setAttribute('aria-pressed', String(airOpen && airOk));
  }

  function renderBanner() {
    if (!banner) { bannerEl.hidden = true; bannerEl.innerHTML = ''; return; }
    const cls = banner.side === 2 ? 'side-un' : banner.side === 1 ? 'side-red' : '';
    bannerEl.innerHTML = `<div class="box ${cls}" role="dialog" aria-modal="true">
      <p class="eyebrow">${esc(banner.eyebrow)}</p><h2>${esc(banner.title)}</h2>
      ${banner.lines.map((l) => `<p>${esc(l)}</p>`).join('')}
      <div class="actions">${banner.buttons.map((b) => `<button class="btn ${b.kind ?? 'primary'}" data-banner="${b.action}">${esc(b.label)}</button>`).join('')}</div>
    </div>`;
    bannerEl.hidden = false;
  }

  function renderSide() {
    if (!ctx) return;
    if (inStrikes()) { renderAirstrikes(panel, ctx, strikeHover, message); return; }
    if (airOpen && game && canPlanAir(game)) { renderAirOps(panel, ctx, message); return; }
    if (!sel && turnView) { renderTurnView(panel, ctx, turnView, message); return; }
    if (!sel) { renderSummary(panel, ctx, message); return; }
    const p = previewPath();
    renderPanel(panel, ctx, sel[0], sel[1], orders && { leader: orders.leader, mode: orders.mode, reach: orders.reach, path: p.path, pinned: p.pinned, assault: assaultView() }, message);
  }

  function render() {
    syncView();
    renderSide();
    renderHeader();
    renderBanner();
  }

  // ---------- turn sequence ----------

  /** Turn engine events into the phase banner and the panel report. */
  function handleEvents(events: TurnEvent[]) {
    if (!game) return;
    const g = game;
    const lines: string[] = [];
    let combat: TurnView['combat'] = null;
    let air: TurnView['air'] = null;
    let resolution: TurnView['resolution'] = null;
    airOpen = false;
    strikeHover = null;
    for (const e of events) {
      if (e.kind === 'ordersPhase' && e.phase === 1) strikeMarks = []; // a new turn
      if (e.kind === 'noFirstPhase') lines.push(TURN_UI_KO.noFirstPhase);
      else if (e.kind === 'computerPhase') lines.push(`${PLAYER_KO[e.player]}: ${TURN_UI_KO.computerPhase}`);
      else if (e.kind === 'combat') combat = e.reports;
      else if (e.kind === 'air') { air = e.report; strikeMarks = reportMarks(e.report); }
      else if (e.kind === 'airstrikes' && g.air) strikeMarks = reportMarks(g.air.report);
      else if (e.kind === 'resolution') {
        resolution = e.report;
        if (e.report.refugees) lines.push(TURN_UI_KO.refugees);
        for (const n of e.report.news) lines.push(newsKo(n.text).text);
      } else if (e.kind === 'ordersPhase' && e.reinforcements) lines.push(TURN_UI_KO.reinforcements);
    }
    const over = events.find((e) => e.kind === 'gameOver');
    turnView = combat || resolution || air ? { combat, air, resolution, result: null } : null;
    sel = null;
    orders = null;
    message = null;
    if (over && over.kind === 'gameOver') {
      banner = {
        side: 0, eyebrow: `${gameDateKo(g)} · ${g.turn}턴`, title: TURN_UI_KO.peaceTalks,
        lines: [END_REASON_KO[over.reason] ?? over.reason, TURN_UI_KO.overrideNote],
        buttons: [{ label: TURN_UI_KO.endGame, action: 'end-game' }, { label: TURN_UI_KO.override, action: 'override', kind: 'ghost' }],
      };
      return;
    }
    const strikes = events.find((e) => e.kind === 'airstrikes');
    if (strikes && strikes.kind === 'airstrikes') {
      banner = {
        side: strikes.player,
        eyebrow: `${gameDateKo(g)} · ${g.turn}턴 · ${PHASE_KO[2]}`,
        title: AIR_UI_KO.strikeTitle(PLAYER_KO[strikes.player]),
        lines: [...lines, AIR_UI_KO.strikeLines(strikes.count), TURN_UI_KO.handover],
        buttons: [{ label: TURN_UI_KO.begin, action: 'close' }],
      };
      return;
    }
    const begin = [...events].reverse().find((e) => e.kind === 'ordersPhase');
    if (begin && begin.kind === 'ordersPhase') {
      banner = {
        side: begin.player,
        eyebrow: `${gameDateKo(g)} · ${g.turn}턴`,
        title: TURN_UI_KO.beginPhase(PLAYER_KO[begin.player], PHASE_KO[begin.phase] ?? ''),
        lines: [...lines, TURN_UI_KO.handover],
        buttons: [{ label: TURN_UI_KO.begin, action: 'close' }],
      };
    }
  }

  const gameDateKo = (g: GameState) => { const d = gameDate(g); return dateKo(d.year, d.month, d.day); };

  function endPhase(confirmFirst = true) {
    if (!game || banner) return;
    if (inStrikes()) {
      // the program picks the targets of the airstrikes not flown yet (docs/rules/air.md 9)
      const left = game.air!.queue.length;
      if (confirmFirst && left && !window.confirm(AIR_UI_KO.endPhaseStrikes(left))) return;
      turnView = null;
      message = null;
      handleEvents(endPlayerPhase(game));
      render();
      return;
    }
    if (!(game.phase === 1 || game.phase === 3) || game.gameOver) return;
    if (confirmFirst && !window.confirm(TURN_UI_KO.endPhaseConfirm(PLAYER_KO[game.player], PHASE_KO[game.phase]))) return;
    turnView = null;
    handleEvents(endPlayerPhase(game));
    render();
  }

  function onBanner(action: string) {
    if (!game) return;
    if (action === 'end-game') {
      const result = finishGame(game);
      banner = null;
      turnView = { combat: null, air: null, resolution: turnView?.resolution ?? null, result };
    } else if (action === 'override') {
      banner = null;
      handleEvents(continuePastEnd(game));
    } else banner = null;
    render();
  }

  bannerEl.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-banner]');
    if (b) onBanner(b.dataset.banner!);
  });

  // ---------- orders ----------

  function startOrders(leader: number, mode?: MoveMode) {
    if (!game) return;
    if (!canCommand(leader)) { orders = null; return; }
    const m = mode ?? defaultMode(game, leader);
    orders = { leader, mode: m, reach: orderReach(game, leader, m), pinned: null, hover: null, assault: null };
    const at = forceHex(game, leader);
    if (at >= 0) sel = [at % game.width, Math.floor(at / game.width)];
  }

  function selectHex(x: number, y: number) {
    if (!game) return;
    const forces = forcesInHex(game, x, y).filter((f) => canCommand(f.leader));
    const sameHex = sel && sel[0] === x && sel[1] === y;
    sel = [x, y];
    message = null;
    if (!forces.length) { orders = null; return; }
    // clicking the same hex again cycles through the (at most two) forces stacked there
    let k = 0;
    if (sameHex && orders) {
      const cur = forces.findIndex((f) => f.leader === orders!.leader);
      if (cur >= 0) k = (cur + 1) % forces.length;
    }
    startOrders(forces[k].leader);
  }

  function execute() {
    if (!game || !orders || orders.pinned === null) return;
    const path = pathTo(orders.reach, orders.pinned);
    if (!path) return;
    const { leader, mode } = orders;
    const res = mode === 'rail' ? railMove(game, leader, path)
      : mode === 'sea' ? seaMove(game, leader, path)
      : mode === 'air' ? airDrop(game, leader, orders.pinned)
      : moveForce(game, leader, path);
    if (res.ok) {
      const parts = [MOVE_UI_KO.done, mode === 'rail' ? `${path.length}칸 철도 수송` : `${res.usedAfter - res.usedBefore}${MOVE_UI_KO.points} 사용`];
      if (res.readinessLoss) parts.push(`${MOVE_UI_KO.readiness} −${res.readinessLoss}`);
      message = { kind: 'ok', text: parts.join(' · ') };
      if (res.interdictionLoss) message = { kind: 'warn', text: `${MOVE_UI_KO.interdicted} (${res.interdictionLoss}%)` };
      if (res.bugOuts?.length) message = { kind: 'warn', text: `${MOVE_UI_KO.bugOutMoving}: ${res.bugOuts.map((id) => unitNameKo(unit(game!, id).name)).join(', ')}` };
      if (mode === 'sea') message = { kind: res.beachLoss ? 'warn' : 'ok', text: NAVAL_UI_KO.seaDone(res.sealift ?? 0) + (res.beachLoss ? ` · ${NAVAL_UI_KO.beachWarn}` : '') };
      if (mode === 'air') message = res.destroyed ? { kind: 'error', text: NAVAL_UI_KO.airDestroyed } : { kind: 'ok', text: NAVAL_UI_KO.airDone(res.dropLoss ?? 0) };
      if (res.destroyed) { orders = null; sel = null; return; }
      startOrders(leader);
    } else {
      message = { kind: 'error', text: `${MOVE_UI_KO.failed}: ${BLOCK_KO[res.error ?? ''] ?? res.error}` };
      startOrders(leader, mode);
    }
  }

  function executeAssault() {
    if (!game || !orders || orders.assault === null) return;
    const { leader } = orders;
    const t = orders.assault;
    if (orders.mode === 'sea') {
      const out = seaAssault(game, leader, t % game.width, Math.floor(t / game.width));
      if (!out.ok) message = { kind: 'error', text: `${MOVE_UI_KO.failed}: ${BLOCK_KO[out.error ?? ''] ?? out.error}` };
      else if (out.result === 'overrun') message = { kind: 'ok', text: NAVAL_UI_KO.seaOverran };
      else if (out.result === 'stranded') message = { kind: 'warn', text: NAVAL_UI_KO.seaStranded };
      else message = { kind: 'ok', text: NAVAL_UI_KO.seaPlotted };
      startOrders(leader);
      return;
    }
    const res = assault(game, leader, t % game.width, Math.floor(t / game.width));
    if (!res.ok) message = { kind: 'error', text: `${MOVE_UI_KO.failed}: ${BLOCK_KO[res.error ?? ''] ?? res.error}` };
    else if (res.result === 'overrun') message = { kind: 'ok', text: COMBAT_UI_KO.overran };
    else if (res.result === 'stopped') message = { kind: 'warn', text: COMBAT_UI_KO.stopped };
    else message = { kind: 'ok', text: COMBAT_UI_KO.plottedDone };
    startOrders(leader);
  }

  function undo() {
    if (!game) return;
    const leader = undoMove(game);
    if (leader === null) return;
    message = { kind: 'ok', text: MOVE_UI_KO.undone };
    startOrders(leader, 'tactical');
    render();
  }

  function cancel() {
    if (banner) return;
    if (orders && orders.assault !== null) orders.assault = null;
    else if (orders && orders.pinned !== null) orders.pinned = null;
    else if (orders) orders = null;
    else sel = null;
    message = null;
    render();
  }

  // ---------- air operations ----------

  function toggleAir() {
    if (!game || banner || !canPlanAir(game)) return;
    airOpen = !airOpen;
    // the original bases the air units whenever the Air Operations screen opens (OPSSUBS 1058 -> CHOOSE_BASES)
    if (airOpen) { chooseBases(game, game.player); sel = null; orders = null; turnView = null; message = null; }
    render();
  }

  function strikeText(r: AirStrikeResult): string {
    const place = `(${r.target[0]}, ${r.target[1]})`;
    if (!r.found) return AIR_UI_KO.strikeDone(place, AIR_UI_KO.noTarget);
    const worst = Math.max(...r.forces.map((f) => f.severity));
    const lost = r.forces.reduce((s, f) => s + f.equipmentLost, 0);
    return AIR_UI_KO.strikeDone(place, `${STRIKE_SEVERITY_KO[worst]} · ${AIR_UI_KO.equipmentLost(lost)}${r.aaHit ? ` · ${AIR_UI_KO.aaHit}` : ''}`);
  }

  function strikeAt(x: number, y: number) {
    if (!game) return;
    const res = flyAirstrike(game, x, y);
    if (!res.ok) {
      message = { kind: 'error', text: res.error === 'manchuria' ? AIR_UI_KO.manchuria : AIR_UI_KO.friendly };
    } else {
      strikeMarks = [...strikeMarks, marker(res.result)];
      message = { kind: res.result.found ? 'ok' : 'warn', text: strikeText(res.result) };
    }
    render();
  }

  function delegate(all: boolean) {
    if (!game) return;
    const done = delegateAirstrikes(game, all);
    strikeMarks = [...strikeMarks, ...done.map(marker)];
    const last = done[done.length - 1];
    message = last ? { kind: 'ok', text: `${AIR_UI_KO.autoTag}: ${strikeText(last)}` } : null;
    render();
  }

  // ---------- map events ----------

  view.onClick = (x, y) => {
    if (!game || banner) return;
    const i = idx(game, x, y);
    if (inStrikes()) { if (pendingAirstrike(game)) strikeAt(x, y); return; }
    airOpen = false;
    turnView = null;
    if (orders) {
      if (isEnemyNeighbor(i)) {
        if (orders.assault === i) executeAssault();
        else { orders.assault = i; orders.pinned = null; message = null; }
        render();
        return;
      }
      const node = orders.reach.nodes.get(i);
      if (node && i !== orders.reach.origin) {
        if (node.canStop) {
          if (orders.pinned === i) execute();
          else { orders.pinned = i; orders.assault = null; message = null; }
        }
        render();
        return;
      }
    }
    selectHex(x, y);
    render();
  };

  view.onContext = cancel;

  view.onHover = (x, y) => {
    if (!game || !ctx) return;
    const i = idx(game, x, y);
    const h = game.hexes[i];
    const owner = game.possession[i];
    const forces = forcesInHex(game, x, y);
    const place = placeAt(x, y, game.scenarioNo === 4);
    const feature = featureAt(x, y);
    let text = `(${x}, ${y}) ${place ? place.label + ' · ' : ''}${feature ? feature.label + (feature.elevation ? ` ${feature.elevation}m` : '') + ' · ' : ''}${TERRAIN_KO[h.terrain]}${owner ? ' · ' + POSSESSION_KO[owner] : ''}${forces.length ? ` · 부대 ${forces.length}개` : ''}`;
    if (view.layers.supply && owner && h.code < 0xa5) text += ` · ${view.supplyNet()[i] === owner ? TURN_UI_KO.inNet(PLAYER_KO[owner === 1 ? 2 : 1]) : TURN_UI_KO.outOfNet}`;
    const next = inStrikes() ? pendingAirstrike(game) : null;
    if (next) {
      const err = strikeTargetError(game, next.player, x, y);
      text += ` · ${err === 'manchuria' ? AIR_UI_KO.manchuria : err ? AIR_UI_KO.friendly : AIR_UI_KO.aimAt(Math.max(1, Math.min(100, strikeLethality(game, next.unit, x, y))))}`;
      view.strikeAim = { hex: i, valid: !err };
      if (!strikeHover || strikeHover[0] !== x || strikeHover[1] !== y) {
        strikeHover = [x, y];
        renderSide();
      }
      view.invalidate();
    } else if (orders) {
      const n = orders.reach.nodes.get(i);
      const blocked = orders.reach.blocked.get(i);
      if (n && i !== orders.reach.origin) {
        if (orders.mode === 'sea') text += ` · ${n.step.lands ? NAVAL_UI_KO.landing : `${NAVAL_UI_KO.atSeaStep} (${MOVE_UI_KO.cannotStopHere})`}`;
        else if (orders.mode === 'air') {
          text += ` · ${NAVAL_UI_KO.dropLoss} ${airdropLoss(game, x, y)}%`;
          if (dropOnEnemy(game, i)) text += ` · ${NAVAL_UI_KO.dropConfirmDanger}`;
          if (!n.canStop) text += ` · ${MOVE_UI_KO.cannotStopHere}`;
        } else {
          text += orders.mode === 'rail' ? ` · ${MOVE_UI_KO.railStops}` : ` · ${MOVE_UI_KO.after} ${orders.reach.rate - n.used}`;
          if (!n.canStop) text += ` · ${MOVE_UI_KO.cannotStopHere}`;
        }
      } else if (blocked) text += ` · ${BLOCK_KO[blocked]}`;
      if (isEnemyNeighbor(i)) text += ` · ${orders.mode === 'sea' ? NAVAL_UI_KO.seaPlot : COMBAT_UI_KO.assault}`;
      if (orders.hover !== i) {
        orders.hover = i;
        if (orders.pinned === null && orders.assault === null) render();
      }
    } else if (forces.length && !forces.some((f) => canCommand(f.leader)) && (game.phase === 1 || game.phase === 3)) {
      text += ` · ${TURN_UI_KO.enemyForce}`;
    }
    status.textContent = text;
  };

  // ---------- panel buttons (delegated) ----------

  panel.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-action]');
    if (!btn || !game || banner) return;
    const action = btn.dataset.action;
    if (action === 'confirm') execute();
    else if (action === 'confirm-assault') executeAssault();
    else if (action === 'cancel-plot' && orders) {
      if (cancelAssault(game, orders.leader)) message = { kind: 'ok', text: COMBAT_UI_KO.cancelled };
      startOrders(orders.leader);
    }
    else if (action === 'cancel') { cancel(); return; }
    else if (action === 'undo') { undo(); return; }
    else if (action === 'mode' && orders) startOrders(orders.leader, btn.dataset.mode as MoveMode);
    else if (action === 'select-force') { message = null; startOrders(Number(btn.dataset.leader)); }
    else if (action === 'mission') {
      if (setMission(game, Number(btn.dataset.unit), Number(btn.dataset.mission))) message = null;
    }
    else if (action === 'air-close') airOpen = false;
    else if (action === 'strike-auto') { delegate(false); return; }
    else if (action === 'strike-auto-all') { delegate(true); return; }
    else if (action === 'strike-continue') { endPhase(false); return; }
    else if (action === 'bugout' && orders) {
      if (!window.confirm(MOVE_UI_KO.bugOutConfirm)) return;
      if (bugOut(game, orders.leader)) message = { kind: 'warn', text: MOVE_UI_KO.bugOutDone };
      startOrders(orders.leader);
    }
    render();
  });

  window.addEventListener('keydown', (e) => {
    if ((e.target as HTMLElement).closest('select, input, textarea')) return;
    if (banner) {
      if (e.key === 'Enter' && banner.buttons.length === 1) onBanner(banner.buttons[0].action);
      return;
    }
    if (e.key === 'Escape') cancel();
    else if (e.key === 'Enter' && orders && orders.assault !== null) { executeAssault(); render(); }
    else if (e.key === 'Enter' && orders?.pinned !== null && orders) { execute(); render(); }
    else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); undo(); }
  });

  // ---------- scenario loading ----------

  async function load(id: string) {
    select.value = id;
    scenario = await getJson<Scenario>(`${DATA}/scenarios/${id}.json`);
    game = createGameState(map, scenario, (Date.now() >>> 0) || 1950);
    const events = startNewGame(game);
    view.setData(map, scenario, game);
    const g = game;
    ctx = { map, hexes: g.hexes, scenario, game: g, forcesAt: (x, y) => forcesInHex(g, x, y), supplyNet: () => view.supplyNet() };
    sel = null;
    orders = null;
    message = null;
    turnView = null;
    banner = null;
    strikeMarks = [];
    handleEvents(events);
    turnView = null;
    if (first) { view.fitAll(); first = false; }
    render();
  }

  // give the keyboard back to the map (arrow keys would otherwise switch the scenario)
  select.addEventListener('change', () => { select.blur(); load(select.value); });

  document.querySelectorAll<HTMLButtonElement>('[data-layer]').forEach((btn) => {
    const key = btn.dataset.layer as keyof Layers;
    btn.setAttribute('aria-pressed', String(view.layers[key]));
    btn.addEventListener('click', () => {
      view.layers[key] = !view.layers[key];
      btn.setAttribute('aria-pressed', String(view.layers[key]));
      view.invalidate();
    });
  });
  $('#zoom-in').addEventListener('click', () => view.zoomAt(1.3));
  $('#zoom-out').addEventListener('click', () => view.zoomAt(1 / 1.3));
  $('#zoom-fit').addEventListener('click', () => view.fitAll());
  $('#end-phase').addEventListener('click', () => endPhase(true));
  $('#air-ops').addEventListener('click', toggleAir);

  await load(SCENARIOS[0].id);
  // debugging hooks for the browser console / automated checks
  (globalThis as { __app?: unknown }).__app = {
    view, load,
    get game() { return game; },
    get orders() { return orders; },
    get banner() { return banner; },
    click: (x: number, y: number) => view.onClick(x, y),
    hover: (x: number, y: number) => view.onHover(x, y),
    endPhase: () => endPhase(false),
    toggleAir,
    get airOpen() { return airOpen; },
    closeBanner: () => { if (banner) onBanner(banner.buttons[0].action); },
    bannerAction: (a: string) => onBanner(a),
    cancel, undo,
    /** Switch the selected force's movement mode ('tactical' | 'rail' | 'sea' | 'air'). */
    setMode: (m: MoveMode) => { if (orders) { message = null; startOrders(orders.leader, m); render(); } },
  };
}

main();
