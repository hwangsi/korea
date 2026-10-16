// A small ABC music notation reader (docs/audio.md). Pure logic, no Web Audio, so Node tests can check the songs.
//
// Supported: header fields X T C M L K Q (others ignored), lyrics w:/W: and % comments skipped, notes A-G a-g with
// octave marks ' and , and accidentals ^ ^^ _ __ = (kept to the end of the bar), lengths (2, /2, 3/2, /, 3/), broken
// rhythm > <, rests z x, ties -, triplets (3, chords in brackets [CEG] (the highest note is the melody), chord symbols
// "Am" "D7", bar lines | || |] [| and simple repeats |: :| (no numbered endings). Slurs, decorations !..!, grace notes
// {..} and line continuations \ are ignored.

export interface AbcNote {
  /** start and length in quarter-note beats */
  t: number;
  dur: number;
  /** MIDI note number, or -1 for a rest */
  midi: number;
}

export interface AbcChord { t: number; symbol: string; }

export interface AbcSong {
  title: string;
  composer: string;
  /** M: numerator / denominator */
  meter: [number, number];
  /** Q: quarter notes per minute (default 120) */
  tempo: number;
  /** length of the pickup bar before the first bar line, in beats (0 if none) */
  pickup: number;
  notes: AbcNote[];
  chords: AbcChord[];
  /** beat of every bar line, in playing order (repeats expanded) */
  bars: number[];
  /** total length in beats */
  length: number;
}

const LETTERS = 'CDEFGAB';
const SEMI: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const SHARP_ORDER = 'FCGDAEB';
const FLAT_ORDER = 'BEADGCF';
/** Major keys by number of sharps (+) / flats (−). */
const KEY_SIG: Record<string, number> = {
  C: 0, G: 1, D: 2, A: 3, E: 4, B: 5, 'F#': 6, 'C#': 7, F: -1, Bb: -2, Eb: -3, Ab: -4, Db: -5, Gb: -6, Cb: -7,
};
/** Modes: fifths to add to the tonic's major key signature (minor = 3 flats more, dorian 2, ...). */
const MODE_FIFTHS: Record<string, number> = { maj: 0, ion: 0, m: -3, min: -3, aeo: -3, dor: -2, phr: -4, lyd: 1, mix: -1, loc: -5 };

