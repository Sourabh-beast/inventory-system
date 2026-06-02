#!/usr/bin/env bash
set -e

echo "Running database seed..."
python seed.py

echo "Starting server on port ${PORT:-8000}..."
exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}"
