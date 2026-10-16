// Spotting updates made by the original movement and combat code (docs/rules/intel.md 3). Pure logic (no DOM).
// Kept free of movement / combat imports so both can use it.
//
//   chekHex             EURSUBS1.CHEK_HEX 32D3 (+ nested 3222 / 3123), called by MOVE_UNIT 2DE9 for every hex a force
//                       enters by tactical movement: unspotted neighbours of another possession holding forces -> 1
//   nearUnspottedEnemy  MOVEUNIT.NEAR_THE_FRONT(x, y, -PLAYER) 038C: a land neighbour held by the enemy, spotting 0
//   communistRecon      MOVE_UNIT 3A01..3A53: a Communist force that has used more than 12 MP may be spotted
//   raiseAround         GRCMBT 14B3: after a retreat every neighbour of another possession gains a level (below 2)

import { neighbor } from './hex.ts';
import type { GameState, Side, UnitState } from './state.ts';
import { POSSESSION_CODE, enemyOf, idx, onMap, rnd } from './state.ts';

const inBounds = (g: GameState, x: number, y: number) => x >= 0 && y >= 0 && x < g.width && y < g.height;

/**
 * CHEK_HEX: every neighbour of (x, y) that holds forces, is unspotted and has a possession different from
 * (x, y) becomes spotting level 1. Returns the hexes spotted now.
 */
export function chekHex(g: GameState, x: number, y: number): number[] {
  const out: number[] = [];
  const p = g.possession[idx(g, x, y)];
  for (let d = 0; d < 6; d++) {
    const [nx, ny] = neighbor(x, y, d);
    if (!inBounds(g, nx, ny)) continue;
    const ni = idx(g, nx, ny);
    if (g.spotted[ni] !== 0 || g.possession[ni] === p || g.stacks[ni].length === 0) continue;
    g.spotted[ni] = 1;
    out.push(ni);
  }
  return out;
}

/** NEAR_THE_FRONT with a negative player: a land neighbour held by the enemy of `side` with spotting level 0. */
export function nearUnspottedEnemy(g: GameState, x: number, y: number, side: Side): boolean {
  const enemy = POSSESSION_CODE[enemyOf(side)];
  for (let d = 0; d < 6; d++) {
    const [nx, ny] = neighbor(x, y, d);
    if (!onMap(g, nx, ny)) continue;
    const ni = idx(g, nx, ny);
    if (g.hexes[ni].code >= 0xa5) continue;
    if (g.possession[ni] === enemy && g.spotted[ni] === 0) return true;
  }
  return false;
}

/**
 * MOVE_UNIT 3A01: after a step, a Communist leader (id < FIRSTUNUNIT) whose MOVE is above 12 is spotted in the
 * hex it entered when RND(1,4) > sky (clear 75%, cloudy 50%, storm 25%: manual 6.32). Rolls even with complete
 * intelligence, as the original does.
 */
export function communistRecon(g: GameState, lead: UnitState, hex: number) {
  if (lead.id >= g.firstUnUnit || lead.move <= 12) return;
  if (g.sky < rnd(g, 1, 4)) g.spotted[hex] = Math.min(2, g.spotted[hex] + 1);
}

/** GRCMBT 14B3: neighbours of (x, y) with another possession and spotting below 2 gain one level. */
export function raiseAround(g: GameState, x: number, y: number) {
  const p = g.possession[idx(g, x, y)];
  for (let d = 0; d < 6; d++) {
    const [nx, ny] = neighbor(x, y, d);
    if (!onMap(g, nx, ny)) continue;
    const ni = idx(g, nx, ny);
    if (g.possession[ni] !== p && g.spotted[ni] < 2) g.spotted[ni]++;
  }
}
