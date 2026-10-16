// Scenario / saved game files (KOREA1..4.DAT, KOREA1S..4S.DAT, *.SAV).
// They are a raw dump of the GLOBALS data segment from UNITS (DS:0806) to VICTORY (DS:8C05), 33792 bytes.
// Field offsets come from the Turbo Debugger type information, so names below match the original source.

import { pstr } from './binary.ts';
import type { GlobalInfo, TypeDesc } from './tdinfo.ts';

export const NATIONS = ['US', 'USMC', 'CW', 'UN', 'ROK', 'NKPA', 'CPLA'] as const;
export const UNIT_KINDS: Record<number, string> = { 1: 'armor', 2: 'infantry', 3: 'airborne', 4: 'heavy_artillery', 5: 'artillery' };

export const SCENARIO_TITLES: Record<number, { en: string; ko: string }> = {
  1: { en: 'The Dragon Wakes', ko: '용이 깨어나다' },
  2: { en: 'Operation Chromite', ko: '크로마이트 작전' },
  3: { en: 'Cold Steel', ko: '차가운 강철' },
  4: { en: "Tomorrow's War", ko: '내일의 전쟁' },
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** EURSUBS1.CALENDAR: turn 0 = 25 June, then four turns per month on the 1st, 8th, 15th and 22nd. */
export function calendar(turn: number, baseYear: number): { year: number; month: number; day: number; label: string } {
  if (turn <= 0) return { year: baseYear, month: 6, day: 25, label: `25-June-${baseYear}` };
  const m0 = 6 + Math.floor((turn - 1) / 4); // 0-based month index, July = 6
  const year = baseYear + Math.floor(m0 / 12);
  const month = (m0 % 12) + 1;
  const day = [1, 8, 15, 22][(turn - 1) % 4];
  return { year, month, day, label: `${day}-${MONTHS[month - 1]}-${year}` };
}

export interface Layout {
  base: number; // DS offset of UNITS
  size: number; // bytes in a scenario file
  vars: Map<string, GlobalInfo>;
}

const FIRST = 'UNITS';
const LAST = 'VICTORY';

export function buildLayout(allGlobals: GlobalInfo[]): Layout {
  const vars = new Map<string, GlobalInfo>();
  for (const g of allGlobals) if (g.module === 'GLOBALS') vars.set(g.name, g);
  const first = vars.get(FIRST);
  const last = vars.get(LAST);
  if (!first || !last) throw new Error('GLOBALS layout not found in debug info');
  return { base: first.offset, size: last.offset + last.size - first.offset, vars };
}

function field(desc: TypeDesc, name: string): number {
  const f = desc.fields?.find((x) => x.name === name);
  if (!f) throw new Error(`field ${name} missing in ${desc.name}`);
  return f.offset;
}

export function parseScenario(buf: Buffer, layout: Layout, file: string) {
  if (buf.length !== layout.size) throw new Error(`${file}: expected ${layout.size} bytes, got ${buf.length}`);
  const v = (name: string) => {
    const g = layout.vars.get(name);
    if (!g) throw new Error(`global ${name} missing`);
    return { off: g.offset - layout.base, g };
  };
  const int = (name: string, idx = 0) => buf.readInt16LE(v(name).off + idx * 2);
  const bool = (name: string) => buf[v(name).off] !== 0;

  // ---- ground units: UNITS: array[255] of UNIT_TYPE ----
  const U = v('UNITS');
  const unitT = U.g.desc.element!;
  const uf = (n: string) => field(unitT, n);
  const eqT = unitT.fields!.find((f) => f.name === 'EQUIPMENT')!.type;
  const units = [];
  for (let i = 0; i < (U.g.desc.count ?? 0); i++) {
    const o = U.off + i * unitT.size;
    const name = pstr(buf, o + uf('NAME'), 20);
    if (!name || !/^[A-Za-z]/.test(name)) continue;
    const symbol = buf.readInt16LE(o + uf('SYMBOL'));
    const equipment = [];
    for (let k = 0; k < (eqT.count ?? 0); k++) {
      const e = o + uf('EQUIPMENT') + k * 3;
      if (buf[e]) equipment.push({ type: buf[e], assigned: buf[e + 1], authorized: buf[e + 2] });
    }
    const x = buf.readInt16LE(o + uf('MAP_X'));
    const y = buf.readInt16LE(o + uf('MAP_Y'));
    units.push({
      id: i + 1,
      name,
      forceName: pstr(buf, o + uf('NAME1'), 20),
      symbol,
      nation: NATIONS[Math.floor(symbol / 10)] ?? `nation${Math.floor(symbol / 10)}`,
      kind: UNIT_KINDS[symbol % 10] ?? `kind${symbol % 10}`,
      experience: buf[o + uf('EXPERIENCE')],
      status: buf[o + uf('STATUS')],
      readiness: buf.readInt16LE(o + uf('READINESS')),
      move: buf.readInt16LE(o + uf('MOVE')),
      attached: buf.readInt16LE(o + uf('ATTACHED')),
      x,
      y,
      onMap: x >= 0 && x <= 33 && y >= 0 && y <= 65,
      equipment,
    });
  }

  // ---- forces: ATTACHED is a linked list (unit id of the next unit in the same force, 0 = end) ----
  const byId = new Map(units.map((u) => [u.id, u]));
  const referenced = new Set(units.filter((u) => u.onMap && u.attached > 0).map((u) => u.attached));
  const forces = [];
  for (const u of units) {
    if (!u.onMap || referenced.has(u.id)) continue;
    const members: number[] = [];
    let cur: typeof u | undefined = u;
    while (cur && !members.includes(cur.id) && members.length < 12) {
      members.push(cur.id);
      cur = cur.attached ? byId.get(cur.attached) : undefined;
    }
    forces.push({ leader: u.id, name: u.forceName.replace(/\+$/, '').trim(), x: u.x, y: u.y, units: members });
  }

  // ---- air units: AIR_UNITS: array[34] of AIR_UNIT_TYPE ----
  const A = v('AIR_UNITS');
  const airT = A.g.desc.element!;
  const af = (n: string) => field(airT, n);
  const airUnits = [];
  for (let i = 0; i < (A.g.desc.count ?? 0); i++) {
    const o = A.off + i * airT.size;
    const name = pstr(buf, o + af('NAME'), 24).trim();
    if (!name || name === 'noname') continue;
    airUnits.push({
      id: i + 1,
      name,
      entryTurn: buf[o + af('ENTRY_TURN')],
      exitTurn: buf[o + af('EXIT_TURN')],
      aircraft1: buf[o + af('TYPE1')],
      aircraft2: buf[o + af('TYPE2')],
      airToAir: buf[o + af('AIR_TO_AIR')],
      airToGround: buf[o + af('AIR_TO_GROUND')],
      mission: buf[o + af('MISSION')],
      base: buf[o + af('BASE')],
      allWeather: buf[o + af('ALL_WEATHER')] !== 0,
      longRange: buf[o + af('LONG_RANGE')] !== 0,
      poorRunways: buf[o + af('POOR_RUNWAYS')] !== 0,
    });
  }

  // ---- tables ----
  const aircraftTypes = [];
  const AN = v('AIR_NAMES');
  const anLen = AN.g.desc.element!.size;
  for (let i = 0; i < (AN.g.desc.count ?? 0); i++) aircraftTypes.push({ id: i + 1, name: pstr(buf, AN.off + i * anLen, anLen - 1) });

  const equipmentTypes = [];
  const ES = v('EQ_STRINGS');
  const EV = v('EQ_VALS');
  const esLen = ES.g.desc.element!.size;
  for (let i = 0; i < (ES.g.desc.count ?? 0); i++) {
    equipmentTypes.push({
      id: i + 1,
      name: pstr(buf, ES.off + i * esLen, esLen - 1),
      lethality: buf.readInt16LE(EV.off + i * 4),
      survivability: buf.readInt16LE(EV.off + i * 4 + 2),
    });
  }

  const R = v('REPLACEMENTS'); // 7 armies x 15 equipment types x 2 bytes
  const replacements: Record<string, number[][]> = {};
  NATIONS.forEach((n, a) => {
    const rows: number[][] = [];
    for (let e = 0; e < 15; e++) rows.push([buf[R.off + a * 30 + e * 2], buf[R.off + a * 30 + e * 2 + 1]]);
    replacements[n] = rows;
  });

  const C = v('CORPS'); // [from, to] unit id ranges per army
  const corps = ['NKPA', 'CPLA', 'ROK', 'UN'].map((army, i) => ({ army, from: buf.readInt16LE(C.off + i * 4), to: buf.readInt16LE(C.off + i * 4 + 2) }));

  const W = v('WEATHER');
  const weatherRaw: number[] = [];
  for (let i = 0; i < 12; i++) weatherRaw.push(buf.readInt16LE(W.off + i * 2));

  const N = v('NOTES');
  const news: string[] = [];
  for (let i = 0; i < (N.g.desc.count ?? 0); i++) {
    const s = pstr(buf, N.off + i * 256, 255);
    if (s && /^[\x20-\x7e]+$/.test(s)) news.push(s);
  }

  const P = v('PORTS');
  const ports = [];
  for (let i = 0; i < (P.g.desc.count ?? 0); i++) ports.push({ id: i + 1, mined: buf[P.off + i * 3] !== 0, x: buf[P.off + i * 3 + 1], y: buf[P.off + i * 3 + 2] });

  const AF = v('AIRFIELDS');
  const airfields = [];
  for (let i = 0; i < (AF.g.desc.count ?? 0); i++) {
    const o = AF.off + i * 4;
    airfields.push({ id: i + 1, current: buf[o], best: buf[o + 1], x: buf[o + 2], y: buf[o + 3] });
  }

  // ---- per hex state: TERRAIN: array[0..33] of array[0..65] of array[0..4] of byte ----
  const T = v('TERRAIN');
  const W_ = 34, H_ = 66;
  const terrainCodes: number[] = new Array(W_ * H_);
  const possession: number[] = new Array(W_ * H_);
  const hexExtra: number[][] = new Array(W_ * H_);
  for (let x = 0; x < W_; x++) for (let y = 0; y < H_; y++) {
    const o = T.off + (x * H_ + y) * 5;
    const idx = y * W_ + x;
    terrainCodes[idx] = buf[o];
    possession[idx] = buf[o + 1];
    hexExtra[idx] = [buf[o + 2], buf[o + 3], buf[o + 4]];
  }

  const scenarioBytes = [...buf.subarray(v('SCENARIO').off, v('SCENARIO').off + 8)];
  const scenarioNo = scenarioBytes[0];
  const turn = int('TURN');
  const date = calendar(turn, scenarioNo === 4 ? 1995 : 1950);

  return {
    file,
    scenario: scenarioNo,
    title: SCENARIO_TITLES[scenarioNo],
    variant: /S\.DAT$/i.test(file) ? 'S' : 'base',
    turn,
    date,
    settingsRaw: scenarioBytes,
    realityRaw: [...buf.subarray(v('REALITY').off, v('REALITY').off + 4)],
    stockpile: { un: int('STOCKPILE', 0), communist: int('STOCKPILE', 1) },
    weatherRaw,
    weatherNow: { temperature: Math.floor(weatherRaw[0] / 10), sky: weatherRaw[0] % 10 },
    freezeLine: int('FREEZE_LINE'),
    ccfIntervention: int('CCF_INTERVENTION'),
    victory: int('VICTORY'),
    unHexes: int('UN_HEXES'),
    redAir: int('RED_AIR'),
    sealiftDemand: int('SEALIFT_DEMAND'),
    airliftDemand: int('AIRLIFT_DEMAND'),
    interception: [int('INTERCEPTION', 0), int('INTERCEPTION', 1)],
    interdiction: [int('INTERDICTION', 0), int('INTERDICTION', 1)],
    railDemand: [int('RAIL_DEMAND', 0), int('RAIL_DEMAND', 1)],
    refugees: bool('REFUGEES'),
    corps,
    equipmentTypes,
    aircraftTypes,
    units,
    forces,
    airUnits,
    replacements,
    ports,
    airfields,
    news,
    terrainCodes,
    possession,
    hexExtra,
  };
}

export type Scenario = ReturnType<typeof parseScenario>;
