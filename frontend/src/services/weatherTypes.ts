export type DataSource = "demo" | "live";

export type ObservationSource =
  | "satellite"
  | "radar"
  | "weather-station"
  | "nwp"
  | "dem";

export interface WeatherQuery {
  location: string;
  latitude?: number;
  longitude?: number;
  startTime?: string;
  endTime?: string;
}

export interface DataQuality {
  source: ObservationSource | "demo";
  timestamp: string;
  qualityScore: number;
  isValid: boolean;
  missingFields: string[];
}

export interface DataAdapterResult<T> {
  source: ObservationSource | "demo";
  data: T;
  quality: DataQuality;
}

export interface DataAdapter<T = unknown> {
  name: string;
  type: ObservationSource | "demo";

  getWeatherData(
    query: WeatherQuery
  ): Promise<DataAdapterResult<T>>;
}