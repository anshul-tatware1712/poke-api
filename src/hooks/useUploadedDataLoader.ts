import { useEffect, useState } from "react";
import { useUploadedStore } from "@/store/uploadedStore";

export const useUploadedDataLoader = () => {
  const { loadFromIndexedDB, isDataUploaded } = useUploadedStore();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (!hasChecked) {
      setHasChecked(true);
      loadFromIndexedDB();
    }
  }, [hasChecked, loadFromIndexedDB]);

  return { isDataUploaded, hasChecked };
};
