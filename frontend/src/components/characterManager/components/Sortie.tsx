import type { CharacterData } from "../handlers/characterTypes";
import Pilot from "../components/charManagerCommon/pilotComponents/Pilot";
import Aircraft from "../components/charManagerCommon/planeComponents/Aircraft";

function SortieView({
  character,
  updateCharacter,
}: {
  character: CharacterData;
  updateCharacter: (updated: CharacterData) => void;
}) {
  return (
    <div className="w-full min-h-screen text-cyan-100 space-y-6">
      {/* HEADER */}
      <div className="border border-cyan-100 lg:p-4 p-2">
        <h1 className="text-2xl font-bold">SORTIE</h1>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pilot */}
        <Pilot character={character} updateCharacter={updateCharacter} />

        {/* AIRCRAFT STATE */}
        <Aircraft character={character} updateCharacter={updateCharacter} />
      </div>
    </div>
  );
}

export default SortieView;
