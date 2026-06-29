import { useEffect, useState } from "react";

import type { CampaignData } from "./campaignTypes";
import { createDefaultCampaign } from "./campaignTemplate";

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
        console.error("Failed to parse campaigns", err);
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

  const hasCampaign = (id: string) => {
    return campaigns.some((c) => c.id === id);
  };

  const overwriteCampaign = (campaign: CampaignData) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaign.id ? campaign : c)),
    );
  };

  return {
    campaigns,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    hasCampaign,
    overwriteCampaign,
  };
}

export function exportCampaign(campaign: CampaignData) {
  const fileName = `${getCampaignFileName(campaign)}.json`;

  const json = JSON.stringify(campaign, null, 2);

  const blob = new Blob([json], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

function getCampaignFileName(campaign: CampaignData): string {
  const name = campaign.name.trim();

  if (name) {
    return sanitizeFileName(name);
  }

  return "campaign";
}

function sanitizeFileName(name: string): string {
  return name.replace(/[<>:"/\\|?*]/g, "_");
}

function pruneToShape<T>(data: unknown, shape: T): T {
  if (data === null || data === undefined) {
    return structuredClone(shape);
  }

  // Arrays
  if (Array.isArray(shape)) {
    if (!Array.isArray(data)) {
      return structuredClone(shape);
    }

    if (shape.length === 0) {
      return data as T;
    }

    return data.map((item) => pruneToShape(item, shape[0])) as T;
  }

  // Primitives
  if (typeof shape !== "object") {
    return typeof data === typeof shape
      ? (data as T)
      : structuredClone(shape);
  }

  // Objects
  const result: any = {};

  for (const key of Object.keys(shape as object)) {
    result[key] = pruneToShape(
      (data as any)[key],
      (shape as any)[key],
    );
  }

  return result;
}

export function sanitizeCampaign(
  campaign: unknown,
): CampaignData {
  const schema = createDefaultCampaign();

  // Preserve imported campaign id
  schema.id = "";

  return pruneToShape(campaign, schema);
}