/** Key signature: accidental (−1, 0, +1) for each letter. */
export function keySignature(k: string): Record<string, number> {
  const m = /^\s*([A-Ga-g])([#b]?)\s*([A-Za-z]*)/.exec(k);
  const acc: Record<string, number> = { C: 0, D: 0, E: 0, F: 0, G: 0, A: 0, B: 0 };
  if (!m) return acc;
  const tonic = m[1].toUpperCase() + m[2];
  const word = m[3].toLowerCase();
  const mode = word === 'm' ? 'm' : (word || 'maj').slice(0, 3);
  // fifths of the tonic as a major key (enharmonic spellings looked up by pitch class)
  const pcOf = (t: string) => (SEMI[t[0]] + (t[1] === '#' ? 1 : t[1] === 'b' ? -1 : 0) + 12) % 12;
  let fifths = KEY_SIG[tonic];
  if (fifths === undefined) fifths = Object.entries(KEY_SIG).find(([name]) => pcOf(name) === pcOf(tonic))?.[1] ?? 0;
  const n = fifths + (MODE_FIFTHS[mode] ?? 0);
  if (n > 0) for (let i = 0; i < Math.min(7, n); i++) acc[SHARP_ORDER[i]] = 1;
  if (n < 0) for (let i = 0; i < Math.min(7, -n); i++) acc[FLAT_ORDER[i]] = -1;
  return acc;
}

function parseFraction(s: string): number {
  const [a, b] = s.split('/').map(Number);
  return b ? a / b : a;
}

/** Read the length suffix at `src[i]`: returns [multiplier of L, new index]. */
function readLength(src: string, i: number): [number, number] {
  const m = /^(\d*)(\/*)(\d*)/.exec(src.slice(i));
  if (!m || !m[0]) return [1, i];
  const num = m[1] ? Number(m[1]) : 1;
  let den = 1;
  if (m[2]) den = m[3] ? Number(m[3]) : 2 ** m[2].length;
  return [num / den, i + m[0].length];
}

export function parseAbc(text: string): AbcSong {
  const song: AbcSong = { title: '', composer: '', meter: [4, 4], tempo: 120, pickup: 0, notes: [], chords: [], bars: [], length: 0 };
  let unit = 0.5; // L: in quarter beats (1/8 = 0.5)
  let unitSet = false;
  let key = keySignature('C');
  const body: string[] = [];
  let inBody = false;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/%.*$/, '');
    const f = /^([A-Za-z]):\s*(.*)$/.exec(line);
    if (f && !/^[|"[]/.test(line)) {
      const [, k, v] = f;
      if (k === 'T' && !song.title) song.title = v.trim();
      else if (k === 'C' && !song.composer) song.composer = v.trim();
      else if (k === 'M') {
        if (v.trim() === 'C') song.meter = [4, 4];
        else if (v.trim() === 'C|') song.meter = [2, 2];
        else { const [a, b] = v.split('/').map(Number); if (a && b) song.meter = [a, b]; }
        if (!unitSet) unit = song.meter[0] / song.meter[1] < 0.75 ? 0.25 : 0.5;
      } else if (k === 'L') { unit = parseFraction(v.trim()) * 4; unitSet = true; }
      else if (k === 'Q') {
        const q = /(?:(\d+)\/(\d+)\s*=\s*)?(\d+)/.exec(v);
        if (q) song.tempo = Number(q[3]) * (q[1] ? (Number(q[1]) / Number(q[2])) * 4 : 1);
      } else if (k === 'K') { key = keySignature(v); inBody = true; }
      continue;
    }
    if (inBody && line.trim()) body.push(line.replace(/\\\s*$/, ''));
  }

  // tokens of the body, with simple repeats expanded afterwards
  type Ev = { kind: 'note'; dur: number; midi: number; tie: boolean } | { kind: 'chord'; symbol: string } | { kind: 'bar' } | { kind: 'repStart' } | { kind: 'repEnd' };
  const evs: Ev[] = [];
  const src = body.join(' ');
  let acc: Record<string, number> = {}; // accidentals in this bar, by letter+octave
  let tuplet = 0, tupletLeft = 0;
  let broken = 0; // pending factor for the next note from > or <
  const pushNote = (midi: number, len: number, tie: boolean) => {
    let d = len * unit;
    if (tupletLeft > 0) { d *= tuplet === 3 ? 2 / 3 : tuplet === 2 ? 3 / 2 : 2 / tuplet; tupletLeft--; }
    if (broken) { d *= broken; broken = 0; }
    evs.push({ kind: 'note', dur: d, midi, tie });
  };
  /** Read one note (accidental, letter, octave) at i; returns [midi, index] or null. */
  const readPitch = (i: number): [number, number] | null => {
    let j = i, a: number | null = null;
    if (src[j] === '^') { a = 1; j++; if (src[j] === '^') { a = 2; j++; } }
    else if (src[j] === '_') { a = -1; j++; if (src[j] === '_') { a = -2; j++; } }
    else if (src[j] === '=') { a = 0; j++; }
    const c = src[j];
    if (!c || !/[A-Ga-g]/.test(c)) return null;
    j++;
    const L = c.toUpperCase();
    let oct = c === L ? 4 : 5;
    while (src[j] === "'" || src[j] === ',') { oct += src[j] === "'" ? 1 : -1; j++; }
    const k = `${L}${oct}`;
    if (a !== null) acc[k] = a;
    const alter = k in acc ? acc[k] : key[L];
    return [12 * (oct + 1) + SEMI[L] + alter, j];
  };
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (ch === ' ' || ch === '\t' || ch === '`') { i++; continue; }
    if (ch === '"') { const e = src.indexOf('"', i + 1); const s = src.slice(i + 1, e < 0 ? src.length : e); if (/^[A-G]/.test(s)) evs.push({ kind: 'chord', symbol: s }); i = e < 0 ? src.length : e + 1; continue; }
    if (ch === '!' || ch === '+') { const e = src.indexOf(ch, i + 1); i = e < 0 ? src.length : e + 1; continue; }
    if (ch === '{') { const e = src.indexOf('}', i + 1); i = e < 0 ? src.length : e + 1; continue; }
    if (ch === '(') {
      const m = /^\((\d)/.exec(src.slice(i));
      if (m) { tuplet = Number(m[1]); tupletLeft = tuplet; i += 2; } else i++;
      continue;
    }
    if (ch === ')' || ch === '~' || ch === '.' || ch === 'H' || ch === 'T' || ch === 'u' || ch === 'v') { i++; continue; }
    if (ch === '[' && /^\[[A-Za-z]:/.test(src.slice(i))) { const e = src.indexOf(']', i); const fld = src.slice(i + 1, e); if (fld[0] === 'K') key = keySignature(fld.slice(2)); i = e + 1; continue; }
    if (ch === '|' || ch === ':' || (ch === '[' && src[i + 1] === '|')) {
      const m = /^(:*)(\[?\|+\]?)(:*)/.exec(src.slice(i));
      if (m && m[0]) {
        if (m[1]) evs.push({ kind: 'repEnd' });
        evs.push({ kind: 'bar' });
        if (m[3]) evs.push({ kind: 'repStart' });
        acc = {};
        i += m[0].length;
        continue;
      }
      i++;
      continue;
    }
    if (ch === '>' || ch === '<') {
      // broken rhythm: the previous note gets 3/2 (or 1/2), the next 1/2 (or 3/2); repeated > for 7/4 .. ignored
      let n = 0;
      while (src[i] === ch) { n++; i++; }
      const prev = [...evs].reverse().find((e) => e.kind === 'note') as Extract<Ev, { kind: 'note' }> | undefined;
      const f = 1 - 0.5 ** n;
      if (prev) prev.dur *= ch === '>' ? 1 + f : 1 - f;
      broken = ch === '>' ? 1 - f : 1 + f;
      continue;
    }
    if (ch === 'z' || ch === 'x') {
      const [len, j] = readLength(src, i + 1);
      pushNote(-1, len, false);
      i = j;
      continue;
    }
    if (ch === '[') {
      // chord: keep the highest note as the melody (numbered endings [1 [2 are not supported: skipped)
      if (src.indexOf(']', i) < 0 || /^\[\d/.test(src.slice(i))) { i++; continue; }
      let j = i + 1, top = -1;
      let innerLen = 1;
      while (j < src.length && src[j] !== ']') {
        const p = readPitch(j);
        if (!p) { j++; continue; }
        top = Math.max(top, p[0]);
        const [len, k] = readLength(src, p[1]);
        innerLen = len;
        j = k;
        if (src[j] === '-') j++;
      }
      j++;
      const [len, k] = readLength(src, j);
      let tie = false;
      let e = k;
      if (src[e] === '-') { tie = true; e++; }
      if (top >= 0) pushNote(top, innerLen * len, tie);
      i = e;
      continue;
    }
    const p = readPitch(i);
    if (p) {
      const [len, j] = readLength(src, p[1]);
      let k = j, tie = false;
      if (src[k] === '-') { tie = true; k++; }
      pushNote(p[0], len, tie);
      i = k;
      continue;
    }
    i++; // anything else is ignored
  }

  // expand repeats (|: ... :|), section by section
  const flat: Ev[] = [];
  let start = 0;
  for (let k = 0; k < evs.length; k++) {
    const e = evs[k];
    if (e.kind === 'repStart') { start = flat.length; continue; }
    if (e.kind === 'repEnd') { flat.push(...flat.slice(start)); start = flat.length; continue; }
    flat.push(e);
  }

  let t = 0;
  let firstBar = true;
  for (const e of flat) {
    if (e.kind === 'chord') { song.chords.push({ t, symbol: e.symbol }); continue; }
    if (e.kind === 'bar') {
      if (song.bars[song.bars.length - 1] !== t) song.bars.push(t);
      if (firstBar) { firstBar = false; const bar = (song.meter[0] * 4) / song.meter[1]; if (t > 0 && t < bar - 1e-9) song.pickup = t; }
      continue;
    }
    if (e.kind !== 'note') continue;
    const last = song.notes[song.notes.length - 1];
    if (last && last.midi === e.midi && e.midi >= 0 && (last as AbcNote & { tie?: boolean }).tie) {
      last.dur += e.dur;
      (last as AbcNote & { tie?: boolean }).tie = e.tie;
    } else {
      const n: AbcNote & { tie?: boolean } = { t, dur: e.dur, midi: e.midi };
      if (e.tie) n.tie = true;
      song.notes.push(n);
    }
    t += e.dur;
  }
  for (const n of song.notes) delete (n as AbcNote & { tie?: boolean }).tie;
  song.length = t;
  return song;
}

// ---------- chord symbols ----------

/** Pitch classes of a chord symbol ("D", "Bm", "E7", "F#aug", "C#dim"); root first. */
export function chordTones(symbol: string): number[] {
  const m = /^([A-G])([#b]?)(.*)$/.exec(symbol.trim());
  if (!m) return [];
  const root = (SEMI[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + 12) % 12;
  const q = m[3].replace(/\/.*$/, '');
  let iv = [0, 4, 7];
  if (/^(m|min)(?!aj)/.test(q)) iv = [0, 3, 7];
  if (/dim/.test(q)) iv = [0, 3, 6];
  if (/aug|\+/.test(q)) iv = [0, 4, 8];
  if (/sus4/.test(q)) iv = [0, 5, 7];
  if (/maj7/.test(q)) iv = [...iv, 11];
  else if (/7/.test(q)) iv = [...iv, /dim7/.test(q) ? 9 : 10];
  if (/6/.test(q)) iv = [...iv, 9];
  return iv.map((x) => (root + x) % 12);
}

export const NOTE_LETTERS = LETTERS;
