// Extracts data from the original Conflict: Korea (SSI 1992) DOS files into JSON/PNG.
// Usage: node tools/extract/extract.ts [originalGameDir] [outDir]
// Personal project use only: the outputs are derived from copyrighted files, do not redistribute them.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';
import { readMzHeader, imageStart, imageEnd } from './lib/mz.ts';
import { parseTdInfo, procedures, globals, constants, findDataSegment, moduleList, describeType, typeToString } from './lib/tdinfo.ts';
import { decodeIlbm } from './lib/ilbm.ts';
import type { IndexedImage } from './lib/ilbm.ts';
import { encodeIndexedPng } from './lib/png.ts';
import { buildLayout, parseScenario } from './lib/scenario.ts';
import type { Scenario } from './lib/scenario.ts';
import {
  classify, isRoadCode, isClosedTerrain, roadMask, railMask, neighbor, OPPOSITE, DIRS, lineSides, RIVER_COLOR,
  CITIES, PORT_NAMES, AIRFIELD_NAMES, SUPPLY_POINTS, isJapan,
} from './lib/terrain.ts';

const ROOT = resolve(import.meta.dirname, '..', '..');
const SRC = resolve(process.argv[2] ?? join(ROOT, '..', 'Conflict-Korea-The-First-Year-1950-51_DOS_EN', 'confkorea'));
const OUT = resolve(process.argv[3] ?? join(ROOT, 'data', 'extracted'));
const W = 34;
const H = 66;

function out(rel: string, data: string | Buffer) {
  const p = join(OUT, rel);
  mkdirSync(resolve(p, '..'), { recursive: true });
  writeFileSync(p, data);
}
const json = (v: unknown) => JSON.stringify(v, null, 1);
const log = (...a: unknown[]) => console.log(...a);

if (!existsSync(join(SRC, 'KOREA.EXE'))) {
  console.error(`KOREA.EXE not found in ${SRC}\nUsage: node tools/extract/extract.ts <original game folder>`);
  process.exit(1);
}
log(`original files: ${SRC}\noutput:         ${OUT}\n`);

// ---------- 1. executable + debug symbols ----------
const exe = readFileSync(join(SRC, 'KOREA.EXE'));
const mz = readMzHeader(exe);
const td = parseTdInfo(exe, imageEnd(mz));
const dataSegment = findDataSegment(td);
const procs = procedures(td);
const allGlobals = globals(td, dataSegment);
const consts = constants(td);
const recordTypes: Record<string, string> = {};
td.types.forEach((t, i) => {
  if (t.id === 30 && t.nameIndex) recordTypes[td.names[t.nameIndex]] = typeToString(describeType(td, i + 1));
});
out('symbols.json', json({
  note: 'Recovered from the Turbo Debugger info appended to KOREA.EXE (Turbo Pascal 6.0).',
  mz: { ...mz, imageStart: imageStart(mz), imageEnd: imageEnd(mz) },
  tdinfoVersion: `${td.header.majorVersion}.${td.header.minorVersion}`,
  dataSegment,
  modules: moduleList(td).map((m) => ({ name: m.name, codeSegment: m.codeSegment, codeLength: m.codeLength })),
  procedures: procs,
  globals: allGlobals.map(({ desc, ...g }) => g),
  constants: consts,
  recordTypes,
}));
log(`symbols: ${procs.length} procedures, ${allGlobals.length} data-segment variables, ${consts.length} constants`);

// ---------- 2. graphics ----------
const sheets: Record<string, IndexedImage> = {};
for (const f of readdirSync(SRC).filter((n) => /\.LBM$/i.test(n))) {
  const img = decodeIlbm(readFileSync(join(SRC, f)));
  sheets[f.toUpperCase()] = img;
  out(`graphics/${basename(f, '.LBM').toLowerCase()}.png`, encodeIndexedPng(img));
}
log(`graphics: ${Object.keys(sheets).length} ILBM sheets -> PNG`);

// ---------- 3. scenarios ----------
const layout = buildLayout(allGlobals);
const scenarios: Record<string, Scenario> = {};
for (const f of readdirSync(SRC).filter((n) => /^KOREA\dS?\.DAT$/i.test(n))) {
  const s = parseScenario(readFileSync(join(SRC, f)), layout, f.toUpperCase());
  const id = basename(f, '.DAT').toLowerCase();
  scenarios[id] = s;
  out(`scenarios/${id}.json`, json({ id, ...s }));
}
log(`scenarios: ${Object.keys(scenarios).sort().join(', ')} (layout ${layout.size} bytes from DS:${layout.base.toString(16)})`);

