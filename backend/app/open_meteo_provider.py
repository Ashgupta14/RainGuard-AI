from typing import Any
import requests

from .live_provider import (
    LiveObservation,
    LiveWeatherProvider,
)

OPEN_METEO_URL = (
    "https://api.open-meteo.com/v1/forecast"
)
BATCH_SIZE = 50

class OpenMeteoProvider(LiveWeatherProvider):
    name = "Open-Meteo"

    def fetch_observations(
        self,
        coordinates: list[tuple[float, float]],
    ) -> list[LiveObservation]:
        if not coordinates:
            return []
        
        observations: list[LiveObservation] = []
        for start in range(0, len(coordinates), BATCH_SIZE):
            batch = coordinates[start:start + BATCH_SIZE]
            observations.extend(self._fetch_batch(batch))
            
        return observations

    def _fetch_batch(
        self,
        coordinates: list[tuple[float, float]],
    ) -> list[LiveObservation]:
        latitudes = ",".join(str(latitude) for latitude, _ in coordinates)
        longitudes = ",".join(str(longitude) for _, longitude in coordinates)
        
        params = {
            "latitude": latitudes,
            "longitude": longitudes,
            "current": ",".join(
                [
                    "temperature_2m",
                    "relative_humidity_2m",
                    "surface_pressure",
                    "precipitation",
                    "wind_speed_10m",
                    "wind_direction_10m",
                ]
            ),
            "hourly": ",".join(
                [
                    "cape",
                    "convective_inhibition",
                ]
            ),
            "forecast_hours": 1,
            "timezone": "UTC",
        }
        
        response = requests.get(
            OPEN_METEO_URL,
            params=params,
            timeout=20,
        )
        response.raise_for_status()
        
        payload: Any = response.json()
        if isinstance(payload, dict):
            payload = [payload]
            
        observations: list[LiveObservation] = []
        for item in payload:
            current = item.get("current", {})
            hourly = item.get("hourly", {})
            cape_values = hourly.get("cape", [])
            cin_values = hourly.get("convective_inhibition", [])
            
            cape = cape_values[0] if cape_values else None
            cin = cin_values[0] if cin_values else None
            
            observations.append(
                LiveObservation(
                    latitude=float(item["latitude"]),
                    longitude=float(item["longitude"]),
                    temperature=current.get("temperature_2m"),
                    humidity=current.get("relative_humidity_2m"),
                    pressure=current.get("surface_pressure"),
                    rainfall=current.get("precipitation"),
                    wind_speed=current.get("wind_speed_10m"),
                    wind_direction=current.get("wind_direction_10m"),
                    cape=cape,
                    cin=cin,
                    timestamp=f"{current.get('time')}Z" if current.get('time') else None,
                    provider=self.name,
                )
            )
            
        return observations
