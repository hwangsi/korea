// Step-by-step ground combat replay (docs/rules/combat.md 6). The original shows every battle of DO_GROUND_COMBAT on
// the map (GRCMBT.CHECK_ELIM 28cc~): the map scrolls to the target, "X forces attack hex: x,y", each attacking unit
// with an arrow from its side, each defending unit, "Combat Results / Attacker Loss Ratio / Defender Loss Ratio", then
// what happened to each unit ("has been eliminated.", "Retreats to:", "Bugs out", "Retreat path blocked!", "Advances
// to:"), pausing GAMEDELAY between lines. The engine has already resolved everything; the replay reads the battle
// reports (CombatReport with before/after snapshots of each force) and draws the battle as it was.

import type { CombatEvent, CombatReport, CombatSide, Strength } from '../engine/combat.ts';
import type { GameState, Side } from '../engine/state.ts';
import { sideOf } from '../engine/state.ts';
import { neighbor } from '../engine/hex.ts';
import { placeAt } from '../data/places.ts';
import { ARMY_NAME_KO, TERRAIN_KO, forceNameKo, unitNameKo, REPLAY_KO as T } from '../i18n/ko.ts';

export type ReplayStepKind = 'intro' | 'attacker' | 'defender' | 'result' | 'event' | 'end';

export interface ReplayStep {
  kind: ReplayStepKind;
  /** Attacker / defender / event index. */
  i: number;
  /** Pause after the step at medium speed (ms; scaled by GAMEDELAY for the speed setting). */
  ms: number;
}

export interface ReplayBattle { report: CombatReport; steps: ReplayStep[]; events: CombatEvent[]; }

/** Events worth a line (experience gains of artillery are not shown, as in the original). */
export const shownEvents = (r: CombatReport) => r.events.filter((e) => e.kind !== 'expGain');

export function buildReplay(reports: CombatReport[]): ReplayBattle[] {
  return reports.map((report) => {
    const events = shownEvents(report);
    const quick = !!report.moveIn;
    const steps: ReplayStep[] = [{ kind: 'intro', i: 0, ms: quick ? 450 : 750 }];
    report.attackers.forEach((_, i) => steps.push({ kind: 'attacker', i, ms: quick ? 400 : 650 }));
    if (!quick) {
      report.defenders.forEach((_, i) => steps.push({ kind: 'defender', i, ms: 650 }));
      steps.push({ kind: 'result', i: 0, ms: 1600 });
    }
    events.forEach((_, i) => steps.push({ kind: 'event', i, ms: quick ? 600 : 1000 }));
    steps.push({ kind: 'end', i: 0, ms: quick ? 250 : 550 });
    return { report, steps, events };
  });
}

// ---------- what the map shows at a step ----------

export interface ReplayGhost {
  side: CombatSide;
  role: 'attacker' | 'defender';
  at: [number, number];
  strength: Strength | null;
  gone: boolean;
  /** A force of a battle not replayed yet: shown as it was before that battle (no spoilers on the map). */
  waiting?: boolean;
}

export interface ReplayOverlay {
  target: [number, number];
  /** Side of the attacking army (arrow colour). */
  attackSide: Side;
  arrows: { from: [number, number]; current: boolean }[];
  ghosts: ReplayGhost[];
  trails: { from: [number, number]; to: [number, number]; kind: 'retreat' | 'advance'; side: Side }[];
  marks: { at: [number, number]; kind: 'eliminated' | 'blocked' | 'bugout' }[];
  /** The result step: a burst over the target. */
  burst: boolean;
  /** Units of every participant: their live counters are hidden while the battle is replayed. */
  hide: Set<number>;
}

export const armySide = (army: number): Side => (army < 2 ? 'communist' : 'un');

const sideHas = (s: CombatSide, id: number) => s.units.includes(id);

/**
 * What the map shows at step `s` of battle `b`. `later` are the battles still to come in the replay: their forces
 * are drawn as they stood before their battle (the engine has already resolved them, the live map would give the
 * results away). A force that fights several times is shown for the earliest of them.
 */
