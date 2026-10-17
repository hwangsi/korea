// Prototype entry point: loads the extracted data, builds the game state and wires the Korean UI.
// Turn sequence (docs/rules/turn.md): each player's First Orders Phase -> combat -> Second Orders Phase
// -> General Resolution -> next turn. "단계 종료" ends the current player's phase.
// Movement orders: click a force -> reachable hexes, hover -> path preview, click -> pin, click again
// -> move. Right click / Esc cancels, Ctrl+Z undoes the last move (docs/rules/movement.md).
// Sea and airborne movement are modes of the same orders (docs/rules/naval.md).

import type { MapData, Scenario } from './data/types.ts';
import { MapView, forcesInHex } from './ui/mapView.ts';
import type { Layers, StrikeMarker } from './ui/mapView.ts';
import { renderPanel, renderSummary, renderTurnView, renderAirOps, renderAirstrikes, renderBriefing, rememberDetails } from './ui/panel.ts';
import type { PanelContext, PanelMessage, TurnView } from './ui/panel.ts';
import { createGameState, forceHex, idx, unit, sideOf, activeSide } from './engine/state.ts';
import type { GameState } from './engine/state.ts';
import { pathTo, moveForce, railMove, undoMove, bugOut, sideMask } from './engine/movement.ts';
import { orderReach, defaultMode, seaMove, seaAssault, seaAssaultPreview, airDrop, airdropLoss } from './engine/naval.ts';
import { fogActive, viewerSide, perceivedState, knownForces, dropRisk } from './engine/intel.ts';
import { REMAKE_DEFAULTS, scenarioFileId, optionsForFile, toStartOptions } from './engine/options.ts';
import type { GameOptions } from './engine/options.ts';
import { renderNewGame, applyChoice } from './ui/newGame.ts';
import { renderSaveDialog } from './ui/saveDialog.ts';
import { renderSoundPanel } from './ui/soundPanel.ts';
import { loadPlaySettings, savePlaySettings, moveStepMs, gameDelay } from './ui/playSettings.ts';
import { buildReplay, overlayFor, renderReplay, replayable } from './ui/combatReplay.ts';
import type { ReplayBattle } from './ui/combatReplay.ts';
import type { PlaySettings, Speed } from './ui/playSettings.ts';
import { renderReports, overviewHexAt } from './ui/reports.ts';
import { renderOrganize, forceTitleKo } from './ui/organize.ts';
import { organizeBlock, nextOrganizeHex, transferUnit, renameForce, hexSlots } from './engine/forces.ts';
import type { ReportTab } from './ui/reports.ts';
import { AudioManager } from './audio/index.ts';
import { privateSongs } from './audio/songs.ts';
import type { SlotView } from './ui/saveDialog.ts';
import { saveGame, saveToText, parseSave, loadGame, resumeGame, saveBlocked } from './engine/save.ts';
import type { SaveFile } from './engine/save.ts';
import { assault, assaultPreview, cancelAssault } from './engine/combat.ts';
import type { MoveMode, Reach } from './engine/movement.ts';
import { startNewGame, endPlayerPhase, finishGame, continuePastEnd } from './engine/turn.ts';
import {
  canPlanAir, chooseBases, setMission, pendingAirstrike, flyAirstrike, delegateAirstrikes, strikeLethality, strikeTargetError,
} from './engine/air.ts';
import type { AirReport, AirStrikeResult } from './engine/air.ts';
import type { TurnEvent } from './engine/turn.ts';
import { territoryBalance } from './engine/endturn.ts';
import { gameDate } from './engine/weather.ts';
import {
  TERRAIN_KO, POSSESSION_KO, dateKo, TEMPERATURE_KO, SKY_KO, BLOCK_KO, MOVE_UI_KO, COMBAT_UI_KO, TURN_UI_KO, PHASE_KO,
  PLAYER_KO, END_REASON_KO, victoryKo, unitNameKo, newsKo, AIR_UI_KO, STRIKE_SEVERITY_KO, NAVAL_UI_KO, INTEL_UI_KO,
  SCENARIO_INFO_KO, OPTIONS_UI_KO, SAVE_UI_KO, FORCES_UI_KO, LAYOUT_KO, SKY_ICON, TITLE_KO,
} from './i18n/ko.ts';
import { placeAt, featureAt } from './data/places.ts';
import { TITLE_ART } from './data/titleArt.ts';

const DATA = 'data/extracted';

// ---------- browser storage of saved games (docs/rules/save.md 3) ----------

const SAVE_KEY = 'conflict-korea-remake/save/';
const SLOT_KEYS = ['auto', '1', '2', '3', '4', '5'];

function storage(): Storage | null {
  try {
    const s = globalThis.localStorage;
    if (!s) return null;
    s.getItem(SAVE_KEY + 'probe');
    return s;
  } catch { return null; }
}

function readSlot(key: string): string | null {
  try { return storage()?.getItem(SAVE_KEY + key) ?? null; } catch { return null; }
}

function slotViews(): SlotView[] {
  return SLOT_KEYS.map((key) => {
    const text = readSlot(key);
    if (!text) return { key, summary: null, savedAt: null };
    const p = parseSave(text);
    return p.ok ? { key, summary: p.file.summary, savedAt: p.file.savedAt } : { key, summary: null, savedAt: null, broken: true };
  });
}

const $ = <T extends HTMLElement>(sel: string) => document.querySelector(sel) as T;
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

async function getJson<T>(path: string): Promise<T> {
  // standalone.html embeds the data so it also works when opened from the file system
  const embedded = (globalThis as { __EMBEDDED_DATA__?: Record<string, unknown> }).__EMBEDDED_DATA__;
  if (embedded && path in embedded) return embedded[path] as T;
  const res = await fetch(path);
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return (await res.json()) as T;
}

interface Orders {
  leader: number;
  mode: MoveMode;
  reach: Reach;
  /** destination pinned by a first click (hex index) */
  pinned: number | null;
  /** hex under the mouse (hex index) */
  hover: number | null;
  /** adjacent enemy hex pinned for an assault (hex index) */
  assault: number | null;
}

interface Banner {
  side: 1 | 2 | 0;
  eyebrow: string;
  title: string;
  lines: string[];
  buttons: { label: string; action: string; kind?: string }[];
}

