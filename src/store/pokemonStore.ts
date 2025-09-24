import { create } from "zustand";

export interface PokemonDetails {
  id: string;
  url: string;
  name: string;
  types: string;
  hp: number;
  attack: number;
  defense: number;
  spAttack: number;
  spDefense: number;
  speed: number;
  [key: string]: string | number | boolean;
}

export interface CustomColumn {
  id: string;
  name: string;
  type: "text" | "number" | "boolean";
  defaultValue: string | number | boolean;
}

interface PokemonStore {
  pokemons: PokemonDetails[];
  customColumns: CustomColumn[];
  isPokemonsSet: boolean;
  isLoading: boolean;
  updatePokemon: (
    id: string,
    updatedPokemon: Partial<PokemonDetails>
  ) => Promise<void>;
  setAllPokemons: (pokemons: PokemonDetails[]) => void;
  setLoading: (loading: boolean) => void;
  loadFromIndexedDB: () => Promise<void>;
  addCustomColumn: (column: CustomColumn) => Promise<void>;
  removeCustomColumn: (columnId: string) => Promise<void>;
  updateCustomColumn: (
    columnId: string,
    updates: Partial<CustomColumn>
  ) => Promise<void>;
}

export const usePokemonStore = create<PokemonStore>((set, get) => ({
  pokemons: [],
  customColumns: [],
  isPokemonsSet: false,
  isLoading: false,

  updatePokemon: async (id, updatedPokemon) => {
    set((state) => ({
      pokemons: state.pokemons.map((pokemon) =>
        pokemon.id === id
          ? ({ ...pokemon, ...updatedPokemon } as PokemonDetails)
          : pokemon
      ),
    }));

    try {
      const { savePokemon } = await import("@/Utils/indexedDb");
      const updatedPokemonData = get().pokemons.find(
        (p: PokemonDetails) => p.id === id
      );
      if (updatedPokemonData) {
        await savePokemon(updatedPokemonData);
      }
    } catch (error) {
      console.error("Error saving Pokemon to IndexedDB:", error);
    }
  },

  setAllPokemons: (pokemons: PokemonDetails[]) => {
    const pokemonsWithIds = pokemons.map(
      (pokemon) =>
        ({
          ...pokemon,
          id: pokemon.id,
        } as PokemonDetails)
    );
    set({ pokemons: pokemonsWithIds, isPokemonsSet: true, isLoading: false });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  loadFromIndexedDB: async () => {
    try {
      set({ isLoading: true });
      const { getAllPokemons, getAllCustomColumns } = await import(
        "@/Utils/indexedDb"
      );
      const [pokemons, customColumns] = await Promise.all([
        getAllPokemons(),
        getAllCustomColumns(),
      ]);

      if (pokemons && pokemons.length > 0) {
        const pokemonsWithIds = pokemons.map((pokemon) => ({
          ...pokemon,
          id: pokemon.id,
        }));
        set({
          pokemons: pokemonsWithIds,
          customColumns: customColumns || [],
          isPokemonsSet: true,
          isLoading: false,
        });
      } else {
        set({
          pokemons: [],
          customColumns: customColumns || [],
          isPokemonsSet: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Error loading from IndexedDB:", error);
      set({ isLoading: false });
    }
  },

  addCustomColumn: async (column) => {
    set((state) => {
      const newColumn = { ...column };
      const updatedPokemons = state.pokemons.map(
        (pokemon) =>
          ({
            ...pokemon,
            [column.id]: column.defaultValue,
          } as PokemonDetails)
      );

      return {
        customColumns: [...state.customColumns, newColumn],
        pokemons: updatedPokemons,
      };
    });

    try {
      const { saveCustomColumn, savePokemons } = await import(
        "@/Utils/indexedDb"
      );
      await saveCustomColumn(column);
      const updatedPokemons = get().pokemons;
      await savePokemons(updatedPokemons);
    } catch (error) {
      console.error("Error saving custom column to IndexedDB:", error);
    }
  },

  removeCustomColumn: async (columnId) => {
    set((state) => {
      const updatedPokemons = state.pokemons.map((pokemon) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [columnId]: _removedColumn, ...rest } = pokemon;
        return rest as PokemonDetails;
      });

      return {
        customColumns: state.customColumns.filter((col) => col.id !== columnId),
        pokemons: updatedPokemons,
      };
    });
    try {
      const { removeCustomColumn, savePokemons } = await import(
        "@/Utils/indexedDb"
      );
      await removeCustomColumn(columnId);
      const updatedPokemons = get().pokemons;
      await savePokemons(updatedPokemons);
    } catch (error) {
      console.error("Error removing custom column from IndexedDB:", error);
    }
  },

  updateCustomColumn: async (columnId, updates) => {
    set((state) => ({
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
