import type { CharacterData } from "../handlers/characterTypes";
import { useState } from "react";

interface Props {
  character: CharacterData;
  updateCharacter: (updated: CharacterData) => void;
}

interface FieldProps {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
}

function DossierTab({ character, updateCharacter }: Props) {
  const updateField = (
    field: keyof CharacterData["dossier"],
    value: string,
  ) => {
    updateCharacter({
      ...character,
      dossier: {
        ...character.dossier,
        [field]: value,
      },
    });
  };

  const updateMeta = (
    field: keyof CharacterData["metadata"],
    value: string,
  ) => {
    updateCharacter({
      ...character,
      metadata: {
        ...character.metadata,
        [field]: value,
      },
    });
  };

  const updateQuirk = (field: keyof CharacterData["quirks"], value: string) => {
    updateCharacter({
      ...character,
      quirks: {
        ...character.quirks,
        [field]: value,
      },
    });
  };

  return (
    <div className="">
      <div className=" border-cyan-100 lg:p-4 space-y-4">
        <Section title="Identity">
          <div className="grid grid-cols-3 gap-4">
            <TextField
              label="Callsign"
              value={character.dossier.callsign}
              onChange={(v) => updateField("callsign", v)}
            />

            <TextField
              label="First Name"
              value={character.dossier.firstName}
              onChange={(v) => updateField("firstName", v)}
            />

            <TextField
              label="Last Name"
              value={character.dossier.lastName}
              onChange={(v) => updateField("lastName", v)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Gender"
              value={character.dossier.gender}
              onChange={(v) => updateField("gender", v)}
            />

            <TextField
              label="Pronouns"
              value={character.dossier.pronouns}
              onChange={(v) => updateField("pronouns", v)}
            />
          </div>

          <TextField
            label="Languages"
            value={character.dossier.languages}
            onChange={(v) => updateField("languages", v)}
          />
        </Section>
      </div>

      <div className=" border-cyan-100 lg:p-4 space-y-4">
        <Section title="Quirks">
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="space-y-4">
              <TextField
                label="Name"
                value={character.quirks.quirk1Name}
                onChange={(v) => updateQuirk("quirk1Name", v)}
              />

              <TextArea
                label="Description"
                value={character.quirks.quirk1Desc}
                onChange={(v) => updateQuirk("quirk1Desc", v)}
              />
            </div>
            <div className="space-y-4">
              <TextField
                label="Name"
                value={character.quirks.quirk2Name}
                onChange={(v) => updateQuirk("quirk2Name", v)}
              />

              <TextArea
                label="Description"
                value={character.quirks.quirk2Desc}
                onChange={(v) => updateQuirk("quirk2Desc", v)}
              />
            </div>
            <div className="space-y-4">
              <TextField
                label="Name"
                value={character.quirks.quirk3Name}
                onChange={(v) => updateQuirk("quirk3Name", v)}
              />

              <TextArea
                label="Description"
                value={character.quirks.quirk3Desc}
                onChange={(v) => updateQuirk("quirk3Desc", v)}
              />
            </div>
          </div>
        </Section>
      </div>

      <div className=" border-cyan-100 lg:p-4 space-y-4">
        <Section title="Details">
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Rank"
              value={character.dossier.rank}
              onChange={(v) => updateField("rank", v)}
            />

            <TextField
              label="Squadron"
              value={character.dossier.squadron}
              onChange={(v) => updateField("squadron", v)}
            />

            <TextField
              label="Nationality"
              value={character.dossier.nationality}
              onChange={(v) => updateField("nationality", v)}
            />

            <TextField
              label="Faith"
              value={character.dossier.faith}
              onChange={(v) => updateField("faith", v)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Date of Birth"
              value={character.dossier.dateOfBirth}
              onChange={(v) => updateField("dateOfBirth", v)}
            />

            <TextField
              label="Place of Birth"
              value={character.dossier.placeOfBirth}
              onChange={(v) => updateField("placeOfBirth", v)}
            />
          </div>
        </Section>
      </div>

      <div className=" border-cyan-100 lg:p-4 space-y-4">
        <Section title="Physical Profile">
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Height"
              value={character.dossier.height}
              onChange={(v) => updateField("height", v)}
            />

            <TextField
              label="Weight"
              value={character.dossier.weight}
              onChange={(v) => updateField("weight", v)}
            />

            <TextField
              label="Hair Color"
              value={character.dossier.hairColor}
              onChange={(v) => updateField("hairColor", v)}
            />

            <TextField
              label="Eye Color"
              value={character.dossier.eyeColor}
              onChange={(v) => updateField("eyeColor", v)}
            />
          </div>
        </Section>
      </div>

      <div className=" border-cyan-100 lg:p-4 space-y-4">
        <Section title="Background">
          <label className="text-cyan-400 text-sm">Biography</label>
          <textarea
            value={character.dossier.biography}
            placeholder="Biography"
            onChange={(e) => updateField("biography", e.target.value)}
            className="w-full min-h-50 border-l-2 border-cyan-100 bg-black/20 p-2 focus:border-l-4 transition-all"
          />

          <label className="text-cyan-400 text-sm">Psychological Report</label>
          <textarea
            value={character.dossier.psychologicalReport}
            placeholder="Psychological Report"
            onChange={(e) => updateField("psychologicalReport", e.target.value)}
            className="w-full min-h-50 border-l-2 border-cyan-100 bg-black/20 p-2 focus:border-l-4 transition-all"
          />

          <label className="text-cyan-400 text-sm">Physical Description</label>
          <textarea
            value={character.dossier.description}
            placeholder="Physical Description"
            onChange={(e) => updateField("description", e.target.value)}
            className="w-full min-h-30 border-l-2 border-cyan-100 bg-black/20 p-2 focus:border-l-4 transition-all"
          />

          <label className="text-cyan-400 text-sm">Service Record</label>
          <textarea
            value={character.dossier.serviceRecord}
            placeholder="Service Record"
            onChange={(e) => updateField("serviceRecord", e.target.value)}
            className="w-full min-h-20 border-l-2 border-cyan-100 bg-black/20 p-2 focus:border-l-4 transition-all"
          />
        </Section>
      </div>

      <div className="border-cyan-100 lg:p-4 space-y-2">
        <Section title="Connections and Relations">
          <textarea
            value={character.dossier.relationships}
            onChange={(e) => updateField("relationships", e.target.value)}
            className="w-full min-h-35 border-l-2 border-cyan-100 bg-black/20 p-2 focus:border-l-4 transition-all"
          />
        </Section>
      </div>

      <div className=" border-cyan-100 lg:p-4 space-y-4">
        <Section title="Misc">
          <textarea
            value={character.dossier.notes}
            placeholder="Notes"
            onChange={(e) => updateField("notes", e.target.value)}
            className="w-full min-h-30 focus:border-l-4 transition-all border-l-2 border-cyan-100 bg-black/20 p-2"
          />
        </Section>
      </div>

      <div className=" border-cyan-100 lg:p-4 space-y-4">
        <Section title="Meta-Data">
          <div className="gap-4 max-w-md">
            <TextField
              label="User Name"
              value={character.metadata.userName}
              onChange={(v) => updateMeta("userName", v)}
            />

            <TextField
              label="Generation"
              value={String(character.metadata.generation)}
              onChange={(v) => updateMeta("generation", v)}
            />

            <TextField
              label="Starting RP"
              value={String(character.metadata.startingRP)}
              onChange={(v) => updateMeta("startingRP", v)}
            />
          </div>
        </Section>
      </div>
    </div>
  );
}

function TextField({ label, value, onChange, placeholder }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-cyan-400 text-sm">{label}</label>

      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-b border-cyan-100 bg-black/20 px-2 py-1 focus:border-l-4 transition-all "
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-cyan-400 text-sm">{label}</label>

      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-b min-h-25 border-cyan-100 bg-black/20 px-2 py-1 focus:border-l-4 transition-all "
      />
    </div>
  );
}

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-cyan-100">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center p-2 text-cyan-300 font-bold"
      >
        <span>
          {open ? "▼" : "▶"} {title}
        </span>
      </button>

      {open && <div className="p-4 space-y-2">{children}</div>}
    </div>
  );
}

export default DossierTab;
