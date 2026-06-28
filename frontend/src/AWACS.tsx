import { useState } from "react";

import CampaignSelect from "./components/campaignManager/components/CampaignSelect";
//import CampaignSheet from "./components/campaignManager/components/CampaignSheet";

import { createDefaultCampaign } from "./components/campaignManager/handlers/campaignTemplate";
import { useCampaignStorage } from "./components/campaignManager/handlers/campaignStorage";

function CampaignManager() {
  const {
    campaigns,
    addCampaign,
    //updateCampaign,
    deleteCampaign,
  } = useCampaignStorage();

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const activeCampaign = campaigns.find((c) => c.id === selectedId) ?? null;

  const handleCreate = () => {
    const campaign = createDefaultCampaign();

    addCampaign(campaign);
    setSelectedId(campaign.id);
  };

  //   const handleBack = () => {
  //     setSelectedId(null);
  //   };

  return (
    <div className="w-full min-h-screen">
      <div className="lg:px-10 mx-auto   lg:py-8">
        {!activeCampaign ? (
          <CampaignSelect
            campaigns={campaigns}
            onSelect={setSelectedId}
            onCreate={handleCreate}
            onDelete={deleteCampaign}
          />
        ) : (
          <div> Campaign Sheet Data Goes Here :)</div>
          //   <CampaignSheet
          //     campaign={activeCampaign}
          //     onUpdate={updateCampaign}
          //     onBack={handleBack}
          //   />
        )}
      </div>
    </div>
  );
}

export default CampaignManager;
