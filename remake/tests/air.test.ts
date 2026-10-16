// Air operations tests against the extracted original data (docs/rules/air.md).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { MapData, Scenario } from '../src/data/types.ts';
import { createGameState, idx, unit, forceUnits, STATUS_READY } from '../src/engine/state.ts';
import type { GameState } from '../src/engine/state.ts';
import { interdictionLevel } from '../src/engine/supply.ts';
import { startNewGame, endPlayerPhase, nextTurn, airstrikesPending } from '../src/engine/turn.ts';
import {
  airUnit, airDivisor, groundAttackStrength, determineInterdiction, determineRedAir, determineInterception, chooseBases,
  canPlanAir, setMission, airProjections, autoMissions, superiorityLosses, interdictionEffect, strikeUnits, strikeLethality,
  resolveAirstrike, chooseStrikeTarget, strikeTargetError, pendingAirstrike, flyAirstrike, delegateAirstrikes, beginAirCombat,
  continueAirCombat, checkAirForces, inMigAlley, marineAdjacent, displayedStrengths,
  MISSION_SUPERIORITY, MISSION_GROUND, MISSION_INTERDICTION, BASE_JAPAN, BASE_KOREA, BASE_CARRIER,
} from '../src/engine/air.ts';
import { neighbor } from '../src/engine/hex.ts';

const DATA = join(import.meta.dirname, '..', 'data', 'extracted');
const HAVE_DATA = existsSync(join(DATA, 'map.json'));
const map: MapData = HAVE_DATA ? JSON.parse(readFileSync(join(DATA, 'map.json'), 'utf8')) : (null as unknown as MapData);
const scenario = (id: string) => JSON.parse(readFileSync(join(DATA, 'scenarios', `${id}.json`), 'utf8')) as Scenario;
const load = (id: string, seed = 7) => createGameState(map, scenario(id), seed);
const opts = { skip: HAVE_DATA ? false : 'data/extracted missing (run tools/extract/extract.ts)' };

const A = (g: GameState, id: number) => airUnit(g, id)!;
const leaders = (g: GameState) => g.stacks.flatMap((s, i) => s.map((l) => [l, i] as [number, number]));

test('EFFECTIVE_STRENGTH: sky code, all-weather -1, short range in Japan x2 (manual 3.21 table differs)', opts, () => {
  const g = load('korea1');
  const a = { ...A(g, 1) }; // 8th Ftr Bmbr Group: short range, not all-weather
  const table: number[][] = [];
  for (const [base, longRange, allWeather] of [[0, false, false], [1, false, false], [2, false, false], [0, true, false], [0, true, true], [1, false, true]] as const) {
    const row: number[] = [];
    for (const sky of [1, 2, 3]) {
      g.sky = sky;
      row.push(airDivisor(g, { ...a, base, longRange, allWeather }));
    }
    table.push(row);
  }
  assert.deepEqual(table, [
    [2, 4, 6], // short range from Japan: 50% / 25% / 17% (manual: 50 / 33 / 25)
    [1, 2, 3], // Korea
    [1, 2, 3], // carrier
    [1, 2, 3], // long range, any base
    [1, 1, 2], // long range, all weather
    [1, 1, 2], // 1995 MiG-23/29 style: short range all weather in Korea
  ]);
});

test('GROUND_ATTACK_STRENGTH: Communist interception level in MiG Alley and on interdiction, long range halved', opts, () => {
  const g = load('korea2');
  g.sky = 1;
  const f84 = A(g, 12); // 19 / 38, ground attack, poor runways
  f84.base = BASE_KOREA;
  g.redAir = 50;
  assert.ok(inMigAlley(14, 26) && !inMigAlley(15, 26) && !inMigAlley(14, 27));
  assert.equal(groundAttackStrength(g, f84, 20, 50), 38); // outside MiG Alley: CIL is zero
  assert.equal(groundAttackStrength(g, f84, 10, 20), 38 - (50 - 19)); // manual 4.11: A2G - CIL + A2A
  g.redAir = 10;
  assert.equal(groundAttackStrength(g, f84, 10, 20), 38); // A2A >= CIL: no loss
  g.redAir = 200;
  assert.equal(groundAttackStrength(g, f84, 10, 20), 0);
  f84.mission = MISSION_INTERDICTION;
  assert.equal(groundAttackStrength(g, f84, 20, 50), 0); // interdiction always meets the CIL
  const b26 = A(g, 3); // 3rd Bomb Wing (Light): long range 9 / 36
  g.redAir = 0;
  b26.mission = MISSION_GROUND;
  assert.equal(groundAttackStrength(g, b26, 20, 50), 18);
  b26.mission = MISSION_INTERDICTION;
  assert.equal(groundAttackStrength(g, b26, 20, 50), 36);
  // with no CIL, DETERMINE_INTERDICTION equals REST_UP's UNIL; the CIL only lowers the former
  g.redAir = 0;
  assert.equal(determineInterdiction(g, 2), interdictionLevel(g));
  g.redAir = 40;
  assert.ok(determineInterdiction(g, 2) < interdictionLevel(g));
  // 1995: no CIL
  const g4 = load('korea4');
  g4.sky = 1;
  const nk = A(g4, 1);
  nk.mission = MISSION_INTERDICTION;
  g4.redAir = 100;
  assert.equal(groundAttackStrength(g4, nk, 5, 5), Math.trunc(nk.airToGround / airDivisor(g4, nk)));
});

