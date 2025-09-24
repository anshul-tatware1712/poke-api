import { PokemonDetails, CustomColumn } from "@/store/pokemonStore";
import { UploadedData } from "@/store/uploadedStore";
import { openDB } from "idb";

const DB_NAME = "pokemonDB";
const POKEMONS_STORE = "pokemons";
const UPLOADED_POKEMONS_STORE = "uploadedPokemons";
const UPLOADED_COLUMNS_STORE = "uploadedColumns";
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
      if (!db.objectStoreNames.contains(UPLOADED_POKEMONS_STORE)) {
        db.createObjectStore(UPLOADED_POKEMONS_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(UPLOADED_COLUMNS_STORE)) {
        db.createObjectStore(UPLOADED_COLUMNS_STORE, { keyPath: "id" });
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

export const saveUploadedPokemons = async (pokemons: UploadedData[]) => {
  const db = await initDB();
  const tx = db.transaction(UPLOADED_POKEMONS_STORE, "readwrite");
  const store = tx.objectStore(UPLOADED_POKEMONS_STORE);
  for (const pokemon of pokemons) {
    await store.put(pokemon);
  }
  await tx.done;
};

export const saveUploadedPokemon = async (pokemon: UploadedData) => {
  const db = await initDB();
  const tx = db.transaction(UPLOADED_POKEMONS_STORE, "readwrite");
  const store = tx.objectStore(UPLOADED_POKEMONS_STORE);
  await store.put(pokemon);
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

export const getAllUploadedPokemons = async () => {
  const db = await initDB();
  return db.getAll(UPLOADED_POKEMONS_STORE);
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

export const saveUploadedColumn = async (column: CustomColumn) => {
  const db = await initDB();
  const tx = db.transaction(UPLOADED_COLUMNS_STORE, "readwrite");
  const store = tx.objectStore(UPLOADED_COLUMNS_STORE);
  await store.put(column);
  await tx.done;
};

export const getAllUploadedColumns = async () => {
  const db = await initDB();
  return db.getAll(UPLOADED_COLUMNS_STORE);
};

export const removeUploadedColumn = async (columnId: string) => {
  const db = await initDB();
  const tx = db.transaction(UPLOADED_COLUMNS_STORE, "readwrite");
  const store = tx.objectStore(UPLOADED_COLUMNS_STORE);
  await store.delete(columnId);
  await tx.done;
};
