// Prototype entry point: loads the extracted data, builds the game state and wires the Korean UI.
// Movement orders: click a force -> reachable hexes, hover -> path preview, click -> pin, click again
// -> move. Right click / Esc cancels, Ctrl+Z undoes the last move (docs/rules/movement.md).

import type { MapData, Scenario } from './data/types.ts';
import { MapView, forcesInHex } from './ui/mapView.ts';
import type { Layers } from './ui/mapView.ts';
import { renderPanel, renderSummary } from './ui/panel.ts';
import type { PanelContext, PanelMessage } from './ui/panel.ts';
import { createGameState, forceHex, idx } from './engine/state.ts';
import type { GameState } from './engine/state.ts';
import { reach, pathTo, moveForce, railMove, undoMove, bugOut } from './engine/movement.ts';
import type { MoveMode, Reach } from './engine/movement.ts';
import { TERRAIN_KO, POSSESSION_KO, dateKo, TEMPERATURE_KO, SKY_KO, BLOCK_KO, MOVE_UI_KO } from './i18n/ko.ts';

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
}

async function main() {
  const panel = $('#panel');
  const status = $('#status');
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
  let first = true;

  const select = $('#scenario') as unknown as HTMLSelectElement;
  select.innerHTML = SCENARIOS.map((s) => `<option value="${s.id}">${s.label}</option>`).join('');

  // ---------- rendering ----------

  function previewPath(): { path: number[] | null; pinned: boolean } {
    if (!orders) return { path: null, pinned: false };
    if (orders.pinned !== null) return { path: pathTo(orders.reach, orders.pinned), pinned: true };
    if (orders.hover !== null) return { path: pathTo(orders.reach, orders.hover), pinned: false };
    return { path: null, pinned: false };
  }

  function syncView() {
    const p = previewPath();
    view.selected = sel;
    view.selectedLeader = orders?.leader ?? null;
    // a force that cannot move keeps its highlight but gets no reach overlay
    view.movement = orders && !orders.reach.cannot ? { reach: orders.reach, path: p.path, pinned: p.pinned } : null;
    view.invalidate();
  }

  function renderSide() {
    if (!ctx) return;
    if (!sel) { renderSummary(panel, ctx, message); return; }
    const p = previewPath();
    renderPanel(panel, ctx, sel[0], sel[1], orders && { leader: orders.leader, mode: orders.mode, reach: orders.reach, path: p.path, pinned: p.pinned }, message);
  }

  function render() {
    syncView();
    renderSide();
  }

  // ---------- orders ----------

  function startOrders(leader: number, mode: MoveMode = 'tactical') {
    if (!game) return;
    orders = { leader, mode, reach: reach(game, leader, mode), pinned: null, hover: null };
    const at = forceHex(game, leader);
    if (at >= 0) sel = [at % game.width, Math.floor(at / game.width)];
  }

  function selectHex(x: number, y: number) {
    if (!game) return;
    const forces = forcesInHex(game, x, y);
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
      startOrders(leader, 'tactical');
    } else {
      message = { kind: 'error', text: `${MOVE_UI_KO.failed}: ${BLOCK_KO[res.error ?? ''] ?? res.error}` };
      startOrders(leader, mode);
    }
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
    if (orders && orders.pinned !== null) orders.pinned = null;
    else if (orders) orders = null;
    else sel = null;
    message = null;
    render();
  }

  // ---------- map events ----------

  view.onClick = (x, y) => {
    if (!game) return;
    const i = idx(game, x, y);
    if (orders) {
      const node = orders.reach.nodes.get(i);
      if (node && i !== orders.reach.origin) {
        if (node.canStop) {
          if (orders.pinned === i) execute();
          else { orders.pinned = i; message = null; }
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
    let text = `(${x}, ${y}) ${TERRAIN_KO[h.terrain]}${owner ? ' · ' + POSSESSION_KO[owner] : ''}${forces.length ? ` · 부대 ${forces.length}개` : ''}`;
    if (orders) {
      const n = orders.reach.nodes.get(i);
      const blocked = orders.reach.blocked.get(i);
      if (n && i !== orders.reach.origin) {
        text += orders.mode === 'rail' ? ` · ${MOVE_UI_KO.railStops}` : ` · ${MOVE_UI_KO.after} ${orders.reach.rate - n.used}`;
        if (!n.canStop) text += ` · ${MOVE_UI_KO.cannotStopHere}`;
      } else if (blocked) text += ` · ${BLOCK_KO[blocked]}`;
      if (orders.hover !== i) {
        orders.hover = i;
        if (orders.pinned === null) render();
      }
    }
    status.textContent = text;
  };

  // ---------- panel buttons (delegated) ----------

  panel.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-action]');
    if (!btn || !game) return;
    const action = btn.dataset.action;
    if (action === 'confirm') execute();
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
    if (e.key === 'Escape') cancel();
    else if (e.key === 'Enter' && orders?.pinned !== null && orders) { execute(); render(); }
    else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); undo(); }
  });

  // ---------- scenario loading ----------

  async function load(id: string) {
    select.value = id;
    scenario = await getJson<Scenario>(`${DATA}/scenarios/${id}.json`);
    game = createGameState(map, scenario);
    view.setData(map, scenario, game);
    const g = game;
    ctx = { map, hexes: g.hexes, scenario, game: g, forcesAt: (x, y) => forcesInHex(g, x, y) };
    sel = null;
    orders = null;
    message = null;
    $('#date').textContent = `${dateKo(scenario.date.year, scenario.date.month, scenario.date.day)} · ${scenario.turn}턴`;
    const t = TEMPERATURE_KO[scenario.weatherNow.temperature];
    const freeze = scenario.freezeLine > 0 ? ` · 결빙선 ${scenario.freezeLine}행` : '';
    $('#weather').textContent = (t ? `${t} · ${SKY_KO[scenario.weatherNow.sky] ?? '-'}` : '날씨: 시작 시 결정') + freeze;
    if (first) { view.fitAll(); first = false; }
    render();
  }

  select.addEventListener('change', () => load(select.value));

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

  await load(SCENARIOS[0].id);
  // debugging hooks for the browser console / automated checks
  (globalThis as { __app?: unknown }).__app = {
    view, load,
    get game() { return game; },
    get orders() { return orders; },
    click: (x: number, y: number) => view.onClick(x, y),
    hover: (x: number, y: number) => view.onHover(x, y),
    cancel, undo,
  };
}

main();
