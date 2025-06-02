#!/bin/sh

set -xe

docker compose up -d "$(docker compose config --services | grep -v game_api)"

pnpm run db:wait

pnpm run db:migrate

pnpm run gen

pnpm run dev:serve
