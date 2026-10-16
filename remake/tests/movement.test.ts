// Movement engine tests against the extracted original data (run tools/extract/extract.ts first).
//   node --test tests/
// Coordinates are looked up from the real map instead of being hard-coded where possible.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { MapData, Scenario } from '../src/data/types.ts';
import { createGameState, idx, unit, forceUnits, forceHex, sideOf, POSSESSION_CODE, STATUS_MOVED } from '../src/engine/state.ts';
import type { GameState } from '../src/engine/state.ts';
import {
  nationalMovementRate, stepCost, reach, pathTo, moveForce, undoMove, canEntrain, railMove, bugOut, canBugOut,
  turnStartMove, clearPlots, usedMove, enemyAdjacent, allowance, sideMask, frozen,
} from '../src/engine/movement.ts';
import { neighbor } from '../src/engine/hex.ts';

const DATA = join(import.meta.dirname, '..', 'data', 'extracted');
const HAVE_DATA = existsSync(join(DATA, 'map.json'));
const map: MapData = HAVE_DATA ? JSON.parse(readFileSync(join(DATA, 'map.json'), 'utf8')) : (null as unknown as MapData);
const scenario = (id: string): Scenario => JSON.parse(readFileSync(join(DATA, 'scenarios', `${id}.json`), 'utf8'));
const load = (id: string) => createGameState(map, scenario(id));
const opts = { skip: HAVE_DATA ? false : 'data/extracted missing (run tools/extract/extract.ts)' };

const xy = (g: GameState, i: number) => [i % g.width, Math.floor(i / g.width)] as [number, number];

/** All force leaders on the map. */
function leaders(g: GameState): number[] {
  return g.stacks.flat();
}

/** Put a single-unit test force of `id` alone at (x, y) (removing it from wherever it was). */
function place(g: GameState, id: number, x: number, y: number) {
  for (const s of g.stacks) { const k = s.indexOf(id); if (k >= 0) s.splice(k, 1); }
  const u = unit(g, id);
  u.attached = 0;
  u.x = x; u.y = y;
  g.stacks[idx(g, x, y)].push(id);
}

/** A hex where nothing is adjacent: no units within 2 hexes. */
function quiet(g: GameState, i: number): boolean {
  const [x, y] = xy(g, i);
  for (let dx = -2; dx <= 2; dx++) for (let dy = -3; dy <= 3; dy++) {
    const nx = x + dx, ny = y + dy;
    if (nx < 0 || ny < 0 || nx >= g.width || ny >= g.height) continue;
    if (g.stacks[idx(g, nx, ny)].length) return false;
  }
  return true;
}

/** Find an adjacent (from, to) pair matching the predicate, both quiet and friendly to `side`. */
function findPair(g: GameState, own: number, pred: (from: number, to: number, d: number) => boolean): [number, number] | null {
  for (let i = 0; i < g.hexes.length; i++) {
    const [x, y] = xy(g, i);
    if (g.possession[i] !== own || !quiet(g, i)) continue;
    for (let d = 0; d < 6; d++) {
      const [nx, ny] = neighbor(x, y, d);
      if (nx < 2 || ny < 2 || nx >= g.width || ny >= g.height) continue;
      const j = idx(g, nx, ny);
      if (g.possession[j] !== own) continue;
      if (pred(i, j, d)) return [i, j];
    }
  }
  return null;
}

test('hex adjacency equals the original DIST() == 1', () => {
  // EURSUBS1.DIST re-implemented from the disassembly
  const dist = (x1: number, y1: number, x2: number, y2: number) => {
    const dx = Math.abs(x1 - x2), dy = Math.abs(y1 - y2);
    const h = (a: number) => Math.trunc(a / 2);
    if (x1 === x2) return dy;
    const o1 = x1 & 1, o2 = x2 & 1;
    if (o1 === o2) return h(dx) < dy ? h(dx) + dy : dx;
    if ((o1 && y2 < y1) || (!o1 && y1 < y2)) return h(dx + 1) > dy ? dx : h(dx) + dy;
    return h(dx + 1) > dy ? dx : h(dx + 1) + dy;
  };
  for (let x = 0; x < 34; x++) for (let y = 0; y < 66; y++) {
    for (let x2 = x - 2; x2 <= x + 2; x2++) for (let y2 = y - 3; y2 <= y + 3; y2++) {
      assert.equal(dist(x, y, x2, y2) === 1, sideMask(x, y, x2, y2) !== 0, `${x},${y} -> ${x2},${y2}`);
    }
  }
});

