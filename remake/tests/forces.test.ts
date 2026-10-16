// Force organisation tests (docs/rules/forces.md): the FULL HEX REPORT transfers, names and the screen values.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { MapData, Scenario } from '../src/data/types.ts';
import { createGameState, idx, unit, forceUnits, STATUS_MOVED } from '../src/engine/state.ts';
import type { GameState } from '../src/engine/state.ts';
import { unitStrength, STATUS_BURIED } from '../src/engine/combat.ts';
import { moveForce, undoMove, reach, pathTo } from '../src/engine/movement.ts';
import {
  transferCheck, transferUnit, renameForce, canRename, organizeBlock, nextOrganizeHex, hexModifiers, forcePresence, hexSlots,
  MERGED_X, MERGED_Y,
} from '../src/engine/forces.ts';
import { saveGame, saveToText, parseSave, loadGame } from '../src/engine/save.ts';

const DATA = join(import.meta.dirname, '..', 'data', 'extracted');
const HAVE_DATA = existsSync(join(DATA, 'map.json'));
const map: MapData = HAVE_DATA ? JSON.parse(readFileSync(join(DATA, 'map.json'), 'utf8')) : (null as unknown as MapData);
const scenario = (id: string): Scenario => JSON.parse(readFileSync(join(DATA, 'scenarios', `${id}.json`), 'utf8'));
const opts = { skip: HAVE_DATA ? false : 'data/extracted missing (run tools/extract/extract.ts)' };

const chain = (g: GameState, leader: number) => forceUnits(g, leader).map((u) => u.id);
const stack = (g: GameState, x: number, y: number) => g.stacks[idx(g, x, y)];

/** Put units `ids` into hex x, y as one force (in this order) after the forces already there. */
function placeForce(g: GameState, x: number, y: number, ids: number[]) {
  ids.forEach((id, k) => {
    const u = unit(g, id);
    u.x = x; u.y = y;
    u.attached = ids[k + 1] ?? 0;
  });
  stack(g, x, y).push(ids[0]);
}

test('split a unit into a new force, then join it back (232C, 218D, 2103)', opts, () => {
  const g = createGameState(map, scenario('korea1'), 1);
  // (25,20): NKPA 50/15 Inf Rgt with the 10/15 Arty Rgt, the only force of the hex
  assert.deepEqual(hexSlots(g, 25, 20), [[46, 47], []]);
  const c = transferCheck(g, 25, 20, 47);
  assert.equal(c.allowed, true);
  assert.equal(c.kind, 'split');
  const r = transferUnit(g, 25, 20, 47);
  assert.ok(r.ok);
  assert.deepEqual(stack(g, 25, 20), [46, 47]);
  assert.deepEqual(chain(g, 46), [46]);
  assert.equal(unit(g, 47).forceName, 'NKPA 10/15 Arty Rgt+', 'NAME1 := NAME + "+"');
  // back again: SORT_FORCE keeps the infantry regiment in front
  const r2 = transferUnit(g, 25, 20, 47);
  assert.ok(r2.ok);
  assert.equal(r2.kind, 'join');
  assert.deepEqual(stack(g, 25, 20), [46]);
  assert.deepEqual(chain(g, 46), [46, 47]);
  // (22,36): two lone regiments, one may join the other
  assert.equal(transferCheck(g, 22, 36, 20).kind, 'join');
  assert.equal(transferCheck(g, 22, 36, 20).allowed, true);
  // a lone unit that is the only force of its hex would only become its own force again (remake: not offered)
  transferUnit(g, 22, 36, 20);
  const alone = transferCheck(g, 25, 19, 44);
  assert.equal(alone.kind, 'join', '(25,19) has two forces too');
  stack(g, 25, 19).pop();
  assert.equal(transferCheck(g, 25, 19, 44).reason, 'alone');
});

