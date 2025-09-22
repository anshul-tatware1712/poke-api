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
}

interface PokemonStore {
  pokemons: PokemonDetails[];
  isPokemonsSet: boolean;
  addPokemon: (pokemon: PokemonDetails) => void;
  updatePokemon: (id: string, updatedPokemon: Partial<PokemonDetails>) => void;
  removePokemon: (id: string) => void;
  setAllPokemons: (pokemons: PokemonDetails[]) => void;
}

export const usePokemonStore = create<PokemonStore>((set) => ({
  pokemons: [],
  isPokemonsSet: false,
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
        pokemon.id === id ? { ...pokemon, ...updatedPokemon } : pokemon
      ),
    }));
  },

  removePokemon: (id) => {
    set((state) => ({
      pokemons: state.pokemons.filter((pokemon) => pokemon.id !== id),
    }));
  },

  setAllPokemons: (pokemons: PokemonDetails[]) => {
    const pokemonsWithIds = pokemons.map((pokemon) => ({
      ...pokemon,
      id: pokemon.id,
    }));
    set({ pokemons: pokemonsWithIds });
  },
}));
