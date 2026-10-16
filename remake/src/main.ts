// Prototype entry point: loads the extracted data and shows the Korean-language map viewer.

import type { Hex, MapData, Scenario } from './data/types.ts';
import { MapView } from './ui/mapView.ts';
import type { Layers } from './ui/mapView.ts';
import { renderHex, renderSummary } from './ui/panel.ts';
import type { PanelContext } from './ui/panel.ts';
import { TERRAIN_KO, POSSESSION_KO, dateKo, TEMPERATURE_KO, SKY_KO } from './i18n/ko.ts';

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

function hexesFor(map: MapData, scenario: Scenario): Hex[] {
  if (scenario.scenario !== 4) return map.hexes;
  const hexes = map.hexes.slice();
  for (const h of map.variant1995) hexes[h.y * map.width + h.x] = h;
  return hexes;
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
  let ctx: PanelContext | null = null;
  let first = true;

  const select = $('#scenario') as unknown as HTMLSelectElement;
  select.innerHTML = SCENARIOS.map((s) => `<option value="${s.id}">${s.label}</option>`).join('');

  async function load(id: string) {
    const scenario = await getJson<Scenario>(`${DATA}/scenarios/${id}.json`);
    const hexes = hexesFor(map, scenario);
    view.setData(map, hexes, scenario);
    ctx = { map, hexes, scenario, forcesAt: (x, y) => view.forcesAt(x, y) };
    $('#date').textContent = `${dateKo(scenario.date.year, scenario.date.month, scenario.date.day)} · ${scenario.turn}턴`;
    const t = TEMPERATURE_KO[scenario.weatherNow.temperature];
    $('#weather').textContent = t ? `${t} · ${SKY_KO[scenario.weatherNow.sky] ?? '-'}` : '날씨: 시작 시 결정';
    if (view.selected) renderHex(panel, ctx, view.selected[0], view.selected[1]);
    else renderSummary(panel, ctx);
    if (first) { view.fitAll(); first = false; }
  }

  select.addEventListener('change', () => load(select.value));
  view.onSelect = (x, y) => { if (ctx) renderHex(panel, ctx, x, y); };
  view.onClear = () => { if (ctx) renderSummary(panel, ctx); };
  view.onHover = (x, y) => {
    if (!ctx) return;
    const h = ctx.hexes[y * map.width + x];
    const owner = ctx.scenario.possession[y * map.width + x];
    const forces = view.forcesAt(x, y);
    status.textContent = `(${x}, ${y}) ${TERRAIN_KO[h.terrain]}${owner ? ' · ' + POSSESSION_KO[owner] : ''}${forces.length ? ` · 부대 ${forces.length}개` : ''}`;
  };

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
  // debugging hook for the browser console
  (globalThis as { __app?: unknown }).__app = { view, load };
}

main();