test('DETERMINE_RED_AIR (manual 4.11: 40 points of air superiority lower the CIL by 8) and the Strategic Report copy', opts, () => {
  const g = load('korea2');
  g.sky = 1;
  for (const a of g.airUnits) a.mission = MISSION_GROUND;
  const f80 = A(g, 13); // 49th Ftr Bmbr Group 30 / 30
  f80.mission = MISSION_SUPERIORITY;
  f80.base = BASE_KOREA;
  f80.airToAir = 40;
  g.redAir = 50;
  assert.equal(determineRedAir(g), 42);
  f80.base = BASE_JAPAN; // short range from Japan: 40 / 2 = 20 -> 4
  g.redAir = 50;
  assert.equal(determineRedAir(g), 46);
  g.redAir = 3;
  assert.equal(determineRedAir(g), 0);
  const b29 = A(g, 4); // long range: air-to-air halved on air superiority
  b29.mission = MISSION_SUPERIORITY;
  f80.mission = MISSION_GROUND;
  b29.airToAir = 20;
  g.redAir = 50;
  assert.equal(determineRedAir(g), 48);
  g.redAir = 33;
  determineInterdiction(g, 2);
  assert.equal(g.interception[0], 33); // STARTFINISH: INTERCEPTION[Communist] = RED_AIR in the 1950s
});

test('CHOOSE_BASES: jets take improved fields, propeller units the rest, MAG-33 and MAG-12 swap (appendix F)', opts, () => {
  const g = load('korea1');
  g.turn = 0;
  chooseBases(g);
  for (const a of g.airUnits.filter((x) => x.entryTurn <= 0 && x.exitTurn > 0)) {
    assert.equal(a.base, a.name.startsWith('Carrier') ? BASE_CARRIER : BASE_JAPAN, a.name); // no Korean airfield yet
  }
  assert.deepEqual([A(g, 11).airToAir, A(g, 11).airToGround, A(g, 11).aircraft2, A(g, 24).base], [6, 12, 0, BASE_JAPAN]);

  const setup = (turn: number) => {
    const h = load('korea1');
    h.turn = turn;
    for (const af of h.airfields) af.current = 0;
    h.airfields.find((af) => af.x === 24 && af.y === 54)!.current = 3; // K-2 Taegu: two places for any type
    h.airfields.find((af) => af.x === 26 && af.y === 59)!.current = 1; // K-1 Pusan: one propeller place
    for (const id of [10, 12, 13]) A(h, id).base = BASE_JAPAN;
    A(h, 11).base = BASE_CARRIER;
    A(h, 24).base = BASE_CARRIER;
    chooseBases(h);
    return h;
  };
  // turn 12: the 49th FBG (jets) gets Taegu, the 35th FIG (Mustangs) the spare place, MAG-33 Pusan
  const h = setup(12);
  assert.deepEqual([10, 11, 12, 13, 24].map((id) => A(h, id).base), [BASE_KOREA, BASE_KOREA, BASE_JAPAN, BASE_KOREA, BASE_CARRIER]);
  assert.deepEqual([A(h, 11).airToAir, A(h, 11).airToGround, A(h, 11).aircraft2], [9, 18, 7]); // + Tigercats
  for (const id of [3, 4, 7, 8]) assert.equal(A(h, id).base, BASE_JAPAN); // long range
  for (const id of [5, 6, 9, 14]) assert.equal(A(h, id).base, BASE_CARRIER);
  // turn 10: MAG-33 stays on its carrier (only from turn 12), so the 8th FBG gets the propeller place and MAG-12 goes to Japan
  const h10 = setup(10);
  assert.deepEqual([10, 11, 12, 13].map((id) => A(h10, id).base), [BASE_KOREA, BASE_CARRIER, BASE_KOREA, BASE_KOREA]);
  assert.equal(A(h10, 24).base, BASE_JAPAN);

  // 1995: the UN gets Korean bases (all South Korean fields at level 3), North Korean basing is abstracted
  const g4 = load('korea4');
  chooseBases(g4, 2);
  assert.ok(g4.airUnits.filter((a) => a.id >= 14 && a.id <= 23 && a.entryTurn <= 0).every((a) => a.base === BASE_KOREA));
  assert.ok(g4.airUnits.filter((a) => a.id <= 13).every((a) => a.base === BASE_KOREA));
});

