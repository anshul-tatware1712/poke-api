"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Download,
  Upload,
  Database,
  FileText,
  Zap,
  BarChart3,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { useFetchAllPokemonWithDetails } from "./api/fetchPokemonQuery";
import { useState, useEffect } from "react";
import { usePokemonStore } from "@/store/pokemonStore";
import { useRouter } from "next/navigation";
import { savePokemons } from "@/Utils/indexedDb";
import { useIndexedDBLoader } from "@/hooks/useIndexedDBLoader";

export default function Home() {
  const router = useRouter();
  const {
    isLoading,
    error,
    data: allPokemon,
    refetch,
    progress,
  } = useFetchAllPokemonWithDetails();
  const [hasStarted, setHasStarted] = useState(false);

  const { isPokemonsSet } = useIndexedDBLoader();

  const handleFetchPokemon = () => {
    setHasStarted(true);
    refetch();
  };

  const handleViewData = () => {
    router.push("/poke-data");
  };

  useEffect(() => {
    if (allPokemon && Array.isArray(allPokemon) && allPokemon.length > 0) {
      usePokemonStore.getState().setAllPokemons(allPokemon);
      savePokemons(allPokemon);
    }
  }, [allPokemon]);

  const progressPercentage =
    progress.total > 0 ? (progress.fetched / progress.total) * 100 : 0;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center my-8">
          <h1 className="text-5xl text-primary mb-4">Pokémon Labs</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Advanced data aggregation and analysis platform for comprehensive
            Pokémon research. Fetch complete datasets from PokeAPI or upload
            your own CSV files for analysis.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-blue-200">
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
                          Fetching Pokémon... (Batch {progress.currentBatch}/
                          {progress.totalBatches})
                        </div>
                      ) : progress.isComplete ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Complete! (
                          {Array.isArray(allPokemon)
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

          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-green-200">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-green-100 rounded-xl mr-4 group-hover:bg-green-200 transition-colors">
                  <Upload className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-primary">
                    Manual CSV Upload
                  </h2>
                  <p className="text-primary">Upload your own datasets</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center text-sm text-primary">
                  <FileText className="h-4 w-4 mr-2 text-orange-500" />
                  <span>Support for large CSV files (10MB - 100MB)</span>
                </div>
                <div className="flex items-center text-sm text-primary">
                  <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                  <span>Client-side streaming with PapaParse</span>
                </div>
                <div className="flex items-center text-sm text-primary">
                  <BarChart3 className="h-4 w-4 mr-2 text-green-500" />
                  <span>Custom schema mapping</span>
                </div>
              </div>

              <Button className="w-full">Upload CSV Dataset</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