test('national movement rates (NATIONAL_MOVEMENT_RATE)', () => {
  const g50 = { scenarioNo: 1 }, g95 = { scenarioNo: 4 };
  const rate = (g: { scenarioNo: number }, symbol: number) => nationalMovementRate(g, { symbol });
  assert.deepEqual([2, 12, 22, 32, 42, 52, 62].map((s) => rate(g50, s)), [24, 24, 24, 24, 18, 18, 12]);
  assert.deepEqual([2, 42, 52].map((s) => rate(g95, s)), [24, 24, 24]);
  assert.equal(rate(g50, 83), 98); // rail / sea / air: unlimited
  assert.equal(rate(g95, 81), 98);
});

test('MOVE field: plotted assaults (CLEAR_PLOTS, MASK)', () => {
  assert.equal(clearPlots(406), 1); // assault toward direction 4: 5 reserved + 1 spent
  assert.equal(clearPlots(815), 10); // 9 used before the assault
  assert.equal(clearPlots(12), 12);
  assert.equal(usedMove(815), 15);
});

test('start-of-turn allowance matches every force in the base scenarios', opts, () => {
  // korea1 is excluded: the designer gave six front-line ROK regiments (readiness 55-60) a full
  // allowance on turn 0 by hand (MOVE 0, STATUS 0x41); every other force matches REST_UP.
  for (const id of ['korea2', 'korea3', 'korea4']) {
    const g = load(id);
    for (const leader of leaders(g)) {
      const move = unit(g, leader).move;
      const ok = [true, false].map((s) => turnStartMove(g, leader, s));
      assert.ok(ok.includes(move), `${id} force ${leader} ${unit(g, leader).name}: MOVE ${move}, expected one of ${ok}`);
    }
  }
});

test('terrain costs on the real map (MOVE_COST)', opts, () => {
  const g = load('korea1');
  const own = POSSESSION_CODE.un;
  const us = 187; // a US unit, 24 MP
  assert.equal(sideOf(unit(g, us)), 'un');
  const cost = (from: number, to: number, id = us) => {
    const [fx, fy] = xy(g, from), [tx, ty] = xy(g, to);
    place(g, id, fx, fy);
    return stepCost(g, id, fx, fy, tx, ty);
  };
  const code = (i: number) => g.hexes[i].code;
  const cases: [string, (f: number, t: number, d: number) => boolean, number][] = [
    ['open', (_f, t) => code(t) === 0x00, 2],
    ['rough', (_f, t) => code(t) === 0x58, 3],
    ['mountain', (_f, t) => code(t) === 0x92, 4],
    ['urban', (_f, t) => code(t) === 0x93, 2],
    ['open road along the road', (f, t) => code(t) >= 0x10 && code(t) <= 0x1d && (g.hexes[t].road & sideMask(...xy(g, t), ...xy(g, f))) !== 0, 1],
    ['open road off the road', (f, t) => code(t) >= 0x10 && code(t) <= 0x1d && (g.hexes[t].road & sideMask(...xy(g, t), ...xy(g, f))) === 0, 2],
    ['rough road along the road', (f, t) => code(t) >= 0x71 && code(t) <= 0x7c && (g.hexes[t].road & sideMask(...xy(g, t), ...xy(g, f))) !== 0, 2],
    ['open river (unfrozen)', (_f, t) => code(t) >= 0x01 && code(t) <= 0x0a, 6],
    ['rough river (unfrozen)', (_f, t) => code(t) >= 0x59 && code(t) <= 0x66, 7],
    ['bridge (open road river, along road)', (f, t) => code(t) >= 0x0b && code(t) <= 0x0f && (g.hexes[t].road & sideMask(...xy(g, t), ...xy(g, f))) !== 0, 2],
  ];
  for (const [name, pred, expected] of cases) {
    const pair = findPair(g, own, pred);
    assert.ok(pair, `no example for ${name}`);
    const sc = cost(pair[0], pair[1]);
    assert.equal(sc.blocked, undefined, name);
    assert.equal(sc.cost, expected, `${name} at ${xy(g, pair[1])}`);
  }
  // CPLA: rough 3 -> 2, mountain 4 -> 3
  const cpla = 87;
  assert.equal(sideOf(unit(g, cpla)), 'communist');
  const red = POSSESSION_CODE.communist;
  for (const [c, expected] of [[0x58, 2], [0x92, 3]] as const) {
    const pair = findPair(g, red, (_f, t) => code(t) === c)!;
    assert.ok(pair, `no communist example for ${c}`);
    assert.equal(cost(pair[0], pair[1], cpla).cost, expected);
  }
});

