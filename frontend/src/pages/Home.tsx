import { useState } from "react";
import type { DateRange } from "../types/types";
import { useChartData } from "../hooks/useChartData";
import DateRangePicker from "../components/Daterangepicker";

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
      {/* <p>Data: {JSON.stringify(data)}</p> */}
      <p>Data length: {loading ? 0 : data?.length}</p>
      <p>Error: {error}</p>
    </div>
  );
}
