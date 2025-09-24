import React from "react";
import { Card } from "../ui/card";
import { Database, Zap, BarChart3, CheckCircle } from "lucide-react";
import { Download } from "lucide-react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { usePokemonStore } from "@/store/pokemonStore";
import { PokemonProgress } from "@/app/api/fetchPokemonQuery";
import { useRouter } from "next/navigation";

interface PokeDatasetProps {
  isLoading: boolean;
  hasStarted: boolean;
  progress: PokemonProgress;
  error: Error | null;
  handleFetchPokemon: () => void;
}
const PokeDataset = ({
  isLoading,
  hasStarted,
  progress,
  error,
  handleFetchPokemon,
}: PokeDatasetProps) => {
  const { isPokemonsSet } = usePokemonStore();
  console.log(isPokemonsSet);
  const router = useRouter();
  const handleViewData = () => {
    router.push("/poke-data");
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
          <div className="flex items-center text-sm text-primary">
            <Zap className="h-4 w-4 mr-2 text-yellow-500" />
            <span>Real-time data from PokeAPI</span>
          </div>
          <div className="flex items-center text-sm text-primary">
            <BarChart3 className="h-4 w-4 mr-2 text-green-500" />
            <span>Complete dataset with pagination</span>
          </div>
          <div className="flex items-center text-sm text-primary">
            <Download className="h-4 w-4 mr-2 text-purple-500" />
            <span>Progress tracking & loading states</span>
          </div>
        </div>

        {hasStarted && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {isLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Fetching Pokémon...
                  </div>
                ) : progress.isComplete ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete!
                  </div>
                ) : (
                  "Preparing to fetch..."
                )}
              </span>
              <span className="text-sm text-gray-500">
                {progress.fetched} / {progress.total}
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>

            <div className="text-xs text-gray-500 text-center">
              {progressPercentage.toFixed(1)}% complete
              {isLoading &&
                ` • Batch ${progress.currentBatch} of ${progress.totalBatches}`}
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">
              Error: {error.message || "Failed to fetch Pokémon data"}
            </p>
          </div>
        )}

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
