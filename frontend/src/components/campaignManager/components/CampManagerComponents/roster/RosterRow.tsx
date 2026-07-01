import type { CharacterData } from "../../../../characterManager/handlers/characterTypes";

interface Props {
  character: CharacterData;
  selected: boolean;
  onSelect: () => void;
  onDelete?: () => void;
}

function RosterRow({ character, selected, onSelect, onDelete }: Props) {
  const callsign = character.dossier.callsign || "Unknown";

  const fullName = [
    character.dossier.firstName,
    character.dossier.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={`
        flex items-center justify-between
        w-full px-3 py-2 border-l-4 transition
        ${
          selected
            ? "border-cyan-400 bg-cyan-900/30"
            : "border-transparent hover:border-cyan-100 hover:animate-pulse hover:bg-cyan-950/20"
        }
      `}
    >
      {/* Clickable area */}
      <button onClick={onSelect} className="text-left flex-1">
        <div className="font-bold text-cyan-200">
          {callsign}
        </div>

        <div className="text-xs text-gray-400 truncate">
          {fullName || "Unnamed Pilot"}
        </div>
      </button>

      {/* Delete */}
      <button
        onClick={(e) => {
          e.stopPropagation();

          if (
            window.confirm(
              `Remove ${callsign} from campaign?`,
            )
          ) {
            onDelete?.();
          }
        }}
        className="text-xs text-red-400 hover:text-red-200 px-2"
      >
        ✕
      </button>
    </div>
  );
}

export default RosterRow;
