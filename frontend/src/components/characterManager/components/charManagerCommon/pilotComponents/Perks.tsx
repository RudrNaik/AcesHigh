import { useMemo } from "react";
import type { CharacterData } from "../../../handlers/characterTypes";

import * as characterEngine from "../../../handlers/Engines/characterEngine";
import * as tourEngine from "../../../handlers/Engines/tourEngine";

function PerksView({
  character,
  updateCharacter,
}: {
  character: CharacterData;
  updateCharacter: (updated: CharacterData) => void;
}) {
  const allPerks = useMemo(() => tourEngine.getAllPerks(), []);

  const unlockedGenesisPerks = useMemo(
    () => tourEngine.getUnlockedGenesisPerks(character),
    [character],
  );

  const unlockedAcePerks = useMemo(
    () => tourEngine.getCharacterTourPerks(character),
    [character],
  );

  const genesisPerks = useMemo(
    () =>
      allPerks.filter((perk) =>
        unlockedGenesisPerks.includes(perk.id),
      ),
    [allPerks, unlockedGenesisPerks],
  );

  const acePerks = useMemo(
    () =>
      allPerks.filter((perk) =>
        unlockedAcePerks.includes(perk.id),
      ),
    [allPerks, unlockedAcePerks],
  );

  function getGenesisOptions(slot: number) {
    const current = character.baseperks[slot];

    return genesisPerks.filter(
      (perk) =>
        perk.id === current ||
        !character.baseperks.includes(perk.id),
    );
  }

  function getAceOptions(slot: number) {
    const current = character.aceperks[slot];

    return acePerks.filter(
      (perk) =>
        perk.id === current ||
        !character.aceperks.includes(perk.id),
    );
  }

  function updateGenesisSlot(slot: number, perkID: string) {
    updateCharacter(
      characterEngine.setBasePerk(
        character,
        slot,
        perkID,
      ),
    );
  }

  function updateAceSlot(slot: number, perkID: string) {
    updateCharacter(
      characterEngine.setAcePerk(
        character,
        slot,
        perkID,
      ),
    );
  }

  return (
    <div className="flex flex-row gap-6 border border-cyan-100 lg:p-4 p-2">
      {/* Genesis */}
      <section className="flex-1">
        <h2 className="text-lg font-bold text-cyan-300 mb-2">
          Genesis Perks
        </h2>

        <div className="border border-cyan-100 lg:p-4 p-2 space-y-3">
          {Array.from({ length: 10 }).map((_, slot) => {
            const selectedID = character.baseperks[slot] ?? "";

            const selectedPerk =
              genesisPerks.find((p) => p.id === selectedID) ??
              null;

            return (
              <div
                key={slot}
                className="border border-cyan-800 p-2"
              >
                <div className="text-xs text-cyan-400 mb-1">
                  Slot {slot + 1}
                </div>

                <select
                  value={selectedID}
                  onChange={(e) =>
                    updateGenesisSlot(
                      slot,
                      e.target.value,
                    )
                  }
                  className="w-full bg-black border border-cyan-800 p-2"
                >
                  <option value="">Empty Slot</option>

                  {getGenesisOptions(slot).map((perk) => (
                    <option
                      key={perk.id}
                      value={perk.id}
                    >
                      {perk.name}
                    </option>
                  ))}
                </select>

                {selectedPerk && (
                  <div className="text-xs opacity-70 mt-2">
                    {selectedPerk.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Ace */}
      <section className="flex-1">
        <h2 className="text-lg font-bold text-cyan-300 mb-2">
          Ace Perks
        </h2>

        <div className="border border-cyan-100 lg:p-4 p-2 space-y-3">
          {Array.from({ length: 10 }).map((_, slot) => {
            const selectedID = character.aceperks[slot] ?? "";

            const selectedPerk =
              acePerks.find((p) => p.id === selectedID) ??
              null;

            return (
              <div
                key={slot}
                className="border border-cyan-800 p-2"
              >
                <div className="text-xs text-cyan-400 mb-1">
                  Slot {slot + 1}
                </div>

                <select
                  value={selectedID}
                  onChange={(e) =>
                    updateAceSlot(
                      slot,
                      e.target.value,
                    )
                  }
                  className="w-full bg-black border border-cyan-800 p-2"
                >
                  <option value="">Empty Slot</option>

                  {getAceOptions(slot).map((perk) => (
                    <option
                      key={perk.id}
                      value={perk.id}
                    >
                      {perk.name}
                    </option>
                  ))}
                </select>

                {selectedPerk && (
                  <div className="text-xs opacity-70 mt-2">
                    {selectedPerk.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default PerksView;