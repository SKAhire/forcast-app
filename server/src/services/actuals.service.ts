import { fetchActualData } from "../lib/elexon.client";
import { ActualGeneration } from "../types";

export async function getActualsData(
  startTime: Date,
  endTime: Date,
): Promise<ActualGeneration[]> {
  const response = await fetchActualData(startTime, endTime);

  console.log("Actuals data fetched from Elexon API:", response);
  if (!response || !Array.isArray(response)) {
    throw new Error("Invalid response from Elexon API");
    return [];
  }
  console.log("response length:", response.length);

  const actuals: ActualGeneration[] = response
    .filter((item) => item.fuelType === "WIND")
    .map((item: any) => {
      console.log("item:", item);
      return {
        startTime: item.publishTime,
        generation: item.generation,
        fuelType: "WIND",
      };
    });
  return actuals;
}