test('Air Operations: UN only in the 1950s, both sides in 1995, first orders phase, projections restore the state', opts, () => {
  const g = load('korea2');
  startNewGame(g);
  g.phase = 1;
  g.player = 1;
  assert.equal(canPlanAir(g), false); // no Communist air force in the 1950s
  g.player = 2;
  assert.equal(canPlanAir(g), true);
  assert.ok(setMission(g, 12, MISSION_INTERDICTION));
  assert.equal(A(g, 12).mission, MISSION_INTERDICTION);
  assert.equal(setMission(g, 28, MISSION_GROUND), false); // not active yet
  chooseBases(g); // the Air Operations screen bases the units when it opens (nested 1058)
  const before = { redAir: g.redAir, interdiction: [...g.interdiction], interception: [...g.interception] };
  const p = airProjections(g);
  assert.deepEqual({ redAir: g.redAir, interdiction: [...g.interdiction], interception: [...g.interception] }, before);
  assert.equal(p.strikes, g.airUnits.filter((a) => a.entryTurn <= 11 && a.exitTurn > 11 && a.mission === MISSION_GROUND).length);
  assert.equal(p.cilNext, p.cilNow! + 10); // turn 11 > 8
  assert.equal(p.superiority, null);
  // the projection is what the combat phase computes
  const air = beginAirCombat(g);
  assert.equal(g.redAir, p.cilNow);
  continueAirCombat(g, air);
  assert.equal(air.report.sides[0].interdiction, p.interdiction);
  g.phase = 3;
  assert.equal(canPlanAir(g), false); // missions change in the first orders phase only
  g.phase = 1;
  g.airPlayerControl = false;
  assert.equal(canPlanAir(g), false); // Air Campaign: Program Control

  const g4 = load('korea4');
  startNewGame(g4);
  g4.phase = 1;
  g4.player = 1;
  assert.equal(canPlanAir(g4), true);
  const p4 = airProjections(g4);
  assert.ok(p4.superiority! > 0 && p4.cilNow === null);
  g4.utility[12] = 1; // North Korean air force neutralized
  assert.equal(canPlanAir(g4), false);
  // long-range 1950s units are shown halved on the matching mission
  const b26 = A(g, 3);
  g.sky = 1;
  b26.mission = MISSION_GROUND;
  assert.deepEqual(displayedStrengths(g, b26), { airToAir: 9, airToGround: 18 });
  b26.mission = MISSION_SUPERIORITY;
  assert.deepEqual(displayedStrengths(g, b26), { airToAir: 4, airToGround: 36 });
});

test('program missions (AIRCMBT 0294): air-to-air types fly air superiority, bombers interdict', opts, () => {
  const g = load('korea3');
  g.redAir = 0;
  g.refugees = false;
  for (const a of g.airUnits) a.mission = 1;
  autoMissions(g, 2);
  for (const a of g.airUnits.filter((x) => x.entryTurn <= 20 && x.exitTurn > 20)) {
    if (a.airToAir > a.airToGround) assert.equal(a.mission, MISSION_SUPERIORITY, a.name);
  }
  // korea3 holds hundreds of UN hexes: no "UN in trouble" override, so the long-range bombers interdict
  for (const id of [3, 4, 7, 8, 15]) assert.equal(A(g, id).mission, MISSION_INTERDICTION);
  const g4 = load('korea4');
  autoMissions(g4, 1);
  for (const a of g4.airUnits.filter((x) => x.id <= 13)) assert.equal(a.mission, a.airToAir >= a.airToGround ? MISSION_SUPERIORITY : MISSION_GROUND);
});

