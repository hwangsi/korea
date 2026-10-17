// Sound manager (docs/audio.md): music player (medley or one song, or by the side whose phase it is), effects,
// settings kept in the browser. The AudioContext can only start after a click or key press, so `unlock()` is
// called from the first user gesture.

import { parseAbc } from './abc.ts';
import { arrange } from './arrange.ts';
import type { Arrangement } from './arrange.ts';
import { Synth } from './synth.ts';
import { playSfx } from './sfx.ts';
import type { SfxName, SfxOptions } from './sfx.ts';
import { BUILTIN_SONGS, medleyOrder } from './songs.ts';
import type { SongEntry } from './songs.ts';

/** 'medley': every song in turn; 'side': the songs of the side whose phase it is; or one song id (repeated). */
export type MusicChoice = 'medley' | 'side' | string;

export interface SoundSettings {
  music: boolean;
  sfx: boolean;
  /** 0..1 */
  musicVolume: number;
  sfxVolume: number;
  choice: MusicChoice;
}

const KEY = 'conflict-korea-remake/sound';
const DEFAULTS: SoundSettings = { music: true, sfx: true, musicVolume: 0.5, sfxVolume: 0.7, choice: 'medley' };
const LOOKAHEAD = 1.5; // seconds scheduled ahead (background tabs run timers only once a second)

function loadSettings(): SoundSettings {
  try {
    const t = globalThis.localStorage?.getItem(KEY);
    if (t) return { ...DEFAULTS, ...(JSON.parse(t) as Partial<SoundSettings>) };
  } catch { /* storage not available */ }
  return { ...DEFAULTS };
}

export class AudioManager {
  settings: SoundSettings = loadSettings();
  songs: SongEntry[] = [...BUILTIN_SONGS];
  /** song being played (null when silent) */
  current: SongEntry | null = null;
  /** side of the current phase, for the "by side" choice */
  side: 'un' | 'communist' = 'un';
  onChange: () => void = () => {};

  private ctx: AudioContext | null = null;
  private synth: Synth | null = null;
  private musicBus: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  private arr: Arrangement | null = null;
  private next = 0;
  private t0 = 0;
  private timer: ReturnType<typeof setInterval> | null = null;
  private order: string[] = [];
  private cache = new Map<string, Arrangement>();

  /** Add songs read from data/private (copyrighted arrangements kept out of the repository). They go first. */
  addSongs(list: SongEntry[]) {
    const ids = new Set(this.songs.map((s) => s.id));
    this.songs = [...list.filter((s) => !ids.has(s.id)), ...this.songs];
    this.onChange();
  }

  get unlocked(): boolean { return !!this.ctx && this.ctx.state === 'running'; }

