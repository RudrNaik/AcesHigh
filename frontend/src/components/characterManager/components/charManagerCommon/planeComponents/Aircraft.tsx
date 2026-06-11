import type { CharacterData } from "../../../handlers/characterTypes";
import * as planeEngine from "../../../handlers/planeEngine";
import AircraftCard from "./MiniAircraftCard";

function AircraftView({
  character,
  updateCharacter,
}: {
  character: CharacterData;
  updateCharacter: (updated: CharacterData) => void;
}) {
  const cardProps = planeEngine.getAirplaneStatsForCard(character);
  const aircraftState = planeEngine.getAircraftState(character);
  const planeStats = planeEngine.getPlaneStats(character);

  const maxSurv = Number(planeStats.SURV);
  const maxCap = Number(planeStats.CAP);
  const maxEnergy = Number(planeStats.SPEED) + 1;

  return (
    <div className="border border-cyan-100 lg:p-4 p-2 space-y-2">
      <h2 className="text-cyan-300 font-bold">Aircraft</h2>

      <AircraftCard
        {...cardProps}
        aircraftOptions={planeEngine.getAircraftList()}
        onSelectAircraft={(id) =>
          updateCharacter(planeEngine.setAircraft(character, id))
        }
        aircraftState={{
          survivability: aircraftState.survivability,
          maxSurvivability: maxSurv,
          capacity: aircraftState.capacity,
          maxCapacity: maxCap,
          energy: aircraftState.energy,
          maxEnergy: maxEnergy,
          onSpendSurv: () =>
            updateCharacter(planeEngine.spendSurvivability(character)),
          onRecoverSurv: () =>
            updateCharacter(planeEngine.recoverSurvivability(character)),
          onSpendCap: () =>
            updateCharacter(planeEngine.spendCapacity(character)),
          onRecoverCap: () =>
            updateCharacter(planeEngine.recoverCapacity(character)),
          onSpendEnergy: () =>
            updateCharacter(planeEngine.spendEnergy(character)),
          onRecoverEnergy: () =>
            updateCharacter(planeEngine.recoverEnergy(character)),
        }}
      />
    </div>
  );
}

export default AircraftView;