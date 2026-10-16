// Mutable game state built from an extracted scenario. Pure logic (no DOM) so it can run in Node for
// tests and AI self-play. Mirrors the original globals: UNITS[], TERRAIN[x][y][1..4], AIRFIELDS[], ...

import type { AirUnit, Equipment, EquipmentType, Hex, MapData, Nation, Scenario, Unit, UnitKind } from '../data/types.ts';
import type { AirPhaseState } from './air.ts';
import type { AiLevel } from './ai/types.ts';

export type Side = 'un' | 'communist';

export const SIDE_OF_NATION: Record<Nation, Side> = {
  US: 'un', USMC: 'un', CW: 'un', UN: 'un', ROK: 'un', NKPA: 'communist', CPLA: 'communist',
};
/** TERRAIN byte 1 (possession) code of each side. */
export const POSSESSION_CODE: Record<Side, number> = { un: 1, communist: 2 };
/** Index into the original DUAL arrays (INTERDICTION, RAIL_DEMAND): PLAYER 1 = Communist, 2 = UN. */
export const DUAL_INDEX: Record<Side, number> = { communist: 0, un: 1 };

/** UNIT_TYPE.STATUS bits that the movement code uses. */
export const STATUS_SUPPLIED = 0x01;
export const STATUS_MOVED = 0x04;
export const STATUS_READY = 0x40;

export interface UnitState {
  id: number;
  name: string;
  forceName: string;
  nation: Nation;
  kind: UnitKind;
  /** NATIONALITY*10 + branch. Temporarily 81/82/83 in the original during sea/air/rail movement. */
  symbol: number;
  experience: number;
  status: number;
  readiness: number;
  /** Raw MOVE field: movement points used this turn + 100 * plotted assault direction. */
  move: number;
  /** Next unit of the same force (0 = end of list). */
  attached: number;
  x: number;
  y: number;
  equipment: Equipment[];
}

export interface AirfieldState { id: number; x: number; y: number; current: number; best: number; }
export interface PortState { id: number; x: number; y: number; mined: boolean; }
export type AirUnitState = AirUnit;
/** NEWS_FLASH entry: original English text (translated in the UI) and the turn it happened. */
export interface NewsItem { turn: number; text: string; }

/** PLAYER values of the original: 1 = Communist, 2 = United Nations. */
export type Player = 1 | 2;
export const PLAYER_SIDE: Record<Player, Side> = { 1: 'communist', 2: 'un' };
export const SIDE_PLAYER: Record<Side, Player> = { communist: 1, un: 2 };

