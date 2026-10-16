// Sea and airborne movement tests against the extracted original data (docs/rules/naval.md).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { MapData, Scenario } from '../src/data/types.ts';
import { createGameState, idx, unit, forceUnits, forceHex, sideOf, POSSESSION_CODE, STATUS_MOVED } from '../src/engine/state.ts';
import type { GameState } from '../src/engine/state.ts';
import {
  pathTo, usedMove, allowance, cannotMove, oceanAdjacent, inPort, isDeepOcean, nationalMovementRate, stepCost,
} from '../src/engine/movement.ts';
import {
  seaMoveBlock, seaStartCost, seaReach, seaMove, seaAssaultPreview, seaAssault, airMoveBlock, airReach, airDrop,
  airdropLoss, airCanStop, defaultMode, MAX_SEA_ASSAULTS,
} from '../src/engine/naval.ts';
import { assaultTarget, cancelAssault, resolveGroundCombat, STATUS_BURIED } from '../src/engine/combat.ts';
import { neighbor } from '../src/engine/hex.ts';

const DATA = join(import.meta.dirname, '..', 'data', 'extracted');
const HAVE_DATA = existsSync(join(DATA, 'map.json'));
const map: MapData = HAVE_DATA ? JSON.parse(readFileSync(join(DATA, 'map.json'), 'utf8')) : (null as unknown as MapData);
const scenario = (id: string): Scenario => JSON.parse(readFileSync(join(DATA, 'scenarios', `${id}.json`), 'utf8'));
/** A game in the UN First Orders Phase. */
function unPhase(id: string, seed = 11): GameState {
  const g = createGameState(map, scenario(id), seed);
  g.phase = 1;
  g.player = 2;
  g.sky = 1; // clear: the base .dat files leave WEATHER uninitialised
  return g;
}
const opts = { skip: HAVE_DATA ? false : 'data/extracted missing (run tools/extract/extract.ts)' };
const xy = (g: GameState, i: number) => [i % g.width, Math.floor(i / g.width)] as [number, number];
const at = (g: GameState, x: number, y: number) => idx(g, x, y);

/** Put a unit alone at (x, y) (removing it from wherever it was). */
function place(g: GameState, id: number, x: number, y: number) {
  for (const s of g.stacks) { const k = s.indexOf(id); if (k >= 0) s.splice(k, 1); }
  const u = unit(g, id);
  u.attached = 0;
  u.x = x; u.y = y;
  u.status = 0;
  u.move = 0;
  g.stacks[idx(g, x, y)].push(id);
}

/** USMC force of Operation Chromite: 5th RCT + 1st RCT + tank battalion in the Japan port (33, 59). */
const MARINES = 212;
const INCHON: [number, number] = [12, 41];

test('who may move by sea (AMPHIBIOUS)', opts, () => {
  const g = unPhase('korea2');
  assert.equal(forceHex(g, MARINES), at(g, 33, 59));
  assert.equal(forceUnits(g, MARINES).length, 3);
  assert.equal(seaMoveBlock(g, MARINES), null);
  assert.equal(seaStartCost(g, 33, 59), 2, 'unmined port: 2 sealift points');
  assert.equal(defaultMode(g, MARINES), 'tactical');
  // Communist forces never move by sea
  assert.equal(seaMoveBlock(g, g.stacks[at(g, ...INCHON)][0]), 'notUn');
  // First Orders Phase only, not after moving, not on storm turns (unless already at sea), sealift left
  g.phase = 3; assert.equal(seaMoveBlock(g, MARINES), 'phase'); g.phase = 1;
  g.sky = 3; assert.equal(seaMoveBlock(g, MARINES), 'storm'); g.sky = 1;
  g.sealiftDemand = 3; assert.equal(seaMoveBlock(g, MARINES), 'sealift');
  g.sealiftDemand = 2; assert.equal(seaMoveBlock(g, MARINES), null); g.sealiftDemand = 0;
  unit(g, MARINES).status |= STATUS_MOVED; assert.equal(seaMoveBlock(g, MARINES), 'moved'); unit(g, MARINES).status &= ~STATUS_MOVED;
  // inland UN force
  const inland = g.stacks.flat().find((l) => sideOf(unit(g, l)) === 'un' && !oceanAdjacent(g, unit(g, l).x, unit(g, l).y) && !isDeepOcean(g.hexes[forceHex(g, l)].code));
  assert.ok(inland);
  assert.equal(seaMoveBlock(g, inland!), 'notCoastal');
  // a force at sea: storms do not stop it, and it can only be given sea orders
  place(g, 213, 11, 41);
  assert.ok(isDeepOcean(g.hexes[at(g, 11, 41)].code));
  g.sky = 3;
  assert.equal(seaMoveBlock(g, 213), null);
  assert.equal(seaStartCost(g, 11, 41), 0);
  assert.equal(cannotMove(g, 213), 'atSea');
  assert.equal(defaultMode(g, 213), 'sea');

  // 1995: one independent USMC unit per turn, and only while no sealift has been used
  const h = unPhase('korea4');
  place(h, 189, 26, 59); // USMC 3 Inf Rgt at Pusan
  assert.equal(seaMoveBlock(h, 189), null);
  h.sealiftDemand = 1;
  assert.equal(seaMoveBlock(h, 189), 'sealift1995');
  h.sealiftDemand = 0;
  const army = [...h.units.values()].find((u) => u.nation === 'US' && Math.trunc(u.symbol / 10) === 0)!;
  place(h, army.id, 28, 56);
  assert.equal(seaMoveBlock(h, army.id), 'usmcOnly');
});

