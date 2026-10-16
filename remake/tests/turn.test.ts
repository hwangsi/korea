// Turn sequence, supply, weather and General Resolution tests against the extracted original data
// (docs/rules/turn.md, docs/rules/supply.md).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { MapData, Scenario } from '../src/data/types.ts';
import { createGameState, idx, unit, forceUnits, STATUS_READY } from '../src/engine/state.ts';
import type { GameState } from '../src/engine/state.ts';
import { turnStartMove, nationalMovementRate, enemyAdjacent, moveForce } from '../src/engine/movement.ts';
import { supplyNet, restUp, interdictionLevel, COMMUNIST_SUPPLY_POINTS } from '../src/engine/supply.ts';
import { rollWeather, doWeather, initWeather, calendar, WEATHER_TABLE } from '../src/engine/weather.ts';
import { initiative, hasOrdersPhase, startNewGame, endPlayerPhase, endTest, nextTurn } from '../src/engine/turn.ts';
import {
  territoryBalance, terrainHeld, arrivalTurn, pendingArrival, groundReinforcements, checkChina, mineWarfare, doPatrols,
  checkBigHexes, canRebuild,
} from '../src/engine/endturn.ts';
import { bury } from '../src/engine/combat.ts';
import { neighbor } from '../src/engine/hex.ts';

const DATA = join(import.meta.dirname, '..', 'data', 'extracted');
const HAVE_DATA = existsSync(join(DATA, 'map.json'));
const map: MapData = HAVE_DATA ? JSON.parse(readFileSync(join(DATA, 'map.json'), 'utf8')) : (null as unknown as MapData);
const scenario = (id: string) => JSON.parse(readFileSync(join(DATA, 'scenarios', `${id}.json`), 'utf8')) as Scenario;
const load = (id: string, seed = 11) => createGameState(map, scenario(id), seed);
const opts = { skip: HAVE_DATA ? false : 'data/extracted missing (run tools/extract/extract.ts)' };

function leaders(g: GameState): [number, number][] {
  const out: [number, number][] = [];
  g.stacks.forEach((s, i) => s.forEach((l) => out.push([l, i])));
  return out;
}

test('STOCKPILE is [Communist, UN]; UN side is FIRSTUNUNIT..LASTUNUNIT', opts, () => {
  assert.deepEqual(load('korea1').stockpile, [105, 45]);
  assert.deepEqual(load('korea2').stockpile, [40, 80]); // NKPA exhausted before Inchon
  const g1 = load('korea1'), g4 = load('korea4');
  assert.deepEqual([g1.firstUnUnit, g1.lastUnUnit, g4.firstUnUnit, g4.lastUnUnit], [156, 250, 124, 202]);
  for (const g of [g1, g4]) for (const u of g.units.values()) assert.equal(u.id >= g.firstUnUnit, ['US', 'USMC', 'CW', 'UN', 'ROK'].includes(u.nation), u.name);
});

test('supply net: sources, friendly land only, and it reproduces REST_UP allowances in the scenario files', opts, () => {
  for (const id of ['korea1', 'korea2', 'korea3', 'korea4']) {
    const g = load(id);
    const net = supplyNet(g);
    for (let i = 0; i < net.length; i++) {
      if (!net[i]) continue;
      assert.equal(g.possession[i], net[i], `${id} hex ${i} supplied for the wrong side`);
      assert.ok(g.hexes[i].code < 0xa5, `${id} water hex ${i} in the supply net`);
    }
    for (const [x, y] of COMMUNIST_SUPPLY_POINTS) if (g.possession[idx(g, x, y)] === 2) assert.equal(net[idx(g, x, y)], 2);
    // forces whose STATUS 0x40 agrees with readiness >= 75 were last touched by REST_UP (the designer edited
    // some forces by hand: korea1's six front-line ROK regiments, korea2's Pusan perimeter at readiness 75)
    // (korea1 force 166 on the Ongjin peninsula is cut off but was given a full allowance for the opening)
    // Patrols, guerrillas and mine sweeping run after REST_UP, so the saved possession can differ a little
    // from the one the allowances were computed with: at most one mismatch per file (korea3: force 205).
    let checked = 0;
    const wrong: string[] = [];
    for (const [l, i] of leaders(g)) {
      const members = forceUnits(g, l);
      if (!members.every((u) => ((u.status & STATUS_READY) !== 0) === (u.readiness >= 75))) continue;
      if (id === 'korea1' && l === 166) continue;
      const side = l >= g.firstUnUnit ? 1 : 2;
      if (turnStartMove(g, l, true) === turnStartMove(g, l, false)) continue;
      checked++;
      if (unit(g, l).move !== turnStartMove(g, l, net[i] === side)) wrong.push(`${l} ${unit(g, l).name} at ${i % g.width},${Math.floor(i / g.width)}`);
    }
    assert.ok(checked >= 20 || id === 'korea2', `${id}: only ${checked} forces checked`);
    assert.ok(wrong.length <= 1, `${id}: ${wrong.join('; ')}`);
  }
});

