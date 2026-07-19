import type { CharacterData } from "../../characterManager/handlers/characterTypes";

export interface CampaignData {
  id: string;

  name: string;
  description: string;

  roster: CharacterData[];

  enemyTemplates: EnemyTemplate[];

  activeSortieId?: string;

  sorties: SortieData[];

  createdAt: string;
}

export interface SortieData {
  id: string;

  name: string;
  description: string;

  status: SortieStatus;

  pilots: SortiePilot[];

  enemies: EnemyInstance[];

  objectives: SortieObjective[];

  turn: number;

  phase: SortiePhase;
}


export type SortieStatus =
  | "planning"
  | "active"
  | "completed"
  | "failed";


export type SortiePhase =
  | "briefing"
  | "deployment"
  | "combat"
  | "extraction"
  | "debrief";

export interface SortiePilot {
  id: string;

  aircraftId?: string;

  callsign: string;

  runtime: CombatantRuntime;
}

export interface EnemyTemplate {
  id: string;

  name: string;

  description: string;

  hp: number;

  armor: number;

  modSlots: number;

  capacity: number;

  type: EnemyType;

  tier: EnemyTier;

  tags: string[];
}


export interface EnemyInstance {
  id: string;

  /**
   * Reference to EnemyTemplate
   */
  templateId: string;

  nickname?: string;

  ai: EnemyAI;

  upgrades: string[];

  runtime: CombatantRuntime;
}

export interface CombatantRuntime {
  surv: number;

  armor: number;

  capacity: number;

  energy?: number;

  stress: number;

  conditions: string[];

  destroyed?: boolean;
}

export interface SortieObjective {
  id: string;

  description: string;

  completed: boolean;

  optional: boolean;
}

export type EnemyType =
  | "Airborne"
  | "Ground"
  | "Naval";


export type EnemyTier =
  | "Airman"
  | "Sergeant"
  | "Lieutenant"
  | "Major";


export type EnemyAI =
  | "rookie"
  | "regular"
  | "veteran"
  | "ace"
  | "boss";