"use client";

import React, { useEffect, Suspense } from "react";
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import { usePokemonStore } from "@/store/pokemonStore";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Papa from "papaparse";
import { useUploadedStore } from "@/store/uploadedStore";

const PokeDataContent = () => {
  const searchParams = useSearchParams();
  const method = searchParams.get("method");

  const {
    pokemons,
    customColumns,
    isPokemonsSet,
    isLoading,
    loadFromIndexedDB,
  } = usePokemonStore();

  const { uploadedData } = useUploadedStore();

  const data = method === "uploaded" ? uploadedData : pokemons;

  const router = useRouter();
  const columns = createColumns(customColumns, method || undefined);

  useEffect(() => {
    if (!isPokemonsSet && pokemons.length === 0 && !isLoading) {
      loadFromIndexedDB();
    }
  }, [isPokemonsSet, pokemons.length, loadFromIndexedDB, isLoading]);

  useEffect(() => {
    if (!isLoading && isPokemonsSet && pokemons.length === 0) {
      router.push("/");
    }
  }, [isLoading, isPokemonsSet, pokemons.length, router]);

  const handleExportData = () => {
    const csv = Papa.unparse(
      pokemons.slice().sort((a, b) => Number(a.id) - Number(b.id))
    );

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "pokemon.csv";
    link.click();
  };

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
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Pokémon Database
          </h1>
          <Button variant="destructive" onClick={handleExportData}>
            Export Data
          </Button>
        </div>

        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

const LoadingFallback = () => (
  <div className="container mx-auto py-10">
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  </div>
);

const Page = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PokeDataContent />
    </Suspense>
  );
};

export default Page;
