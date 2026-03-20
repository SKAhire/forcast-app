import { fetchForecastData } from "../lib/elexon.client";
import { ForecastGeneration } from "../types";

export async function getForecastsData(
  startTime: Date,
  endTime: Date,
): Promise<ForecastGeneration[]> {
  const response = await fetchForecastData(startTime, endTime);

  console.log("Forecast data fetched from Elexon API:", response);

  if (!response || !Array.isArray(response)) {
    return [];
  }

  const forecastsByTarget = new Map<string, ForecastGeneration[]>();

  for (const item of response) {


    const key = item.startTime;
    if (!forecastsByTarget.has(key)) {
      forecastsByTarget.set(key, []);
    }

    forecastsByTarget.get(key)!.push({
      startTime: item.startTime,
      publishTime: item.publishTime,
      generation: item.generation,
    });
  }

  const result: ForecastGeneration[] = [];

  for (const [startTimeStr, forecasts] of forecastsByTarget.entries()) {
    console.log("startTimeStr:", startTimeStr);
    forecasts.sort(
      (a, b) =>
        new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime(),
    );

    result.push(forecasts[0]);
  }

  result.sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
  );

  return result;
}
