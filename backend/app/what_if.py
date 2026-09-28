from copy import deepcopy
from .models import GridCellIntelligence
from .unified_cell_intelligence import UnifiedCellIntelligence
from .intelligence_api_cell import adapt_unified_cell_to_api
from .grid_terrain import build_cell_terrain
from .grid_exposure import build_cell_exposure
from .grid_ground_impact import build_cell_ground_impact
from .risk_engine import calculate_flood_risk
from .hazard_prediction import predict_hazards

def simulate_what_if_scenario(
    current_api_cell: GridCellIntelligence, 
    rainfall_change: float = 0.0,
    cape_change: float = 0.0,
    humidity_change: float = 0.0,
    pressure_change: float = 0.0,
    wind_change: float = 0.0
) -> GridCellIntelligence:
    scenario_cell = deepcopy(current_api_cell.cell)
    
    if scenario_cell.rainfall is not None:
        scenario_cell.rainfall = max(0.0, scenario_cell.rainfall + rainfall_change)
    else:
        scenario_cell.rainfall = max(0.0, rainfall_change)
        
    if scenario_cell.cape is not None:
        scenario_cell.cape = max(0.0, scenario_cell.cape + cape_change)
        
    if scenario_cell.humidity is not None:
        scenario_cell.humidity = max(0.0, min(100.0, scenario_cell.humidity + humidity_change))
        
    if scenario_cell.pressure is not None:
        scenario_cell.pressure += pressure_change
        
    if scenario_cell.wind_speed is not None:
        scenario_cell.wind_speed = max(0.0, scenario_cell.wind_speed + wind_change)
        
    risk = calculate_flood_risk(
        integrated_water_vapour=scenario_cell.integrated_water_vapour,
        cape=scenario_cell.cape,
        cin=scenario_cell.cin,
        wind_convergence=scenario_cell.wind_convergence,
        wind_shear=scenario_cell.wind_shear,
        rainfall=scenario_cell.rainfall
    )
    score = risk.score
    level = risk.level
    hazards = predict_hazards(
        scenario_cell.rainfall,
        scenario_cell.wind_speed,
        risk.score,
        risk.level,
        risk.contributing_factors
    )
    
    scenario_api_base = deepcopy(current_api_cell)
    scenario_api_base.cell = scenario_cell
    scenario_api_base.risk = risk
    scenario_api_base.hazards = hazards
    scenario_api_base.overall_risk_score = score
    scenario_api_base.overall_level = level
    
    terrain = build_cell_terrain(scenario_api_base)
    exposure = build_cell_exposure(scenario_api_base)
    impact = build_cell_ground_impact(scenario_api_base, terrain, exposure)
    
    unified_cell = UnifiedCellIntelligence(
        cell_id=scenario_cell.id,
        latitude=scenario_cell.latitude,
        longitude=scenario_cell.longitude,
        atmospheric=scenario_api_base,
        temporal=None,
        forecast=None,
        terrain=terrain,
        exposure=exposure,
        ground_impact=impact
    )
    
    return adapt_unified_cell_to_api(unified_cell, mode="what_if", provider="Scenario Simulation")