export interface GameState {
  scenarioId: string;
  /** 1-4; 4 = Tomorrow's War (1995) */
  scenarioNo: number;
  width: number;
  height: number;
  hexes: Hex[];
  units: Map<number, UnitState>;
  equipmentTypes: Map<number, EquipmentType>;
  /** Per hex: force leader ids, TERRAIN bytes 3 and 4 (at most two in normal play). */
  stacks: number[][];
  /** Per hex: TERRAIN byte 1, 0 none, 1 United Nations, 2 Communist. */
  possession: Uint8Array;
  /** Per hex: TERRAIN byte 2, spotting level 0..2 of the hex for the side that does not hold it (docs/rules/intel.md). */
  spotted: Uint8Array;
  airfields: AirfieldState[];
  /** CORPS ranges; index 1 (CPLA) gets the rough/mountain discount. */
  corps: { from: number; to: number }[];
  /** WEATHER[0] mod 10: 1 clear, 2 cloudy, 3 storm (other values = not initialised). */
  sky: number;
  /** WEATHER[0] div 10: 1 cold, 2 mild, 3 hot. */
  temperature: number;
  /** TURN global (0 = 25 June). */
  turn: number;
  /** SCENARIO[2]: Communist competence 1 Pushover .. 5 Hideous (3 = x1.0). */
  competence: number;
  /** REPLACEMENTS[nation][equipment type - 1] = [per-turn rate, pool] (GROUND_REINFORCEMENTS; BURY adds to the pool). */
  replacements: Record<Nation, [number, number][]>;
  freezeLine: number;
  refugees: boolean;
  /** SCENARIO[3]: 0 two players, 1 computer plays Communist, 2 computer plays UN. */
  computerSide: number;
  /** Which computer player plays the computer side (docs/rules/ai.md 4): the original program or a remake AI. */
  aiLevel: AiLevel;
  /** PHASE global: 1 First Orders, 2 Combat Resolution, 3 Second Orders, 4 General Resolution (docs/rules/turn.md). */
  phase: number;
  /** PLAYER global: whose orders phase it is (1 Communist, 2 UN). */
  player: Player;
  /** SAVEORDER: players of the current orders phase in order, and the index of the one playing now. */
  order: [Player, Player];
  orderStep: number;
  /** STOCKPILE DUAL array: [0] Communist, [1] United Nations. */
  stockpile: [number, number];
  /** WEATHER[3][4] (temperature*10 + sky): row 0 the real weather of this turn and the next three,
   *  rows 1 and 2 the forecasts shown to the Communist and the UN player. */
  weather: number[][];
  /** FIRSTUNUNIT..LASTUNUNIT: unit id range of the United Nations side. */
  firstUnUnit: number;
  lastUnUnit: number;
  ports: PortState[];
  airUnits: AirUnitState[];
  /** RED_AIR: 1950s Communist interception level (CIL), 0..200 (docs/rules/air.md). */
  redAir: number;
  /** INTERCEPTION DUAL array [Communist, UN]: 1995 air superiority strengths (1950s: [0] = RED_AIR for reports). */
  interception: [number, number];
  /** REALITY[2] Air Campaign: true = Player Control (missions and airstrike targets), false = Program Control. */
  airPlayerControl: boolean;
  /** DO_AIR_COMBAT in progress during the combat phase (a human player is picking airstrike targets). */
  air: AirPhaseState | null;
  /** UN_HEXES: 100 * UN cities + other UN hexes at the end of the previous turn (refugee check). */
  unHexes: number;
  ccfIntervention: number;
  sealiftDemand: number;
  airliftDemand: number;
  /** UTILITY_SPACE (event flags and counters; meanings in docs/rules/turn.md). */
  utility: number[];
  /** REALITY[4] (1-based): limited intelligence (false = complete, every hex spotted to level 2). */
  limitedIntel: boolean;
  /** SCENARIO[6]: CCF intervention option, false = Historical (1/3 bluff), true = Fixed. */
  ccfFixed: boolean;
  /** The players continued past the end of the game: victory levels no longer count. */
  victoryVoid: boolean;
  /** NOTES of the data file: the original's news lines ("25-June-1950: text") from before this game began.
   *  A scenario's opening news, or the last eight lines of an imported original save (tools/extract/sav2json.ts). */
  notes: string[];
  /** Remake addition: hexes held by each side at the start of every turn (terrainHeld, cities included), for the
   *  front-line chart of the summary panel. Possession is public in the original (Strategic Report). */
  history: { turn: number; un: number; communist: number }[];
  news: NewsItem[];
  /** End of game reason once END_TEST fired. */
  gameOver: string | null;
  /** INTERDICTION DUAL array [Communist, UN] (DETERMINE_INTERDICTION; enemy rail movement uses it). */
  interdiction: [number, number];
  railDemand: [number, number];
  /** mulberry32 state */
  rng: number;
  /** Seed of the new game: the false strength reports (STATUS 0x10) are derived from it, not from `rng` (intel.ts). */
  intelSeed: number;
  /** Increments on every change, so views can cache derived data. */
  version: number;
  /** One level of undo for the last movement order (see movement.ts). */
  undo: UndoEntry | null;
}

export interface UndoEntry {
  leader: number;
  snapshot: Snapshot;
}

export function idx(g: Pick<GameState, 'width'>, x: number, y: number): number {
  return y * g.width + x;
}

/** EURSUBS1.ON_MAP: 0..33 x 0..65, except the 2x2 holding box in the top-left corner. */
export function onMap(g: Pick<GameState, 'width' | 'height'>, x: number, y: number): boolean {
  if (x < 0 || y < 0 || x >= g.width || y >= g.height) return false;
  return !(x < 2 && y < 2);
}

export function hexesForScenario(map: MapData, scenario: Pick<Scenario, 'scenario'>): Hex[] {
  if (scenario.scenario !== 4) return map.hexes;
  const hexes = map.hexes.slice();
  for (const h of map.variant1995) hexes[h.y * map.width + h.x] = h;
  return hexes;
}

function cloneUnit(u: Unit): UnitState {
  return {
    id: u.id, name: u.name, forceName: u.forceName, nation: u.nation, kind: u.kind, symbol: u.symbol,
    experience: u.experience, status: u.status, readiness: u.readiness, move: u.move, attached: u.attached,
    x: u.x, y: u.y, equipment: u.equipment.map((e) => ({ ...e })),
  };
}

