import type { CharacterData } from "../handlers/characterTypes";
import TourCard from "./charManagerCommon/TourComponents/TourCard";
import * as tourEngine from "../handlers/Engines/tourEngine";

type Props = {
  character: CharacterData;
  updateCharacter: (updated: CharacterData) => void;
};

export default function TourView({ character, updateCharacter }: Props) {
  return (
    <div className="space-y-4 font-mono text-xs">
      <div className="flex justify-between items-center border-b border-cyan-900">
        <h1 className="text-xl pr-3 py-2 text-cyan-100 font-bold">
          Tours
        </h1>
        <button
          className="
      px-3 py-2
      border border-cyan-800
      hover:border-cyan-100
      text-cyan-300
    "
          onClick={() => {
            const firstTour = tourEngine.getAllTours()[0];

            updateCharacter(tourEngine.addTour(character, firstTour.tourID));
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
