export interface AtmosphericLevel {
  pressure: number;
  temperature: number;
  relativeHumidity: number;
}

export interface AtmosphericProfile {
  levels: AtmosphericLevel[];
}

export interface IWVResult {
  value: number;
  unit: "kg/m²";
  method: string;
  valid: boolean;
}