import type { CharacterData } from "../handlers/characterTypes";
import TourCard from "./CharManagerComponents/TourComponents/TourCard";
import * as tourEngine from "../handlers/Engines/tourEngine";

type Props = {
  character: CharacterData;
  updateCharacter: (updated: CharacterData) => void;
};

export default function TourView({ character, updateCharacter }: Props) {
  return (
    <div className="space-y-4 font-mono text-xs">
      <div className="flex justify-between items-center border border-cyan-100 lg:p-4 p-2">
        <h1 className="text-2xl font-bold">TOURS</h1>

        <button
          className="border border-cyan-100 px-3 py-2 text-xs text-cyan-100 transition hover:bg-cyan-100 hover:text-black"
          onClick={() => {
            updateCharacter(tourEngine.addTour(character, ""));
          }}
        >
          Add Tour
        </button>
      </div>

      {character.tours.length === 0 && (
        <div className="border border-cyan-800 bg-black/20 p-4 text-gray-400">
          No tours assigned.
        </div>
      )}

      {character.tours.map((tour, index) => (
        <TourCard
          key={index}
          tour={tour}
          tourIndex={index}
          character={character}
          updateCharacter={updateCharacter}
          defaultExpanded={index === character.tours.length - 1}
        />
      ))}
    </div>
  );
}