test('resupply: readiness 50..100, STATUS bits, allowance for the next turn', opts, () => {
  const g = load('korea3');
  g.weather[0][0] = 21; // mild, fair
  g.sky = 1;
  const r = restUp(g);
  assert.ok(r.resupplied.un + r.resupplied.communist > 0);
  for (const [l] of leaders(g)) {
    for (const u of forceUnits(g, l)) {
      assert.ok(u.readiness >= 50 && u.readiness <= 100, `${u.name} readiness ${u.readiness}`);
      assert.equal((u.status & STATUS_READY) !== 0, u.readiness >= 75, u.name);
    }
  }
  for (const [l, i] of leaders(g)) {
    const side = l >= g.firstUnUnit ? 1 : 2;
    assert.equal(unit(g, l).move, turnStartMove(g, l, r.net[i] === side));
  }
  assert.ok(interdictionLevel(g) >= 0);
});

test('weather: calendar, monthly table (manual 6.4), forecasts and the freeze line', opts, () => {
  assert.deepEqual(calendar(0, 1950), { year: 1950, month: 6, day: 25 });
  assert.deepEqual(calendar(11, 1950), { year: 1950, month: 9, day: 15 });
  assert.deepEqual(calendar(20, 1950), { year: 1950, month: 11, day: 22 });
  assert.deepEqual(calendar(26, 1950), { year: 1951, month: 1, day: 8 });
  assert.deepEqual(calendar(44, 1950), { year: 1951, month: 5, day: 22 });
  assert.equal(WEATHER_TABLE.length, 11);
  const g = load('korea1');
  // July (turns 2-5): never cold; January (turns 26-29): never hot
  for (let k = 0; k < 300; k++) {
    assert.notEqual(Math.trunc(rollWeather(g, 3) / 10), 1);
    assert.notEqual(Math.trunc(rollWeather(g, 27) / 10), 3);
  }
  initWeather(g);
  assert.equal(g.weather[0][0], 22); // first turn: mild, cloudy
  assert.equal(g.freezeLine, 0);
  for (const r of [1, 2]) assert.equal(g.weather[r][0], g.weather[0][0]);
  const g3 = load('korea3');
  initWeather(g3);
  assert.deepEqual([g3.weather[0][0], g3.freezeLine, g3.turn], [11, 23, 20]);
  const g2 = load('korea2');
  initWeather(g2);
  assert.equal(g2.turn, 11);
  // freeze line: cold +5 (at least row 21), mild -4, hot -9
  const f = load('korea1');
  f.freezeLine = 10;
  f.weather[0] = [22, 12, 22, 32];
  doWeather(f);
  assert.equal(f.freezeLine, 21);
  doWeather(f);
  assert.equal(f.freezeLine, 17);
  doWeather(f);
  assert.equal(f.freezeLine, 8);
  assert.equal(f.sky, f.weather[0][0] % 10);
});

test('initiative: stockpile roll, fixed first turns, UN without a first orders phase', opts, () => {
  const g = load('korea1');
  assert.deepEqual(initiative(g, 1), [2, 1]); // turn 0: Communist base, reversed in phase 1
  assert.deepEqual(initiative(g, 3), [1, 2]);
  assert.equal(hasOrdersPhase(g, 2, 1), false);
  assert.equal(hasOrdersPhase(g, 2, 3), true);
  const g2 = load('korea2');
  assert.deepEqual(initiative(g2, 1), [1, 2]); // Chromite: the UN moves second
  assert.equal(hasOrdersPhase(g2, 2, 1), true);
  const g3 = load('korea3');
  assert.equal(hasOrdersPhase(g3, 2, 1), false); // Cold Steel: Chinese surprise
  // the larger Communist stockpile makes the UN move first in phase 1 more often (manual Appendix F)
  const t = load('korea1');
  t.turn = 5;
  let unFirst = 0;
  t.stockpile = [150, 50];
  for (let k = 0; k < 2000; k++) if (initiative(t, 1)[0] === 2) unFirst++;
  assert.ok(unFirst > 2000 * 0.9, `UN first ${unFirst}/2000`); // P = (100 + 150 - 50) / 200 = 1
  t.stockpile = [50, 50];
  unFirst = 0;
  for (let k = 0; k < 4000; k++) if (initiative(t, 1)[0] === 2) unFirst++;
  assert.ok(Math.abs(unFirst / 4000 - 0.5) < 0.05, `UN first ${unFirst}/4000`);
});

