"use client";

import React, { useEffect } from "react";
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import { usePokemonStore } from "@/store/pokemonStore";
import { useIndexedDBLoader } from "@/hooks/useIndexedDBLoader";
import { useRouter } from "next/navigation";

const Page = () => {
  const { pokemons, customColumns } = usePokemonStore();
  const { isPokemonsSet, isLoading, hasChecked } = useIndexedDBLoader();
  const router = useRouter();
  const columns = createColumns(customColumns);

  useEffect(() => {
    if (hasChecked && !isLoading && !isPokemonsSet && pokemons.length === 0) {
      router.push("/");
    }
  }, [hasChecked, isLoading, isPokemonsSet, pokemons.length, router]);

  if (isLoading && !isPokemonsSet) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading Pokémon data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Pokémon Database
          </h1>
        </div>

        <DataTable columns={columns} data={pokemons} />
      </div>
    </div>
  );
};

export default Page;
