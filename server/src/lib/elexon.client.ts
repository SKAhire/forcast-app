import { FuelResponse } from "src/types";

const API_URL =
  process.env.ELEXON_API_URL ||
  "https://data.elexon.co.uk/bmrs/api/v1/datasets";

export async function fetchActualData(
  startTime: Date,
  endTime: Date,
): Promise<FuelResponse> {
  const url = `${API_URL}/FUELHH/stream`;
  const params = new URLSearchParams({
    publishDateTimeFrom: startTime.toISOString(),
    publishDateTimeTo: endTime.toISOString(),
  });

  const fullUrl = `${url}?${params.toString()}`;

  console.log("Fetching actual data from Elexon API:", fullUrl);

  try {
    const response = await fetch(fullUrl, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as FuelResponse;
    return data;
  } catch (error) {
    console.error("Error fetching actual data from Elexon API:", error);
    throw error;
  }
}
