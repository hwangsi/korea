// Intelligence (fog of war): what one side knows about the other side's forces (docs/rules/intel.md 2).
// Pure logic (no DOM). The spotting levels themselves are kept up to date by the turn, movement, combat and air
// code (spotting.ts and docs/rules/intel.md 3); this module only reads them.
//
//   viewerSide      EURSUBS1.SHOW_HEX 073E: the human player's view during the computer's phase, else PLAYER's
//   forceIntel      SHOW_HEX 0B92..0BFA (which forces are drawn) + HEXSTUFF.UNIT_INFORMATION 0D86 (enemy hex report)
//   strengthReport  UNIT_INFORMATION 1105..11C4: mode 3 against mode 0 lethality, swapped by STATUS 0x10
//   misreported     GET_STRENGTH mode 3 1D4E (STATUS 0x20 / 0x10); the remake decides it without the game RNG
//   perceivedState  remake: the game as the viewer knows it (hidden enemy forces removed), for move previews

import type { GameState, Side } from './state.ts';
import { POSSESSION_CODE, PLAYER_SIDE, enemyOf, unit, sideOf, forceHex } from './state.ts';
import { forceStrength } from './combat.ts';

/** 0 nothing known, 1 force type, 2 force type, name and strength report (manual 6.32). */
export type IntelLevel = 0 | 1 | 2;

/** STATUS 0x20: the strength report of this turn is decided (GET_STRENGTH mode 3, or the force fought). */
export const STATUS_REPORTED = 0x20;
/** STATUS 0x10: this turn's strength report is false (an understrength force looks full strength). */
export const STATUS_FALSE_REPORT = 0x10;

/** Limited intelligence (REALITY[4]) and the game is still on (GAME_OVER spots everything). */
export function fogActive(g: GameState): boolean {
  return g.limitedIntel && !g.gameOver;
}

/** Side whose view the screen shows. */
export function viewerSide(g: GameState): Side {
  if (g.computerSide === 1) return 'un';
  if (g.computerSide === 2) return 'communist';
  if (g.phase === 2 && g.air) {
    const p = g.air.players[g.air.index];
    if (p) return PLAYER_SIDE[p];
  }
  return PLAYER_SIDE[g.player];
}

/**
 * What `viewer` knows about the force led by `leader`. Own forces and complete intelligence: 2. Enemy forces are
 * hidden (0) only in an unspotted hex held by their own side, as SHOW_HEX does; a hex held by the viewer gives
 * the full report (UNIT_INFORMATION), any other drawn force counts as level 1 at least.
 */
export function forceIntel(g: GameState, viewer: Side, leader: number): IntelLevel {
  const lead = g.units.get(leader);
  if (!lead) return 0;
  const side = sideOf(lead);
  if (side === viewer || !fogActive(g)) return 2;
  const i = forceHex(g, leader);
  if (i < 0) return 0;
  const p = g.possession[i];
  if (p === POSSESSION_CODE[viewer]) return 2;
  const s = g.spotted[i];
  if (s > 0) return s >= 2 ? 2 : 1;
  return p === POSSESSION_CODE[side] ? 0 : 1;
}

export interface KnownForce { leader: number; level: IntelLevel; }

/** Forces of a hex the viewer knows about (level 1 or 2), in TERRAIN byte order. */
export function knownForces(g: GameState, viewer: Side, hex: number): KnownForce[] {
  const out: KnownForce[] = [];
  for (const leader of g.stacks[hex] ?? []) {
    const level = forceIntel(g, viewer, leader);
    if (level > 0) out.push({ leader, level });
  }
  return out;
}

/** The viewer can see enemy forces in the hex. */
export function knownEnemyAt(g: GameState, viewer: Side, hex: number): boolean {
  return knownForces(g, viewer, hex).some((f) => sideOf(unit(g, f.leader)) !== viewer);
}

/** Spotting level of a hex as the viewer sees it: own hexes in full, the others by TERRAIN byte 2. */
export function hexIntel(g: GameState, viewer: Side, hex: number): IntelLevel {
  if (!fogActive(g) || g.possession[hex] === POSSESSION_CODE[viewer]) return 2;
  const s = g.spotted[hex];
  return s >= 2 ? 2 : s === 1 ? 1 : 0;
}

function mix(a: number): number {
  a = Math.imul(a ^ (a >>> 16), 0x45d9f3b);
  a = Math.imul(a ^ (a >>> 16), 0x45d9f3b);
  return (a ^ (a >>> 16)) >>> 0;
}

/**
 * STATUS 0x10 of the force leader. The original sets 0x20 the first time GET_STRENGTH mode 3 looks at a unit in a
 * turn and then 0x10 when RND(1,3) = 2; REST_UP clears both, ground combat sets 0x20 and clears 0x10. The remake
 * keeps a flag that is already decided and otherwise draws the same 1/3 from the game seed, the turn and the leader,
 * so looking at the map never changes the random sequence of the game.
 */
export function misreported(g: GameState, leader: number): boolean {
  const lead = unit(g, leader);
  if (lead.status & STATUS_REPORTED) return (lead.status & STATUS_FALSE_REPORT) !== 0;
  return mix(g.intelSeed ^ mix(g.turn * 4096 + leader)) % 3 === 1;
}

export type StrengthReport = 'full' | 'under';

/**
 * UNIT_INFORMATION's "understrength" / "full strength": twice the current lethality (mode 0) below the authorised
 * lethality (mode 3, full equipment and readiness). A false report swaps the two, so it always reads "full strength".
 */
export function strengthReport(g: GameState, leader: number): StrengthReport {
  const lead = unit(g, leader);
  let authorised = forceStrength(g, leader, lead.x, lead.y, 3).L;
  let current = forceStrength(g, leader, lead.x, lead.y, 0).L;
  if (misreported(g, leader)) [authorised, current] = [current, authorised];
  return 2 * current < authorised ? 'under' : 'full';
}

/**
 * The game state as `viewer` knows it: enemy forces it cannot see are taken out of the hex stacks. Shares
 * everything else with `g`, so it is for read-only previews (movement reach) only.
 */
export function perceivedState(g: GameState, viewer: Side): GameState {
  if (!fogActive(g)) return g;
  const stacks = g.stacks.map((s) => (s.length ? s.filter((l) => forceIntel(g, viewer, l) > 0) : s));
  return { ...g, stacks };
}

/**
 * Airborne drop warning from what the viewer knows: 'enemy' visible enemy forces in the hex (the drop destroys
 * the unit), 'unknown' unspotted enemy territory that may hide them, null otherwise.
 */
export function dropRisk(g: GameState, viewer: Side, hex: number): 'enemy' | 'unknown' | null {
  if (knownEnemyAt(g, viewer, hex)) return 'enemy';
  if (fogActive(g) && g.possession[hex] === POSSESSION_CODE[enemyOf(viewer)] && hexIntel(g, viewer, hex) === 0) return 'unknown';
  return null;
}
