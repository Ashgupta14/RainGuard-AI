#!/bin/bash
set -e

exec uvicorn backend.app.main:app \
  --host "${RAINGUARD_API_HOST:-0.0.0.0}" \
  --port "${RAINGUARD_API_PORT:-8000}"
