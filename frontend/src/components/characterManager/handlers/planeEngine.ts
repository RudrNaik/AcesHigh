import type { CharacterData } from "./characterTypes";
import type {
  //AircraftSelectOption,
  AircraftCardProps,
} from "../components/charManagerCommon/planeComponents/MiniAircraftCard";
import type { OrdnanceSelectOption } from "../components/charManagerCommon/planeComponents/MiniOrdnanceCard";
import aircraft from "../../../data/AircraftList.json";
import licenses from "../../../data/Licenses.json";
import ordnance from "../../../data/OrdnanceList.json";

export type AirplaneStats = {
  A2A: string | number;
  A2G: string | number;
  MANU: string | number;
  SPEED: string | number;
  SURV: string | number;
  CAP: string | number;
};

export type OrdnanceDeets={
  id: string,
  name: string,
  domain: string,
  desc: string,
  tags: string[]
}

export type LicenseRank = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type RankKey = `rank${LicenseRank}`;

function getAircraftData(character: CharacterData) {
  return aircraft.find((plane) => plane.id === character.aircraft.aircraftId);
}

export function getAircraftList() {
  return aircraft.filter(
    (p) =>
      p.id !== "acExample" &&
      p.gen !== "n/a" &&
      p.tier !== "n/a" &&
      p.tier !== "n/a",
  );
}

export function getOrdnanceList(): OrdnanceSelectOption[] {
  return ordnance.map((o) => ({
    id: o.id,
    name: o.name,
    domain: o.domain,
  }));
}

export function getPlaneOrdnance(character: CharacterData): OrdnanceDeets {
  let ord = ordnance.find((ord)=> ord.id === character.aircraft.ordnanceId)
  
  return {
    id : ord?.id ?? "ordERROR",
    name : ord?.name ?? "None",
    domain: ord?.domain ?? "None",
    desc: ord?.desc ?? "None",
    tags: ord?.tags ?? ["error"]
  }
}

export function getPlaneId(character: CharacterData) {
  return character.aircraft.aircraftId;
}

export function getPlaneMods(character: CharacterData) {
  return character.aircraft.modules;
}

export function getUpPackage(character: CharacterData) {
  return character.aircraft.upgradePackage || "n/a";
}

export function getPlaneStats(character: CharacterData): AirplaneStats {
  const plane = getAircraftData(character);

  return {
    A2A: plane?.stats.A2A ?? 0,
    A2G: plane?.stats.A2G ?? 0,
    MANU: plane?.stats.MANU ?? 0,
    SPEED: plane?.stats.SPEED ?? 0,
    SURV: plane?.stats.SURV ?? 0,
    CAP: plane?.stats.CAP ?? 0,
  };
}

export function getAircraftState(character: CharacterData) {
  const stats = getPlaneStats(character);

  return {
    capacity: character.aircraft.currentCapacity ?? Number(stats.CAP),

    survivability:
      character.aircraft.currentSurvivability ?? Number(stats.SURV),

    energy: character.aircraft.currentEnergy ?? Number(stats.SPEED) + 1,
  };
}

export function getAircraftCardStats(character: CharacterData) {
  const base = getPlaneStats(character);
  const current = getAircraftState(character);

  return {
    A2A: base.A2A,
    A2G: base.A2G,
    MANU: base.MANU,
    SPEED: base.SPEED,

    SURV: `${current.survivability}/${base.SURV}`,
    CAP: `${current.capacity}/${base.CAP}`,
    ENRG: `${current.energy}/${Number(base.SPEED) + 1}`,
  };
}

export function getAirplaneStatsForCard(
  character: CharacterData,
): AircraftCardProps {
  const plane = getAircraftData(character);

  return {
    id: plane?.id ?? "",
    name: plane?.name ?? "",
    type: plane?.type ?? "",
    family: plane?.family ?? "",
    gen: plane?.gen ?? "",
    tier: plane?.tier ?? "",
    stats: getAircraftCardStats(character),
    tags: plane?.tags ?? "",
    moduleSlots: plane?.moduleSlots ?? "",
    desc: plane?.desc ?? "",
    intrinsic: plane?.intrinsic ?? "",
  };
}

