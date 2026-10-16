// Every hex with an icon (urban, port, airfield, supply point) must have a place name, and the
// hex -> latitude/longitude fit must stay within one hex of the control points.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { MapData } from '../src/data/types.ts';
import { PLACE_NAMES, GEO_CONTROL, placesFor, placeAt, hexToLatLon, distanceKm } from '../src/data/places.ts';
import { hexesForScenario } from '../src/engine/state.ts';

const DATA = join(import.meta.dirname, '..', 'data', 'extracted');
const HAVE_DATA = existsSync(join(DATA, 'map.json'));
const opts = { skip: HAVE_DATA ? false : 'data/extracted missing (run tools/extract/extract.ts)' };

test('every icon hex has a present-day place name', opts, () => {
  const map: MapData = JSON.parse(readFileSync(join(DATA, 'map.json'), 'utf8'));
  for (const is1995 of [false, true]) {
    const hexes = hexesForScenario(map, { scenario: is1995 ? 4 : 1 });
    const icons: [number, number, string][] = [];
    for (const h of hexes) if (h.terrain === 'urban') icons.push([h.x, h.y, 'urban']);
    for (const p of map.ports) if (p.ko !== '일본') icons.push([p.x, p.y, 'port']);
    for (const a of map.airfields) icons.push([a.x, a.y, 'airfield']);
    if (!is1995) for (const s of map.supplyPoints) icons.push([s.x, s.y, 'supply']);
    for (const [x, y, kind] of icons) {
      assert.ok(placeAt(x, y, is1995), `${is1995 ? '1995' : '1950s'}: ${kind} hex ${x},${y} has no name`);
    }
  }
});

test('one name per hex per era', () => {
  for (const is1995 of [false, true]) {
    const seen = new Set<string>();
    for (const p of placesFor(is1995)) {
      const k = `${p.x},${p.y}`;
      assert.ok(!seen.has(k), `duplicate place at ${k}`);
      seen.add(k);
    }
  }
  assert.ok(PLACE_NAMES.every((p) => p.label && p.ko));
});

test('hex grid georeference is accurate to about one hex', () => {
  const errors = GEO_CONTROL.map((p) => ({ p, km: distanceKm(hexToLatLon(p.x, p.y), { lat: p.lat!, lon: p.lon! }) }));
  const rms = Math.sqrt(errors.reduce((a, e) => a + e.km * e.km, 0) / errors.length);
  assert.ok(GEO_CONTROL.length >= 15);
  assert.ok(rms < 12, `rms ${rms.toFixed(1)} km`);
  for (const e of errors) assert.ok(e.km < 20, `${e.p.ko}: ${e.km.toFixed(1)} km`);
});
