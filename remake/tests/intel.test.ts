// Intelligence (fog of war) tests against the extracted original data (docs/rules/intel.md).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { MapData, Scenario } from '../src/data/types.ts';
import { createGameState, idx, unit, forceHex, sideOf, POSSESSION_CODE } from '../src/engine/state.ts';
import type { GameState } from '../src/engine/state.ts';
import { reach, pathTo, moveForce, undoMove } from '../src/engine/movement.ts';
import { seaReach, seaMove } from '../src/engine/naval.ts';
import { neighbor, hexDistance } from '../src/engine/hex.ts';
import { chekHex, nearUnspottedEnemy, raiseAround } from '../src/engine/spotting.ts';
import {
  forceIntel, knownForces, hexIntel, viewerSide, strengthReport, misreported, perceivedState, dropRisk,
  STATUS_REPORTED, STATUS_FALSE_REPORT,
} from '../src/engine/intel.ts';
import { startNewGame, forceSpotting } from '../src/engine/turn.ts';

const DATA = join(import.meta.dirname, '..', 'data', 'extracted');
const HAVE_DATA = existsSync(join(DATA, 'map.json'));
const map: MapData = HAVE_DATA ? JSON.parse(readFileSync(join(DATA, 'map.json'), 'utf8')) : (null as unknown as MapData);
const scenario = (id: string): Scenario => JSON.parse(readFileSync(join(DATA, 'scenarios', `${id}.json`), 'utf8'));
const opts = { skip: HAVE_DATA ? false : 'data/extracted missing (run tools/extract/extract.ts)' };

/** A limited-intelligence game in the First Orders Phase of `player`, every hex unspotted. */
function fogGame(id: string, player: 1 | 2, seed = 7): GameState {
  const g = createGameState(map, scenario(id), seed);
  g.limitedIntel = true;
  g.phase = 1;
  g.player = player;
  g.sky = 1;
  g.spotted.fill(0);
  return g;
}

/** Put a unit alone at (x, y), removing it from wherever it was. */
function place(g: GameState, id: number, x: number, y: number) {
  for (const s of g.stacks) { const k = s.indexOf(id); if (k >= 0) s.splice(k, 1); }
  const u = unit(g, id);
  u.attached = 0;
  u.x = x; u.y = y;
  u.status = 0;
  u.move = 0;
  u.readiness = 100;
  g.stacks[idx(g, x, y)].push(id);
}

const neighbours = (x: number, y: number) => [0, 1, 2, 3, 4, 5].map((d) => neighbor(x, y, d));
const adjacent = (a: [number, number], b: [number, number]) => hexDistance(a[0], a[1], b[0], b[1]) === 1;

/**
 * A test area in the middle of South Korea: the column (16, 46..51) and everything within three hexes becomes
 * plain open terrain (code 0x00, no rivers, roads or rails), empty of forces and held by `owner`. The hex list is
 * copied first so the shared map data stays untouched.
 */
function strip(g: GameState, owner: number): { x: number; y0: number } {
  const x = 16, y0 = 46;
  g.hexes = g.hexes.slice();
  for (let y = y0 - 3; y <= y0 + 8; y++) for (let xx = x - 3; xx <= x + 3; xx++) {
    const i = idx(g, xx, y);
    g.hexes[i] = { ...g.hexes[i], code: 0x00, terrain: 'open', river: 0, road: 0, rail: 0, closed: false };
    g.stacks[i] = [];
    g.possession[i] = owner;
  }
  return { x, y0 };
}

const commLeader = (g: GameState) => g.stacks.flat().find((l) => sideOf(unit(g, l)) === 'communist')!;
const unLeader = (g: GameState) => g.stacks.flat().find((l) => sideOf(unit(g, l)) === 'un')!;

