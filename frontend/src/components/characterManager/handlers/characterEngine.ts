import type { CharacterData, CharacterStats, Coin } from "./characterTypes";
//import aircraft from "../../../data/AircraftList.json"
import staticMods from "../../../data/StaticMods.json";
import perks from "../../../data/PerkList.json";
import specializations from "../../../data/Specs.json";
import downtime from "../../../data/Downtimes.json";
import * as planeEngine from "./planeEngine";
//import licenses from "../../../data/Licenses.json";

export function getMentalStress(character: CharacterData) {
  let charStats = getPilotStatsModified(character);
  return charStats.nerve + charStats.temper;
}

export function getPhysStress(character: CharacterData) {
  let charStats = getPilotStatsModified(character);
  return charStats.reflex + charStats.gResist;
}

export function getCoins(character: CharacterData): Coin[] {
  return character.coins;
}

export function getStaticModifiersFromSpec(character: CharacterData) {
  let staticModifier: string | undefined = specializations.find(
    (spec) => spec.id === character.specialization.specId,
  )?.staticMods;

  if (staticModifier == undefined) {
    return;
  }

  let modifiers: any = staticMods.find(
    (mod) => mod.id === staticModifier,
  )?.mods;

  return {
    temper: modifiers?.temp || 0,
    nerve: modifiers?.nerve || 0,
    reflex: modifiers?.reflex || 0,
    gResist: modifiers?.gResist || 0,
  };
}

export function getPilotStatsModified(
  character: CharacterData,
): CharacterStats {
  let temp = character.metadata.startingPilotStats.temper;
  let nerv = character.metadata.startingPilotStats.nerve;
  let rflx = character.metadata.startingPilotStats.reflex;
  let gres = character.metadata.startingPilotStats.gResist;

  const modifiers = getStaticModifiersFromSpec(character);
  const { statDeltas } = planeEngine.applyModules(character);

  const pilotKeyMap: Record<string, keyof CharacterStats> = {
    Temper: "temper",
    temper: "temper",
    TEMPER: "temper",
    Nerve: "nerve",
    nerve: "nerve",
    NERVE: "nerve",
    Reflex: "reflex",
    reflex: "reflex",
    REFLEX: "reflex",
    GRes: "gResist",
    gres: "gResist",
    GRES: "gResist",
    gResist: "gResist",
  };

  const pilotDeltas: CharacterStats = {
    temper: 0,
    nerve: 0,
    reflex: 0,
    gResist: 0,
  };
  for (const [stat, delta] of Object.entries(statDeltas)) {
    const key = pilotKeyMap[stat];
    if (key) pilotDeltas[key] += delta;
  }

  const mindBreak = character.stress.permMentalAdj;
  const succedDry = character.stress.permPhysicalAdj;

  temp += (modifiers?.temper || 0) + pilotDeltas.temper - mindBreak;
  nerv += (modifiers?.nerve || 0) + pilotDeltas.nerve - mindBreak;
  rflx += (modifiers?.reflex || 0) + pilotDeltas.reflex - succedDry;
  gres += (modifiers?.gResist || 0) + pilotDeltas.gResist - succedDry;

  return { temper: temp, nerve: nerv, reflex: rflx, gResist: gres };
}

export function getTempPilotStats(character: CharacterData): CharacterStats {
  let temp = character.stats.temper;
  let nerv = character.stats.nerve;
  let rflx = character.stats.reflex;
  let gres = character.stats.gResist;
  return { temper: temp, nerve: nerv, reflex: rflx, gResist: gres };
}

export function getTempStress(character: CharacterData) {
  return {
    mental: character.stress.mental ?? 0,
    physical: character.stress.physical ?? 0,
  };
}

export function getBackGroundPerk(character: CharacterData) {
  let bgPerk = perks.find((p) => p.id === character.backgroundPerk);
  return {
    id: bgPerk?.id,
    name: bgPerk?.name,
    type: bgPerk?.type,
    tags: bgPerk?.tags,
    addManuID: bgPerk?.addManuID,
    advancement: bgPerk?.advancement,
    description: bgPerk?.description,
  };
}

export function getSpecialization(character: CharacterData) {
  const spec = specializations.find(
    (spec) => spec.id === character.specialization.specId,
  );

  if (!spec) {
    throw new Error(
      `Specialization '${character.specialization.specId}' not found`,
    );
  }

  return spec;
}