test('turn cycle: orders, combat, second orders, resolution, next turn', opts, () => {
  const g = load('korea1');
  const start = startNewGame(g);
  assert.deepEqual(start.map((e) => e.kind), ['noFirstPhase', 'ordersPhase']);
  assert.deepEqual([g.turn, g.phase, g.player], [0, 1, 1]);
  assert.equal(g.refugees, true); // INIT_GAME: Dragon Wakes starts with refugees
  let ev = endPlayerPhase(g); // Communist ends phase 1 -> combat -> second orders
  assert.ok(ev.some((e) => e.kind === 'combat'));
  assert.deepEqual([g.phase, g.player], [3, 1]);
  ev = endPlayerPhase(g);
  assert.deepEqual([g.phase, g.player], [3, 2]);
  const before = [g.weather[0][1], g.weather[0][2]];
  ev = endPlayerPhase(g);
  const res = ev.find((e) => e.kind === 'resolution');
  assert.ok(res && res.kind === 'resolution');
  assert.equal(res.report.turn, 0);
  assert.equal(g.turn, 1);
  assert.equal(g.phase, 1);
  assert.deepEqual([g.weather[0][0], g.weather[0][1]], before); // weather shifted one turn
  assert.ok(res.report.reinforcements.arrived.length > 0);
  for (const id of res.report.reinforcements.arrived) assert.ok(g.stacks[idx(g, unit(g, id).x, unit(g, id).y)].includes(id));
  // every force on the map got its allowance from REST_UP
  for (const [l] of leaders(g)) assert.ok(unit(g, l).move < 100);
  assert.ok(ev.some((e) => e.kind === 'ordersPhase' && e.phase === 1));
});

test('stockpile shipments and transport demands (GROUND_REINFORCEMENTS 06BA)', opts, () => {
  const g = load('korea1');
  g.turn = 8; g.competence = 3; g.ccfIntervention = 99; g.sky = 1;
  g.stockpile = [50, 50];
  g.railDemand = [2, 1]; g.sealiftDemand = 3; g.airliftDemand = 1;
  const r = groundReinforcements(g);
  assert.deepEqual(r.shipments, [8 / 4 + 10 + 0 - 2, 10 - (1 + 3 + 1)]);
  assert.deepEqual(g.stockpile, [60, 55]);
  assert.deepEqual([g.railDemand[0], g.railDemand[1], g.airliftDemand], [0, 0, 0]);
  // storm: UN demand is 4 + rail; Chinese intervention adds 10 (+20 four turns later); caps at 100
  const s = load('korea1');
  s.turn = 20; s.sky = 3; s.ccfIntervention = 16; s.stockpile = [95, 10]; s.railDemand = [0, 2];
  groundReinforcements(s);
  assert.deepEqual(s.stockpile, [100, 10 + 15 - 6]);
});

test('reinforcements: MAP_X = -(turn*100 + x), general entry hexes, CPLA timing', opts, () => {
  const g = load('korea1');
  const pending = [...g.units.values()].filter((u) => pendingArrival(g, u));
  assert.ok(pending.length > 50);
  const nk = [...g.units.values()].filter((u) => u.nation === 'NKPA' && pendingArrival(g, u));
  assert.ok(nk.every((u) => pendingArrival(g, u)!.code === 99), 'NKPA reinforcements use the general list');
  const cpla = [...g.units.values()].find((u) => u.nation === 'CPLA' && u.x < -1)!;
  assert.ok(arrivalTurn(g, cpla) >= 50); // relative to the intervention, which has not happened
  g.ccfIntervention = 20;
  assert.equal(arrivalTurn(g, cpla), Math.abs(Math.trunc(cpla.x / 100)) - 50 + 20 - Math.trunc(3 / 4));
  // units due next turn arrive at the end of this one
  const t = load('korea1');
  const due = [...t.units.values()].filter((u) => u.x < -1 && arrivalTurn(t, u) <= 1 && ![...t.units.values()].some((v) => v.attached === u.id));
  const r = groundReinforcements(t);
  for (const u of due) assert.ok(r.arrived.includes(u.id) || r.held.includes(u.id), u.name);
  for (const id of r.arrived) {
    const u = unit(t, id);
    assert.ok(u.x >= 0 && t.stacks[idx(t, u.x, u.y)].includes(id));
    assert.equal(t.possession[idx(t, u.x, u.y)], id >= t.firstUnUnit ? 1 : 2);
  }
  assert.equal(t.utility[19], 1); // "Reinforcements have arrived" for the Communist player
});

