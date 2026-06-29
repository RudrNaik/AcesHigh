import { useState } from "react";

import type { CampaignData } from "../handlers/campaignTypes";

import CampaignTabs from "./CampaignTabs";
import OverviewTab from "./OverviewTab";
import RosterTab from "./RosterTab";
import SortiesTab from "./SortiesTab";
import LogsTab from "./LogsTab";
import SettingsTab from "./SettingsTab";

interface Props {
  campaign: CampaignData;
  onUpdate: (campaign: CampaignData) => void;
  onBack: () => void;
}

function CampaignSheet({ campaign, onUpdate, onBack }: Props) {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="w-full min-h-screen px-1 space-y-6 lg:px-4 lg:py-2 lg:border-l-4 border-cyan-100 lg:border bg-black/20">
      <button onClick={onBack} className="border px-2 py-1 border-cyan-100">
        ← Back
      </button>

      <div>
        <h1 className="text-3xl font-bold">{campaign.name}</h1>

        <p className="text-gray-400">{campaign.description}</p>
      </div>

      <CampaignTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "Overview" && (
        <OverviewTab campaign={campaign} onUpdate={onUpdate} />
      )}

      {activeTab === "Roster" && (
        <RosterTab campaign={campaign} onUpdate={onUpdate} />
      )}

      {activeTab === "Sorties" && (
        <SortiesTab campaign={campaign} onUpdate={onUpdate} />
      )}

      {activeTab === "Logs" && <LogsTab campaign={campaign} />}

      {activeTab === "Settings" && (
        <SettingsTab campaign={campaign} onUpdate={onUpdate} />
      )}
    </div>
  );
}

export default CampaignSheet;
