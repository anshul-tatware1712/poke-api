"use client";

import React, { useEffect, useMemo } from "react";
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import { PokemonDetails, usePokemonStore } from "@/store/pokemonStore";
import { UploadedData, useUploadedStore } from "@/store/uploadedStore";
import { useIndexedDBLoader } from "@/hooks/useIndexedDBLoader";
import { useUploadedDataLoader } from "@/hooks/useUploadedDataLoader";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Papa from "papaparse";
import { ColumnDef } from "@tanstack/react-table";

const Page = () => {
  const { pokemons, customColumns } = usePokemonStore();
  const { uploadedData, getMappedData } = useUploadedStore();
  const { isPokemonsSet, isLoading, hasChecked } = useIndexedDBLoader();
  const { isDataUploaded, hasChecked: uploadedHasChecked } =
    useUploadedDataLoader();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dataSource = searchParams.get("source") || "api";

  const columns = useMemo(() => {
    return createColumns(customColumns);
  }, [customColumns]);

  const currentData = dataSource === "api" ? pokemons : getMappedData();

  useEffect(() => {
    if (dataSource === "api") {
      if (hasChecked && !isLoading && !isPokemonsSet && pokemons.length === 0) {
        router.push("/");
      }
    } else {
      if (uploadedHasChecked && !isDataUploaded && uploadedData.length === 0) {
        router.push("/");
      }
    }
  }, [
    hasChecked,
    isLoading,
    isPokemonsSet,
    pokemons.length,
    uploadedHasChecked,
    isDataUploaded,
    uploadedData.length,
    dataSource,
    router,
  ]);

  const handleExportData = () => {
    const csv = Papa.unparse(
      currentData.slice().sort((a, b) => Number(a.id) - Number(b.id))
    );

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${dataSource}-pokemon.csv`;
    link.click();
  };

  if (
    (dataSource === "api" && isLoading && !isPokemonsSet) ||
    (dataSource === "uploaded" && !uploadedHasChecked)
  ) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              Loading {dataSource === "api" ? "Pokémon" : "uploaded"} data...
            </p>
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
            {dataSource === "api"
              ? "API Pokémon Data"
              : "Uploaded Pokémon Data"}
          </h1>
          <Button
            variant="destructive"
            onClick={handleExportData}
            disabled={currentData.length === 0}
          >
            Export Data
          </Button>
        </div>

        <DataTable
          columns={columns as ColumnDef<UploadedData | PokemonDetails>[]}
          data={currentData}
        />
      </div>
    </div>
  );
};

export default Page;
