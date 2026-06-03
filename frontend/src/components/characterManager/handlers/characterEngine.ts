import type { CharacterData } from "./characterTypes";

export function getDisplayName(
  character: CharacterData
): string {
  const { firstName, lastName, callsign } =
    character.dossier;

  return `${firstName} "${callsign}" ${lastName}`;
}

export function getTotalStress(
  character: CharacterData
) {
  return (
    character.stress.mental +
    character.stress.physical
  );
}