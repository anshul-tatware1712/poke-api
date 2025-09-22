import { useEffect, useState } from "react";
import { usePokemonStore } from "@/store/pokemonStore";

export const useIndexedDBLoader = () => {
  const { loadFromIndexedDB, isPokemonsSet, isLoading } = usePokemonStore();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (!hasChecked && !isPokemonsSet) {
      setHasChecked(true);
      loadFromIndexedDB();
    }
  }, [hasChecked, isPokemonsSet, loadFromIndexedDB]);

  return { isPokemonsSet, isLoading, hasChecked };
};
