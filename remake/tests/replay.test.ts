// Combat replay (docs/rules/combat.md 6): battle snapshots in CombatReport and the step / overlay logic of
// ui/combatReplay.ts (no DOM).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { MapData, Scenario } from '../src/data/types.ts';
import { createGameState, unit } from '../src/engine/state.ts';
import { startNewGame } from '../src/engine/turn.ts';
import type { CombatReport } from '../src/engine/combat.ts';
import { STATUS_BURIED } from '../src/engine/combat.ts';
import { buildReplay, overlayFor, verdict, fromDirKo } from '../src/ui/combatReplay.ts';

const DATA = join(import.meta.dirname, '..', 'data', 'extracted');
const HAVE_DATA = existsSync(join(DATA, 'map.json'));
const opts = { skip: HAVE_DATA ? false : 'data/extracted missing (run tools/extract/extract.ts)' };
const map: MapData = HAVE_DATA ? JSON.parse(readFileSync(join(DATA, 'map.json'), 'utf8')) : (null as unknown as MapData);
const load = (id: string, seed = 7) => createGameState(map, JSON.parse(readFileSync(join(DATA, 'scenarios', `${id}.json`), 'utf8')) as Scenario, seed);

/** The opening of The Dragon Wakes against the computer: KIM attacks on turn 0. */
function openingBattles(seed: number): { reports: CombatReport[]; g: ReturnType<typeof load> } {
  const g = load('korea1s', seed);
  const ev = startNewGame(g, { computerSide: 1 });
  const c = ev.find((e) => e.kind === 'combat');
  return { reports: c && c.kind === 'combat' ? c.reports : [], g };
}

test('battle reports carry before/after snapshots of every force', opts, () => {
  const { reports, g } = openingBattles(7);
  const battles = reports.filter((r) => !r.moveIn);
  assert.ok(battles.length >= 3, 'the turn-0 assaults');
  for (const r of battles) {
    for (const s of [...r.attackers, ...r.defenders]) {
      assert.ok(s.units.length >= 1 && s.units[0] === s.leader);
      assert.ok(s.before.L >= 0 && s.before.S > 0);
      const alive = s.units.filter((id) => unit(g, id).status !== STATUS_BURIED);
      // (later battles and phases may still eliminate a survivor, so only one direction can be checked now)
      if (s.after === null) assert.equal(alive.length, 0, `${s.name}: wiped out`);
      else assert.ok(s.at !== null);
      assert.ok(s.equipAfter <= s.equipBefore);
    }
    for (const d of r.defenders) assert.deepEqual(d.from, r.target, 'defenders stood in the target hex');
    for (const a of r.attackers) assert.ok(fromDirKo(a.from, r.target) !== '', 'attackers were adjacent');
  }
});

test('replay steps follow the original order and the overlay ends where the battle left the forces', opts, () => {
  const { reports } = openingBattles(11);
  for (const b of buildReplay(reports)) {
    const r = b.report;
    const kinds = b.steps.map((s) => s.kind);
    assert.equal(kinds[0], 'intro');
    assert.equal(kinds.at(-1), 'end');
    if (!r.moveIn) {
      // attackers one by one, defenders one by one, results, then the unit events
      const expect = ['intro', ...r.attackers.map(() => 'attacker'), ...r.defenders.map(() => 'defender'), 'result', ...b.events.map(() => 'event'), 'end'];
      assert.deepEqual(kinds, expect);
    }
    const start = overlayFor(b, 0);
    assert.equal(start.arrows.length, 0);
    for (const gh of start.ghosts) { assert.deepEqual(gh.at, gh.side.from); assert.deepEqual(gh.strength, gh.side.before); assert.ok(!gh.gone); }
    const end = overlayFor(b, b.steps.length - 1);
    assert.equal(end.arrows.length, r.attackers.length);
    for (const gh of end.ghosts) {
      if (!gh.side.after) assert.ok(gh.gone, `${gh.side.name} crossed out`);
      else { assert.ok(!gh.gone); assert.deepEqual(gh.at, gh.side.at); }
    }
    for (const s of [...r.attackers, ...r.defenders]) for (const id of s.units) assert.ok(end.hide.has(id));
    if (!r.moveIn) {
      const v = verdict(r);
      if (r.defenders.every((d) => !d.after)) assert.equal(v, '방어 부대 괴멸');
      else assert.equal(v, r.retreated ? '방어 부대 후퇴' : '방어 부대 버팀');
    }
  }
});

test('during a full replay the forces of the battles to come stand as they were before them (no spoilers)', opts, () => {
  const { reports } = openingBattles(7);
  const battles = buildReplay(reports);
  assert.ok(battles.length >= 2);
  const o = overlayFor(battles[0], 0, battles.slice(1));
  const own = new Set([...battles[0].report.attackers, ...battles[0].report.defenders].flatMap((s) => s.units));
  for (const lb of battles.slice(1)) {
    for (const s of [...lb.report.attackers, ...lb.report.defenders]) {
      for (const id of s.units) assert.ok(o.hide.has(id), 'live counter of a later battle hidden');
      if (s.units.some((id) => own.has(id))) continue;
      const gh = o.ghosts.find((x) => x.side === s);
      assert.ok(gh && gh.waiting, `${s.name} waits for its battle`);
      assert.deepEqual(gh.at, s.from);
      assert.deepEqual(gh.strength, s.before);
      assert.ok(!gh.gone);
    }
  }
  // the last battle (or a single-battle replay) has nothing waiting
  const last = battles.at(-1)!;
  assert.ok(overlayFor(last, 0).ghosts.every((gh) => !gh.waiting));
});
