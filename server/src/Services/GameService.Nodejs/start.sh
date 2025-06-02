#!/bin/sh

set -e

echo "Waiting for the database..."
pnpm run db:wait

echo "Setting up the database..."
pnpm run db:migrate

echo "Generating code..."
pnpm run gen

echo "Building..."
pnpm run build

echo "Starting the server..."
pnpm run serve