test('sea reach: every deep ocean hex, landings next to the sea, no mined ports', opts, () => {
  const g = unPhase('korea2');
  const r = seaReach(g, MARINES);
  assert.equal(r.cannot, null);
  const nodes = [...r.nodes.values()].filter((n) => n.hex !== r.origin);
  const ocean = nodes.filter((n) => isDeepOcean(g.hexes[n.hex].code));
  const land = nodes.filter((n) => !isDeepOcean(g.hexes[n.hex].code));
  assert.ok(ocean.length > 500, 'any deep ocean hex, at any distance');
  assert.ok(ocean.every((n) => !n.canStop), 'a sea move cannot end at sea');
  assert.ok(land.length > 50 && land.every((n) => n.canStop && n.step.lands));
  for (const n of land) {
    const [x, y] = xy(g, n.hex);
    const p = n.prev;
    assert.ok(isDeepOcean(g.hexes[p].code), 'came ashore from a deep ocean hex');
    assert.ok([0, 1, 2, 3, 4, 5].some((d) => { const [nx, ny] = neighbor(x, y, d); return idx(g, nx, ny) === p; }));
    assert.deepEqual(pathTo(r, n.hex), [p, n.hex]);
  }
  // mined ports (korea2: Wonsan) and enemy-held coast
  assert.equal(g.ports.find((p) => p.x === 16 && p.y === 29)?.mined, true);
  assert.equal(r.nodes.has(at(g, 16, 29)), false);
  assert.equal(r.blocked.get(at(g, 16, 29)), 'mined');
  assert.equal(r.blocked.get(at(g, ...INCHON)), 'enemy');
  // land to land is not a sea move: from a coastal hex the force must put to sea first
  const [mx, my] = xy(g, r.origin);
  const besideLand = [0, 1, 2, 3, 4, 5].map((d) => neighbor(mx, my, d)).find(([nx, ny]) => !isDeepOcean(g.hexes[idx(g, nx, ny)].code) && g.hexes[idx(g, nx, ny)].code < 0x8f);
  if (besideLand) assert.equal(stepCost(g, MARINES, mx, my, besideLand[0], besideLand[1], 'sea').blocked, 'seaRoute');
});