test('weather and season: storm roads and rivers, refugees, frozen rivers', opts, () => {
  const g = load('korea1');
  const us = 187, nk = 1;
  const roadPair = findPair(g, POSSESSION_CODE.un, (f, t) => {
    const c = g.hexes[t].code;
    return c >= 0x10 && c <= 0x1d && (g.hexes[t].road & sideMask(...xy(g, t), ...xy(g, f))) !== 0;
  })!;
  const riverPair = findPair(g, POSSESSION_CODE.un, (_f, t) => g.hexes[t].code >= 0x01 && g.hexes[t].code <= 0x0a)!;
  const at = (pair: [number, number], id: number) => {
    const [fx, fy] = xy(g, pair[0]), [tx, ty] = xy(g, pair[1]);
    place(g, id, fx, fy);
    return stepCost(g, id, fx, fy, tx, ty).cost;
  };
  g.sky = 3; // storm
  assert.equal(at(roadPair, us), 2, 'roads are ignored in 1950s storms');
  assert.equal(at(riverPair, us), 2 + 6, 'storm river');
  g.sky = 1;
  g.refugees = true;
  assert.equal(at(roadPair, us), 2, 'refugees: UN cannot use roads');
  // communists still use the road (borrow the hex; possession does not matter for the road rule itself)
  g.possession[roadPair[0]] = g.possession[roadPair[1]] = POSSESSION_CODE.communist;
  assert.equal(at(roadPair, nk), 1, 'refugees do not affect communists');
  g.possession[roadPair[0]] = g.possession[roadPair[1]] = POSSESSION_CODE.un;
  g.refugees = false;
  const [, ry] = xy(g, riverPair[1]);
  g.freezeLine = ry + 10;
  assert.ok(frozen(g, ...xy(g, riverPair[1])));
  assert.equal(at(riverPair, us), 2, 'frozen river');
});

test('congestion, stacking, enemy territory, disengagement', opts, () => {
  const g = load('korea1');
  const us = 187, other1 = 190, other2 = 193;
  const landAround = (i: number) =>
    [0, 1, 2, 3, 4, 5].filter((d) => { const [nx, ny] = neighbor(...xy(g, i), d); return g.hexes[idx(g, nx, ny)]?.code < 0xa5; }).length;
  const pair = findPair(g, POSSESSION_CODE.un, (f, t) => g.hexes[t].code === 0x00 && landAround(f) === 6)!;
  const [fx, fy] = xy(g, pair[0]), [tx, ty] = xy(g, pair[1]);
  place(g, us, fx, fy);
  assert.equal(stepCost(g, us, fx, fy, tx, ty).cost, 2);
  place(g, other1, tx, ty);
  const c1 = stepCost(g, us, fx, fy, tx, ty);
  assert.equal(c1.cost, 3, 'congestion +1');
  assert.ok(c1.items.some((i) => i.kind === 'congestion'));
  place(g, other2, tx, ty);
  assert.equal(stepCost(g, us, fx, fy, tx, ty).blocked, 'stackFull');
  // enemy territory: flip the target
  g.stacks[pair[1]] = [];
  g.possession[pair[1]] = POSSESSION_CODE.communist;
  const c2 = stepCost(g, us, fx, fy, tx, ty);
  assert.equal(c2.cost, 3, 'enemy territory +1');
  assert.ok(c2.captures);
  g.possession[pair[1]] = POSSESSION_CODE.un;
  // disengagement: an enemy force next to the origin
  const [ex, ey] = (() => {
    for (let d = 0; d < 6; d++) {
      const [nx, ny] = neighbor(fx, fy, d);
      if ((nx !== tx || ny !== ty) && g.hexes[idx(g, nx, ny)].code < 0xa5) return [nx, ny];
    }
    throw new Error('no land neighbour');
  })();
  g.possession[idx(g, ex, ey)] = POSSESSION_CODE.communist;
  place(g, 1, ex, ey);
  assert.ok(enemyAdjacent(g, fx, fy));
  const c3 = stepCost(g, us, fx, fy, tx, ty);
  assert.equal(c3.cost, 2 + 4, 'disengagement +4');
  assert.equal(stepCost(g, us, fx, fy, ex, ey).blocked, 'enemy');
});

