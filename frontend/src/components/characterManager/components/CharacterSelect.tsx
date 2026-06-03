import CharacterCard from "./CharacterCard";
import type { CharacterData } from "../handlers/characterTypes";

interface Props {
  characters: CharacterData[];
  onSelect: (id: string) => void;
  onCreate: () => void;
}

function CharacterSelect({
  characters,
  onSelect,
  onCreate,
}: Props) {
  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Character Manager
        </h1>

        <button
          onClick={onCreate}
          className="borderborder-cyan-100 p-6 border-l-4"
        >
          Create Character
        </button>
      </div>

      {characters.length === 0 ? (
        <div className="border p-8 text-center">
          No characters created yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {characters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onSelect={() =>
                onSelect(character.id)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CharacterSelect;