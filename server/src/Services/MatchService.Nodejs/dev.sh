#!/bin/sh

set -xe

trap 'docker compose stop' EXIT

docker compose up -d "$(docker compose config --services | grep -v match_api)"

pnpm run dev:serve
