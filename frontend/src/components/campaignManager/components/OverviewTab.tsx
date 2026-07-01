import { useState } from "react";

import type { CampaignData } from "../handlers/campaignTypes";

interface Props {
  campaign: CampaignData;
  onUpdate: (campaign: CampaignData) => void;
}

function OverviewTab({ campaign, onUpdate }: Props) {
  const updateField = <K extends keyof CampaignData>(
    field: K,
    value: CampaignData[K],
  ) => {
    onUpdate({
      ...campaign,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="border border-cyan-100 p-4 bg-black/20">
        <h1 className="text-2xl font-bold">CAMPAIGN OVERVIEW</h1>
      </div>

      <Section title="General">
        <div className="grid md:grid-cols-2 gap-4">
          <TextField
            label="Campaign Name"
            value={campaign.name}
            onChange={(v) => updateField("name", v)}
          />

          <TextField
            label="Created"
            value={new Date(campaign.createdAt).toLocaleDateString()}
            onChange={() => {}}
            readOnly
          />
        </div>

        <TextArea
          label="Description"
          value={campaign.description}
          onChange={(v) => updateField("description", v)}
        />
      </Section>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  readOnly = false,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-cyan-400 text-sm">{label}</label>

      <input
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-b border-cyan-100 bg-black/20 px-2 py-1 focus:border-l-4 transition-all"
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
    <div className="border border-cyan-800">
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

export default OverviewTab;