test('reach and paths respect the allowance and the one-hex minimum move', opts, () => {
  const g = load('korea1');
  for (const leader of leaders(g)) {
    const r = reach(g, leader);
    if (r.cannot) continue;
    const a = allowance(g, leader);
    for (const n of r.nodes.values()) {
      assert.ok(n.used <= a.rate, 'never above the national rate');
      if (n.hex !== r.origin) assert.ok(pathTo(r, n.hex)?.length === n.steps);
    }
  }
  // minimum move: an unmoved force with 1 MP left may still enter one mountain hex (cost 4 <= rate)
  const us = 187;
  const pair = findPair(g, POSSESSION_CODE.un, (_f, t) => g.hexes[t].code === 0x92)!;
  const [fx, fy] = xy(g, pair[0]);
  place(g, us, fx, fy);
  unit(g, us).move = 23;
  unit(g, us).status &= ~STATUS_MOVED;
  const r = reach(g, us);
  const node = r.nodes.get(pair[1]);
  assert.ok(node, 'mountain reachable as the first step');
  assert.equal(node.used, 24);
  assert.ok([...r.nodes.values()].every((n) => n.steps <= 1), 'but nothing further');
  unit(g, us).status |= STATUS_MOVED;
  assert.equal(reach(g, us).nodes.get(pair[1]), undefined, 'not once the force has moved this turn');
});

test('moving a force: readiness, possession, stacks, undo', opts, () => {
  const g = load('korea1');
  // pick the first UN force with a multi-hex move available
  for (const leader of leaders(g)) {
    if (sideOf(unit(g, leader)) !== 'un') continue;
    const r = reach(g, leader);
    const target = [...r.nodes.values()].find((n) => n.canStop && n.steps >= 2 && !n.captures);
    if (!target) continue;
    const path = pathTo(r, target.hex)!;
    const members = forceUnits(g, leader).map((u) => ({ id: u.id, readiness: u.readiness }));
    const origin = forceHex(g, leader);
    const res = moveForce(g, leader, path);
    assert.ok(res.ok, String(res.error));
    assert.equal(res.usedAfter, target.used);
    const spent = target.used - r.usedStart;
    for (const m of members) {
      const u = unit(g, m.id);
      assert.equal(u.readiness, m.readiness - spent, 'readiness -1 per movement point');
      assert.deepEqual([u.x, u.y], xy(g, target.hex));
      assert.ok(u.status & STATUS_MOVED);
    }
    assert.ok(g.stacks[target.hex].includes(leader));
    assert.ok(!g.stacks[origin].includes(leader));
    assert.ok(res.undoable);
    assert.equal(undoMove(g), leader);
    assert.equal(forceHex(g, leader), origin);
    assert.equal(unit(g, leader).readiness, members[0].readiness);
    return;
  }
  assert.fail('no movable UN force found');
});

