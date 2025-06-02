#!/bin/sh

until nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null; do
  sleep 1
done
