// Shapes of the JSON produced by tools/extract/extract.ts

export type TerrainKind =
  | 'open' | 'rough' | 'mountain' | 'urban' | 'offmap' | 'ocean' | 'estuary' | 'reservoir' | 'undefined' | 'japan';

export interface Hex {
  x: number;
  y: number;
  code: number;
  terrain: TerrainKind;
  label: string;
  closed: boolean;
  /** Hexside bit masks: N=1, NE=2, SE=4, S=8, SW=16, NW=32 */
  river: number;
  road: number;
  rail: number;
}

export interface Place { x: number; y: number; name: string; ko: string; only1995?: boolean; }
export interface Port { id: number; x: number; y: number; mined: boolean; name: string; ko: string; }
export interface Airfield { id: number; x: number; y: number; current: number; best: number; name: string; ko: string; code?: string; }

export interface MapData {
  width: number;
  height: number;
  hexes: Hex[];
  variant1995: Hex[];
  cities: Place[];
  ports: Port[];
  airfields: Airfield[];
  supplyPoints: { x: number; y: number }[];
}

export interface Equipment { type: number; assigned: number; authorized: number; }

export type Nation = 'US' | 'USMC' | 'CW' | 'UN' | 'ROK' | 'NKPA' | 'CPLA';
export type UnitKind = 'armor' | 'infantry' | 'airborne' | 'heavy_artillery' | 'artillery';

export interface Unit {
  id: number;
  name: string;
  forceName: string;
  symbol: number;
  nation: Nation;
  kind: UnitKind;
  /** 1 = green, 2 = seasoned, 3 = veteran */
  experience: number;
  status: number;
  readiness: number;
  move: number;
  attached: number;
  x: number;
  y: number;
  onMap: boolean;
  equipment: Equipment[];
}

export interface Force { leader: number; name: string; x: number; y: number; units: number[]; }
export interface EquipmentType { id: number; name: string; lethality: number; survivability: number; }

export interface Scenario {
  id: string;
  file: string;
  scenario: number;
  title: { en: string; ko: string };
  variant: 'S' | 'base';
  turn: number;
  date: { year: number; month: number; day: number; label: string };
  stockpile: { un: number; communist: number };
  /** SCENARIO bytes: [scenario, ?, communist competence, computer side (0 none, 1 communist, 2 UN), ...] */
  settingsRaw: number[];
  /** WEATHER 3x4 int16; [0] is the current turn (temperature*10 + sky) */
  weatherRaw: number[];
  weatherNow: { temperature: number; sky: number };
  freezeLine: number;
  ccfIntervention: number;
  /** REFUGEES: United Nations units cannot use roads */
  refugees: boolean;
  /** CORPS: unit id ranges per army (NKPA, CPLA, ROK, UN) */
  corps: { army: string; from: number; to: number }[];
  /** DUAL arrays, index 0 = Communist player, 1 = United Nations player */
  interdiction: number[];
  railDemand: number[];
  /** REPLACEMENTS[nation][type - 1] = [new equipment, recovered from eliminated units] */
  replacements?: Partial<Record<Nation, number[][]>>;
  units: Unit[];
  forces: Force[];
  equipmentTypes: EquipmentType[];
  aircraftTypes: { id: number; name: string }[];
  ports: { id: number; x: number; y: number; mined: boolean }[];
  airfields: { id: number; x: number; y: number; current: number; best: number }[];
  news: string[];
  /** Row-major (y * width + x): 0 = none, 1 = United Nations, 2 = Communist */
  possession: number[];
  /** Row-major TERRAIN bytes 2-4: [spotting, first force leader, second force leader] */
  hexExtra?: number[][];
}
