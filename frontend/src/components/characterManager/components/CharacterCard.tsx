import type { CharacterData } from "../handlers/characterTypes";

interface Props {
  character: CharacterData;
  onSelect: () => void;
  onDelete: () => void;
}

function CharacterCard({ character, onSelect, onDelete }: Props) {
  return (
    <div
      className="
    bg-black/20
    border
    border-cyan-100
    hover:border-cyan-400
    transition-all
    duration-100
    p-4
    border-l-4
    flex justify-between
  "
    >
      <div onClick={onSelect} className="cursor-pointer">
        <h3 className="text-xl font-bold">{character?.dossier.callsign}</h3>

        <p className="text-xs">{character.id}</p>

        <p>
          {character?.dossier.firstName} {character?.dossier.lastName}
        </p>
      </div>

      <button
        onClick={() => {
          const confirmed = window.confirm(
            `Delete ${character.dossier.callsign}?`,
          );

          if (!confirmed) return;

          onDelete();
        }}
        className="text-red-400 hover:text-red-300 transition-all"
      >
        X
      </button>
    </div>
  );
}

export default CharacterCard;
