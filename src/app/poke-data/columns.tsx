"use client";

import {
  PokemonDetails,
  usePokemonStore,
  CustomColumn,
} from "@/store/pokemonStore";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { AddColumnDialog } from "@/components/AddColumnDialog";
import Image from "next/image";

const EditableCell = ({
  value,
  onUpdate,
  pokemonId,
  field,
}: {
  value: number;
  onUpdate: (id: string, field: string, value: number) => Promise<void>;
  pokemonId: string;
  field: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());

  const handleSave = async () => {
    const numValue = parseInt(editValue);
    if (!isNaN(numValue) && numValue >= 0) {
      await onUpdate(pokemonId, field, numValue);
      setIsEditing(false);
    } else {
      setEditValue(value.toString());
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditValue(value.toString());
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <Input
        value={editValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setEditValue(e.target.value)
        }
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="h-8 w-16 text-center"
        type="number"
        min="0"
        autoFocus
      />
    );
  }

  return (
    <div
      className="cursor-pointer hover:bg-muted/50 px-2 py-1 rounded min-w-[60px] text-center"
      onClick={() => setIsEditing(true)}
    >
      {value}
    </div>
  );
};

const EditableTextCell = ({
  value,
  onUpdate,
  pokemonId,
  field,
}: {
  value: string;
  onUpdate: (id: string, field: string, value: string) => Promise<void>;
  pokemonId: string;
  field: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = async () => {
    if (editValue.trim()) {
      await onUpdate(pokemonId, field, editValue.trim());
      setIsEditing(false);
    } else {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <Input
        value={editValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setEditValue(e.target.value)
        }
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="h-8 "
        autoFocus
      />
    );
  }

  return (
    <div
      className="cursor-pointer hover:bg-muted/50 px-2 py-1 rounded"
      onClick={() => setIsEditing(true)}
    >
      {value}
    </div>
  );
};

const EditableBooleanCell = ({
  value,
  onUpdate,
  pokemonId,
  field,
}: {
  value: boolean;
  onUpdate: (id: string, field: string, value: boolean) => Promise<void>;
  pokemonId: string;
  field: string;
}) => {
  const handleToggle = async () => {
    await onUpdate(pokemonId, field, !value);
  };

  return (
    <div
      className="cursor-pointer hover:bg-muted/50 px-2 py-1 rounded text-center"
      onClick={handleToggle}
    >
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          value
            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
        }`}
      >
        {value ? "True" : "False"}
      </span>
    </div>
  );
};

const createCustomColumn = (
  customColumn: CustomColumn
): ColumnDef<PokemonDetails> => {
  const { updatePokemon } = usePokemonStore.getState();

  const getCellComponent = () => {
    switch (customColumn.type) {
      case "number":
        return function NumberCell({
          row,
        }: {
          row: { getValue: (key: string) => number; original: { id: string } };
        }) {
          return (
            <EditableCell
              value={row.getValue(customColumn.id) || 0}
              onUpdate={async (id, field, value) =>
                await updatePokemon(id, { [field]: value })
              }
              pokemonId={row.original.id}
              field={customColumn.id}
            />
          );
        };
      case "boolean":
        return function BooleanCell({
          row,
        }: {
          row: { getValue: (key: string) => boolean; original: { id: string } };
        }) {
          return (
            <EditableBooleanCell
              value={row.getValue(customColumn.id) || false}
              onUpdate={async (id, field, value) =>
                await updatePokemon(id, { [field]: value })
              }
              pokemonId={row.original.id}
              field={customColumn.id}
            />
          );
        };
      default:
        return function TextCell({
          row,
        }: {
          row: { getValue: (key: string) => string; original: { id: string } };
        }) {
          return (
            <EditableTextCell
              value={row.getValue(customColumn.id) || ""}
              onUpdate={async (id, field, value) =>
                await updatePokemon(id, { [field]: value })
              }
              pokemonId={row.original.id}
              field={customColumn.id}
            />
          );
        };
    }
  };

  return {
    accessorKey: customColumn.id,
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 lg:px-3"
          >
            {customColumn.name}
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              const { removeCustomColumn } = usePokemonStore.getState();
              await removeCustomColumn(customColumn.id);
            }}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
          >
            <Trash className="h-3 w-3" />
          </Button>
        </div>
      );
    },
    cell: getCellComponent(),
  };
};

export const createColumns = (
  customColumns: CustomColumn[] = []
): ColumnDef<PokemonDetails>[] => {
  const { updatePokemon } = usePokemonStore.getState();

  const baseColumns: ColumnDef<PokemonDetails>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 lg:px-3"
          >
            ID
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-mono text-sm text-muted-foreground">
          #{row.getValue("id")}
        </div>
      ),
      sortingFn: (rowA, rowB) => {
        const a = parseInt(rowA.getValue("id"));
        const b = parseInt(rowB.getValue("id"));
        return a - b;
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 lg:px-3"
          >
            Name
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <EditableTextCell
          value={row.getValue("name")}
          onUpdate={async (id, field, value) =>
            await updatePokemon(id, { [field]: value })
          }
          pokemonId={row.original.id}
          field="name"
        />
      ),
    },
    {
      accessorKey: "url",
      header: () => {
        return <div>Image</div>;
      },
      cell: ({ row }) => {
        const imageUrl = row.getValue("url");
        const pokemonName = row.getValue("name");

        if (!imageUrl || imageUrl === "") {
          return (
            <div className="w-10 h-10 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
              No Image
            </div>
          );
        }

        return (
          <Image
            src={imageUrl as string}
            alt={`${pokemonName} sprite`}
            className="w-10 h-10 object-contain"
            width={40}
            height={40}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png`;
            }}
          />
        );
      },
    },
    {
      accessorKey: "types",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 lg:px-3"
          >
            Types
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <EditableTextCell
          value={row.getValue("types")}
          onUpdate={async (id, field, value) =>
            await updatePokemon(id, { [field]: value })
          }
          pokemonId={row.original.id}
          field="types"
        />
      ),
    },
    {
      accessorKey: "hp",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 lg:px-3"
          >
            HP
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <EditableCell
          value={row.getValue("hp")}
          onUpdate={async (id, field, value) =>
            await updatePokemon(id, { [field]: value })
          }
          pokemonId={row.original.id}
          field="hp"
        />
      ),
    },
    {
      accessorKey: "attack",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 lg:px-3"
          >
            Attack
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <EditableCell
          value={row.getValue("attack")}
          onUpdate={async (id, field, value) =>
            await updatePokemon(id, { [field]: value })
          }
          pokemonId={row.original.id}
          field="attack"
        />
      ),
    },
    {
      accessorKey: "defense",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 lg:px-3"
          >
            Defense
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <EditableCell
          value={row.getValue("defense")}
          onUpdate={async (id, field, value) =>
            await updatePokemon(id, { [field]: value })
          }
          pokemonId={row.original.id}
          field="defense"
        />
      ),
    },
    {
      accessorKey: "spAttack",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 lg:px-3"
          >
            Sp. Attack
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <EditableCell
          value={row.getValue("spAttack")}
          onUpdate={async (id, field, value) =>
            await updatePokemon(id, { [field]: value })
          }
          pokemonId={row.original.id}
          field="spAttack"
        />
      ),
    },
    {
      accessorKey: "spDefense",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 lg:px-3"
          >
            Sp. Defense
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <EditableCell
          value={row.getValue("spDefense")}
          onUpdate={async (id, field, value) =>
            await updatePokemon(id, { [field]: value })
          }
          pokemonId={row.original.id}
          field="spDefense"
        />
      ),
    },
    {
      accessorKey: "speed",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 lg:px-3"
          >
            Speed
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <EditableCell
          value={row.getValue("speed")}
          onUpdate={async (id, field, value) =>
            await updatePokemon(id, { [field]: value })
          }
          pokemonId={row.original.id}
          field="speed"
        />
      ),
    },
    {
      accessorKey: "actions",
      header: () => {
        return <AddColumnDialog />;
      },
    },
  ];

  const customColumnDefs = customColumns.map(createCustomColumn);

  return [
    ...baseColumns.slice(0, -1),
    ...customColumnDefs,
    ...baseColumns.slice(-1),
  ];
};
