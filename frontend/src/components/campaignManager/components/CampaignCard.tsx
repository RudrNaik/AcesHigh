import type { CampaignData } from "../handlers/campaignTypes";

interface Props {
  campaign: CampaignData;
  onSelect: () => void;
  onDelete: () => void;
}

function CampaignCard({ campaign, onSelect, onDelete }: Props) {
  return (
    <div className="theme-card theme-card-hover theme-card-left-accent hover:animate-pulse">
      <div>
        <h2 className="text-xl font-bold">{campaign.name}</h2>

        <p className="text-sm text-cyan-200">
          {campaign.description || "No description."}
        </p>
      </div>

      <div className="text-sm">
        <div>Pilots: {campaign.roster.length}</div>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={onSelect}
          className="theme-btn flex-1"
        >
          Open
        </button>

        <button
          onClick={onDelete}
          className="theme-btn theme-btn-danger"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default CampaignCard;
