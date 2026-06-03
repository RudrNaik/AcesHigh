import type { CharacterData } from "../handlers/characterTypes";

interface Props {
  character: CharacterData;
  onSelect: () => void;
}

function CharacterCard({
  character,
  onSelect,
}: Props) {
  return (
    <button
      onClick={onSelect}
      className="
      w-full
      rounded-xl
      border
      border-white/20
      bg-black/30
      p-4
      text-left
      hover:bg-black/50
      "
    >
      <h3 className="text-xl font-bold">
        {character.dossier.callsign}
      </h3>

      <p>
        {character.dossier.firstName}
        {" "}
        {character.dossier.lastName}
      </p>
    </button>
  );
}

export default CharacterCard;