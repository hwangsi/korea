// Force organisation: the original FULL HEX REPORT (REPORTS.FULL_HEX 2C3C and its nested procedures 0A36..2C3B),
// reproduced from the code (docs/rules/forces.md). Pure logic (no DOM).
//
//   transferCheck / transferUnit   nested 232C (Xfer button): the permission test, then 218D (take a unit out of its
//                                  force), 2103 (append it to the other force), SORT_FORCE, the movement equalisation
//                                  and the Task Force Smith merge
//   renameForce                    nested 203D / 1EAA (force name NAME1, 20 characters, forces of two units or more)
//   forcePresence / hexModifiers   nested 0AAC and 196C ("Military Presence", "Geography")
//   nextOrganizeHex                nested 1CCA / 1D8F (+ Hex / - Hex)

import type { GameState, UnitState } from './state.ts';
import { POSSESSION_CODE, PLAYER_SIDE, idx, onMap, unit, forceUnits, sideOfId } from './state.ts';
import { nationalMovementRate, usedMove, frozen } from './movement.ts';
import { unitStrength, isClosed, isRiverCode, STATUS_BURIED } from './combat.ts';
import { sortForce } from './ai/common.ts';

/** NAME1 is a string[20]. */
export const FORCE_NAME_MAX = 20;
/** A force has room for six units (the screen has six rows per force); four of them infantry. */
export const MAX_FORCE_UNITS = 6;
export const MAX_FORCE_INFANTRY = 4;
/** Where the merged Task Force Smith is put (MAP_X 0, MAP_Y 2, STATUS 8): the scenario files use the same place. */
export const MERGED_X = 0;
export const MERGED_Y = 2;

const SEA = 0xa5;
const isInfantry = (u: UnitState) => u.symbol % 10 === 2;
/** Nested 22CF: Pos('Smith', NAME) > 0. */
export const isTaskForceSmith = (u: UnitState) => u.name.includes('Smith');
/** Nationality group of 232C: US, USMC, Commonwealth and other UN (0..3) are one group; ROK, NKPA and CPLA stand alone. */
const nationGroup = (u: UnitState) => { const n = Math.trunc(u.symbol / 10); return n <= 3 ? 0 : n; };

// ---------- who may open the screen ----------

export type OrganizeBlock = 'phase' | 'computer' | 'noForces' | 'notOwn';

/**
 * HEXSTUFF.UNIT_INFORMATION opens the hex menu ("Report" = FULL_HEX) in an orders phase for a hex with forces that the
 * player holds (TERRAIN byte 1 = 3 - PLAYER). The remake also requires the forces to be the player's own.
 */
export function organizeBlock(g: GameState, x: number, y: number): OrganizeBlock | null {
  if (g.gameOver || !(g.phase === 1 || g.phase === 3)) return 'phase';
  if (g.computerSide === g.player) return 'computer';
  if (!onMap(g, x, y)) return 'noForces';
  const i = idx(g, x, y);
  const s = g.stacks[i];
  if (!s.length) return 'noForces';
  const side = PLAYER_SIDE[g.player];
  if (g.possession[i] !== POSSESSION_CODE[side] || s.some((l) => sideOfId(g, l) !== side)) return 'notOwn';
  return null;
}

/** Nested 1CCA / 1D8F: the next hex (column by column, x then y, wrapping) with forces that the player holds. */
export function nextOrganizeHex(g: GameState, x: number, y: number, dir: 1 | -1): [number, number] {
  const code = POSSESSION_CODE[PLAYER_SIDE[g.player]];
  let sx = x, sy = y;
  for (;;) {
    if (dir > 0) {
      if (sy < 65) sy++;
      else { sy = 0; sx = sx < 33 ? sx + 1 : 0; }
    } else if (sy > 0) sy--;
    else { sy = 65; sx = sx > 0 ? sx - 1 : 33; }
    if (sx === x && sy === y) return [x, y];
    if (sx >= g.width || sy >= g.height) continue;
    const i = idx(g, sx, sy);
    if (g.stacks[i].length && g.possession[i] === code) return [sx, sy];
  }
}

// ---------- what the screen shows ----------

/** Units of the two force slots of a hex (TERRAIN bytes 3 and 4), leader first; an empty slot is []. */
export function hexSlots(g: GameState, x: number, y: number): [number[], number[]] {
  const s = g.stacks[idx(g, x, y)];
  const ids = (k: number) => (s[k] ? forceUnits(g, s[k]).map((u) => u.id) : []);
  return [ids(0), ids(1)];
}

export interface ForcePresence {
  /** GET_STRENGTH mode 0 summed over the force, shown div 10 like every strength of the original screens. */
  lethality: number;
  survivability: number;
  /** Average readiness (integer division). */
  readiness: number;
  /** NATIONAL_MOVEMENT_RATE(leader) - MASK(MOVE): the screen adds back the 5 reserved points of a plotted assault. */
  movement: number;
  assault: boolean;
}

