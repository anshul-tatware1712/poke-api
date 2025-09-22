import { PokemonDetails } from "@/store/pokemonStore";
import { openDB } from "idb";

const DB_NAME = "pokemonDB";
const STORE_NAME = "pokemons";
const DB_VERSION = 1;

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "name" });
      }
    },
  });
};

export const savePokemons = async (pokemons: PokemonDetails[]) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  for (const pokemon of pokemons) {
    await store.put(pokemon);
  }

  await tx.done;
};

export const getAllPokemons = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

export const clearPokemons = async () => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  await tx.objectStore(STORE_NAME).clear();
  await tx.done;
};
