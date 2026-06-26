import { useEffect, useState } from "react";
import type { CampaignData } from "./campaignTypes";

const STORAGE_KEY = "acesHighCampaigns";

export function useCampaignStorage() {
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        setCampaigns(JSON.parse(saved));
      } catch (err) {
        console.error(err);
      }
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
  }, [campaigns, hydrated]);

  const addCampaign = (campaign: CampaignData) => {
    setCampaigns((prev) => [...prev, campaign]);
  };

  const updateCampaign = (campaign: CampaignData) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaign.id ? campaign : c)),
    );
  };

  const deleteCampaign = (id: string) => {
    setCampaigns((prev) =>
      prev.filter((c) => c.id !== id),
    );
  };

  return {
    campaigns,
    addCampaign,
    updateCampaign,
    deleteCampaign,
  };
}