test('1995 air superiority combat (appendix F): loss % = 10 x enemy / own, at most 90, permanent', opts, () => {
  const g = load('korea4');
  g.sky = 1;
  const nk = determineInterception(g, 1), un = determineInterception(g, 2);
  assert.ok(nk > 0 && un > 0);
  const f15 = { ...A(g, 23) };
  const lossUN = superiorityLosses(g, 2);
  assert.equal(lossUN, Math.min(90, Math.trunc((10 * nk) / un)));
  assert.equal(A(g, 23).airToAir, Math.trunc((f15.airToAir * (100 - lossUN)) / 100));
  g.interception = [500, 0];
  assert.equal(superiorityLosses(g, 2), 90);
  g.interception = [500, 1];
  for (let k = 0; k < 30; k++) superiorityLosses(g, 2);
  assert.ok(g.airUnits.filter((a) => a.id >= 14 && a.entryTurn <= 0).every((a) => a.exitTurn === 0)); // all shot down
  checkAirForces(g);
  assert.equal(g.utility[13], 0); // carrier wings and USAF reinforcements are still to come (EXIT_TURN 99)
  for (const a of g.airUnits) if (a.id >= 14) a.exitTurn = 0;
  nextTurn(g);
  assert.equal(g.utility[13], 1);
  assert.ok(g.news.some((n) => n.text === 'United Nations air force has been neutralized.'));
  const news = g.news.length;
  checkAirForces(g);
  assert.equal(g.news.length, news); // only once
});

test('interdiction effect (AIRCMBT 0051): news wording and RND(1, IL) off the enemy stockpile', opts, () => {
  const g = load('korea2');
  const adv: string[] = [];
  for (const il of [0, 5, 19, 25, 40]) {
    g.interdiction = [0, il];
    g.stockpile = [100, 100];
    const n = g.news.length;
    const hit = interdictionEffect(g, 2);
    if (il === 0) { assert.equal(hit, 0); assert.equal(g.news.length, n); continue; }
    assert.ok(hit >= 1 && hit <= il);
    assert.equal(g.stockpile[0], 100 - hit);
    assert.equal(g.stockpile[1], 100);
    adv.push(g.news[g.news.length - 1].text);
  }
  assert.deepEqual(adv, [
    'U.N. aircraft lightly interdict Communist supply lines.',
    'U.N. aircraft lightly interdict Communist supply lines.',
    'U.N. aircraft moderately interdict Communist supply lines.',
    'U.N. aircraft strongly interdict Communist supply lines.',
  ]);
});

/** A spotted Communist force in open terrain away from MiG Alley (korea2). */
function openTarget(g: GameState): [number, number, number] {
  for (const [l, i] of leaders(g)) {
    const x = i % g.width, y = Math.floor(i / g.width);
    if (l >= g.firstUnUnit || g.hexes[i].code >= 0x58 || inMigAlley(x, y)) continue;
    return [l, x, y];
  }
  throw new Error('no open target');
}

test('airstrike (manual 4.13): equipment loss checks, readiness to 50, terrain and prepared positions', opts, () => {
  const g = load('korea2');
  startNewGame(g, { limitedIntel: false });
  g.sky = 1;
  const a = A(g, 12);
  a.base = BASE_KOREA;
  a.mission = MISSION_GROUND;
  const [leader, x, y] = openTarget(g);
  assert.equal(strikeLethality(g, a, x, y), 38);
  const members = forceUnits(g, leader);
  for (const u of members) u.status &= ~STATUS_READY;
  const before = members.map((u) => u.equipment.map((e) => e.assigned));
  a.airToGround = 200; // lethality capped at 100%
  const r = resolveAirstrike(g, 2, a, x, y);
  assert.ok(r.found);
  assert.equal(r.forces[0].lethality, 100);
  assert.equal(r.forces[0].severity, 3);
  members.forEach((u, k) => {
    assert.equal(u.readiness, 50);
    u.equipment.forEach((e, j) => {
      if (before[k][j] > 0) assert.ok(e.assigned >= 1 && e.assigned <= before[k][j], `${u.name} keeps one of each`);
    });
  });
  assert.equal(r.aaHit, false); // no anti-aircraft losses in the 1950s
  // rough / mountain / city x0.75, prepared positions x0.75 more
  const rough = g.hexes.findIndex((h, i) => h.code === 0x92 && !inMigAlley(i % g.width, Math.floor(i / g.width)));
  a.airToGround = 40;
  assert.equal(strikeLethality(g, a, rough % g.width, Math.floor(rough / g.width)), 30);
  // destroyed share ~ lethality * (15 - survivability) / 15 (Rifle Platoon 8, artillery 2)
  const h = load('korea2', 99);
  startNewGame(h);
  h.sky = 1;
  const b = A(h, 12);
  b.base = BASE_KOREA;
  b.airToGround = 60;
  const [l2, x2, y2] = openTarget(h);
  const u = forceUnits(h, l2)[0];
  u.status &= ~STATUS_READY;
  let checks = 0, lost = 0;
  for (let k = 0; k < 400; k++) {
    u.equipment = [{ type: 12, assigned: 11, authorized: 11 }];
    u.readiness = 100;
    resolveAirstrike(h, 2, b, x2, y2);
    checks += 10;
    lost += 11 - u.equipment[0].assigned;
  }
  assert.ok(Math.abs(lost / checks - 0.6 * (7 / 15)) < 0.03, `rifle platoon loss rate ${lost / checks}`);
});

