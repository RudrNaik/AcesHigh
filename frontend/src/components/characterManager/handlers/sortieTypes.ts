// sortieTypes.ts

export type ModifierSourceType =
  | "aircraft"
  | "upgrade"
  | "module"
  | "skill"
  | "specialization"
  | "basePerk"
  | "acePerk"
  | "mission"
  | "damage"
  | "intrinsic";

export type StatKey =
  | "temper"
  | "nerve"
  | "reflex"
  | "gResist"
  | "a2a"
  | "a2g"
  | "manu"
  | "speed"
  | "surv"
  | "cap";

export interface Modifier {
  sourceId: string;
  sourceName: string;
  sourceType: ModifierSourceType;

  stats: Partial<Record<StatKey, number>>;
}

export interface AppliedModifier {
  sourceId: string;
  sourceName: string;
  value: number;
}

export interface StatBreakdown {
  base: number;
  modifiers: AppliedModifier[];
  total: number;
}

export interface PilotState {
  temper: StatBreakdown;
  nerve: StatBreakdown;
  reflex: StatBreakdown;
  gResist: StatBreakdown;

  mentalStressMax: number;
  physicalStressMax: number;

  currentMentalStress: number;
  currentPhysicalStress: number;
}

export interface AircraftModuleState {
  id: string;
  name: string;
}

export interface UpgradePackState {
  id: string;
  name: string;
}

export interface AircraftState {
  aircraftId: string;
  aircraftName: string;

  a2a: StatBreakdown;
  a2g: StatBreakdown;
  manu: StatBreakdown;
  speed: StatBreakdown;
  surv: StatBreakdown;
  cap: StatBreakdown;

  tags: string[];

  intrinsic?: string;

  upgradePack?: UpgradePackState;

  modules: AircraftModuleState[];

  energy: number;
}

export interface SortieState {
  pilot: PilotState;
  aircraft: AircraftState;

  modifiers: Modifier[];
}

export interface Modifier {
  sourceId: string;
  sourceName: string;
  sourceType: ModifierSourceType;

  description?: string;

  stats: Partial<Record<StatKey, number>>;
}