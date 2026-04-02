#!/bin/bash
set -e

rm -f /app/tmp/pids/server.pid

if [ "$1" = "bin/rails" ]; then
  bundle exec ridgepole -c config/database.yml -E production -s primary --apply -f db/schemas/Schemafile
fi

exec "$@"
