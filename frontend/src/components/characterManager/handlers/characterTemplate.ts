import type { CharacterData } from "./characterTypes";

export const createDefaultCharacter = (): CharacterData => ({
  id: crypto.randomUUID(),

  dossier: {
    firstName: "",
    lastName: "",
    callsign: "",

    age: null,

    gender: "",
    pronouns: "",

    quirk1: "",
    quirk2: "",
    quirk3: "",

    notes: "",
  },

  stats: {
    temper: 0,
    nerve: 0,
    reflex: 0,
    gResist: 0,
  },

  stress: {
    mental: 0,
    physical: 0,
  },

  aircraftId: null,

  perks: [],
  licenses: [],
  loot: [],

  tourId: null,
});