/** Nested 0AAC ("Military Presence" of one force). */
export function forcePresence(g: GameState, leader: number, x: number, y: number): ForcePresence {
  const members = forceUnits(g, leader);
  let L = 0, S = 0, ready = 0;
  for (const u of members) {
    const s = unitStrength(g, u, x, y, 0);
    L += s.L; S += s.S; ready += u.readiness;
  }
  const lead = unit(g, leader);
  const assault = lead.move > 100;
  const left = nationalMovementRate(g, lead) - usedMove(lead.move);
  return {
    lethality: Math.trunc(L / 10), survivability: Math.trunc(S / 10), readiness: Math.trunc(ready / members.length),
    movement: assault ? left + 5 : left, assault,
  };
}

export interface HexModifiers {
  /** Attacker lethality from this hex (river, not frozen; artillery is exempt in GET_STRENGTH). */
  lethality: number;
  /** Defender survivability of hard equipment (vehicles, guns) and of soft equipment (rifle and weapons platoons). */
  hardSurvival: number;
  softSurvival: number;
}

/**
 * Nested 196C "Geography": the multipliers GET_STRENGTH uses for this hex. The original screen tests the river with
 * SY > FREEZE_LINE; the remake shows the combat rule itself (`frozen`, which keeps rivers next to the sea unfrozen
 * for five rows).
 */
export function hexModifiers(g: GameState, x: number, y: number): HexModifiers {
  const code = g.hexes[idx(g, x, y)].code;
  return {
    lethality: isRiverCode(code) && !frozen(g, x, y) ? 0.5 : 1,
    hardSurvival: code === 0x93 ? 2 : code === 0x92 ? 0.5 : 1,
    softSurvival: code === 0x93 ? 3 : isClosed(code) ? 2 : 1,
  };
}

// ---------- transfers (nested 232C) ----------

export type TransferBlock = 'atSea' | 'nationality' | 'full' | 'infantry' | 'assaultMove' | 'smithForce' | 'alone' | 'notHere';

export interface TransferCheck {
  allowed: boolean;
  /** Why not (the original only says "This transfer is not allowed!"). */
  reason: TransferBlock | null;
  /** Slot the unit is in and the slot it would go to. */
  from: 0 | 1;
  to: 0 | 1;
  /** split: a new force in the empty slot; join: appended to the other force; merge: Task Force Smith is absorbed. */
  kind: 'split' | 'join' | 'merge';
  /** join: movement points every unit of the receiving force loses so that the force moves together. */
  cost: number;
  /** join: the receiving force has a plotted assault, which the unit joins. */
  joinsAssault: boolean;
  /** join: the unit's own plotted assault is dropped (one point of it stays spent). */
  dropsAssault: boolean;
  /** merge: the infantry unit that takes Task Force Smith's platoons. */
  mergeInto: number;
}

function slotOf(g: GameState, x: number, y: number, id: number): { side: 0 | 1; slot: number } | null {
  const s = g.stacks[idx(g, x, y)];
  for (let side = 0; side < s.length && side < 2; side++) {
    const k = forceUnits(g, s[side]).findIndex((u) => u.id === id);
    if (k >= 0) return { side: side as 0 | 1, slot: k };
  }
  return null;
}

/** Movement values of the equalisation in 232C (2781..2886): the unit's MOVE and the receiving leader's MOVE. */
function equalise(um0: number, tm0: number): { cost: number; um: number; tm: number } {
  let um = um0;
  if (um > 100) um -= 5;
  if (tm0 > 100 && um < 100) um += 1;
  const tm = tm0 > 100 ? tm0 - 5 : tm0;
  return { um, tm, cost: Math.max(0, usedMove(um) - usedMove(tm)) };
}

/** The permission test of the Xfer button (232C, 2332..2601), with the effect the transfer would have. */
export function transferCheck(g: GameState, x: number, y: number, id: number): TransferCheck {
  const where = slotOf(g, x, y, id);
  const out: TransferCheck = {
    allowed: false, reason: null, from: where?.side ?? 0, to: where?.side === 1 ? 0 : 1, kind: 'split', cost: 0,
    joinsAssault: false, dropsAssault: false, mergeInto: 0,
  };
  if (!where) { out.reason = 'notHere'; return out; }
  const s = g.stacks[idx(g, x, y)];
  const u = unit(g, id);
  const tl = s[out.to] ?? 0;
  let allowed = false;
  let reason: TransferBlock | null = null;
  let infantry = 0;
  if (tl > 0) {
    out.kind = 'join';
    if (nationGroup(unit(g, s[0])) === nationGroup(unit(g, s[1]))) {
      const target = forceUnits(g, tl);
      infantry = target.filter(isInfantry).length;
      if (target.length >= MAX_FORCE_UNITS || (infantry >= MAX_FORCE_INFANTRY && isInfantry(u))) {
        if (isTaskForceSmith(u) && infantry > 0) allowed = true;
        else reason = target.length >= MAX_FORCE_UNITS ? 'full' : 'infantry';
      } else allowed = true;
    } else reason = 'nationality';
    const lead = unit(g, tl);
    if (allowed && lead.move > 100) {
      // joining a force with a plotted assault: the six points a plot needs, unless the unit has plotted one too
      // and has spent at least as much as the force (sic)
      if (nationalMovementRate(g, u) - usedMove(u.move) < 6) { allowed = false; reason = 'assaultMove'; }
      if (u.move > 100 && usedMove(u.move) >= usedMove(lead.move)) { allowed = true; reason = null; }
    }
    if (isTaskForceSmith(lead)) { allowed = false; reason = 'smithForce'; }
    if (allowed && isTaskForceSmith(u) && infantry > 0) {
      out.kind = 'merge';
      out.mergeInto = forceUnits(g, tl).find(isInfantry)!.id;
    } else if (allowed) {
      const e = equalise(u.move, lead.move);
      out.cost = e.cost;
      out.joinsAssault = lead.move > 100;
      out.dropsAssault = u.move > 100 && lead.move <= 100;
    }
  } else {
    allowed = true;
    // remake: a lone unit of the only force would just become its own force again (the original only renames it)
    if (forceUnits(g, s[out.from]).length === 1) { allowed = false; reason = 'alone'; }
  }
  if (g.hexes[idx(g, x, y)].code >= SEA) { allowed = false; reason = 'atSea'; }
  out.allowed = allowed;
  out.reason = allowed ? null : reason;
  return out;
}

