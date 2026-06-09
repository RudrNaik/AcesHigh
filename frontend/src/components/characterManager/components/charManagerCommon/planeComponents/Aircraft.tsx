import type { CharacterData } from "../../../handlers/characterTypes";
//import { useEffect, useState } from "react";
import * as planeEngine from "../../../handlers/planeEngine";


function AircraftView({
  character,
  //updateCharacter,
}: {
  character: CharacterData;
  updateCharacter: (updated: CharacterData) => void;
}) {
  return (
    <div className="border border-cyan-100 lg:p-4 p-2 space-y-2">
      <h2 className="text-cyan-300 font-bold">Aircraft</h2>

      <div>Aircraft ID: { planeEngine.getPlane(character) || "None"}</div>

      <div className="text-sm text-cyan-200">
        (Stats, loadout, mods will come here)
      </div>
    </div>
  );
}

export default AircraftView
