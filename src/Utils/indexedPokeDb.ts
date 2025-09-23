import { PokemonDetails, CustomColumn } from "@/store/pokemonStore";
import { openDB } from "idb";

const DB_NAME = "pokemonDB";
const POKEMONS_STORE = "pokemons";
const CUSTOM_COLUMNS_STORE = "customColumns";

const DB_VERSION = 3;

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(POKEMONS_STORE)) {
        db.createObjectStore(POKEMONS_STORE, { keyPath: "name" });
      }
      if (!db.objectStoreNames.contains(CUSTOM_COLUMNS_STORE)) {
        db.createObjectStore(CUSTOM_COLUMNS_STORE, { keyPath: "id" });
      }
    },
  });
};

export const savePokemons = async (pokemons: PokemonDetails[]) => {
  const db = await initDB();
  const tx = db.transaction(POKEMONS_STORE, "readwrite");
  const store = tx.objectStore(POKEMONS_STORE);

  for (const pokemon of pokemons) {
    await store.put(pokemon);
  }

  await tx.done;
};

export const savePokemon = async (pokemon: PokemonDetails) => {
  const db = await initDB();
  const tx = db.transaction(POKEMONS_STORE, "readwrite");
  const store = tx.objectStore(POKEMONS_STORE);
  await store.put(pokemon);
  await tx.done;
};

export const getAllPokemons = async () => {
  const db = await initDB();
  return db.getAll(POKEMONS_STORE);
};

export const saveCustomColumn = async (column: CustomColumn) => {
  const db = await initDB();
  const tx = db.transaction(CUSTOM_COLUMNS_STORE, "readwrite");
  const store = tx.objectStore(CUSTOM_COLUMNS_STORE);
  await store.put(column);
  await tx.done;
};

export const getAllCustomColumns = async () => {
  const db = await initDB();
  return db.getAll(CUSTOM_COLUMNS_STORE);
};

export const removeCustomColumn = async (columnId: string) => {
  const db = await initDB();
  const tx = db.transaction(CUSTOM_COLUMNS_STORE, "readwrite");
  const store = tx.objectStore(CUSTOM_COLUMNS_STORE);
  await store.delete(columnId);
  await tx.done;
};

