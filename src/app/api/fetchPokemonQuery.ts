import { useQuery } from "@tanstack/react-query";
import pokemonApi from "./pokemonApi";
import { useState } from "react";
import { PokemonDetails } from "@/store/pokemonStore";

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonProgress {
  fetched: number;
  total: number;
  isComplete: boolean;
  currentBatch: number;
  totalBatches: number;
}
const BATCH_SIZE = 200;
const TOTAL_POKEMON = 1302;
const TOTAL_BATCHES = Math.ceil(TOTAL_POKEMON / BATCH_SIZE);
const DETAIL_BATCH_SIZE = 50;

const fetchPokemonBatches = async (): Promise<Pokemon[]> => {
  const allPokemon: Pokemon[] = [];

  for (let batch = 0; batch < TOTAL_BATCHES; batch++) {
    const offset = batch * BATCH_SIZE;
    const limit = Math.min(BATCH_SIZE, TOTAL_POKEMON - offset);

    const response = await pokemonApi.get("pokemon", {
      params: { limit, offset },
    });
    allPokemon.push(...response.data.results);

    await new Promise((r) => setTimeout(r, 100));
  }

  return allPokemon;
};

const fetchPokemonDetailsBatched = async (
  pokemons: Pokemon[],
  onProgress?: (progress: PokemonProgress) => void
): Promise<PokemonDetails[]> => {
  const details: PokemonDetails[] = [];
  const totalBatches = Math.ceil(pokemons.length / DETAIL_BATCH_SIZE);

  for (let batch = 0; batch < totalBatches; batch++) {
    const batchPokemons = pokemons.slice(
      batch * DETAIL_BATCH_SIZE,
      (batch + 1) * DETAIL_BATCH_SIZE
    );

    const responses = await Promise.allSettled(
      batchPokemons.map((p) => pokemonApi.get(`pokemon/${p.name}`))
    );

    responses.forEach((res) => {
      if (res.status === "fulfilled") {
        const data = res.value.data;
        details.push({
          id: data.id,
          name: data.name,
          types: data.types
            .map((t: { type: { name: string } }) => t.type.name)
            .join(" / "),
          hp: data.stats.find(
            (s: { stat: { name: string } }) => s.stat.name === "hp"
          )?.base_stat,
          attack: data.stats.find(
            (s: { stat: { name: string } }) => s.stat.name === "attack"
          )?.base_stat,
          defense: data.stats.find(
            (s: { stat: { name: string } }) => s.stat.name === "defense"
          )?.base_stat,
          spAttack: data.stats.find(
            (s: { stat: { name: string } }) => s.stat.name === "special-attack"
          )?.base_stat,
          spDefense: data.stats.find(
            (s: { stat: { name: string } }) => s.stat.name === "special-defense"
          )?.base_stat,
          speed: data.stats.find(
            (s: { stat: { name: string } }) => s.stat.name === "speed"
          )?.base_stat,
        });
      }
    });

    onProgress?.({
      fetched: details.length,
      total: pokemons.length,
      isComplete: false,
      currentBatch: batch + 1,
      totalBatches,
    });

    await new Promise((r) => setTimeout(r, 100));
  }

  onProgress?.({
    fetched: details.length,
    total: pokemons.length,
    isComplete: true,
    currentBatch: totalBatches,
    totalBatches,
  });

  return details;
};

export const useFetchAllPokemonWithDetails = () => {
  const [progress, setProgress] = useState<PokemonProgress>({
    fetched: 0,
    total: TOTAL_POKEMON,
    isComplete: false,
    currentBatch: 0,
    totalBatches: 0,
  });

  const query = useQuery<PokemonDetails[], Error>({
    queryKey: ["all-pokemon-details"],
    queryFn: async () => {
      const names = await fetchPokemonBatches();
      const allDetails = await fetchPokemonDetailsBatched(names, (prog) =>
        setProgress(prog)
      );
      return allDetails;
    },
    enabled: false,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return {
    ...query,
    progress,
  };
};
