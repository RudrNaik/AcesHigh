import { useEffect, useState } from "react";
import type { CharacterData } from "./characterTypes";

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
    const exists = hasCharacter(character.id);

    if (exists) {
      return {
        success: false,
        duplicate: true,
      };
    }

    addCharacter(character);

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
  };
}
