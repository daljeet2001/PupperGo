#!/bin/bash
set -e

# Load environment variables from .env
export $(grep -v '^#' .env | xargs)

docker-compose up -d

echo "🟡 - Waiting for MongoDB to be ready..."
./wait-for-it.sh localhost:27017 --timeout=30 --strict -- echo "🟢 - Database is ready!"

npm run test

docker-compose down
