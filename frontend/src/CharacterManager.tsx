import { useState } from "react";
import type { CharacterData } from "./components/characterManager/handlers/characterTypes";

import CharacterSelect from "./components/characterManager/components/CharacterSelect";
import CharacterSheet from "./components/characterManager/components/CharacterSheet";

import { createDefaultCharacter } from "./components/characterManager/handlers/characterTemplate";
import { useCharacterStorage } from "./components/characterManager/handlers/characterStorage";

function CharacterManager() {
  const { characters, addCharacter, updateCharacter, deleteCharacter } =
    useCharacterStorage();

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const activeCharacter = characters.find((c) => c.id === selectedId) ?? null;

  const handleCreate = () => {
    const character = createDefaultCharacter();

    addCharacter(character);
    setSelectedId(character.id);
  };

  const handleBack = () => {
    setSelectedId(null);
  };

  function handleImport(imported: CharacterData) {
    const existing = characters.find((c) => c.id === imported.id);

    if (existing) {
      const overwrite = window.confirm(
        `Character "${existing.dossier.callsign}" already exists.\n\nOverwrite it?`,
      );

      if (!overwrite) return;

      updateCharacter(imported);
      return;
    }

    addCharacter(imported);
  }

  return (
    <div className="w-full min-h-screen">
      <div className="lg:px-10 mx-auto font-mono lg:py-8">
        {!activeCharacter ? (
          <CharacterSelect
            characters={characters}
            onSelect={setSelectedId}
            onCreate={handleCreate}
            onDelete={deleteCharacter}
            onImport={handleImport}
          />
        ) : (
          <CharacterSheet
            character={activeCharacter}
            onUpdate={updateCharacter}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}

export default CharacterManager;