export function initializeAircraftState(
  character: CharacterData,
): CharacterData {
  const stats = getPlaneStats(character);

  return {
    ...character,
    aircraft: {
      ...character.aircraft,

      currentCapacity: character.aircraft.currentCapacity ?? Number(stats.CAP),

      currentSurvivability:
        character.aircraft.currentSurvivability ?? Number(stats.SURV),

      currentEnergy:
        character.aircraft.currentEnergy ?? Number(stats.SPEED) + 1,
    },
  };
}

export function spendCapacity(
  character: CharacterData,
  amount = 1,
): CharacterData {
  return {
    ...character,
    aircraft: {
      ...character.aircraft,
      currentCapacity: Math.max(0, character.aircraft.currentCapacity - amount),
    },
  };
}

export function recoverCapacity(
  character: CharacterData,
  amount = 1,
): CharacterData {
  const max = Number(getPlaneStats(character).CAP);

  return {
    ...character,
    aircraft: {
      ...character.aircraft,
      currentCapacity: Math.min(
        max,
        character.aircraft.currentCapacity + amount,
      ),
    },
  };
}

export function spendSurvivability(
  character: CharacterData,
  amount = 1,
): CharacterData {
  return {
    ...character,
    aircraft: {
      ...character.aircraft,
      currentSurvivability: Math.max(
        0,
        character.aircraft.currentSurvivability - amount,
      ),
    },
  };
}

export function recoverSurvivability(
  character: CharacterData,
  amount = 1,
): CharacterData {
  const max = Number(getPlaneStats(character).SURV);

  return {
    ...character,
    aircraft: {
      ...character.aircraft,
      currentSurvivability: Math.min(
        max,
        character.aircraft.currentSurvivability + amount,
      ),
    },
  };
}

export function spendEnergy(
  character: CharacterData,
  amount = 1,
): CharacterData {
  return {
    ...character,
    aircraft: {
      ...character.aircraft,
      currentEnergy: Math.max(0, character.aircraft.currentEnergy - amount),
    },
  };
}

export function recoverEnergy(
  character: CharacterData,
  amount = 1,
): CharacterData {
  const max = Number(getPlaneStats(character).SPEED) + 1;

  return {
    ...character,
    aircraft: {
      ...character.aircraft,
      currentEnergy: Math.min(max, character.aircraft.currentEnergy + amount),
    },
  };
}

export function setAircraft(
  character: CharacterData,
  id: string,
): CharacterData {
  if (!id) {
    id = "acF4E";
  }

  const plane = aircraft.find((p) => p.id === id);

  if (!plane) {
    return character;
  }

  return {
    ...character,
    aircraft: {
      ...character.aircraft,

      aircraftId: id,

      currentCapacity: Number(plane.stats.CAP),
      currentSurvivability: Number(plane.stats.SURV),
      currentEnergy: Number(plane.stats.SPEED) + 1,
    },
  };
}

export function setOrdnance(
  character: CharacterData,
  id: string,
): CharacterData {
  if (!id) {
    id = "ordNone";
  }

  const ord = ordnance.find((ord) => ord.id === id);

  if (!ord) {
    return character;
  }

  return {
    ...character,
    aircraft: {
      ...character.aircraft,

      ordnanceId: id,
    },
  };
}

export function getLicenseProgressionUnlocks(licenseId: string, rank: number) {
  const license = licenses.find((l) => l.id === licenseId);
  if (!license) return null;

  const result = {
    ordnance: [] as string[],
    airframes: [] as string[],
    modules: [] as string[],
    upgrades: [] as string[],
  };

  const applyTier = (key: RankKey) => {
    const tier = license.unlocks[key];
    if (!tier) return;

    result.ordnance.push(...tier.ordnance);
    result.airframes.push(...tier.airframes);
    result.modules.push(...tier.modules);
    result.upgrades.push(...tier.upgrades);
  };

  for (let r = 1; r <= rank; r++) {
    applyTier(`rank${r}` as RankKey);
  }

  return result;
}
