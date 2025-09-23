import React from "react";
import { Card } from "../ui/card";
import { Database, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import { PokemonDetails } from "@/store/pokemonStore";
import { PokemonProgress } from "@/app/api/fetchPokemonQuery";
import { useRouter } from "next/navigation";
import { useIndexedDBLoader } from "@/hooks/useIndexedDBLoader";
import { cardConfig } from "./config";
import ApiProcess from "./ApiProcess";

interface PokeDatasetProps {
  isLoading: boolean;
  allPokemon: PokemonDetails[];
  hasStarted: boolean;
  progress: PokemonProgress;
  error: Error | null;
  handleFetchPokemon: () => void;
}
const PokeDataset = ({
  isLoading,
  allPokemon,
  hasStarted,
  progress,
  error,
  handleFetchPokemon,
}: PokeDatasetProps) => {
  const { isPokemonsSet } = useIndexedDBLoader();
  const router = useRouter();
  const handleViewData = () => {
    router.push("/poke-data?source=api");
  };
  const progressPercentage =
    progress.total > 0 ? (progress.fetched / progress.total) * 100 : 0;
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 ">
      <div className="p-8">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-blue-100 rounded-xl mr-4 group-hover:bg-blue-200 transition-colors">
            <Database className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary">
              API Aggregation Engine
            </h2>
            <p className="text-primary">Fetch complete Pokedex dataset</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {cardConfig.map((card, i) => (
            <div key={i} className="flex items-center text-sm text-primary">
              <card.icon {...card.iconProps} />
              <span>{card.title}</span>
            </div>
          ))}
        </div>

        <ApiProcess
          isLoading={isLoading}
          progress={progress}
          allPokemon={allPokemon}
          error={error}
          hasStarted={hasStarted}
          progressPercentage={progressPercentage}
        />

        <Button
          className="w-full"
          variant="outline"
          onClick={
            progress.isComplete || isPokemonsSet
              ? handleViewData
              : handleFetchPokemon
          }
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center">
              Fetching Pokémon... ({progress.fetched}/{progress.total})
            </div>
          ) : progress.isComplete || isPokemonsSet ? (
            <div className="flex items-center font-bold">
              <CheckCircle className="h-4 w-4 mr-2" />
              View Data
            </div>
          ) : (
            "Fetch Full Pokedex Dataset"
          )}
        </Button>
      </div>
    </Card>
  );
};

export default PokeDataset;
