export interface WeatherObservation {
  latitude: number;
  longitude: number;

  temperature?: number;
  humidity?: number;
  pressure?: number;
  rainfall?: number;
  windSpeed?: number;
  windDirection?: number;

  // Atmospheric model variables
  integratedWaterVapour?: number;

  cape?: number;

  cin?: number;
}

export interface GridCell {
  id: string;

  minLatitude: number;
  maxLatitude: number;

  minLongitude: number;
  maxLongitude: number;

  centerLatitude: number;
  centerLongitude: number;

  observationCount: number;

  // Surface / observation variables
  temperature?: number;
  humidity?: number;
  pressure?: number;
  rainfall?: number;
  windSpeed?: number;
  windDirection?: number;

  // Atmospheric intelligence
  integratedWaterVapour?: number;

  cape?: number;

  cin?: number;

  windConvergence?: number;

  windShear?: number;
}

export interface WeatherGrid {
  rows: number;
  columns: number;

  minLatitude: number;
  maxLatitude: number;

  minLongitude: number;
  maxLongitude: number;

  cells: GridCell[];
}