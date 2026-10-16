// Prototype entry point: loads the extracted data, builds the game state and wires the Korean UI.
// Turn sequence (docs/rules/turn.md): each player's First Orders Phase -> combat -> Second Orders Phase
// -> General Resolution -> next turn. "단계 종료" ends the current player's phase.
// Movement orders: click a force -> reachable hexes, hover -> path preview, click -> pin, click again
// -> move. Right click / Esc cancels, Ctrl+Z undoes the last move (docs/rules/movement.md).

import type { MapData, Scenario } from './data/types.ts';
import { MapView, forcesInHex } from './ui/mapView.ts';
import type { Layers } from './ui/mapView.ts';
import { renderPanel, renderSummary, renderTurnView } from './ui/panel.ts';
import type { PanelContext, PanelMessage, TurnView } from './ui/panel.ts';
import { createGameState, forceHex, idx, unit, sideOf, activeSide } from './engine/state.ts';
import type { GameState } from './engine/state.ts';
import { reach, pathTo, moveForce, railMove, undoMove, bugOut, sideMask } from './engine/movement.ts';
import { assault, assaultPreview, cancelAssault } from './engine/combat.ts';
import type { MoveMode, Reach } from './engine/movement.ts';
import { startNewGame, endPlayerPhase, finishGame, continuePastEnd } from './engine/turn.ts';
import type { TurnEvent } from './engine/turn.ts';
import { territoryBalance } from './engine/endturn.ts';
import { gameDate } from './engine/weather.ts';
import {
  TERRAIN_KO, POSSESSION_KO, dateKo, TEMPERATURE_KO, SKY_KO, BLOCK_KO, MOVE_UI_KO, COMBAT_UI_KO, TURN_UI_KO, PHASE_KO,
  PLAYER_KO, END_REASON_KO, victoryKo, unitNameKo, newsKo,
} from './i18n/ko.ts';
import { placeAt } from './data/places.ts';

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

  const select = $('#scenario') as unknown as HTMLSelectElement;
  select.innerHTML = SCENARIOS.map((s) => `<option value="${s.id}">${s.label}</option>`).join('');

  /** Orders can be given in an orders phase, to forces of the side whose phase it is. */
  const canCommand = (leader: number) =>
    !!game && !game.gameOver && (game.phase === 1 || game.phase === 3) && sideOf(unit(game, leader)) === activeSide(game);

  // ---------- rendering ----------

  /** Enemy-occupied hex next to the selected force (assault target). */
  function isEnemyNeighbor(i: number): boolean {
    if (!orders || !game || orders.reach.origin < 0) return false;
    const o = orders.reach.origin;
    if (!sideMask(o % game.width, Math.floor(o / game.width), i % game.width, Math.floor(i / game.width))) return false;
    return orders.reach.blocked.get(i) === 'enemy';
  }

  function assaultView() {
    if (!orders || !game) return null;
    const hex = orders.assault ?? (orders.pinned === null && orders.hover !== null && isEnemyNeighbor(orders.hover) ? orders.hover : null);
    if (hex === null) return null;
    return { hex, pinned: orders.assault !== null, preview: assaultPreview(game, orders.leader, hex % game.width, Math.floor(hex / game.width)) };
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
    view.movement = orders && !orders.reach.cannot
      ? { reach: orders.reach, path: p.path, pinned: p.pinned, assault: av && { hex: av.hex, pinned: av.pinned, allowed: av.preview.allowed } }
      : null;
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
    ($('#end-phase') as HTMLButtonElement).disabled = !ordersPhase || !!game.gameOver || !!banner;
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
    let resolution: TurnView['resolution'] = null;
    for (const e of events) {
      if (e.kind === 'noFirstPhase') lines.push(TURN_UI_KO.noFirstPhase);
      else if (e.kind === 'computerPhase') lines.push(`${PLAYER_KO[e.player]}: ${TURN_UI_KO.computerPhase}`);
      else if (e.kind === 'combat') combat = e.reports;
      else if (e.kind === 'resolution') {
        resolution = e.report;
        if (e.report.refugees) lines.push(TURN_UI_KO.refugees);
        for (const n of e.report.news) lines.push(newsKo(n.text).text);
      } else if (e.kind === 'ordersPhase' && e.reinforcements) lines.push(TURN_UI_KO.reinforcements);
    }
    const over = events.find((e) => e.kind === 'gameOver');
    turnView = combat || resolution ? { combat, resolution, result: null } : null;
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
      turnView = { combat: null, resolution: turnView?.resolution ?? null, result };
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

  function startOrders(leader: number, mode: MoveMode = 'tactical') {
    if (!game) return;
    if (!canCommand(leader)) { orders = null; return; }
    orders = { leader, mode, reach: reach(game, leader, mode), pinned: null, hover: null, assault: null };
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
    const res = mode === 'rail' ? railMove(game, leader, path) : moveForce(game, leader, path);
    if (res.ok) {
      const parts = [MOVE_UI_KO.done, mode === 'rail' ? `${path.length}칸 철도 수송` : `${res.usedAfter - res.usedBefore}${MOVE_UI_KO.points} 사용`];
      if (res.readinessLoss) parts.push(`${MOVE_UI_KO.readiness} −${res.readinessLoss}`);
      message = { kind: 'ok', text: parts.join(' · ') };
      if (res.interdictionLoss) message = { kind: 'warn', text: `${MOVE_UI_KO.interdicted} (${res.interdictionLoss}%)` };
      if (res.bugOuts?.length) message = { kind: 'warn', text: `${MOVE_UI_KO.bugOutMoving}: ${res.bugOuts.map((id) => unitNameKo(unit(game!, id).name)).join(', ')}` };
      startOrders(leader, 'tactical');
    } else {
      message = { kind: 'error', text: `${MOVE_UI_KO.failed}: ${BLOCK_KO[res.error ?? ''] ?? res.error}` };
      startOrders(leader, mode);
    }
  }

  function executeAssault() {
    if (!game || !orders || orders.assault === null) return;
    const { leader } = orders;
    const t = orders.assault;
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

  // ---------- map events ----------

  view.onClick = (x, y) => {
    if (!game || banner) return;
    const i = idx(game, x, y);
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
    let text = `(${x}, ${y}) ${place ? place.label + ' · ' : ''}${TERRAIN_KO[h.terrain]}${owner ? ' · ' + POSSESSION_KO[owner] : ''}${forces.length ? ` · 부대 ${forces.length}개` : ''}`;
    if (view.layers.supply && owner && h.code < 0xa5) text += ` · ${view.supplyNet()[i] === owner ? TURN_UI_KO.inNet(PLAYER_KO[owner === 1 ? 2 : 1]) : TURN_UI_KO.outOfNet}`;
    if (orders) {
      const n = orders.reach.nodes.get(i);
      const blocked = orders.reach.blocked.get(i);
      if (n && i !== orders.reach.origin) {
        text += orders.mode === 'rail' ? ` · ${MOVE_UI_KO.railStops}` : ` · ${MOVE_UI_KO.after} ${orders.reach.rate - n.used}`;
        if (!n.canStop) text += ` · ${MOVE_UI_KO.cannotStopHere}`;
      } else if (blocked) text += ` · ${BLOCK_KO[blocked]}`;
      if (isEnemyNeighbor(i)) text += ` · ${COMBAT_UI_KO.assault}`;
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
    closeBanner: () => { if (banner) onBanner(banner.buttons[0].action); },
    bannerAction: (a: string) => onBanner(a),
    cancel, undo,
  };
}

main();