export function getDowntimes(character: CharacterData) {
  const spec = getSpecialization(character);

  if (!spec.preFlights?.length) {
    return undefined;
  }

  const downtime1 = downtime.find((dt) => dt.id === spec.preFlights[0]);
  const downtime2 = downtime.find((dt) => dt.id === spec.preFlights[1]);
  const downtime3 = downtime.find((dt) => dt.id === spec.preFlights[2]);

  if (!downtime1 || !downtime2 || !downtime3) {
    throw new Error("downtimes not found");
  }

  return { dt1: downtime1, dt2: downtime2, dt3: downtime3 };
}

export function getCurrentTactics(character: CharacterData) {
  let currTactics = character.specialization.tactics;
  return currTactics;
}

export function getTacticAdvancementCount(character: CharacterData) {
  return character.specialization.advancements.filter((a) => !a.perkConversion)
    .length;
}

export function getAdvancements(character: CharacterData) {
  const spec = getSpecialization(character);

  return {
    fromSpec: spec?.advancements ?? [],
    fromChar: character?.specialization?.advancements ?? [],
  };
}

export function setTempPilotStats(
  character: CharacterData,
  pilotStats: CharacterStats,
): CharacterData {
  return {
    ...character,
    stats: {
      ...character.stats,
      temper: pilotStats.temper,
      nerve: pilotStats.nerve,
      reflex: pilotStats.reflex,
      gResist: pilotStats.gResist,
    },
  };
}

export function setTempStress(
  character: CharacterData,
  stress: { mental: number; physical: number },
): CharacterData {
  return {
    ...character,
    stress: {
      ...character.stress,
      mental: stress.mental,
      physical: stress.physical,
    },
  };
}

export function setUsedCoin(
  character: CharacterData,
  index: number,
): CharacterData {
  return {
    ...character,
    coins: character.coins.map((coin, i) =>
      i === index ? { ...coin, used: true } : coin,
    ),
  };
}

export function resetUsedCoin(
  character: CharacterData,
  index: number,
): CharacterData {
  return {
    ...character,
    coins: character.coins.map((coin, i) =>
      i === index ? { ...coin, used: false } : coin,
    ),
  };
}

export function burnCoin(
  character: CharacterData,
  index: number,
): CharacterData {
  return {
    ...character,
    coins: character.coins.map((coin, i) =>
      i === index ? { ...coin, used: true, burned: true } : coin,
    ),
  };
}

export function pheonixCoin(
  character: CharacterData,
  index: number,
): CharacterData {
  return {
    ...character,
    coins: character.coins.map((coin, i) =>
      i === index ? { ...coin, used: false, burned: false } : coin,
    ),
  };
}

export function initializeTempStats(character: CharacterData): CharacterData {
  const maxStats = getPilotStatsModified(character);

  return {
    ...character,
    stats: {
      temper: maxStats.temper,
      nerve: maxStats.nerve,
      reflex: maxStats.reflex,
      gResist: maxStats.gResist,
    },
  };
}

export function spendPilotStat(
  character: CharacterData,
  stat: keyof CharacterStats,
  amount = 1,
): CharacterData {
  return {
    ...character,
    stats: {
      ...character.stats,
      [stat]: Math.max(0, character.stats[stat] - amount),
    },
  };
}

export function recoverPilotStat(
  character: CharacterData,
  stat: keyof CharacterStats,
  amount = 1,
): CharacterData {
  const maxStats = getPilotStatsModified(character);

  return {
    ...character,
    stats: {
      ...character.stats,
      [stat]: Math.min(maxStats[stat], character.stats[stat] + amount),
    },
  };
}

export function toggleAdvancement(
  character: CharacterData,
  index: number,
): CharacterData {
  const existing = character.specialization.advancements;

  const exists = existing.some((a) => a.index === index);

  const updatedAdvancements = exists
    ? existing.filter((a) => a.index !== index)
    : [
        ...existing,
        {
          index,
          perkConversion: false,
          completed: true,
        },
      ];

  const updated = {
    ...character,
    specialization: {
      ...character.specialization,
      advancements: updatedAdvancements,
    },
  };

  return reconcileTactics(updated);
}

