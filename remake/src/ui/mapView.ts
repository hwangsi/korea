// Canvas 2D hex map: terrain, rivers, roads, rails, possession, units, movement overlay.
// Mouse-only interaction: drag = pan, wheel = zoom, click / right click are reported to the controller.

import type { Force, Hex, MapData, Nation, Scenario } from '../data/types.ts';
import { hexCenter, hexCorners, sideMidpoint, neighbor, pixelToHex, directionsOf, SQRT3 } from '../engine/hex.ts';
import type { Pt } from '../engine/hex.ts';
import { forceUnits, sideOf } from '../engine/state.ts';
import { plottedAssaults, shownStrength } from '../engine/combat.ts';
import type { GameState, Side, UnitState } from '../engine/state.ts';
import { fogActive, forceIntel, knownEnemyAt, strengthReport } from '../engine/intel.ts';
import type { IntelLevel } from '../engine/intel.ts';
import { allowance, frozen } from '../engine/movement.ts';
import { supplyNet } from '../engine/supply.ts';
import type { Reach } from '../engine/movement.ts';
import { echelonOf, MOVE_MODE_KO, pathLabelKo, AIR_UI_KO, NAVAL_UI_KO, INTEL_UI_KO } from '../i18n/ko.ts';
import { placesFor, NATURAL_FEATURES } from '../data/places.ts';

export const HEX = 32; // hex radius in world units
/** Offset (in hex radii, up and right) of each force stacked under the top counter. */
const STACK_STEP = 0.13;

export interface Layers { possession: boolean; units: boolean; names: boolean; nature: boolean; grid: boolean; coords: boolean; supply: boolean; }

const FONT = '"Pretendard", "Noto Sans KR", "Malgun Gothic", "Apple SD Gothic Neo", sans-serif';

const FILL: Record<string, string> = {
  open: '#cbd5a2', rough: '#b3b583', mountain: '#a2916c', urban: '#c8c1b3', offmap: '#d8d3c6',
  ocean: '#4f7fae', estuary: '#7aa5cc', reservoir: '#79aed8', undefined: '#cbd5a2', japan: '#d3dcb2',
};

export const NATION_COLOR: Record<Nation, string> = {
  US: '#2f6aa8', USMC: '#28507d', CW: '#4c7ea6', UN: '#3b8a8f', ROK: '#1f84c6', NKPA: '#b53a35', CPLA: '#b8661c',
};

const isWater = (t: string) => t === 'ocean' || t === 'estuary' || t === 'reservoir';

/** Keyboard panning: direction per arrow key, speed in screen pixels per second, first step of a tap. */
const PAN_DIRS: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
const PAN_SPEED = 700;
const PAN_SPEED_FAST = 1600;
const PAN_TAP = 40;

/** Zoom thresholds of the mountain / lake labels (ranges are shown below rangeMax only). */
const NATURE_ZOOM = { lake: 0.3, peak: 0.34, elevation: 0.75, rangeMax: 0.34 };
const isLand = (t: string) => !isWater(t) && t !== 'offmap';

/** Forces in a hex, in TERRAIN byte order (first force, second force). */
export function forcesInHex(g: GameState, x: number, y: number): Force[] {
  const s = g.stacks[y * g.width + x] ?? [];
  return s.map((leader) => {
    const units = forceUnits(g, leader);
    return { leader, name: units[0].forceName.replace(/\+$/, '').trim(), x, y, units: units.map((u) => u.id) };
  });
}

/** Movement overlay: reachable hexes and the previewed path (hex indices, origin excluded). */
export interface MoveOverlay {
  reach: Reach;
  path: number[] | null;
  pinned: boolean;
  /** Adjacent enemy hex under the mouse / pinned for an assault. `from`: launch hex of an assault from the sea. */
  assault?: { hex: number; pinned: boolean; allowed: boolean; from?: number } | null;
  /** Airborne movement: drop loss ratio (percent) of the previewed drop hex. */
  dropLoss?: number | null;
}

/** Reach colours per movement mode: tint of the stop hexes, outline, path. */
const MODE_STYLE: Record<string, { fill: string; line: string; path: string }> = {
  tactical: { fill: 'rgba(255, 210, 40, 0.26)', line: '#e09a00', path: '#14325c' },
  rail: { fill: 'rgba(60, 150, 255, 0.24)', line: '#1f6fd1', path: '#1f5fbf' },
  sea: { fill: 'rgba(0, 190, 200, 0.30)', line: '#0a8f9e', path: '#0b5f6b' },
  air: { fill: 'rgba(160, 110, 235, 0.20)', line: '#7a4cc2', path: '#5b2f9e' },
};

/** Airstrike of this turn's combat phase: struck hex, explosions (0 = nothing found), striking side. */
export interface StrikeMarker { hex: number; explosions: number; found: boolean; player: number; }

export class MapView {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  map: MapData | null = null;
  hexes: Hex[] = [];
  scenario: Scenario | null = null;
  game: GameState | null = null;
  layers: Layers = { possession: true, units: true, names: true, nature: true, grid: false, coords: false, supply: false };
  cam = { x: 0, y: 0, zoom: 0.5 };
  selected: [number, number] | null = null;
  hover: [number, number] | null = null;
  /** Force chosen for orders (highlighted counter). */
  selectedLeader: number | null = null;
  movement: MoveOverlay | null = null;
  /** Airstrikes flown this turn (burst markers). */
  airstrikes: StrikeMarker[] = [];
  /** Draw the MiG Alley boundary (1950s, x <= 14 and y <= 26: docs/rules/air.md). */
  showMigAlley = false;
  /** Airstrike targeting: the hex under the mouse and whether it is a legal target. */
  strikeAim: { hex: number; valid: boolean } | null = null;
  /** Side whose knowledge the map shows (limited intelligence, docs/rules/intel.md). */
  viewer: Side = 'un';
  /** Hand-over screen of a two-player game with limited intelligence: draw no forces at all. */
  hideForces = false;
  /** Screen rectangles of the counters drawn this frame: place and mountain labels keep clear of them. */
  private counterRects: { x0: number; y0: number; x1: number; y1: number }[] = [];
  /** A force sliding along the hexes it just moved through (movement animation, ui/playSettings.ts). */
  private anim: { leader: number; pts: Pt[]; start: number; stepMs: number; follow: boolean } | null = null;
  onClick: (x: number, y: number) => void = () => {};
  onContext: () => void = () => {};
  onHover: (x: number, y: number) => void = () => {};

