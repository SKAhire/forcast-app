export interface DateRange {
  startTime: Date;
  endTime: Date;
}

export interface ChartDataPoint {
  time: string;
  actual: number | null;
  forecast: number | null;
  formattedTime: string;
}

export interface ActualGeneration {
  startTime: string;
  generation: number;
  fuelType: "WIND";
}

export interface ForecastGeneration {
  startTime: string;
  publishTime: string;
  generation: number;
  forecastHorizon: number;
}
