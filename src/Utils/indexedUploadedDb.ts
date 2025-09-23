import { ColumnMapping, UploadedData } from "@/store/uploadedStore";
import { openDB } from "idb";

const DB_NAME = "uploadedDB";
const DB_VERSION = 1;

const UPLOADED_DATA_STORE = "uploadedData";
const COLUMN_MAPPINGS_STORE = "columnMappings";

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(UPLOADED_DATA_STORE)) {
        db.createObjectStore(UPLOADED_DATA_STORE, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
      if (!db.objectStoreNames.contains(COLUMN_MAPPINGS_STORE)) {
        db.createObjectStore(COLUMN_MAPPINGS_STORE, {
          keyPath: "uploadedColumn",
        });
      }
    },
  });
};
export const saveUploadedData = async (data: UploadedData[]) => {
  const db = await initDB();
  const tx = db.transaction(UPLOADED_DATA_STORE, "readwrite");
  const store = tx.objectStore(UPLOADED_DATA_STORE);

  await store.clear();

  for (const item of data) {
    await store.add(item);
  }

  await tx.done;
};

export const getAllUploadedData = async () => {
  const db = await initDB();
  return db.getAll(UPLOADED_DATA_STORE);
};

export const saveColumnMappings = async (mappings: ColumnMapping[]) => {
  const db = await initDB();
  const tx = db.transaction(COLUMN_MAPPINGS_STORE, "readwrite");
  const store = tx.objectStore(COLUMN_MAPPINGS_STORE);

  await store.clear();

  for (const mapping of mappings) {
    await store.add(mapping);
  }

  await tx.done;
};

export const getAllColumnMappings = async () => {
  const db = await initDB();
  return db.getAll(COLUMN_MAPPINGS_STORE);
};

export const clearUploadedData = async () => {
  const db = await initDB();
  const tx = db.transaction(
    [UPLOADED_DATA_STORE, COLUMN_MAPPINGS_STORE],
    "readwrite"
  );
  await tx.objectStore(UPLOADED_DATA_STORE).clear();
  await tx.objectStore(COLUMN_MAPPINGS_STORE).clear();
  await tx.done;
};
