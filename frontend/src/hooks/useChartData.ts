import { useEffect, useState } from "react";
import type { DateRange } from "../types/types";
import { fetchActuals } from "../utils/apiClient";

export function useChartData(dateRange: DateRange) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const startTime = new Date(dateRange.startTime);
  const endTime = new Date(dateRange.endTime);
  console.log(startTime, "startTime");
  console.log(endTime, "endTime");
  useEffect(() => {
    async function loadData() {
      console.log("useEffect");
      setLoading(true);
      setError(null);

      try {
        console.log("handleFetch");
        const response = fetchActuals(dateRange.startTime, dateRange.endTime);

        const resData = await response;
        setData(resData);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [startTime.getTime(), endTime.getTime()]);

  return { data, loading, error };
}
