import { useState } from "react";
import CharacterSelect from "./components/characterManager/components/CharacterSelect";
import { createDefaultCharacter } from "./components/characterManager/handlers/characterTemplate";
import { useCharacterStorage } from "./components/characterManager/handlers/characterStorage";

function CharacterManager() {
  const { characters, addCharacter } = useCharacterStorage();

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleCreate = () => {
    const character = createDefaultCharacter();

    addCharacter(character);

    setSelectedId(character.id);
  };

  console.log(selectedId);

  return (
    <div className="w-full min-h-screen">

      <div className="max-w-6xl mx-auto px-4 font-mono">
        <CharacterSelect
          characters={characters}
          onSelect={setSelectedId}
          onCreate={handleCreate}
        />
      </div>
    </div>
  );
}

export default CharacterManager;