export function overlayFor(b: ReplayBattle, s: number, later: ReplayBattle[] = []): ReplayOverlay {
  const o = currentOverlay(b, s);
  const claimed = new Set(o.hide);
  for (const lb of later) {
    const lr = lb.report;
    for (const [role, list] of [['attacker', lr.attackers], ['defender', lr.defenders]] as const) {
      for (const side of list) {
        if (side.units.some((id) => claimed.has(id))) continue;
        for (const id of side.units) claimed.add(id);
        o.ghosts.push({ side, role, at: side.from, strength: side.before, gone: false, waiting: true });
      }
    }
  }
  o.hide = claimed;
  return o;
}

function currentOverlay(b: ReplayBattle, s: number): ReplayOverlay {
  const r = b.report;
  const done = b.steps.slice(0, s + 1);
  const cur = b.steps[s];
  const attackersShown = done.filter((x) => x.kind === 'attacker').length;
  const resultShown = done.some((x) => x.kind === 'result');
  const eventsShown = done.filter((x) => x.kind === 'event').length;
  const finished = cur?.kind === 'end';
  const ghosts: ReplayGhost[] = [
    ...r.attackers.map((side) => ({ side, role: 'attacker' as const, at: side.from, strength: side.before, gone: false })),
    ...r.defenders.map((side) => ({ side, role: 'defender' as const, at: side.from, strength: side.before, gone: false })),
  ];
  if (resultShown) for (const gh of ghosts) gh.strength = gh.side.after ?? gh.side.before;
  const trails: ReplayOverlay['trails'] = [];
  const marks: ReplayOverlay['marks'] = [];
  const lost = new Map<ReplayGhost, number>();
  const ghostOf = (id: number) => ghosts.find((gh) => sideHas(gh.side, id));
  for (const e of b.events.slice(0, eventsShown)) {
    if (e.kind === 'retreat' || e.kind === 'advance' || e.kind === 'moveIn' || e.kind === 'evacuated') {
      const gh = ghostOf(e.leader);
      if (!gh) continue;
      trails.push({ from: gh.at, to: e.to, kind: e.kind === 'retreat' || e.kind === 'evacuated' ? 'retreat' : 'advance', side: sideOfRole(r, gh.role) });
      gh.at = e.to;
    } else if (e.kind === 'eliminated' || e.kind === 'lostAtSea') {
      const gh = e.kind === 'eliminated' ? ghostOf(e.unit) : ghostOf(e.leader);
      if (!gh) continue;
      const n = (lost.get(gh) ?? 0) + (e.kind === 'eliminated' ? 1 : gh.side.units.length);
      lost.set(gh, n);
      if (n >= gh.side.units.length) { gh.gone = true; marks.push({ at: gh.at, kind: 'eliminated' }); }
    } else if (e.kind === 'blocked') {
      const gh = ghostOf(e.leader);
      if (gh) marks.push({ at: gh.at, kind: 'blocked' });
    } else if (e.kind === 'bugout') {
      const gh = ghostOf(e.unit);
      if (gh) marks.push({ at: gh.at, kind: 'bugout' });
    }
  }
  if (finished) {
    for (const gh of ghosts) {
      if (!gh.side.after) { if (!gh.gone) { gh.gone = true; marks.push({ at: gh.at, kind: 'eliminated' }); } } else if (gh.side.at) gh.at = gh.side.at;
    }
  }
  return {
    target: r.target,
    attackSide: armySide(r.army),
    arrows: r.attackers.slice(0, attackersShown).map((a, i) => ({ from: a.from, current: cur?.kind === 'attacker' && cur.i === i })),
    ghosts,
    trails,
    marks,
    burst: cur?.kind === 'result',
    hide: new Set([...r.attackers, ...r.defenders].flatMap((x) => x.units)),
  };
}

function sideOfRole(r: CombatReport, role: 'attacker' | 'defender'): Side {
  const a = armySide(r.army);
  return role === 'attacker' ? a : a === 'un' ? 'communist' : 'un';
}

// ---------- the text box ----------