  /** Start the AudioContext (from a user gesture) and the music if it is on. */
  unlock() {
    const AC = (globalThis as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).AudioContext
      ?? (globalThis as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    if (!this.ctx) {
      this.ctx = new AC();
      this.synth = new Synth(this.ctx);
      this.sfxBus = this.synth.bus(this.settings.sfxVolume);
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    if (this.settings.music && !this.current) this.play();
  }

  set(partial: Partial<SoundSettings>) {
    const before = this.settings;
    this.settings = { ...this.settings, ...partial };
    try { globalThis.localStorage?.setItem(KEY, JSON.stringify(this.settings)); } catch { /* ignore */ }
    if (this.musicBus && this.ctx) this.musicBus.gain.setTargetAtTime(this.settings.musicVolume, this.ctx.currentTime, 0.05);
    if (this.sfxBus && this.ctx) this.sfxBus.gain.setTargetAtTime(this.settings.sfxVolume, this.ctx.currentTime, 0.05);
    if (!this.settings.music) this.stop();
    else if (this.ctx && (!before.music || before.choice !== this.settings.choice)) this.play();
    this.onChange();
  }

  /** The phase changed sides: in "by side" mode the music follows. */
  setSide(side: 'un' | 'communist') {
    if (this.side === side) return;
    this.side = side;
    if (this.settings.choice === 'side' && this.settings.music && this.ctx && this.current && this.current.side !== side && this.current.side !== 'any') this.play();
  }

  /** Songs the current choice plays, in order. */
  private playlist(): SongEntry[] {
    const c = this.settings.choice;
    const all = medleyOrder(this.songs);
    if (c === 'medley') return all;
    if (c === 'side') {
      const list = all.filter((s) => s.side === this.side || s.side === 'any');
      return list.length ? list : all;
    }
    const one = this.songs.find((s) => s.id === c);
    return one ? [one] : all;
  }

  private arrangement(s: SongEntry): Arrangement {
    let a = this.cache.get(s.id);
    if (!a) { a = arrange(parseAbc(s.abc), s.style); this.cache.set(s.id, a); }
    return a;
  }

  /** Play from the start of the playlist (or the next song after `after`). */
  play(after?: string) {
    if (!this.ctx || !this.synth) return;
    this.stop(false);
    const list = this.playlist();
    if (!list.length) return;
    let k = 0;
    if (after) { const i = list.findIndex((s) => s.id === after); k = i < 0 ? 0 : (i + 1) % list.length; }
    const song = list[k];
    this.current = song;
    this.arr = this.arrangement(song);
    this.next = 0;
    this.musicBus = this.synth.bus(0);
    this.musicBus.gain.setTargetAtTime(this.settings.musicVolume, this.ctx.currentTime, 0.2);
    this.t0 = this.ctx.currentTime + 0.15;
    this.order = list.map((s) => s.id);
    this.timer = setInterval(() => this.tick(), 100);
    this.tick();
    this.onChange();
  }

  /** Skip to the next song of the playlist. */
  skip() {
    if (!this.ctx) return;
    this.play(this.current?.id);
  }

  stop(notify = true) {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
    if (this.musicBus && this.ctx) {
      // notes already scheduled on the old bus fade out with it
      const old = this.musicBus;
      old.gain.cancelScheduledValues(this.ctx.currentTime);
      old.gain.setTargetAtTime(0, this.ctx.currentTime, 0.08);
      setTimeout(() => old.disconnect(), (LOOKAHEAD + 1) * 1000);
    }
    this.musicBus = null;
    this.arr = null;
    this.current = null;
    if (notify) this.onChange();
  }

  private tick() {
    if (!this.ctx || !this.synth || !this.arr || !this.musicBus) return;
    const spb = 60 / this.arr.tempo;
    const horizon = this.ctx.currentTime + LOOKAHEAD;
    const ev = this.arr.events;
    while (this.next < ev.length) {
      const e = ev[this.next];
      const when = this.t0 + e.t * spb;
      if (when > horizon) break;
      if (when >= this.ctx.currentTime - 0.05) this.synth.play(this.musicBus, e.inst, { when, dur: e.dur * spb, midi: e.midi, vel: e.vel });
      this.next++;
    }
    // the song is over: the next one (a single song repeats)
    if (this.next >= ev.length && this.ctx.currentTime > this.t0 + this.arr.length * spb - 0.1) {
      const id = this.current?.id;
      this.play(id);
    }
  }

  /** Render the first `seconds` of a song without playing it (checks and previews; OfflineAudioContext). */
  async renderOffline(id: string, seconds = 20, sampleRate = 22050): Promise<AudioBuffer | null> {
    const song = this.songs.find((s) => s.id === id);
    const OAC = (globalThis as { OfflineAudioContext?: typeof OfflineAudioContext }).OfflineAudioContext;
    if (!song || !OAC) return null;
    const ctx = new OAC(1, Math.ceil(seconds * sampleRate), sampleRate);
    const synth = new Synth(ctx as unknown as AudioContext);
    const bus = synth.bus(this.settings.musicVolume || 0.5);
    const arr = this.arrangement(song);
    const spb = 60 / arr.tempo;
    for (const e of arr.events) {
      const when = 0.05 + e.t * spb;
      if (when > seconds) break;
      synth.play(bus, e.inst, { when, dur: e.dur * spb, midi: e.midi, vel: e.vel });
    }
    return ctx.startRendering();
  }

  /** Render one effect offline (checks). */
  async renderSfx(name: SfxName, seconds = 3, sampleRate = 22050): Promise<AudioBuffer | null> {
    const OAC = (globalThis as { OfflineAudioContext?: typeof OfflineAudioContext }).OfflineAudioContext;
    if (!OAC) return null;
    const ctx = new OAC(1, Math.ceil(seconds * sampleRate), sampleRate);
    const synth = new Synth(ctx as unknown as AudioContext);
    playSfx(synth, synth.bus(this.settings.sfxVolume || 0.7), name, 0.02, { count: 3 });
    return ctx.startRendering();
  }

  /** A sound effect, `delay` seconds from now. */
  sfx(name: SfxName, o?: SfxOptions, delay = 0) {
    if (!this.settings.sfx || !this.ctx || !this.synth || !this.sfxBus || this.ctx.state !== 'running') return;
    playSfx(this.synth, this.sfxBus, name, this.ctx.currentTime + 0.01 + delay, o);
  }
}
