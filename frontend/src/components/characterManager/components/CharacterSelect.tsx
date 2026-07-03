import { useRef } from "react";

import CharacterCard from "./CharacterCard";
import type { CharacterData } from "../handlers/characterTypes";

interface Props {
  characters: CharacterData[];
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onImport: (character: CharacterData) => void;
}

function CharacterSelect({
  characters,
  onSelect,
  onCreate,
  onDelete,
  onImport,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const text = await file.text();

      const imported =
        JSON.parse(text) as CharacterData;

      onImport(imported);
    } catch (err) {
      console.error(err);
      alert("Failed to import character.");
    }

    event.target.value = "";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Character Manager
        </h1>

        <div className="flex gap-2">
          <button
            onClick={handleImportClick}
            className="border border-cyan-800 px-3 py-2 text-xs text-cyan-100 transition hover:bg-cyan-400 hover:text-black"
          >
            Import Character
          </button>

          <button
            onClick={onCreate}
            className="border border-cyan-800 px-3 py-2 text-xs text-cyan-100 transition hover:bg-cyan-100 hover:text-black"
          >
            Create Character
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileSelected}
      />

      {characters.length === 0 ? (
        <div className="border p-8 text-center">
          No characters created yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 border p-8">
          {characters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onSelect={() =>
                onSelect(character.id)
              }
              onDelete={() =>
                onDelete(character.id)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CharacterSelect;