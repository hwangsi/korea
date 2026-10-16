// Computer player tests (docs/rules/ai.md): the original Communist player WARRIORS.KIM and the shared AISUBS code.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { MapData, Scenario } from '../src/data/types.ts';
import { createGameState, idx, forceUnits, forceHex, unit, rnd } from '../src/engine/state.ts';
import type { GameState } from '../src/engine/state.ts';
import { startNewGame, endPlayerPhase } from '../src/engine/turn.ts';
import { hexDistance } from '../src/engine/hex.ts';
import { assaultTarget } from '../src/engine/combat.ts';
import { saveGame, loadGame } from '../src/engine/save.ts';
import { kimOrders } from '../src/engine/ai/kim.ts';
import { computerPlayer, aiAvailable } from '../src/engine/ai/index.ts';
import {
  ROUTES, routePoint, routeOf, withdraw, stronger, sortForce, clearPlotsFull, plotAttack, updateForceState, NO_ROUTE,
} from '../src/engine/ai/common.ts';

const DATA = join(import.meta.dirname, '..', 'data', 'extracted');
const HAVE_DATA = existsSync(join(DATA, 'map.json'));
const map: MapData = HAVE_DATA ? JSON.parse(readFileSync(join(DATA, 'map.json'), 'utf8')) : (null as unknown as MapData);
const scenario = (id: string): Scenario => JSON.parse(readFileSync(join(DATA, 'scenarios', `${id}.json`), 'utf8'));
const opts = { skip: HAVE_DATA ? false : 'data/extracted missing (run tools/extract/extract.ts)' };

/** Every force leader sits in exactly one hex with all its units, at most two forces per hex. */
function checkStacks(g: GameState) {
  const seen = new Set<number>();
  for (let i = 0; i < g.stacks.length; i++) {
    const s = g.stacks[i];
    assert.ok(s.length <= 2, `hex ${i} holds ${s.length} forces`);
    for (const l of s) {
      for (const u of forceUnits(g, l)) {
        assert.ok(!seen.has(u.id), `unit ${u.id} in two forces`);
        seen.add(u.id);
        assert.equal(idx(g, u.x, u.y), i, `unit ${u.id} of force ${l} is not in its leader's hex`);
      }
    }
  }
}

test('the invasion routes (WARRIORS unit init 5E4A)', () => {
  assert.equal(ROUTES.length, 4);
  for (const r of ROUTES) assert.equal(r.length, 72);
  const len = (k: number) => ROUTES[k].filter((p) => p[0] || p[1]).length;
  assert.equal(len(0), 71, 'west: Sinuiju .. Pusan');
  assert.equal(len(1), 72, 'east: Unggi .. Pusan');
  for (const k of [0, 1]) {
    const pts = ROUTES[k].filter((p) => p[0] || p[1]);
    for (let i = 1; i < pts.length; i++) assert.equal(hexDistance(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1]), 1, `route ${k} step ${i}`);
    assert.deepEqual(pts[pts.length - 1], [26, 59], 'both end at Pusan');
  }
  assert.deepEqual(ROUTES[0][0], [0, 22]);
  assert.deepEqual(ROUTES[1][0], [33, 6]);
  for (let j = 0; j < 72; j++) {
    assert.deepEqual(ROUTES[2][j], ROUTES[0][71 - j]);
    assert.deepEqual(ROUTES[3][j], ROUTES[1][71 - j]);
  }
  // one point past a row is read from the next row
  assert.deepEqual(routePoint(1, 72), [0, 0]);
  assert.deepEqual(routePoint(2, 72), [26, 59]);
});

test('registry: the original players of both sides exist, the improved ones are planned', () => {
  assert.equal(computerPlayer(1, 'original')?.id, 'kim');
  assert.equal(computerPlayer(2, 'original')?.id, 'walton');
  assert.equal(aiAvailable(1, 'original'), true);
  assert.equal(aiAvailable(2, 'original'), true);
  assert.equal(aiAvailable(1, 'improved'), false);
  assert.equal(aiAvailable(2, 'improved'), false);
});

