import { useEffect, useState } from "react";
import type { CharacterData } from "./characterTypes";

const STORAGE_KEY = "acesHighCharacters";

export function useCharacterStorage() {
  const [characters, setCharacters] = useState<CharacterData[]>([]);

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    console.log("hydrated:", hydrated);
    console.log("characters:", characters);
  }, [hydrated, characters]);

  // LOAD ONCE
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

  // SAVE ONLY AFTER HYDRATION
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

  return {
    characters,
    addCharacter,
    updateCharacter,
    deleteCharacter,
  };
}
