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
    duration-50
    p-4
    border-l-4
    flex justify-between
    cursor:pointer
  "
    >
      <div onClick={onSelect} className="cursor-pointer">
        <h3 className="text-xl font-bold">{character?.dossier.callsign}</h3>
        <p>
          {character?.dossier.firstName} {character?.dossier.lastName}
        </p>
        <p>
          {character?.aircraft.aircraftId}
        </p>
        <p className="text-xs">{character.id}</p>
      </div>

      <button
        onClick={() => {
          const confirmed = window.confirm(
            `Delete ${character.dossier.callsign}?`,
          );

          if (!confirmed) return;

          onDelete();
        }}
        className="hover:animate-pulse text-red-300 hover:text-red-500 transition-all border-red-300 border px-2 py-1 hover:border-red-500"
      >
        X
      </button>
    </div>
  );
}

export default CharacterCard;
