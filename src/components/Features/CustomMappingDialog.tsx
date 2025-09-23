"use client";

import { useState, useEffect } from "react";
import { usePokemonStore } from "@/store/pokemonStore";
import { useUploadedStore, ColumnMapping } from "@/store/uploadedStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { useRouter } from "next/navigation";

const POKEMON_FIELDS = [
  { key: "id", label: "ID", type: "text" },
  { key: "name", label: "Name", type: "text" },
  { key: "url", label: "Image URL", type: "text" },
  { key: "types", label: "Types", type: "text" },
  { key: "hp", label: "HP", type: "number" },
  { key: "attack", label: "Attack", type: "number" },
  { key: "defense", label: "Defense", type: "number" },
  { key: "spAttack", label: "Sp. Attack", type: "number" },
  { key: "spDefense", label: "Sp. Defense", type: "number" },
  { key: "speed", label: "Speed", type: "number" },
];

export function CustomMappingDialog() {
  const [open, setOpen] = useState(false);
  const [mappings, setMappings] = useState<ColumnMapping[]>([]);
  const { uploadedData, setColumnMappings, getMappedData } = useUploadedStore();
  const { setAllPokemons } = usePokemonStore();
  const router = useRouter();

  const uploadedColumns =
    uploadedData.length > 0 ? Object.keys(uploadedData[0]) : [];

  useEffect(() => {
    if (uploadedData.length > 0) {
      const initialMappings = POKEMON_FIELDS.map((field) => ({
        uploadedColumn: "",
        pokemonField: field.key,
        dataType: field.type as "text" | "number" | "boolean",
      }));
      setMappings(initialMappings);
    }
  }, [uploadedData]);

  const handleMappingChange = (
    pokemonField: string,
    uploadedColumn: string
  ) => {
    setMappings((prev) =>
      prev.map((mapping) =>
        mapping.pokemonField === pokemonField
          ? { ...mapping, uploadedColumn }
          : mapping
      )
    );
  };

  const handleApplyMapping = () => {
    const validMappings = mappings.filter(
      (mapping) => mapping.uploadedColumn !== ""
    );

    setColumnMappings(validMappings);

    const mappedData = getMappedData();
    const pokemonData = mappedData.map((row) => ({
      id: String(row.id),
      name: String(row.name || ""),
      url: String(row.url || ""),
      types: String(row.types || ""),
      hp: Number(row.hp) || 0,
      attack: Number(row.attack) || 0,
      defense: Number(row.defense) || 0,
      spAttack: Number(row.spAttack) || 0,
      spDefense: Number(row.spDefense) || 0,
      speed: Number(row.speed) || 0,
    }));

    setAllPokemons(pokemonData);
    router.push("/poke-data");
    setOpen(false);
  };

  const getUnmappedColumns = () => {
    const mappedColumns = mappings.map((m) => m.uploadedColumn).filter(Boolean);
    return uploadedColumns.filter((col) => !mappedColumns.includes(col));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2 w-fit absolute bottom-4 right-4">
          Map Columns
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Map CSV Columns to Pokemon Fields</DialogTitle>
          <DialogDescription>
            Map your uploaded CSV columns to the Pokemon data fields. Unmapped
            columns will be ignored.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Column Mapping</h3>
            <div className="grid grid-cols-5 gap-4 text-sm font-medium text-muted-foreground">
              <div className="col-span-2">Pokemon Field</div>
              <div className="col-span-1"></div>
              <div className="col-span-2">CSV Column</div>
            </div>

            {mappings.map((mapping) => (
              <div
                key={mapping.pokemonField}
                className="grid grid-cols-5 gap-4 items-center"
              >
                <div className="col-span-2">
                  <div className="p-2 bg-muted rounded text-sm">
                    {
                      POKEMON_FIELDS.find((f) => f.key === mapping.pokemonField)
                        ?.label
                    }
                  </div>
                </div>
                <div className="col-span-1 flex justify-center">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="col-span-2">
                  <select
                    value={mapping.uploadedColumn}
                    onChange={(e) =>
                      handleMappingChange(mapping.pokemonField, e.target.value)
                    }
                    className="w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select column...</option>
                    {uploadedColumns.map((col) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          {getUnmappedColumns().length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-orange-600">
                Unmapped Columns
              </h3>
              <p className="text-sm text-muted-foreground">
                These columns from your CSV will be ignored:
              </p>
              <div className="flex flex-wrap gap-2">
                {getUnmappedColumns().map((col) => (
                  <span
                    key={col}
                    className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-sm"
                  >
                    {col}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleApplyMapping}
            disabled={!mappings.some((m) => m.uploadedColumn)}
            className="gap-2"
          >
            <Check className="h-4 w-4" />
            Apply Mapping
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
