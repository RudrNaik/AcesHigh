import type { CharacterData } from "../../characterManager/handlers/characterTypes";

/**
 * ============================
 * Campaign
 * ============================
 */

export interface CampaignData {
  id: string;

  name: string;
  description: string;

  roster: CharacterData[];

  // Enemy database for this campaign
  enemyTemplates: EnemyTemplate[];

  activeSortieId?: string;

  sorties: SortieData[];

  createdAt: string;
}


/**
 * ============================
 * Sorties
 * ============================
 */

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


/**
 * ============================
 * Player Deployment
 * ============================
 */

export interface SortiePilot {
  id: string;

  /**
   * Reference back to CharacterData
   */
  characterId: string;

  /**
   * Optional aircraft assignment
   */
  aircraftId?: string;

  callsign: string;

  runtime: CombatantRuntime;
}


/**
 * ============================
 * Enemy Database Template
 * ============================
 *
 * Represents your spreadsheet entries.
 * These should never change during a sortie.
 */

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


/**
 * ============================
 * Enemy Instance
 * ============================
 *
 * Represents an enemy spawned into
 * a specific sortie.
 */

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


/**
 * ============================
 * Shared Combat State
 * ============================
 *
 * Used by both players and enemies.
 */

export interface CombatantRuntime {
  hp: number;

  armor: number;

  capacity: number;

  /**
   * Aircraft / vehicles may use energy.
   * Ground targets may not.
   */
  energy?: number;

  stress: number;

  conditions: string[];

  destroyed?: boolean;
}


/**
 * ============================
 * Objectives
 * ============================
 */

export interface SortieObjective {
  id: string;

  description: string;

  completed: boolean;

  optional: boolean;
}


/**
 * ============================
 * Enemy Properties
 * ============================
 */

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