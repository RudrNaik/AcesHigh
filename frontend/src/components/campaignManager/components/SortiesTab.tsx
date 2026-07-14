import { useState } from "react";

import type {
  CampaignData,
  SortieData,
} from "../handlers/campaignTypes";

interface Props {
  campaign: CampaignData;
  onUpdate: (campaign: CampaignData) => void;
}

function SortiesTab({
  campaign,
  onUpdate,
}: Props) {
  const [selectedSortieId, setSelectedSortieId] =
    useState<string | null>(
      campaign.activeSortieId ??
        campaign.sorties[0]?.id ??
        null
    );


  const selectedSortie =
    campaign.sorties.find(
      (sortie) =>
        sortie.id === selectedSortieId
    );


  function createSortie() {
    const newSortie: SortieData = {
      id: crypto.randomUUID(),

      name: `Sortie ${
        campaign.sorties.length + 1
      }`,

      description:
        "New sortie briefing.",

      status: "planning",

      pilots: [],

      enemies: [],

      objectives: [],

      turn: 0,

      phase: "briefing",
    };


    onUpdate({
      ...campaign,

      activeSortieId:
        newSortie.id,

      sorties: [
        ...campaign.sorties,
        newSortie,
      ],
    });


    setSelectedSortieId(newSortie.id);
  }


  return (
    <div className="flex min-h-[70vh] border border-cyan-800 bg-black/20">

      {/* Sortie List */}

      <div className="w-72 border-r border-cyan-800">

        <div className="flex items-center justify-between border-b border-cyan-800 p-3">

          <h2 className="text-xl font-bold">
            Sorties
          </h2>

          <button
            onClick={createSortie}
            className="border border-cyan-100 px-2 py-1 text-sm hover:bg-cyan-900/40"
          >
            + New
          </button>

        </div>


        <div>
          {campaign.sorties.length === 0 && (
            <p className="p-3 text-sm text-gray-400">
              No sorties created.
            </p>
          )}


          {campaign.sorties.map(
            (sortie) => (
              <button
                key={sortie.id}
                onClick={() => {
                  setSelectedSortieId(
                    sortie.id
                  );

                  onUpdate({
                    ...campaign,

                    activeSortieId:
                      sortie.id,
                  });
                }}

                className={`w-full border-b border-cyan-900 p-3 text-left ${
                  selectedSortieId === sortie.id
                    ? "bg-cyan-900/30"
                    : "hover:bg-cyan-900/20"
                }`}
              >

                <div className="font-semibold">
                  {sortie.name}
                </div>

                <div className="text-sm text-gray-400 capitalize">
                  {sortie.status}
                </div>

              </button>
            )
          )}
        </div>

      </div>


      {/* Active Sortie */}

      <div className="flex-1 p-5">

        {!selectedSortie ? (

          <div className="flex h-full items-center justify-center text-gray-400">
            Select a sortie or create a new one.
          </div>

        ) : (

          <div className="space-y-5">


            {/* Header */}

            <div>

              <h2 className="text-3xl font-bold">
                {selectedSortie.name}
              </h2>


              <p className="text-gray-400">
                {selectedSortie.description}
              </p>


              <p className="mt-2 text-sm uppercase text-cyan-400">
                Phase: {selectedSortie.phase}
              </p>

            </div>



            {/* Mission Info */}

            <section className="border border-cyan-800 p-4">

              <h3 className="mb-3 text-lg font-bold">
                Mission Status
              </h3>


              <div className="grid grid-cols-2 gap-3 text-sm">

                <div>
                  Status:
                  <span className="ml-2 text-cyan-300 capitalize">
                    {selectedSortie.status}
                  </span>
                </div>


                <div>
                  Turn:
                  <span className="ml-2 text-cyan-300">
                    {selectedSortie.turn}
                  </span>
                </div>


                <div>
                  Pilots:
                  <span className="ml-2 text-cyan-300">
                    {
                      selectedSortie.pilots.length
                    }
                  </span>
                </div>


                <div>
                  Enemies:
                  <span className="ml-2 text-cyan-300">
                    {
                      selectedSortie.enemies.length
                    }
                  </span>
                </div>

              </div>

            </section>



            {/* Players */}

            <section className="border border-cyan-800 p-4">

              <div className="flex justify-between">

                <h3 className="text-lg font-bold">
                  Pilots
                </h3>


                <button className="border border-cyan-100 px-2 py-1 text-sm">
                  + Assign Pilot
                </button>

              </div>


              <div className="mt-4 border border-dashed border-cyan-900 p-8 text-center text-gray-400">

                No pilots assigned.

              </div>

            </section>



            {/* Enemies */}

            <section className="border border-cyan-800 p-4">

              <div className="flex justify-between">

                <h3 className="text-lg font-bold">
                  Enemy Forces
                </h3>


                <button className="border border-cyan-100 px-2 py-1 text-sm">
                  + Deploy Enemy
                </button>

              </div>


              <div className="mt-4 border border-dashed border-cyan-900 p-8 text-center text-gray-400">

                No enemies deployed.

              </div>

            </section>


          </div>

        )}

      </div>

    </div>
  );
}

export default SortiesTab;