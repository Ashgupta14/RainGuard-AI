from .atmospheric_history import AtmosphericHistory, AtmosphericSnapshot

_cell_histories = {}

def get_cell_history(cell_id: str) -> AtmosphericHistory:
    if cell_id not in _cell_histories:
        _cell_histories[cell_id] = AtmosphericHistory(max_snapshots=24)
    return _cell_histories[cell_id]

def record_cell_snapshot(cell_id: str, snapshot: AtmosphericSnapshot) -> None:
    history = get_cell_history(cell_id)
    history.add(snapshot)

def get_previous_snapshot(cell_id: str) -> AtmosphericSnapshot | None:
    history = get_cell_history(cell_id)
    snapshots = history.all()
    if len(snapshots) >= 2:
        return snapshots[-2]
    return None