export function createGameState(map: MapData, scenario: Scenario, seed = 1950): GameState {
  const hexes = hexesForScenario(map, scenario);
  const n = map.width * map.height;
  const g: GameState = {
    scenarioId: scenario.id,
    scenarioNo: scenario.scenario,
    width: map.width,
    height: map.height,
    hexes,
    units: new Map(scenario.units.map((u) => [u.id, cloneUnit(u)])),
    equipmentTypes: new Map(scenario.equipmentTypes.map((e) => [e.id, e])),
    stacks: Array.from({ length: n }, () => [] as number[]),
    possession: Uint8Array.from(scenario.possession),
    spotted: new Uint8Array(n),
    airfields: scenario.airfields.map((a) => ({ ...a })),
    corps: scenario.corps.map((c) => ({ from: c.from, to: c.to })),
    sky: (((scenario.weatherRaw?.[0] ?? 0) % 10) + 10) % 10,
    temperature: Math.trunc((scenario.weatherRaw?.[0] ?? 0) / 10),
    turn: scenario.turn,
    // the original takes this from the start menu; the files hold 1 or 3. Neutral default until options exist.
    competence: 3,
    replacements: Object.fromEntries(
      Object.entries(scenario.replacements ?? {}).map(([n, rows]) => [n, rows.map((r) => [r[0], r[1]] as [number, number])]),
    ) as Record<Nation, [number, number][]>,
    freezeLine: scenario.freezeLine,
    refugees: scenario.refugees ?? false,
    computerSide: 0,
    aiLevel: 'original',
    phase: 1,
    player: 1,
    order: [1, 2],
    orderStep: 0,
    stockpile: [scenario.stockpile?.communist ?? 0, scenario.stockpile?.un ?? 0],
    weather: [0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => scenario.weatherRaw?.[r * 4 + c] ?? 0)),
    firstUnUnit: scenario.firstUnUnit ?? (scenario.scenario === 4 ? 124 : 156),
    lastUnUnit: scenario.lastUnUnit ?? (scenario.scenario === 4 ? 202 : 250),
    ports: (scenario.ports ?? []).map((p) => ({ id: p.id, x: p.x, y: p.y, mined: p.mined })),
    airUnits: (scenario.airUnits ?? []).map((a) => ({ ...a })),
    redAir: scenario.redAir ?? 0,
    interception: [scenario.interception?.[0] ?? 0, scenario.interception?.[1] ?? 0],
    airPlayerControl: true,
    air: null,
    unHexes: scenario.unHexes ?? 0,
    ccfIntervention: scenario.ccfIntervention ?? 99,
    sealiftDemand: scenario.sealiftDemand ?? 0,
    airliftDemand: scenario.airliftDemand ?? 0,
    utility: (scenario.utilitySpace ?? new Array(20).fill(0)).slice(),
    limitedIntel: false,
    ccfFixed: false,
    victoryVoid: false,
  notes: (scenario.news ?? []).slice(),
  history: [],
    news: [],
    gameOver: null,
    interdiction: [scenario.interdiction?.[0] ?? 0, scenario.interdiction?.[1] ?? 0],
    railDemand: [scenario.railDemand?.[0] ?? 0, scenario.railDemand?.[1] ?? 0],
    rng: seed >>> 0,
    intelSeed: seed >>> 0,
    version: 0,
    undo: null,
  };
  // Force stacks: the original keeps the two force leaders of a hex in TERRAIN bytes 3 and 4.
  // Forces that are not registered there (holding box, off-map terrain) cannot be selected.
  if (scenario.hexExtra) {
    scenario.hexExtra.forEach((b, i) => {
      g.spotted[i] = b[0];
      const x = i % map.width, y = Math.floor(i / map.width);
      if (!onMap(g, x, y)) return;
      for (const leader of [b[1], b[2]]) if (leader > 0 && g.units.has(leader)) g.stacks[i].push(leader);
    });
  } else {
    for (const f of scenario.forces) {
      if (!onMap(g, f.x, f.y)) continue;
      const h = hexes[idx(g, f.x, f.y)];
      if (h.terrain === 'offmap') continue;
      g.stacks[idx(g, f.x, f.y)].push(f.leader);
    }
  }
  return g;
}

// ---------- queries ----------

export function unit(g: GameState, id: number): UnitState {
  const u = g.units.get(id);
  if (!u) throw new Error(`unknown unit ${id}`);
  return u;
}