test('the leader leaves: the next unit leads, the empty first slot takes the second force (2888)', opts, () => {
  const g = createGameState(map, scenario('korea1'), 1);
  // (11,37): [20/1 Inf, 203 Tank] + [24/1 Inf, 7/1 Arty]
  assert.deepEqual(stack(g, 11, 37), [1, 4]);
  const r = transferUnit(g, 11, 37, 1);
  assert.ok(r.ok);
  assert.deepEqual(chain(g, 2), [2]);
  // SORT_FORCE: infantry first in the old order (24/1, then the appended 20/1), then the artillery
  assert.deepEqual(chain(g, 4), [4, 1, 5]);
  assert.deepEqual(stack(g, 11, 37), [2, 4]);
  // the tank regiment goes too: the first slot is empty and takes the second force
  transferUnit(g, 11, 37, 2);
  assert.deepEqual(stack(g, 11, 37), [4]);
  assert.deepEqual(chain(g, 4), [4, 1, 5, 2]);
});

test('limits: six units, four infantry, nationality, at sea (232C)', opts, () => {
  const g = createGameState(map, scenario('korea1'), 1);
  // a five-unit force (four infantry) next to a lone infantry regiment and a lone tank regiment
  const { x, y } = map.hexes.find((h) => h.code === 0x00 && h.y > 40 && h.x > 10)!;
  stack(g, x, y).length = 0;
  placeForce(g, x, y, [48, 49, 50, 51, 30]);
  placeForce(g, x, y, [52]);
  assert.equal(chain(g, 48).filter((id) => unit(g, id).symbol % 10 === 2).length, 4);
  const inf = transferCheck(g, x, y, 52);
  assert.equal(inf.allowed, false);
  assert.equal(inf.reason, 'infantry');
  // a tank regiment may still join (the infantry limit is for infantry only), and makes six
  stack(g, x, y)[1] = 2;
  unit(g, 2).x = x; unit(g, 2).y = y; unit(g, 2).attached = 0;
  assert.equal(transferCheck(g, x, y, 2).allowed, true);
  transferUnit(g, x, y, 2);
  assert.equal(chain(g, 48).length, 6);
  // six units: nothing more
  placeForce(g, x, y, [11]);
  const full = transferCheck(g, x, y, 11);
  assert.equal(full.reason, 'full');
  // nationality: the leaders of the two forces must be of one group (US/USMC/CW/UN together, ROK, NKPA, CPLA alone)
  const k2 = createGameState(map, scenario('korea2'), 1);
  stack(k2, 24, 53).length = 0;
  placeForce(k2, 24, 53, [194]);
  placeForce(k2, 24, 53, [158]);
  assert.equal(transferCheck(k2, 24, 53, 194).reason, 'nationality');
  stack(k2, 24, 53).length = 0;
  placeForce(k2, 24, 53, [194]);
  placeForce(k2, 24, 53, [200]);
  assert.equal(transferCheck(k2, 24, 53, 194).allowed, true);
  // never at sea
  const sea = map.hexes.find((h) => h.code >= 0xa5 && h.code <= 0xda && h.y > 30)!;
  stack(k2, sea.x, sea.y).length = 0;
  placeForce(k2, sea.x, sea.y, [194, 200]);
  assert.equal(transferCheck(k2, sea.x, sea.y, 200).reason, 'atSea');
});

test('movement: the force moves together, plotted assaults need six points (2518..2886)', opts, () => {
  const g = createGameState(map, scenario('korea1'), 1);
  // (11,37): [1, 2] + [4, 5]; NKPA rate 18
  for (const id of [1, 2]) unit(g, id).move = 7;
  for (const id of [4, 5]) unit(g, id).move = 3;
  const c = transferCheck(g, 11, 37, 2);
  assert.equal(c.cost, 4);
  transferUnit(g, 11, 37, 2);
  assert.deepEqual([4, 5, 2].map((id) => unit(g, id).move), [7, 7, 7], 'the receiving force spent as much as the unit');

  // a force with a plotted assault (MOVE = direction*100 + 6 + used)
  const h = createGameState(map, scenario('korea1'), 1);
  for (const id of [4, 5]) unit(h, id).move = 806;
  unit(h, 2).move = 13; // 5 points left
  const no = transferCheck(h, 11, 37, 2);
  assert.equal(no.allowed, false);
  assert.equal(no.reason, 'assaultMove');
  unit(h, 2).move = 12; // 6 points left: allowed, and the force has to spend what the unit spent
  const yes = transferCheck(h, 11, 37, 2);
  assert.equal(yes.allowed, true);
  assert.equal(yes.joinsAssault, true);
  assert.equal(yes.cost, 12);
  transferUnit(h, 11, 37, 2);
  assert.deepEqual([4, 5, 2].map((id) => unit(h, id).move), [818, 818, 818]);
  const p = forcePresence(h, 4, 11, 37);
  assert.equal(p.assault, true);
  assert.equal(p.movement, 18 - 18 + 5, 'the screen adds back the reserved five points');

  // the unit's own plot is dropped when it joins a force without one (1 point of it stays spent)
  const k = createGameState(map, scenario('korea1'), 1);
  for (const id of [1, 2]) unit(k, id).move = 806;
  for (const id of [4, 5]) unit(k, id).move = 3;
  const d = transferCheck(k, 11, 37, 2);
  assert.equal(d.dropsAssault, true);
  transferUnit(k, 11, 37, 2);
  assert.equal(unit(k, 2).move, 3);
  assert.equal(unit(k, 1).move, 806, 'the rest of the old force keeps its plot');
  // both plotted, the unit spent at least as much as the force: allowed even with few points left (sic)
  const m = createGameState(map, scenario('korea1'), 1);
  for (const id of [1, 2]) unit(m, id).move = 815;
  for (const id of [4, 5]) unit(m, id).move = 506;
  assert.equal(transferCheck(m, 11, 37, 2).allowed, true);
});

