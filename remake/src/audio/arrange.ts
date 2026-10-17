// Turns a melody with chord symbols (abc.ts) into a small march band in the style of an early-90s sound card
// (docs/audio.md): FM brass lead, a reed counter-voice, oom-pah bass and chord stabs, snare/bass drum/cymbal.
// Pure logic: a list of timed note events that synth.ts plays.

import type { AbcSong } from './abc.ts';
import { chordTones } from './abc.ts';

export type Instrument = 'brass' | 'reed' | 'organ' | 'bass' | 'kick' | 'snare' | 'hat' | 'cymbal' | 'tom';

export interface NoteEvent {
  /** start and length in quarter-note beats from the start of the arrangement */
  t: number;
  dur: number;
  midi: number;
  inst: Instrument;
  /** 0..1 */
  vel: number;
}

export interface ArrangeStyle {
  /** quarter notes per minute (default: the song's Q:) */
  tempo?: number;
  /** semitones */
  transpose?: number;
  /** how many times the tune is played; later passes vary the orchestration */
  passes?: number;
  /** bars of drum roll before the tune */
  introBars?: number;
  /** solemn: softer drums, no hats, sustained harmony (hymns such as the Internationale) */
  solemn?: boolean;
}

export interface Arrangement {
  title: string;
  tempo: number;
  /** total length in beats */
  length: number;
  events: NoteEvent[];
}

const EPS = 1e-6;

/** Pitch class list of the chord sounding at beat t (the last symbol at or before t; before the first: the first). */
function chordAt(song: AbcSong, t: number): number[] {
  let sym = song.chords[0]?.symbol ?? 'C';
  for (const c of song.chords) {
    if (c.t <= t + EPS) sym = c.symbol;
    else break;
  }
  return chordTones(sym);
}

/** Lowest MIDI note >= lo with pitch class pc. */
const lift = (pc: number, lo: number) => lo + ((pc - lo) % 12 + 12) % 12;

export function arrange(song: AbcSong, style: ArrangeStyle = {}): Arrangement {
  const tr = style.transpose ?? 0;
  const passes = Math.max(1, style.passes ?? 2);
  const barQ = (song.meter[0] * 4) / song.meter[1];
  const intro = (style.introBars ?? 1) * barQ;
  const events: NoteEvent[] = [];
  const push = (e: NoteEvent) => { if (e.dur > EPS) events.push(e); };

  // drum roll intro: 16ths growing louder, a bass drum and cymbal on the downbeat
  for (let t = 0; t < intro - EPS; t += 0.25) push({ t, dur: 0.2, midi: 0, inst: 'snare', vel: 0.25 + (0.5 * t) / intro });

  const tune = song.length;
  for (let pass = 0; pass < passes; pass++) {
    const off = intro + pass * tune;
    const last = pass === passes - 1;
    // lead: brass on odd passes, reed (an octave up) on even ones
    const leadInst: Instrument = pass % 2 === 0 ? 'brass' : 'reed';
    const leadUp = pass % 2 === 0 ? 0 : 12;
    for (const n of song.notes) {
      if (n.midi < 0) continue;
      const onBeat = Math.abs((n.t - song.pickup) % 1) < EPS || Math.abs(((n.t - song.pickup) % 1) - 1) < EPS;
      const barStart = Math.abs(((n.t - song.pickup) % barQ + barQ) % barQ) < EPS;
      push({ t: off + n.t, dur: n.dur * 0.94, midi: n.midi + tr + leadUp, inst: leadInst, vel: barStart ? 0.95 : onBeat ? 0.85 : 0.75 });
      // counter-voice: a chord tone 3..9 semitones under the melody on the longer notes
      if (n.dur >= 0.5 - EPS) {
        const tones = chordAt(song, n.t);
        const m = n.midi + tr + leadUp;
        let best = -1;
        for (let d = 3; d <= 9; d++) if (tones.includes((((m - d) % 12) + 12) % 12)) { best = m - d; break; }
        if (best > 0) push({ t: off + n.t, dur: n.dur * (style.solemn ? 0.98 : 0.9), midi: best, inst: pass % 2 === 0 ? 'reed' : 'brass', vel: 0.45 });
      }
    }
    // oom-pah: bass on the strong quarters (root, then fifth), chord stabs on the weak ones
    const start = song.pickup > EPS ? song.pickup : 0;
    let alt = 0;
    for (let q = start; q < tune - EPS; q += 1) {
      const inBar = ((q - start) % barQ + barQ) % barQ;
      const tones = chordAt(song, q);
      if (!tones.length) continue;
      // 3/4 (Holy War): bass on one, chords on two and three; otherwise bass on one and three
      const strong = barQ === 3 ? inBar < EPS : Math.round(inBar) % 2 === 0;
      if (strong) {
        const root = lift((tones[0] + tr + 120) % 12, 36);
        const pitch = alt % 2 === 0 ? root : root + 7 > 50 ? root - 5 : root + 7;
        alt++;
        push({ t: off + q, dur: style.solemn ? 0.9 : 0.6, midi: pitch, inst: 'bass', vel: inBar < EPS ? 0.9 : 0.75 });
        if (!style.solemn || inBar < EPS) push({ t: off + q, dur: 0.3, midi: 0, inst: 'kick', vel: inBar < EPS ? 0.85 : 0.6 });
      } else {
        for (const pc of tones.slice(0, 3)) push({ t: off + q, dur: style.solemn ? 0.8 : 0.35, midi: lift((pc + tr + 120) % 12, 55), inst: 'organ', vel: 0.5 });
        push({ t: off + q, dur: 0.15, midi: 0, inst: 'snare', vel: style.solemn ? 0.3 : 0.55 });
      }
      if (!style.solemn) push({ t: off + q + 0.5, dur: 0.05, midi: 0, inst: 'hat', vel: 0.25 });
      // every fourth bar ends with a snare roll, every eighth begins with a cymbal
      const bar = Math.floor((q - start) / barQ);
      if (inBar < EPS && bar % 8 === 0) push({ t: off + q, dur: 1.5, midi: 0, inst: 'cymbal', vel: pass === 0 && bar === 0 ? 0.6 : 0.4 });
      if (Math.abs(inBar - (barQ - 1)) < EPS && bar % 4 === 3 && !style.solemn) {
        for (let s = 0.25; s < 1 - EPS; s += 0.25) push({ t: off + q + s, dur: 0.12, midi: 0, inst: 'snare', vel: 0.35 + s * 0.3 });
      }
    }
    // the last pass ends on a held tonic chord
    if (last) {
      const end = off + tune;
      const tones = song.chords.length ? chordTones(song.chords[song.chords.length - 1].symbol) : [];
      if (tones.length) {
        push({ t: end, dur: barQ, midi: lift((tones[0] + tr + 120) % 12, 36), inst: 'bass', vel: 0.8 });
        for (const pc of tones.slice(0, 3)) push({ t: end, dur: barQ, midi: lift((pc + tr + 120) % 12, 55), inst: 'organ', vel: 0.45 });
        push({ t: end, dur: 2, midi: 0, inst: 'cymbal', vel: 0.5 });
        push({ t: end, dur: 0.3, midi: 0, inst: 'kick', vel: 0.9 });
      }
    }
  }
  events.sort((a, b) => a.t - b.t);
  const length = intro + passes * tune + barQ;
  return { title: song.title, tempo: style.tempo ?? song.tempo, length, events };
}