async function main() {
  const panel = $('#panel');
  const status = $('#status');
  const bannerEl = $('#banner');
  let map: MapData;
  try {
    map = await getJson<MapData>(`${DATA}/map.json`);
  } catch (err) {
    panel.innerHTML = `<section class="card"><h2>데이터를 찾을 수 없어요</h2><p>먼저 원본 데이터를 추출하세요:</p><pre>node tools/extract/extract.ts</pre><p class="muted">${String(err)}</p></section>`;
    return;
  }

  const view = new MapView($('#map') as unknown as HTMLCanvasElement);
  let scenario: Scenario | null = null;
  let game: GameState | null = null;
  let ctx: PanelContext | null = null;
  let sel: [number, number] | null = null;
  let orders: Orders | null = null;
  let message: PanelMessage | null = null;
  let turnView: TurnView | null = null;
  let banner: Banner | null = null;
  let first = true;
  /** The game drawn behind the start menu when the page opens: nobody chose it, so the menu cannot be closed onto it
   *  (the original also begins at the start menu). */
  let bootGame = false;
  /** Air Operations panel open (first orders phase). */
  let airOpen = false;
  /** Hex under the mouse while aiming an airstrike. */
  let strikeHover: [number, number] | null = null;
  /** Airstrikes of this turn, drawn on the map until the next turn begins. */
  let strikeMarks: StrikeMarker[] = [];

  /** Start menu values of the game being played (docs/rules/options.md); `draft` while the dialog is open. */
  let options: GameOptions = { ...REMAKE_DEFAULTS };
  let draft: GameOptions | null = null;
  const newGameEl = $('#newgame');
  /** Save / load dialog (docs/rules/save.md). */
  const saveEl = $('#savegame');
  let saveOpen = false;
  let saveMsg: { kind: 'ok' | 'warn' | 'error'; text: string } | null = null;
  /** Report screens (docs/rules/reports.md). */
  const reportsEl = $('#reports');
  let reportsOpen = false;
  let reportTab: ReportTab = 'strategic';
  let overviewMode: 'terrain' | 'supply' = 'terrain';
  /** Force organisation (docs/rules/forces.md): the hex whose forces are being reorganised. */
  const organizeEl = $('#organize');
  let organizeAt: [number, number] | null = null;
  let organizeMsg: PanelMessage | null = null;
  let renaming: 0 | 1 | null = null;
  /** Something modal is open: the map and the phase controls wait. */
  const modal = () => !!banner || !!draft || saveOpen || reportsOpen || !!organizeAt || !!replay;
  /** Step-by-step ground combat replay after the combat phase (ui/combatReplay.ts); the phase banner waits for it. */
  let replay: {
    battles: ReplayBattle[]; b: number; s: number; paused: boolean; timer: ReturnType<typeof setTimeout> | null;
    after: typeof banner; afterEvents: TurnEvent[];
    /** Only battle b (the ▶ of one battle in the results list): the replay ends with it. */
    single: boolean;
    /** First showing after the combat phase: the results list grows one battle at a time (`revealed`). */
    first: boolean; revealed: number;
  } | null = null;
  const replayEl = $('#combat-replay');

  // ---------- sound (docs/audio.md) ----------
  const audio = new AudioManager();
  const soundEl = $('#sound-panel');
  let soundOpen = false;
  /** Speed and movement centering of the original options menu (docs/rules/options.md 5). */
  let play: PlaySettings = loadPlaySettings();
  view.counterArt = play.counters;
  const setPlay = (p: Partial<PlaySettings>) => {
    play = { ...play, ...p };
    savePlaySettings(play);
    renderSound();
    if (view.counterArt !== play.counters) { view.counterArt = play.counters; view.invalidate(); }
  };
  const renderSound = () => {
    ($('#sound') as HTMLButtonElement).setAttribute('aria-pressed', String(soundOpen));
    $('#sound').classList.toggle('muted-btn', !audio.settings.music && !audio.settings.sfx);
    if (!soundOpen) { soundEl.hidden = true; return; }
    // keep a volume slider that is being dragged
    const active = document.activeElement as HTMLElement | null;
    if (active && active.tagName === 'INPUT' && soundEl.contains(active)) return;
    renderSoundPanel(soundEl, audio, play);
    soundEl.hidden = false;
  };
  audio.onChange = renderSound;
  // browsers start audio only after a user gesture
  const unlockAudio = () => { if (!audio.unlocked) { audio.unlock(); renderSound(); } };
  window.addEventListener('pointerdown', unlockAudio, true);
  window.addEventListener('keydown', unlockAudio, true);
  // copyrighted arrangements (6.25의 노래) live in data/private, which is not in the repository
  getJson<unknown>('data/private/music.json').then((j) => audio.addSongs(privateSongs(j))).catch(() => { /* not present */ });
  $('#sound').addEventListener('click', () => { soundOpen = !soundOpen; renderSound(); });
  soundEl.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-snd]');
    if (!b || b.tagName === 'INPUT') return;
    const what = b.dataset.snd;
    if (what === 'music') audio.set({ music: !audio.settings.music });
    else if (what === 'sfx') { audio.set({ sfx: !audio.settings.sfx }); audio.sfx('click'); }
    else if (what === 'skip') audio.skip();
    else if (what === 'choice') audio.set({ choice: b.dataset.value!, music: true });
    else if (what === 'speed') { setPlay({ speed: Number(b.dataset.value) as Speed }); audio.sfx('click'); }
    else if (what === 'follow') { setPlay({ follow: !play.follow }); audio.sfx('click'); }
    else if (what === 'replay') { setPlay({ replay: !play.replay }); audio.sfx('click'); }
    else if (what === 'counters') { setPlay({ counters: play.counters === 'picture' ? 'nato' : 'picture' }); audio.sfx('click'); }
  });
  soundEl.addEventListener('input', (e) => {
    const r = e.target as HTMLInputElement;
    if (r.dataset.snd === 'musicVolume') audio.set({ musicVolume: Number(r.value) / 100 });
    if (r.dataset.snd === 'sfxVolume') audio.set({ sfxVolume: Number(r.value) / 100 });
  });
  soundEl.addEventListener('change', (e) => { if ((e.target as HTMLElement).dataset.snd === 'sfxVolume') audio.sfx('select'); });
  document.addEventListener('pointerdown', (e) => {
    if (!soundOpen) return;
    const t = e.target as HTMLElement;
    if (t.closest('#sound-panel') || t.closest('#sound')) return;
    soundOpen = false;
    renderSound();
  });

  /** Side whose knowledge the screen shows. */
  const viewer = () => (game ? viewerSide(game) : 'un');
  /** Forces of a hex the viewer knows about (everything with complete intelligence). */
  const knownAt = (g: GameState, x: number, y: number) => {
    const known = new Set(knownForces(g, viewerSide(g), idx(g, x, y)).map((f) => f.leader));
    return forcesInHex(g, x, y).filter((f) => known.has(f.leader));
  };

  /** Orders can be given in an orders phase, to forces of the side whose phase it is. */
  const canCommand = (leader: number) =>
    !!game && !game.gameOver && (game.phase === 1 || game.phase === 3) && sideOf(unit(game, leader)) === activeSide(game);
  /** Combat phase with DO_AIR_COMBAT waiting for the human player's airstrikes. */
  const inStrikes = () => !!game && game.phase === 2 && !!game.air;

  const marker = (r: AirStrikeResult): StrikeMarker => ({ hex: idx(game!, r.target[0], r.target[1]), explosions: r.explosions, found: r.found, player: r.player });
  const reportMarks = (rep: AirReport) => rep.sides.flatMap((s) => s.strikes.map(marker));

  // ---------- rendering ----------

  /** Enemy-occupied hex next to the selected force (assault target); sea mode: any enemy-held coast in reach. */
  function isEnemyNeighbor(i: number): boolean {
    if (!orders || !game || orders.reach.origin < 0 || orders.reach.cannot) return false;
    if (orders.mode === 'air') return false;
    if (orders.mode === 'sea') return orders.reach.blocked.get(i) === 'enemy';
    const o = orders.reach.origin;
    if (!sideMask(o % game.width, Math.floor(o / game.width), i % game.width, Math.floor(i / game.width))) return false;
    return orders.reach.blocked.get(i) === 'enemy';
  }

  function assaultView() {
    if (!orders || !game) return null;
    const hex = orders.assault ?? (orders.pinned === null && orders.hover !== null && isEnemyNeighbor(orders.hover) ? orders.hover : null);
    if (hex === null) return null;
    const x = hex % game.width, y = Math.floor(hex / game.width);
    if (orders.mode === 'sea') return { hex, pinned: orders.assault !== null, preview: null, sea: seaAssaultPreview(game, orders.leader, x, y) };
    return { hex, pinned: orders.assault !== null, preview: assaultPreview(game, orders.leader, x, y), sea: null };
  }

  function previewPath(): { path: number[] | null; pinned: boolean } {
    if (!orders || orders.assault !== null) return { path: null, pinned: false };
    if (orders.pinned !== null) return { path: pathTo(orders.reach, orders.pinned), pinned: true };
    if (orders.hover !== null) return { path: pathTo(orders.reach, orders.hover), pinned: false };
    return { path: null, pinned: false };
  }

  function syncView() {
    const p = previewPath();
    view.selected = sel;
    view.selectedLeader = orders?.leader ?? null;
    // a force that cannot move keeps its highlight but gets no reach overlay
    const av = assaultView();
    const dest = p.path?.length ? p.path[p.path.length - 1] : null;
    view.movement = orders && !orders.reach.cannot
      ? {
        reach: orders.reach, path: p.path, pinned: p.pinned,
        assault: av && { hex: av.hex, pinned: av.pinned, allowed: av.sea ? av.sea.allowed : av.preview!.allowed, from: av.sea?.from },
        dropLoss: orders.mode === 'air' && dest !== null && game ? airdropLoss(game, dest % game.width, Math.floor(dest / game.width)) : null,
      }
      : null;
    view.airstrikes = strikeMarks;
    view.viewer = viewer();
    // two players, limited intelligence: the hand-over screen shows no forces at all
    view.hideForces = !!game && (!!banner || !!draft) && fogActive(game) && game.computerSide === 0;
    view.showMigAlley = !!game && game.scenarioNo < 4 && (airOpen || inStrikes() || orders?.mode === 'air');
    if (!inStrikes() || !pendingAirstrike(game!)) view.strikeAim = null;
    view.invalidate();
  }

  function renderHeader() {
    if (!game) return;
    const d = gameDate(game);
    const info = SCENARIO_INFO_KO[game.scenarioNo - 1];
    // the original's status box: phase, weather, date and victory level are always in view (scenario name is minor)
    $('#scenario-name').textContent = `${game.scenarioNo}. ${info?.title ?? ''}`;
    // the edition is in the settings line of the summary and the scenario report
    $('#scenario-name').title = scenario?.variant === 'S' ? OPTIONS_UI_KO.deployment : '';
    $('#date').innerHTML = `<b>${esc(dateKo(d.year, d.month, d.day))}</b><span>${esc(LAYOUT_KO.turn(game.turn))}</span>`;
    const t = TEMPERATURE_KO[game.temperature];
    const wx = $('#weather');
    wx.className = `top-chip wx s${game.sky}`;
    wx.innerHTML = t ? `<i>${SKY_ICON[game.sky] ?? ''}</i>${esc(`${t} · ${SKY_KO[game.sky] ?? '-'}`)}${game.freezeLine > 0 ? ' <span class="frz">❄</span>' : ''}` : '-';
    wx.title = LAYOUT_KO.weatherTitle(game.freezeLine);
    const lvl = territoryBalance(game);
    const vc = $('#victory');
    vc.className = `top-chip victory ${game.victoryVoid ? '' : lvl > 0 ? 'un' : lvl < 0 ? 'red' : ''}`;
    vc.innerHTML = `<span>${esc(LAYOUT_KO.victoryShort)}</span><b>${esc(game.victoryVoid ? '-' : victoryKo(lvl))}</b>`;
    vc.title = LAYOUT_KO.victoryTitle;
    const pill = $('#phase');
    const ordersPhase = game.phase === 1 || game.phase === 3;
    pill.className = `phase-pill ${ordersPhase ? (game.player === 2 ? 'un' : 'red') : ''}`;
    pill.innerHTML = game.gameOver
      ? esc(TURN_UI_KO.gameOver)
      : `<span class="dot"></span>${esc(PLAYER_KO[game.player])} · ${esc(PHASE_KO[game.phase] ?? '')}`;
    ($('#end-phase') as HTMLButtonElement).disabled = !(ordersPhase || inStrikes()) || !!game.gameOver || modal();
    const airBtn = $('#air-ops') as HTMLButtonElement;
    const airOk = canPlanAir(game);
    airBtn.disabled = !airOk || modal();
    ($('#save-game') as HTMLButtonElement).setAttribute('aria-pressed', String(saveOpen));
    ($('#reports-btn') as HTMLButtonElement).setAttribute('aria-pressed', String(reportsOpen));
    ($('#new-game') as HTMLButtonElement).setAttribute('aria-pressed', String(!!draft));
    airBtn.setAttribute('aria-pressed', String(airOpen && airOk));
  }

  function renderBanner() {
    if (!banner) { bannerEl.hidden = true; bannerEl.innerHTML = ''; return; }
    const cls = banner.side === 2 ? 'side-un' : banner.side === 1 ? 'side-red' : '';
    bannerEl.innerHTML = `<div class="box ${cls}" role="dialog" aria-modal="true">
      <p class="eyebrow">${esc(banner.eyebrow)}</p><h2>${esc(banner.title)}</h2>
      ${banner.lines.map((l) => `<p>${esc(l)}</p>`).join('')}
      <div class="actions">${banner.buttons.map((b) => `<button class="btn ${b.kind ?? 'primary'}" data-banner="${b.action}">${esc(b.label)}</button>`).join('')}</div>
    </div>`;
    bannerEl.hidden = false;
  }

  function renderSide() {
    // while the start menu is open the panel briefs the chosen scenario (not the game running behind the menu)
    if (draft) { renderBriefing(panel, draft.scenario); return; }
    if (!ctx) return;
    if (inStrikes()) { renderAirstrikes(panel, ctx, strikeHover, message); return; }
    if (airOpen && game && canPlanAir(game)) { renderAirOps(panel, ctx, message); return; }
    if (!sel && turnView) { renderTurnView(panel, ctx, turnView, message); return; }
    if (!sel) { renderSummary(panel, ctx, message); return; }
    const p = previewPath();
    renderPanel(panel, ctx, sel[0], sel[1], orders && { leader: orders.leader, mode: orders.mode, reach: orders.reach, path: p.path, pinned: p.pinned, assault: assaultView() }, message);
  }

  function render() {
    syncView();
    renderSide();
    // the status line under the mouse follows the new state (it said "airstrike target" after the strikes ended)
    if (view.hover && game && ctx) view.onHover(view.hover[0], view.hover[1]);
    renderHeader();
    renderBanner();
    renderDialog();
    renderSaveDlg();
    renderReportsDlg();
    renderOrganizeDlg();
  }

  // ---------- force organisation (docs/rules/forces.md) ----------

  function renderOrganizeDlg() {
    if (!organizeAt || !game) { organizeEl.hidden = true; organizeEl.innerHTML = ''; return; }
    renderOrganize(organizeEl, { game, x: organizeAt[0], y: organizeAt[1], message: organizeMsg, renaming });
    organizeEl.hidden = false;
    if (renaming !== null) {
      const input = organizeEl.querySelector<HTMLInputElement>(`#og-name-${renaming}`);
      if (input && document.activeElement !== input) { input.focus(); input.select(); }
    }
  }

  /** The original opens FULL_HEX from the hex menu of a friendly hex in an orders phase ("Report"). */
  function openOrganize(x: number, y: number) {
    if (!game || modal()) return;
    const why = organizeBlock(game, x, y);
    if (why) { message = { kind: 'warn', text: FORCES_UI_KO.blockedOpen[why] }; render(); return; }
    organizeAt = [x, y];
    organizeMsg = null;
    renaming = null;
    orders = null;
    audio.sfx('select');
    render();
  }

  function closeOrganize() {
    if (!organizeAt || !game) return;
    const [x, y] = organizeAt;
    organizeAt = null;
    renaming = null;
    organizeMsg = null;
    // the forces of the hex may have new leaders: start again from the hex
    sel = [x, y];
    orders = null;
    message = null;
    render();
  }

  function organizeTransfer(id: number) {
    if (!game || !organizeAt) return;
    const [x, y] = organizeAt;
    const name = unitNameKo(unit(game, id).name);
    const r = transferUnit(game, x, y, id);
    renaming = null;
    if (!r.ok) {
      audio.sfx('error');
      organizeMsg = { kind: 'error', text: `${FORCES_UI_KO.failed}: ${FORCES_UI_KO.blocked[r.reason ?? ''] ?? r.reason}` };
    } else if (r.kind === 'merge') {
      audio.sfx('march');
      organizeMsg = { kind: 'ok', text: FORCES_UI_KO.merged(unitNameKo(unit(game, r.mergeInto).name)) };
    } else {
      audio.sfx('march');
      const k = hexSlots(game, x, y).findIndex((ids) => ids.includes(id));
      const text = FORCES_UI_KO.done(name, k + 1);
      organizeMsg = { kind: r.cost ? 'warn' : 'ok', text: r.cost ? `${text} ${FORCES_UI_KO.doneCost(r.cost)}` : text };
    }
    render();
  }

  function organizeRename(slot: 0 | 1, text: string) {
    if (!game || !organizeAt) return;
    const leader = game.stacks[idx(game, organizeAt[0], organizeAt[1])][slot];
    renaming = null;
    if (leader && renameForce(game, leader, text)) {
      audio.sfx('click');
      organizeMsg = { kind: 'ok', text: FORCES_UI_KO.renamed(forceTitleKo(game, leader)) };
    }
    render();
  }

  function organizeNav(dir: 1 | -1) {
    if (!game || !organizeAt) return;
    const next = nextOrganizeHex(game, organizeAt[0], organizeAt[1], dir);
    organizeAt = next;
    renaming = null;
    organizeMsg = null;
    view.centerOn(next[0], next[1]);
    audio.sfx('click');
    render();
  }

  organizeEl.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-og]');
    if (!b || (b as HTMLButtonElement).disabled || !game || !organizeAt) return;
    const act = b.dataset.og;
    if (act === 'close') closeOrganize();
    else if (act === 'prev') organizeNav(-1);
    else if (act === 'next') organizeNav(1);
    else if (act === 'xfer') organizeTransfer(Number(b.dataset.unit));
    else if (act === 'rename') { renaming = Number(b.dataset.slot) as 0 | 1; organizeMsg = null; render(); }
    else if (act === 'rename-cancel') { renaming = null; render(); }
    else if (act === 'rename-ok') {
      const slot = Number(b.dataset.slot) as 0 | 1;
      organizeRename(slot, organizeEl.querySelector<HTMLInputElement>(`#og-name-${slot}`)?.value ?? '');
    }
  });
  organizeEl.addEventListener('keydown', (e) => {
    const input = (e.target as HTMLElement).closest<HTMLInputElement>('input[id^="og-name-"]');
    if (!input || renaming === null) return;
    if (e.key === 'Enter') { e.preventDefault(); organizeRename(renaming, input.value); }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); renaming = null; render(); }
  });

  // ---------- report screens (docs/rules/reports.md) ----------

  function renderReportsDlg() {
    if (!reportsOpen || !game) { reportsEl.hidden = true; reportsEl.innerHTML = ''; return; }
    renderReports(reportsEl, { tab: reportTab, game, options, variant: scenario?.variant, viewer: viewer(), overviewMode });
    reportsEl.hidden = false;
  }

  function openReports(tab: ReportTab = reportTab) {
    if (!game || draft || saveOpen) return;
    organizeAt = null;
    renaming = null;
    reportsOpen = true;
    reportTab = tab;
    audio.sfx('news');
    render();
  }

  function closeReports() {
    reportsOpen = false;
    render();
  }

  reportsEl.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const canvas = t.closest<HTMLCanvasElement>('canvas.rp-overview');
    if (canvas) {
      // the overview: the clicked hex becomes the centre of the map (DO_OVERVIEW)
      const r = canvas.getBoundingClientRect();
      const hex = overviewHexAt(((e as MouseEvent).clientX - r.left) * (canvas.width / r.width), ((e as MouseEvent).clientY - r.top) * (canvas.height / r.height));
      if (hex) { view.centerOn(hex[0], hex[1]); audio.sfx('pin'); closeReports(); }
      return;
    }
    const b = t.closest<HTMLElement>('[data-rp]');
    if (!b) return;
    const what = b.dataset.rp;
    if (what === 'close') { closeReports(); return; }
    if (what === 'tab') reportTab = b.dataset.value as ReportTab;
    if (what === 'mode') overviewMode = b.dataset.value as 'terrain' | 'supply';
    audio.sfx('click');
    renderReportsDlg();
  });

  // ---------- turn sequence ----------

  /** Effects for what just happened (combat, airstrikes, news), then the call of the next phase (docs/audio.md). */
  function soundForEvents(events: TurnEvent[]) {
    let delay = 0;
    if (events.some((e) => e.kind === 'gameOver')) { audio.sfx('drumroll'); return; }
    const air = events.find((e) => e.kind === 'air');
    if (air && air.kind === 'air' && air.report.sides.some((s) => s.strikes.length)) { audio.sfx('airstrike'); delay += 1.8; }
    if (events.some((e) => e.kind === 'airstrikes')) { audio.sfx('plane', undefined, delay); return; }
    const combat = events.find((e) => e.kind === 'combat');
    if (combat && combat.kind === 'combat' && combat.reports.length) { audio.sfx('battle', { count: combat.reports.length }, delay); delay += 1.2 + 0.45 * Math.min(6, combat.reports.length); }
    const res = events.find((e) => e.kind === 'resolution');
    if (res && res.kind === 'resolution' && res.report.news.length) { audio.sfx('news', undefined, delay); delay += 0.8; }
    const begin = [...events].reverse().find((e) => e.kind === 'ordersPhase');
    if (begin && begin.kind === 'ordersPhase') {
      audio.setSide(begin.player === 1 ? 'communist' : 'un');
      audio.sfx(begin.player === 1 ? 'phaseRed' : 'phaseUn', undefined, delay);
    }
  }

  // ---------- combat replay (docs/rules/combat.md 6) ----------

  /** Turn engine events into the phase banner and the panel report; ground battles are replayed first. */
  function handleEvents(events: TurnEvent[], replayBattles = true) {
    const combat = events.find((e) => e.kind === 'combat');
    const reports = combat && combat.kind === 'combat' ? combat.reports : null;
    const replaying = !!game && replayBattles && play.replay && replayable(reports);
    // while the battles are replayed, the call of the next phase sounds only when its banner appears
    handlePhaseEvents(events, replaying ? events.filter((e) => e.kind !== 'combat' && e.kind !== 'ordersPhase') : events);
    if (replaying) startReplay(reports!, events.filter((e) => e.kind === 'ordersPhase'), 0, false, true);
  }

  /**
   * Replay the battles from `from` (all of them) or only battle `from` (`single`). `first`: the replay right after
   * the combat phase, when the results are not known yet.
   */
  function startReplay(reports: NonNullable<TurnView['combat']>, afterEvents: TurnEvent[], from = 0, single = false, first = false) {
    if (!game) return;
    stopReplayTimer();
    const battles = buildReplay(reports);
    if (!battles.length) return;
    replay = {
      battles, b: Math.min(from, battles.length - 1), s: 0, paused: false, timer: null,
      after: replay?.after ?? banner, afterEvents: replay?.afterEvents ?? afterEvents,
      single, first: first || !!replay?.first, revealed: replay?.revealed ?? 0,
    };
    banner = null;
    syncReplayPanel();
    showReplayStep(true);
  }

  /** The results list follows the replay: the battle on the map is marked, unseen results stay hidden. */
  function syncReplayPanel() {
    if (!replay || !turnView) return;
    turnView = { ...turnView, current: replay.b, revealed: replay.first ? replay.revealed : undefined };
  }

  /** Drop a replay without showing what waited behind it (a new or loaded game replaces everything). */
  function cancelReplay() {
    stopReplayTimer();
    replay = null;
    view.replay = null;
    replayEl.hidden = true;
    replayEl.innerHTML = '';
  }

  function stopReplayTimer() {
    if (replay?.timer) { clearTimeout(replay.timer); replay.timer = null; }
  }

  function showReplayStep(newBattle = false) {
    if (!replay || !game) return;
    const battle = replay.battles[replay.b];
    const step = battle.steps[replay.s];
    const [tx, ty] = battle.report.target;
    if (newBattle) {
      // the original scrolls the map to the battle; keep it above the replay box at the bottom
      view.centerOn(tx, ty, Math.max(view.cam.zoom, 0.95));
      view.cam.y += 120 / view.cam.zoom;
    }
    // a battle's result joins the list when its replay ends (or is skipped past)
    replay.revealed = Math.max(replay.revealed, replay.b + (step.kind === 'end' ? 1 : 0));
    // in a full replay the forces of the battles to come stand where they were before them
    view.replay = overlayFor(battle, replay.s, replay.single ? [] : replay.battles.slice(replay.b + 1));
    view.invalidate();
    syncReplayPanel();
    // sounds: the attack begins, the clash, a unit destroyed, a retreat
    if (step.kind === 'intro' && !battle.report.moveIn) audio.sfx('bugle');
    else if (step.kind === 'result') audio.sfx('battle', { count: 1 });
    else if (step.kind === 'event') {
      const e = battle.events[step.i];
      if (e.kind === 'eliminated' || e.kind === 'lostAtSea') audio.sfx('explosion');
      else if (e.kind === 'retreat' || e.kind === 'advance' || e.kind === 'moveIn') audio.sfx('march');
    }
    renderReplay(replayEl, { game, battles: replay.battles, b: replay.b, s: replay.s, paused: replay.paused, hideEnemy: fogActive(game), viewer: viewer(), single: replay.single });
    renderSide();
    panel.querySelector('.report.current')?.scrollIntoView({ block: 'nearest' });
    scheduleReplay();
  }

  function scheduleReplay() {
    if (!replay || replay.paused) return;
    stopReplayTimer();
    const step = replay.battles[replay.b].steps[replay.s];
    replay.timer = setTimeout(() => replayNext(), gameDelay(step.ms, play.speed));
  }

  function replayNext() {
    if (!replay) return;
    const battle = replay.battles[replay.b];
    if (replay.s + 1 < battle.steps.length) { replay.s++; showReplayStep(); return; }
    replayNextBattle();
  }

  function replayNextBattle() {
    if (!replay) return;
    if (replay.single || replay.b + 1 >= replay.battles.length) { finishReplay(); return; }
    replay.b++;
    replay.s = 0;
    showReplayStep(true);
  }

  function finishReplay() {
    if (!replay) return;
    stopReplayTimer();
    const { after, afterEvents } = replay;
    replay = null;
    view.replay = null;
    replayEl.hidden = true;
    replayEl.innerHTML = '';
    if (turnView) turnView = { ...turnView, current: undefined, revealed: undefined };
    banner = after;
    if (afterEvents.length) soundForEvents(afterEvents);
    render();
  }

  function toggleReplayPause() {
    if (!replay) return;
    replay.paused = !replay.paused;
    if (replay.paused) stopReplayTimer();
    showReplayStep();
  }

  replayEl.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-replay]');
    if (!b || !replay) return;
    const what = b.dataset.replay;
    if (what === 'pause') toggleReplayPause();
    else if (what === 'next') { stopReplayTimer(); replayNext(); }
    else if (what === 'battle') { stopReplayTimer(); replayNextBattle(); }
    else if (what === 'skip') finishReplay();
  });

  /** Turn engine events into the phase banner and the panel report. */
  function handlePhaseEvents(events: TurnEvent[], soundEvents: TurnEvent[]) {
    if (!game) return;
    soundForEvents(soundEvents);
    const g = game;
    const lines: string[] = [];
    let combat: TurnView['combat'] = null;
    let air: TurnView['air'] = null;
    let resolution: TurnView['resolution'] = null;
    airOpen = false;
    strikeHover = null;
    for (const e of events) {
      if (e.kind === 'ordersPhase' && e.phase === 1) strikeMarks = []; // a new turn
      if (e.kind === 'noFirstPhase') lines.push(TURN_UI_KO.noFirstPhase);
      else if (e.kind === 'computerPhase' && !e.report) lines.push(`${PLAYER_KO[e.player]}: ${TURN_UI_KO.computerPhase}`);
      else if (e.kind === 'computerPhase' && e.report) {
        // the computer's orders (docs/rules/ai.md): only counts, so limited intelligence keeps its secrets
        const r = e.report;
        for (const n of r.notices) lines.push(TURN_UI_KO.computerNotice(unitNameKo(n.unit), `${n.hex[0]},${n.hex[1]}`));
        lines.push(TURN_UI_KO.computerOrders(PLAYER_KO[e.player], PHASE_KO[e.phase] ?? '', r.moved.length, r.assaults));
        if (r.merged) lines.push(TURN_UI_KO.computerMerged(r.merged));
      }
      else if (e.kind === 'combat') combat = e.reports;
      else if (e.kind === 'air') { air = e.report; strikeMarks = reportMarks(e.report); }
      else if (e.kind === 'airstrikes' && g.air) strikeMarks = reportMarks(g.air.report);
      else if (e.kind === 'resolution') {
        resolution = e.report;
        if (e.report.refugees) lines.push(TURN_UI_KO.refugees);
        for (const n of e.report.news) lines.push(newsKo(n.text).text);
      } else if (e.kind === 'ordersPhase' && e.reinforcements) lines.push(TURN_UI_KO.reinforcements);
    }
    // the hand-over prompt is for two players only (docs/rules/options.md 4)
    const handover = g.computerSide === 0 ? [TURN_UI_KO.handover] : [];
    const over = events.find((e) => e.kind === 'gameOver');
    turnView = combat || resolution || air ? { combat, air, resolution, result: null } : null;
    sel = null;
    orders = null;
    message = null;
    if (over && over.kind === 'gameOver') {
      banner = {
        side: 0, eyebrow: `${gameDateKo(g)} · ${g.turn}턴`, title: TURN_UI_KO.peaceTalks,
        lines: [END_REASON_KO[over.reason] ?? over.reason, TURN_UI_KO.overrideNote],
        buttons: [{ label: TURN_UI_KO.endGame, action: 'end-game' }, { label: TURN_UI_KO.override, action: 'override', kind: 'ghost' }],
      };
      return;
    }
    const strikes = events.find((e) => e.kind === 'airstrikes');
    if (strikes && strikes.kind === 'airstrikes') {
      banner = {
        side: strikes.player,
        eyebrow: `${gameDateKo(g)} · ${g.turn}턴 · ${PHASE_KO[2]}`,
        title: AIR_UI_KO.strikeTitle(PLAYER_KO[strikes.player]),
        lines: [...lines, AIR_UI_KO.strikeLines(strikes.count), ...handover],
        buttons: [{ label: TURN_UI_KO.begin, action: 'close' }],
      };
      return;
    }
    const begin = [...events].reverse().find((e) => e.kind === 'ordersPhase');
    if (begin && begin.kind === 'ordersPhase') {
      banner = {
        side: begin.player,
        eyebrow: `${gameDateKo(g)} · ${g.turn}턴`,
        title: TURN_UI_KO.beginPhase(PLAYER_KO[begin.player], PHASE_KO[begin.phase] ?? ''),
        lines: [...lines, ...handover],
        buttons: [{ label: TURN_UI_KO.begin, action: 'close' }],
      };
    }
  }

  const gameDateKo = (g: GameState) => { const d = gameDate(g); return dateKo(d.year, d.month, d.day); };

  function endPhase(confirmFirst = true) {
    if (!game || modal()) return;
    if (inStrikes()) {
      // the program picks the targets of the airstrikes not flown yet (docs/rules/air.md 9)
      const left = game.air!.queue.length;
      if (confirmFirst && left && !window.confirm(AIR_UI_KO.endPhaseStrikes(left))) return;
      turnView = null;
      message = null;
      handleEvents(endPlayerPhase(game));
      autoSave();
      render();
      return;
    }
    if (!(game.phase === 1 || game.phase === 3) || game.gameOver) return;
    if (confirmFirst && !window.confirm(TURN_UI_KO.endPhaseConfirm(PLAYER_KO[game.player], PHASE_KO[game.phase]))) return;
    turnView = null;
    handleEvents(endPlayerPhase(game));
    autoSave();
    render();
  }

  function onBanner(action: string) {
    if (!game) return;
    if (action === 'end-game') {
      const result = finishGame(game);
      const human = game.computerSide === 1 ? 'un' : game.computerSide === 2 ? 'communist' : null;
      audio.sfx(!result.winner ? 'drumroll' : !human || result.winner === human ? 'victory' : 'defeat');
      banner = null;
      turnView = { combat: null, air: null, resolution: turnView?.resolution ?? null, result };
    } else if (action === 'override') {
      banner = null;
      handleEvents(continuePastEnd(game));
      autoSave();
    } else banner = null;
    render();
  }

  bannerEl.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-banner]');
    if (b) onBanner(b.dataset.banner!);
  });

  // ---------- orders ----------

  function startOrders(leader: number, mode?: MoveMode) {
    if (!game) return;
    if (!canCommand(leader)) { orders = null; return; }
    const m = mode ?? defaultMode(game, leader);
    // the reach is planned on what this side knows: hidden enemy forces are not in it (docs/rules/intel.md 5)
    const known = perceivedState(game, sideOf(unit(game, leader)));
    orders = { leader, mode: m, reach: orderReach(known, leader, m), pinned: null, hover: null, assault: null };
    const at = forceHex(game, leader);
    if (at >= 0) sel = [at % game.width, Math.floor(at / game.width)];
  }

  function selectHex(x: number, y: number) {
    if (!game) return;
    const forces = forcesInHex(game, x, y).filter((f) => canCommand(f.leader));
    const sameHex = sel && sel[0] === x && sel[1] === y;
    sel = [x, y];
    message = null;
    if (!forces.length) { orders = null; return; }
    audio.sfx('select');
    // clicking the same hex again cycles through the (at most two) forces stacked there
    let k = 0;
    if (sameHex && orders) {
      const cur = forces.findIndex((f) => f.leader === orders!.leader);
      if (cur >= 0) k = (cur + 1) % forces.length;
    }
    startOrders(forces[k].leader);
  }

  function execute() {
    if (!game || !orders || orders.pinned === null) return;
    const path = pathTo(orders.reach, orders.pinned);
    if (!path) return;
    const { leader, mode } = orders;
    const from = forceHex(game, leader);
    const res = mode === 'rail' ? railMove(game, leader, path)
      : mode === 'sea' ? seaMove(game, leader, path)
      : mode === 'air' ? airDrop(game, leader, orders.pinned)
      : moveForce(game, leader, path);
    if (res.ok) {
      animateMove(leader, from, mode === 'air' ? [orders.pinned] : res.steps.map((s) => s.hex));
      audio.sfx(res.destroyed ? 'explosion' : mode === 'rail' ? 'rail' : mode === 'sea' ? 'ship' : mode === 'air' ? 'drop' : 'march');
      const parts = [MOVE_UI_KO.done, mode === 'rail' ? `${path.length}칸 철도 수송` : `${res.usedAfter - res.usedBefore}${MOVE_UI_KO.points} 사용`];
      if (res.readinessLoss) parts.push(`${MOVE_UI_KO.readiness} −${res.readinessLoss}`);
      message = { kind: 'ok', text: parts.join(' · ') };
      if (res.interdictionLoss) message = { kind: 'warn', text: `${MOVE_UI_KO.interdicted} (${res.interdictionLoss}%)` };
      if (res.bugOuts?.length) message = { kind: 'warn', text: `${MOVE_UI_KO.bugOutMoving}: ${res.bugOuts.map((id) => unitNameKo(unit(game!, id).name)).join(', ')}` };
      if (mode === 'sea') message = { kind: res.beachLoss ? 'warn' : 'ok', text: NAVAL_UI_KO.seaDone(res.sealift ?? 0) + (res.beachLoss ? ` · ${NAVAL_UI_KO.beachWarn}` : '') };
      if (mode === 'air') message = res.destroyed ? { kind: 'error', text: NAVAL_UI_KO.airDestroyed } : { kind: 'ok', text: NAVAL_UI_KO.airDone(res.dropLoss ?? 0) };
      if (res.interrupted) {
        message = { kind: 'warn', text: `${res.interrupted === 'bumped' ? INTEL_UI_KO.stoppedBumped : INTEL_UI_KO.stoppedRevealed} · ${parts.slice(1).join(' · ')}` };
      } else if (res.revealed?.length && fogActive(game)) {
        message = { kind: message.kind, text: `${message.text} · ${INTEL_UI_KO.spotted(res.revealed.length)}` };
      }
      if (res.destroyed) { orders = null; sel = null; return; }
      startOrders(leader);
    } else {
      const found = res.error === 'enemyFound';
      audio.sfx(found ? 'news' : 'error');
      message = { kind: found ? 'warn' : 'error', text: found ? BLOCK_KO.enemyFound : `${MOVE_UI_KO.failed}: ${BLOCK_KO[res.error ?? ''] ?? res.error}` };
      startOrders(leader, mode);
    }
  }

  /** Movement animation from `from` through the hexes entered (the engine has already moved the force). */
  function animateMove(leader: number, from: number, hexes: number[]) {
    if (!game || from < 0) return;
    const w = game.width;
    const pts: [number, number][] = [from, ...hexes].map((i) => [i % w, Math.floor(i / w)]);
    view.animateMove(leader, pts, moveStepMs(pts.length - 1, play.speed), play.follow);
  }

  /** Original key C while moving (MOVEUNIT `3726`): put the selected force (or hex) in the middle of the map. */
  function centerSelected() {
    if (!game) return;
    const at = orders ? forceHex(game, orders.leader) : -1;
    if (at >= 0) view.centerOn(at % game.width, Math.floor(at / game.width));
    else if (sel) view.centerOn(sel[0], sel[1]);
  }

  function executeAssault() {
    if (!game || !orders || orders.assault === null) return;
    const { leader } = orders;
    const t = orders.assault;
    if (orders.mode === 'sea') {
      const out = seaAssault(game, leader, t % game.width, Math.floor(t / game.width));
      audio.sfx(!out.ok ? 'error' : out.result === 'overrun' ? 'overrun' : out.result === 'stranded' ? 'error' : 'bugle');
      if (!out.ok) message = { kind: 'error', text: `${MOVE_UI_KO.failed}: ${BLOCK_KO[out.error ?? ''] ?? out.error}` };
      else if (out.result === 'overrun') message = { kind: 'ok', text: NAVAL_UI_KO.seaOverran };
      else if (out.result === 'stranded') message = { kind: 'warn', text: NAVAL_UI_KO.seaStranded };
      else message = { kind: 'ok', text: NAVAL_UI_KO.seaPlotted };
      startOrders(leader);
      return;
    }
    const res = assault(game, leader, t % game.width, Math.floor(t / game.width));
    audio.sfx(!res.ok ? 'error' : res.result === 'overrun' ? 'overrun' : res.result === 'stopped' ? 'march' : 'bugle');
    if (!res.ok) message = { kind: 'error', text: `${MOVE_UI_KO.failed}: ${BLOCK_KO[res.error ?? ''] ?? res.error}` };
    else if (res.result === 'overrun') message = { kind: 'ok', text: COMBAT_UI_KO.overran };
    else if (res.result === 'stopped') message = { kind: 'warn', text: COMBAT_UI_KO.stopped };
    else message = { kind: 'ok', text: COMBAT_UI_KO.plottedDone };
    startOrders(leader);
  }

  function undo() {
    if (!game) return;
    view.finishAnimation();
    const leader = undoMove(game);
    if (leader === null) return;
    audio.sfx('undo');
    message = { kind: 'ok', text: MOVE_UI_KO.undone };
    startOrders(leader, 'tactical');
    render();
  }

  function cancel() {
    if (banner) return;
    if (orders || sel) audio.sfx('cancel');
    if (orders && orders.assault !== null) orders.assault = null;
    else if (orders && orders.pinned !== null) orders.pinned = null;
    else if (orders) orders = null;
    else sel = null;
    message = null;
    render();
  }

  // ---------- air operations ----------

  function toggleAir() {
    if (!game || modal() || !canPlanAir(game)) return;
    airOpen = !airOpen;
    // the original bases the air units whenever the Air Operations screen opens (OPSSUBS 1058 -> CHOOSE_BASES)
    if (airOpen) { chooseBases(game, game.player); sel = null; orders = null; turnView = null; message = null; }
    render();
  }

  function strikeText(r: AirStrikeResult): string {
    const place = `(${r.target[0]}, ${r.target[1]})`;
    if (!r.found) return AIR_UI_KO.strikeDone(place, AIR_UI_KO.noTarget);
    const worst = Math.max(...r.forces.map((f) => f.severity));
    const lost = r.forces.reduce((s, f) => s + f.equipmentLost, 0);
    // limited intelligence: the original reports only how badly the enemy was hit, not the equipment count
    const enemyHit = (r.player === 2) === (viewer() === 'un');
    const exact = !(game && fogActive(game) && enemyHit);
    return AIR_UI_KO.strikeDone(place, `${STRIKE_SEVERITY_KO[worst]}${exact ? ` · ${AIR_UI_KO.equipmentLost(lost)}` : ''}${r.aaHit ? ` · ${AIR_UI_KO.aaHit}` : ''}`);
  }

  function strikeAt(x: number, y: number) {
    if (!game) return;
    const res = flyAirstrike(game, x, y);
    audio.sfx(res.ok ? 'airstrike' : 'error');
    if (!res.ok) {
      message = { kind: 'error', text: res.error === 'manchuria' ? AIR_UI_KO.manchuria : AIR_UI_KO.friendly };
    } else {
      strikeMarks = [...strikeMarks, marker(res.result)];
      view.flashStrikes([marker(res.result)], 0, gameDelay(1100, play.speed));
      // the strike card shows the result as the original's message line; a toast only when nothing was found
      message = res.result.found ? null : { kind: 'warn', text: strikeText(res.result) };
    }
    render();
  }

  function delegate(all: boolean) {
    if (!game) return;
    const done = delegateAirstrikes(game, all);
    if (done.length) audio.sfx('airstrike');
    strikeMarks = [...strikeMarks, ...done.map(marker)];
    // the program's strikes one after another, as the original shows them
    view.flashStrikes(done.map(marker), gameDelay(650, play.speed), gameDelay(1100, play.speed));
    const last = done[done.length - 1];
    message = last ? { kind: 'ok', text: `${AIR_UI_KO.autoTag}: ${strikeText(last)}` } : null;
    render();
  }

  // ---------- map events ----------

  view.onClick = (x, y) => {
    view.finishAnimation();
    if (!game || modal()) return;
    const i = idx(game, x, y);
    if (inStrikes()) { if (pendingAirstrike(game)) strikeAt(x, y); return; }
    airOpen = false;
    turnView = null;
    if (orders) {
      if (isEnemyNeighbor(i)) {
        if (orders.assault === i) executeAssault();
        else { orders.assault = i; orders.pinned = null; message = null; audio.sfx('pin'); }
        render();
        return;
      }
      const node = orders.reach.nodes.get(i);
      if (node && i !== orders.reach.origin) {
        if (node.canStop) {
          if (orders.pinned === i) execute();
          else { orders.pinned = i; orders.assault = null; message = null; audio.sfx('pin'); }
        }
        render();
        return;
      }
    }
    selectHex(x, y);
    render();
  };

  view.onContext = cancel;

  view.onHover = (x, y) => {
    if (!game || !ctx) return;
    const i = idx(game, x, y);
    const h = game.hexes[i];
    const owner = game.possession[i];
    const forces = knownAt(game, x, y);
    const place = placeAt(x, y, game.scenarioNo === 4);
    const feature = featureAt(x, y);
    let text = `(${x}, ${y}) ${place ? place.label + ' · ' : ''}${feature ? feature.label + (feature.elevation ? ` ${feature.elevation}m` : '') + ' · ' : ''}${TERRAIN_KO[h.terrain]}${owner ? ' · ' + POSSESSION_KO[owner] : ''}${forces.length ? ` · 부대 ${forces.length}개` : ''}`;
    if (view.layers.supply && owner && h.code < 0xa5) text += ` · ${view.supplyNet()[i] === owner ? TURN_UI_KO.inNet(PLAYER_KO[owner === 1 ? 2 : 1]) : TURN_UI_KO.outOfNet}`;
    const next = inStrikes() ? pendingAirstrike(game) : null;
    if (next) {
      const err = strikeTargetError(game, next.player, x, y);
      text += ` · ${err === 'manchuria' ? AIR_UI_KO.manchuria : err ? AIR_UI_KO.friendly : AIR_UI_KO.aimAt(Math.max(1, Math.min(100, strikeLethality(game, next.unit, x, y))))}`;
      view.strikeAim = { hex: i, valid: !err };
      if (!strikeHover || strikeHover[0] !== x || strikeHover[1] !== y) {
        strikeHover = [x, y];
        renderSide();
      }
      view.invalidate();
    } else if (orders) {
      const n = orders.reach.nodes.get(i);
      const blocked = orders.reach.blocked.get(i);
      if (n && i !== orders.reach.origin) {
        if (orders.mode === 'sea') text += ` · ${n.step.lands ? NAVAL_UI_KO.landing : `${NAVAL_UI_KO.atSeaStep} (${MOVE_UI_KO.cannotStopHere})`}`;
        else if (orders.mode === 'air') {
          text += ` · ${NAVAL_UI_KO.dropLoss} ${airdropLoss(game, x, y)}%`;
          const risk = dropRisk(game, viewer(), i);
          if (risk) text += ` · ${risk === 'enemy' ? NAVAL_UI_KO.dropConfirmDanger : INTEL_UI_KO.dropUnknown}`;
          if (!n.canStop) text += ` · ${MOVE_UI_KO.cannotStopHere}`;
        } else {
          text += orders.mode === 'rail' ? ` · ${MOVE_UI_KO.railStops}` : ` · ${MOVE_UI_KO.after} ${orders.reach.rate - n.used}`;
          if (!n.canStop) text += ` · ${MOVE_UI_KO.cannotStopHere}`;
        }
      } else if (blocked) text += ` · ${BLOCK_KO[blocked]}`;
      if (isEnemyNeighbor(i)) text += ` · ${orders.mode === 'sea' ? NAVAL_UI_KO.seaPlot : COMBAT_UI_KO.assault}`;
      if (orders.hover !== i) {
        orders.hover = i;
        if (orders.pinned === null && orders.assault === null) render();
      }
    } else if (forces.length && !forces.some((f) => canCommand(f.leader)) && (game.phase === 1 || game.phase === 3)) {
      text += ` · ${TURN_UI_KO.enemyForce}`;
    }
    status.textContent = text;
  };

  // ---------- panel buttons (delegated) ----------

  panel.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-action]');
    if (!btn || !game || modal()) return;
    const action = btn.dataset.action;
    if (action === 'confirm') execute();
    else if (action === 'confirm-assault') executeAssault();
    else if (action === 'cancel-plot' && orders) {
      if (cancelAssault(game, orders.leader)) message = { kind: 'ok', text: COMBAT_UI_KO.cancelled };
      startOrders(orders.leader);
    }
    else if (action === 'cancel') { cancel(); return; }
    else if (action === 'undo') { undo(); return; }
    else if (action === 'mode' && orders) startOrders(orders.leader, btn.dataset.mode as MoveMode);
    else if (action === 'select-force') { message = null; startOrders(Number(btn.dataset.leader)); }
    else if (action === 'replay-battle' && turnView?.combat) {
      // "전투 다시 보기" plays every battle in turn; the ▶ of one battle plays only that battle
      startReplay(turnView.combat, [], Number(btn.dataset.index ?? 0), btn.dataset.scope === 'one');
      return;
    }
    else if (action === 'organize') { openOrganize(Number(btn.dataset.x), Number(btn.dataset.y)); return; }
    else if (action === 'mission') {
      if (setMission(game, Number(btn.dataset.unit), Number(btn.dataset.mission))) message = null;
    }
    else if (action === 'air-close') airOpen = false;
    else if (action === 'strike-auto') { delegate(false); return; }
    else if (action === 'strike-auto-all') { delegate(true); return; }
    else if (action === 'strike-continue') { endPhase(false); return; }
    else if (action === 'bugout' && orders) {
      if (!window.confirm(MOVE_UI_KO.bugOutConfirm)) return;
      if (bugOut(game, orders.leader)) message = { kind: 'warn', text: MOVE_UI_KO.bugOutDone };
      startOrders(orders.leader);
    }
    render();
  });

  // ---------- title screen (the original opens with a title picture, then the start menu) ----------
  const titleEl = $('#title-screen');
  let titleOpen = false;
  function showTitle() {
    titleOpen = true;
    titleEl.innerHTML = `
      <div class="ts-art" style="background-image:url('${TITLE_ART}')"></div>
      <div class="ts-shade"></div>
      <div class="ts-body">
        <p class="ts-kicker">${esc(TITLE_KO.kicker)}</p>
        <h1>${esc(TITLE_KO.title)}</h1>
        <p class="ts-sub">${esc(TITLE_KO.subtitle)}</p>
        <div class="ts-actions">
          <button type="button" class="btn primary ts-start" data-title="start">${esc(TITLE_KO.start)}</button>
          <button type="button" class="btn ghost" data-title="load">${esc(TITLE_KO.load)}</button>
        </div>
        <p class="ts-keys">${esc(TITLE_KO.keys)}</p>
      </div>
      <p class="ts-credit">${esc(TITLE_KO.credit)}</p>`;
    titleEl.hidden = false;
    titleEl.querySelector<HTMLButtonElement>('.ts-start')?.focus();
  }
  function closeTitle() {
    if (!titleOpen) return;
    titleOpen = false;
    titleEl.hidden = true;
    titleEl.innerHTML = '';
    newGameEl.querySelector<HTMLButtonElement>('[data-ng="start"]')?.focus();
  }
  titleEl.addEventListener('click', (e) => {
    const what = (e.target as HTMLElement).closest<HTMLElement>('[data-title]')?.dataset.title;
    closeTitle();
    if (what === 'load') openSave();
  });
  // the title takes the keys first: Enter / Space / Esc go on to the start menu
  window.addEventListener('keydown', (e) => {
    if (!titleOpen) return;
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') { e.preventDefault(); closeTitle(); }
    e.stopImmediatePropagation();
  }, true);

  window.addEventListener('keydown', (e) => {
    if ((e.target as HTMLElement).closest('select, input, textarea')) return;
    if (replay) {
      if (e.key === 'Escape') { e.preventDefault(); finishReplay(); }
      else if (e.key === ' ') { e.preventDefault(); toggleReplayPause(); }
      else if (e.key === 'Enter' || e.key === 'ArrowRight') { e.preventDefault(); stopReplayTimer(); replayNext(); }
      return;
    }
    if (saveOpen) {
      if (e.key === 'Escape') closeSave();
      return;
    }
    if (reportsOpen) {
      if (e.key === 'Escape') closeReports();
      return;
    }
    if (organizeAt) {
      if (e.key === 'Escape') closeOrganize();
      return;
    }
    if (draft) {
      // the start menu: Enter begins the game (original key 7), Esc closes it while a game is running
      if (e.key === 'Enter') { e.preventDefault(); startGame(draft); }
      else if (e.key === 'Escape') closeNewGame();
      return;
    }
    if (banner) {
      if (e.key === 'Enter' && banner.buttons.length === 1) onBanner(banner.buttons[0].action);
      return;
    }
    view.finishAnimation();
    if (e.key === 'Escape') cancel();
    else if (e.key.toLowerCase() === 'c' && !e.ctrlKey && !e.metaKey && !e.altKey) centerSelected();
    else if (e.key === 'Enter' && orders && orders.assault !== null) { executeAssault(); render(); }
    else if (e.key === 'Enter' && orders?.pinned !== null && orders) { execute(); render(); }
    else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); undo(); }
  });

  // ---------- scenario loading ----------

  /** Start a new game with the start menu values (docs/rules/options.md 2). */
  async function startGame(o: GameOptions, save = true) {
    const id = scenarioFileId(o);
    scenario = await getJson<Scenario>(`${DATA}/scenarios/${id}.json`);
    game = createGameState(map, scenario, (Date.now() >>> 0) || 1950);
    options = { ...o };
    draft = null;
    saveOpen = false;
    const events = startNewGame(game, toStartOptions(o));
    bootGame = !save;
    if (save) closeTitle();
    // the game shown behind the start menu when the page opens does not replay its opening battles
    useGame(events, save);
    // the game shown behind the start menu when the page opens must not replace the last autosave
    if (save) autoSave();
    render();
  }

  /** Show `game` (new or loaded) and the events that led to its current phase. */
  function useGame(events: TurnEvent[], replayBattles = true) {
    if (!game || !scenario) return;
    cancelReplay();
    view.setData(map, scenario, game);
    const g = game;
    const chosen = options;
    ctx = {
      map, hexes: g.hexes, scenario, game: g, forcesAt: (x, y) => knownAt(g, x, y), supplyNet: () => view.supplyNet(),
      viewer: () => viewerSide(g), options: chosen,
    };
    sel = null;
    orders = null;
    message = null;
    turnView = null;
    banner = null;
    strikeMarks = [];
    organizeAt = null;
    renaming = null;
    // a computer that moves first may already have fought the first combat phase: its report stays in the panel
    handleEvents(events, replayBattles);
    if (first) { view.fitAll(); first = false; }
  }

  // ---------- save / load (docs/rules/save.md) ----------

  function saveFile(): SaveFile | null {
    if (!game || saveBlocked(game)) return null;
    return saveGame(game, options);
  }

  /** Autosave at the start of a human player's orders phase (docs/rules/save.md 3). */
  function autoSave() {
    if (!game || saveBlocked(game) || game.computerSide === game.player || game.phase === 2) return;
    const f = saveFile();
    if (!f) return;
    try { storage()?.setItem(SAVE_KEY + 'auto', saveToText(f)); } catch { /* storage full or unavailable: files still work */ }
  }

  function saveToSlot(key: string) {
    const f = saveFile();
    const s = storage();
    if (!f || !s) return;
    if (readSlot(key) && !window.confirm(SAVE_UI_KO.overwrite(key))) return;
    try {
      s.setItem(SAVE_KEY + key, saveToText(f));
      audio.sfx('save');
      saveMsg = { kind: 'ok', text: SAVE_UI_KO.saved(key) };
    } catch { saveMsg = { kind: 'error', text: SAVE_UI_KO.storageFull }; }
  }

  function deleteSlot(key: string) {
    if (!window.confirm(SAVE_UI_KO.deleteConfirm(key))) return;
    try { storage()?.removeItem(SAVE_KEY + key); } catch { /* ignore */ }
    saveMsg = { kind: 'ok', text: SAVE_UI_KO.deleted(key) };
  }

  /** Load a save file (text). Returns an error text, or null when the game was loaded. */
  async function loadFromText(text: string, ask = true): Promise<string | null> {
    const p = parseSave(text);
    if (!p.ok) return SAVE_UI_KO.errors[p.error];
    if (ask && game && !game.gameOver && !draft && !window.confirm(SAVE_UI_KO.loadConfirm)) return '';
    let data: Scenario;
    try { data = await getJson<Scenario>(`${DATA}/scenarios/${p.file.scenarioId}.json`); } catch { return SAVE_UI_KO.errors.noScenario; }
    let loaded: GameState;
    try { loaded = loadGame(p.file, map, data); } catch { return SAVE_UI_KO.errors.scenarioMismatch; }
    scenario = data;
    game = loaded;
    options = p.file.options ? { ...p.file.options } : optionsForFile(p.file.scenarioId, options);
    draft = null;
    saveOpen = false;
    saveMsg = null;
    bootGame = false;
    closeTitle();
    useGame(resumeGame(game));
    if (banner) banner.lines.unshift(SAVE_UI_KO.loaded);
    render();
    return null;
  }

  function downloadSave() {
    const f = saveFile();
    if (!f) return;
    const blob = new Blob([saveToText(f)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `conflict-korea-${f.scenarioId}-${f.summary.turn}턴-${f.summary.player === 1 ? '공산군' : '유엔군'}${f.summary.phase === 1 ? '1차' : '2차'}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    saveMsg = { kind: 'ok', text: SAVE_UI_KO.downloaded };
    audio.sfx('save');
  }

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.json,application/json,.sav,.SAV';
  fileInput.hidden = true;
  document.body.appendChild(fileInput);
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    fileInput.value = '';
    if (!file) return;
    // original saves are binary: the web client does not read them, the converter does (docs/rules/save.md 4)
    if (/\.sav$/i.test(file.name)) { saveMsg = { kind: 'error', text: SAVE_UI_KO.errors.originalSav }; render(); return; }
    const err = await loadFromText(await file.text());
    if (err) { saveMsg = { kind: 'error', text: err }; render(); }
  });

  function renderSaveDlg() {
    if (!saveOpen) { saveEl.hidden = true; saveEl.innerHTML = ''; return; }
    const why = game ? saveBlocked(game) : 'phase';
    renderSaveDialog(saveEl, {
      slots: slotViews(),
      blocked: why === 'gameOver' ? SAVE_UI_KO.blockedGameOver : why ? SAVE_UI_KO.blockedPhase : null,
      noStorage: !storage(),
      message: saveMsg,
    });
    saveEl.hidden = false;
  }

  function openSave() {
    reportsOpen = false;
    organizeAt = null;
    renaming = null;
    saveOpen = true;
    saveMsg = null;
    render();
  }

  function closeSave() {
    saveOpen = false;
    saveMsg = null;
    render();
  }

  saveEl.addEventListener('click', async (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-sv]');
    if (!b || (b as HTMLButtonElement).disabled) return;
    const act = b.dataset.sv!;
    const key = b.dataset.slot ?? '';
    if (act === 'close') { closeSave(); return; }
    if (act === 'save') saveToSlot(key);
    else if (act === 'delete') deleteSlot(key);
    else if (act === 'download') downloadSave();
    else if (act === 'upload') { fileInput.click(); return; }
    else if (act === 'load') {
      const text = readSlot(key);
      const err = text ? await loadFromText(text) : SAVE_UI_KO.errors.notSave;
      if (err === null) return;
      if (err) saveMsg = { kind: 'error', text: err };
    }
    render();
  });

  /** Start the scenario data `id` (korea1 .. korea4s) with the current menu values. */
  async function load(id: string) {
    await startGame(optionsForFile(id, options));
  }

  // ---------- new game dialog (the original start menu) ----------

  function renderDialog() {
    if (!draft) { newGameEl.hidden = true; newGameEl.innerHTML = ''; return; }
    renderNewGame(newGameEl, { options: draft, canClose: !!game && !bootGame });
    newGameEl.hidden = false;
  }

  function openNewGame() {
    draft = { ...options };
    render();
    newGameEl.querySelector<HTMLButtonElement>('[data-ng="start"]')?.focus();
  }

  function closeNewGame() {
    if (!game || bootGame) return;
    draft = null;
    render();
  }

  newGameEl.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-ng]');
    if (!b || !draft || (b as HTMLButtonElement).disabled) return;
    const field = b.dataset.ng!;
    if (field === 'start') { startGame(draft); return; }
    if (field === 'close') { closeNewGame(); return; }
    if (field === 'load') { openSave(); return; }
    draft = applyChoice(draft, field, b.dataset.value ?? '');
    renderDialog();
    if (field === 'scenario') { renderSide(); panel.scrollTop = 0; }
    newGameEl.querySelector<HTMLElement>(`[data-ng="${field}"][aria-pressed="true"]`)?.focus();
  });
  $('#new-game').addEventListener('click', () => { if (!draft) openNewGame(); });
  $('#save-game').addEventListener('click', () => { if (saveOpen) closeSave(); else openSave(); });
  $('#reports-btn').addEventListener('click', () => { if (reportsOpen) closeReports(); else openReports(); });

  // the layer toggles sit in a small drop-down (minor controls); a click elsewhere folds it
  rememberDetails(panel);
  const layersMenu = $('#layers-menu') as HTMLDetailsElement;
  $('#layers-btn').title = LAYOUT_KO.layersTitle;
  document.addEventListener('pointerdown', (e) => {
    if (layersMenu.open && !layersMenu.contains(e.target as Node)) layersMenu.open = false;
  });
  document.querySelectorAll<HTMLButtonElement>('[data-layer]').forEach((btn) => {
    const key = btn.dataset.layer as keyof Layers;
    btn.setAttribute('aria-pressed', String(view.layers[key]));
    btn.addEventListener('click', () => {
      view.layers[key] = !view.layers[key];
      btn.setAttribute('aria-pressed', String(view.layers[key]));
      view.invalidate();
    });
  });
  $('#zoom-in').addEventListener('click', () => view.zoomAt(1.3));
  $('#zoom-out').addEventListener('click', () => view.zoomAt(1 / 1.3));
  $('#zoom-fit').addEventListener('click', () => view.fitAll());
  $('#end-phase').addEventListener('click', () => endPhase(true));
  $('#air-ops').addEventListener('click', toggleAir);

  // the original opens with the start menu: a game with the default values runs behind it
  await startGame(options, false);
  openNewGame();
  showTitle();
  // debugging hooks for the browser console / automated checks
  (globalThis as { __app?: unknown }).__app = {
    view, load,
    /** Start a new game with the current menu values changed by `o` (closes the dialog). */
    newGame: (o: Partial<GameOptions> = {}) => startGame({ ...options, ...o }),
    openNewGame, closeNewGame,
    get options() { return options; },
    get draft() { return draft; },
    get game() { return game; },
    get orders() { return orders; },
    get banner() { return banner; },
    click: (x: number, y: number) => view.onClick(x, y),
    hover: (x: number, y: number) => view.onHover(x, y),
    endPhase: () => endPhase(false),
    toggleAir,
    get airOpen() { return airOpen; },
    closeBanner: () => { if (banner) onBanner(banner.buttons[0].action); },
    bannerAction: (a: string) => onBanner(a),
    cancel, undo,
    /** Intelligence option for the next new game (true = limited); `load(id)` starts it. */
    setIntel: (limited: boolean) => { options = { ...options, limitedIntel: limited }; },
    get viewer() { return viewer(); },
    /** Sound: the manager (settings, songs, sfx(name), renderOffline(id, s), renderSfx(name)). */
    audio,
    /** Reports: 'strategic' | 'facilities' | 'weather' | 'scenario' | 'overview'. */
    openReports, closeReports,
    get reportsOpen() { return reportsOpen; },
    setOverviewMode: (m: 'terrain' | 'supply') => { overviewMode = m; renderReportsDlg(); },
    /** Save / load: the dialog, slots ('auto', '1'..'5'), and save files as text. */
    openSave, closeSave,
    get saveOpen() { return saveOpen; },
    saveSlot: (k: string) => { saveToSlot(k); render(); },
    loadSlot: async (k: string) => { const t = readSlot(k); return t ? loadFromText(t, false) : 'empty'; },
    saveText: () => { const f = saveFile(); return f ? saveToText(f) : null; },
    loadText: (t: string) => loadFromText(t, false),
    /** Force organisation (docs/rules/forces.md): the dialog of hex x, y, a unit's transfer, a force name, + Hex / - Hex. */
    openOrganize, closeOrganize,
    get organizeAt() { return organizeAt; },
    transfer: (id: number) => organizeTransfer(id),
    renameForce: (slot: 0 | 1, name: string) => organizeRename(slot, name),
    organizeNav: (dir: 1 | -1) => organizeNav(dir),
    /** Combat replay: state (battle b, step s), and the controls. */
    get replay() { return replay && { b: replay.b, s: replay.s, battles: replay.battles.length, steps: replay.battles[replay.b].steps.map((x) => x.kind), paused: replay.paused, single: replay.single, first: replay.first, revealed: replay.revealed }; },
    replayNext: () => { stopReplayTimer(); replayNext(); },
    replayNextBattle: () => { stopReplayTimer(); replayNextBattle(); },
    replaySkip: () => finishReplay(),
    replayPause: () => toggleReplayPause(),
    /** Speed (1 fast, 2 medium, 3 slow) and movement centering; `animating` while a moved force is still sliding. */
    get play() { return play; },
    setPlay,
    get animating() { return view.animating; },
    centerSelected,
    /** Switch the selected force's movement mode ('tactical' | 'rail' | 'sea' | 'air'). */
    setMode: (m: MoveMode) => { if (orders) { message = null; startOrders(orders.leader, m); render(); } },
  };
}

main();