test('airstrike spotting: hidden CPLA forces until six turns after the intervention, empty hexes', opts, () => {
  const g = load('korea3'); // CCF_INTERVENTION 15, turn 20
  startNewGame(g, { limitedIntel: true });
  g.sky = 1;
  const a = A(g, 12);
  a.mission = MISSION_GROUND;
  const cpla = leaders(g).find(([l]) => l >= 87 && l <= 155)!;
  const [cx, cy] = [cpla[1] % g.width, Math.floor(cpla[1] / g.width)];
  g.spotted[cpla[1]] = 0;
  let r = resolveAirstrike(g, 2, a, cx, cy);
  assert.equal(r.found, false); // CCF_INTERVENTION 15: 15 + 6 > 20, still hidden
  assert.equal(g.spotted[cpla[1]], 0);
  g.ccfIntervention = 14; // 14 + 6 = 20: no longer hidden
  r = resolveAirstrike(g, 2, a, cx, cy);
  assert.equal(r.found, true);
  assert.equal(g.spotted[cpla[1]], 1);
  assert.equal(r.forces[0].named, false); // level 1: "Enemy unit"
  g.ccfIntervention = 15;
  r = resolveAirstrike(g, 2, a, cx, cy);
  assert.equal(r.found, true); // already spotted: the stealth only stops new spotting
  const empty = g.possession.findIndex((p, i) => p === 2 && g.stacks[i].length === 0 && g.hexes[i].code < 0xa5);
  r = resolveAirstrike(g, 2, a, empty % g.width, Math.floor(empty / g.width));
  assert.equal(r.found, false);
});

test('Marine and Navy air x1.5 next to a force led by USMC infantry (1950s), program target scores', opts, () => {
  const g = load('korea2');
  startNewGame(g);
  g.sky = 1;
  const marines = leaders(g).find(([l]) => unit(g, l).symbol === 12);
  assert.ok(marines, 'a USMC infantry force on the map');
  const [mx, my] = [marines[1] % g.width, Math.floor(marines[1] / g.width)];
  let target: [number, number] | null = null;
  for (let d = 0; d < 6 && !target; d++) {
    const [nx, ny] = neighbor(mx, my, d);
    const i = idx(g, nx, ny);
    if (g.hexes[i].code < 0x58 && !inMigAlley(nx, ny)) target = [nx, ny];
  }
  assert.ok(target);
  assert.ok(marineAdjacent(g, target[0], target[1]));
  const cag = A(g, 5); // Carrier Air Group 5, 18 / 27
  cag.mission = MISSION_GROUND;
  assert.equal(strikeLethality(g, cag, target[0], target[1]), Math.trunc((27 * 3) / 2));
  const usaf = A(g, 12);
  usaf.base = BASE_KOREA;
  assert.equal(strikeLethality(g, usaf, target[0], target[1]), 38);
  // the program picks a spotted enemy force; the UN prefers the front line
  const [tx, ty] = chooseStrikeTarget(g, 2, usaf);
  const ti = idx(g, tx, ty);
  assert.equal(g.possession[ti], 2);
  assert.ok(g.stacks[ti].length > 0);
  assert.equal(strikeTargetError(g, 2, mx, my), 'friendly');
  const manchuria = g.hexes.findIndex((h) => h.code === 0x94);
  assert.equal(strikeTargetError(g, 2, manchuria % g.width, Math.floor(manchuria / g.width)), 'manchuria');
});

