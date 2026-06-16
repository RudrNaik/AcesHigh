import { useState } from "react";

import type {
  CharacterData,
  Deployment,
} from "../../../handlers/characterTypes";

import * as tourEngine from "../../../handlers/Engines/tourEngine";

type Props = {
  deployment: Deployment;
  deploymentIndex: number;
  tourIndex: number;
  character: CharacterData;
  updateCharacter: (updated: CharacterData) => void;
};

export default function DeploymentCard({
  deployment,
  deploymentIndex,
  tourIndex,
  character,
  updateCharacter,
}: Props) {
  const [expanded, setExpanded] = useState(
    !tourEngine.isDeploymentComplete(deployment),
  );

  const depData = tourEngine.getDepById(deployment.type);

  const rewardRules = tourEngine.getDeploymentRewardRules(deployment.type);

  const progress = tourEngine.getDeploymentProgress(deployment);

  const completed = tourEngine.isDeploymentComplete(deployment);

  const perk = tourEngine
    .getAllPerks()
    .find((p) => p.id === deployment.genesis);

  const perkDesc = perk?.advancement;

  const availableGenesis = tourEngine.getAvailableGenesisOptions(
    character,
    tourIndex,
    deploymentIndex,
  );

  const availableMastery = tourEngine.getAvailableMasteryOptions(
    character,
    tourIndex,
    deploymentIndex,
  );

  const updateField = <K extends keyof Deployment>(
    field: K,
    value: Deployment[K],
  ) => {
    const updated = tourEngine.setDeploymentField(
      character,
      tourIndex,
      deploymentIndex,
      field,
      value,
    );

    updateCharacter(updated);
  };

  return (
    <div className="border border-cyan-800 bg-black/10">
      <button
        className="w-full p-2 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex justify-between">
          <div>
            <div className="text-cyan-300 font-bold">{depData.name}</div>

            <div className="text-gray-400">{progress}/7 Complete</div>
          </div>

          <div>{completed ? "✓" : ""}</div>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-cyan-900 p-3 space-y-3">
          <select
            value={deployment.type}
            onChange={(e) => updateField("type", e.target.value)}
            className="w-full bg-black border border-cyan-800 text-cyan-300 p-2"
          >
            {tourEngine.getAllDeps().map((dep) => (
              <option key={dep.id} value={dep.id}>
                {dep.name}
              </option>
            ))}
          </select>

          {rewardRules.genesis && (
            <select
              value={deployment.genesis ?? ""}
              onChange={(e) => updateField("genesis", e.target.value)}
              className="w-full bg-black border border-cyan-800 text-cyan-300 p-2"
            >
              <option value="">Select Genesis Perk</option>

              {availableGenesis.map((perk) => (
                <option key={perk.id} value={perk.id}>
                  {perk.name}
                </option>
              ))}
            </select>
          )}

          {rewardRules.mastery && (
            <select
              value={deployment.mastery ?? ""}
              onChange={(e) => updateField("mastery", e.target.value)}
              className="w-full bg-black border border-cyan-800 text-cyan-300 p-2"
            >
              <option value="">Select Mastery Family</option>

              {availableMastery.map((fam) => (
                <option key={fam.id} value={fam.id}>
                  {fam.name}
                </option>
              ))}
            </select>
          )}

          <div className="flex gap-2">
            <input
              type="checkbox"
              checked={deployment.advancementComplete}
              onChange={(e) =>
                updateField(
                  "advancementComplete" as keyof Deployment,
                  e.target.checked,
                )
              }
              className="appearance-none w-4 h-4 
                        bg-black border 
                        border-cyan-400 
                        cursor-pointer 
                        relative 
                        checked:bg-cyan-400 
                        checked:border-cyan-400 
                        checked:after:content-[''] 
                        checked:after:absolute 
                        checked:after:left-1 
                        checked:after:top-px 
                        checked:after:w-1 
                        checked:after:h-2 
                        checked:after:border-r 
                        checked:after:border-b 
                        checked:after:border-black 
                        checked:after:rotate-45"
            />

            {deployment.genesis && perk ? (
              <div>{perkDesc}</div>
            ) : (
              <div>{depData.description}</div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              ["actTourComplete", "Act in line with your Tour"],
              ["actYourselfComplete", "Act in line with Yourself"],
              ["actSpecComplete", "Act in line with your Specialization"],
              ["defbriefComplete", "Participate in a Post-Mission Debrief"],
              ["maxStressComplete", "Max out a type of Stress"],
              ["survCritComplete", "Survive a Critical State"],
            ].map(([field, label]) => (
              <label key={field} className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={deployment[field as keyof Deployment] as boolean}
                  onChange={(e) =>
                    updateField(field as keyof Deployment, e.target.checked)
                  }
                  className="appearance-none w-4 h-4 
                  bg-black border 
                  border-cyan-400 
                  cursor-pointer 
                  relative 
                  checked:bg-cyan-400 
                  checked:border-cyan-400 
                  checked:after:content-[''] 
                  checked:after:absolute 
                  checked:after:left-1 
                  checked:after:top-px 
                  checked:after:w-1 
                  checked:after:h-2 
                  checked:after:border-r 
                  checked:after:border-b 
                  checked:after:border-black 
                  checked:after:rotate-45 
                  "
                />
                {label}
              </label>
            ))}
          </div>

          <div className="border border-cyan-900 p-2">
            <div className="text-cyan-300 font-bold mb-1">Rewards</div>

            <div className="text-gray-400">Req: {depData.reqMod ?? 0}</div>

            {depData.perkID && (
              <div className="text-gray-400">Perk: {depData.perkID}</div>
            )}

            <div className="text-gray-400">Temp: +{depData.pilotMods.temp}</div>

            <div className="text-gray-400">
              Nerve: +{depData.pilotMods.nerve}
            </div>

            <div className="text-gray-400">
              Reflex: +{depData.pilotMods.reflex}
            </div>

            <div className="text-gray-400">
              G-Resist: +{depData.pilotMods.gResist}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