test('who sees what: SHOW_HEX / UNIT_INFORMATION levels', opts, () => {
  const g = fogGame('korea1', 2);
  const { x, y0 } = strip(g, POSSESSION_CODE.communist);
  const red = commLeader(g);
  const blue = unLeader(g);
  place(g, red, x, y0);
  const i = idx(g, x, y0);
  assert.equal(viewerSide(g), 'un');
  // unspotted enemy force in its own territory: hidden
  assert.equal(forceIntel(g, 'un', red), 0);
  assert.deepEqual(knownForces(g, 'un', i), []);
  assert.equal(hexIntel(g, 'un', i), 0);
  g.spotted[i] = 1;
  assert.equal(forceIntel(g, 'un', red), 1);
  assert.deepEqual(knownForces(g, 'un', i), [{ leader: red, level: 1 }]);
  g.spotted[i] = 2;
  assert.equal(forceIntel(g, 'un', red), 2);
  g.spotted[i] = 0;
  // own forces and own hexes are always known in full
  assert.equal(forceIntel(g, 'communist', red), 2);
  place(g, blue, x, y0 + 3);
  g.possession[idx(g, x, y0 + 3)] = POSSESSION_CODE.un;
  assert.equal(forceIntel(g, 'un', blue), 2);
  assert.equal(hexIntel(g, 'un', idx(g, x, y0 + 3)), 2);
  // an enemy force drawn in a hex not held by its side (e.g. neutral sea): seen, level 1
  g.possession[i] = 0;
  assert.equal(forceIntel(g, 'un', red), 1);
  g.possession[i] = POSSESSION_CODE.communist;
  // complete intelligence and the end of the game show everything
  g.limitedIntel = false;
  assert.equal(forceIntel(g, 'un', red), 2);
  g.limitedIntel = true;
  g.gameOver = 'test';
  assert.equal(forceIntel(g, 'un', red), 2);
  g.gameOver = null;
  // the viewer: the human side against the computer, the striking side during airstrikes
  g.computerSide = 2;
  assert.equal(viewerSide(g), 'communist');
  g.computerSide = 0;
  g.player = 1;
  assert.equal(viewerSide(g), 'communist');
});

test('strength reports: understrength, and the false report that always says full strength', opts, () => {
  const g = fogGame('korea1', 2);
  const { x, y0 } = strip(g, POSSESSION_CODE.communist);
  const red = commLeader(g);
  place(g, red, x, y0);
  const u = unit(g, red);
  for (const e of u.equipment) e.assigned = e.authorized;
  u.status = STATUS_REPORTED;
  assert.equal(strengthReport(g, red), 'full');
  for (const e of u.equipment) e.assigned = Math.floor(e.authorized / 3);
  assert.equal(strengthReport(g, red), 'under');
  u.status = STATUS_REPORTED | STATUS_FALSE_REPORT;
  assert.equal(misreported(g, red), true);
  assert.equal(strengthReport(g, red), 'full', 'a false report swaps authorised and current strength');
  for (const e of u.equipment) e.assigned = e.authorized;
  assert.equal(strengthReport(g, red), 'full', 'a full-strength force never reads understrength');

  // undecided flags: about one force in three, fixed for the turn, without touching the game RNG
  const rng = g.rng;
  let n = 0, falses = 0;
  for (const l of g.units.keys()) {
    unit(g, l).status = 0;
    const a = misreported(g, l);
    assert.equal(misreported(g, l), a);
    n++;
    if (a) falses++;
  }
  assert.equal(g.rng, rng);
  assert.ok(falses / n > 0.25 && falses / n < 0.42, `false reports ${falses}/${n}`);
});

test('moving next to hidden enemy forces spots them (CHEK_HEX) and stops the move', opts, () => {
  const g = fogGame('korea1', 2);
  const { x, y0 } = strip(g, POSSESSION_CODE.un);
  const blue = unLeader(g);
  const red = commLeader(g);
  place(g, blue, x, y0);
  const path = [1, 2, 3, 4].map((k) => idx(g, x, y0 + k));
  // the enemy sits beside the path, next to the third hex only
  const third: [number, number] = [x, y0 + 3];
  const enemy = neighbours(...third).find(([ex, ey]) => ex !== x && !adjacent([ex, ey], [x, y0 + 2]) && !adjacent([ex, ey], [x, y0 + 4]))
    ?? neighbor(x, y0 + 3, 1);
  place(g, red, enemy[0], enemy[1]);
  const ei = idx(g, enemy[0], enemy[1]);
  g.possession[ei] = POSSESSION_CODE.communist;
  const firstSeen = path.findIndex((p) => adjacent([p % g.width, Math.floor(p / g.width)], enemy));
  assert.ok(firstSeen >= 0 && firstSeen < path.length - 1);

  // the path planned on what the UN player knows goes straight on
  const known = reach(perceivedState(g, 'un'), blue);
  assert.deepEqual(pathTo(known, path[3]), path);
  const res = moveForce(g, blue, path);
  assert.ok(res.ok);
  assert.equal(res.interrupted, 'revealed');
  assert.deepEqual(res.revealed, [ei]);
  assert.equal(g.spotted[ei], 1, 'spotted to level 1');
  assert.equal(forceHex(g, blue), path[firstSeen], 'the move ends where the enemy showed up');
  assert.equal(res.undoable, false, 'no move back after spotting');
  assert.equal(undoMove(g), null);
  assert.equal(forceIntel(g, 'un', red), 1);

  // with complete intelligence the order runs to the end (CHEK_HEX still marks the hex)
  const h = fogGame('korea1', 2);
  h.limitedIntel = false;
  const s = strip(h, POSSESSION_CODE.un);
  place(h, blue, s.x, s.y0);
  place(h, red, enemy[0] - x + s.x, enemy[1] - y0 + s.y0);
  h.possession[idx(h, enemy[0] - x + s.x, enemy[1] - y0 + s.y0)] = POSSESSION_CODE.communist;
  const p2 = [1, 2, 3, 4].map((k) => idx(h, s.x, s.y0 + k));
  const r2 = moveForce(h, blue, p2);
  assert.ok(r2.ok);
  assert.equal(r2.interrupted, undefined);
  assert.equal(forceHex(h, blue), p2[3]);
});

