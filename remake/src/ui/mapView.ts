// Canvas 2D hex map: terrain, rivers, roads, rails, possession, units. Mouse-only interaction:
// drag = pan, wheel = zoom, click = select hex, right click = clear selection.

import type { EquipmentType, Force, Hex, MapData, Nation, Scenario, Unit } from '../data/types.ts';
import { hexCenter, hexCorners, sideMidpoint, neighbor, pixelToHex, directionsOf, SQRT3 } from '../engine/hex.ts';
import type { Pt } from '../engine/hex.ts';
import { effectiveStrength, displayStrength } from '../engine/strength.ts';
import { echelonOf } from '../i18n/ko.ts';

export const HEX = 32; // hex radius in world units

export interface Layers { possession: boolean; units: boolean; grid: boolean; coords: boolean; }

const FONT = '"Pretendard", "Noto Sans KR", "Malgun Gothic", "Apple SD Gothic Neo", sans-serif';

const FILL: Record<string, string> = {
  open: '#cbd5a2', rough: '#b3b583', mountain: '#a2916c', urban: '#c8c1b3', offmap: '#d8d3c6',
  ocean: '#4f7fae', estuary: '#7aa5cc', reservoir: '#79aed8', undefined: '#cbd5a2', japan: '#d3dcb2',
};

export const NATION_COLOR: Record<Nation, string> = {
  US: '#2f6aa8', USMC: '#28507d', CW: '#4c7ea6', UN: '#3b8a8f', ROK: '#1f84c6', NKPA: '#b53a35', CPLA: '#b8661c',
};

const isWater = (t: string) => t === 'ocean' || t === 'estuary' || t === 'reservoir';
const isLand = (t: string) => !isWater(t) && t !== 'offmap';

export class MapView {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  map: MapData | null = null;
  hexes: Hex[] = [];
  scenario: Scenario | null = null;
  layers: Layers = { possession: true, units: true, grid: false, coords: false };
  cam = { x: 0, y: 0, zoom: 0.5 };
  selected: [number, number] | null = null;
  hover: [number, number] | null = null;
  onSelect: (x: number, y: number) => void = () => {};
  onClear: () => void = () => {};
  onHover: (x: number, y: number) => void = () => {};