test('entering enemy territory captures it and cannot be taken back', opts, () => {
  const g = load('korea1');
  for (const leader of leaders(g)) {
    const r = reach(g, leader);
    const target = [...r.nodes.values()].find((n) => n.canStop && n.step.captures);
    if (!target) continue;
    const side = sideOf(unit(g, leader));
    const res = moveForce(g, leader, pathTo(r, target.hex)!);
    assert.ok(res.ok);
    assert.equal(g.possession[target.hex], POSSESSION_CODE[side]);
    assert.equal(res.undoable, false);
    assert.equal(g.undo, null);
    return;
  }
  assert.fail('no capture move found');
});

test('rail movement: eligibility, free movement along friendly rails, then no more movement', opts, () => {
  for (const id of ['korea1', 'korea2', 'korea3']) {
    const g = load(id);
    const leader = leaders(g).find((l) => canEntrain(g, l));
    if (!leader) continue;
    const r = reach(g, leader, 'rail');
    assert.equal(r.cannot, null);
    const far = [...r.nodes.values()].filter((n) => n.canStop && n.hex !== r.origin).sort((a, b) => b.steps - a.steps)[0];
    assert.ok(far && far.steps >= 1);
    const side = sideOf(unit(g, leader));
    const before = g.railDemand.slice();
    const res = railMove(g, leader, pathTo(r, far.hex)!);
    assert.ok(res.ok, String(res.error));
    assert.equal(forceHex(g, leader), far.hex);
    const a = allowance(g, leader);
    assert.equal(a.remaining, 0, 'rail movement ends the turn for the force');
    assert.equal(g.railDemand[side === 'communist' ? 0 : 1], before[side === 'communist' ? 0 : 1] + 1);
    assert.equal(res.undoable, false);
    assert.equal(canEntrain(g, leader), false);
    return;
  }
  assert.fail('no force can entrain in the 1950s scenarios');
});

test('bug-out: only unmoved forces without allowance, 6 movement points, readiness <= 50', opts, () => {
  const g = load('korea1');
  const leader = leaders(g).find((l) => sideOf(unit(g, l)) === 'un' && forceUnits(g, l).length === 1)!;
  const u = unit(g, leader);
  assert.equal(canBugOut(g, leader), false);
  u.move = nationalMovementRate(g, u);
  u.status &= ~STATUS_MOVED;
  assert.equal(canBugOut(g, leader), true);
  assert.equal(reach(g, leader).cannot, 'noAllowance');
  assert.ok(bugOut(g, leader));
  assert.equal(allowance(g, leader).remaining, 6);
  assert.ok(u.readiness <= 50);
  assert.equal(reach(g, leader).cannot, null);
});

test('USMC amphibious exception into an estuary', opts, () => {
  const g = load('korea2');
  const marine = [...g.units.values()].find((u) => u.symbol === 12)!;
  assert.ok(marine, 'a USMC infantry unit');
  // a UN-held land hex next to an estuary
  const pair = findPair(g, POSSESSION_CODE.un, () => true);
  let found: [number, number] | null = null;
  for (let i = 0; i < g.hexes.length && !found; i++) {
    const c = g.hexes[i].code;
    if (c >= 0xa5 || g.possession[i] !== POSSESSION_CODE.un || !quiet(g, i)) continue;
    const [x, y] = xy(g, i);
    for (let d = 0; d < 6; d++) {
      const [nx, ny] = neighbor(x, y, d);
      if (nx < 2 || ny < 2 || nx >= g.width || ny >= g.height) continue;
      if (g.hexes[idx(g, nx, ny)].code >= 0xdb) { found = [i, idx(g, nx, ny)]; break; }
    }
  }
  assert.ok(pair && found, 'no coastal hex next to an estuary');
  const [fx, fy] = xy(g, found[0]), [tx, ty] = xy(g, found[1]);
  place(g, marine.id, fx, fy);
  marine.move = 0;
  const sc = stepCost(g, marine.id, fx, fy, tx, ty);
  assert.equal(sc.blocked, undefined);
  assert.equal(sc.cost, 0);
  assert.ok(sc.amphibious);
  const r = reach(g, marine.id);
  assert.equal(r.nodes.get(found[1])?.canStop, false, 'cannot end the move in the estuary');
  marine.move = 1;
  assert.equal(stepCost(g, marine.id, fx, fy, tx, ty).blocked, 'water', 'needs the full allowance');
});
