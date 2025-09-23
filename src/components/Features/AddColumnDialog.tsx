"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { usePokemonStore, CustomColumn } from "@/store/pokemonStore";
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
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

const schema = yup.object({
  columnName: yup
    .string()
    .required("Column name is required")
    .min(2, "Column name must be at least 2 characters")
    .max(50, "Column name must be less than 50 characters")
    .matches(
      /^[a-zA-Z0-9\s]+$/,
      "Column name can only contain letters, numbers, and spaces"
    ),
  columnType: yup
    .string()
    .oneOf(["text", "number", "boolean"], "Invalid column type")
    .required("Column type is required"),
  defaultValue: yup.string().default(""),
});

type FormData = yup.InferType<typeof schema>;

export function AddColumnDialog() {
  const [open, setOpen] = useState(false);
  const { addCustomColumn } = usePokemonStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      columnName: "",
      columnType: "text",
      defaultValue: "",
    },
  });

  const columnType = watch("columnType");

  const onSubmit = (data: FormData) => {
    const columnId = data.columnName.toLowerCase().replace(/\s+/g, "_");

    let parsedDefaultValue: string | number | boolean;
    switch (data.columnType) {
      case "number":
        parsedDefaultValue = data.defaultValue
          ? parseInt(data.defaultValue) || 0
          : 0;
        break;
      case "boolean":
        parsedDefaultValue =
          data.defaultValue === "true" || data.defaultValue === "1";
        break;
      default:
        parsedDefaultValue = data.defaultValue || "";
    }

    const newColumn: CustomColumn = {
      id: columnId,
      name: data.columnName.trim(),
      type: data.columnType as "text" | "number" | "boolean",
      defaultValue: parsedDefaultValue,
    };

    addCustomColumn(newColumn);
    reset();
    setOpen(false);
  };

  const getDefaultValuePlaceholder = () => {
    switch (columnType) {
      case "number":
        return "0";
      case "boolean":
        return "true or false";
      default:
        return "Default text value";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Column</DialogTitle>
          <DialogDescription>
            Create a new custom column for your Pokémon data table.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="columnName" className="text-sm font-medium">
              Column Name
            </label>
            <Input
              id="columnName"
              {...register("columnName")}
              placeholder="Enter column name"
              className={errors.columnName ? "border-red-500" : ""}
            />
            {errors.columnName && (
              <p className="text-sm text-red-500">
                {errors.columnName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="columnType" className="text-sm font-medium">
              Data Type
            </label>
            <select
              id="columnType"
              {...register("columnType")}
              className={`w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                errors.columnType ? "border-red-500" : ""
              }`}
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
            </select>
            {errors.columnType && (
              <p className="text-sm text-red-500">
                {errors.columnType.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="defaultValue" className="text-sm font-medium">
              Default Value
            </label>
            <Input
              id="defaultValue"
              {...register("defaultValue")}
              placeholder={getDefaultValuePlaceholder()}
              className={errors.defaultValue ? "border-red-500" : ""}
            />
            {errors.defaultValue && (
              <p className="text-sm text-red-500">
                {errors.defaultValue.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Column"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