test('Dragon Wakes opening: the deployment plots stand, force 18 is sent against Seoul (KIM 2A1D)', opts, () => {
  const g = createGameState(map, scenario('korea1s'), 7);
  g.computerSide = 1; g.competence = 3; g.phase = 1; g.player = 1;
  const before = new Map<number, string>();
  for (let l = 1; l < g.firstUnUnit; l++) if (forceHex(g, l) >= 0 && l !== 18) before.set(l, `${unit(g, l).x},${unit(g, l).y},${unit(g, l).move}`);
  const rng = g.rng;
  const r = kimOrders(g);
  assert.equal(g.rng, rng, 'the opening phase draws no random numbers');
  for (const [l, p] of before) assert.equal(`${unit(g, l).x},${unit(g, l).y},${unit(g, l).move}`, p, `force ${l} kept its planned orders`);
  assert.deepEqual(g.stacks[idx(g, 15, 40)], [10]);
  assert.deepEqual(g.stacks[idx(g, 14, 39)], [18]);
  assert.equal(g.possession[idx(g, 14, 39)], 2);
  assert.equal(g.spotted[idx(g, 14, 39)], 2);
  assert.equal(unit(g, 18).move, 816);
  assert.deepEqual(assaultTarget(g, 18), [14, 40], 'assault south onto Seoul');
  assert.deepEqual(r.notices.map((n) => n.unit), ['ROK 3/7 Inf Rgt', 'ROK 8/7 Inf Rgt']);
  for (const af of g.airfields) if (g.possession[idx(g, af.x, af.y)] === 2) assert.equal(af.current, 0);
  checkStacks(g);
});

test('AISUBS: KIM\'s WITHDRAW(+1) is a no-op, STRONGER always draws RND(1,5)', opts, () => {
  const g = createGameState(map, scenario('korea1s'), 11);
  const rng = g.rng;
  assert.deepEqual(withdraw(g, 1, 16, 45), [16, 45]);
  assert.equal(g.rng, rng, 'no random number drawn');
  // WALTON's direction (-1) looks one row south
  const [x, y] = withdraw(g, -1, 16, 45);
  assert.equal(hexDistance(16, 45, x, y), 1);
  assert.ok(y >= 45);
  // exactly one draw, whatever the competence (the Communist side only looks when competence >= the roll)
  for (const competence of [1, 5]) {
    g.competence = competence;
    const probe = createGameState(map, scenario('korea1s'), 1);
    probe.rng = g.rng;
    rnd(probe, 1, 5);
    stronger(g, 18, 15, 40);
    assert.equal(g.rng, probe.rng);
  }
});

test('SORT_FORCE puts infantry first; CLEAR_PLOTS refunds a computer assault completely', opts, () => {
  const g = createGameState(map, scenario('korea1s'), 5);
  const at = forceHex(g, 10);
  const x = at % g.width, y = Math.floor(at / g.width);
  const members = forceUnits(g, 10);
  sortForce(g, x, y, 0);
  const sorted = forceUnits(g, g.stacks[at][0]);
  assert.equal(sorted.length, members.length);
  const kinds = sorted.map((u) => (u.symbol % 10 === 2 ? 0 : 1));
  assert.deepEqual(kinds, kinds.slice().sort(), 'infantry, then the rest');

  g.computerSide = 1;
  const lead = g.stacks[at][0];
  for (const u of forceUnits(g, lead)) { u.move = 0; u.status = 0x40; }
  plotAttack(g, lead, x, y, x, y + 1);
  assert.ok(forceUnits(g, lead).every((u) => u.move === 806 && (u.status & 0x40) === 0));
  clearPlotsFull(g, lead);
  assert.ok(forceUnits(g, lead).every((u) => u.move === 0 && (u.status & 0x40) !== 0 && (u.status & 0x04) === 0));
  // a human side keeps the spent point
  g.computerSide = 0;
  plotAttack(g, lead, x, y, x, y + 1);
  clearPlotsFull(g, lead);
  assert.ok(forceUnits(g, lead).every((u) => u.move === 1));
  // UPDATE_FORCE_STATE: readiness - (cost - 1)
  const r0 = unit(g, lead).readiness;
  updateForceState(g, lead, x, y, 3);
  assert.equal(unit(g, lead).readiness, r0 - 2);
});

