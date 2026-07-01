import { useState } from "react";

import type { CampaignData } from "../handlers/campaignTypes";
import type { CharacterData } from "../../characterManager/handlers/characterTypes";

import RosterSidebar from "./CampManagerComponents/roster/RosterSidebar";
import CharacterSheet from "../../characterManager/components/CharacterSheet";

interface Props {
  campaign: CampaignData;
  onUpdate: (campaign: CampaignData) => void;
}

function RosterTab({ campaign, onUpdate }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedCharacter =
    campaign.roster.find((c) => c.id === selectedId) ?? null;

  function updateRosterCharacter(updated: CharacterData) {
    onUpdate({
      ...campaign,
      roster: campaign.roster.map((c) => (c.id === updated.id ? updated : c)),
    });
  }

  function handleImport(character: CharacterData) {
    const exists = campaign.roster.some((c) => c.id === character.id);

    if (exists) {
      const overwrite = window.confirm(
        `Character already exists in this campaign. Overwrite?`,
      );

      if (!overwrite) return;

      onUpdate({
        ...campaign,
        roster: campaign.roster.map((c) =>
          c.id === character.id ? character : c,
        ),
      });

      return;
    }

    onUpdate({
      ...campaign,
      roster: [...campaign.roster, character],
    });
  }

  function handleDelete(id: string) {
    const updatedRoster = campaign.roster.filter((c) => c.id !== id);

    onUpdate({
      ...campaign,
      roster: updatedRoster,
    });

    if (selectedId === id) {
      setSelectedId(updatedRoster[0]?.id ?? null);
    }
  }

  return (
    <div className="grid lg:grid-cols-[320px_1fr] h-full space-x-2">
      {/* Sidebar */}
      <RosterSidebar
        roster={campaign.roster}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onImport={handleImport}
        onDelete={handleDelete}
      />

      {/* Main View */}
      <div className="h-full overflow-y-auto">
        {selectedCharacter ? (
          <CharacterSheet
            character={selectedCharacter}
            onUpdate={updateRosterCharacter}
            onBack={() => setSelectedId(null)}
          />
        ) : (
          <div className="min-h-screen p-8 flex justify-center text-cyan-100 border-cyan-800 border">
            <span className="animate-pulse">Select a pilot from the roster.</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default RosterTab;
