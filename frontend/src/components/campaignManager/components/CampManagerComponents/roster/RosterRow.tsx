import type { CharacterData } from "../../../../characterManager/handlers/characterTypes";

interface Props {
  character: CharacterData;

  selected: boolean;

  assigned?: boolean;

  onSelect: () => void;

  onToggleAssignment?: () => void;

  onDelete?: () => void;
}

function RosterRow({
  character,
  selected,
  assigned = false,
  onSelect,
  onToggleAssignment,
  onDelete,
}: Props) {
  const callsign =
    character.dossier.callsign || "Unknown";

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
        w-full border-l-4 px-3 py-2 transition
        ${
          selected
            ? "border-cyan-400 bg-cyan-900/30"
            : "border-transparent hover:border-cyan-100 hover:bg-cyan-950/20"
        }
      `}
    >
      {/* Character Info */}

      <button
        onClick={onSelect}
        className="flex-1 text-left"
      >
        <div className="font-bold text-cyan-200">
          {callsign}
        </div>

        <div className="truncate text-xs text-gray-400">
          {fullName || "Unnamed Pilot"}
        </div>
      </button>

      {/* Actions */}

      <div className="ml-3 flex items-center gap-2">
        {onToggleAssignment && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleAssignment();
            }}
            className={`min-w-20 border px-2 py-1 text-xs transition ${
              assigned
                ? "border-cyan-400 bg-cyan-900/40 text-cyan-200 hover:bg-cyan-800/40"
                : "border-cyan-800 text-cyan-300 hover:bg-cyan-900/20"
            }`}
          >
            {assigned
              ? "Assigned"
              : "Assign"}
          </button>
        )}

        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();

              if (
                window.confirm(
                  `Remove ${callsign} from campaign?`
                )
              ) {
                onDelete();
              }
            }}
            className="px-2 text-xs text-red-400 transition hover:text-red-200"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default RosterRow;