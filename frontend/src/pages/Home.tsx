import { useState } from "react";
import type { DateRange } from "../types";
import { useChartData } from "../hooks/useChartData";
import DateRangePicker from "../components/Daterangepicker";
import { GenerationChart } from "../components/GenerationChart";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { HorizonSlider } from "../components/HorizonSlider";

export default function HomePage() {
  const [dateRange, setDateRange] = useState<DateRange>({
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    endTime: new Date(),
  });
  const [horizonHours, setHorizonHours] = useState(4);
  const { data, loading, error } = useChartData(dateRange, horizonHours);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-gray-900 tracking-tight">
              UK Wind Generation
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              National forecast monitor · UTC
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Live
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Controls */}
        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-8">
            <div className="flex-1">
              <DateRangePicker value={dateRange} onChange={setDateRange} />
            </div>
            <div className="hidden sm:block w-px h-10 bg-gray-100 self-center" />
            <div className="w-full sm:w-56">
              <HorizonSlider value={horizonHours} onChange={setHorizonHours} />
            </div>
          </div>
        </section>

        {/* Chart */}
        <section className="bg-white rounded-xl border border-gray-100 shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center h-80">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-80 text-center px-6">
              <p className="text-sm font-medium text-gray-700">
                Failed to load data
              </p>
              <p className="text-xs text-gray-400 mt-1">{error}</p>
            </div>
          ) : data?.length > 0 ? (
            <div className="p-6">
              <div className="flex items-center gap-5 mb-6">
                <LegendDot color="bg-blue-500" label="Actual" />
                <LegendDot color="bg-emerald-500" label="Forecast" />
              </div>
              <GenerationChart data={data} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-80 text-center px-6">
              <p className="text-sm font-medium text-gray-700">
                No data for this range
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Try a different date range or check the backend is running.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}
