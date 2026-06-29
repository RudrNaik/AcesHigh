import type { CampaignData } from "../handlers/campaignTypes";

interface Props {
  campaign: CampaignData;
}

function LogsTab({
  //campaign,
}: Props) {
  return (
    <div className="border p-4">
      <h2 className="text-xl font-bold mb-4">
        Campaign Logs
      </h2>

      <p>
        Past sorties and campaign history will
        appear here.
      </p>
    </div>
  );
}

export default LogsTab;