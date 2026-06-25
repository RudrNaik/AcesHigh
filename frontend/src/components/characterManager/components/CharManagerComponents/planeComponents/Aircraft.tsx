import type { CharacterData } from "../../../handlers/characterTypes";
import * as planeEngine from "../../../handlers/Engines/planeEngine";
import AircraftCard from "./MiniAircraftCard";
import OrdnanceCard from "./MiniOrdnanceCard";
import ModuleManager from "./MiniModCards";
import Masteries from "./MasteryCards";
import UpPackage from "./MiniUpgradeCard";

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

  return (
    <div className="border border-cyan-800 lg:p-4 p-2 space-y-2 bg-black/20">
      <h2 className="text-cyan-300 font-bold">Aircraft</h2>

      <AircraftCard
        {...cardProps}
        aircraftOptions={planeEngine.getUnlockedAircraft(character)}
        onSelectAircraft={(id) =>
          updateCharacter(planeEngine.setAircraft(character, id))
        }
        stats={planeEngine.getPlaneStats(character)}
        aircraftOverrides={character.aircraft}
        aircraftState={{
          survivability: aircraftState.survivability,
          maxSurvivability: maxSurv,
          capacity: aircraftState.capacity,
          maxCapacity: maxCap,
          energy: aircraftState.energy,
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
          onUpdateAircraftStat: (stat, delta) => {
            const current = character.aircraft[stat] ?? 0;

            updateCharacter(
              planeEngine.setAircraftStatOverride(
                character,
                stat,
                current + delta,
              ),
            );
          },
        }}
      />

      <h2 className="text-cyan-300 font-bold">Ordnance</h2>

      <OrdnanceCard
        id={planeEngine.getPlaneOrdnance(character).id}
        name={planeEngine.getPlaneOrdnance(character).name}
        domain={planeEngine.getPlaneOrdnance(character).domain}
        desc={planeEngine.getPlaneOrdnance(character).desc}
        tags={planeEngine.getPlaneOrdnance(character).tags}
        ordnanceOptions={planeEngine.getUnlockedOrdnance(character)}
        onSelectOrdnance={(id) =>
          updateCharacter(planeEngine.setOrdnance(character, id))
        }
      />

      <h2 className="text-cyan-300 font-bold">Masteries</h2>

      <Masteries character={character} />

      <h2 className="text-cyan-300 font-bold">Upgrade Package</h2>
      <UpPackage
        character={character}
        onSelect={(id) =>
          updateCharacter(planeEngine.setUpgrade(character, id))
        }
      />

      <h2 className="text-cyan-300 font-bold">Modules</h2>

      <ModuleManager character={character} updateCharacter={updateCharacter} />
    </div>
  );
}

export default AircraftView;
