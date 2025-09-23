import { create } from "zustand";

export interface UploadedData {
  [key: string]: string | number | boolean;
}

export interface ColumnMapping {
  uploadedColumn: string;
  pokemonField: string;
  dataType: "text" | "number" | "boolean";
}

export interface CSVUploadStatus {
  isUploading: boolean;
  error: string | null;
  data: UploadedData[] | null;
  fileName: string | null;
}

interface UploadedStore {
  uploadedData: UploadedData[];
  columnMappings: ColumnMapping[];
  isDataUploaded: boolean;
  csvUpload: CSVUploadStatus;
  setUploadedData: (data: UploadedData[]) => void;
  setColumnMappings: (mappings: ColumnMapping[]) => void;
  setCsvUpload: (status: CSVUploadStatus) => void;
  clearUploadedData: () => void;
  getMappedData: () => UploadedData[];
  loadFromIndexedDB: () => Promise<void>;
  saveToIndexedDB: () => Promise<void>;
}

export const useUploadedStore = create<UploadedStore>((set, get) => ({
  uploadedData: [],
  columnMappings: [],
  isDataUploaded: false,
  csvUpload: {
    isUploading: false,
    error: null,
    data: null,
    fileName: null,
  },

  setUploadedData: async (data: UploadedData[]) => {
    const dataWithIds = data.map((row, index) => ({
      ...row,
      id: row.id || `uploaded_${index}`,
    }));
    set({ uploadedData: dataWithIds, isDataUploaded: true });

    // Save to IndexedDB
    try {
      const { saveUploadedData } = await import("@/Utils/indexedUploadedDb");
      await saveUploadedData(dataWithIds);
    } catch (error) {
      console.error("Error saving uploaded data to IndexedDB:", error);
    }
  },

  setColumnMappings: async (mappings: ColumnMapping[]) => {
    set({ columnMappings: mappings });

    // Save to IndexedDB
    try {
      const { saveColumnMappings } = await import("@/Utils/indexedUploadedDb");
      await saveColumnMappings(mappings);
    } catch (error) {
      console.error("Error saving column mappings to IndexedDB:", error);
    }
  },

  setCsvUpload: (status: CSVUploadStatus) => {
    set({ csvUpload: status });
  },

  clearUploadedData: async () => {
    set({
      uploadedData: [],
      columnMappings: [],
      isDataUploaded: false,
      csvUpload: {
        isUploading: false,
        error: null,
        data: null,
        fileName: null,
      },
    });

    // Clear from IndexedDB
    try {
      const { clearUploadedData } = await import("@/Utils/indexedUploadedDb");
      await clearUploadedData();
    } catch (error) {
      console.error("Error clearing uploaded data from IndexedDB:", error);
    }
  },

  getMappedData: () => {
    const { uploadedData, columnMappings } = get();

    if (columnMappings.length === 0) {
      return uploadedData;
    }

    return uploadedData.map((row) => {
      const mappedRow: UploadedData = { id: row.id };

      columnMappings.forEach((mapping) => {
        const value = row[mapping.uploadedColumn];
        if (value !== undefined) {
          switch (mapping.dataType) {
            case "number":
              mappedRow[mapping.pokemonField] =
                typeof value === "number"
                  ? value
                  : parseFloat(String(value)) || 0;
              break;
            case "boolean":
              mappedRow[mapping.pokemonField] =
                value === "true" ||
                value === true ||
                value === "1" ||
                value === 1;
              break;
            default:
              mappedRow[mapping.pokemonField] = String(value);
          }
        }
      });

      return mappedRow;
    });
  },

  loadFromIndexedDB: async () => {
    try {
      const { getAllUploadedData, getAllColumnMappings } = await import(
        "@/Utils/indexedUploadedDb"
      );
      const [uploadedData, columnMappings] = await Promise.all([
        getAllUploadedData(),
        getAllColumnMappings(),
      ]);

      if (uploadedData && uploadedData.length > 0) {
        set({
          uploadedData,
          columnMappings: columnMappings || [],
          isDataUploaded: true,
        });
      } else {
        set({
          uploadedData: [],
          columnMappings: columnMappings || [],
          isDataUploaded: false,
        });
      }
    } catch (error) {
      console.error("Error loading uploaded data from IndexedDB:", error);
    }
  },

  saveToIndexedDB: async () => {
    try {
      const { saveUploadedData, saveColumnMappings } = await import(
        "@/Utils/indexedUploadedDb"
      );
      const { uploadedData, columnMappings } = get();

      if (uploadedData.length > 0) {
        await saveUploadedData(uploadedData);
      }
      if (columnMappings.length > 0) {
        await saveColumnMappings(columnMappings);
      }
    } catch (error) {
      console.error("Error saving uploaded data to IndexedDB:", error);
    }
  },
}));
