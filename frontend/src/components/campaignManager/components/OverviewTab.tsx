import type { CampaignData } from "../handlers/campaignTypes";

interface Props {
  campaign: CampaignData;
  onUpdate: (campaign: CampaignData) => void;
}

function OverviewTab({
  campaign,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="border p-4">
        <h2 className="text-xl font-bold mb-2">
          Campaign Overview
        </h2>

        <p>Name: {campaign.name}</p>

        <p>
          Description:{" "}
          {campaign.description || "None"}
        </p>

        <p>
          Pilots: {campaign.roster.length}
        </p>

        <p>
          Sorties: {campaign.sorties.length}
        </p>
      </div>
    </div>
  );
}

export default OverviewTab;