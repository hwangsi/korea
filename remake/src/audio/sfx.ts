// Sound effects, synthesized like the music (docs/audio.md). Browser only.

import type { Synth } from './synth.ts';

export type SfxName =
  | 'click' | 'select' | 'pin' | 'cancel' | 'undo' | 'error'
  | 'march' | 'rail' | 'ship' | 'plane' | 'drop'
  | 'bugle' | 'overrun' | 'battle' | 'airstrike' | 'explosion'
  | 'phaseUn' | 'phaseRed' | 'drumroll' | 'news' | 'save' | 'victory' | 'defeat' | 'start';

export interface SfxOptions {
  /** battle: number of engagements (more gunfire and explosions) */
  count?: number;
}

/** Play effect `name` at time `t` on `dest`. */
export function playSfx(s: Synth, dest: AudioNode, name: SfxName, t: number, o: SfxOptions = {}) {
  switch (name) {
    case 'click':
      return s.tone(dest, t, 0.025, 96, 0.35, 'pulse');
    case 'select':
      s.tone(dest, t, 0.04, 79, 0.4, 'pulse');
      return s.tone(dest, t + 0.05, 0.06, 86, 0.4, 'pulse');
    case 'pin':
      return s.tone(dest, t, 0.05, 84, 0.35, 'pulse');
    case 'cancel':
      s.tone(dest, t, 0.05, 79, 0.35, 'pulse');
      return s.tone(dest, t + 0.06, 0.07, 72, 0.35, 'pulse');
    case 'undo':
      return s.tone(dest, t, 0.16, 84, 0.35, 'triangle', 72);
    case 'error':
      s.tone(dest, t, 0.12, 45, 0.5, 'square', undefined, 900);
      return s.tone(dest, t + 0.14, 0.18, 44, 0.5, 'square', undefined, 900);
    case 'march':
      // boots on a road: four heavy steps with a little snare
      for (let k = 0; k < 4; k++) {
        s.noiseHit(dest, t + k * 0.17, 0.09, 0.5, { type: 'lowpass', freq: 500 });
        s.thump(dest, t + k * 0.17, 0.08, 0.25, 90, 60);
      }
      return;
    case 'rail':
      // a locomotive: chuffs speeding up and a whistle
      for (let k = 0; k < 6; k++) s.noiseHit(dest, t + k * (0.2 - k * 0.018), 0.12, 0.35, { type: 'bandpass', freq: 900, q: 1.2 });
      s.tone(dest, t + 0.45, 0.45, 81, 0.25, 'square', undefined, 2400);
      return s.tone(dest, t + 0.45, 0.45, 85, 0.2, 'square', undefined, 2400);
    case 'ship':
      // a ship's horn: two low tones with a slow swell, sea noise under it
      s.noiseHit(dest, t, 1.4, 0.12, { type: 'lowpass', freq: 400, attack: 0.4 });
      s.tone(dest, t, 1.1, 38, 0.5, 'sawtooth', undefined, 500);
      return s.tone(dest, t, 1.1, 45, 0.35, 'sawtooth', undefined, 500);
    case 'plane':
      // a propeller plane passing: engine buzz rising then falling
      s.tone(dest, t, 0.8, 40, 0.35, 'sawtooth', 47, 700);
      s.tone(dest, t + 0.8, 0.7, 47, 0.3, 'sawtooth', 38, 700);
      return s.noiseHit(dest, t, 1.5, 0.15, { type: 'bandpass', freq: 600, q: 0.8, attack: 0.5 });
    case 'drop':
      playSfx(s, dest, 'plane', t);
      for (let k = 0; k < 3; k++) s.noiseHit(dest, t + 0.6 + k * 0.25, 0.3, 0.12, { type: 'highpass', freq: 2500, sweepTo: 800 });
      return;
    case 'bugle':
      // assault plotted: a short bugle call (G C E G)
      [67, 72, 76, 79].forEach((m, k) => s.play(dest, 'brass', { when: t + k * 0.11, dur: k === 3 ? 0.3 : 0.09, midi: m, vel: 0.9 }));
      return;
    case 'overrun':
      playSfx(s, dest, 'explosion', t);
      [72, 76, 79, 84].forEach((m, k) => s.play(dest, 'brass', { when: t + 0.35 + k * 0.08, dur: 0.12, midi: m, vel: 0.8 }));
      return;
    case 'explosion':
      s.thump(dest, t, 0.9, 0.9, 80, 30);
      return s.noiseHit(dest, t, 1.1, 0.6, { type: 'lowpass', freq: 1800, sweepTo: 120 });
    case 'battle': {
      // gunfire rattles and shell bursts, more of them for more engagements
      const n = Math.max(1, Math.min(6, o.count ?? 2));
      for (let k = 0; k < 10 + n * 4; k++) s.noiseHit(dest, t + k * 0.06 + (k % 3) * 0.01, 0.04, 0.25, { type: 'bandpass', freq: 2200, q: 0.9 });
      for (let k = 0; k < n; k++) {
        s.thump(dest, t + 0.3 + k * 0.45, 0.8, 0.8, 70, 28);
        s.noiseHit(dest, t + 0.3 + k * 0.45, 0.9, 0.45, { type: 'lowpass', freq: 1500, sweepTo: 100 });
      }
      return;
    }
    case 'airstrike':
      // diving plane (falling whistle), then bombs
      s.tone(dest, t, 1.0, 96, 0.18, 'sine', 76);
      playSfx(s, dest, 'plane', t);
      for (let k = 0; k < 3; k++) {
        s.thump(dest, t + 1.0 + k * 0.3, 0.9, 0.85, 75, 28);
        s.noiseHit(dest, t + 1.0 + k * 0.3, 1.0, 0.5, { type: 'lowpass', freq: 1600, sweepTo: 110 });
      }
      return;
    case 'phaseUn':
      // a UN orders phase: bugle (C E G C')
      [72, 76, 79, 84].forEach((m, k) => s.play(dest, 'brass', { when: t + k * 0.14, dur: k === 3 ? 0.45 : 0.12, midi: m, vel: 0.85 }));
      s.play(dest, 'snare', { when: t, dur: 0.1, midi: 0, vel: 0.6 });
      return;
    case 'phaseRed':
      // a Communist orders phase: low brass in minor (A C E A) over a drum
      [57, 60, 64, 69].forEach((m, k) => s.play(dest, 'brass', { when: t + k * 0.16, dur: k === 3 ? 0.5 : 0.14, midi: m, vel: 0.85 }));
      s.play(dest, 'kick', { when: t, dur: 0.3, midi: 0, vel: 0.9 });
      return s.play(dest, 'kick', { when: t + 0.48, dur: 0.3, midi: 0, vel: 0.9 });
    case 'drumroll':
      for (let k = 0; k < 14; k++) s.play(dest, 'snare', { when: t + k * 0.045, dur: 0.1, midi: 0, vel: 0.35 + k * 0.03 });
      s.play(dest, 'kick', { when: t + 0.65, dur: 0.3, midi: 0, vel: 0.9 });
      return s.play(dest, 'cymbal', { when: t + 0.65, dur: 0.8, midi: 0, vel: 0.6 });
    case 'news':
      // a teleprinter
      for (let k = 0; k < 7; k++) s.noiseHit(dest, t + k * 0.07 + (k % 2) * 0.02, 0.025, 0.25, { type: 'highpass', freq: 3000 });
      return s.tone(dest, t + 0.55, 0.06, 93, 0.25, 'sine');
    case 'save':
      s.tone(dest, t, 0.25, 84, 0.3, 'sine');
      return s.tone(dest, t + 0.12, 0.35, 88, 0.3, 'sine');
    case 'start':
      playSfx(s, dest, 'drumroll', t);
      [67, 72, 76, 79, 84].forEach((m, k) => s.play(dest, 'brass', { when: t + 0.7 + k * 0.12, dur: k === 4 ? 0.6 : 0.1, midi: m, vel: 0.9 }));
      return;
    case 'victory':
      [72, 72, 72, 76, 79, 84].forEach((m, k) => s.play(dest, 'brass', { when: t + [0, 0.15, 0.3, 0.45, 0.75, 1.05][k], dur: k === 5 ? 1.2 : 0.12, midi: m, vel: 0.9 }));
      s.play(dest, 'cymbal', { when: t + 1.05, dur: 1.5, midi: 0, vel: 0.7 });
      return;
    case 'defeat':
      [69, 65, 62, 57].forEach((m, k) => s.play(dest, 'brass', { when: t + k * 0.35, dur: k === 3 ? 1.2 : 0.3, midi: m, vel: 0.7 }));
      return s.play(dest, 'tom', { when: t + 1.05, dur: 0.4, midi: 0, vel: 0.8 });
  }
}
