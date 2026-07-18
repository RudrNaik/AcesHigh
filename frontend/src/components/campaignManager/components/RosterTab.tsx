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

  const activeSortie =
    campaign.sorties.find((sortie) => sortie.id === campaign.activeSortieId) ??
    null;

  const assignedPilotIds =
    activeSortie?.pilots.map((pilot) => pilot.characterId) ?? [];

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

  function createSortiePilot(character: CharacterData) {
    return {
      id: crypto.randomUUID(),

      characterId: character.id,

      aircraftId: undefined,

      callsign: character.dossier.callsign,

      runtime: {
        surv: 0,
        armor: 0,
        capacity: 0,
        energy: 0,
        stress: 0,
        conditions: [],
        destroyed: false,
      },
    };
  }

  function toggleAssignment(character: CharacterData) {
    if (!activeSortie) {
      alert("Please create or select an active sortie first.");

      return;
    }

    const assigned = activeSortie.pilots.some(
      (pilot) => pilot.characterId === character.id,
    );

    const updatedPilots = assigned
      ? activeSortie.pilots.filter(
          (pilot) => pilot.characterId !== character.id,
        )
      : [...activeSortie.pilots, createSortiePilot(character)];

    onUpdate({
      ...campaign,

      sorties: campaign.sorties.map((sortie) =>
        sortie.id === activeSortie.id
          ? {
              ...sortie,
              pilots: updatedPilots,
            }
          : sortie,
      ),
    });
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
        assignedPilotIds={assignedPilotIds}
        onToggleAssignment={toggleAssignment}
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
            <span className="animate-pulse">
              Select a pilot from the roster.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default RosterTab;
