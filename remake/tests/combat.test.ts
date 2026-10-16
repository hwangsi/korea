// Ground combat engine tests against the extracted original data.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { MapData, Scenario } from '../src/data/types.ts';
import { createGameState, idx, unit, forceUnits, forceHex, sideOf, POSSESSION_CODE } from '../src/engine/state.ts';
import type { GameState } from '../src/engine/state.ts';
import {
  unitStrength, lossRatios, assault, assaultPreview, assaultTarget, cancelAssault, resolveGroundCombat, overrunCheck,
  checkElim, retreatHexes, directionCode, decodeDirection, STATUS_BURIED,
} from '../src/engine/combat.ts';
import { usedMove, allowance } from '../src/engine/movement.ts';
import { neighbor } from '../src/engine/hex.ts';

const DATA = join(import.meta.dirname, '..', 'data', 'extracted');
const HAVE_DATA = existsSync(join(DATA, 'map.json'));
const map: MapData = HAVE_DATA ? JSON.parse(readFileSync(join(DATA, 'map.json'), 'utf8')) : (null as unknown as MapData);
const load = (id: string, seed = 7) => createGameState(map, JSON.parse(readFileSync(join(DATA, 'scenarios', `${id}.json`), 'utf8')) as Scenario, seed);
const opts = { skip: HAVE_DATA ? false : 'data/extracted missing (run tools/extract/extract.ts)' };

/** Pairs of adjacent hostile forces: [attacker leader, its hex, defender hex]. */
function frontPairs(g: GameState, side: 'un' | 'communist'): [number, number, number][] {
  const out: [number, number, number][] = [];
  g.stacks.forEach((s, i) => {
    for (const l of s) {
      if (sideOf(unit(g, l)) !== side) continue;
      const x = i % g.width, y = Math.floor(i / g.width);
      for (let d = 0; d < 6; d++) {
        const [nx, ny] = neighbor(x, y, d);
        if (nx < 0 || ny < 0 || nx >= g.width || ny >= g.height) continue;
        const j = idx(g, nx, ny);
        if (g.stacks[j].length && sideOf(unit(g, g.stacks[j][0])) !== side) out.push([l, i, j]);
      }
    }
  });
  return out;
}

test('direction code round trip (MOVE hundreds digit)', () => {
  for (const [sx, sy] of [[10, 20], [11, 20]]) {
    for (let d = 0; d < 6; d++) {
      const [tx, ty] = neighbor(sx, sy, d);
      const c = directionCode(sx, sy, tx, ty);
      assert.ok(c >= 1 && c <= 9);
      assert.deepEqual(decodeDirection(c), [tx - sx, ty - sy]);
    }
  }
});

test('unit strength follows GET_STRENGTH (Appendix F example)', opts, () => {
  const g = load('korea1');
  const u = [...g.units.values()].find((v) => v.name.trim() === 'NKPA 50/15 Inf Rgt')!;
  assert.ok(u);
  u.readiness = 100; u.experience = 1; u.status = 0;
  assert.deepEqual(unitStrength(g, u, 0, 0, 0), { L: 418, S: 234 });
  // 85% readiness, seasoned, defending rough terrain: soft survivability x2, per-slot rounding as coded
  u.readiness = 85; u.experience = 2;
  const rough = g.hexes.find((h) => h.code === 0x58)!;
  const s = unitStrength(g, u, rough.x, rough.y, 2);
  assert.equal(s.S, 472); // manual rounds differently and prints 475
  u.status = 0x40; // entrenched
  assert.equal(unitStrength(g, u, rough.x, rough.y, 2).S, Math.trunc((5 * 472) / 2));
  g.competence = 5; // Hideous: communists x1.2
  u.status = 0;
  assert.equal(unitStrength(g, u, rough.x, rough.y, 2).S, 472 + Math.trunc(472 / 10) * 2);
});

test('loss ratios: 15% x lethality / survivability, clamped 1..100', opts, () => {
  const g = load('korea1');
  assert.deepEqual(lossRatios(g, 1000, 100, 200, 100), [3, 15]);
  assert.deepEqual(lossRatios(g, 100000, 10, 0, 100), [1, 100]);
  const g95 = load('korea4');
  assert.deepEqual(lossRatios(g95, 1000, 100, 200, 100), [6, 30]); // 1995 turn 0: x2
});

