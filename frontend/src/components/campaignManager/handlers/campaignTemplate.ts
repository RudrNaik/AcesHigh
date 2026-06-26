import type { CampaignData } from "./campaignTypes";

export function createDefaultCampaign(): CampaignData {
  return {
    id: crypto.randomUUID(),

    name: "New Campaign",
    description: "",

    roster: [],

    activeSortieId: undefined,

    sorties: [],

    createdAt: new Date().toISOString(),
  };
}