test('moved status spreads with SORT_FORCE; a transfer ends the movement undo', opts, () => {
  const g = createGameState(map, scenario('korea1'), 1);
  unit(g, 2).status |= STATUS_MOVED;
  for (const id of [4, 5]) unit(g, id).status &= ~STATUS_MOVED;
  transferUnit(g, 11, 37, 2);
  assert.ok([4, 5, 2].every((id) => unit(g, id).status & STATUS_MOVED));
  // undo after a transfer would restore an old chain: it is gone
  const h = createGameState(map, scenario('korea1'), 1);
  const r = reach(h, 46);
  const target = [...r.nodes.values()].find((n) => n.canStop && n.hex !== r.origin && !n.captures)!;
  const path = pathTo(r, target.hex)!;
  const res = moveForce(h, 46, path);
  assert.ok(res.ok && h.undo, 'an undoable move inside own territory');
  renameForce(h, 46, 'Rename keeps undo');
  assert.ok(h.undo, 'a rename keeps the undo');
  undoMove(h);
  assert.equal(unit(h, 46).forceName, 'Rename keeps undo', 'and the name survives it');
  moveForce(h, 46, path);
  transferUnit(h, unit(h, 46).x, unit(h, 46).y, 47);
  assert.equal(h.undo, null);
});

test('Task Force Smith is merged into the first infantry unit (2602..271D)', opts, () => {
  const g = createGameState(map, scenario('korea1'), 1);
  const rct = [...g.units.values()].find((u) => u.name === 'US 21/24 Inf RCT')!;
  const smith = unit(g, 187);
  const x = 24, y = 54;
  stack(g, x, y).length = 0;
  placeForce(g, x, y, [rct.id]);
  placeForce(g, x, y, [187]);
  // nobody joins Task Force Smith
  const toSmith = transferCheck(g, x, y, rct.id);
  assert.equal(toSmith.reason, 'smithForce');
  const before = rct.equipment.map((e) => e.assigned);
  const c = transferCheck(g, x, y, 187);
  assert.equal(c.kind, 'merge');
  assert.equal(c.mergeInto, rct.id);
  transferUnit(g, x, y, 187);
  assert.deepEqual(rct.equipment.slice(0, 2).map((e) => e.assigned), [before[0] + 6, before[1] + 2], 'rifle and weapons platoons');
  assert.deepEqual([smith.x, smith.y, smith.status], [MERGED_X, MERGED_Y, STATUS_BURIED], 'like korea2/3 (0,1)/(0,2)');
  assert.deepEqual(stack(g, x, y), [rct.id]);
  assert.deepEqual(chain(g, rct.id), [rct.id]);
});