// ---------- 4. semantic map ----------
const base = scenarios['korea1s'] ?? scenarios['korea1'];
const modern = scenarios['korea4s'] ?? scenarios['korea4'];
const hxSheet = sheets['K_HX_VGA.LBM'];
// ROADS / RAILS tables are identical in every scenario file
const readTable = (name: string) => {
  const g = layout.vars.get(name)!;
  const raw = readFileSync(join(SRC, base.file));
  return new Uint8Array(raw.subarray(g.offset - layout.base, g.offset - layout.base + g.size));
};
const ROADS = readTable('ROADS');
const RAILS = readTable('RAILS');

function buildHexes(codes: number[]) {
  const hexes = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const code = codes[y * W + x];
    const c = classify(code);
    hexes.push({
      x, y, code,
      terrain: isJapan(x, y, code) ? 'japan' : c.kind,
      label: c.label,
      closed: isClosedTerrain(code),
      river: c.river ? lineSides(hxSheet, code, [RIVER_COLOR]) : 0,
      road: isRoadCode(code) ? roadMask(ROADS, code) : 0,
      rail: c.rail ? railMask(RAILS, code) : 0,
    });
  }
  // Urban hexes have no masks: they connect to every neighbor whose road/rail points into them.
  for (const h of hexes) {
    if (h.terrain !== 'urban') continue;
    for (let d = 0; d < 6; d++) {
      const [nx, ny] = neighbor(h.x, h.y, d);
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const n = hexes[ny * W + nx];
      if (n.road & (1 << OPPOSITE[d])) h.road |= 1 << d;
      if (n.rail & (1 << OPPOSITE[d])) h.rail |= 1 << d;
    }
  }
  return hexes;
}

const hexes = buildHexes(base.terrainCodes);
const hexes1995 = buildHexes(modern.terrainCodes);
const variant1995 = hexes1995.filter((h, i) => h.code !== hexes[i].code);

out('map.json', json({
  note: 'Semantic map recovered from the original data. Coordinates: x 0..33 (columns), y 0..65 (rows).',
  width: W,
  height: H,
  layout: { orientation: 'flat-top', offset: 'even-q', note: 'even columns (x % 2 == 0) are shifted down by half a hex' },
  directions: DIRS,
  maskBits: { N: 1, NE: 2, SE: 4, S: 8, SW: 16, NW: 32 },
  hexes,
  variant1995,
  cities: CITIES,
  ports: base.ports.map((p, i) => ({ ...p, ...(PORT_NAMES[i] ?? { name: 'Japan', ko: '일본' }) })),
  airfields: base.airfields.map((a, i) => ({ ...a, ...AIRFIELD_NAMES[i] })),
  supplyPoints: SUPPLY_POINTS.map(([x, y]) => ({ x, y })),
}));

// ---------- 5. validation report ----------
function connectivity(field: 'road' | 'rail' | 'river') {
  let ok = 0, open = 0;
  for (const h of hexes) for (let d = 0; d < 6; d++) {
    if (!(h[field] & (1 << d))) continue;
    const [nx, ny] = neighbor(h.x, h.y, d);
    const n = nx >= 0 && ny >= 0 && nx < W && ny < H ? hexes[ny * W + nx] : null;
    if (n && (n[field] & (1 << OPPOSITE[d]))) ok++;
    else open++;
  }
  return `${ok} linked sides, ${open} open ends`;
}
log(`map: roads ${connectivity('road')}; rails ${connectivity('rail')}; rivers ${connectivity('river')}; 1995 variant hexes: ${variant1995.length}`);

const s1 = scenarios['korea1'];
if (s1) {
  const u = s1.units.find((x) => x.name === 'NKPA 50/15 Inf Rgt');
  if (u) {
    const eq = new Map(s1.equipmentTypes.map((e) => [e.id, e]));
    const surv = u.equipment.reduce((a, e) => a + e.assigned * (eq.get(e.type)?.survivability ?? 0), 0);
    const leth = u.equipment.reduce((a, e) => a + e.assigned * (eq.get(e.type)?.lethality ?? 0), 0);
    log(`check: NKPA 50/15 Inf Rgt survivability ${surv} (manual 234), lethality ${leth} (manual 418) -> ${surv === 234 && leth === 418 ? 'OK' : 'MISMATCH'}`);
  }
}
for (const [id, s] of Object.entries(scenarios).sort()) {
  const byNation: Record<string, number> = {};
  for (const u of s.units) byNation[u.nation] = (byNation[u.nation] ?? 0) + 1;
  const unknown = s.units.filter((u) => u.kind.startsWith('kind') || u.nation.startsWith('nation')).length;
  log(`${id}: ${s.date.label} turn ${s.turn}, ${s.units.length} units (${Object.entries(byNation).map(([k, v]) => `${k} ${v}`).join(', ')}), ${s.forces.length} forces on map, ${s.airUnits.length} air units${unknown ? `, ${unknown} unknown symbols` : ''}`);
}
log('\ndone.');
