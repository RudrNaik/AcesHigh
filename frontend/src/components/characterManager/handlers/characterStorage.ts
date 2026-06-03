import { useEffect, useState } from "react";
import type { CharacterData } from "./characterTypes";

const STORAGE_KEY = "acesHighCharacters";

export function useCharacterStorage() {
  const [characters, setCharacters] =
    useState<CharacterData[]>([]);

  // Load once
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      setCharacters(JSON.parse(saved));
    } catch (err) {
      console.error("Failed to parse characters", err);
    }
  }, []);

  // Persist on change
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(characters)
    );
  }, [characters]);

  // CREATE
  const addCharacter = (character: CharacterData) => {
    setCharacters(prev => [...prev, character]);
  };

  // UPDATE
  const updateCharacter = (updated: CharacterData) => {
    setCharacters(prev =>
      prev.map(c =>
        c.id === updated.id ? updated : c
      )
    );
  };

  // DELETE
  const deleteCharacter = (id: string) => {
    setCharacters(prev =>
      prev.filter(c => c.id !== id)
    );
  };

  // GET (optional but useful later)
  const getCharacterById = (id: string) =>
    characters.find(c => c.id === id);

  return {
    characters,
    addCharacter,
    updateCharacter,
    deleteCharacter,
    getCharacterById,
  };
}