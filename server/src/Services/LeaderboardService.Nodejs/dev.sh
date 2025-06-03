#!/bin/sh

set -xe

trap 'docker compose stop' EXIT

docker compose up -d "$(docker compose config --services | grep -v leaderboard_api)"

pnpm run db:wait

pnpm run dev:serve