test('combat phase: the UN player picks airstrike targets, then ground combat and the second orders phase', opts, () => {
  const g = load('korea2', 5);
  startNewGame(g);
  // korea2 starts with the UN's first orders phase second or first; end phases until combat
  for (const a of g.airUnits) if (a.entryTurn <= 11 && a.exitTurn > 11 && a.airToGround > a.airToAir) a.mission = MISSION_GROUND;
  const planned = strikeUnits(g, 2).map((a) => a.id);
  assert.ok(planned.length >= 4);
  let ev = endPlayerPhase(g);
  if (g.phase === 1) ev = endPlayerPhase(g);
  const strike = ev.find((e) => e.kind === 'airstrikes');
  assert.ok(strike && strike.kind === 'airstrikes');
  assert.equal(strike.player, 2);
  assert.equal(g.phase, 2);
  assert.ok(airstrikesPending(g));
  const next = pendingAirstrike(g)!;
  assert.equal(next.left, strike.count);
  assert.equal(next.unit.id, planned[0]);
  // a friendly hex is refused, an enemy hex is struck
  const friendly = g.possession.findIndex((p) => p === 1);
  assert.deepEqual(flyAirstrike(g, friendly % g.width, Math.floor(friendly / g.width)), { ok: false, error: 'friendly' });
  const [, x, y] = openTarget(g);
  const r = flyAirstrike(g, x, y);
  assert.ok(r.ok && r.result.found);
  assert.equal(pendingAirstrike(g)!.left, strike.count - 1);
  const auto = delegateAirstrikes(g);
  assert.equal(auto.length, 1);
  assert.ok(auto[0].auto);
  // ending the phase lets the program fly the rest, then ground combat runs
  ev = endPlayerPhase(g);
  const air = ev.find((e) => e.kind === 'air');
  assert.ok(air && air.kind === 'air');
  const side = air.report.sides[0];
  assert.equal(side.strikes.length, strike.count);
  assert.equal(side.strikesPlanned, strike.count);
  assert.ok(ev.some((e) => e.kind === 'combat'));
  assert.equal(g.phase, 3);
  assert.equal(g.air, null);
  assert.ok(air.report.redAir && air.report.redAir[1] <= air.report.redAir[0]);

  // Program Control: no stop for targets
  const h = load('korea2', 5);
  startNewGame(h, { airPlayerControl: false });
  let evs = endPlayerPhase(h);
  if (h.phase === 1) evs = endPlayerPhase(h);
  assert.ok(!evs.some((e) => e.kind === 'airstrikes'));
  assert.ok(evs.some((e) => e.kind === 'air') && evs.some((e) => e.kind === 'combat'));
});

test('1995 combat phase: both sides fly, AA fire can hit the striking unit', opts, () => {
  const g = load('korea4', 3);
  startNewGame(g, { airPlayerControl: false });
  let ev = endPlayerPhase(g);
  if (g.phase === 1) ev = endPlayerPhase(g);
  const air = ev.find((e) => e.kind === 'air');
  assert.ok(air && air.kind === 'air');
  assert.deepEqual(air.report.sides.map((s) => s.player), [1, 2]);
  assert.equal(air.report.superiority.length, 2);
  for (const s of air.report.superiority) assert.ok(s.loss >= 0 && s.loss <= 90);
  assert.equal(air.report.redAir, null);
  // AA fire: chance (units hit - 1) / 10
  const h = load('korea4', 4);
  startNewGame(h);
  const nk = A(h, 5);
  nk.mission = MISSION_GROUND;
  const target = leaders(h).find(([l]) => l >= h.firstUnUnit && forceUnits(h, l).length >= 3)!;
  let hits = 0;
  for (let k = 0; k < 300; k++) {
    nk.airToAir = 50; nk.airToGround = 50;
    const r = resolveAirstrike(h, 1, nk, target[1] % h.width, Math.floor(target[1] / h.width));
    if (r.aaHit) { hits++; assert.deepEqual([nk.airToAir, nk.airToGround], [49, 49]); }
  }
  const n = h.stacks[target[1]].reduce((s, l) => s + forceUnits(h, l).length, 0);
  assert.ok(Math.abs(hits / 300 - (Math.min(n, 10) - 1) / 10) < 0.09, `AA ${hits}/300 with ${n} units`);
});
