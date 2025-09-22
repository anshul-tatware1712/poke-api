import { create } from "zustand";

export interface PokemonDetails {
  id: string;
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
  addPokemon: (pokemon: PokemonDetails) => void;
  updatePokemon: (id: string, updatedPokemon: Partial<PokemonDetails>) => void;
  removePokemon: (id: string) => void;
  setAllPokemons: (pokemons: PokemonDetails[]) => void;
  setLoading: (loading: boolean) => void;
  loadFromIndexedDB: () => Promise<void>;
  addCustomColumn: (column: CustomColumn) => void;
  removeCustomColumn: (columnId: string) => void;
  updateCustomColumn: (
    columnId: string,
    updates: Partial<CustomColumn>
  ) => void;
}

export const usePokemonStore = create<PokemonStore>((set) => ({
  pokemons: [],
  customColumns: [],
  isPokemonsSet: false,
  isLoading: false,
  addPokemon: (pokemon) => {
    const pokemonWithId = {
      ...pokemon,
      id: pokemon.id,
    };
    set((state) => ({
      pokemons: [...state.pokemons, pokemonWithId],
    }));
  },

  updatePokemon: (id, updatedPokemon) => {
    set((state) => ({
      pokemons: state.pokemons.map((pokemon) =>
        pokemon.id === id
          ? ({ ...pokemon, ...updatedPokemon } as PokemonDetails)
          : pokemon
      ),
    }));
  },

  removePokemon: (id) => {
    set((state) => ({
      pokemons: state.pokemons.filter((pokemon) => pokemon.id !== id),
    }));
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
      const { getAllPokemons } = await import("@/Utils/indexedDb");
      const pokemons = await getAllPokemons();

      if (pokemons && pokemons.length > 0) {
        const pokemonsWithIds = pokemons.map((pokemon) => ({
          ...pokemon,
          id: pokemon.id,
        }));
        set({
          pokemons: pokemonsWithIds,
          isPokemonsSet: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("Error loading from IndexedDB:", error);
      set({ isLoading: false });
    }
  },

  addCustomColumn: (column) => {
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
  },

  removeCustomColumn: (columnId) => {
    set((state) => {
      const updatedPokemons = state.pokemons.map((pokemon) => {
        const { [columnId]: _, ...rest } = pokemon;
        return rest as PokemonDetails;
      });

      return {
        customColumns: state.customColumns.filter((col) => col.id !== columnId),
        pokemons: updatedPokemons,
      };
    });
  },

  updateCustomColumn: (columnId, updates) => {
    set((state) => ({
      customColumns: state.customColumns.map((col) =>
        col.id === columnId ? { ...col, ...updates } : col
      ),
    }));
  },
}));
