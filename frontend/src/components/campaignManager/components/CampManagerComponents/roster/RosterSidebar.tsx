import { useMemo, useRef, useState } from "react";

import type { CharacterData } from "../../../../characterManager/handlers/characterTypes";

import RosterRow from "./RosterRow";

interface Props {
  roster: CharacterData[];

  selectedId: string | null;

  onSelect: (id: string) => void;

  onImport: (character: CharacterData) => void;

  onDelete: (id: string) => void;

  activeSortieId?: string;

  assignedPilotIds: string[];

  onToggleAssignment: (character: CharacterData) => void;
}

function RosterSidebar({
  roster,
  selectedId,
  onSelect,
  onImport,
  onDelete,
  assignedPilotIds,
  onToggleAssignment,
}: Props) {
  const [search, setSearch] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredRoster = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return roster;

    return roster.filter((character) => {
      return (
        character.dossier.callsign.toLowerCase().includes(query) ||
        character.dossier.firstName.toLowerCase().includes(query) ||
        character.dossier.lastName.toLowerCase().includes(query)
      );
    });
  }, [roster, search]);

  async function handleFileSelected(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const text = await file.text();

      const imported = JSON.parse(text) as CharacterData;

      onImport(imported);
    } catch {
      alert("Failed to import character.");
    }

    event.target.value = "";
  }

  return (
    <aside className="flex min-h-full flex-col border border-cyan-800 bg-black/20">
      <div className="border-b border-cyan-800 p-4 space-y-2">
        <div>
          <h2 className="text-xl font-bold">Campaign Roster</h2>

          <p className="text-xs text-cyan-300">{roster.length} Pilots</p>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search pilots..."
          className="w-full border-b border-cyan-100 bg-transparent px-2 py-1"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full border border-cyan-800 py-2 text-xs hover:bg-cyan-200 hover:text-black transition"
        >
          Import Character
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleFileSelected}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredRoster.map((character) => (
          <RosterRow
            character={character}
            selected={character.id === selectedId}
            assigned={assignedPilotIds.includes(character.id)}
            onSelect={() => onSelect(character.id)}
            onToggleAssignment={() => onToggleAssignment(character)}
            onDelete={() => onDelete(character.id)}
          />
        ))}
      </div>
    </aside>
  );
}

export default RosterSidebar;
