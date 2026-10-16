// Web Audio instruments in the manner of an early-90s FM sound card (AdLib/OPL2: two-operator FM) plus noise drums
// (docs/audio.md). Browser only. Everything is synthesized: the project ships no audio files.

import type { Instrument } from './arrange.ts';

const mtof = (m: number) => 440 * 2 ** ((m - 69) / 12);

export interface Voice {
  /** when to start (AudioContext time), length in seconds */
  when: number;
  dur: number;
  midi: number;
  vel: number;
}

export class Synth {
  readonly ctx: AudioContext;
  /** everything ends here (a gentle compressor keeps sudden peaks down) */
  readonly out: GainNode;
  private noise: AudioBuffer;
  private pulse: PeriodicWave;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.ratio.value = 4;
    this.out = ctx.createGain();
    this.out.gain.value = 0.8;
    this.out.connect(comp);
    comp.connect(ctx.destination);
    // one second of white noise for drums and effects
    this.noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    let s = 22222;
    for (let i = 0; i < d.length; i++) { s = (s * 16807) % 2147483647; d[i] = (s / 2147483647) * 2 - 1; }
    // 25% pulse wave (reed / chip lead)
    const n = 24, re = new Float32Array(n), im = new Float32Array(n);
    for (let k = 1; k < n; k++) im[k] = (2 / (k * Math.PI)) * Math.sin(k * Math.PI * 0.25);
    this.pulse = ctx.createPeriodicWave(re, im);
  }

  /** A bus (gain node) on the output: music and effects get one each so they can be faded separately. */
  bus(level = 1): GainNode {
    const g = this.ctx.createGain();
    g.gain.value = level;
    g.connect(this.out);
    return g;
  }

  private env(g: AudioParam, when: number, dur: number, peak: number, a: number, d: number, s: number, r: number) {
    g.setValueAtTime(0, when);
    g.linearRampToValueAtTime(peak, when + a);
    g.linearRampToValueAtTime(peak * s, when + a + d);
    const end = Math.max(when + a + d, when + dur);
    g.setValueAtTime(peak * s, end);
    g.linearRampToValueAtTime(0, end + r);
    return end + r;
  }

  /** Two-operator FM voice (carrier sine, modulator sine at ratio × f, index envelope). */
  private fm(dest: AudioNode, v: Voice, o: { ratio: number; index: number; indexEnd: number; peak: number; a: number; d: number; s: number; r: number; cutoff: number; type?: OscillatorType }) {
    const { ctx } = this;
    const f = mtof(v.midi);
    const car = ctx.createOscillator();
    car.type = o.type ?? 'sine';
    car.frequency.value = f;
    const mod = ctx.createOscillator();
    mod.frequency.value = f * o.ratio;
    const modGain = ctx.createGain();
    modGain.gain.setValueAtTime(f * o.index, v.when);
    modGain.gain.exponentialRampToValueAtTime(Math.max(1, f * o.indexEnd), v.when + Math.max(0.05, Math.min(v.dur, 0.4)));
    mod.connect(modGain);
    modGain.connect(car.frequency);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = o.cutoff;
    const g = ctx.createGain();
    const end = this.env(g.gain, v.when, v.dur, o.peak * v.vel, o.a, o.d, o.s, o.r);
    car.connect(lp);
    lp.connect(g);
    g.connect(dest);
    car.start(v.when); mod.start(v.when);
    car.stop(end + 0.02); mod.stop(end + 0.02);
  }

  private osc(dest: AudioNode, v: Voice, o: { type?: OscillatorType; wave?: PeriodicWave; peak: number; a: number; d: number; s: number; r: number; cutoff: number; detune?: number; glideTo?: number }) {
    const { ctx } = this;
    const car = ctx.createOscillator();
    if (o.wave) car.setPeriodicWave(o.wave);
    else car.type = o.type ?? 'square';
    car.frequency.setValueAtTime(mtof(v.midi), v.when);
    if (o.glideTo !== undefined) car.frequency.exponentialRampToValueAtTime(Math.max(20, mtof(o.glideTo)), v.when + v.dur);
    if (o.detune) car.detune.value = o.detune;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = o.cutoff;
    const g = ctx.createGain();
    const end = this.env(g.gain, v.when, v.dur, o.peak * v.vel, o.a, o.d, o.s, o.r);
    car.connect(lp); lp.connect(g); g.connect(dest);
    car.start(v.when);
    car.stop(end + 0.02);
  }

  /** Filtered noise burst. */
  noiseHit(dest: AudioNode, when: number, dur: number, vel: number, o: { type: BiquadFilterType; freq: number; q?: number; sweepTo?: number; attack?: number }) {
    const { ctx } = this;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = o.type;
    f.frequency.setValueAtTime(o.freq, when);
    if (o.sweepTo) f.frequency.exponentialRampToValueAtTime(o.sweepTo, when + dur);
    f.Q.value = o.q ?? 0.7;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(vel, when + (o.attack ?? 0.003));
    g.gain.exponentialRampToValueAtTime(0.0008, when + dur);
    src.connect(f); f.connect(g); g.connect(dest);
    src.start(when, Math.random() * 0.5);
    src.stop(when + dur + 0.02);
  }

  /** Pitched sine drum (kick, tom, thud). */
  thump(dest: AudioNode, when: number, dur: number, vel: number, from: number, to: number) {
    const { ctx } = this;
    const o = ctx.createOscillator();
    o.frequency.setValueAtTime(from, when);
    o.frequency.exponentialRampToValueAtTime(to, when + dur * 0.6);
    const g = ctx.createGain();
    g.gain.setValueAtTime(vel, when);
    g.gain.exponentialRampToValueAtTime(0.0008, when + dur);
    o.connect(g); g.connect(dest);
    o.start(when); o.stop(when + dur + 0.02);
  }

  /** One note of an instrument. */
  play(dest: AudioNode, inst: Instrument, v: Voice) {
    switch (inst) {
      case 'brass':
        // OPL-style brass: the modulation index swells at the attack, then settles
        return this.fm(dest, v, { ratio: 1, index: 2.6, indexEnd: 1.3, peak: 0.22, a: 0.03, d: 0.12, s: 0.75, r: 0.09, cutoff: 3600 });
      case 'reed':
        return this.osc(dest, v, { wave: this.pulse, peak: 0.11, a: 0.02, d: 0.1, s: 0.7, r: 0.08, cutoff: 2600 });
      case 'organ':
        return this.fm(dest, v, { ratio: 2, index: 1.2, indexEnd: 0.3, peak: 0.07, a: 0.005, d: 0.18, s: 0.35, r: 0.08, cutoff: 3000 });
      case 'bass':
        return this.fm(dest, v, { ratio: 1, index: 1.8, indexEnd: 0.4, peak: 0.26, a: 0.005, d: 0.15, s: 0.55, r: 0.06, cutoff: 1400 });
      case 'kick':
        return this.thump(dest, v.when, 0.28, 0.55 * v.vel, 130, 42);
      case 'tom':
        return this.thump(dest, v.when, 0.3, 0.4 * v.vel, 220, 110);
      case 'snare':
        this.noiseHit(dest, v.when, 0.13, 0.28 * v.vel, { type: 'bandpass', freq: 1900, q: 0.6 });
        return this.thump(dest, v.when, 0.08, 0.12 * v.vel, 220, 160);
      case 'hat':
        return this.noiseHit(dest, v.when, 0.05, 0.08 * v.vel, { type: 'highpass', freq: 7500 });
      case 'cymbal':
        return this.noiseHit(dest, v.when, Math.max(0.6, v.dur), 0.12 * v.vel, { type: 'highpass', freq: 5200, q: 0.4 });
    }
  }

  /** A plain oscillator tone for effects (with an optional glide to another note). */
  tone(dest: AudioNode, when: number, dur: number, midi: number, vel: number, type: OscillatorType | 'pulse' = 'square', glideTo?: number, cutoff = 4000) {
    this.osc(dest, { when, dur, midi, vel }, {
      type: type === 'pulse' ? undefined : type, wave: type === 'pulse' ? this.pulse : undefined,
      peak: 0.18, a: 0.004, d: 0.04, s: 0.8, r: 0.04, cutoff, glideTo,
    });
  }
}