test('rename: forces of two units or more, 20 characters (203D, 1EAA)', opts, () => {
  const g = createGameState(map, scenario('korea1'), 1);
  assert.equal(canRename(g, 1), true);
  assert.equal(canRename(g, 20), false, 'a lone regiment shows its own name');
  assert.equal(renameForce(g, 20, 'x'), false);
  assert.ok(renameForce(g, 1, 'Kim Task Force with a long name'));
  assert.equal(unit(g, 1).forceName, 'Kim Task Force with');
  assert.ok(renameForce(g, 1, '서울 돌파 집단  '));
  assert.equal(unit(g, 1).forceName, '서울 돌파 집단');
  // names, slots and chains survive a save
  transferUnit(g, 25, 20, 47);
  const file = parseSave(saveToText(saveGame(g)));
  assert.ok(file.ok);
  const back = loadGame(file.file, map, scenario('korea1'));
  assert.equal(unit(back, 1).forceName, '서울 돌파 집단');
  assert.deepEqual(stack(back, 25, 20), [46, 47]);
  assert.equal(unit(back, 47).forceName, 'NKPA 10/15 Arty Rgt+');
});

test('who may organise, + Hex / - Hex (UNIT_INFORMATION, 1CCA, 1D8F)', opts, () => {
  const g = createGameState(map, scenario('korea1'), 1);
  g.phase = 1; g.player = 1; g.computerSide = 0;
  assert.equal(organizeBlock(g, 11, 37), null);
  assert.equal(organizeBlock(g, 14, 40), 'notOwn', 'Seoul is the UN player\'s');
  assert.equal(organizeBlock(g, 12, 50), 'noForces');
  g.player = 2;
  assert.equal(organizeBlock(g, 14, 40), null);
  g.computerSide = 2;
  assert.equal(organizeBlock(g, 14, 40), 'computer');
  g.computerSide = 0; g.phase = 2;
  assert.equal(organizeBlock(g, 14, 40), 'phase');
  // column by column: (25,19) -> (25,20) and back; wrapping from the last column to the first
  g.phase = 1; g.player = 1;
  assert.deepEqual(nextOrganizeHex(g, 25, 19, 1), [25, 20]);
  assert.deepEqual(nextOrganizeHex(g, 25, 20, -1), [25, 19]);
  const own = [] as string[];
  for (let x = 0; x < 34; x++) for (let y = 0; y < 66; y++) {
    const i = idx(g, x, y);
    if (g.stacks[i].length && g.possession[i] === 2) own.push(`${x},${y}`);
  }
  assert.deepEqual(nextOrganizeHex(g, 33, 65, 1).join(','), own[0]);
  assert.deepEqual(nextOrganizeHex(g, 0, 0, -1).join(','), own[own.length - 1]);
});

test('screen values: geography and military presence (196C, 0AAC)', opts, () => {
  const g = createGameState(map, scenario('korea1'), 1);
  assert.deepEqual(hexModifiers(g, 7, 29), { lethality: 1, hardSurvival: 2, softSurvival: 3 }, 'Pyongyang (city)');
  const mountain = map.hexes.find((h) => h.code === 0x92)!;
  assert.deepEqual(hexModifiers(g, mountain.x, mountain.y), { lethality: 1, hardSurvival: 0.5, softSurvival: 2 });
  const rough = map.hexes.find((h) => h.code === 0x58)!;
  assert.deepEqual(hexModifiers(g, rough.x, rough.y), { lethality: 1, hardSurvival: 1, softSurvival: 2 });
  const river = map.hexes.find((h) => h.code >= 0x01 && h.code <= 0x0a && h.y > 40 && h.y < 60)!;
  assert.equal(hexModifiers(g, river.x, river.y).lethality, 0.5);
  g.freezeLine = 65;
  assert.equal(hexModifiers(g, river.x, river.y).lethality, 1, 'frozen rivers do not count');
  // (11,37): strength mode 0 summed, div 10; average readiness; points left
  const p = forcePresence(g, 1, 11, 37);
  const s = [1, 2].map((id) => unitStrength(g, unit(g, id), 11, 37, 0));
  assert.equal(p.lethality, Math.trunc((s[0].L + s[1].L) / 10));
  assert.equal(p.survivability, Math.trunc((s[0].S + s[1].S) / 10));
  assert.equal(p.readiness, Math.trunc((unit(g, 1).readiness + unit(g, 2).readiness) / 2));
  assert.equal(p.movement, 18 - (unit(g, 1).move % 100));
  assert.equal(p.assault, false);
});
