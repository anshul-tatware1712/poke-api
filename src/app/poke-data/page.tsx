"use client";
import React from "react";
import { usePokemonStore } from "@/store/pokemonStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PokeData = () => {
  const router = useRouter();
  const { pokemons } = usePokemonStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // Get unique types for filter
  const uniqueTypes = Array.from(
    new Set(pokemons.flatMap((p) => p.types.split(" / ")))
  ).sort();

  // Filter pokemons based on search and type
  const filteredPokemons = pokemons.filter((pokemon) => {
    const matchesSearch = pokemon.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || pokemon.types.includes(typeFilter);
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-primary">Pokémon Data</h1>
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredPokemons.length} of {pokemons.length} Pokémon
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Pokémon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">All Types</option>
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pokemon Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredPokemons.map((pokemon) => (
            <Card
              key={pokemon.id}
              className="p-4 hover:shadow-lg transition-shadow"
            >
              <div className="text-center">
                <div className="text-lg font-bold text-primary mb-2">
                  {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                </div>
                <div className="text-sm text-muted-foreground mb-3">
                  #{pokemon.id}
                </div>
                <div className="text-xs text-blue-600 mb-3">
                  {pokemon.types}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="font-semibold">HP</div>
                    <div>{pokemon.hp}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Attack</div>
                    <div>{pokemon.attack}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Defense</div>
                    <div>{pokemon.defense}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Speed</div>
                    <div>{pokemon.speed}</div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredPokemons.length === 0 && (
          <div className="text-center py-12">
            <div className="text-lg text-muted-foreground mb-2">
              No Pokémon found
            </div>
            <div className="text-sm text-muted-foreground">
              Try adjusting your search or filter criteria
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PokeData;
