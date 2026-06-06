import type { CharacterData } from "../handlers/characterTypes"

function SortieView({
  character,
}: {
  character: CharacterData;
}) {
  return (
    <div className="w-full min-h-screen text-white space-y-6">

      {/* HEADER */}
      <div className="border border-cyan-100 p-4">
        <h1 className="text-2xl font-bold">
          SORTIE STATUS
        </h1>

        <p className="text-cyan-300">
          {character.dossier.callsign || "UNKNOWN PILOT"}
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* PILOT STATE */}
        <div className="border border-cyan-100 p-4 space-y-2">
          <h2 className="text-cyan-300 font-bold">
            Pilot Status
          </h2>

          <div>Temper: {character.stats.temper}</div>
          <div>Nerve: {character.stats.nerve}</div>
          <div>Reflex: {character.stats.reflex}</div>
          <div>G-Resist: {character.stats.gResist}</div>

          <div className="pt-2">
            <div>Mental Stress: {character.stress.mental}</div>
            <div>Physical Stress: {character.stress.physical}</div>
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

      {/* FULL WIDTH ACTION AREA */}
      <div className="border border-cyan-100 p-4">
        <h2 className="text-cyan-300 font-bold">
          Combat Log / Turn Feed
        </h2>

        <div className="text-sm text-cyan-200">
          (This will eventually become your maneuver + combat resolution feed)
        </div>
      </div>
    </div>
  );
}

export default SortieView;