test('assault orders: plot costs 6, cancel refunds 5, combat clears the plot', opts, () => {
  const g = load('korea1');
  const pairs = frontPairs(g, 'communist');
  const [leader, from, to] = pairs.find(([l, , j]) => {
    const tx = j % g.width, ty = Math.floor(j / g.width);
    const pv = assaultPreview(g, l, tx, ty);
    return pv.allowed && !(pv.overrun && pv.overrun.possible);
  })!;
  assert.ok(leader, 'a communist force next to the front that can plot without an overrun');
  const tx = to % g.width, ty = Math.floor(to / g.width);
  const before = usedMove(unit(g, leader).move);
  const res = assault(g, leader, tx, ty);
  assert.ok(res.ok, String(res.error));
  assert.equal(res.result, 'plotted');
  assert.deepEqual(assaultTarget(g, leader), [tx, ty]);
  assert.equal(usedMove(unit(g, leader).move), before + 6);
  assert.ok(cancelAssault(g, leader));
  assert.equal(unit(g, leader).move, before + 1);
  assert.equal(assaultTarget(g, leader), null);
  // plot again and resolve
  assert.equal(assault(g, leader, tx, ty).result, 'plotted');
  const equipBefore = forceUnits(g, leader).map((u) => u.equipment.reduce((a, e) => a + e.assigned, 0));
  const reports = resolveGroundCombat(g);
  const rep = reports.find((r) => r.target[0] === tx && r.target[1] === ty);
  assert.ok(rep, 'combat report for the target');
  assert.ok(rep.attackerLoss >= 1 && rep.defenderLoss >= 1);
  for (const [k, u] of forceUnits(g, leader).entries()) {
    assert.ok(u.move < 100, 'plot cleared');
    if (u.status & STATUS_BURIED) continue;
    assert.ok(u.readiness >= 50 && u.readiness <= 100);
    assert.ok(u.equipment.reduce((a, e) => a + e.assigned, 0) <= equipBefore[k]);
  }
  assert.ok(from >= 0);
});

test('overrun: overwhelming force destroys a token defender and moves in', opts, () => {
  const g = load('korea1');
  const pairs = frontPairs(g, 'communist');
  const [leader, , to] = pairs[0];
  const tx = to % g.width, ty = Math.floor(to / g.width);
  // shrink the defenders to a token presence
  for (const d of g.stacks[to]) for (const u of forceUnits(g, d)) for (const e of u.equipment) e.assigned = e.assigned ? 1 : 0;
  const lead = unit(g, leader);
  lead.move = 0;
  const at = forceHex(g, leader);
  const ov = overrunCheck(g, leader, at % g.width, Math.floor(at / g.width), tx, ty);
  assert.ok(ov.strongEnough, `ratios ${ov.r1} / ${ov.r2}`);
  // the 50% roll: retry from fresh copies until it succeeds (seeded, deterministic)
  let won = false;
  for (let seed = 1; seed < 20 && !won; seed++) {
    const h = load('korea1', seed);
    for (const d of h.stacks[to]) for (const u of forceUnits(h, d)) for (const e of u.equipment) e.assigned = e.assigned ? 1 : 0;
    unit(h, leader).move = 0;
    const defenders = h.stacks[to].flatMap((d) => forceUnits(h, d).map((u) => u.id));
    const r = assault(h, leader, tx, ty);
    if (r.result !== 'overrun') continue;
    won = true;
    assert.equal(forceHex(h, leader), to);
    assert.equal(h.possession[to], POSSESSION_CODE.communist);
    for (const id of defenders) assert.equal(unit(h, id).status, STATUS_BURIED);
    assert.ok(allowance(h, leader).used > 0);
  }
  assert.ok(won, 'overrun succeeded for some seed');
});

test('elimination hands the force to the next unit; retreat rules', opts, () => {
  const g = load('korea1');
  const leader = g.stacks.flat().find((l) => forceUnits(g, l).length >= 2)!;
  const at = forceHex(g, leader);
  const second = unit(g, leader).attached;
  for (const e of unit(g, leader).equipment) e.assigned = 0;
  checkElim(g, leader);
  assert.equal(unit(g, leader).status, STATUS_BURIED);
  assert.ok(g.stacks[at].includes(second), 'next unit leads the force');
  // UN forces retreat only into friendly hexes
  for (const l of g.stacks.flat()) {
    const u = unit(g, l);
    if (sideOf(u) !== 'un') continue;
    for (const [nx, ny] of retreatHexes(g, l)) assert.equal(g.possession[idx(g, nx, ny)], POSSESSION_CODE.un);
  }
});
