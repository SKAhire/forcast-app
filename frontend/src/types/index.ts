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
