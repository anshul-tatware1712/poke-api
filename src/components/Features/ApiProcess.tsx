import React from "react";
import { Loader2 } from "lucide-react";
import { CheckCircle } from "lucide-react";
import { PokemonProgress } from "@/app/api/fetchPokemonQuery";
import { PokemonDetails } from "@/store/pokemonStore";
interface ApiProcessProps {
  hasStarted: boolean;
  isLoading: boolean;
  progress: PokemonProgress;
  allPokemon: PokemonDetails[];
  progressPercentage: number;
  error: Error | null;
}
const ApiProcess = ({
  hasStarted,
  isLoading, 
  
  progress,
  allPokemon,
  progressPercentage,
  error,
}: ApiProcessProps) => {
  return (
    <div>
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
                  Complete! ({Array.isArray(allPokemon)
                    ? allPokemon.length
                    : 0}{" "}
                  Pokémon fetched)
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
    </div>
  );
};

export default ApiProcess;
