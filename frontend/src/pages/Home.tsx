import { useState } from "react";
import type { DateRange } from "../types";
import { useChartData } from "../hooks/useChartData";
import DateRangePicker from "../components/Daterangepicker";
import { GenerationChart } from "../components/GenerationChart";
import { LoadingSpinner } from "../components/LoadingSpinner";

export default function HomePage() {
  const [dateRange, setDateRange] = useState<DateRange>({
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    endTime: new Date(),
  });

  const { data, loading, error } = useChartData(dateRange);
  console.log(loading, "loading");
  console.log(error, "error");
  return (
    <div>
      <h1>Home Page</h1>
      <DateRangePicker value={dateRange} onChange={setDateRange} />
      <p>Loading: {loading ? "true" : "false"}</p>

      {loading ? (
        <LoadingSpinner />
      ) : data?.length > 0 ? (
        <GenerationChart data={data} />
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
          <p>No data available for the selected date range.</p>
          <p className="text-sm mt-2">
            Try selecting a different date range or check if the backend is
            running.
          </p>
        </div>
      )}
      {/* <p>Data: {JSON.stringify(data)}</p> */}
      <p>Data length: {loading ? 0 : data?.length}</p>
      <p>Error: {error}</p>
    </div>
  );
}