test('a hidden enemy force in the next hex stops the move in front of it', opts, () => {
  const g = fogGame('korea1', 2);
  const { x, y0 } = strip(g, POSSESSION_CODE.un);
  const blue = unLeader(g);
  const red = commLeader(g);
  place(g, blue, x, y0);
  place(g, red, x, y0 + 1);
  const ei = idx(g, x, y0 + 1);
  g.possession[ei] = POSSESSION_CODE.communist;
  // the real reach sees an assault target, the UN player's reach sees empty enemy territory
  assert.equal(reach(g, blue).blocked.get(ei), 'enemy');
  const known = reach(perceivedState(g, 'un'), blue);
  assert.ok(known.nodes.has(ei));
  const before = unit(g, blue).move;
  const res = moveForce(g, blue, pathTo(known, idx(g, x, y0 + 2))!);
  assert.equal(res.ok, false);
  assert.equal(res.error, 'enemyFound');
  assert.equal(g.spotted[ei], 1);
  assert.equal(forceHex(g, blue), idx(g, x, y0));
  assert.equal(unit(g, blue).move, before, 'nothing spent');
  // now the player knows: the hex is an assault target
  assert.equal(reach(perceivedState(g, 'un'), blue).blocked.get(ei), 'enemy');
});

test('move back is refused next to unspotted enemy land (NEAR_THE_FRONT)', opts, () => {
  const g = fogGame('korea1', 2);
  const { x, y0 } = strip(g, POSSESSION_CODE.un);
  const blue = unLeader(g);
  place(g, blue, x, y0);
  // empty enemy territory two hexes east of the second step
  const e = neighbor(x, y0 + 2, 1);
  const ei = idx(g, e[0], e[1]);
  g.possession[ei] = POSSESSION_CODE.communist;
  assert.equal(nearUnspottedEnemy(g, x, y0 + 2, 'un'), true);
  const path = [idx(g, x, y0 + 1), idx(g, x, y0 + 2)];
  const res = moveForce(g, blue, path);
  assert.ok(res.ok);
  assert.equal(res.undoable, false);
  assert.equal(res.interrupted, undefined, 'empty territory does not stop the move');
  assert.equal(g.spotted[ei], 0, 'empty hexes are not spotted by CHEK_HEX');
  // spotted to level 1 it no longer blocks the move back
  const h = fogGame('korea1', 2);
  const s = strip(h, POSSESSION_CODE.un);
  place(h, blue, s.x, s.y0);
  const e2 = neighbor(s.x, s.y0 + 2, 1);
  h.possession[idx(h, e2[0], e2[1])] = POSSESSION_CODE.communist;
  h.spotted[idx(h, e2[0], e2[1])] = 1;
  const r2 = moveForce(h, blue, [idx(h, s.x, s.y0 + 1), idx(h, s.x, s.y0 + 2)]);
  assert.ok(r2.ok);
  assert.equal(r2.undoable, true);
  // complete intelligence: never
  h.limitedIntel = false;
  h.spotted.fill(0);
  assert.ok(undoMove(h) !== null);
  const r3 = moveForce(h, blue, [idx(h, s.x, s.y0 + 1), idx(h, s.x, s.y0 + 2)]);
  assert.equal(r3.undoable, true);
});

test('Communist forces past 12 movement points may be spotted (MOVE_UNIT 3A01)', opts, () => {
  const g = fogGame('korea1', 1);
  const { x, y0 } = strip(g, POSSESSION_CODE.communist);
  const red = commLeader(g);
  place(g, red, x, y0);
  unit(g, red).move = 9;
  g.sky = 0; // RND(1,4) > sky always
  const res = moveForce(g, red, [idx(g, x, y0 + 1), idx(g, x, y0 + 2), idx(g, x, y0 + 3)]);
  assert.ok(res.ok);
  assert.equal(unit(g, red).move, 15);
  assert.equal(g.spotted[idx(g, x, y0 + 1)], 0, 'MOVE 11: no roll');
  assert.equal(g.spotted[idx(g, x, y0 + 2)], 1, 'MOVE 13: spotted');
  assert.equal(g.spotted[idx(g, x, y0 + 3)], 1);
  // storms: RND(1,4) must be 4; UN forces never roll
  const h = fogGame('korea1', 2);
  const s = strip(h, POSSESSION_CODE.un);
  const blue = unLeader(h);
  place(h, blue, s.x, s.y0);
  unit(h, blue).move = 12;
  const rng = h.rng;
  assert.ok(moveForce(h, blue, [idx(h, s.x, s.y0 + 1), idx(h, s.x, s.y0 + 2)]).ok);
  assert.equal(h.rng, rng);
});