test('replacements: pools grow by their rate, rebuilt units return green at readiness 75', opts, () => {
  const g = load('korea1');
  g.turn = 1;
  const usBefore = g.replacements.US.map((r) => r[1]);
  const nkBefore = g.replacements.NKPA.map((r) => r[1]);
  groundReinforcements(g);
  assert.deepEqual(g.replacements.US.map((r) => r[1]), usBefore); // US replacements start after turn 1
  // NKPA pools grew by the rate, then supplied units drew from them
  assert.ok(g.replacements.NKPA.every((r, k) => r[1] <= Math.min(255, nkBefore[k] + r[0])));
  const t = load('korea2');
  const victim = [...t.units.values()].find((u) => u.nation === 'NKPA' && u.x >= 2 && t.stacks[idx(t, u.x, u.y)].includes(u.id) && u.attached === 0)!;
  t.stacks[idx(t, victim.x, victim.y)].splice(t.stacks[idx(t, victim.x, victim.y)].indexOf(victim.id), 1);
  bury(t, victim);
  for (const row of t.replacements.NKPA) row[1] = 255;
  assert.equal(canRebuild(t, victim), true);
  const r = groundReinforcements(t);
  assert.ok(r.rebuilt.includes(victim.id));
  assert.deepEqual([victim.x, victim.y, victim.readiness, victim.experience], [-199, 99, 75, 1]);
  // rebuilding comes after the distribution to units on the map, so it gets what is left in the pools
  assert.ok(victim.equipment.every((e) => e.assigned <= e.authorized) && victim.equipment.some((e) => e.assigned > 0));
  assert.ok(pendingArrival(t, victim)!.code === 99 && arrivalTurn(t, victim) === 1);
});

test('CHECK_CHINA: a non-ROK UN force north of the 38th parallel', opts, () => {
  const g = load('korea2');
  assert.equal(checkChina(g), false);
  const us = [...g.stacks.entries()].flatMap(([i, s]) => s.map((l) => [l, i] as const)).find(([l]) => l >= 187)!;
  const [l, i] = us;
  g.stacks[i].splice(g.stacks[i].indexOf(l), 1);
  const t = idx(g, 15, 30);
  g.stacks[t].push(l);
  g.ccfFixed = true;
  assert.equal(checkChina(g), true);
  assert.ok(g.ccfIntervention > g.turn && g.ccfIntervention <= g.turn + 4);
  assert.equal(g.news.length, 2);
  assert.equal(checkChina(g), false); // decided once
});

test('mines, patrols, guerrillas, big-city news', opts, () => {
  const g = load('korea2');
  g.turn = 5;
  assert.deepEqual(mineWarfare(g), { mined: [], swept: [] }); // nothing before the end of turn 7
  g.turn = 30;
  for (let k = 0; k < 20; k++) mineWarfare(g);
  for (const p of g.ports) {
    const owner = g.possession[idx(g, p.x, p.y)];
    if (owner === 2) assert.equal(p.mined, true, `port ${p.id}`);
    else assert.equal(p.mined, false, `port ${p.id}`);
  }
  // patrols: an empty hex next to a strong enemy force changes hands
  const h = load('korea1');
  const before = h.possession.slice();
  const pr = doPatrols(h);
  assert.ok(pr.patrols.communist + pr.patrols.un > 0);
  for (let i = 0; i < before.length; i++) {
    if (before[i] === h.possession[i]) continue;
    assert.equal(h.stacks[i].length, 0, 'occupied hexes never change hands');
    assert.notEqual(h.hexes[i].code, 0x93);
  }
  // P'yongyang reverts to the Communists when empty
  const p = load('korea3');
  const pi = idx(p, 7, 29);
  p.stacks[pi] = [];
  p.possession[pi] = 1;
  const r = doPatrols(p);
  assert.equal(p.possession[pi], 2);
  assert.ok(r.reverted.some(([x, y]) => x === 7 && y === 29));
  // CHECK_BIGHEXES: news when one of the seven cities changes hands
  const c = load('korea1');
  c.possession[idx(c, 14, 40)] = 2;
  const ch = checkBigHexes(c);
  assert.deepEqual(ch, [{ name: 'Seoul', owner: 2 }]);
  assert.equal(c.news.at(-1)!.text, 'Communist forces occupy Seoul.');
  assert.deepEqual(checkBigHexes(c), []);
});

