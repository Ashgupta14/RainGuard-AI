from pydantic import BaseModel

class TerrainAPI(BaseModel):
    elevation: float
    slope: float
    flow_accumulation: float
    score: int

class ExposureAPI(BaseModel):
    population_density: float
    critical_infrastructure: int
    road_density: float
    building_density: float
    score: int

class GroundImpactAPI(BaseModel):
    score: int
    level: str
    confidence: int
