import type { CharacterData } from "../handlers/characterTypes";
import ResetView from "./CharManagerComponents/ResetComponents/Resets";

type Props = {
  character: CharacterData;
  updateCharacter: (updated: CharacterData) => void;
};

export default function TourView({ character, updateCharacter }: Props) {
  return (
    <div>
      <ResetView character={character} updateCharacter={updateCharacter} />
    </div>
  );
}
