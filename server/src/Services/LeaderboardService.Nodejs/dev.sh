#!/bin/sh

set -xe

docker compose up -d "$(docker compose config --services | grep -v leaderboard_api)"

pnpm run db:wait

pnpm run dev:serve
