import type { CharacterData } from "../handlers/characterTypes"
import * as charEngine from "../handlers/characterEngine"

function SortieView({
  character,
}: {
  character: CharacterData;
}) {
  
  const pilotStats = charEngine.getPilotStatsModified(character)

  console.log(pilotStats.toString())

  return (
    <div className="w-full min-h-screen text-white space-y-6">

      {/* HEADER */}
      <div className="border border-cyan-100 p-4">
        <h1 className="text-2xl font-bold">
          SORTIE
        </h1>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* PILOT STATE */}
        <div className="border border-cyan-100 p-4 space-y-2">
          <h2 className="text-cyan-300 font-bold">
            Pilot Stats
          </h2>

          <div>Temper: {pilotStats.temper} //  Base: {pilotStats.temper}</div>
          <div>Nerve: {pilotStats.nerve} // Base: {pilotStats.nerve}</div>
          <div>Reflex: {pilotStats.reflex} // Base: {pilotStats.reflex}</div>
          <div>G-Resist: {pilotStats.gResist} // Base: {pilotStats.gResist}</div>

          <div className="pt-2">
            <div>Mental Stress: {charEngine.getMentalStress(character)}</div>
            <div>Physical Stress: {charEngine.getPhysStress(character)}</div>
          </div>
        </div>

        {/* AIRCRAFT STATE */}
        <div className="border border-cyan-100 p-4 space-y-2">
          <h2 className="text-cyan-300 font-bold">
            Aircraft
          </h2>

          <div>Aircraft ID: {character.aircraft.aircraftId || "None"}</div>

          <div className="text-sm text-cyan-200">
            (Stats, loadout, mods will come here)
          </div>
        </div>

      </div>
    </div>
  );
}

export default SortieView;