export interface TransferResult extends TransferCheck {
  ok: boolean;
  /** Leaders of the two slots afterwards. */
  leaders: number[];
}

/** Nested 218D: take unit `id` out of the force in `slot`; it gets the name "<unit name>+" and stands alone. */
function detach(g: GameState, x: number, y: number, slot: number, id: number) {
  const s = g.stacks[idx(g, x, y)];
  const u = unit(g, id);
  if (s[slot] === id) s[slot] = u.attached;
  else {
    for (let p = s[slot]; p > 0; p = unit(g, p).attached) {
      const v = unit(g, p);
      if (v.attached === id) { v.attached = u.attached; break; }
    }
  }
  u.attached = 0;
  u.forceName = (u.name + '+').slice(0, FORCE_NAME_MAX);
  sortForce(g, x, y, slot);
}

/** Nested 2103: append unit `id` to the end of the force in `slot`, then SORT_FORCE. */
function append(g: GameState, x: number, y: number, slot: number, id: number) {
  const s = g.stacks[idx(g, x, y)];
  let last = s[slot];
  while (unit(g, last).attached !== 0) last = unit(g, last).attached;
  unit(g, last).attached = id;
  sortForce(g, x, y, slot);
}

/**
 * The Xfer button (232C): move unit `id` to the other force of its hex, or into a new force when the hex has only
 * one. The game state is changed only when `transferCheck` allows it.
 */
export function transferUnit(g: GameState, x: number, y: number, id: number): TransferResult {
  const check = transferCheck(g, x, y, id);
  const i = idx(g, x, y);
  if (!check.allowed) return { ...check, ok: false, leaders: g.stacks[i].slice() };
  const s = g.stacks[i];
  while (s.length < 2) s.push(0);
  const { from, to } = check;
  const u = unit(g, id);
  if (check.kind === 'merge') {
    // 2628: Task Force Smith's first two equipment counts go to the first infantry unit (byte adds), Smith is gone
    const inf = unit(g, check.mergeInto);
    for (let k = 0; k < 2; k++) {
      const a = inf.equipment[k], b = u.equipment[k];
      if (a && b) a.assigned = (a.assigned + b.assigned) & 0xff;
    }
    detach(g, x, y, from, id);
    u.x = MERGED_X; u.y = MERGED_Y;
    u.status = STATUS_BURIED;
  } else if (check.kind === 'split') {
    // 2720: the unit becomes the force of the empty slot
    detach(g, x, y, from, id);
    s[to] = id;
  } else {
    // 2781: join the other force and move with it
    detach(g, x, y, from, id);
    const tl = s[to];
    const e = equalise(u.move, unit(g, tl).move);
    u.move = unit(g, tl).move;
    append(g, x, y, to, id);
    if (e.cost > 0) for (const v of forceUnits(g, s[to])) v.move += e.cost;
  }
  // 2888: the first slot is never empty while the second holds a force
  g.stacks[i] = s.filter((l) => l > 0);
  // the movement undo snapshot only knows the moved force: it cannot be restored after the units changed hands
  g.undo = null;
  g.version++;
  return { ...check, ok: true, leaders: g.stacks[i].slice() };
}

// ---------- names (nested 203D / 1EAA) ----------

/** Only a force of two units or more has a force name (a lone unit shows its own name). */
export function canRename(g: GameState, leader: number): boolean {
  const u = g.units.get(leader);
  return !!u && u.attached > 0;
}

/** Nested 203D: the leader's NAME1, at most 20 characters, trailing blanks removed (GET_NAME + 1FE2). */
export function renameForce(g: GameState, leader: number, name: string): boolean {
  if (!canRename(g, leader)) return false;
  const text = name.slice(0, FORCE_NAME_MAX).replace(/\s+$/, '');
  unit(g, leader).forceName = text;
  // keep the name if the last move is undone afterwards
  const snap = g.undo?.snapshot.units.find(([uid]) => uid === leader);
  if (snap) snap[1].forceName = text;
  g.version++;
  return true;
}
