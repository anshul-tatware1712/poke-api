"use client";

import { useFetchAllPokemonWithDetails } from "./api/fetchPokemonQuery";
import { useState, useEffect } from "react";
import { usePokemonStore } from "@/store/pokemonStore";
import { useUploadedStore } from "@/store/uploadedStore";
import { savePokemons } from "@/Utils/indexedDb";
import { ParseResult } from "papaparse";
import Papa from "papaparse";
import PokeDataset from "@/components/Features/PokeDataset";
import UploadDataset from "@/components/Features/UploadDataset";
import PokeTitle from "@/components/Features/PokeTitle";

interface CSVRow {
  [key: string]: string | number | boolean;
}

export default function Home() {
  const {
    isLoading,
    error,
    data: allPokemon,
    refetch,
    progress,
  } = useFetchAllPokemonWithDetails();
  const [hasStarted, setHasStarted] = useState(false);
  const { setCsvUpload, setUploadedData } = useUploadedStore();

  const handleUploadCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvUpload({
      isUploading: false,
      error: null,
      data: null,
      fileName: null,
    });

    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      setCsvUpload({
        isUploading: false,
        error: "File is too large! Please upload a file smaller than 100 MB.",
        data: null,
        fileName: file.name,
      });
      e.target.value = "";
      return;
    }

    setCsvUpload({
      isUploading: true,
      error: null,
      data: null,
      fileName: file.name,
    });

    Papa.parse<CSVRow>(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      worker: true,
      complete: (results: ParseResult<CSVRow>) => {
        if (!results.data || results.data.length === 0) {
          setCsvUpload({
            isUploading: false,
            error: "CSV is empty or could not be parsed.",
            data: null,
            fileName: file.name,
          });
          return;
        }

        setCsvUpload({
          isUploading: false,
          error: null,
          data: results.data,
          fileName: file.name,
        });

        setUploadedData(
          results.data.map((row, index) => ({
            ...row,
            id: row.id || `${index + 1}`,
          }))
        );
      },
      error: (err) => {
        setCsvUpload({
          isUploading: false,
          error: `Failed to parse CSV: ${err.message}`,
          data: null,
          fileName: file.name,
        });
      },
    });
  };

  const handleFetchPokemon = () => {
    setHasStarted(true);
    refetch();
  };

  useEffect(() => {
    if (allPokemon && Array.isArray(allPokemon) && allPokemon.length > 0) {
      usePokemonStore.getState().setAllPokemons(allPokemon);
      savePokemons(allPokemon);
    }
  }, [allPokemon]);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <PokeTitle />

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <PokeDataset
            isLoading={isLoading}
            progress={progress}
            allPokemon={allPokemon || []}
            error={error}
            hasStarted={hasStarted}
            handleFetchPokemon={handleFetchPokemon}
          />

          <UploadDataset handleUploadCSV={handleUploadCSV} />
        </div>
      </div>
    </div>
  );
}
