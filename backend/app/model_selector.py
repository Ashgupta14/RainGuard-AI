from .model_registry import model_registry, ModelMetadata

def select_model() -> ModelMetadata:
    return model_registry.get_active_model_metadata()
