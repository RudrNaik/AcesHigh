import { buildPilotState, buildAircraftState } from "./stateBuilders";
import type { CharacterData } from "./characterTypes";
import type { SortieState } from "./sortieTypes";

export function buildSortieState(character: CharacterData): SortieState {
  return {
    pilot: buildPilotState(character),
    aircraft: buildAircraftState(character),
    modifiers: [], // optional debug / UI layer
  };
}
