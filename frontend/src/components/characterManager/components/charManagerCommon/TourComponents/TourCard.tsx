import { useState } from "react";
import type { CharacterData, Tour } from "../../../handlers/characterTypes";
import perks from "../../../../../data/PerkList.json";
import * as tourEngine from "../../../handlers/Engines/tourEngine";
import DeploymentCard from "./DeploymentCard";

type Props = {
  tour: Tour;
  tourIndex: number;
  character: CharacterData;
  updateCharacter: (updated: CharacterData) => void;
  defaultExpanded?: boolean;
};

export default function TourCard({
  tour,
  tourIndex,
  character,
  updateCharacter,
  defaultExpanded = false,
}: Props) {
  const hasTour = !!tour.currTourID;

  const [expanded, setExpanded] = useState(hasTour ? defaultExpanded : false);

  if (!hasTour) {
    return (
      <div className="border border-cyan-800 hover:border-cyan-100 transition-all bg-black/20 w-full text-left p-3">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <select
              value=""
              onChange={(e) => {
                updateCharacter(
                  tourEngine.setTourID(character, tourIndex, e.target.value),
                );

                if (e.target.value) {
                  setExpanded(true);
                }
              }}
              className="bg-black/50 border border-cyan-800 hover:border-cyan-100 text-cyan-300 px-2 py-1 font-bold text-lg w-full max-w-md"
            >
              <option value="" className="bg-black">
                -- Select Tour --
              </option>

              {tourEngine.getAllTours().map((t) => (
                <option key={t.tourID} value={t.tourID} className="bg-black">
                  {t.tourName}
                </option>
              ))}
            </select>

            <div className="text-gray-500 mt-2">No Tour Selected</div>
          </div>

          <button
            onClick={() =>
              updateCharacter(tourEngine.removeTour(character, tourIndex))
            }
            className="
              px-2
              py-1
              border
              border-red-900
              text-red-400
              hover:border-red-500
            "
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  const tourData = tourEngine.getTourById(tour.currTourID);

  const completed = tourEngine.getCompletedDeploymentCount(tour);

  const deployments = tourEngine.getDeployments(tour);

  const perk = perks.find((p) => p.id === tourData.tourPerkIDs?.[0]);

  return (
    <div className="border border-cyan-800 hover:border-cyan-100 transition-all bg-black/20 w-full text-left p-3">
      <div className="flex justify-between items-center">
        <div>
          <select
            value={tour.currTourID}
            onChange={(e) =>
              updateCharacter(
                tourEngine.setTourID(character, tourIndex, e.target.value),
              )
            }
            className="bg-black/50 border border-cyan-800 hover:border-cyan-100 text-cyan-300 px-2 py-1 font-bold text-lg w-full max-w-md"
          >
            {tourEngine.getAllTours().map((t) => (
              <option key={t.tourID} value={t.tourID} className="bg-black">
                {t.tourName}
              </option>
            ))}
          </select>

          <div className="text-gray-400 mt-2">
            {completed}/5 Deployments Complete
          </div>
        </div>

        <div className="flex flex-row">
          <button
            onClick={(e) => {
              e.stopPropagation();

              updateCharacter(tourEngine.removeTour(character, tourIndex));
            }}
            className="
              px-2
              py-1
              border
              border-red-900
              text-red-400
              hover:border-red-500
            "
          >
            Remove
          </button>

          <button onClick={() => setExpanded(!expanded)} className="">
            <div className="text-cyan-300 py-2 px-3 border border-cyan-300 mx-4">
              {expanded ? "−" : "+"}
            </div>
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-cyan-900 p-3">
          <div className="text-gray-400">{tourData.tourDesc[0]}</div>

          <div className="text-gray-400">{tourData.tourDesc[1]}</div>

          <div className="text-gray-400 mb-2">{tourData.tourDesc[2]}</div>

          <div className="text-cyan-300 text-xs">Unique Ace Perk:</div>

          <div className="text-gray-400 mb-4 border-cyan-800 border p-2 mt-2">
            <div className="text-sm text-cyan-400">{perk?.name}</div>

            <div className="italic">{perk?.description || "N/A"}</div>
          </div>

          <div className="space-y-2">
            {deployments.map((deployment, depIndex) => (
              <DeploymentCard
                key={depIndex}
                deployment={deployment}
                deploymentIndex={depIndex}
                tourIndex={tourIndex}
                character={character}
                updateCharacter={updateCharacter}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