export function sideOf(u: Pick<UnitState, 'nation'>): Side {
  return SIDE_OF_NATION[u.nation];
}

export function enemyOf(side: Side): Side {
  return side === 'un' ? 'communist' : 'un';
}

/** Units of a force, following the ATTACHED linked list from the leader. */
export function forceUnits(g: GameState, leader: number): UnitState[] {
  const out: UnitState[] = [];
  const seen = new Set<number>();
  let id = leader;
  while (id > 0 && !seen.has(id)) {
    const u = g.units.get(id);
    if (!u) break;
    out.push(u);
    seen.add(id);
    id = u.attached;
  }
  return out;
}

/** Hex index of a force, or -1 if it is not on the map. */
export function forceHex(g: GameState, leader: number): number {
  const u = g.units.get(leader);
  if (!u || !onMap(g, u.x, u.y)) return -1;
  const i = idx(g, u.x, u.y);
  return g.stacks[i].includes(leader) ? i : -1;
}

/** EURSUBS1.GET_CORPS: index of the CORPS range containing the unit (0 if none). */
export function corpsOf(g: GameState, id: number): number {
  let found = 0;
  g.corps.forEach((c, i) => { if (id >= c.from && id <= c.to) found = i; });
  return found;
}

export function isStorm(g: GameState): boolean {
  return g.sky === 3;
}

/** Side of a unit id by the original's rule (id >= FIRSTUNUNIT is United Nations). */
export function sideOfId(g: GameState, id: number): Side {
  return id >= g.firstUnUnit ? 'un' : 'communist';
}

/** Side whose orders phase it is. */
export function activeSide(g: GameState): Side {
  return PLAYER_SIDE[g.player];
}

/** Copy WEATHER[0][0] into the cached sky / temperature fields. */
export function syncWeather(g: GameState) {
  const w = g.weather[0][0];
  g.sky = ((w % 10) + 10) % 10;
  g.temperature = Math.trunc(w / 10);
}

/** EURSUBS1.NEWS_FLASH (the original keeps the last eight lines; the remake keeps all). */
export function newsFlash(g: GameState, text: string, turn = g.turn) {
  g.news.push({ turn, text });
}

// ---------- randomness (TACSUBS.RND equivalent, but seeded and reproducible) ----------

export function random(g: GameState): number {
  let t = (g.rng = (g.rng + 0x6d2b79f5) >>> 0);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/** RND(lo, hi), inclusive. */
export function rnd(g: GameState, lo: number, hi: number): number {
  return lo + Math.floor(random(g) * (hi - lo + 1));
}

// ---------- snapshots (used for undo) ----------

export interface Snapshot {
  units: [number, UnitState][];
  stacks: number[][];
  possession: Uint8Array;
  spotted: Uint8Array;
  airfields: AirfieldState[];
  railDemand: [number, number];
  replacements: Record<string, [number, number][]>;
  utility: number[];
  rng: number;
}

export function snapshot(g: GameState, unitIds?: Iterable<number>): Snapshot {
  const ids = unitIds ? [...unitIds] : [...g.units.keys()];
  return {
    units: ids.map((id) => {
      const u = unit(g, id);
      return [id, { ...u, equipment: u.equipment.map((e) => ({ ...e })) }];
    }),
    stacks: g.stacks.map((s) => s.slice()),
    possession: g.possession.slice(),
    spotted: g.spotted.slice(),
    airfields: g.airfields.map((a) => ({ ...a })),
    railDemand: [g.railDemand[0], g.railDemand[1]],
    replacements: Object.fromEntries(Object.entries(g.replacements).map(([n, rows]) => [n, rows.map((r) => [r[0], r[1]] as [number, number])])),
    utility: g.utility.slice(),
    rng: g.rng,
  };
}

export function restore(g: GameState, s: Snapshot) {
  for (const [id, u] of s.units) g.units.set(id, { ...u, equipment: u.equipment.map((e) => ({ ...e })) });
  g.stacks = s.stacks.map((x) => x.slice());
  g.possession = s.possession.slice();
  g.spotted = s.spotted.slice();
  g.airfields = s.airfields.map((a) => ({ ...a }));
  g.railDemand = [s.railDemand[0], s.railDemand[1]];
  g.replacements = Object.fromEntries(Object.entries(s.replacements).map(([n, rows]) => [n, rows.map((r) => [r[0], r[1]] as [number, number])])) as Record<Nation, [number, number][]>;
  g.utility = s.utility.slice();
  g.rng = s.rng;
  g.version++;
}
