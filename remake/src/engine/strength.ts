// Unit strength, following the rulebook Appendix F ("MILITARY UNIT STRENGTHS"):
//   lethality     = readiness * sum(assigned * equipment lethality)
//   survivability = readiness * sum(assigned * equipment survivability)
//   seasoned x1.25, veteran x1.5, fractions dropped; the UI shows values divided by ten.
// Verified: NKPA 50/15 Inf Rgt -> survivability 234, lethality 418 at 100% readiness.

import type { EquipmentType, Unit } from '../data/types.ts';

export const EXPERIENCE_MULTIPLIER: Record<number, number> = { 1: 1, 2: 1.25, 3: 1.5 };

export interface Strength { lethality: number; survivability: number; }

export function rawStrength(unit: Unit, types: Map<number, EquipmentType>): Strength {
  let lethality = 0;
  let survivability = 0;
  for (const e of unit.equipment) {
    const t = types.get(e.type);
    if (!t) continue;
    lethality += e.assigned * t.lethality;
    survivability += e.assigned * t.survivability;
  }
  return { lethality, survivability };
}

export function effectiveStrength(unit: Unit, types: Map<number, EquipmentType>): Strength {
  const raw = rawStrength(unit, types);
  const r = Math.max(0, unit.readiness) / 100;
  const m = EXPERIENCE_MULTIPLIER[unit.experience] ?? 1;
  return {
    lethality: Math.floor(Math.floor(raw.lethality * r) * m),
    survivability: Math.floor(Math.floor(raw.survivability * r) * m),
  };
}

/** What the original UI displays (figures divided by ten, remainders lost). */
export function displayStrength(s: Strength): Strength {
  return { lethality: Math.floor(s.lethality / 10), survivability: Math.floor(s.survivability / 10) };
}
