import { useEffect, useState } from "react";
import type { CharacterData } from "../handlers/characterTypes";
import * as characterEngine from "../handlers/Engines/characterEngine";
import * as storage from "../handlers/characterStorage";

function DebugView({
  character,
  updateCharacter,
}: {
  character: CharacterData;
  updateCharacter: (c: CharacterData) => void;
}) {
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setJsonText(JSON.stringify(character, null, 2));
  }, [character]);

  function handleSave() {
    try {
      const parsed = JSON.parse(jsonText) as CharacterData;

      const sanitized = characterEngine.sanitizeCharacter(parsed);

      updateCharacter(sanitized);

      setError("");
      alert("Character updated successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON");
    }
  }

  function handleReset() {
    setJsonText(JSON.stringify(character, null, 2));
    setError("");
  }

  function handleCopy() {
    navigator.clipboard.writeText(jsonText);
  }

  return (
    <div className="space-y-4">
      <section className="border border-cyan-800 bg-black/20 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleCopy}
            className="border border-cyan-100 px-3 py-2 text-xs text-cyan-100 transition hover:bg-cyan-100 hover:text-black"
          >
            Copy JSON
          </button>

          <button
            onClick={() => storage.exportCharacter(character)}
            className="border border-cyan-100 px-3 py-2 text-xs text-cyan-100 transition hover:bg-cyan-100 hover:text-black"
          >
            Export Character
          </button>

          <button
            onClick={() => setEditMode((v) => !v)}
            className="border border-yellow-500 px-3 py-2 text-xs text-yellow-500 transition hover:bg-yellow-500 hover:text-black"
          >
            {editMode ? "Disable Edit Mode" : "Enable Edit Mode"}
          </button>

          {editMode && (
            <>
              <button
                onClick={handleSave}
                className="border border-green-500 px-3 py-2 text-xs text-green-500 transition hover:bg-green-500 hover:text-black"
              >
                Save Changes
              </button>

              <button
                onClick={handleReset}
                className="border border-red-500 px-3 py-2 text-xs text-red-500 transition hover:bg-red-500 hover:text-black"
              >
                Reset
              </button>
            </>
          )}
        </div>

        <p className="mt-3 text-xs text-cyan-200">
          Enable Edit Mode to directly modify this character's JSON Data.
        </p>
        <p className="text-xs text-red-200">
          <span className="font-bold">
            [!] DO NOT DO THIS UNLESS SOMETHING IS BROKEN OR A GM NOTIFIES YOU
          </span>
        </p>
      </section>

      {error && (
        <section className="border border-red-800 bg-red-950/30 p-3 text-red-300 text-sm">
          {error}
        </section>
      )}

      <textarea
        value={jsonText}
        readOnly={!editMode}
        onChange={(e) => setJsonText(e.target.value)}
        spellCheck={false}
        className="
          w-full
          h-175
          resize-y
          border
          border-cyan-800
          bg-black/20
          p-3
           
          text-xs
        "
      />
    </div>
  );
}

export default DebugView;