test('route of a force (WARRIORS 0605)', opts, () => {
  const g = createGameState(map, scenario('korea1s'), 1);
  const u = unit(g, 18);
  u.x = 15; u.y = 39;
  assert.equal(routeOf(g, 18), 0, 'on the western route');
  u.x = 26; u.y = 59;
  assert.equal(routeOf(g, 18), NO_ROUTE, 'Pusan has no next point');
  u.x = 20; u.y = 22;
  assert.equal(routeOf(g, 18), 1, 'Sinpo on the eastern route');
});

test('KIM plays every scenario: forces stay consistent, the same seed plays the same game', opts, () => {
  for (const id of ['korea1s', 'korea2s', 'korea3s', 'korea4s', 'korea1']) {
    const run = () => {
      const g = createGameState(map, scenario(id), 2024);
      let events = startNewGame(g, { computerSide: 1, limitedIntel: true, competence: 3 });
      let moved = 0, assaults = 0;
      const end = g.turn + 7;
      for (let k = 0; k < 40 && !g.gameOver && g.turn < end; k++) {
        for (const e of events) if (e.kind === 'computerPhase' && e.report) { moved += e.report.moved.length; assaults += e.report.assaults; }
        checkStacks(g);
        events = endPlayerPhase(g);
      }
      return { g, moved, assaults };
    };
    const a = run(), b = run();
    assert.ok(a.moved > 20, `${id}: the computer moves (${a.moved})`);
    // invasions attack; at Chromite the NKPA is far weaker than the Pusan perimeter and calls its assaults off (1F3F part 2)
    if (id === 'korea1s' || id === 'korea4s' || id === 'korea1') assert.ok(a.assaults > 0, `${id}: the computer attacks (${a.assaults})`);
    const s = (g: GameState) => { const f = saveGame(g, null, new Date(0)).state; delete f.version; return f; };
    assert.deepEqual(s(b.g), s(a.g), `${id}: reproducible`);
  }
});

test('a saved game against KIM goes on exactly as before', opts, () => {
  const g = createGameState(map, scenario('korea1s'), 99);
  startNewGame(g, { computerSide: 1, limitedIntel: true });
  for (let k = 0; k < 5; k++) endPlayerPhase(g);
  const h = loadGame(saveGame(g), map, scenario('korea1s'));
  for (let k = 0; k < 6; k++) {
    endPlayerPhase(g);
    endPlayerPhase(h);
  }
  const s = (x: GameState) => { const f = saveGame(x, null, new Date(0)).state; delete f.version; return f; };
  assert.deepEqual(s(h), s(g));
});

// ---------- WALTON (docs/rules/ai.md 6) ----------

/** Red Solitaire: the computer plays the UN, until turn `until` begins. */
function redSolitaire(id: string, seed: number, until: number) {
  const g = createGameState(map, scenario(id), seed);
  let events = startNewGame(g, { computerSide: 2, limitedIntel: true, competence: 3 });
  let moved = 0, assaults = 0, merged = 0;
  for (let k = 0; k < 60 && !g.gameOver && g.turn < until; k++) {
    for (const e of events) if (e.kind === 'computerPhase' && e.report) { moved += e.report.moved.length; assaults += e.report.assaults; merged += e.report.merged; }
    checkStacks(g);
    events = endPlayerPhase(g);
  }
  return { g, moved, assaults, merged };
}

test('WALTON plays every scenario: forces stay consistent, the same seed plays the same game', opts, () => {
  for (const id of ['korea1', 'korea2', 'korea3', 'korea4']) {
    const start = scenario(id).turn;
    const a = redSolitaire(id, 2024, start + 6), b = redSolitaire(id, 2024, start + 6);
    assert.ok(a.moved > 20, `${id}: the computer moves (${a.moved})`);
    assert.ok(a.merged > 0, `${id}: forces sharing a hex are merged (${a.merged})`);
    if (id === 'korea2') assert.ok(a.assaults > 0, `${id}: the UN counter-attacks after Inch'on (${a.assaults})`);
    const s = (g: GameState) => { const f = saveGame(g, null, new Date(0)).state; delete f.version; return f; };
    assert.deepEqual(s(b.g), s(a.g), `${id}: reproducible`);
  }
});

