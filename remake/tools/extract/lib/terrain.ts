// Terrain semantics of the original map, reverse engineered from KOREA.EXE:
//  - EURSUBS1.GET_TERRAIN  : code ranges -> terrain description
//  - EURSUBS1.CLOSED_TERRAIN / URBANORFORT / WATERHEX, HEXSTUFF.ROAD_HEX
//  - TACSUBS.DRAW_VGA_TOPTILE : code -> tile position in K_HX_VGA.LBM / KCHX_VGA.LBM
//  - globals ROADS[114] / RAILS[129] : hexside masks indexed by (code - 0x0B) / (code - 0x1E)
// Hexside bits (constants N, NE, SE, S, SW, NW in the debug info): 1, 2, 4, 8, 16, 32.

import type { IndexedImage } from './ilbm.ts';

export const DIRS = ['N', 'NE', 'SE', 'S', 'SW', 'NW'] as const;
export const OPPOSITE = [3, 4, 5, 0, 1, 2];

export type TerrainKind = 'open' | 'rough' | 'mountain' | 'urban' | 'offmap' | 'ocean' | 'estuary' | 'reservoir' | 'undefined';

export interface TerrainClass {
  kind: TerrainKind;
  label: string; // original English description
  river: boolean;
  road: boolean;
  rail: boolean;
}

// Cascading thresholds used by GET_TERRAIN for feature tiles (code < 0xA5, except special codes).
const CASCADE: [number, string, boolean, boolean, boolean, TerrainKind][] = [
  // threshold, label, river, road, rail, base
  [0x01, 'Open/River', true, false, false, 'open'],
  [0x0b, 'Open/Road/River', true, true, false, 'open'],
  [0x10, 'Open/Road', false, true, false, 'open'],
  [0x1e, 'Open/Road/RR', false, true, true, 'open'],
  [0x47, 'Open/Road/RR/River', true, true, true, 'open'],
  [0x59, 'Rough/River', true, false, false, 'rough'],
  [0x68, 'Rough/Road/River', true, true, false, 'rough'],
  [0x71, 'Rough/Road', false, true, false, 'rough'],
  [0x7f, 'Rough/RR', false, false, true, 'rough'],
  [0x8c, 'Rough/RR/River', true, false, true, 'rough'],
  [0x95, 'Open/RR', false, false, true, 'open'],
  [0x9d, 'Open/RR/River', true, false, true, 'open'],
];

export function classify(code: number): TerrainClass {
  const plain = (kind: TerrainKind, label: string): TerrainClass => ({ kind, label, river: false, road: false, rail: false });
  if (code === 0x00) return plain('open', 'Open');
  if (code === 0x58) return plain('rough', 'Rough');
  if (code === 0x90 || code === 0x91) return plain('undefined', 'undefined');
  if (code === 0x92) return plain('mountain', 'Mountain');
  if (code === 0x93) return plain('urban', 'Urban');
  if (code === 0x94) return plain('offmap', 'Off Map');
  if (code === 0x8f) return plain('offmap', 'Map edge'); // black tile used only for the half hexes of row 65
  if (code >= 0xf4) return plain('reservoir', 'Reservoir');
  if (code >= 0xdb) return plain('estuary', 'Estuary');
  if (code >= 0xa5) return plain('ocean', 'Deep Ocean');
  let hit = CASCADE[0];
  for (const c of CASCADE) if (code >= c[0]) hit = c;
  return { kind: hit[5], label: hit[1], river: hit[2], road: hit[3], rail: hit[4] };
}

/** HEXSTUFF.ROAD_HEX: code in [0x0B..0x57] or [0x68..0x7C] (roads are ignored in 1950s storm turns). */
export function isRoadCode(code: number): boolean {
  return (code >= 0x0b && code <= 0x57) || (code >= 0x68 && code <= 0x7c);
}

/** EURSUBS1.CLOSED_TERRAIN */
export function isClosedTerrain(code: number): boolean {
  return (code >= 0x58 && code <= 0x8e) || code === 0x92;
}

export function roadMask(roads: Uint8Array, code: number): number {
  const i = code - 0x0b;
  return i >= 0 && i < roads.length ? roads[i] : 0;
}

export function railMask(rails: Uint8Array, code: number): number {
  const i = code - 0x1e;
  return i >= 0 && i < rails.length ? rails[i] : 0;
}

/** Map coordinates use flat-top hexes, even-q offset: even columns are shifted down by half a hex. */
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

// ---- Tile graphics ----
export const TILE_W = 40;
export const TILE_H = 18;

/** TACSUBS.DRAW_VGA_TOPTILE: codes >= 0xA5 come from the coast sheet; tiles are stacked 11 per column. */
export function tileOrigin(code: number): { sheet: 'hx' | 'chx'; sx: number; sy: number } {
  let t = code;
  let sheet: 'hx' | 'chx' = 'hx';
  if (t >= 0xa5) { sheet = 'chx'; t -= 0xa5; }
  return { sheet, sx: Math.floor(t / 11) * TILE_W, sy: (t % 11) * TILE_H };
}

