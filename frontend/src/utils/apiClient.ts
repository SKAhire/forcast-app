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
