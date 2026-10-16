// Every hex with an icon (urban, port, airfield, supply point) must have a place name, and the
// hex -> latitude/longitude fit must stay within one hex of the control points.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { MapData } from '../src/data/types.ts';
import { PLACE_NAMES, GEO_CONTROL, NATURAL_FEATURES, placesFor, placeAt, featureAt, hexToLatLon, distanceKm } from '../src/data/places.ts';
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

test('every mountain and reservoir hex has a real mountain / lake name', opts, () => {
  const map: MapData = JSON.parse(readFileSync(join(DATA, 'map.json'), 'utf8'));
  for (const h of map.hexes) {
    if (h.terrain !== 'mountain' && h.terrain !== 'reservoir') continue;
    const f = featureAt(h.x, h.y);
    assert.ok(f, `${h.terrain} hex ${h.x},${h.y} has no name`);
    assert.equal(f.kind, h.terrain === 'mountain' ? 'peak' : 'lake', `${h.x},${h.y}`);
  }
});

test('natural features: one per hex, within about two hexes of the real summit / lake', () => {
  const seen = new Set<string>();
  for (const f of NATURAL_FEATURES) {
    assert.ok(f.label && f.ko && f.hexes.length);
    if (f.kind === 'range') continue;
    for (const [x, y] of f.hexes) {
      const k = `${x},${y}`;
      assert.ok(!seen.has(k), `two features on ${k}`);
      seen.add(k);
    }
    assert.ok(f.lat !== undefined && f.lon !== undefined, f.ko);
    if (f.kind === 'peak') assert.ok((f.elevation ?? 0) > 500, f.ko);
    const km = Math.min(...f.hexes.map(([x, y]) => distanceKm(hexToLatLon(x, y), { lat: f.lat!, lon: f.lon! })));
    // two hexes; uncertain matches in the squeezed north are flagged and get three
    assert.ok(km < (f.estimated ? 45 : 30), `${f.ko}: ${km.toFixed(1)} km from its hex`);
  }
});

test('hex grid georeference is accurate to about one hex', () => {
  const errors = GEO_CONTROL.map((p) => ({ p, km: distanceKm(hexToLatLon(p.x, p.y), { lat: p.lat!, lon: p.lon! }) }));
  const rms = Math.sqrt(errors.reduce((a, e) => a + e.km * e.km, 0) / errors.length);
  assert.ok(GEO_CONTROL.length >= 15);
  assert.ok(rms < 12, `rms ${rms.toFixed(1)} km`);
  for (const e of errors) assert.ok(e.km < 20, `${e.p.ko}: ${e.km.toFixed(1)} km`);
});