/**
 * Detects which hexsides a colored line (river = palette index 9) touches in a 40x18 tile.
 * Border segments were calibrated against the ROADS table (26/26 road-only tiles match exactly).
 */
export function lineSides(sheet: IndexedImage, code: number, colors: number[]): number {
  const { sx, sy } = tileOrigin(code);
  const at = (x: number, y: number) => sheet.pixels[(sy + y) * sheet.width + sx + x];
  const any = (x0: number, x1: number, y0: number, y1: number) => {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (colors.includes(at(x, y))) return true;
    return false;
  };
  let m = 0;
  if (any(4, 35, 0, 0)) m |= 1; // N
  if (any(39, 39, 0, 7)) m |= 2; // NE
  if (any(39, 39, 8, 17)) m |= 4; // SE
  if (any(4, 35, 17, 17)) m |= 8; // S
  if (any(0, 0, 8, 17)) m |= 16; // SW
  if (any(0, 0, 0, 7)) m |= 32; // NW
  return m;
}

export const RIVER_COLOR = 9;
export const ROAD_COLORS = [10, 15];

// ---- Named places (from GET_TERRAIN, PORTS_AIRFIELDS_REPORT and the rulebook) ----
export interface Place { x: number; y: number; name: string; ko: string; only1995?: boolean; }

export const CITIES: Place[] = [
  { x: 7, y: 29, name: "P'yongYang", ko: '평양' },
  { x: 14, y: 40, name: 'Seoul', ko: '서울' },
  { x: 13, y: 59, name: 'Kwangju', ko: '광주' },
  { x: 17, y: 51, name: 'Taejon', ko: '대전' },
  { x: 24, y: 54, name: 'Taegu', ko: '대구' },
  { x: 26, y: 59, name: 'Pusan', ko: '부산' },
  { x: 17, y: 24, name: 'Hamhung/Hungnam', ko: '함흥·흥남' },
  { x: 13, y: 53, name: 'Kunsan/Iri', ko: '군산·이리', only1995: true },
  { x: 24, y: 59, name: "Masan/Ch'angwon", ko: '마산·창원', only1995: true },
  { x: 12, y: 41, name: "Inch'on", ko: '인천', only1995: true },
  { x: 13, y: 42, name: "Puch'on", ko: '부천', only1995: true },
  { x: 14, y: 42, name: 'Anyang/Suwon', ko: '안양·수원', only1995: true },
  { x: 14, y: 41, name: 'Seoul-South', ko: '서울 남부', only1995: true },
];

// PORTS[1..18] order; names from REPORTS.PORTS_AIRFIELDS_REPORT ("Kunsan" is printed separately).
export const PORT_NAMES: { name: string; ko: string }[] = [
  { name: "Namp'o", ko: '남포' }, { name: "Inch'on", ko: '인천' }, { name: 'Kunsan', ko: '군산' },
  { name: "Mokp'o", ko: '목포' }, { name: 'Yosu', ko: '여수' }, { name: 'Pusan', ko: '부산' },
  { name: 'Ulsan', ko: '울산' }, { name: 'Wonsan', ko: '원산' }, { name: 'Hungnam', ko: '흥남' },
  { name: "Sinp'o", ko: '신포' }, { name: "Ch'ongjin", ko: '청진' }, { name: 'Unggi', ko: '웅기' },
];

// AIRFIELDS[1..9] order (matches the report order and the rulebook coordinates).
export const AIRFIELD_NAMES: { name: string; ko: string; code?: string }[] = [
  { name: 'Taegu', ko: '대구', code: 'K-2' }, { name: 'Pohang', ko: '포항', code: 'K-3' },
  { name: 'Pusan East', ko: '부산 동부', code: 'K-9' }, { name: 'Chinhae', ko: '진해', code: 'K-10' },
  { name: 'Suwon', ko: '수원', code: 'K-13' }, { name: 'Kimpo', ko: '김포', code: 'K-14' },
  { name: 'Pusan', ko: '부산', code: 'K-1' }, { name: "P'yongYang", ko: '평양' },
  { name: 'Kunsan', ko: '군산', code: 'K-8' },
];

// Communist supply sources (rulebook 6.1; EURSUBS1.SUPPLY_POINTS is filled at runtime).
export const SUPPLY_POINTS: [number, number][] = [[0, 22], [2, 20], [7, 29], [9, 17], [14, 10], [29, 5], [33, 6]];

/** GET_TERRAIN appends " (Japan)" for open hexes at x = 33, y > 58. */
export function isJapan(x: number, y: number, code: number): boolean {
  return x === 33 && y > 58 && code === 0;
}
