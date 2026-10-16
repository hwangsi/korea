// Sound menu (docs/audio.md): music and effects on/off and volume, which music to play. A drop-down under the
// top-bar button; buttons carry data-snd and main.ts handles them with one delegated listener.

import type { AudioManager } from '../audio/index.ts';
import { SOUND_UI_KO as T } from '../i18n/ko.ts';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export function renderSoundPanel(el: HTMLElement, a: AudioManager) {
  const s = a.settings;
  const choice = (value: string, label: string, sub = '') =>
    `<button type="button" class="snd-choice" data-snd="choice" data-value="${esc(value)}" aria-pressed="${s.choice === value}">
       <span>${a.current?.id === value ? '♪ ' : ''}${esc(label)}</span>${sub ? `<small>${esc(sub)}</small>` : ''}
     </button>`;
  const songs = a.songs.map((x) => choice(x.id, x.title, `${x.en} · ${x.credit}`)).join('');
  el.innerHTML = `
    <div class="snd-box" role="dialog" aria-label="${esc(T.title)}">
      <div class="snd-row">
        <button type="button" class="btn snd-toggle" data-snd="music" aria-pressed="${s.music}">${esc(s.music ? T.musicOn : T.musicOff)}</button>
        <input type="range" min="0" max="100" value="${Math.round(s.musicVolume * 100)}" data-snd="musicVolume" aria-label="${esc(T.musicVolume)}">
      </div>
      <div class="snd-row">
        <button type="button" class="btn snd-toggle" data-snd="sfx" aria-pressed="${s.sfx}">${esc(s.sfx ? T.sfxOn : T.sfxOff)}</button>
        <input type="range" min="0" max="100" value="${Math.round(s.sfxVolume * 100)}" data-snd="sfxVolume" aria-label="${esc(T.sfxVolume)}">
      </div>
      <p class="snd-now">${a.current ? `${esc(T.nowPlaying)}: <b>${esc(a.current.title)}</b>` : esc(a.unlocked || !s.music ? T.silent : T.clickToStart)}
        ${a.current ? `<button type="button" class="btn small" data-snd="skip">${esc(T.next)}</button>` : ''}</p>
      <div class="snd-list">
        ${choice('medley', T.medley, T.medleyHint)}
        ${choice('side', T.bySide, T.bySideHint)}
        ${songs}
      </div>
      <p class="snd-note">${esc(T.note)}</p>
    </div>`;
}
