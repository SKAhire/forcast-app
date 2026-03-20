export interface ActualGeneration {
  startTime: string; // Target time (ISO8601)
  generation: number; // MW generated
  fuelType: "WIND";
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
