import type {
  AtmosphericProfile,
} from "./atmosphericTypes";


export const demoAtmosphericProfile: AtmosphericProfile = {
  levels: [
    {
      pressure: 1000,
      temperature: 29,
      relativeHumidity: 84,
    },

    {
      pressure: 925,
      temperature: 25,
      relativeHumidity: 82,
    },

    {
      pressure: 850,
      temperature: 21,
      relativeHumidity: 78,
    },

    {
      pressure: 700,
      temperature: 14,
      relativeHumidity: 68,
    },

    {
      pressure: 500,
      temperature: -2,
      relativeHumidity: 50,
    },

    {
      pressure: 300,
      temperature: -25,
      relativeHumidity: 35,
    },
  ],
};