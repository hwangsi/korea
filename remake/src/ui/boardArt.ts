// Board-game look of the map (graphics plan D, docs/graphics.md): every terrain is a painted hex tile, drawn once
// per zoom step (mapView caches them) in a few variants so the board does not look tiled. Canvas 2D only, no images.

import { SQRT3 } from '../engine/hex.ts';

/** Small deterministic generator (tiles must look the same on every redraw). */
function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Lighten (k > 0) or darken (k < 0) a #rrggbb colour. */
export function shade(hex: string, k: number): string {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v: number) => Math.round(k >= 0 ? v + (255 - v) * k : v * (1 + k));
  const r = ch((n >> 16) & 255), g = ch((n >> 8) & 255), b = ch(n & 255);
  return `rgb(${r},${g},${b})`;
}

/** Board colours (the sea is also the canvas background). */
export const BOARD = {
  sea: '#1d5b97',
  seaEdge: '#174d84',
  shallow: '#3f86b8',
  sand: '#e2cd8e',
  foam: 'rgba(255,255,255,0.78)',
  grid: 'rgba(70, 48, 22, 0.16)',
};

const BASE: Record<string, string> = {
  open: '#dbc68a', japan: '#cfcf96', rough: '#c3ab6d', mountain: '#b48c5a', urban: '#cdbf9c',
  ocean: BOARD.sea, estuary: '#4a8bb3', reservoir: '#3a84c4', offmap: '#a9a594', undefined: '#dbc68a',
};

function hexPath(ctx: CanvasRenderingContext2D, R: number) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i;
    const x = R * Math.cos(a), y = R * Math.sin(a);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function speckle(ctx: CanvasRenderingContext2D, R: number, rand: () => number, n: number, dark: string, light: string) {
  for (let i = 0; i < n; i++) {
    const x = (rand() - 0.5) * 2 * R, y = (rand() - 0.5) * SQRT3 * R;
    ctx.fillStyle = rand() < 0.55 ? dark : light;
    ctx.beginPath();
    ctx.arc(x, y, R * (0.012 + rand() * 0.02), 0, Math.PI * 2);
    ctx.fill();
  }
}

