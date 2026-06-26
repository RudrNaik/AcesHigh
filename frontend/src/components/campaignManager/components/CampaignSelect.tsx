import CampaignCard from "./CampaignCard";
import type { CampaignData } from "../handlers/campaignTypes";

interface Props {
  campaigns: CampaignData[];
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
}

function CampaignSelect({
  campaigns,
  onSelect,
  onCreate,
  onDelete,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Campaign Manager
        </h1>

        <button
          onClick={onCreate}
          className="border border-cyan-800 px-3 py-2 text-xs text-cyan-100 transition hover:bg-cyan-100 hover:text-black"
        >
          Create Campaign
        </button>
      </div>

      {campaigns.length === 0 ? (
        <div className="border p-8 text-center">
          No campaigns created yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 border p-8">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onSelect={() => onSelect(campaign.id)}
              onDelete={() => onDelete(campaign.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CampaignSelect;