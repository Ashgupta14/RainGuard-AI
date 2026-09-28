// ============================================================
// RainGuard AI - Weather Data Types
// ============================================================

export interface CurrentWeather {
  temperature: number;
  condition: string;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  pressure: number;
}

export interface AtmosphericIndicators {
  integratedWaterVapour: number;
  cape: number;
  cin: number;
  windConvergence: number;
  floodRisk: number;
}

export interface RainfallDataPoint {
  time: string;
  rainfall: number;
}

export interface FloodRisk {
  score: number;
  level: "Low" | "Moderate" | "High" | "Critical";
  description: string;
}

export interface WeatherData {
  location: string;
  current: CurrentWeather;
  atmospheric: AtmosphericIndicators;
  rainfallHistory: RainfallDataPoint[];
  floodRisk: FloodRisk;
  lastUpdated: string;
}