// Background music: public-domain marches written out in ABC with chord symbols, arranged by arrange.ts
// (docs/audio.md). Melodies only; no lyrics. Songs that are still under copyright are not in the repository:
// they are read at run time from data/private/music.json (git-ignored) when it exists, like the extracted game data.

import type { ArrangeStyle } from './arrange.ts';

export interface SongEntry {
  id: string;
  /** Korean title shown in the sound menu */
  title: string;
  /** original title */
  en: string;
  /** composer and year, as shown */
  credit: string;
  /** which side's phases the song suits (the "by side" music mode) */
  side: 'un' | 'communist' | 'any';
  abc: string;
  style: ArrangeStyle;
  /** false for songs read from data/private (not distributed) */
  publicDomain: boolean;
}

/** L'Internationale (Pierre De Geyter, 1888; anthem of the Soviet Union until 1944). Public domain. */
const INTERNATIONALE = `X:1
T:L'Internationale
C:Pierre De Geyter (1888)
M:4/4
L:1/8
Q:1/4=104
K:A
E | "A"A3 G BA EC | "D"F4 "Bm"D2 zF | "Bm"B3 A "E7"GF ED | "A"C6 zE |
"A"A3 G BA EC | "D"F4 "Bm"D2 BA | "E"G2 GB "E7"d3 G | "A"A6 "A7"cB |
"E"G3 G "B7"FG AF | "E"G4 E^D EF | "B7"FF2 F B3 A | "E"G6 zB |
"E"B3 G EE ^DE | "A7"c4 EF GA | "E"G2 B2 "B7"A2 F2 | "E"E6 "E7"c>B |
"A"A4 E3 F | "D"F4 "Bm"D2 B>A | "E"G2 G2 "Bm"F2 E2 | "A"E6 E2 |
"A"c3 c "E"B2 E2 | "F#m"A4 "C#"G3 G | "Bm"F3 ^E F2 B2 | "E"B6 "E7"c>B |
"A"A4 E3 F | "D"F4 "Bm"D2 B>A | "E"G2 G2 "E7"G3 E | "A"c6 zc |
"F#7"e3 e "F#aug"d2 "F#"c2 | "Bm"B2 c2 d2 zd | "A"c3 c "E7"B3 A | "A"A6 |]`;

/** Colonel Bogey March (Kenneth J. Alford, 1914), first strain and its repeat an octave up. Public domain. */
const COLONEL_BOGEY = `X:2
T:Colonel Bogey March
C:Kenneth J. Alford (1914)
M:2/2
L:1/4
Q:1/4=136
K:D
"D"A F/ z/ z2 | z F G A | f z f z | d4 | A F/ z/ z2 | z F G F | "A7"A z A z | G4 |
G E/ z/ z2 | z E F G | "D"A F/ z/ z2 | "E7"z F ^G3/2 F/ | "A"E A z F | "E7"^G E z B | "A"A4- | "A7"A A/A/ A A |
"D"a f/ z/ z2 | z f g a | f' z f' z | d'4 | a f/ z/ z2 | z f g f | "A7"a z a z | g4 |
g e/ z/ z2 | "D"z a b a | d' a z2 | z a g f | "G"e b/ z/ z d | "A7"c a/ z/ z c | "D"d4- | d z z2 |]`;

/** The Caisson Song (Edmund L. Gruber, 1908; "The Army Goes Rolling Along"). Public domain (US court, 1944). */
const CAISSON_SONG = `X:3
T:The Caisson Song
C:Edmund L. Gruber (1908)
M:2/4
L:1/8
Q:1/4=118
K:G
"G"dB | d2 dB | d2 dB | d>e dB | d2 Bc | "D7"d c2 A | d c2 A | "G"G4- | G2 :| "D7"dd |
"G"g2 g2 | d2 dd | "C"e>f ge | "G"d4 | "Em"g g2 f | "A7"ee fg | "D"f4- | "D7"f2 dd |
"G"g2 g2 | "D"f4 | "C"e>f ge | "G"d2 Bc | "D7"d c2 A | d c2 A | "G"G4- | G2 |]`;

export const BUILTIN_SONGS: SongEntry[] = [
  {
    id: 'internationale', title: '인터내셔널가', en: "L'Internationale", credit: '피에르 드제테르 (1888) · 1944년까지 소련 국가',
    side: 'communist', abc: INTERNATIONALE, style: { passes: 2, introBars: 1, solemn: true, transpose: 0 }, publicDomain: true,
  },
  {
    id: 'bogey', title: '보기 대령 행진곡', en: 'Colonel Bogey March', credit: '케네스 앨퍼드 (1914) · 영국 행진곡',
    side: 'un', abc: COLONEL_BOGEY, style: { passes: 2, introBars: 1 }, publicDomain: true,
  },
  {
    id: 'caisson', title: '포차는 굴러간다', en: 'The Caisson Song', credit: '에드먼드 그루버 (1908) · 미 육군가의 원곡',
    side: 'un', abc: CAISSON_SONG, style: { passes: 2, introBars: 1, transpose: 0 }, publicDomain: true,
  },
];

/** Songs read from data/private/music.json: { songs: [{ id, title, en, credit, side, abc, style }] }. */
export function privateSongs(json: unknown): SongEntry[] {
  const list = (json as { songs?: unknown[] } | null)?.songs;
  if (!Array.isArray(list)) return [];
  const out: SongEntry[] = [];
  for (const s of list as Partial<SongEntry>[]) {
    if (!s || typeof s.id !== 'string' || typeof s.abc !== 'string') continue;
    out.push({
      id: s.id, title: s.title ?? s.id, en: s.en ?? '', credit: s.credit ?? '', side: s.side ?? 'any', abc: s.abc,
      style: s.style ?? { passes: 2, introBars: 1 }, publicDomain: false,
    });
  }
  return out;
}
