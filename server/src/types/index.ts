export interface ActualGeneration {
  startTime: string;
  generation: number;
  fuelType: "WIND";
}

export interface ForecastGeneration {
  startTime: string;
  publishTime: string;
  generation: number;
}

export interface FuelResponse {
  settlementData: string;
  settlementPeriod: number;
  fuelType: string;
  generation: number;
}

export interface WindResponse {
  startTime: string;
  publishTime: string;
  generation: number;
}
