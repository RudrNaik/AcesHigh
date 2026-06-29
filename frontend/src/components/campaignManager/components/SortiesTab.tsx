import type { CampaignData } from "../handlers/campaignTypes";

interface Props {
  campaign: CampaignData;
  onUpdate: (campaign: CampaignData) => void;
}

function SortiesTab({
  campaign,
}: Props) {
  return (
    <div className="border p-4">
      <h2 className="text-xl font-bold mb-4">
        Sorties
      </h2>

      <p>
        Active and completed sorties will be
        managed here.
      </p>

      <div className="mt-4">
        Sorties: {campaign.sorties.length}
      </div>
    </div>
  );
}

export default SortiesTab;