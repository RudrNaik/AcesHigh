import CharacterCard from "./CharacterCard";
import type { CharacterData } from "../handlers/characterTypes";

interface Props {
  characters: CharacterData[];
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
}

function CharacterSelect({
  characters,
  onSelect,
  onCreate,
  onDelete
}: Props) {
  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Character Manager
        </h1>

        <button
          onClick={onCreate}
          className="border border-cyan-100 px-2 py-2"
        >
          Create Character
        </button>
      </div>

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
                onDelete(character.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CharacterSelect;