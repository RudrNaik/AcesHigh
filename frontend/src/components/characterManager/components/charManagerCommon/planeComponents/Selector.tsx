import { useState } from "react";

export interface EntitySelectOption {
  id: string;
  name: string;
  subtitle?: string;
}

interface EntitySelectorProps {
  selectedId: string;
  selectedName: string;

  options: EntitySelectOption[];

  onSelect: (id: string) => void;

  placeholder?: string;
}

function EntitySelector({
  selectedId,
  selectedName,
  options,
  onSelect,
  placeholder = "Select Item",
}: EntitySelectorProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown((prev) => !prev)}
        className="
          flex items-center gap-2
          text-2xl font-bold text-cyan-100
          hover:text-cyan-300
        "
      >
        {selectedName || placeholder}

        <span className="text-sm text-cyan-400">
          {showDropdown ? "▲" : "▼"}
        </span>
      </button>

      {showDropdown && (
        <div
          className="
            absolute z-50
            top-full left-0 mt-1
            min-w-sm max-h-64
            overflow-y-auto
            bg-black
            border border-cyan-400
            text-sm
          "
        >
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                onSelect(option.id);
                setShowDropdown(false);
              }}
              className={`
                w-full text-left px-3 py-2
                hover:bg-cyan-950
                flex justify-between items-center
                ${
                  option.id === selectedId
                    ? "bg-cyan-900 text-cyan-100"
                    : "text-cyan-300"
                }
              `}
            >
              <span>{option.name}</span>

              {option.subtitle && (
                <span className="text-xs text-cyan-600">
                  {option.subtitle}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default EntitySelector;