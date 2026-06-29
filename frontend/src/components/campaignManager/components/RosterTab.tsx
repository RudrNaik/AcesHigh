import type { CampaignData } from "../handlers/campaignTypes";

interface Props {
  campaign: CampaignData;
  onUpdate: (campaign: CampaignData) => void;
}

function RosterTab({
  campaign,
}: Props) {
  return (
    <div className="border p-4">
      <h2 className="text-xl font-bold mb-4">
        Campaign Roster
      </h2>

      <p>
        This is where imported player characters
        will appear.
      </p>

      <div className="mt-4">
        Characters: {campaign.roster.length}
      </div>
    </div>
  );
}

export default RosterTab;