test('sea move: sealift points, no readiness cost, capture, the move ends ashore', opts, () => {
  const g = unPhase('korea2');
  const members = forceUnits(g, MARINES);
  const ready = members.map((u) => u.readiness);
  const r = seaReach(g, MARINES);
  const target = at(g, 13, 42); // enemy-held beach south of Inchon
  assert.equal(g.possession[target], POSSESSION_CODE.communist);
  const res = seaMove(g, MARINES, pathTo(r, target)!);
  assert.ok(res.ok, res.error);
  assert.equal(res.sealift, 2);
  assert.equal(g.sealiftDemand, 2);
  assert.equal(res.undoable, false);
  assert.equal(forceHex(g, MARINES), target);
  assert.deepEqual(members.map((u) => u.readiness), ready, 'sea movement costs no readiness');
  for (const u of members) {
    assert.deepEqual([u.x, u.y], [13, 42]);
    assert.equal(usedMove(u.move), nationalMovementRate(g, unit(g, MARINES)));
    assert.ok(u.status & STATUS_MOVED);
  }
  assert.equal(g.possession[target], POSSESSION_CODE.un);
  assert.equal(allowance(g, MARINES).remaining, 0, 'no further movement after a sea move');
  assert.equal(seaMoveBlock(g, MARINES), 'moved');

  // landing in an unmined port gives a sealift point back (port to port = 1 point)
  const g2 = unPhase('korea2');
  const r2 = seaReach(g2, MARINES);
  const port = [...r2.nodes.values()].find((n) => n.canStop && inPort(g2, ...xy(g2, n.hex)));
  assert.ok(port, 'a friendly port to sail to');
  const res2 = seaMove(g2, MARINES, pathTo(r2, port!.hex)!);
  assert.ok(res2.ok, res2.error);
  assert.equal(res2.sealift, 1);
  assert.equal(g2.sealiftDemand, 1);

  // from a beach (no port): 3 points and bug-out losses for the leader unit only
  const g3 = unPhase('korea2');
  const beach = g3.stacks.flat().find((l) => {
    const u = unit(g3, l);
    return sideOf(u) === 'un' && forceUnits(g3, l).length > 1 && !inPort(g3, u.x, u.y) && seaMoveBlock(g3, l) === null;
  });
  assert.ok(beach, 'a UN force on a coastal non-port hex');
  const units = forceUnits(g3, beach!);
  for (const u of units) u.readiness = 90;
  const r3 = seaReach(g3, beach!);
  const dest = [...r3.nodes.values()].find((n) => n.canStop && !inPort(g3, ...xy(g3, n.hex)));
  const res3 = seaMove(g3, beach!, pathTo(r3, dest!.hex)!);
  assert.ok(res3.ok, res3.error);
  assert.equal(res3.sealift, 3);
  assert.equal(res3.beachLoss, true);
  assert.ok(units[0].readiness <= 50, 'BUGOUT caps the leader readiness at 50');
  assert.ok(units.slice(1).every((u) => u.readiness === 90), 'the other units are not hit (original code)');
  // 3 points used: a port start (2) no longer fits this turn
  assert.equal(seaMoveBlock(g3, MARINES), 'sealift');

  // the move cannot stop at sea, nor go ashore half way
  const g4 = unPhase('korea2');
  const r4 = seaReach(g4, MARINES);
  const sea = [...r4.nodes.values()].find((n) => n.hex !== r4.origin && !n.canStop)!;
  assert.equal(seaMove(g4, MARINES, [sea.hex]).error, 'cannotStop');
  assert.equal(g4.sealiftDemand, 0, 'a rejected order costs nothing');
});

