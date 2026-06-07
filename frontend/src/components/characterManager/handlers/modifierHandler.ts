import type { Modifier, StatKey, AppliedModifier, StatBreakdown } from "./sortieTypes";

export function applyModifiers(
  base: Record<StatKey, number>,
  modifiers: Modifier[]
): Record<StatKey, StatBreakdown> {
  const result: Record<StatKey, StatBreakdown> = {} as any;

  // initialize base
  for (const key of Object.keys(base) as StatKey[]) {
    result[key] = {
      base: base[key],
      modifiers: [],
      total: base[key],
    };
  }

  for (const mod of modifiers) {
    for (const [statKey, value] of Object.entries(mod.stats)) {
      if (value === 0) continue;

      const key = statKey as StatKey;

      if (!result[key]) {
        result[key] = {
          base: 0,
          modifiers: [],
          total: 0,
        };
      }

      const applied: AppliedModifier = {
        sourceId: mod.sourceId,
        sourceName: mod.sourceName,
        value,
      };

      result[key].modifiers.push(applied);
      result[key].total += value;
    }
  }

  return result;
}