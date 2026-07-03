import { useEffect, useState } from "react";

import type { CampaignData } from "../handlers/campaignTypes";

import * as storage from "../handlers/campaignStorage";

function DebugView({
  campaign,
  onUpdate,
}: {
  campaign: CampaignData;
  onUpdate: (c: CampaignData) => void;
}) {
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setJsonText(JSON.stringify(campaign, null, 2));
  }, [campaign]);

  function handleSave() {
    try {
      const parsed = JSON.parse(jsonText) as CampaignData;

      onUpdate(parsed);

      setError("");
      alert("Campaign updated successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON");
    }
  }

  function handleReset() {
    setJsonText(JSON.stringify(campaign, null, 2));
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
            onClick={() => storage.exportCampaign(campaign)}
            className="border border-cyan-100 px-3 py-2 text-xs text-cyan-100 transition hover:bg-cyan-100 hover:text-black"
          >
            Export Campaign
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
          Enable Edit Mode to directly modify this campaign's JSON data.
        </p>

        <p className="text-xs text-red-200">
          <span className="font-bold">
            [!] DO NOT EDIT THIS UNLESS YOU KNOW WHAT YOU ARE DOING
          </span>
        </p>
      </section>

      {error && (
        <section className="border border-red-800 bg-red-950/30 p-3 text-sm text-red-300">
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
