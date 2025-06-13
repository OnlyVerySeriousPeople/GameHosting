#!/bin/sh

set -e

echo "Building..."
pnpm run build

echo "Starting the server..."
pnpm run serve
