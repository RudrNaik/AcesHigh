import type { CharacterData } from "../handlers/characterTypes";

interface Props {
  character: CharacterData;
  updateCharacter: (
    updated: CharacterData
  ) => void;
}

function DossierTab({
  character,
  updateCharacter,
}: Props) {
  return (
    <div className="grid gap-4">

      <input
        value={
          character.dossier.firstName
        }
        placeholder="First Name"
      />

      <input
        value={
          character.dossier.callsign
        }
        placeholder="Callsign"
      />

      <input
        value={
          character.dossier.lastName
        }
        placeholder="Last Name"
      />
    </div>
  );
}

export default DossierTab;