test('retreats raise the spotting of the hexes around (GRCMBT 14B3), FORCE_SPOTTING, chekHex', opts, () => {
  const g = fogGame('korea1', 2);
  const { x, y0 } = strip(g, POSSESSION_CODE.un);
  const c: [number, number] = [x, y0 + 2];
  const around = neighbours(...c).map(([nx, ny]) => idx(g, nx, ny));
  g.possession[around[0]] = POSSESSION_CODE.communist;
  g.possession[around[1]] = POSSESSION_CODE.communist;
  g.spotted[around[1]] = 2;
  raiseAround(g, ...c);
  assert.equal(g.spotted[around[0]], 1);
  assert.equal(g.spotted[around[1]], 2, 'never above 2');
  assert.equal(g.spotted[around[2]], 0, 'same possession: unchanged');
  raiseAround(g, ...c);
  assert.equal(g.spotted[around[0]], 2);

  // CHEK_HEX: only occupied hexes of another possession
  const h = fogGame('korea1', 2);
  const s = strip(h, POSSESSION_CODE.un);
  const red = commLeader(h);
  const n0 = neighbor(s.x, s.y0 + 2, 0), n1 = neighbor(s.x, s.y0 + 2, 1);
  h.possession[idx(h, ...n0)] = POSSESSION_CODE.communist;
  h.possession[idx(h, ...n1)] = POSSESSION_CODE.communist;
  place(h, red, ...n1);
  assert.deepEqual(chekHex(h, s.x, s.y0 + 2), [idx(h, ...n1)]);
  // FORCE_SPOTTING before each phase spots both sides of a contact
  const blue = unLeader(h);
  place(h, blue, s.x, s.y0 + 2);
  h.spotted.fill(0);
  forceSpotting(h);
  assert.equal(h.spotted[idx(h, ...n1)], 1);
  assert.equal(h.spotted[idx(h, s.x, s.y0 + 2)], 1);
});

test('a new game keeps the file spotting with limited intelligence; dropRisk', opts, () => {
  const g = createGameState(map, scenario('korea3'), 5);
  const file = g.spotted.slice();
  startNewGame(g, { limitedIntel: true });
  assert.ok(g.limitedIntel);
  // FORCE_SPOTTING may only raise levels
  for (let i = 0; i < file.length; i++) assert.ok(g.spotted[i] >= file[i]);
  const h = createGameState(map, scenario('korea3'), 5);
  startNewGame(h, { limitedIntel: false });
  assert.ok(h.spotted.every((v) => v === 2));

  const f = fogGame('korea1', 2);
  const { x, y0 } = strip(f, POSSESSION_CODE.communist);
  const red = commLeader(f);
  place(f, red, x, y0);
  assert.equal(dropRisk(f, 'un', idx(f, x, y0)), 'unknown');
  assert.equal(dropRisk(f, 'un', idx(f, x, y0 + 2)), 'unknown', 'empty enemy land looks the same');
  f.spotted[idx(f, x, y0)] = 1;
  assert.equal(dropRisk(f, 'un', idx(f, x, y0)), 'enemy');
  f.spotted[idx(f, x, y0 + 2)] = 1;
  assert.equal(dropRisk(f, 'un', idx(f, x, y0 + 2)), null);
});

test('landing on a hidden enemy coast spots it instead of moving (sea movement)', opts, () => {
  const g = createGameState(map, scenario('korea2'), 11);
  g.limitedIntel = true;
  g.phase = 1;
  g.player = 2;
  g.sky = 1;
  g.spotted.fill(0);
  const MARINES = 212;
  const inchon = idx(g, 12, 41);
  assert.ok(g.stacks[inchon].length > 0);
  assert.equal(seaReach(g, MARINES).blocked.get(inchon), 'enemy');
  const known = seaReach(perceivedState(g, 'un'), MARINES);
  assert.ok(known.nodes.has(inchon), 'looks like an empty beach');
  const res = seaMove(g, MARINES, pathTo(known, inchon)!);
  assert.equal(res.ok, false);
  assert.equal(res.error, 'enemyFound');
  assert.equal(g.spotted[inchon], 1);
  assert.equal(g.sealiftDemand, 0, 'nothing embarked');
  assert.equal(seaReach(perceivedState(g, 'un'), MARINES).blocked.get(inchon), 'enemy');
});
