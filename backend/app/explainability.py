from .ground_impact import GroundImpactIntelligence

def generate_explanation(impact: GroundImpactIntelligence) -> str:
    lines = [f"Ground Impact: {impact.level.upper()}", "", "Primary drivers:"]
    for i, factor in enumerate(impact.contributing_factors, 1):
        lines.append(f"{i}. {factor}")
    
    lines.append("")
    lines.append(f"Confidence: {impact.confidence}%")
    return "\n".join(lines)
