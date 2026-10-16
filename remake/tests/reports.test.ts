// Report screen tests (docs/rules/reports.md).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { MapData, Scenario } from '../src/data/types.ts';
import { createGameState, idx } from '../src/engine/state.ts';
import { startNewGame } from '../src/engine/turn.ts';
import { terrainHeld } from '../src/engine/endturn.ts';
import { strategicReport, portsAirfieldsReport, weatherReport, overviewCells, overviewTerrain, AIRFIELD_NAMES, PORT_NAMES } from '../src/engine/reports.ts';

const DATA = join(import.meta.dirname, '..', 'data', 'extracted');
const HAVE_DATA = existsSync(join(DATA, 'map.json'));
const map: MapData = HAVE_DATA ? JSON.parse(readFileSync(join(DATA, 'map.json'), 'utf8')) : (null as unknown as MapData);
const scenario = (id: string): Scenario => JSON.parse(readFileSync(join(DATA, 'scenarios', `${id}.json`), 'utf8'));
const opts = { skip: HAVE_DATA ? false : 'data/extracted missing (run tools/extract/extract.ts)' };

test('strategic report (STRATEGIC_REPORT 2F75)', opts, () => {
  const g = createGameState(map, scenario('korea2'), 3);
  startNewGame(g, {});
  const rng = g.rng;
  const un = strategicReport(g, 2);
  const red = strategicReport(g, 1);
  assert.equal(g.rng, rng, 'no random numbers');
  const h = terrainHeld(g);
  assert.deepEqual(un.held.un, { urban: h.cities.un, other: h.hexes.un, stockpile: g.stockpile[1] });
  assert.deepEqual(un.held.communist, { urban: h.cities.communist, other: h.hexes.communist, stockpile: g.stockpile[0] });
  assert.equal(un.unInterdiction, g.interdiction[1]);
  assert.deepEqual(un.communistAir, { kind: 'interception', value: g.redAir });
  // the friendly pool only: UN rows for the UN player, NKPA/CPLA and the CCF status for the Communist player
  assert.deepEqual(un.pool.map((r) => r.nation), ['US', 'USMC', 'CW', 'UN', 'ROK']);
  assert.equal(un.ccf, null);
  assert.deepEqual(red.pool.map((r) => r.nation), ['NKPA', 'CPLA']);
  assert.deepEqual(red.pool[0].values, g.replacements.NKPA.map((r) => r[1]));
  assert.equal(red.ccf, 'undecided');
  g.ccfIntervention = 88;
  assert.equal(strategicReport(g, 1).ccf, 'willNotIntervene');
  g.ccfIntervention = 19;
  assert.equal(strategicReport(g, 1).ccf, 'intervening');
  assert.equal(un.gameTurn, g.turn - 11 + 1, 'Chromite starts at turn 11');

  const t = createGameState(map, scenario('korea4'), 3);
  startNewGame(t, {});
  const r95 = strategicReport(t, 2);
  assert.equal(r95.pool.find((r) => r.nation === 'CW')?.values, null, '"Not available in this scenario."');
  assert.deepEqual(strategicReport(t, 1).pool.map((r) => r.nation), ['NKPA'], 'no Chinese in 1995');
  assert.equal(strategicReport(t, 1).ccf, null);
  assert.equal(r95.communistAir.kind, 'interdiction');
});

test('airfields and ports, weather (PORTS_AIRFIELDS_REPORT 0356, W_REPORT 3699)', opts, () => {
  const g = createGameState(map, scenario('korea1'), 3);
  startNewGame(g, {});
  const r = portsAirfieldsReport(g);
  assert.equal(r.airfields.length, 9);
  assert.equal(r.ports.length, 12, 'the six Japan ports are not listed');
  assert.deepEqual(r.airfields.map((a) => [a.x, a.y]).slice(0, 2), [[24, 54], [28, 52]]);
  assert.equal(r.airfields[0].name, AIRFIELD_NAMES[0]);
  assert.equal(r.ports[1].name, PORT_NAMES[1]);
  assert.deepEqual([r.ports[1].x, r.ports[1].y], [12, 41], "Inch'on");
  for (const a of r.airfields) assert.equal(a.occupier, g.possession[idx(g, a.x, a.y)]);

  const w = weatherReport(g, 2);
  assert.equal(w.forecast.length, 4);
  assert.deepEqual(w.forecast.map((f) => f.temperature * 10 + f.sky), g.weather[2], 'the UN forecast row');
  g.weather[0][0] = 23; // mild, storms
  const s = weatherReport(g, 1);
  assert.equal(s.readiness, -5);
  assert.equal(s.stormMovement, true);
  assert.equal(s.air, 3);
  g.weather[0][0] = 31; // hot, fair
  assert.equal(weatherReport(g, 1).readiness, -5);
  assert.equal(weatherReport(g, 1).air, 1);
});

test('strategic overview: terrain classes, hidden enemy forces, supply net (DO_OVERVIEW 4421, DETERMINE_SUPPLY(TRUE))', opts, () => {
  assert.equal(overviewTerrain(0x00), 'open');
  assert.equal(overviewTerrain(0x05), 'river');
  assert.equal(overviewTerrain(0x60), 'river');
  assert.equal(overviewTerrain(0x7f), 'rough');
  assert.equal(overviewTerrain(0x92), 'mountain');
  assert.equal(overviewTerrain(0x93), 'city');
  assert.equal(overviewTerrain(0xa5), 'sea');
  assert.equal(overviewTerrain(0xdb), 'lake');
  assert.equal(overviewTerrain(0x94), 'edge');

  const g = createGameState(map, scenario('korea1'), 3);
  startNewGame(g, { limitedIntel: true });
  const cells = overviewCells(g, 'un');
  assert.equal(cells.length, g.hexes.length);
  const reds = cells.filter((c) => c.force === 'communist').length;
  const all = createGameState(map, scenario('korea1'), 3);
  startNewGame(all, { limitedIntel: false });
  const allReds = overviewCells(all, 'un').filter((c) => c.force === 'communist').length;
  assert.ok(reds < allReds, `limited intelligence hides Communist forces (${reds} < ${allReds})`);
  assert.ok(cells.some((c) => c.supplied), 'the supply nets are marked');
  assert.ok(cells.every((c) => !c.supplied || c.possession > 0));
});