export interface ReplayView {
  game: GameState;
  battles: ReplayBattle[];
  b: number;
  s: number;
  paused: boolean;
  /** The viewer does not know enemy strengths (limited intelligence). */
  hideEnemy: boolean;
  viewer: Side;
  /** Only this battle is replayed (the ▶ of one battle in the results list): no "next battle". */
  single?: boolean;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export const sideNameKo = (s: CombatSide) => (s.units.length > 1 ? forceNameKo(s.name) : unitNameKo(s.name));

export function placeKo(g: GameState, x: number, y: number): string {
  const p = placeAt(x, y, g.scenarioNo === 4);
  const h = g.hexes[y * g.width + x];
  return `${p?.label ?? (h ? TERRAIN_KO[h.terrain] : '')} (${x}, ${y})`;
}

/** Direction the attacker came from, seen from the target ("북서쪽"), or '' if not adjacent. */
export function fromDirKo(from: [number, number], target: [number, number]): string {
  for (let d = 0; d < 6; d++) {
    const [nx, ny] = neighbor(target[0], target[1], d);
    if (nx === from[0] && ny === from[1]) return T.dirs[d];
  }
  return '';
}

const str = (s: Strength | null, hidden: boolean) => (hidden ? T.hidden : s ? `${s.L}-${s.S}` : T.none);

function eventLine(g: GameState, b: ReplayBattle, e: CombatEvent): { icon: string; text: string; cls: string } {
  const r = b.report;
  const all = [...r.attackers, ...r.defenders];
  const owner = (id: number) => all.find((x) => sideHas(x, id));
  const nameOf = (id: number) => { const o = owner(id); return o ? sideNameKo(o) : ''; };
  switch (e.kind) {
    case 'eliminated': {
      const o = owner(e.unit);
      const whole = !!o && o.units.length === 1;
      return { icon: '✖', cls: 'bad', text: whole ? T.forceEliminated(unitNameKo(e.name)) : T.unitEliminated(unitNameKo(e.name), o ? sideNameKo(o) : '') };
    }
    case 'retreat': return { icon: '↩', cls: 'warn', text: T.retreat(nameOf(e.leader), placeKo(g, e.to[0], e.to[1])) };
    case 'blocked': return { icon: '⛔', cls: 'bad', text: T.blocked(nameOf(e.leader)) };
    case 'bugout': return { icon: '⇢', cls: 'warn', text: T.bugout(unitNameKo(e.name)) };
    case 'advance': return { icon: '➜', cls: 'good', text: T.advance(nameOf(e.leader), placeKo(g, e.to[0], e.to[1])) };
    case 'moveIn': return { icon: '➜', cls: 'good', text: T.moveInLine(nameOf(e.leader), placeKo(g, e.to[0], e.to[1])) };
    case 'evacuated': return { icon: '⚓', cls: 'bad', text: T.evacuated(nameOf(e.leader)) };
    case 'lostAtSea': return { icon: '✖', cls: 'bad', text: T.lostAtSea(nameOf(e.leader)) };
    default: return { icon: '·', cls: '', text: '' };
  }
}

/** What became of the defenders: all eliminated, pushed out, or holding (attackers wiped out are told in the lines). */
export function verdict(r: CombatReport): string {
  if (r.defenders.length && r.defenders.every((d) => !d.after)) return T.wipedOut;
  return r.retreated ? T.retreated : T.held;
}

export function renderReplay(el: HTMLElement, v: ReplayView) {
  const g = v.game;
  const b = v.battles[v.b];
  if (!b) { el.hidden = true; el.innerHTML = ''; return; }
  const r = b.report;
  const done = b.steps.slice(0, v.s + 1);
  const cur = b.steps[v.s];
  const aSide = armySide(r.army);
  const hideA = v.hideEnemy && aSide !== v.viewer;
  const hideD = v.hideEnemy && aSide === v.viewer;
  const attackersShown = done.filter((x) => x.kind === 'attacker').length;
  const defendersShown = done.filter((x) => x.kind === 'defender').length;
  const resultShown = done.some((x) => x.kind === 'result');
  const eventsShown = done.filter((x) => x.kind === 'event').length;
  const army = ARMY_NAME_KO[r.army] ?? '';
  const target = placeKo(g, r.target[0], r.target[1]);
  const row = (s: CombatSide, i: number, role: 'attacker' | 'defender', current: boolean) => {
    const hidden = role === 'attacker' ? hideA : hideD;
    const dir = role === 'attacker' ? fromDirKo(s.from, r.target) : '';
    const after = resultShown ? ` → <b class="${s.after ? '' : 'bad'}">${esc(s.after ? str(s.after, hidden) : T.destroyed)}</b>` : '';
    return `<li class="${current ? 'cur' : ''}"><span class="nm">${esc(sideNameKo(s))}</span>${dir ? `<span class="dir">${esc(T.fromDir(dir))}</span>` : ''}<span class="st">${esc(str(s.before, hidden))}${after}</span></li>`;
  };
  const att = r.attackers.slice(0, attackersShown).map((s, i) => row(s, i, 'attacker', cur?.kind === 'attacker' && cur.i === i)).join('');
  const def = r.defenders.slice(0, defendersShown).map((s, i) => row(s, i, 'defender', cur?.kind === 'defender' && cur.i === i)).join('');
  const lostA = r.attackers.reduce((a, s) => a + s.equipBefore - s.equipAfter, 0);
  const lostD = r.defenders.reduce((a, s) => a + s.equipBefore - s.equipAfter, 0);
  const bar = (label: string, pct: number, cls: string) =>
    `<div class="rp-bar ${cls}"><span>${esc(label)}</span><i><b style="width:${Math.max(2, Math.min(100, pct))}%"></b></i><em>${pct}%</em></div>`;
  const result = resultShown && !r.moveIn ? `
    <div class="rp-result ${cur?.kind === 'result' ? 'cur' : ''}">
      <h4>${esc(T.results)}</h4>
      ${bar(T.attackerLoss, r.attackerLoss, aSide === 'un' ? 'c-un' : 'c-red')}
      ${bar(T.defenderLoss, r.defenderLoss, aSide === 'un' ? 'c-red' : 'c-un')}
      <p class="rp-verdict ${r.retreated ? 'good' : 'hold'}">${esc(T.retreatChance(r.retreatChance))} · <b>${esc(verdict(r))}</b></p>
      <p class="rp-equip">${esc(T.equipLost(lostA, lostD))}</p>
    </div>` : '';
  const evs = b.events.slice(0, eventsShown).map((e, i) => {
    const l = eventLine(g, b, e);
    return `<li class="${l.cls} ${cur?.kind === 'event' && cur.i === i ? 'cur' : ''}"><span class="ic">${l.icon}</span>${esc(l.text)}</li>`;
  }).join('');
  const quietEnd = cur?.kind === 'end' && !b.events.length && !r.moveIn ? `<li class="muted"><span class="ic">·</span>${esc(T.noChange)}</li>` : '';
  el.innerHTML = `
    <div class="rp-box side-${aSide}" role="dialog" aria-label="${esc(T.title)}">
      <header>
        <span class="rp-count">${esc(v.single ? T.oneBattle(v.b + 1) : T.battleOf(v.b + 1, v.battles.length))}</span>
        <b class="rp-title">${esc(r.moveIn ? T.moveIn(army, target) : T.attacks(army, target))}</b>
        <span class="rp-ctrl">
          <button type="button" class="btn small" data-replay="pause">${esc(v.paused ? T.resume : T.pause)}</button>
          <button type="button" class="btn small" data-replay="next">${esc(T.next)}</button>
          ${v.single ? '' : `<button type="button" class="btn small" data-replay="battle">${esc(T.nextBattle)}</button>`}
          <button type="button" class="btn small" data-replay="skip">${esc(v.single ? T.close : T.skip)}</button>
        </span>
      </header>
      <div class="rp-cols ${r.moveIn ? 'one' : ''}">
        <div class="rp-col att"><h4>${esc(T.attackers)}</h4><ul>${att || `<li class="muted">…</li>`}</ul></div>
        ${r.moveIn ? '' : `<div class="rp-col def"><h4>${esc(T.defenders)}</h4><ul>${def || `<li class="muted">…</li>`}</ul></div>`}
        ${result}
      </div>
      ${evs || quietEnd ? `<ol class="rp-events">${evs}${quietEnd}</ol>` : ''}
      <p class="rp-keys">${esc(T.keys)}</p>
    </div>`;
  el.hidden = false;
}

/** Battles worth replaying: every report (an advance into an empty hex is shown briefly). */
export const replayable = (reports: CombatReport[] | null | undefined) => !!reports && reports.length > 0;

/** Side of a participant's leader (for fog checks by callers). */
export const participantSide = (g: GameState, s: CombatSide): Side => sideOf(g.units.get(s.leader)!);
