// Background music: public-domain marches written out in ABC with chord symbols, arranged by arrange.ts
// (docs/audio.md). Melodies only; no lyrics. Songs that are still under copyright are not in the repository:
// they are read at run time from data/private/music.json (git-ignored) when it exists, like the extracted game data.

import type { ArrangeStyle } from './arrange.ts';

/** UN (US, British, Australian), ROK, Soviet, Chinese People's Volunteers; 'common': songs of a whole side. */
export type SongGroup = 'un' | 'rok' | 'soviet' | 'pva' | 'common';
export const SONG_GROUPS: SongGroup[] = ['un', 'rok', 'soviet', 'pva', 'common'];

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
  /** army the song belongs to, for the grouped list of the sound menu */
  group?: SongGroup;
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

/** The Marines' Hymn. Melody is Offenbach's 1867 operetta tune (Offenbach d. 1880); later Marine Corps/Leatherneck copyrights cover only words and specific arrangements (Wikipedia). */
const MARINES_HYMN = `X:4
T:The Marines' Hymn
C:Jacques Offenbach (1867)
M:2/4
L:1/8
Q:1/4=112
K:C
"C"CE | "C"G2G2 | "C"G2G2 | "C"G3c | "C"G2EF | "C"G2G2 | "G7"FD3 | "C"C4- | "C"C2CE |
"C"G2G2 | "C"G2G2 | "C"G3c | "C"G2EF | "C"G2G2 | "G7"FD3 | "C"C4- | "C"C2cB |
"F"A2F2 | "F"A2F2 | "C"G3A | "C"G2cB | "F"A2F2 | "D7"Ac3 | "G"G4- | "G7"G2"C"CE |
"C"G2G2 | "C"G2G2 | "C"G3c | "C"G2EF | "C"G2G2 | "G7"FD3 | "C"C4- | "C"C2 |]`;

/** Anchors Aweigh. Zimmermann march published 1906 (Zimmermann d. 1916); only the 1906 refrain melody is used, not later lyric revisions or arrangements. */
const ANCHORS_AWEIGH = `X:5
T:Anchors Aweigh
C:Charles A. Zimmermann (1906)
M:4/4
L:1/8
Q:1/4=120
K:C
"C"C4 E2G2 | "Am"A3E A4 | "C"c3c "G7"d2G2 | "C"c8 |
"F"A4 c2A2 | "C"G2A2 B2c2 | "D7"^F2A2 d2c2 | "G"B2G2 "G7"F2D2 |
"C"C4 E2G2 | "Am"A3E A4 | "C"c4 "G7"d2G2 | "C"c8 |
"F"A4 c2A2 | "C"G2A2 B2c2 | "C"e z/G/ ^FG "G"d z/G/ ^FG | "C"c8 |]`;

/** The British Grenadiers. Traditional English tune (17th-18th century, printed by the 1740s); no author, long public domain. */
const BRITISH_GRENADIERS = `X:6
T:The British Grenadiers
C:Traditional (18th century)
M:4/4
L:1/8
Q:1/4=116
K:G
"D7"D2 | "G"G2D2 G2A2 | "G"B4 "D"A2Bc | "G"d2G2 "D7"BAGF | "G"G6 D2 |
"G"G2D2 G2A2 | "G"B4 "D7"A2Bc | "G"d2G2 "D7"BAGF | "G"G6 Bc |
"G"d3e d2c2 | "G"B3c d2d2 | "C"e2e2 "Am"dcBA | "G"G4 "D"F2DD |
"G"G2FG "D"A2GA | "G"B2AB "C"c2Bc | "G"d2G2 "D7"BAGF | "G"G6 |]`;

/** Waltzing Matilda. Melody by Macpherson (d. 1936) as arranged by Cowan (d. 1919), published 1903; Carl Fischer's 1941 US claim covers only its own arrangement (Wikipedia). Transcribed from the 1903 Cowan tune. */
const WALTZING_MATILDA = `X:8
T:Waltzing Matilda
C:Christina Macpherson (1895), arr. Marie Cowan (1903)
M:4/4
L:1/8
Q:1/4=108
K:F
"F"A>A AA "C7"G2G2 | "F"F2 AF "Bb"DE F2 | "F"C2 F>A c2cc | "F"cc "C7"c2 "F"c z FG |
"F"A2 AA "C7"G2G2 | "F"FG AF "Bb"DE F2 | "F"C2 F>A c2 "C7"BA | "C7"G2 GG "F"F2 z2 |
"F"c2 c>c c2A2 | "F"f2 f>e "Bb"d2 "F"c2 | "F"c2 c>c "Bb"d2 "F"c>c | "F"c2 "C7"BA G z FG |
"F"A2 AA "C7"G2G2 | "F"FG AF "Bb"DE F2 | "F"C2 F>A c2 "C7"BA | "C7"G2 GG "F"F2 z2 |]`;

