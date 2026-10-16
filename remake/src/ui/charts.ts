// Small SVG charts of the summary panel (graphics plan C): forces at a glance and the front-line trend
// (GameState.history: hexes held at the start of each turn). Strings only, no DOM.

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export const CHART_COLORS = { un: '#3d8bf0', communist: '#e5453d', other: '#8b9ab1', grid: 'rgba(255,255,255,0.08)', text: '#8b9ab1' };

export interface Bar { label: string; value: number | null; color: string; }

/** Vertical bars with the value on top; `null` = unknown (limited intelligence): an outlined bar with "?". */
export function barChart(bars: Bar[], w = 150, h = 112): string {
  const top = 16, bottom = 18, left = 4;
  const max = Math.max(1, ...bars.map((b) => b.value ?? 0));
  const slot = (w - left * 2) / bars.length;
  const bw = Math.min(30, slot * 0.55);
  const ch = h - top - bottom;
  const parts: string[] = [];
  for (let k = 0; k <= 3; k++) {
    const y = top + (ch * k) / 3;
    parts.push(`<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="${CHART_COLORS.grid}"/>`);
  }
  bars.forEach((b, i) => {
    const x = left + slot * i + (slot - bw) / 2;
    const v = b.value;
    const bh = v === null ? ch * 0.45 : Math.max(2, (ch * v) / max);
    const y = top + ch - bh;
    parts.push(v === null
      ? `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="3" fill="none" stroke="${b.color}" stroke-dasharray="3 3"/>`
      : `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="3" fill="${b.color}"/>`);
    parts.push(`<text x="${x + bw / 2}" y="${y - 4}" text-anchor="middle" font-size="11" font-weight="700" fill="#e4ebf5">${v === null ? '?' : v}</text>`);
    parts.push(`<text x="${x + bw / 2}" y="${h - 4}" text-anchor="middle" font-size="10" fill="${CHART_COLORS.text}">${esc(b.label)}</text>`);
  });
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" width="100%" role="img">${parts.join('')}</svg>`;
}

export interface Series { label: string; color: string; values: number[]; }

/** Lines over the turns, x labels at both ends (and the middle). */
export function lineChart(series: Series[], xLabels: string[], w = 170, h = 112): string {
  const top = 10, bottom = 18, left = 26, right = 6;
  const n = Math.max(1, ...series.map((s) => s.values.length));
  const all = series.flatMap((s) => s.values);
  let lo = Math.min(...all), hi = Math.max(...all);
  if (!isFinite(lo)) { lo = 0; hi = 1; }
  if (hi - lo < 10) { const m = (hi + lo) / 2; lo = m - 5; hi = m + 5; }
  const pad = (hi - lo) * 0.1;
  lo = Math.max(0, Math.floor(lo - pad)); hi = Math.ceil(hi + pad);
  const cw = w - left - right, ch = h - top - bottom;
  const X = (i: number) => left + (n === 1 ? cw / 2 : (cw * i) / (n - 1));
  const Y = (v: number) => top + ch - (ch * (v - lo)) / (hi - lo);
  const parts: string[] = [];
  for (let k = 0; k <= 3; k++) {
    const v = lo + ((hi - lo) * k) / 3;
    const y = Y(v);
    parts.push(`<line x1="${left}" y1="${y}" x2="${w - right}" y2="${y}" stroke="${CHART_COLORS.grid}"/>`);
    parts.push(`<text x="${left - 4}" y="${y + 3}" text-anchor="end" font-size="9" fill="${CHART_COLORS.text}">${Math.round(v)}</text>`);
  }
  for (const s of series) {
    if (!s.values.length) continue;
    const pts = s.values.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`);
    if (pts.length > 1) parts.push(`<polyline points="${pts.join(' ')}" fill="none" stroke="${s.color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`);
    const lastI = s.values.length - 1;
    const step = Math.max(1, Math.ceil(s.values.length / 8));
    s.values.forEach((v, i) => { if (i % step === 0 || i === lastI) parts.push(`<circle cx="${X(i).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="2.6" fill="${s.color}"/>`); });
  }
  const xl = xLabels.length;
  const ticks = xl <= 1 ? [0] : xl === 2 ? [0, 1] : [0, Math.floor((xl - 1) / 2), xl - 1];
  for (const i of ticks) {
    const anchor = xl > 1 && i === xl - 1 ? 'end' : i === 0 && xl > 1 ? 'start' : 'middle';
    parts.push(`<text x="${X(i)}" y="${h - 4}" text-anchor="${anchor}" font-size="9.5" fill="${CHART_COLORS.text}">${esc(xLabels[i] ?? '')}</text>`);
  }
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" width="100%" role="img">${parts.join('')}</svg>`;
}
