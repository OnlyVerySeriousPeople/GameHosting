#!/bin/sh

until nc -z "$DATABASE_HOST" "$DATABASE_PORT" 2>/dev/null; do
  sleep 1
done
