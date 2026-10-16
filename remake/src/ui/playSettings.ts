// Play settings from the original options menu (docs/rules/options.md 5): game speed (KOREA.SET_SPEED, DELAYVALUE
// 1 fast / 2 medium / 3 slow) and movement centering (KOREA.TOGGLE_CENTERING, CENTER). Kept in the browser like the
// sound settings; the original NEW_GAME (`09a2`) also keeps BEEPS, CENTER and DELAYVALUE across a new game.

export type Speed = 1 | 2 | 3;

export interface PlaySettings {
  /** DELAYVALUE: 1 fast, 2 medium (original start value, KOREA `01f4`), 3 slow. */
  speed: Speed;
  /** CENTER: keep the moving force in the middle of the map at every step (original default off). */
  follow: boolean;
  /** Show every ground battle step by step after the combat phase, like the original (ui/combatReplay.ts). */
  replay: boolean;
}

export const PLAY_DEFAULTS: PlaySettings = { speed: 2, follow: false, replay: true };

const KEY = 'conflict-korea-remake/play';

export function loadPlaySettings(): PlaySettings {
  try {
    const t = globalThis.localStorage?.getItem(KEY);
    if (t) {
      const j = JSON.parse(t) as Partial<PlaySettings>;
      const speed = j.speed === 1 || j.speed === 2 || j.speed === 3 ? j.speed : PLAY_DEFAULTS.speed;
      return {
        speed,
        follow: typeof j.follow === 'boolean' ? j.follow : PLAY_DEFAULTS.follow,
        replay: typeof j.replay === 'boolean' ? j.replay : PLAY_DEFAULTS.replay,
      };
    }
  } catch { /* storage not available */ }
  return { ...PLAY_DEFAULTS };
}

export function savePlaySettings(s: PlaySettings) {
  try { globalThis.localStorage?.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ }
}

/** TACSUBS.GAMEDELAY: every pause of the original is ms * DELAYVALUE div 2 (x0.5, x1, x1.5). */
export const gameDelay = (ms: number, speed: Speed) => Math.trunc((ms * speed) / 2);

/** Movement animation (remake addition): time per hex at medium speed, and a cap for long rail or sea moves. */
export const MOVE_STEP_MS = 120;
export const MOVE_CAP_MS = 1200;

/** Milliseconds per step of a move of `steps` hexes. */
export function moveStepMs(steps: number, speed: Speed): number {
  if (steps <= 0) return 0;
  return Math.min(gameDelay(MOVE_STEP_MS, speed), gameDelay(MOVE_CAP_MS, speed) / steps);
}