test('assault from the sea: overrun or plot, two per turn, no cancelling', opts, () => {
  const seen = new Map<string, GameState>();
  for (let seed = 1; seed <= 40 && seen.size < 2; seed++) {
    const g = unPhase('korea2', seed);
    const pv = seaAssaultPreview(g, MARINES, ...INCHON);
    assert.ok(pv.allowed, pv.error);
    assert.ok(pv.overrun?.possible, 'the Inchon garrison is weak enough to be overrun (50%)');
    assert.ok(isDeepOcean(g.hexes[pv.from].code));
    const out = seaAssault(g, MARINES, ...INCHON);
    assert.ok(out.ok, out.error);
    if (!seen.has(out.result!)) seen.set(out.result!, g);
  }
  const over = seen.get('overrun')!;
  assert.ok(over, 'overrun happens');
  assert.equal(forceHex(over, MARINES), at(over, ...INCHON));
  assert.equal(over.possession[at(over, ...INCHON)], POSSESSION_CODE.un);
  assert.deepEqual(over.stacks[at(over, ...INCHON)], [MARINES]);
  assert.equal(over.utility[9], 0, 'an overrun is not an assault order');

  const plot = seen.get('plotted')!;
  assert.ok(plot, 'otherwise an assault order from the sea');
  const from = forceHex(plot, MARINES);
  assert.ok(isDeepOcean(plot.hexes[from].code), 'the force waits at sea');
  assert.deepEqual(assaultTarget(plot, MARINES), INCHON);
  const lead = unit(plot, MARINES);
  assert.equal(usedMove(lead.move) >= nationalMovementRate(plot, lead), true, 'no movement left');
  assert.ok(forceUnits(plot, MARINES).every((u) => u.move === lead.move));
  assert.equal(plot.utility[9], 1);
  assert.equal(cancelAssault(plot, MARINES), false, 'assaults from the sea cannot be cancelled');

  // third assault order of the turn: only an overrun can still land the force
  const g = unPhase('korea2', 3);
  g.utility[9] = MAX_SEA_ASSAULTS;
  const pv = seaAssaultPreview(g, MARINES, ...INCHON);
  assert.equal(pv.allowed, true);
  assert.equal(pv.canPlot, false);
  const strong = unPhase('korea2', 3);
  strong.utility[9] = MAX_SEA_ASSAULTS;
  const defender = unit(strong, strong.stacks[at(strong, ...INCHON)][0]);
  for (const e of defender.equipment) e.assigned = Math.max(e.assigned, 60);
  const pv2 = seaAssaultPreview(strong, MARINES, ...INCHON);
  assert.equal(pv2.overrun?.possible, false);
  assert.equal(pv2.allowed, false);
  assert.equal(pv2.error, 'seaAssaultLimit');
});

test('seaborne assault in the combat phase: advance, or bug-out and back to Japan', opts, () => {
  // weak defender: the defenders retreat (or die) and the marines always advance from the sea
  let advanced = false;
  for (let seed = 1; seed <= 40 && !advanced; seed++) {
    const g = unPhase('korea2', seed);
    if (seaAssault(g, MARINES, ...INCHON).result !== 'plotted') continue;
    const reports = resolveGroundCombat(g);
    const rep = reports.find((r) => r.target[0] === INCHON[0] && r.target[1] === INCHON[1])!;
    assert.ok(rep);
    if (g.stacks[at(g, ...INCHON)].includes(MARINES)) {
      advanced = true;
      assert.ok(rep.events.some((e) => e.kind === 'advance' && e.leader === MARINES));
      assert.equal(g.possession[at(g, ...INCHON)], POSSESSION_CODE.un);
    }
  }
  assert.ok(advanced);

  // strong defender that holds: the force suffers bug-out losses and is shipped to Japan
  let evacuated = false;
  for (let seed = 1; seed <= 60 && !evacuated; seed++) {
    const g = unPhase('korea2', seed);
    const d = unit(g, g.stacks[at(g, ...INCHON)][0]);
    for (const e of d.equipment) e.assigned = Math.max(e.assigned, 80);
    d.experience = 3;
    if (seaAssault(g, MARINES, ...INCHON).result !== 'plotted') continue;
    for (const u of forceUnits(g, MARINES)) u.readiness = 100;
    const rep = resolveGroundCombat(g).find((r) => r.target[0] === INCHON[0] && r.target[1] === INCHON[1])!;
    if (rep.retreated) continue;
    evacuated = true;
    const ev = rep.events.find((e) => e.kind === 'evacuated');
    assert.ok(ev && ev.kind === 'evacuated');
    const [ex, ey] = ev.to;
    assert.equal(ex, 33);
    assert.ok(ey >= 59 && ey <= 64);
    assert.equal(forceHex(g, MARINES), at(g, ex, ey));
    for (const u of forceUnits(g, MARINES)) {
      assert.deepEqual([u.x, u.y], [ex, ey]);
      assert.ok(u.readiness <= 50, 'every unit bugs out');
    }
  }
  assert.ok(evacuated);
});

