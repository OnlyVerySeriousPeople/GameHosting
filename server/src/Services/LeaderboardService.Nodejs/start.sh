#!/bin/sh

set -e

echo "Waiting for the database..."
pnpm run db:wait

echo "Starting the server..."
pnpm run serve