test('Chromite: the 7th Division lands at Inch\'on or Kunsan on the first UN phase (38CA, 3828)', opts, () => {
  const seen = new Set<string>();
  for (const seed of [1, 2, 3, 4, 5]) {
    const g = createGameState(map, scenario('korea2'), seed);
    startNewGame(g, { computerSide: 2, limitedIntel: false });
    assert.equal(g.player, 1, 'the Communist player moves first on turn 11');
    assert.equal(unit(g, 216).x, 33, 'the 31st RCT waits in Japan');
    endPlayerPhase(g);
    assert.ok(g.sealiftDemand >= 3, 'three sealift points for the landing');
    const at = `${unit(g, 215).x},${unit(g, 215).y}`;
    assert.ok(['12,41', '11,42', '12,52', '11,53'].includes(at), `landed at ${at}`);
    assert.equal(`${unit(g, 216).x},${unit(g, 216).y}`, at, 'both RCTs together');
    // 5D9D: UN-held airfields are back in action after the UN phase
    for (const af of g.airfields) if (g.possession[idx(g, af.x, af.y)] === 1) assert.ok(af.current >= 1);
    seen.add(at);
    checkStacks(g);
  }
  assert.ok(seen.has('12,41'), 'Inch\'on is the first choice (70%)');
});

test('Dragon Wakes turn 3: the 1st Cavalry Division forms and lands at P\'ohang (47E3)', opts, () => {
  const g = createGameState(map, scenario('korea1'), 7);
  startNewGame(g, { computerSide: 2, limitedIntel: false });
  while (g.turn < 4) endPlayerPhase(g);
  assert.equal(unit(g, 194).forceName, 'US 1st Cav Div');
  assert.ok(forceHex(g, 194) >= 0, 'the 8th Cavalry leads the division');
  const members = forceUnits(g, 194).map((u) => u.id);
  for (const id of [197, 198, 199]) assert.ok(members.includes(id), `unit ${id} is in the division`);
  checkStacks(g);
});

test('1995 turn 0: the ROK army artillery groups are formed (3B0E), ROK corps are numbered without IV (2C85)', opts, () => {
  const g = createGameState(map, scenario('korea4'), 7);
  startNewGame(g, { computerSide: 2, limitedIntel: false });
  while (g.turn === 0) endPlayerPhase(g);
  const group = (x: number, y: number) => {
    const l = g.stacks[idx(g, x, y)].find((f) => /Army Arty/.test(unit(g, f).forceName));
    return l ? { name: unit(g, l).forceName, units: forceUnits(g, l).map((u) => u.id) } : null;
  };
  assert.deepEqual(group(15, 41), { name: 'ROK 1 Army Arty', units: [0x86, 0x88, 0x89, 0x8a] });
  assert.deepEqual(group(17, 40), { name: 'ROK 2 Army Arty', units: [0x85, 0x87] });
  assert.deepEqual(group(20, 38), { name: 'ROK 3 Army Arty', units: [0x84, 0x8b] });
  const corps = [...g.units.values()].map((u) => u.forceName).filter((n) => /^ROK [IVXL]+ Corps$/.test(n));
  assert.ok(corps.length > 0, 'merged ROK divisions become corps');
  assert.ok(!corps.includes('ROK IV Corps'), 'four is skipped');
  checkStacks(g);
});

test('a saved game against WALTON goes on exactly as before', opts, () => {
  const g = createGameState(map, scenario('korea2'), 31);
  startNewGame(g, { computerSide: 2, limitedIntel: true });
  for (let k = 0; k < 4; k++) endPlayerPhase(g);
  const h = loadGame(saveGame(g), map, scenario('korea2'));
  for (let k = 0; k < 6; k++) {
    endPlayerPhase(g);
    endPlayerPhase(h);
  }
  const s = (x: GameState) => { const f = saveGame(x, null, new Date(0)).state; delete f.version; return f; };
  assert.deepEqual(s(h), s(g));
});
