import type { CampaignData } from "../handlers/campaignTypes";

interface Props {
  campaign: CampaignData;
  onSelect: () => void;
  onDelete: () => void;
}

function CampaignCard({ campaign, onSelect, onDelete }: Props) {
  return (
    <div
      className=" bg-black/20
    border
    border-cyan-800
    hover:border-cyan-100
    transition-all
    p-4
    hover:border-l-4
    hover:animate-pulse
    cursor:pointer"
    >
      <div>
        <h2 className="text-xl font-bold">{campaign.name}</h2>

        <p className="text-sm text-cyan-200">
          {campaign.description || "No description."}
        </p>
      </div>

      <div className="text-sm space-y-1">
        <div>Pilots: {campaign.roster.length}</div>

        <div>Sorties: {campaign.sorties.length}</div>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={onSelect}
          className="flex-1 border border-cyan-800 py-2 text-sm transition hover:bg-cyan-400 hover:text-black"
        >
          Open
        </button>

        <button
          onClick={onDelete}
          className="border border-red-700 px-4 py-2 text-sm transition hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default CampaignCard;
