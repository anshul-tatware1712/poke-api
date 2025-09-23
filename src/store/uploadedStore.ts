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

  setUploadedData: (data: UploadedData[]) => {
    const dataWithIds = data.map((row) => ({
      ...row,
    }));
    set({ uploadedData: dataWithIds, isDataUploaded: true });
  },

  setColumnMappings: (mappings: ColumnMapping[]) => {
    set({ columnMappings: mappings });
  },

  setCsvUpload: (status: CSVUploadStatus) => {
    set({ csvUpload: status });
  },

  clearUploadedData: () => {
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
}));
