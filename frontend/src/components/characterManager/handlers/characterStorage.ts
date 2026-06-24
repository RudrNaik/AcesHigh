import { useEffect, useState } from "react";
import type { CharacterData } from "./characterTypes";
import { createDefaultCharacter } from "./characterTemplate";

const STORAGE_KEY = "acesHighCharacters";

export function useCharacterStorage() {
  const [characters, setCharacters] = useState<CharacterData[]>([]);

  const [hydrated, setHydrated] = useState(false);

  // useEffect(() => {
  //   console.log("hydrated:", hydrated);
  //   console.log("characters:", characters);
  // }, [hydrated, characters]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        setCharacters(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to parse characters", err);
      }
    }

    setHydrated(true);
  }, []);

  const pruneCharacter = (id: string) => {
    setCharacters((prev) =>
      prev.map((character) =>
        character.id === id ? sanitizeCharacter(character) : character,
      ),
    );
  };

  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
  }, [characters, hydrated]);

  const addCharacter = (character: CharacterData) => {
    setCharacters((prev) => [...prev, character]);
  };

  const updateCharacter = (updated: CharacterData) => {
    setCharacters((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c)),
    );
  };

  const deleteCharacter = (id: string) => {
    setCharacters((prev) => prev.filter((c) => c.id !== id));
  };

  const hasCharacter = (id: string) => {
    return characters.some((c) => c.id === id);
  };

  const overwriteCharacter = (character: CharacterData) => {
    setCharacters((prev) =>
      prev.map((c) => (c.id === character.id ? character : c)),
    );
  };

  const importCharacter = (character: CharacterData) => {
    const sanitized = sanitizeCharacter(character);

    const exists = hasCharacter(sanitized.id);

    if (exists) {
      return {
        success: false,
        duplicate: true,
      };
    }

    addCharacter(sanitized);

    return {
      success: true,
      duplicate: false,
    };
  };

  return {
    characters,
    addCharacter,
    updateCharacter,
    deleteCharacter,
    importCharacter,
    overwriteCharacter,
    hasCharacter,
    pruneCharacter,
  };
}

export function exportCharacter(character: CharacterData) {
  const fileName = `${getCharacterFileName(character)}.json`;

  const json = JSON.stringify(character, null, 2);

  const blob = new Blob([json], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

function getCharacterFileName(character: CharacterData): string {
  const callsign = character.dossier.callsign?.trim();

  if (callsign) {
    return sanitizeFileName(callsign);
  }

  const first = character.dossier.firstName?.trim() ?? "";
  const last = character.dossier.lastName?.trim() ?? "";

  const fullName = `${first} ${last}`.trim();

  if (fullName) {
    return sanitizeFileName(fullName);
  }

  return "character";
}

function sanitizeFileName(name: string): string {
  return name.replace(/[<>:"/\\|?*]/g, "_");
}

function pruneToShape<T>(data: unknown, shape: T): T {
  if (data === null || data === undefined) {
    return structuredClone(shape);
  }

  // Arrays
  if (Array.isArray(shape)) {
    if (!Array.isArray(data)) {
      return structuredClone(shape);
    }

    // Empty schema arrays (most of your arrays)
    if (shape.length === 0) {
      return data as T;
    }

    return data.map((item) => pruneToShape(item, shape[0])) as T;
  }

  // Primitives
  if (typeof shape !== "object") {
    return typeof data === typeof shape ? (data as T) : structuredClone(shape);
  }

  // Objects
  const result: any = {};

  for (const key of Object.keys(shape as object)) {
    result[key] = pruneToShape((data as any)[key], (shape as any)[key]);
  }

  return result;
}

function sanitizeCharacter(character: unknown): CharacterData {
  const schema = createDefaultCharacter();

  // Prevent generation of a fresh UUID during sanitization
  schema.id = "";

  return pruneToShape(character, schema);
}
