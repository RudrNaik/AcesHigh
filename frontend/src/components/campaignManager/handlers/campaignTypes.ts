import type { CharacterData } from "../../characterManager/handlers/characterTypes"

export interface CampaignData {
  id: string;

  name: string;
  description: string;

  roster: CharacterData[];

  activeSortieId?: string;

  sorties: SortieData[];

  createdAt: string;
}

export interface SortieData {
  id: string;

  name: string;

  participants: string[];

  notes: string;

  active: boolean;

  completed: boolean;
}