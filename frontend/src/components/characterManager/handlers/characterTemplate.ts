import type { CharacterData } from "./characterTypes";

export const createDefaultCharacter = (): CharacterData => ({
  id: crypto.randomUUID(),

  dossier: {
    firstName: "",
    lastName: "",
    callsign: "",

    gender: "",
    pronouns: "",

    dateOfBirth: "",
    placeOfBirth: "",
    nationality: "",

    rank: "",
    squadron: "",

    faith: "",
    sexuality: "",

    height: "",
    weight: "",

    hairColor: "",
    eyeColor: "",

    biography: "",
    description: "",
    serviceRecord: "",
    psychologicalReport: "",

    languages: "",

    relationships:"",

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

  quirks: {
    quirk1Name: "",
    quirk1Desc: "",

    quirk2Name: "",
    quirk2Desc: "",

    quirk3Name: "",
    quirk3Desc: "",
  },

  aircraftId: null,

  perks: [],
  licenses: [],
  loot: [],

  tourId: null,
});
