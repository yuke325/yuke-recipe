#!/bin/bash
set -e

rm -f /app/tmp/pids/server.pid

if [ "$1" = "bin/rails" ]; then
  bundle exec rails db:prepare
fi

exec "$@"