export function reconcileTactics(character: CharacterData): CharacterData {
  const spec = character.specialization;
  const allowed = 2 + spec.advancements.filter((a) => !a.perkConversion).length;
  const current = [...spec.tactics];

  while (current.length > allowed) {
    current.pop();
  }

  const updatedSpec = {
    ...spec,
    tactics: current,
  };

  const fullSpecTactics = getSpecialization(character).tactics;
  const hasAllTactics = fullSpecTactics.every((t) => current.includes(t.id));
  const masteryStillValid = spec.mastery && hasAllTactics ? spec.mastery : "";

  return {
    ...character,
    specialization: {
      ...updatedSpec,
      mastery: masteryStillValid,
    },
  };
}

export function convertAdvancementToPerk(
  character: CharacterData,
  index: number,
): CharacterData {
  const updated = {
    ...character,
    specialization: {
      ...character.specialization,
      advancements: character.specialization.advancements.map((a) =>
        a.index === index ? { ...a, perkConversion: !a.perkConversion } : a,
      ),
    },
  };

  return reconcileTactics(updated);
}

export function addTacticToSpecialization(
  character: CharacterData,
  tactic: string,
  updateCharacter: (c: CharacterData) => void,
) {
  const allowed = getAllowedTacticCount(character);
  const current = character.specialization.tactics;

  if (current.some((t) => t === tactic)) return character;
  if (current.length >= allowed) return character;

  const updated = structuredClone(character);

  updated.specialization.tactics.push(tactic);

  updateCharacter(updated);

  return updated;
}

export function getAllowedTacticCount(character: CharacterData) {
  return 2 + getTacticAdvancementCount(character);
}

export function getAvailableTacticSlots(character: CharacterData) {
  const allowed = getAllowedTacticCount(character);
  const current = character.specialization.tactics.length;

  return Math.max(0, allowed - current);
}

export function canPickTactic(character: CharacterData) {
  return getAvailableTacticSlots(character) > 0;
}

export function validateTactics(character: CharacterData) {
  const allowed = getAllowedTacticCount(character);
  const current = character.specialization.tactics.length;

  return {
    allowed,
    current,
    remaining: allowed - current,
    valid: current <= allowed,
  };
}

export function canSelectMastery(character: CharacterData) {
  const spec = getSpecialization(character);

  return (
    character.specialization.tactics.length >= spec.tactics.length &&
    !character.specialization.mastery
  );
}

export function selectMastery(
  character: CharacterData,
  masteryId: string,
): CharacterData {
  const spec = getSpecialization(character);

  const validMastery = spec.masteries.some((m) => m.id === masteryId);

  if (!validMastery) {
    return character;
  }

  if (!canSelectMastery(character)) {
    return character;
  }

  return {
    ...character,
    specialization: {
      ...character.specialization,
      mastery: masteryId,
    },
  };
}

//Reduces mental stats by 1 when mentally stressed out
export function mindBreak(
  character: CharacterData,
  updateCharacter?: (c: CharacterData) => void,
) {
  const newPerm = (character.stress?.permMentalAdj ?? 0) + 1;
  let updated: CharacterData = {
    ...character,
    stress: {
      ...character.stress,
      permMentalAdj: newPerm,
    },
  };

  updated = reconcileTempStats(updated);

  if (updateCharacter) updateCharacter(updated);

  return updated;
}

//Reduces physical stats by 1 when sucked dry :3 (physical stressout)
export function Drained(
  character: CharacterData,
  updateCharacter?: (c: CharacterData) => void,
) {
  const newPerm = (character.stress?.permPhysicalAdj ?? 0) + 1;
  let updated: CharacterData = {
    ...character,
    stress: {
      ...character.stress,
      permPhysicalAdj: newPerm,
    },
  };

  updated = reconcileTempStats(updated);

  if (updateCharacter) updateCharacter(updated);

  return updated;
}

export function reconcileTempStats(character: CharacterData): CharacterData {
  const maxStats = getPilotStatsModified(character);

  return {
    ...character,
    stats: {
      temper: Math.min(character.stats.temper, maxStats.temper),
      nerve: Math.min(character.stats.nerve, maxStats.nerve),
      reflex: Math.min(character.stats.reflex, maxStats.reflex),
      gResist: Math.min(character.stats.gResist, maxStats.gResist),
    },
  };
}

export function reconcileMastery(character: CharacterData): CharacterData {
  if (!character.specialization.mastery) {
    return character;
  }

  const spec = getSpecialization(character);

  const hasAllTactics = spec.tactics.every((t) =>
    character.specialization.tactics.includes(t.id),
  );

  if (hasAllTactics) {
    return character;
  }

  return {
    ...character,
    specialization: {
      ...character.specialization,
      mastery: "",
    },
  };
}