test('victory level (TERRITORY_BALANCE) and END_TEST', opts, () => {
  assert.equal(territoryBalance(load('korea1')), 0); // 25 June 1950 is the reference point
  assert.equal(territoryBalance(load('korea4')), 1); // 1995: one level UN handicap
  const h = terrainHeld(load('korea1'));
  assert.equal(100 * h.cities.un + h.hexes.un - (100 * h.cities.communist + h.hexes.communist), 181);
  const g = load('korea1');
  assert.equal(endTest(g), null);
  g.turn = 44;
  assert.equal(endTest(g), 'lastTurn');
  g.turn = 26;
  g.ccfIntervention = 88;
  assert.equal(endTest(g), 'noIntervention');
  g.turn = 10;
  for (let i = 0; i < g.possession.length; i++) if (g.hexes[i].code === 0x93 && g.possession[i] === 1) g.possession[i] = 2;
  assert.equal(endTest(g), 'communistHoldsCities');
});

test('NEXT_TURN: refugees after big UN losses, airfield repair', opts, () => {
  const g = load('korea1');
  startNewGame(g);
  const held = terrainHeld(g);
  g.unHexes = 100 * held.cities.un + held.hexes.un + 11; // the UN lost more than ten points
  nextTurn(g);
  assert.equal(g.refugees, true);
  g.unHexes = 100 * held.cities.un + held.hexes.un;
  g.utility[7] = 0;
  nextTurn(g);
  assert.equal(g.refugees, false);
  g.utility[7] = 5; // five UN units lost or forced back
  nextTurn(g);
  assert.equal(g.refugees, true);
  const af = g.airfields.find((a) => g.possession[idx(g, a.x, a.y)] === 1 && a.best > 0)!;
  af.current = 0;
  nextTurn(g);
  assert.ok(af.current >= 1); // level 0 -> 1 always
  const red = g.airfields.find((a) => g.possession[idx(g, a.x, a.y)] === 2);
  if (red) assert.equal(red.current, 0);
});

test('second orders phase: green UN units that retreated may bug out moving along the front', opts, () => {
  const g = load('korea1');
  startNewGame(g);
  g.phase = 3;
  // a UN force next to the enemy with a free, enemy-adjacent UN neighbour
  let found: [number, number] | null = null;
  for (const [l, i] of leaders(g)) {
    if (l < g.firstUnUnit || found) continue;
    const x = i % g.width, y = Math.floor(i / g.width);
    if (!enemyAdjacent(g, x, y)) continue;
    for (let d = 0; d < 6 && !found; d++) {
      const [nx, ny] = neighbor(x, y, d);
      if (nx < 0 || ny < 0 || nx >= g.width || ny >= g.height) continue;
      const j = idx(g, nx, ny);
      if (g.stacks[j].length || g.possession[j] !== 1 || g.hexes[j].code >= 0xa5 || !enemyAdjacent(g, nx, ny)) continue;
      found = [l, j];
    }
  }
  assert.ok(found, 'no front-line geometry');
  const [leader, to] = found;
  const members = forceUnits(g, leader);
  for (const u of members) { u.experience = 1; u.status = 0x02; u.readiness = 0; u.move = 0; }
  const res = moveForce(g, leader, [to]);
  assert.ok(res.ok, String(res.error));
  assert.deepEqual(res.bugOuts, members.map((u) => u.id)); // RND(1,100) > readiness 0: always
  assert.equal(res.undoable, false);
  // first orders phase: no such check
  const h = load('korea1');
  startNewGame(h);
  for (const u of forceUnits(h, leader)) { u.experience = 1; u.status = 0x02; u.readiness = 0; u.move = 0; }
  assert.deepEqual(moveForce(h, leader, [to]).bugOuts, []);
});
