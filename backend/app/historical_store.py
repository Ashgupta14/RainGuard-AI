from typing import List
from .historical_observation import HistoricalObservation

class HistoricalStore:
    def __init__(self):
        self.observations: List[HistoricalObservation] = []

    def add_observation(self, obs: HistoricalObservation):
        self.observations.append(obs)

    def get_observations(self) -> List[HistoricalObservation]:
        return self.observations

    def get_observations_for_cell(self, latitude: float, longitude: float, tolerance: float = 0.01) -> List[HistoricalObservation]:
        return [
            obs for obs in self.observations
            if abs(obs.latitude - latitude) < tolerance and abs(obs.longitude - longitude) < tolerance
        ]

    def get_observations_for_time_range(self, start_time: str, end_time: str) -> List[HistoricalObservation]:
        return [
            obs for obs in self.observations
            if start_time <= obs.timestamp <= end_time
        ]

# Global in-memory store for prototype
historical_store = HistoricalStore()
