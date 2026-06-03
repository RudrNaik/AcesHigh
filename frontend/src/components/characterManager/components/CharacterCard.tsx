import type { CharacterData } from "../handlers/characterTypes";

interface Props {
  character: CharacterData;
  onSelect: () => void;
}

function CharacterCard({ character, onSelect }: Props) {
  return (
    <button
      onClick={onSelect}
      className="
       bg-black/20
        border
        border-cyan-100
        p-6
        border-l-4
      "
    >
      <h3 className="text-xl font-bold">{character?.dossier.callsign}</h3>
      <p className="text-xs">{character.id}</p>
      <p>
        {character?.dossier.firstName} {character?.dossier.lastName}
      </p>
    </button>
  );
}

export default CharacterCard;
