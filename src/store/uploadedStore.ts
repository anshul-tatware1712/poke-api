import { create } from "zustand";
import { CustomColumn } from "./pokemonStore";

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
  customColumns: CustomColumn[];
  pokemons: UploadedData[];
  isDataUploaded: boolean;
  csvUpload: CSVUploadStatus;
  setAllUploadedPokemons: (data: UploadedData[]) => void;
  setColumnMappings: (mappings: ColumnMapping[]) => void;
  updateUploadedPokemon: (
    id: string,
    updatedPokemon: Partial<UploadedData>
  ) => Promise<void>;
  setCsvUpload: (status: CSVUploadStatus) => void;
  clearUploadedData: () => void;
  getMappedData: () => UploadedData[];
  addCustomColumn: (column: CustomColumn) => Promise<void>;
  removeCustomColumn: (columnId: string) => Promise<void>;
  updateCustomColumn: (
    columnId: string,
    updates: Partial<CustomColumn>
  ) => Promise<void>;
}

export const useUploadedStore = create<UploadedStore>((set, get) => ({
  uploadedData: [],
  columnMappings: [],
  customColumns: [],
  pokemons: [],
  isDataUploaded: false,
  csvUpload: {
    isUploading: false,
    error: null,
    data: null,
    fileName: null,
  },

  setAllUploadedPokemons: (pokemons: UploadedData[]) => {
    const pokemonsWithIds = pokemons.map(
      (pokemon) =>
        ({
          ...pokemon,
          id: pokemon.id,
        } as UploadedData)
    );
    set({ uploadedData: pokemonsWithIds, isDataUploaded: true });
  },

  updateUploadedPokemon: async (id, updatedPokemon) => {
    set((state) => ({
      uploadedData: state.uploadedData.map((pokemon) =>
        pokemon.id === id
          ? ({ ...pokemon, ...updatedPokemon } as UploadedData)
          : pokemon
      ),
    }));

    try {
      const { saveUploadedPokemon } = await import("@/Utils/indexedDb");
      const updatedPokemonData = get().uploadedData.find(
        (p: UploadedData) => p.id === id
      );
      if (updatedPokemonData) {
        await saveUploadedPokemon(updatedPokemonData);
      }
    } catch (error) {
      console.error("Error saving Uploaded Pokemon to IndexedDB:", error);
    }
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

  addCustomColumn: async (column) => {
    set((state) => {
      const newColumn = { ...column };
      const updatedPokemons = state.uploadedData.map(
        (pokemon) =>
          ({
            ...pokemon,
            [column.id]: column.defaultValue,
          } as UploadedData)
      );

      return {
        ...state,
        customColumns: [...state.customColumns, newColumn],
        pokemons: updatedPokemons,
      };
    });

    try {
      const { saveCustomColumn, saveUploadedPokemons } = await import(
        "@/Utils/indexedDb"
      );
      await saveCustomColumn(column);
      const updatedPokemons = get().uploadedData;
      await saveUploadedPokemons(updatedPokemons);
    } catch (error) {
      console.error("Error saving custom column to IndexedDB:", error);
    }
  },

  removeCustomColumn: async (columnId) => {
    set((state) => {
      const updatedPokemons = state.uploadedData.map((pokemon) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [columnId]: _removedColumn, ...rest } = pokemon;
        return rest as UploadedData;
      });

      return {
        ...state,
        customColumns: state.customColumns.filter((col) => col.id !== columnId),
        pokemons: updatedPokemons,
      };
    });
    try {
      const { removeCustomColumn, saveUploadedPokemons } = await import(
        "@/Utils/indexedDb"
      );
      await removeCustomColumn(columnId);
      const updatedPokemons = get().uploadedData;
      await saveUploadedPokemons(updatedPokemons);
    } catch (error) {
      console.error("Error removing custom column from IndexedDB:", error);
    }
  },

  updateCustomColumn: async (columnId, updates) => {
    set((state) => ({
      ...state,
      customColumns: state.customColumns.map((col) =>
        col.id === columnId ? { ...col, ...updates } : col
      ),
    }));

    try {
      const { saveCustomColumn } = await import("@/Utils/indexedDb");
      const updatedColumn = get().customColumns.find(
        (col: CustomColumn) => col.id === columnId
      );
      if (updatedColumn) {
        await saveCustomColumn(updatedColumn);
      }
    } catch (error) {
      console.error("Error updating custom column in IndexedDB:", error);
    }
  },
}));