test('airborne movement: the 187th RCT, drop losses, a drop on enemy forces destroys it', opts, () => {
  const AB = 221;
  const g = unPhase('korea3');
  g.redAir = 10;
  assert.deepEqual([unit(g, AB).x, unit(g, AB).y], [7, 29], 'at the P\'yongyang airfield');
  assert.equal(airMoveBlock(g, AB), null);
  g.phase = 3; assert.equal(airMoveBlock(g, AB), null, 'UNIT_COCKED has no phase check'); g.phase = 1;
  g.sky = 3; assert.equal(airMoveBlock(g, AB), 'storm'); g.sky = 1;
  unit(g, AB).status |= STATUS_MOVED; assert.equal(airMoveBlock(g, AB), 'moved'); unit(g, AB).status &= ~STATUS_MOVED;
  unit(g, AB).attached = 220; assert.equal(airMoveBlock(g, AB), 'notAlone'); unit(g, AB).attached = 0;
  assert.equal(airMoveBlock(unPhase('korea4'), 201), 'notOnMap');

  // loss ratios: open/urban 5, rough 10, mountain 25, +5 cloudy, + CIL in MiG Alley, 0 on a friendly airfield
  const find = (pred: (c: number, x: number, y: number) => boolean) => {
    for (let i = 0; i < g.hexes.length; i++) { const [x, y] = xy(g, i); if (x > 1 && pred(g.hexes[i].code, x, y)) return [x, y] as [number, number]; }
    throw new Error('no hex');
  };
  const open = find((c, x, y) => c === 0 && (x > 14 || y > 26));
  const rough = find((c, x, y) => c === 0x58 && (x > 14 || y > 26));
  const mountain = find((c, x, y) => c === 0x92 && (x > 14 || y > 26));
  const migOpen = find((c, x, y) => c === 0 && x <= 14 && y <= 26);
  assert.equal(airdropLoss(g, ...open, 0), 5);
  assert.equal(airdropLoss(g, ...rough, 0), 10);
  assert.equal(airdropLoss(g, ...mountain, 0), 25);
  assert.equal(airdropLoss(g, ...migOpen, 0), 5 + 10);
  g.sky = 2; assert.equal(airdropLoss(g, ...open, 0), 10); g.sky = 1;
  const af = g.airfields.find((a) => g.possession[idx(g, a.x, a.y)] === POSSESSION_CODE.un && !(a.x === 7 && a.y === 29))!;
  assert.equal(airdropLoss(g, af.x, af.y), 0);
  assert.equal(airCanStop(g, at(g, 11, 41)), false, 'no drop into the sea');

  // reach: every land hex; drop into empty enemy territory
  const r = airReach(g, AB);
  assert.ok([...r.nodes.values()].filter((n) => n.canStop).length > 800);
  const enemyHex = g.possession.findIndex((p, i) => {
    const [x, y] = xy(g, i);
    return p === POSSESSION_CODE.communist && !g.stacks[i].length && g.hexes[i].code < 0x58 && (x > 14 || y > 26) && x > 1;
  });
  assert.ok(enemyHex >= 0);
  const airlift = g.airliftDemand;
  const res = airDrop(g, AB, enemyHex);
  assert.ok(res.ok, res.error);
  assert.equal(res.destroyed, undefined);
  assert.equal(res.dropLoss, 5);
  assert.equal(g.airliftDemand, airlift + 2);
  assert.equal(forceHex(g, AB), enemyHex);
  assert.equal(g.possession[enemyHex], POSSESSION_CODE.un);
  assert.equal(unit(g, AB).move, 24);
  assert.equal(cannotMove(g, AB), 'noAllowance');
  assert.ok(unit(g, AB).status & STATUS_MOVED);
  assert.notEqual(airMoveBlock(g, AB), null);

  // onto enemy forces: OVERRUN with the allowance already spent always fails, the unit is lost
  const h = unPhase('korea3');
  const occupied = h.stacks.findIndex((s, i) => s.length > 0 && h.possession[i] === POSSESSION_CODE.communist && h.hexes[i].code < 0xa5);
  const before = h.stacks[occupied].slice();
  const res2 = airDrop(h, AB, occupied);
  assert.ok(res2.ok);
  assert.equal(res2.destroyed, true);
  assert.equal(forceHex(h, AB), -1);
  assert.ok(unit(h, AB).status & STATUS_BURIED);
  assert.deepEqual(h.stacks[occupied], before, 'the defenders are untouched');
  assert.equal(h.possession[occupied], POSSESSION_CODE.communist);
});
