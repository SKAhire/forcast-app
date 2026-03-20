import { useMemo } from "react";
import type { ChartDataPoint, DateRange } from "../types";
import { useActualsData } from "./useActualsData";
import { useForecastsData } from "./useForecastsData";
import { formatDateForDisplay } from "../utils/dateUtils";

interface UseChartDataNoCacheResult {
  data: ChartDataPoint[];
  loading: boolean;
  error: string | null;
}
export function useChartData(
  dateRange: DateRange,
  horizonHours: number,
): UseChartDataNoCacheResult {
  const {
    data: actuals,
    loading: actualsLoading,
    error: actualsError,
  } = useActualsData(dateRange.startTime, dateRange.endTime);

  const {
    data: forecasts,
    loading: forecastsLoading,
    error: forecastsError,
  } = useForecastsData(dateRange.startTime, dateRange.endTime, horizonHours);

  const loading = actualsLoading || forecastsLoading;
  const error = actualsError || forecastsError;

  const chartData = useMemo(() => {
    console.log("[useChartDataNoCache] Processing data:", {
      actualsCount: actuals.length,
      forecastsCount: forecasts.length,
      dateRange: {
        start: dateRange.startTime.toISOString(),
        end: dateRange.endTime.toISOString(),
      },
    });

    const actualsMap = new Map<string, number>();
    actuals.forEach((a) => {
      actualsMap.set(a.startTime, a.generation);
    });

    const forecastsMap = new Map<string, number>();
    forecasts.forEach((f) => {
      forecastsMap.set(f.startTime, f.generation);
    });

    const allTimes = new Set([...actualsMap.keys(), ...forecastsMap.keys()]);
    console.log(
      "[useChartDataNoCache] Unique times:",
      Array.from(allTimes).slice(0, 5),
    );

    const points: ChartDataPoint[] = [];

    allTimes.forEach((time) => {
      const actual = actualsMap.get(time) ?? null;
      const forecast = forecastsMap.get(time) ?? null;

      if (actual !== null || forecast !== null) {
        const date = new Date(time);
        const formatted = formatDateForDisplay(
          date,
          dateRange.startTime,
          dateRange.endTime,
        );
        points.push({
          time,
          actual,
          forecast,
          formattedTime: formatted,
        });
      }
    });

    console.log(
      "[useChartDataNoCache] First 5 data points:",
      points.slice(0, 5),
    );

    // Sort by time
    points.sort(
      (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
    );

    return points;
  }, [
    actuals,
    forecasts,
    dateRange.startTime.getTime(),
    dateRange.endTime.getTime(),
    horizonHours,
  ]);

  return {
    data: chartData,
    loading,
    error,
  };
}
