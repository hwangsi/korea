// Background music tests (docs/audio.md): the ABC reader, the arranger and the song data.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parseAbc, keySignature, chordTones } from '../src/audio/abc.ts';
import { arrange } from '../src/audio/arrange.ts';
import { BUILTIN_SONGS, privateSongs } from '../src/audio/songs.ts';
import type { SongEntry } from '../src/audio/songs.ts';

const PRIVATE = join(import.meta.dirname, '..', 'data', 'private', 'music.json');

test('ABC reader: keys, accidentals, lengths, tuplets, broken rhythm, ties, repeats', () => {
  assert.deepEqual(keySignature('G'), { C: 0, D: 0, E: 0, F: 1, G: 0, A: 0, B: 0 });
  assert.deepEqual(keySignature('Em'), keySignature('G'));
  assert.equal(keySignature('A').G, 1);
  assert.equal(keySignature('F').B, -1);
  assert.equal(keySignature('Ddor').F, 0);

  const s = parseAbc('X:1\nT:t\nM:4/4\nL:1/8\nQ:1/4=90\nK:G\nF ^c c =F | (3ABc d2 e>f g2- | g4 z4 |: A4 B4 :|');
  const m = s.notes.map((n) => n.midi);
  // F is F#, ^c then c in the same bar stays C#, =F is F natural
  assert.deepEqual(m.slice(0, 4), [66, 73, 73, 65]);
  assert.equal(s.tempo, 90);
  // triplet eighths fill one beat, e>f = dotted eighth + sixteenth, g2- tie g4 merges into one note of 3 beats
  const d = s.notes.map((n) => +n.dur.toFixed(3));
  assert.deepEqual(d.slice(4, 7), [0.333, 0.333, 0.333]);
  assert.deepEqual(d.slice(8, 10), [0.75, 0.25]);
  assert.equal(d[10], 3);
  // the repeat plays A B twice
  assert.deepEqual(s.notes.slice(-4).map((n) => n.midi), [69, 71, 69, 71]);
  assert.equal(s.length, 2 + 4 + 4 + 8);

  assert.deepEqual(chordTones('D7'), [2, 6, 9, 0]);
  assert.deepEqual(chordTones('Bm'), [11, 2, 6]);
  assert.deepEqual(chordTones('F#aug'), [6, 10, 2]);
});

function checkSong(s: SongEntry) {
  const a = parseAbc(s.abc);
  const barQ = (a.meter[0] * 4) / a.meter[1];
  assert.ok(a.notes.length > 40, `${s.id}: a whole tune`);
  assert.ok(a.chords.length > 4, `${s.id}: chord symbols for the accompaniment`);
  // every bar is full except pickups (a pickup bar and its complement add up to one bar)
  let carry = a.pickup;
  for (let i = 1; i < a.bars.length; i++) {
    const len = a.bars[i] - a.bars[i - 1];
    if (Math.abs(len - barQ) < 1e-6) continue;
    assert.ok(Math.abs(len + carry - barQ) < 1e-6 || Math.abs(len + carry - 2 * barQ) < 1e-6 || len < barQ, `${s.id}: bar ${i} lasts ${len}`);
    carry = Math.abs(len + carry - barQ) < 1e-6 ? 0 : len;
  }
  for (const n of a.notes) if (n.midi >= 0) assert.ok(n.midi >= 50 && n.midi <= 92, `${s.id}: note ${n.midi} in range`);
  const arr = arrange(a, s.style);
  assert.ok(arr.events.length > a.notes.length * 3, `${s.id}: band parts`);
  assert.ok(arr.events.every((e) => Number.isFinite(e.t) && e.dur > 0 && e.vel > 0 && e.vel <= 1));
  const insts = new Set(arr.events.map((e) => e.inst));
  for (const i of ['brass', 'reed', 'bass', 'organ', 'snare', 'kick']) assert.ok(insts.has(i as never), `${s.id}: ${i}`);
  const seconds = (arr.length * 60) / arr.tempo;
  assert.ok(seconds > 50 && seconds < 240, `${s.id}: ${seconds.toFixed(0)} s`);
}

test('public-domain songs: Internationale, Colonel Bogey, Caisson Song', () => {
  assert.deepEqual(BUILTIN_SONGS.map((s) => s.id), ['internationale', 'bogey', 'caisson']);
  for (const s of BUILTIN_SONGS) { assert.ok(s.publicDomain); checkSong(s); }
});

test('private songs (data/private/music.json, not in the repository)', { skip: existsSync(PRIVATE) ? false : 'no data/private/music.json' }, () => {
  const list = privateSongs(JSON.parse(readFileSync(PRIVATE, 'utf8')));
  assert.ok(list.length >= 1);
  for (const s of list) { assert.equal(s.publicDomain, false); checkSong(s); }
  assert.deepEqual(privateSongs(null), []);
  assert.deepEqual(privateSongs({ songs: [{ id: 'x' }] }), []);
});
