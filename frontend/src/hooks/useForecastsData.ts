import { useState, useEffect, useRef } from "react";
import { fetchForecasts } from "../utils/apiClient";
import type { ForecastGeneration } from "../types";

interface UseForecastsDataResult {
  data: ForecastGeneration[];
  loading: boolean;
  error: string | null;
}

export function useForecastsData(
  startTime: Date,
  endTime: Date,
  horizonHours: number,
): UseForecastsDataResult {
  const [data, setData] = useState<ForecastGeneration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }

    let cancelled = false;

    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchForecasts(startTime, endTime, horizonHours);
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load forecasts (no cache)",
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
  }, [startTime.getTime(), endTime.getTime(), horizonHours]);

  return { data, loading, error };
}