/** 三大纪律八项注意 (Sān dà jìlǜ bā xiàng zhùyì) - Three Rules of Discipline and Eight Points for Attention. Anonymous melody: Cheng Tan (d.1980) only wrote lyrics (1935) to the existing E-Yu-Wan tune 土地革命成功了, itself from the c.1900 大帅练兵歌; 1950/1957 revisions were lyrics only; anonymous-work terms long expired */
const THREE_RULES = `X:4
T:Three Rules of Discipline and Eight Points for Attention
C:Red Army song, melody traditional (lyrics Cheng Tan 1935, rev. 1957)
M:4/4
L:1/16
Q:1/4=96
K:A
"Bm"B6 c2 "E"e4 e4 | "A"c3e c2A2 "E"B4 z4 | "F#m"F4 c4 F4 c4 | "Bm"B3c B2F2 "A"A4 z4 |
"E"B4 B2e2 "A"c2B2 A4 | "Bm"B3A B2c2 F2B2 G2F2 | "E"E6 G2 F2E2 "Bm"F4 | B3A B2c2 B4 z4 |
"Bm"B6 c2 "E"e4 e4 | "A"c3e c2A2 "E"B4 z4 | "F#m"F4 c4 F4 c4 | "Bm"B3c B2F2 "A"A4 z4 |
"E"B4 B2e2 "A"c2B2 A4 | "Bm"B3A B2c2 F2B2 G2F2 | "E"E6 G2 F2E2 "Bm"F4 | B3A B2c2 B4 z4 |]`;

export const BUILTIN_SONGS: SongEntry[] = [
  {
    id: 'internationale', title: '인터내셔널가', en: "L'Internationale", credit: '피에르 드제테르 (1888) · 1944년까지 소련 국가',
    side: 'communist', group: 'common', abc: INTERNATIONALE, style: { passes: 2, introBars: 1, solemn: true, transpose: 0 }, publicDomain: true,
  },
  {
    id: 'caisson', title: '포차는 굴러간다', en: 'The Caisson Song', credit: '에드먼드 그루버 (1908) · 미 육군가의 원곡',
    side: 'un', group: 'un', abc: CAISSON_SONG, style: { passes: 2, introBars: 1, transpose: 0 }, publicDomain: true,
  },
  {
    id: 'marines', title: '해병대 찬가', en: "The Marines' Hymn", credit: '자크 오펜바흐 (1867) · 미 해병대 공식 노래',
    side: 'un', group: 'un', abc: MARINES_HYMN, style: { passes: 2, introBars: 1 }, publicDomain: true,
  },
  {
    id: 'anchors', title: '닻을 올려라', en: 'Anchors Aweigh', credit: '찰스 A. 짐머만 (1906) · 미 해군 행진곡',
    side: 'un', group: 'un', abc: ANCHORS_AWEIGH, style: { passes: 2, introBars: 1 }, publicDomain: true,
  },
  {
    id: 'bogey', title: '보기 대령 행진곡', en: 'Colonel Bogey March', credit: '케네스 앨퍼드 (1914) · 영국 행진곡',
    side: 'un', group: 'un', abc: COLONEL_BOGEY, style: { passes: 2, introBars: 1 }, publicDomain: true,
  },
  {
    id: 'grenadiers', title: '영국 척탄병', en: 'The British Grenadiers', credit: '영국 전통곡 (18세기) · 영국 근위 척탄병 연대 행진곡',
    side: 'un', group: 'un', abc: BRITISH_GRENADIERS, style: { passes: 2, introBars: 1 }, publicDomain: true,
  },
  {
    id: 'matilda', title: '왈칭 마틸다', en: 'Waltzing Matilda', credit: '크리스티나 맥퍼슨 (1895) · 마리 코완 편곡 (1903) · 호주 병사들의 애창곡',
    side: 'un', group: 'un', abc: WALTZING_MATILDA, style: { passes: 2, introBars: 1 }, publicDomain: true,
  },
  {
    id: 'three_rules', title: '삼대기율 팔항주의', en: '三大纪律八项注意', credit: '작곡 미상 (홍군 가요, 1935) · 중국 인민해방군·지원군의 행진 노래',
    side: 'communist', group: 'pva', abc: THREE_RULES, style: { passes: 2, introBars: 1 }, publicDomain: true,
  },
];

/** Group of a song (songs without one: by side). */
export const groupOf = (s: SongEntry): SongGroup => s.group ?? (s.side === 'communist' ? 'common' : 'un');

/** Medley order: one song from each army in turn (ROK, UN, Soviet, Chinese, then the common communist songs), so the
 * medley does not play one army's songs in a block. Within an army the given order is kept. */
export function medleyOrder(songs: SongEntry[]): SongEntry[] {
  const lanes: SongGroup[] = ['rok', 'un', 'soviet', 'pva', 'common'];
  const queues = lanes.map((g) => songs.filter((s) => groupOf(s) === g));
  const out: SongEntry[] = [];
  for (let k = 0; out.length < songs.length; k++) for (const q of queues) if (k < q.length) out.push(q[k]);
  return out;
}

/** Songs read from data/private/music.json: { songs: [{ id, title, en, credit, side, group, abc, style }] }. */
export function privateSongs(json: unknown): SongEntry[] {
  const list = (json as { songs?: unknown[] } | null)?.songs;
  if (!Array.isArray(list)) return [];
  const out: SongEntry[] = [];
  for (const s of list as Partial<SongEntry>[]) {
    if (!s || typeof s.id !== 'string' || typeof s.abc !== 'string') continue;
    out.push({
      id: s.id, title: s.title ?? s.id, en: s.en ?? '', credit: s.credit ?? '', side: s.side ?? 'any', abc: s.abc,
      group: s.group && SONG_GROUPS.includes(s.group) ? s.group : undefined,
      style: s.style ?? { passes: 2, introBars: 1 }, publicDomain: false,
    });
  }
  return out;
}
