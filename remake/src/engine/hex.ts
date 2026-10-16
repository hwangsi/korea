// Hex grid math. Flat-top hexes, "even-q" offset coordinates (even columns are shifted down by
// half a hex), exactly like the original map. See https://www.redblobgames.com/grids/hexagons/

export const SQRT3 = Math.sqrt(3);
export const DIRECTIONS = ['N', 'NE', 'SE', 'S', 'SW', 'NW'] as const;
export const OPPOSITE = [3, 4, 5, 0, 1, 2];
/** Screen angle (radians, y down) from a hex center toward each neighbor. */
export const DIR_ANGLE = [-90, -30, 30, 90, 150, 210].map((d) => (d * Math.PI) / 180);

export interface Pt { x: number; y: number; }

export function hexCenter(col: number, row: number, size: number): Pt {
  return {
    x: size * 1.5 * col,
    y: size * SQRT3 * (row + ((col & 1) === 0 ? 0.5 : 0)),
  };
}

export function hexCorners(c: Pt, size: number): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i;
    pts.push({ x: c.x + size * Math.cos(a), y: c.y + size * Math.sin(a) });
  }
  return pts;
}

/** Midpoint of the hexside facing direction `dir`. */
export function sideMidpoint(c: Pt, size: number, dir: number): Pt {
  const r = (size * SQRT3) / 2;
  return { x: c.x + r * Math.cos(DIR_ANGLE[dir]), y: c.y + r * Math.sin(DIR_ANGLE[dir]) };
}

export function neighbor(x: number, y: number, dir: number): [number, number] {
  const shifted = (x & 1) === 0;
  switch (dir) {
    case 0: return [x, y - 1];
    case 1: return shifted ? [x + 1, y] : [x + 1, y - 1];
    case 2: return shifted ? [x + 1, y + 1] : [x + 1, y];
    case 3: return [x, y + 1];
    case 4: return shifted ? [x - 1, y + 1] : [x - 1, y];
    default: return shifted ? [x - 1, y] : [x - 1, y - 1];
  }
}

/** World pixel -> offset coordinates (cube rounding). */
export function pixelToHex(px: number, py: number, size: number): [number, number] {
  const y = py - (size * SQRT3) / 2; // our even columns sit half a hex lower than plain axial layout
  const qf = ((2 / 3) * px) / size;
  const rf = ((-1 / 3) * px + (SQRT3 / 3) * y) / size;
  const sf = -qf - rf;
  let q = Math.round(qf);
  let r = Math.round(rf);
  const s = Math.round(sf);
  const dq = Math.abs(q - qf);
  const dr = Math.abs(r - rf);
  const ds = Math.abs(s - sf);
  if (dq > dr && dq > ds) q = -r - s;
  else if (dr > ds) r = -q - s;
  const col = q;
  const row = r + (q + (q & 1)) / 2;
  return [col, row];
}

export function directionsOf(mask: number): number[] {
  const out: number[] = [];
  for (let d = 0; d < 6; d++) if (mask & (1 << d)) out.push(d);
  return out;
}
