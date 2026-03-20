const API_URL = import.meta.env.VITE_API_URL;
console.log("API_URL:", API_URL);

export async function fetchActuals(
  startTime: Date,
  endTime: Date,
): Promise<any[]> {
  console.log("fetchActuals");
  const params = new URLSearchParams({
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
  });

  const url = `${API_URL}/actuals?${params.toString()}`;
  console.log("Fetching actuals:", url);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch actuals: ${response.statusText}`);
  }
  const data = await response.json();
  console.log("Received actuals:", data.length);
  return data;
}

export async function fetchForecasts(
  startTime: Date,
  endTime: Date,
  horizonHours: number = 4,
): Promise<any[]> {
  const params = new URLSearchParams({
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    horizonHours: horizonHours.toString(),
  });

  const url = `${API_URL}/forecasts?${params}`;
  console.log("detching forecasts:", url);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch forecasts: ${response.statusText}`);
  }
  const data = await response.json();
  console.log("received forecasts:", data.length, "records");
  return data;
}
