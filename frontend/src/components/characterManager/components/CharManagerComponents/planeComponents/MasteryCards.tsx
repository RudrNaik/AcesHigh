import * as planeEngine from "../../../handlers/Engines/planeEngine";
import type { CharacterData } from "../../../handlers/characterTypes";

function Masteries({ character }: { character: CharacterData }) {
  const currFam = planeEngine.getAircraftMasteries(character);
  const hasMastery = !(
    currFam.tech1 === currFam.tech2 && currFam.tech1 === currFam.tech3
  );
  const tech1 = planeEngine.getTechnique(currFam.tech1);
  const tech2 = planeEngine.getTechnique(currFam.tech2);
  const tech3 = planeEngine.getTechnique(currFam.tech3);

  return (
    <div>
      {hasMastery ? (
        <div className="space-y-2">
          <div className="border border-cyan-400 border-l-4 p-4   space-y-2">
            <div className="flex justify-between items-center">
              <div>
                {tech1?.name} // {tech1?.maneuverId && "MANEUVER"}
              </div>
              <span className="text-xs text-cyan-100/60">TECHNIQUE 1</span>
            </div>

            <p className="text-sm text-cyan-100 whitespace-pre-line">
              {tech1?.description}
            </p>
          </div>
          <div className="border border-cyan-400 border-l-4 p-4 space-y-2">
            <div className="flex justify-between items-center">
              <div>
                {tech2?.name} // {tech2?.maneuverId && "MANEUVER"}
              </div>
              <span className="text-xs text-cyan-100/60">TECHNIQUE 2</span>
            </div>

            <p className="text-sm text-cyan-100 whitespace-pre-line">
              {tech2?.description}
            </p>
          </div>
          <div className="border border-cyan-400 border-l-4 p-4 space-y-2">
            <div className="flex justify-between items-center">
              <div>
                {tech3?.name} // {tech3?.maneuverId && "MANEUVER"}
              </div>
              <span className="text-xs text-cyan-100/60">TECHNIQUE 3</span>
            </div>

            <p className="text-sm text-cyan-100 whitespace-pre-line">
              {tech3?.description}
            </p>
          </div>
        </div>
      ) : (
        <div className="border border-cyan-900 p-2 opacity-60">
          Complete a Mastery deployment to unlock techniques for this family of
          aircraft
        </div>
      )}
    </div>
  );
}

export default Masteries;
