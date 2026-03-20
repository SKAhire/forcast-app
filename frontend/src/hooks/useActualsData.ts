import { useState, useEffect, useRef } from "react";
import { fetchActuals } from "../utils/apiClient";
import type { ActualGeneration } from "../types";

interface UseActualsResult {
  data: ActualGeneration[];
  loading: boolean;
  error: string | null;
}

export function useActualsData(startTime: Date, endTime: Date): UseActualsResult {
  const [data, setData] = useState<ActualGeneration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track if this is the initial mount
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip on initial mount if data already exists
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }

    let cancelled = false;

    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchActuals(startTime, endTime);
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load actuals",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [startTime.getTime(), endTime.getTime()]);

  return { data, loading, error };
}
