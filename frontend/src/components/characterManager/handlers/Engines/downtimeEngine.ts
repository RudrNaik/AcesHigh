import type { CharacterData, Reset, Downtime } from "../characterTypes";

import downtimeData from "../../../../data/Downtimes.json";

export function createDowntime(): Downtime {
  return {
    id: "",
    starter: false,
    notes: "",
  };
}

export function createReset(): Reset {
  return {
    DT: [createDowntime(), createDowntime()],
    BonusRp: 0,
  };
}

export function addReset(character: CharacterData): CharacterData {
  const updated = structuredClone(character);

  updated.resets.push(createReset());

  return updated;
}

export function removeReset(
  character: CharacterData,
  resetIndex: number,
): CharacterData {
  const updated = structuredClone(character);

  updated.resets.splice(resetIndex, 1);

  return updated;
}

export function updateResetBonusRP(
  character: CharacterData,
  resetIndex: number,
  bonusRp: number,
): CharacterData {
  const updated = structuredClone(character);

  if (!updated.resets[resetIndex]) return character;

  updated.resets[resetIndex].BonusRp = bonusRp;

  return updated;
}

export function setDowntime(
  character: CharacterData,
  resetIndex: number,
  slot: 0 | 1,
  downtimeId: string,
): CharacterData {
  const updated = structuredClone(character);

  const reset = updated.resets[resetIndex];

  if (!reset) return character;

  reset.DT[slot].id = downtimeId;

  return updated;
}

export function setDowntimeStarter(
  character: CharacterData,
  resetIndex: number,
  slot: 0 | 1,
  starter: boolean,
): CharacterData {
  const updated = structuredClone(character);

  const reset = updated.resets[resetIndex];

  if (!reset) return character;

  reset.DT[slot].starter = starter;

  return updated;
}

export function setDowntimeNotes(
  character: CharacterData,
  resetIndex: number,
  slot: 0 | 1,
  notes: string,
): CharacterData {
  const updated = structuredClone(character);

  const reset = updated.resets[resetIndex];

  if (!reset) return character;

  reset.DT[slot].notes = notes;

  return updated;
}

export function getDowntimeData(id: string) {
  return downtimeData.find((d) => d.id === id);
}

export function getDowntimeName(id: string): string {
  return getDowntimeData(id)?.name ?? "";
}

export function getTotalBonusRP(character: CharacterData): number {
  return character.resets.reduce((sum, reset) => sum + reset.BonusRp, 0);
}

export function isDowntimeFilled(downtime: Downtime): boolean {
  return downtime.id !== "";
}

export function isResetComplete(reset: Reset): boolean {
  return reset.DT[0].id !== "" && reset.DT[1].id !== "";
}

export function getCompletedResets(character: CharacterData): Reset[] {
  return character.resets.filter(isResetComplete);
}

export function getCurrentReset(character: CharacterData): Reset | null {
  if (character.resets.length === 0) {
    return null;
  }

  return character.resets[character.resets.length - 1];
}

export function ensureCurrentReset(character: CharacterData): CharacterData {
  if (getCurrentReset(character)) {
    return character;
  }

  return addReset(character);
}

export function sanitizeResets(character: CharacterData): CharacterData {
  const updated = structuredClone(character);

  updated.resets = updated.resets.map((reset) => ({
    DT: [
      {
        id: typeof reset.DT?.[0]?.id === "string" ? reset.DT[0].id : "",
        starter: Boolean(reset.DT?.[0]?.starter),
        notes:
          typeof reset.DT?.[0]?.notes === "string" ? reset.DT[0].notes : "",
      },
      {
        id: typeof reset.DT?.[1]?.id === "string" ? reset.DT[1].id : "",
        starter: Boolean(reset.DT?.[1]?.starter),
        notes:
          typeof reset.DT?.[1]?.notes === "string" ? reset.DT[1].notes : "",
      },
    ],
    BonusRp: typeof reset.BonusRp === "number" ? reset.BonusRp : 0,
  }));

  return updated;
}

export function setBonusRP(
  character: CharacterData,
  resetIndex: number,
  bonusRP: number,
): CharacterData {
  const updated = structuredClone(character);

  if (!updated.resets[resetIndex]) {
    return character;
  }

  updated.resets[resetIndex].BonusRp = bonusRP;

  return updated;
}