  private dpr = 1;
  private pending = false;
  private forcesByHex = new Map<number, Force[]>();
  /** What the viewer knows about each drawn force (2 = everything). */
  private forceLevel = new Map<number, IntelLevel>();
  private forcesKey = '';
  private drag: { sx: number; sy: number; cx: number; cy: number; moved: boolean } | null = null;
  private netCache: { version: number; net: Uint8Array } | null = null;
  /** Arrow keys held down (smooth keyboard panning). */
  private panKeys = new Set<string>();
  private panFast = false;
  private panLast = 0;

  /** Supply net of the current possession (recomputed when the game state changes). */
  supplyNet(): Uint8Array {
    const g = this.game!;
    if (!this.netCache || this.netCache.version !== g.version) this.netCache = { version: g.version, net: supplyNet(g) };
    return this.netCache.net;
  }

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D not supported');
    this.ctx = ctx;
    new ResizeObserver(() => this.resize()).observe(canvas);
    this.bindInput();
    this.bindKeys();
  }

  setData(map: MapData, scenario: Scenario, game: GameState) {
    this.map = map;
    this.hexes = game.hexes;
    this.scenario = scenario;
    this.game = game;
    this.forcesKey = '';
    this.netCache = null;
    this.movement = null;
    this.selectedLeader = null;
    this.anim = null;
    this.invalidate();
  }

  // ---------- movement animation (original MOVEUNIT `1c87`: CENTER on = recentre every step, off = only when the
  // force would leave the screen) ----------

  /** Slide `leader` through `hexes` (start hex first), `stepMs` per hex. The game state has already moved it. */
  animateMove(leader: number, hexes: [number, number][], stepMs: number, follow: boolean) {
    if (hexes.length < 2 || stepMs <= 0) { this.anim = null; return; }
    this.anim = { leader, pts: hexes.map(([x, y]) => hexCenter(x, y, HEX)), start: performance.now(), stepMs, follow };
    requestAnimationFrame(this.animStep);
  }

  get animating(): boolean { return !!this.anim; }

  /** Jump to the end of a running animation (any click or key does this). */
  finishAnimation() {
    if (!this.anim) return;
    const end = this.anim.pts[this.anim.pts.length - 1];
    if (this.anim.follow) this.centerWorld(end); else this.keepInView(end);
    this.anim = null;
    this.invalidate();
  }

  private animPos(t = performance.now()): Pt | null {
    const a = this.anim;
    if (!a) return null;
    const f = Math.max(0, (t - a.start) / a.stepMs);
    const i = Math.min(a.pts.length - 1, Math.floor(f));
    if (i >= a.pts.length - 1) return a.pts[a.pts.length - 1];
    const k = f - i, p = a.pts[i], q = a.pts[i + 1];
    return { x: p.x + (q.x - p.x) * k, y: p.y + (q.y - p.y) * k };
  }

  private animStep = (t: number) => {
    const a = this.anim;
    if (!a) return;
    if (t - a.start >= (a.pts.length - 1) * a.stepMs) { this.finishAnimation(); return; }
    const p = this.animPos(t)!;
    if (a.follow) this.centerWorld(p); else this.keepInView(p);
    this.invalidate();
    requestAnimationFrame(this.animStep);
  };

  private centerWorld(p: Pt) {
    const { w, h } = this.viewSize();
    this.cam.x = p.x - w / 2 / this.cam.zoom;
    this.cam.y = p.y - h / 2 / this.cam.zoom;
  }

  /** Recentre on `p` only when it is outside the view (less a one-hex margin). */
  private keepInView(p: Pt) {
    const { w, h } = this.viewSize();
    const m = HEX * 1.2;
    const x0 = this.cam.x + m, y0 = this.cam.y + m;
    const x1 = this.cam.x + w / this.cam.zoom - m, y1 = this.cam.y + h / this.cam.zoom - m;
    if (p.x < x0 || p.x > x1 || p.y < y0 || p.y > y1) this.centerWorld(p);
  }

  /** Rebuild force lists when the game state or the viewer changed (moves, undo, a new phase). */
  private syncForces() {
    const g = this.game;
    if (!g) return;
    const fog = fogActive(g);
    const key = `${g.version}|${fog ? this.viewer : ''}|${this.hideForces}`;
    if (this.forcesKey === key) return;
    this.forcesKey = key;
    this.forcesByHex.clear();
    this.forceLevel.clear();
    if (this.hideForces) return;
    g.stacks.forEach((s, i) => {
      if (!s.length) return;
      const forces = forcesInHex(g, i % g.width, Math.floor(i / g.width)).filter((f) => {
        const level = fog ? forceIntel(g, this.viewer, f.leader) : 2;
        this.forceLevel.set(f.leader, level);
        return level > 0;
      });
      if (forces.length) this.forcesByHex.set(i, forces);
    });
  }

  /** The viewer knows less than everything about this force (an enemy force under limited intelligence). */
  private fogged(leader: number): boolean {
    const g = this.game;
    if (!g || !fogActive(g)) return false;
    const u = g.units.get(leader);
    return !!u && sideOf(u) !== this.viewer;
  }

  forcesAt(x: number, y: number): Force[] {
    if (!this.map) return [];
    this.syncForces();
    return this.forcesByHex.get(y * this.map.width + x) ?? [];
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
        this.onClick(h[0], h[1]);
        this.invalidate();
      }
    });
    c.addEventListener('mouseleave', () => { this.hover = null; this.invalidate(); });
    c.addEventListener('wheel', (e) => {
      e.preventDefault();
      const p = local(e);
      // Zoom by the scrolled amount, not per event: high-resolution wheels and touchpads send many small
      // events for one notch. A standard notch (100 px) is about 12%; one event never exceeds about 20%.
      let dy = e.deltaY;
      if (e.deltaMode === 1) dy *= 16; // lines
      else if (e.deltaMode === 2) dy *= this.viewSize().h; // pages
      dy = Math.max(-150, Math.min(150, dy));
      if (dy) this.zoomAt(Math.exp(-dy * 0.0012), p.x, p.y);
    }, { passive: false });
    // No double-click zoom: orders are confirmed by clicking the same hex twice (pin, then move / assault / drop,
    // or cycling stacked forces), which the browser also reports as a dblclick. Zoom is the wheel and the +/- buttons.
    c.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.onContext();
      this.invalidate();
    });
  }

  /** Arrow keys pan the map while held (Shift = faster). Ignored while typing in a form field. */
  private bindKeys() {
    const typing = (e: KeyboardEvent) => !!(e.target as HTMLElement | null)?.closest?.('input, select, textarea, [contenteditable="true"]');
    window.addEventListener('keydown', (e) => {
      if (!(e.key in PAN_DIRS) || typing(e) || e.ctrlKey || e.metaKey || e.altKey) return;
      e.preventDefault();
      this.panFast = e.shiftKey;
      if (this.panKeys.has(e.key)) return; // key repeat: the animation is already running
      this.panKeys.add(e.key);
      if (this.panKeys.size === 1) {
        this.panLast = performance.now();
        this.panBy(PAN_TAP, e.key); // a short tap still moves the map a little
        requestAnimationFrame(this.panStep);
      }
    });
    window.addEventListener('keyup', (e) => {
      this.panKeys.delete(e.key);
      if (e.key === 'Shift') this.panFast = false;
    });
    window.addEventListener('blur', () => this.panKeys.clear());
  }

  /** Move the camera `px` screen pixels in the direction(s) of the given keys. */
  private panBy(px: number, ...keys: string[]) {
    let dx = 0, dy = 0;
    for (const k of keys) { const d = PAN_DIRS[k]; if (d) { dx += d[0]; dy += d[1]; } }
    if (!dx && !dy) return;
    this.cam.x += (dx * px) / this.cam.zoom;
    this.cam.y += (dy * px) / this.cam.zoom;
    this.invalidate();
  }

  private panStep = (t: number) => {
    if (!this.panKeys.size) return;
    // speed follows real time even at a low frame rate (capped so a stalled tab does not jump far)
    const dt = Math.min(0.25, Math.max(0, (t - this.panLast) / 1000));
    this.panLast = t;
    this.panBy((this.panFast ? PAN_SPEED_FAST : PAN_SPEED) * dt, ...this.panKeys);
    requestAnimationFrame(this.panStep);
  };

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
    this.syncForces();
    this.counterRects = [];
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
    const sc = this.game;
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

    if (this.layers.supply && sc) this.drawSupply(vis);
    if (this.layers.possession && sc) this.drawFrontLine(vis);

    // north of the freeze line rivers are ignored (original: snowflake marker)
    if (sc && sc.freezeLine > 0) {
      ctx.beginPath();
      for (const h of vis) if (isLand(h.terrain) && frozen(sc, h.x, h.y)) this.hexPath(hexCenter(h.x, h.y, HEX), false);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.fill();
    }

    if (this.movement && !this.anim) this.drawReach(vis, this.movement);
    if (this.showMigAlley) this.drawMigAlley(vis);
    this.drawPlaces();
    if (this.layers.units && sc) this.drawUnits(vis);

    // hover / selection (under the place names so labels on the hex edge stay readable)
    const outline = (hx: [number, number] | null, color: string, width: number) => {
      if (!hx) return;
      this.hexPath(hexCenter(hx[0], hx[1], HEX));
      ctx.strokeStyle = color;
      ctx.lineWidth = width * px;
      ctx.stroke();
    };
    outline(this.hover, 'rgba(255,255,255,0.85)', 2);
    outline(this.selected, '#ffd400', 3.5);

    if (this.layers.units && sc) this.drawAssaultPlots();
    if (this.airstrikes.length || this.strikeAim) this.drawAirstrikes();
    if (this.layers.names || this.layers.nature) this.drawPlaceLabels();
    if (this.movement && !this.anim) this.drawMoveLabels(vis, this.movement);

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

  /** Supply Net Map (manual 3.13): supplied hexes tinted, cut-off friendly hexes hatched. */
  private drawSupply(vis: Hex[]) {
    const ctx = this.ctx;
    const g = this.game!;
    const net = this.supplyNet();
    const supplied: Record<number, Hex[]> = { 1: [], 2: [] };
    const cut: Record<number, Hex[]> = { 1: [], 2: [] };
    for (const h of vis) {
      if (!isLand(h.terrain)) continue;
      const i = h.y * g.width + h.x;
      const owner = g.possession[i];
      if (owner !== 1 && owner !== 2) continue;
      (net[i] === owner ? supplied : cut)[owner].push(h);
    }
    for (const side of [1, 2]) {
      ctx.beginPath();
      for (const h of supplied[side]) this.hexPath(hexCenter(h.x, h.y, HEX), false);
      ctx.fillStyle = side === 1 ? 'rgba(40, 110, 210, 0.16)' : 'rgba(210, 45, 40, 0.16)';
      ctx.fill();
      for (const h of cut[side]) {
        const c = hexCenter(h.x, h.y, HEX);
        ctx.save();
        this.hexPath(c);
        ctx.clip();
        ctx.beginPath();
        for (let k = -2; k <= 2; k++) {
          ctx.moveTo(c.x - HEX + k * HEX * 0.45, c.y + HEX);
          ctx.lineTo(c.x + HEX + k * HEX * 0.45, c.y - HEX);
        }
        ctx.strokeStyle = side === 1 ? 'rgba(30, 70, 150, 0.55)' : 'rgba(150, 30, 30, 0.55)';
        ctx.lineWidth = HEX * 0.07;
        ctx.stroke();
        ctx.restore();
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
    const sc = this.game!;
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

  /** Port, airfield and supply point icons (labels: drawPlaceLabels). */
  private drawPlaces() {
    const map = this.map!;
    const sc = this.scenario;
    const is1995 = sc?.scenario === 4;
    // icons in world space
    for (const p of map.ports) this.icon(hexCenter(p.x, p.y, HEX), 'port', this.game?.ports.find((q) => q.id === p.id)?.mined ?? false);
    for (const a of map.airfields) this.icon(hexCenter(a.x, a.y, HEX), 'airfield', false);
    if (!is1995) for (const sp of map.supplyPoints) this.icon(hexCenter(sp.x, sp.y, HEX), 'supply', false);
  }

  /**
   * Names of every icon hex (src/data/places.ts), drawn above the counters. Major cities first; a
   * label that would overlap an earlier one tries the other side of the hex, then is skipped.
   */
  private drawPlaceLabels() {
    const ctx = this.ctx;
    const z = this.cam.zoom;
    const is1995 = this.scenario?.scenario === 4;
    const { w, h } = this.viewSize();
    ctx.save();
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const style: Record<number, { size: number; weight: number; color: string; minZoom: number }> = {
      1: { size: Math.max(11, Math.min(18, 13 * z + 6)), weight: 700, color: '#1f2328', minZoom: 0 },
      2: { size: Math.max(10, Math.min(15, 10 * z + 5)), weight: 600, color: '#2a2f36', minZoom: 0 },
      3: { size: Math.max(9.5, Math.min(13, 8 * z + 4.5)), weight: 500, color: '#3d4652', minZoom: 0.3 },
    };
    type Rect = { x0: number; y0: number; x1: number; y1: number };
    const placed: Rect[] = [];
    const hits = (r: Rect, list: Rect[]) => list.some((q) => r.x0 < q.x1 && r.x1 > q.x0 && r.y0 < q.y1 && r.y1 > q.y0);
    // labels keep clear of other labels and of the counters (crowded fronts); only major cities may sit on a counter
    const free = (r: Rect) => !hits(r, placed) && !hits(r, this.counterRects);
    const items = this.layers.names ? placesFor(is1995).slice().sort((a, b) => a.rank - b.rank) : [];
    for (const p of items) {
      const st = style[p.rank];
      if (z < st.minZoom) continue;
      const c = hexCenter(p.x, p.y, HEX);
      ctx.font = `${st.weight} ${st.size}px ${FONT}`;
      const tw = ctx.measureText(p.label).width;
      let spot: { x: number; y: number; r: Rect } | null = null;
      let fallback: { x: number; y: number; r: Rect } | null = null;
      for (const dy of [-0.95, 0.95]) {
        const s = this.toScreen({ x: c.x, y: c.y + HEX * dy });
        const r = { x0: s.x - tw / 2 - 3, y0: s.y - st.size / 2 - 2, x1: s.x + tw / 2 + 3, y1: s.y + st.size / 2 + 2 };
        if (r.x1 < 0 || r.y1 < 0 || r.x0 > w || r.y0 > h) break;
        if (free(r)) { spot = { x: s.x, y: s.y, r }; break; }
        if (!fallback && p.rank === 1 && !hits(r, placed)) fallback = { x: s.x, y: s.y, r };
      }
      spot ??= fallback;
      if (!spot) continue;
      placed.push(spot.r);
      ctx.lineWidth = 3.5;
      ctx.lineJoin = 'round';
      ctx.strokeStyle = 'rgba(255,255,255,0.92)';
      ctx.strokeText(p.label, spot.x, spot.y);
      ctx.fillStyle = st.color;
      ctx.fillText(p.label, spot.x, spot.y);
    }
    if (this.layers.nature) this.drawNatureLabels(placed, free);
    const japan = this.layers.names ? this.hexes.find((hx) => hx.terrain === 'japan') : undefined;
    if (japan) {
      const s = this.toScreen(hexCenter(japan.x, japan.y + 2, HEX));
      ctx.font = `700 12px ${FONT}`;
      ctx.strokeStyle = 'rgba(255,255,255,0.92)';
      ctx.strokeText('일본', s.x, s.y);
      ctx.fillStyle = '#1f2328';
      ctx.fillText('일본', s.x, s.y);
    }
    ctx.restore();
  }

  /**
   * Mountain and lake names (src/data/places.ts), drawn after the towns so a town label wins an overlap.
   * Peaks and lakes sit on their own hex; mountain ranges appear only in the overview, when the peak
   * names are hidden. Screen-space transform is already set by drawPlaceLabels.
   */
  private drawNatureLabels(
    placed: { x0: number; y0: number; x1: number; y1: number }[],
    free: (r: { x0: number; y0: number; x1: number; y1: number }) => boolean,
  ) {
    const ctx = this.ctx;
    const z = this.cam.zoom;
    const { w, h } = this.viewSize();
    const halo = (text: string, x: number, y: number, fill: string, haloColor = 'rgba(255,255,255,0.9)') => {
      ctx.lineWidth = 3.2;
      ctx.lineJoin = 'round';
      ctx.strokeStyle = haloColor;
      ctx.strokeText(text, x, y);
      ctx.fillStyle = fill;
      ctx.fillText(text, x, y);
    };
    const order = { lake: 0, peak: 1, range: 2 } as const;
    const items = NATURAL_FEATURES.slice().sort((a, b) => order[a.kind] - order[b.kind] || (b.elevation ?? 0) - (a.elevation ?? 0));
    for (const f of items) {
      if (f.kind === 'range' ? z >= NATURE_ZOOM.rangeMax : z < (f.kind === 'lake' ? NATURE_ZOOM.lake : NATURE_ZOOM.peak)) continue;
      const [hx, hy] = f.hexes[0];
      const c = hexCenter(hx, hy, HEX);
      if (f.kind === 'range') {
        const size = Math.max(11, Math.min(15, 10 + 14 * z));
        ctx.font = `700 ${size}px ${FONT}`;
        const text = [...f.label].join('\u2009'); // letter-spaced, like a printed atlas
        const s = this.toScreen(c);
        const tw = ctx.measureText(text).width;
        const r = { x0: s.x - tw / 2 - 2, y0: s.y - size / 2 - 2, x1: s.x + tw / 2 + 2, y1: s.y + size / 2 + 2 };
        if (r.x1 < 0 || r.y1 < 0 || r.x0 > w || r.y0 > h || !free(r)) continue;
        placed.push(r);
        halo(text, s.x, s.y, 'rgba(96, 66, 36, 0.62)', 'rgba(255,255,255,0.55)');
        continue;
      }
      const peak = f.kind === 'peak';
      const size = Math.max(9.5, Math.min(13, 7 + 6 * z));
      ctx.font = `600 ${size}px ${FONT}`;
      const text = peak ? `\u25B2 ${f.label}` : f.label;
      const sub = peak && f.elevation && z >= NATURE_ZOOM.elevation ? `${f.elevation.toLocaleString('ko-KR')}m` : '';
      const tw = Math.max(ctx.measureText(text).width, sub ? ctx.measureText(sub).width * 0.85 : 0);
      const lines = sub ? size * 1.95 : size;
      // centre of the hex, or a little lower if a town label is in the way; below a counter in the hex; else skipped
      let spot: { x: number; y: number; r: { x0: number; y0: number; x1: number; y1: number } } | null = null;
      for (const dy of [0, 0.5, -0.5, 0.62]) {
        const s = this.toScreen({ x: c.x, y: c.y + HEX * dy });
        const r = { x0: s.x - tw / 2 - 3, y0: s.y - size / 2 - 2, x1: s.x + tw / 2 + 3, y1: s.y - size / 2 + lines + 2 };
        if (r.x1 < 0 || r.y1 < 0 || r.x0 > w || r.y0 > h) break;
        if (free(r)) { spot = { x: s.x, y: s.y, r }; break; }
      }
      if (!spot) continue;
      placed.push(spot.r);
      halo(text, spot.x, spot.y, peak ? '#5a3718' : '#14558f');
      if (sub) {
        ctx.font = `500 ${size * 0.85}px ${FONT}`;
        halo(sub, spot.x, spot.y + size * 1.05, '#7a5a3a');
      }
    }
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
    const moving = this.anim?.leader;
    let movingForce: Force | null = null;
    this.counterRects = [];
    for (const h of vis) {
      const all = this.forcesByHex.get(h.y * map.width + h.x);
      if (!all || !all.length) continue;
      const forces = moving === undefined ? all : all.filter((f) => f.leader !== moving);
      if (forces.length < all.length) movingForce = all.find((f) => f.leader === moving) ?? null;
      if (!forces.length) continue;
      const c = hexCenter(h.x, h.y, HEX);
      // stacked forces: the first (or the selected) force sits in the middle with its numbers; the others peek out
      // up and to the right as plain coloured edges, so no half-covered numbers or badges collide in crowded fronts
      const top = forces.find((f) => f.leader === this.selectedLeader) ?? forces[0];
      const under = forces.filter((f) => f !== top).slice(0, 2);
      under.reverse().forEach((f, k) => {
        const d = (under.length - k) * HEX * STACK_STEP;
        this.counter(f, { x: c.x + d, y: c.y - d }, z, true);
      });
      this.counter(top, c, z);
      this.counterRects.push(this.counterRect(c, under.length));
    }
    if (moving !== undefined && !movingForce) {
      // the destination hex may be off screen while the counter is still on it
      for (const all of this.forcesByHex.values()) { const f = all.find((v) => v.leader === moving); if (f) { movingForce = f; break; } }
    }
    const p = this.animPos();
    if (movingForce && p) this.counter(movingForce, p, z);
  }

  private unit(id: number): UnitState | undefined {
    return this.game?.units.get(id);
  }

  /** Screen rectangle of a hex's counters (front counter plus the stacked edges and the unit-count badge). */
  private counterRect(c: Pt, stacked: number) {
    const w = HEX * 1.08, h = HEX * 0.82, d = stacked * HEX * STACK_STEP, b = HEX * 0.22;
    const p0 = this.toScreen({ x: c.x - w / 2, y: c.y - h / 2 - d - b });
    const p1 = this.toScreen({ x: c.x + w / 2 + d + b, y: c.y + h / 2 });
    return { x0: p0.x, y0: p0.y, x1: p1.x, y1: p1.y };
  }

  /** One counter; `stub` = a stacked force under the top one (box only). */
  private counter(f: Force, c: Pt, z: number, stub = false) {
    const ctx = this.ctx;
    const lead = this.unit(f.leader);
    if (!lead) return;
    const color = NATION_COLOR[lead.nation] ?? '#555';
    const w = HEX * 1.08, h = HEX * 0.82;
    const x = c.x - w / 2, y = c.y - h / 2;
    const selected = this.selectedLeader === f.leader;
    // enemy forces under limited intelligence: the original shows the unit symbol only (docs/rules/intel.md 2.2)
    const fogged = this.fogged(f.leader);
    const level = this.forceLevel.get(f.leader) ?? 2;
    // forces with no movement left are drawn faded (wargame convention); not the enemy's under limited intelligence
    const spent = this.game && !fogged ? allowance(this.game, f.leader).remaining === 0 : false;
    ctx.save();
    if (spent && !selected) ctx.globalAlpha = 0.62;
    if (selected) {
      ctx.beginPath();
      ctx.roundRect(x - HEX * 0.12, y - HEX * 0.12, w + HEX * 0.24, h + HEX * 0.24, HEX * 0.18);
      ctx.fillStyle = '#ffd400';
      ctx.fill();
      ctx.strokeStyle = '#1f2328';
      ctx.lineWidth = HEX * 0.05;
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, HEX * 0.1);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.55)';
    ctx.lineWidth = HEX * 0.04;
    ctx.stroke();
    if (stub) { ctx.restore(); return; }
    this.shipBadge(lead, x, y);
    if (z < 0.4) { ctx.restore(); return; }

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
    if (z < 0.55) { ctx.restore(); return; }
    const members = f.units.map((id) => this.unit(id)).filter((u): u is UnitState => !!u);
    const shown = this.game ? shownStrength(this.game, members) : { L: 0, S: 0 };
    const total = { l: shown.L, s: shown.S };
    const ctxS = (p: Pt) => this.toScreen(p);
    ctx.save();
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    if (fogged) {
      // level 1: type only; level 2: echelon (from the name) and the strength report
      if (level >= 2) {
        const ech2 = echelonOf(f.name || lead.forceName || lead.name);
        if (ech2) {
          ctx.font = `700 ${Math.max(8, 7 * z)}px ${FONT}`;
          const e = ctxS({ x: c.x, y: y + h * 0.1 });
          ctx.fillText(ech2, e.x, e.y);
        }
      }
      ctx.font = `700 ${Math.max(8, 7.5 * z)}px ${FONT}`;
      const t2 = ctxS({ x: c.x, y: y + h * 0.84 });
      ctx.fillText(level >= 2 && this.game
        ? (strengthReport(this.game, f.leader) === 'under' ? INTEL_UI_KO.underShort : INTEL_UI_KO.fullShort)
        : '?', t2.x, t2.y);
      ctx.restore();
      ctx.restore();
      return;
    }
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
    ctx.restore();
  }

  /** A force at sea carries a small ship badge (the original replaces its counter with a ship icon). */
  private shipBadge(lead: UnitState, x: number, y: number) {
    const g = this.game;
    if (!g || lead.x < 0 || lead.y < 0 || lead.x >= g.width || lead.y >= g.height) return;
    const code = g.hexes[lead.y * g.width + lead.x].code;
    if (!(code >= 0xa5 && code < 0xdb)) return;
    const ctx = this.ctx;
    const r = HEX * 0.3;
    const bx = x - r * 0.15, by = y + r * 0.15;
    ctx.beginPath();
    ctx.arc(bx, by, r, 0, Math.PI * 2);
    ctx.fillStyle = '#0b3d5c';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = HEX * 0.04;
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); // hull
    ctx.moveTo(bx - r * 0.62, by + r * 0.08);
    ctx.lineTo(bx + r * 0.62, by + r * 0.08);
    ctx.lineTo(bx + r * 0.36, by + r * 0.46);
    ctx.lineTo(bx - r * 0.36, by + r * 0.46);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(bx - r * 0.06, by - r * 0.58, r * 0.12, r * 0.62); // mast
    ctx.beginPath(); // sail
    ctx.moveTo(bx + r * 0.1, by - r * 0.52);
    ctx.lineTo(bx + r * 0.5, by - r * 0.02);
    ctx.lineTo(bx + r * 0.1, by - r * 0.02);
    ctx.closePath();
    ctx.fill();
  }

  // ---------- assault orders ----------

  private arrow(from: Pt, to: Pt, color: string, width: number, dash: number[] = []) {
    const ctx = this.ctx;
    const a = this.toScreen(from), b0 = this.toScreen(to);
    const ang = Math.atan2(b0.y - a.y, b0.x - a.x);
    const len = Math.hypot(b0.x - a.x, b0.y - a.y);
    const b = { x: a.x + Math.cos(ang) * len * 0.78, y: a.y + Math.sin(ang) * len * 0.78 };
    const ah = Math.max(9, width * 3);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x - Math.cos(ang) * ah * 0.6, b.y - Math.sin(ang) * ah * 0.6);
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = width + 3;
    ctx.setLineDash(dash);
    ctx.stroke();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(b.x, b.y);
    ctx.lineTo(b.x - Math.cos(ang - 0.45) * ah, b.y - Math.sin(ang - 0.45) * ah);
    ctx.lineTo(b.x - Math.cos(ang + 0.45) * ah, b.y - Math.sin(ang + 0.45) * ah);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fill();
  }

  // ---------- air operations ----------

  /** MiG Alley: the hexes x <= 14, y <= 26 outlined with a purple dashed line (the original marks them with a jet). */
  private drawMigAlley(vis: Hex[]) {
    const ctx = this.ctx;
    const map = this.map!;
    const inside = (x: number, y: number) => x < 15 && y < 27;
    ctx.beginPath();
    for (const h of vis) {
      if (!inside(h.x, h.y)) continue;
      const pts = hexCorners(hexCenter(h.x, h.y, HEX), HEX);
      for (let d = 0; d < 6; d++) {
        const [nx, ny] = neighbor(h.x, h.y, d);
        if (nx < 0 || ny < 0 || nx >= map.width || ny >= map.height || inside(nx, ny)) continue;
        const a = pts[(4 + d) % 6], b = pts[(5 + d) % 6];
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
      }
    }
    const z = this.cam.zoom;
    ctx.save();
    ctx.setLineDash([HEX * 0.35, HEX * 0.22]);
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = Math.max(HEX * 0.16, 4 / z);
    ctx.stroke();
    ctx.strokeStyle = '#7a3db8';
    ctx.lineWidth = Math.max(HEX * 0.08, 2 / z);
    ctx.stroke();
    ctx.restore();
    const s = this.toScreen(hexCenter(10, 24, HEX));
    ctx.save();
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.font = `600 ${Math.max(11, Math.min(16, 15 * z))}px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.fillStyle = '#5b2a8c';
    ctx.strokeText(AIR_UI_KO.migAlley, s.x, s.y + HEX * 0.95 * z);
    ctx.fillText(AIR_UI_KO.migAlley, s.x, s.y + HEX * 0.95 * z);
    ctx.restore();
  }

  /** Burst markers on struck hexes (one burst per explosion, a ring if nothing was found) and the aiming reticle. */
  private drawAirstrikes() {
    const ctx = this.ctx;
    const g = this.game;
    if (!g) return;
    const z = this.cam.zoom;
    const r = Math.max(5, HEX * 0.24 * z);
    ctx.save();
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    const burst = (x: number, y: number, size: number, color: string) => {
      ctx.beginPath();
      for (let k = 0; k < 16; k++) {
        const ang = (Math.PI / 8) * k - Math.PI / 2;
        const rr = k % 2 === 0 ? size : size * 0.48;
        const px = x + Math.cos(ang) * rr, py = y + Math.sin(ang) * rr;
        if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.strokeStyle = 'rgba(255,255,255,0.95)';
      ctx.lineWidth = 1.5;
      ctx.fill();
      ctx.stroke();
    };
    for (const m of this.airstrikes) {
      const c = this.toScreen(hexCenter(m.hex % g.width, Math.floor(m.hex / g.width), HEX));
      const cx = c.x + HEX * 0.42 * z, cy = c.y - HEX * 0.42 * z;
      if (!m.found) {
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.7, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(60,60,60,0.85)';
        ctx.lineWidth = 2;
        ctx.stroke();
        continue;
      }
      for (let k = m.explosions - 1; k >= 0; k--) burst(cx - k * r * 0.75, cy + k * r * 0.35, r, m.player === 2 ? '#ff8a00' : '#d0312d');
    }
    if (this.strikeAim) {
      const a = this.strikeAim;
      const c = this.toScreen(hexCenter(a.hex % g.width, Math.floor(a.hex / g.width), HEX));
      const rr = HEX * 0.62 * z;
      ctx.strokeStyle = a.valid ? '#d0312d' : 'rgba(80,80,80,0.7)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(c.x, c.y, rr, 0, Math.PI * 2);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        ctx.moveTo(c.x + dx * rr * 0.45, c.y + dy * rr * 0.45);
        ctx.lineTo(c.x + dx * rr * 1.25, c.y + dy * rr * 1.25);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  /** Every plotted assault on the map, as a red arrow into the target hex (the original draws the same). */
  private drawAssaultPlots() {
    const g = this.game;
    if (!g) return;
    const z = this.cam.zoom;
    const ctx = this.ctx;
    ctx.save();
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    const orders = g.phase === 1 || g.phase === 3;
    for (const p of plottedAssaults(g)) {
      // orders phases: only the viewer's own plans (the original shows SHOW_ALL_PLOTS in the combat phase only);
      // otherwise every plan of a force the viewer can see
      const side = sideOf(g.units.get(p.leader)!);
      if (this.hideForces) continue;
      if (orders && !g.gameOver && side !== this.viewer) continue;
      if (!this.forceLevel.get(p.leader) && fogActive(g)) continue;
      const color = side === 'un' ? '#1f5fbf' : '#c0262d';
      this.arrow(hexCenter(p.from[0], p.from[1], HEX), hexCenter(p.to[0], p.to[1], HEX), color, Math.max(3, 4 * z));
    }
    ctx.restore();
  }

  // ---------- movement overlay ----------

  /** Dim everything the force cannot reach, tint and outline the reachable area. */
  private drawReach(vis: Hex[], m: MoveOverlay) {
    const ctx = this.ctx;
    const map = this.map!;
    const px = 1 / this.cam.zoom;
    const nodes = m.reach.nodes;
    const mode = m.reach.mode;
    const style = MODE_STYLE[mode] ?? MODE_STYLE.tactical;
    const inReach = (i: number) => nodes.has(i);
    ctx.beginPath();
    for (const h of vis) if (!inReach(h.y * map.width + h.x)) this.hexPath(hexCenter(h.x, h.y, HEX), false);
    ctx.fillStyle = 'rgba(24, 28, 40, 0.30)';
    ctx.fill();
    ctx.beginPath();
    for (const h of vis) {
      const n = nodes.get(h.y * map.width + h.x);
      if (n && n.hex !== m.reach.origin && n.canStop) this.hexPath(hexCenter(h.x, h.y, HEX), false);
    }
    ctx.fillStyle = style.fill;
    ctx.fill();
    // pass-through only (estuary under the amphibious rule, full stacks during rail moves); the open sea of a
    // sea move stays undimmed instead
    if (mode !== 'sea') {
      ctx.beginPath();
      for (const h of vis) {
        const n = nodes.get(h.y * map.width + h.x);
        if (n && n.hex !== m.reach.origin && !n.canStop) this.hexPath(hexCenter(h.x, h.y, HEX), false);
      }
      ctx.fillStyle = 'rgba(255, 255, 255, 0.20)';
      ctx.fill();
    }
    // outline of the reachable area
    ctx.beginPath();
    for (const h of vis) {
      const i = h.y * map.width + h.x;
      if (!inReach(i)) continue;
      const pts = hexCorners(hexCenter(h.x, h.y, HEX), HEX);
      for (let d = 0; d < 6; d++) {
        const [nx, ny] = neighbor(h.x, h.y, d);
        const out = nx < 0 || ny < 0 || nx >= map.width || ny >= map.height || !inReach(ny * map.width + nx);
        if (!out) continue;
        const a = pts[(4 + d) % 6], b = pts[(5 + d) % 6];
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
      }
    }
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = 5 * px;
    ctx.stroke();
    ctx.strokeStyle = style.line;
    ctx.lineWidth = 2.5 * px;
    ctx.stroke();
    // enemy forces next to the reachable area (assault targets); airborne: drop hexes held by enemy forces
    ctx.save();
    ctx.setLineDash([6 * px, 4 * px]);
    ctx.strokeStyle = '#d0312d';
    ctx.lineWidth = 2.5 * px;
    for (const [i, why] of m.reach.blocked) {
      if (why !== 'enemy') continue;
      this.hexPath(hexCenter(i % map.width, Math.floor(i / map.width), HEX));
      ctx.stroke();
    }
    if (mode === 'air' && this.game) {
      const g = this.game;
      for (const h of vis) {
        const i = h.y * map.width + h.x;
        if (nodes.has(i) && knownEnemyAt(g, this.viewer, i)) {
          this.hexPath(hexCenter(h.x, h.y, HEX));
          ctx.stroke();
        }
      }
    }
    ctx.restore();
    // origin ring
    const o = m.reach.origin;
    this.hexPath(hexCenter(o % map.width, Math.floor(o / map.width), HEX));
    ctx.strokeStyle = '#ffd400';
    ctx.lineWidth = 3.5 * px;
    ctx.stroke();
  }

  /** Remaining movement points per reachable hex and the previewed path, above the counters. */
  private drawMoveLabels(vis: Hex[], m: MoveOverlay) {
    const ctx = this.ctx;
    const map = this.map!;
    const z = this.cam.zoom;
    const r = m.reach;
    const rail = r.mode === 'rail';
    const special = r.mode !== 'tactical'; // rail, sea, air: no movement point numbers
    const style = MODE_STYLE[r.mode] ?? MODE_STYLE.tactical;
    const onPath = new Set(m.path ?? []);
    ctx.save();
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (z >= 0.45 && !special) {
      ctx.font = `600 ${Math.max(9, Math.min(13, 10 * z))}px ${FONT}`;
      for (const h of vis) {
        const i = h.y * map.width + h.x;
        const n = r.nodes.get(i);
        if (!n || i === r.origin || onPath.has(i)) continue;
        const hasForce = (this.forcesByHex.get(i)?.length ?? 0) > 0;
        const s = this.toScreen(hexCenter(h.x, h.y, HEX));
        const sy = s.y + (hasForce ? HEX * 0.62 * z : 0);
        const text = String(r.rate - n.used);
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(255,255,255,0.9)';
        ctx.strokeText(text, s.x, sy);
        ctx.fillStyle = n.canStop ? '#6b4a00' : '#5c6470';
        ctx.fillText(text, s.x, sy);
      }
    }
    // assault preview
    if (m.assault) {
      const t = m.assault.hex;
      const tc = hexCenter(t % map.width, Math.floor(t / map.width), HEX);
      const oc = hexCenter(r.origin % map.width, Math.floor(r.origin / map.width), HEX);
      ctx.save();
      ctx.setTransform(this.dpr * z, 0, 0, this.dpr * z, -this.cam.x * z * this.dpr, -this.cam.y * z * this.dpr);
      this.hexPath(tc);
      ctx.fillStyle = m.assault.allowed ? 'rgba(208, 49, 45, 0.28)' : 'rgba(90, 90, 90, 0.28)';
      ctx.fill();
      ctx.strokeStyle = m.assault.allowed ? '#d0312d' : '#666';
      ctx.lineWidth = 3.5 / z;
      ctx.stroke();
      ctx.restore();
      // an assault from the sea sails to the launch hex first
      const from = m.assault.from;
      if (from !== undefined && from >= 0 && from !== r.origin) {
        const fc = hexCenter(from % map.width, Math.floor(from / map.width), HEX);
        const a = this.toScreen(oc), b = this.toScreen(fc);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'rgba(255,255,255,0.9)';
        ctx.lineWidth = 6;
        ctx.setLineDash([8, 6]);
        ctx.stroke();
        ctx.strokeStyle = style.path;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.setLineDash([]);
        this.arrow(fc, tc, m.assault.allowed ? '#d0312d' : '#777', Math.max(3.5, 5 * z), m.assault.pinned ? [] : [8, 6]);
      } else this.arrow(oc, tc, m.assault.allowed ? '#d0312d' : '#777', Math.max(3.5, 5 * z), m.assault.pinned ? [] : [8, 6]);
    }
    // path
    if (m.path && m.path.length) {
      const pts = [r.origin, ...m.path].map((i) => this.toScreen(hexCenter(i % map.width, Math.floor(i / map.width), HEX)));
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.beginPath();
      pts.forEach((p, k) => (k ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.strokeStyle = 'rgba(255,255,255,0.95)';
      ctx.lineWidth = m.pinned ? 9 : 7;
      ctx.stroke();
      ctx.strokeStyle = style.path;
      ctx.lineWidth = m.pinned ? 5 : 3.5;
      if (!m.pinned) ctx.setLineDash([8, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
      // arrow head
      const a = pts[pts.length - 2], b = pts[pts.length - 1];
      const ang = Math.atan2(b.y - a.y, b.x - a.x);
      const ah = Math.max(9, 12 * z);
      ctx.beginPath();
      ctx.moveTo(b.x + Math.cos(ang) * ah * 0.2, b.y + Math.sin(ang) * ah * 0.2);
      ctx.lineTo(b.x - Math.cos(ang - 0.5) * ah, b.y - Math.sin(ang - 0.5) * ah);
      ctx.lineTo(b.x - Math.cos(ang + 0.5) * ah, b.y - Math.sin(ang + 0.5) * ah);
      ctx.closePath();
      ctx.fillStyle = style.path;
      ctx.fill();
      // step markers with remaining points
      if (!special) {
        ctx.font = `700 ${Math.max(9, Math.min(12, 9 * z))}px ${FONT}`;
        m.path.forEach((i, k) => {
          if (k === m.path!.length - 1) return;
          const n = r.nodes.get(i);
          const p = pts[k + 1];
          const rad = Math.max(8, 9 * z);
          ctx.beginPath();
          ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
          ctx.fillStyle = '#fff';
          ctx.fill();
          ctx.strokeStyle = '#14325c';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.fillStyle = '#14325c';
          ctx.fillText(String(n ? r.rate - n.used : ''), p.x, p.y + 0.5);
        });
      }
      // destination bubble
      const end = r.nodes.get(m.path[m.path.length - 1]);
      if (end) {
        const spent = end.used - r.usedStart;
        const label = rail ? MOVE_MODE_KO.rail
          : r.mode === 'sea' ? (end.step.lands ? NAVAL_UI_KO.landing : NAVAL_UI_KO.atSeaStep)
          : r.mode === 'air' ? `${NAVAL_UI_KO.drop}${m.dropLoss != null ? ` · −${m.dropLoss}%` : ''}`
          : pathLabelKo(spent, r.rate - end.used);
        ctx.font = `700 ${Math.max(11, Math.min(14, 11 * z + 2))}px ${FONT}`;
        const tw = ctx.measureText(label).width + 16;
        const th = 22;
        const bx = b.x - tw / 2, by = b.y - HEX * z * 0.9 - th;
        ctx.beginPath();
        ctx.roundRect(bx, by, tw, th, 11);
        ctx.fillStyle = m.pinned ? style.path : 'rgba(20, 50, 92, 0.85)';
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.fillText(label, b.x, by + th / 2 + 0.5);
      }
    }
    ctx.restore();
  }
}
