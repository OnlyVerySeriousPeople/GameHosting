#!/bin/sh

set -xe

trap 'docker compose stop' EXIT

docker compose up -d "$(docker compose config --services | grep -v match_service)"

pnpm run dev:serve