  private dpr = 1;
  private pending = false;
  private forcesByHex = new Map<number, Force[]>();
  private unitById = new Map<number, Unit>();
  private eqTypes = new Map<number, EquipmentType>();
  private drag: { sx: number; sy: number; cx: number; cy: number; moved: boolean } | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D not supported');
    this.ctx = ctx;
    new ResizeObserver(() => this.resize()).observe(canvas);
    this.bindInput();
  }

  setData(map: MapData, hexes: Hex[], scenario: Scenario) {
    this.map = map;
    this.hexes = hexes;
    this.scenario = scenario;
    this.unitById = new Map(scenario.units.map((u) => [u.id, u]));
    this.eqTypes = new Map(scenario.equipmentTypes.map((e) => [e.id, e]));
    this.forcesByHex.clear();
    for (const f of scenario.forces) {
      const k = f.y * map.width + f.x;
      const list = this.forcesByHex.get(k) ?? [];
      list.push(f);
      this.forcesByHex.set(k, list);
    }
    this.invalidate();
  }

  forcesAt(x: number, y: number): Force[] {
    return this.map ? this.forcesByHex.get(y * this.map.width + x) ?? [] : [];
  }

  // ---------- camera ----------
  private resize() {
    this.dpr = window.devicePixelRatio || 1;
    const r = this.canvas.getBoundingClientRect();
    this.canvas.width = Math.max(1, Math.round(r.width * this.dpr));
    this.canvas.height = Math.max(1, Math.round(r.height * this.dpr));
    this.invalidate();
  }

  private viewSize() {
    const r = this.canvas.getBoundingClientRect();
    return { w: r.width, h: r.height };
  }

  worldSize() {
    const w = this.map?.width ?? 34;
    const h = this.map?.height ?? 66;
    return { w: HEX * 1.5 * (w - 1) + HEX * 2, h: HEX * SQRT3 * (h + 0.5) };
  }

  fitAll() {
    const { w, h } = this.viewSize();
    const ws = this.worldSize();
    const zoom = Math.min(w / (ws.w + HEX * 2), h / (ws.h + HEX * 2));
    this.cam.zoom = zoom;
    this.cam.x = -HEX + ws.w / 2 - w / 2 / zoom;
    this.cam.y = -HEX + ws.h / 2 - h / 2 / zoom;
    this.invalidate();
  }

  centerOn(x: number, y: number, zoom?: number) {
    const { w, h } = this.viewSize();
    if (zoom) this.cam.zoom = zoom;
    const c = hexCenter(x, y, HEX);
    this.cam.x = c.x - w / 2 / this.cam.zoom;
    this.cam.y = c.y - h / 2 / this.cam.zoom;
    this.invalidate();
  }

  zoomAt(factor: number, sx?: number, sy?: number) {
    const { w, h } = this.viewSize();
    const px = sx ?? w / 2;
    const py = sy ?? h / 2;
    const wx = this.cam.x + px / this.cam.zoom;
    const wy = this.cam.y + py / this.cam.zoom;
    this.cam.zoom = Math.min(4, Math.max(0.15, this.cam.zoom * factor));
    this.cam.x = wx - px / this.cam.zoom;
    this.cam.y = wy - py / this.cam.zoom;
    this.invalidate();
  }

  private screenToHex(sx: number, sy: number): [number, number] | null {
    if (!this.map) return null;
    const [x, y] = pixelToHex(this.cam.x + sx / this.cam.zoom, this.cam.y + sy / this.cam.zoom, HEX);
    return x >= 0 && y >= 0 && x < this.map.width && y < this.map.height ? [x, y] : null;
  }

  private bindInput() {
    const c = this.canvas;
    const local = (e: MouseEvent) => { const r = c.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    c.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      const p = local(e);
      this.drag = { sx: p.x, sy: p.y, cx: this.cam.x, cy: this.cam.y, moved: false };
      c.classList.add('grabbing');
    });
    window.addEventListener('mousemove', (e) => {
      const p = local(e);
      if (this.drag) {
        const dx = p.x - this.drag.sx;
        const dy = p.y - this.drag.sy;
        if (Math.abs(dx) + Math.abs(dy) > 4) this.drag.moved = true;
        if (this.drag.moved) {
          this.cam.x = this.drag.cx - dx / this.cam.zoom;
          this.cam.y = this.drag.cy - dy / this.cam.zoom;
          this.invalidate();
        }
        return;
      }
      if (e.target !== c) return;
      const h = this.screenToHex(p.x, p.y);
      if (h && (!this.hover || h[0] !== this.hover[0] || h[1] !== this.hover[1])) {
        this.hover = h;
        this.onHover(h[0], h[1]);
        this.invalidate();
      }
    });
    window.addEventListener('mouseup', (e) => {
      if (!this.drag) return;
      const wasDrag = this.drag.moved;
      this.drag = null;
      c.classList.remove('grabbing');
      if (wasDrag || e.target !== c) return;
      const p = local(e);
      const h = this.screenToHex(p.x, p.y);
      if (h) {
        this.selected = h;
        this.onSelect(h[0], h[1]);
        this.invalidate();
      }
    });
    c.addEventListener('mouseleave', () => { this.hover = null; this.invalidate(); });
    c.addEventListener('wheel', (e) => {
      e.preventDefault();
      const p = local(e);
      this.zoomAt(e.deltaY < 0 ? 1.15 : 1 / 1.15, p.x, p.y);
    }, { passive: false });
    c.addEventListener('dblclick', (e) => { const p = local(e); this.zoomAt(1.6, p.x, p.y); });
    c.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.selected = null;
      this.onClear();
      this.invalidate();
    });
  }

  invalidate() {
    if (this.pending) return;
    this.pending = true;
    requestAnimationFrame(() => { this.pending = false; this.draw(); });
  }

  // ---------- drawing ----------
  private toScreen(p: Pt): Pt {
    return { x: (p.x - this.cam.x) * this.cam.zoom, y: (p.y - this.cam.y) * this.cam.zoom };
  }

  private visibleHexes(): Hex[] {
    const { w, h } = this.viewSize();
    const x0 = this.cam.x - HEX * 2, y0 = this.cam.y - HEX * 2;
    const x1 = this.cam.x + w / this.cam.zoom + HEX * 2, y1 = this.cam.y + h / this.cam.zoom + HEX * 2;
    return this.hexes.filter((hx) => {
      const c = hexCenter(hx.x, hx.y, HEX);
      return c.x >= x0 && c.x <= x1 && c.y >= y0 && c.y <= y1;
    });
  }

  draw() {
    const ctx = this.ctx;
    const z = this.cam.zoom;
    const map = this.map;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = FILL.ocean;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    if (!map) return;
    ctx.setTransform(this.dpr * z, 0, 0, this.dpr * z, -this.cam.x * z * this.dpr, -this.cam.y * z * this.dpr);
    const px = 1 / z; // one screen pixel in world units
    const vis = this.visibleHexes();

    // terrain
    for (const h of vis) {
      const c = hexCenter(h.x, h.y, HEX);
      this.hexPath(c);
      ctx.fillStyle = FILL[h.terrain] ?? FILL.open;
      ctx.fill();
      ctx.strokeStyle = ctx.fillStyle;
      ctx.lineWidth = px * 1.2;
      ctx.stroke();
    }
    if (z > 0.32) for (const h of vis) this.decorate(h, hexCenter(h.x, h.y, HEX));

    // possession tint + front line
    const sc = this.scenario;
    if (this.layers.possession && sc) {
      for (const h of vis) {
        if (!isLand(h.terrain)) continue;
        const owner = sc.possession[h.y * map.width + h.x];
        if (!owner) continue;
        this.hexPath(hexCenter(h.x, h.y, HEX));
        ctx.fillStyle = owner === 1 ? 'rgba(40, 110, 210, 0.11)' : 'rgba(210, 45, 40, 0.11)';
        ctx.fill();
      }
    }

    if (this.layers.grid && z > 0.35) {
      ctx.beginPath();
      for (const h of vis) this.hexPath(hexCenter(h.x, h.y, HEX), false);
      ctx.strokeStyle = 'rgba(30, 40, 30, 0.22)';
      ctx.lineWidth = px;
      ctx.stroke();
    }

    // linear features
    this.strokeNetwork(vis, 'river', [{ color: '#2f6fb3', width: HEX * 0.14 }]);
    this.strokeNetwork(vis, 'road', [{ color: '#6f603f', width: HEX * 0.17 }, { color: '#f1e3b5', width: HEX * 0.09 }]);
    this.strokeNetwork(vis, 'rail', [{ color: '#2b2b2b', width: HEX * 0.1 }, { color: '#f4f4f4', width: HEX * 0.05, dash: [HEX * 0.2, HEX * 0.2] }]);

    if (this.layers.possession && sc) this.drawFrontLine(vis);

    this.drawPlaces();
    if (this.layers.units && sc) this.drawUnits(vis);

    // hover / selection
    const outline = (hx: [number, number] | null, color: string, width: number) => {
      if (!hx) return;
      this.hexPath(hexCenter(hx[0], hx[1], HEX));
      ctx.strokeStyle = color;
      ctx.lineWidth = width * px;
      ctx.stroke();
    };
    outline(this.hover, 'rgba(255,255,255,0.85)', 2);
    outline(this.selected, '#ffd400', 3.5);

    if (this.layers.coords && z > 0.9) {
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      ctx.font = `10px ${FONT}`;
      ctx.fillStyle = 'rgba(20,20,20,0.55)';
      ctx.textAlign = 'center';
      for (const h of vis) {
        const s = this.toScreen(hexCenter(h.x, h.y, HEX));
        ctx.fillText(`${h.x},${h.y}`, s.x, s.y - HEX * 0.62 * z);
      }
    }
  }

  private hexPath(c: Pt, begin = true) {
    const ctx = this.ctx;
    const pts = hexCorners(c, HEX);
    if (begin) ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < 6; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.closePath();
  }

  private decorate(h: Hex, c: Pt) {
    const ctx = this.ctx;
    const s = HEX;
    // deterministic jitter per hex so textures do not look tiled
    const j = (n: number) => (((h.x * 73856093) ^ (h.y * 19349663) ^ (n * 83492791)) >>> 0) % 1000 / 1000 - 0.5;
    if (h.terrain === 'rough') {
      ctx.fillStyle = 'rgba(85, 90, 40, 0.45)';
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.arc(c.x + j(i) * s * 1.2, c.y + j(i + 9) * s * 1.1, s * 0.07, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (h.terrain === 'mountain') {
      for (const [ox, oy, k] of [[-0.3, 0.12, 1], [0.22, 0.05, 0.8], [-0.02, -0.25, 0.7]]) {
        const bx = c.x + ox * s, by = c.y + oy * s + s * 0.18 * k;
        ctx.beginPath();
        ctx.moveTo(bx - s * 0.3 * k, by);
        ctx.lineTo(bx, by - s * 0.42 * k);
        ctx.lineTo(bx + s * 0.3 * k, by);
        ctx.closePath();
        ctx.fillStyle = '#7d6a4a';
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(bx - s * 0.1 * k, by - s * 0.28 * k);
        ctx.lineTo(bx, by - s * 0.42 * k);
        ctx.lineTo(bx + s * 0.1 * k, by - s * 0.28 * k);
        ctx.closePath();
        ctx.fillStyle = '#f2efe6';
        ctx.fill();
      }
    } else if (h.terrain === 'urban') {
      ctx.fillStyle = '#7d756a';
      for (const [ox, oy, w, hh] of [[-0.35, -0.2, 0.28, 0.24], [0.02, -0.32, 0.3, 0.3], [-0.18, 0.12, 0.34, 0.26], [0.2, 0.05, 0.22, 0.3]]) {
        ctx.fillRect(c.x + ox * s, c.y + oy * s, w * s, hh * s);
      }
    } else if (h.terrain === 'offmap') {
      ctx.save();
      this.hexPath(c);
      ctx.clip();
      ctx.strokeStyle = 'rgba(120, 110, 95, 0.35)';
      ctx.lineWidth = s * 0.05;
      ctx.beginPath();
      for (let k = -2; k <= 2; k++) { ctx.moveTo(c.x - s + k * s * 0.5, c.y + s); ctx.lineTo(c.x + s + k * s * 0.5, c.y - s); }
      ctx.stroke();
      ctx.restore();
    } else if (h.terrain === 'estuary' || h.terrain === 'reservoir') {
      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.lineWidth = s * 0.05;
      ctx.beginPath();
      for (const oy of [-0.2, 0.15]) {
        ctx.moveTo(c.x - s * 0.4, c.y + oy * s);
        ctx.quadraticCurveTo(c.x - s * 0.2, c.y + (oy - 0.1) * s, c.x, c.y + oy * s);
        ctx.quadraticCurveTo(c.x + s * 0.2, c.y + (oy + 0.1) * s, c.x + s * 0.4, c.y + oy * s);
      }
      ctx.stroke();
    }
  }

  private strokeNetwork(vis: Hex[], field: 'river' | 'road' | 'rail', passes: { color: string; width: number; dash?: number[] }[]) {
    const ctx = this.ctx;
    ctx.beginPath();
    for (const h of vis) {
      const mask = h[field];
      if (!mask) continue;
      const c = hexCenter(h.x, h.y, HEX);
      const dirs = directionsOf(mask);
      const mids = dirs.map((d) => sideMidpoint(c, HEX, d));
      if (dirs.length === 2) {
        ctx.moveTo(mids[0].x, mids[0].y);
        ctx.quadraticCurveTo(c.x, c.y, mids[1].x, mids[1].y);
      } else {
        for (const m of mids) { ctx.moveTo(c.x, c.y); ctx.lineTo(m.x, m.y); }
      }
    }
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (const p of passes) {
      ctx.setLineDash(p.dash ?? []);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.width;
      ctx.stroke();
    }
    ctx.setLineDash([]);
  }

  private drawFrontLine(vis: Hex[]) {
    const ctx = this.ctx;
    const map = this.map!;
    const sc = this.scenario!;
    ctx.beginPath();
    for (const h of vis) {
      if (!isLand(h.terrain)) continue;
      const own = sc.possession[h.y * map.width + h.x];
      if (own !== 1) continue; // draw each border once, from the UN side
      const c = hexCenter(h.x, h.y, HEX);
      const pts = hexCorners(c, HEX);
      for (let d = 0; d < 6; d++) {
        const [nx, ny] = neighbor(h.x, h.y, d);
        if (nx < 0 || ny < 0 || nx >= map.width || ny >= map.height) continue;
        const n = this.hexes[ny * map.width + nx];
        if (!isLand(n.terrain) || sc.possession[ny * map.width + nx] !== 2) continue;
        const a = pts[(4 + d) % 6];
        const b = pts[(5 + d) % 6];
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
      }
    }
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = HEX * 0.2;
    ctx.stroke();
    ctx.strokeStyle = '#c0262d';
    ctx.lineWidth = HEX * 0.1;
    ctx.stroke();
  }

  private drawPlaces() {
    const map = this.map!;
    const sc = this.scenario;
    const ctx = this.ctx;
    const z = this.cam.zoom;
    const is1995 = sc?.scenario === 4;
    // icons in world space
    for (const p of map.ports) this.icon(hexCenter(p.x, p.y, HEX), 'port', sc?.ports.find((q) => q.id === p.id)?.mined ?? false);
    for (const a of map.airfields) this.icon(hexCenter(a.x, a.y, HEX), 'airfield', false);
    if (!is1995) for (const sp of map.supplyPoints) this.icon(hexCenter(sp.x, sp.y, HEX), 'supply', false);
    // labels in screen space
    ctx.save();
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const label = (text: string, p: Pt, size: number, weight: number) => {
      const s = this.toScreen(p);
      ctx.font = `${weight} ${size}px ${FONT}`;
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.strokeText(text, s.x, s.y);
      ctx.fillStyle = '#1f2328';
      ctx.fillText(text, s.x, s.y);
    };
    const citySize = Math.max(11, Math.min(18, 13 * z + 6));
    for (const c of map.cities) {
      if (c.only1995 && !is1995) continue;
      const p = hexCenter(c.x, c.y, HEX);
      label(c.ko, { x: p.x, y: p.y - HEX * 0.95 }, citySize, 700);
    }
    if (z > 0.75) {
      for (const p of map.ports) {
        if (map.cities.some((c) => c.x === p.x && c.y === p.y)) continue;
        if (p.ko === '일본') continue;
        const q = hexCenter(p.x, p.y, HEX);
        label(p.ko, { x: q.x, y: q.y + HEX * 0.95 }, 11, 500);
      }
    }
    const japan = this.hexes.find((h) => h.terrain === 'japan');
    if (japan) label('일본', hexCenter(japan.x, japan.y + 2, HEX), 12, 700);
    ctx.restore();
  }

  private icon(c: Pt, kind: 'port' | 'airfield' | 'supply', alert: boolean) {
    const ctx = this.ctx;
    const s = HEX;
    if (kind === 'port') {
      const x = c.x + s * 0.48, y = c.y + s * 0.42;
      ctx.beginPath();
      ctx.arc(x, y, s * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = alert ? '#b3261e' : '#1d4f7a';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = s * 0.045;
      ctx.beginPath();
      ctx.moveTo(x, y - s * 0.12); ctx.lineTo(x, y + s * 0.11);
      ctx.moveTo(x - s * 0.08, y - s * 0.05); ctx.lineTo(x + s * 0.08, y - s * 0.05);
      ctx.moveTo(x - s * 0.11, y + s * 0.03); ctx.quadraticCurveTo(x, y + s * 0.17, x + s * 0.11, y + s * 0.03);
      ctx.stroke();
    } else if (kind === 'airfield') {
      const x = c.x - s * 0.48, y = c.y + s * 0.42;
      ctx.beginPath();
      ctx.arc(x, y, s * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = '#3c4650';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = s * 0.05;
      ctx.beginPath();
      ctx.moveTo(x, y - s * 0.13); ctx.lineTo(x, y + s * 0.13);
      ctx.moveTo(x - s * 0.13, y - s * 0.01); ctx.lineTo(x + s * 0.13, y - s * 0.01);
      ctx.moveTo(x - s * 0.06, y + s * 0.11); ctx.lineTo(x + s * 0.06, y + s * 0.11);
      ctx.stroke();
    } else {
      const x = c.x, y = c.y + s * 0.5;
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? s * 0.2 : s * 0.08;
        const a = -Math.PI / 2 + (i * Math.PI) / 5;
        const px = x + r * Math.cos(a), py = y + r * Math.sin(a);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = '#c0262d';
      ctx.fill();
    }
  }

  private drawUnits(vis: Hex[]) {
    const map = this.map!;
    const z = this.cam.zoom;
    for (const h of vis) {
      const forces = this.forcesByHex.get(h.y * map.width + h.x);
      if (!forces || !forces.length) continue;
      const c = hexCenter(h.x, h.y, HEX);
      forces.slice(0, 3).forEach((f, i) => {
        const off = (i - (Math.min(forces.length, 3) - 1) / 2) * HEX * 0.22;
        this.counter(f, { x: c.x + off, y: c.y + off * 0.8 }, z);
      });
    }
  }

  private counter(f: Force, c: Pt, z: number) {
    const ctx = this.ctx;
    const lead = this.unitById.get(f.leader);
    if (!lead) return;
    const color = NATION_COLOR[lead.nation] ?? '#555';
    const w = HEX * 1.08, h = HEX * 0.82;
    const x = c.x - w / 2, y = c.y - h / 2;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, HEX * 0.1);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.55)';
    ctx.lineWidth = HEX * 0.04;
    ctx.stroke();
    if (z < 0.4) return;

    // NATO frame
    const fw = w * 0.6, fh = h * 0.42;
    const fx = c.x - fw / 2, fy = y + h * 0.2;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = HEX * 0.05;
    ctx.strokeRect(fx, fy, fw, fh);
    ctx.beginPath();
    if (lead.kind === 'infantry' || lead.kind === 'airborne') {
      ctx.moveTo(fx, fy); ctx.lineTo(fx + fw, fy + fh);
      ctx.moveTo(fx + fw, fy); ctx.lineTo(fx, fy + fh);
      if (lead.kind === 'airborne') { ctx.moveTo(fx + fw * 0.25, fy + fh); ctx.quadraticCurveTo(fx + fw / 2, fy + fh * 0.55, fx + fw * 0.75, fy + fh); }
      ctx.stroke();
    } else if (lead.kind === 'armor') {
      ctx.ellipse(c.x, fy + fh / 2, fw * 0.32, fh * 0.28, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.arc(c.x, fy + fh / 2, fh * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      if (lead.kind === 'heavy_artillery') { ctx.beginPath(); ctx.moveTo(fx + fw * 0.15, fy + fh * 0.82); ctx.lineTo(fx + fw * 0.85, fy + fh * 0.82); ctx.stroke(); }
    }

    // echelon + strength + stack size in screen space for crisp text
    if (z < 0.55) return;
    const total = f.units.reduce((acc, id) => {
      const u = this.unitById.get(id);
      if (!u) return acc;
      const s = displayStrength(effectiveStrength(u, this.eqTypes));
      return { l: acc.l + s.lethality, s: acc.s + s.survivability };
    }, { l: 0, s: 0 });
    const ctxS = (p: Pt) => this.toScreen(p);
    ctx.save();
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    const ech = echelonOf(f.name || lead.forceName || lead.name);
    if (ech) {
      ctx.font = `700 ${Math.max(8, 7 * z)}px ${FONT}`;
      const e = ctxS({ x: c.x, y: y + h * 0.1 });
      ctx.fillText(ech, e.x, e.y);
    }
    ctx.font = `700 ${Math.max(9, 9 * z)}px ${FONT}`;
    const t = ctxS({ x: c.x, y: y + h * 0.84 });
    ctx.fillText(`${total.l}-${total.s}`, t.x, t.y);
    if (f.units.length > 1) {
      const b = ctxS({ x: x + w, y });
      const r = Math.max(7, 6.5 * z);
      ctx.beginPath();
      ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
      ctx.fillStyle = '#1f2328';
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = `700 ${Math.max(8, 7 * z)}px ${FONT}`;
      ctx.fillText(String(f.units.length), b.x, b.y + 0.5);
    }
    ctx.restore();
  }
}