function tree(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.fillStyle = 'rgba(40, 45, 18, 0.35)';
  ctx.beginPath();
  ctx.ellipse(x + r * 0.35, y + r * 0.45, r * 1.05, r * 0.7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3d6629';
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#5f8c3c';
  ctx.beginPath();
  ctx.arc(x - r * 0.28, y - r * 0.3, r * 0.55, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(190, 220, 120, 0.45)';
  ctx.beginPath();
  ctx.arc(x - r * 0.38, y - r * 0.42, r * 0.22, 0, Math.PI * 2);
  ctx.fill();
}

function peak(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, snow: boolean) {
  // shadow on the ground (light from the upper left)
  ctx.fillStyle = 'rgba(60, 38, 15, 0.28)';
  ctx.beginPath();
  ctx.moveTo(x, y - h); ctx.lineTo(x + w * 0.75, y + h * 0.05); ctx.lineTo(x + w * 0.1, y + h * 0.08);
  ctx.closePath();
  ctx.fill();
  // lit face
  ctx.fillStyle = '#dcbb88';
  ctx.beginPath();
  ctx.moveTo(x - w / 2, y); ctx.lineTo(x - w * 0.04, y - h); ctx.lineTo(x + w * 0.08, y);
  ctx.closePath();
  ctx.fill();
  // shaded face
  ctx.fillStyle = '#8a6339';
  ctx.beginPath();
  ctx.moveTo(x - w * 0.04, y - h); ctx.lineTo(x + w / 2, y); ctx.lineTo(x + w * 0.08, y);
  ctx.closePath();
  ctx.fill();
  // ridge
  ctx.strokeStyle = 'rgba(70, 45, 20, 0.55)';
  ctx.lineWidth = w * 0.025;
  ctx.beginPath();
  ctx.moveTo(x - w * 0.04, y - h); ctx.lineTo(x + w * 0.1, y - h * 0.35); ctx.lineTo(x + w * 0.06, y);
  ctx.stroke();
  if (snow) {
    ctx.fillStyle = '#f4efe4';
    ctx.beginPath();
    ctx.moveTo(x - w * 0.04, y - h); ctx.lineTo(x - w * 0.16, y - h * 0.7); ctx.lineTo(x - w * 0.02, y - h * 0.76);
    ctx.lineTo(x + w * 0.1, y - h * 0.66); ctx.closePath();
    ctx.fill();
  }
}

function waves(ctx: CanvasRenderingContext2D, R: number, rand: () => number, n: number, alpha: number) {
  ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
  ctx.lineWidth = R * 0.025;
  ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const x = (rand() - 0.5) * 1.3 * R, y = (rand() - 0.5) * 1.2 * R, w = R * (0.14 + rand() * 0.12);
    ctx.beginPath();
    ctx.moveTo(x - w, y);
    ctx.quadraticCurveTo(x - w / 2, y - w * 0.35, x, y);
    ctx.quadraticCurveTo(x + w / 2, y + w * 0.35, x + w, y);
    ctx.stroke();
  }
}

/**
 * Paint one terrain tile centred on (0, 0) with hex radius R (world units; the caller scales the context).
 * `variant` (0..3) changes the arrangement of trees, peaks and buildings.
 */
export function paintTile(ctx: CanvasRenderingContext2D, terrain: string, variant: number, R: number) {
  const base = BASE[terrain] ?? BASE.open;
  const rand = rng(0x9e3779b1 ^ (variant * 7919) ^ terrain.length * 104729 ^ terrain.charCodeAt(0) * 31);
  ctx.save();
  // a hair larger than the hex so neighbouring tiles overlap and no seam shows
  hexPath(ctx, R * 1.025);
  ctx.clip();
  const water = terrain === 'ocean' || terrain === 'estuary' || terrain === 'reservoir';
  if (terrain === 'ocean') {
    // the open sea is one continuous colour (the canvas background), only a few wave marks
    ctx.fillStyle = base;
  } else {
    const g = ctx.createRadialGradient(-R * 0.25, -R * 0.3, R * 0.1, 0, 0, R * 1.15);
    g.addColorStop(0, shade(base, water ? 0.08 : 0.07));
    g.addColorStop(1, shade(base, water ? -0.04 : -0.035));
    ctx.fillStyle = g;
  }
  ctx.fillRect(-R * 1.1, -R, R * 2.2, R * 2);

  switch (terrain) {
    case 'open':
    case 'japan':
    case 'undefined': {
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = terrain === 'japan' ? 'rgba(150, 175, 90, 0.35)' : 'rgba(170, 180, 100, 0.32)';
        ctx.beginPath();
        ctx.ellipse((rand() - 0.5) * R, (rand() - 0.5) * R, R * (0.25 + rand() * 0.25), R * (0.14 + rand() * 0.14), rand() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
      }
      speckle(ctx, R, rand, 40, 'rgba(120, 95, 50, 0.22)', 'rgba(255, 245, 210, 0.28)');
      const trees = variant % 2 === 0 ? 2 : 1;
      for (let i = 0; i < trees; i++) tree(ctx, (rand() - 0.5) * 1.1 * R, (rand() - 0.5) * 0.9 * R, R * 0.075);
      break;
    }
    case 'rough': {
      speckle(ctx, R, rand, 30, 'rgba(100, 80, 40, 0.25)', 'rgba(255, 240, 200, 0.22)');
      // low hills: soft mounds lit from the upper left
      for (let k = 0; k < 2; k++) {
        const hx = (rand() - 0.5) * 0.9 * R, hy = (rand() - 0.3) * 0.7 * R, hw = R * (0.42 + rand() * 0.2), hh = R * (0.26 + rand() * 0.1);
        ctx.fillStyle = 'rgba(95, 70, 35, 0.28)';
        ctx.beginPath();
        ctx.ellipse(hx + hw * 0.25, hy + hh * 0.35, hw, hh * 0.75, 0, 0, Math.PI * 2);
        ctx.fill();
        const hg = ctx.createLinearGradient(hx - hw, hy - hh, hx + hw, hy + hh);
        hg.addColorStop(0, '#d3b77c');
        hg.addColorStop(0.55, '#b1925a');
        hg.addColorStop(1, '#8c6d3e');
        ctx.fillStyle = hg;
        ctx.beginPath();
        ctx.ellipse(hx, hy, hw, hh, 0, Math.PI, 0);
        ctx.quadraticCurveTo(hx + hw * 0.4, hy + hh * 0.35, hx - hw, hy);
        ctx.fill();
      }
      const clusters = 3;
      const pts: [number, number, number][] = [];
      for (let c = 0; c < clusters; c++) {
        const cx = (rand() - 0.5) * 1.0 * R, cy = (rand() - 0.5) * 0.9 * R;
        const n = 4 + Math.floor(rand() * 4);
        for (let i = 0; i < n; i++) pts.push([cx + (rand() - 0.5) * 0.5 * R, cy + (rand() - 0.5) * 0.4 * R, R * (0.09 + rand() * 0.055)]);
      }
      pts.sort((a, b) => a[1] - b[1]);
      for (const [x, y, r] of pts) tree(ctx, x, y, r);
      break;
    }
    case 'mountain': {
      speckle(ctx, R, rand, 30, 'rgba(90, 60, 25, 0.28)', 'rgba(255, 235, 200, 0.2)');
      const layouts = [
        [[-0.25, 0.32, 0.95, 0.85], [0.3, 0.38, 0.75, 0.6], [0.02, 0.05, 0.6, 0.5]],
        [[0.2, 0.3, 0.95, 0.9], [-0.35, 0.4, 0.7, 0.55], [-0.05, 0.0, 0.55, 0.45]],
        [[0, 0.3, 1.05, 0.95], [-0.45, 0.45, 0.55, 0.42], [0.45, 0.48, 0.55, 0.4]],
        [[-0.2, 0.25, 0.85, 0.8], [0.28, 0.42, 0.8, 0.65], [0.38, -0.05, 0.45, 0.35]],
      ][variant % 4];
      const sorted = layouts.slice().sort((a, b) => a[1] - b[1]);
      sorted.forEach(([ox, oy, w, h], i) => peak(ctx, ox * R, oy * R, w * R * 1.12, h * R * 1.08, i === sorted.length - 1 || h > 0.85));
      tree(ctx, (rand() - 0.5) * 1.1 * R, R * 0.55, R * 0.07);
      tree(ctx, (rand() - 0.5) * 1.1 * R, R * 0.6, R * 0.065);
      break;
    }
    case 'urban': {
      ctx.strokeStyle = 'rgba(120, 105, 80, 0.45)';
      ctx.lineWidth = R * 0.05;
      ctx.beginPath();
      ctx.moveTo(-R, R * 0.05); ctx.lineTo(R, -R * 0.08);
      ctx.moveTo(-R * 0.1, -R); ctx.lineTo(R * 0.08, R);
      ctx.stroke();
      const roofs = ['#8f8576', '#b4573f', '#7b8591', '#a39a88', '#c06a48'];
      for (let i = 0; i < 11; i++) {
        const w = R * (0.14 + rand() * 0.12), h = R * (0.12 + rand() * 0.1);
        const x = (rand() - 0.5) * 1.15 * R, y = (rand() - 0.5) * 1.0 * R;
        ctx.fillStyle = 'rgba(50, 40, 30, 0.35)';
        ctx.fillRect(x + R * 0.03, y + R * 0.04, w, h);
        ctx.fillStyle = roofs[Math.floor(rand() * roofs.length)];
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.fillRect(x, y, w, h * 0.3);
      }
      break;
    }
    case 'ocean': {
      waves(ctx, R, rand, 1 + (variant % 2), 0.11);
      break;
    }
    case 'estuary': {
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = 'rgba(226, 205, 142, 0.55)';
        ctx.beginPath();
        ctx.ellipse((rand() - 0.5) * R, (rand() - 0.5) * R, R * (0.2 + rand() * 0.2), R * 0.07, rand() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
      }
      waves(ctx, R, rand, 2, 0.22);
      break;
    }
    case 'reservoir': {
      waves(ctx, R, rand, 2, 0.25);
      break;
    }
    case 'offmap': {
      ctx.strokeStyle = 'rgba(95, 90, 75, 0.28)';
      ctx.lineWidth = R * 0.04;
      ctx.beginPath();
      for (let k = -3; k <= 3; k++) { ctx.moveTo(-R + k * R * 0.4, R); ctx.lineTo(R + k * R * 0.4, -R); }
      ctx.stroke();
      break;
    }
  }
  ctx.restore();
}
