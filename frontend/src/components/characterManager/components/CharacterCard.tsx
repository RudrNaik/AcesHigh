import type { CharacterData } from "../handlers/characterTypes";

interface Props {
  character: CharacterData;
  onSelect: () => void;
  onDelete: () => void;
}

function CharacterCard({ character, onSelect, onDelete }: Props) {
  return (
    <div
      className="theme-card theme-card-hover theme-card-left-accent hover:animate-pulse flex justify-between"
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
        className="theme-btn theme-btn-danger hover:animate-pulse"
      >
        X
      </button>
    </div>
  );
}

export default CharacterCard;
