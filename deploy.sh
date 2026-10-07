#!/usr/bin/env bash
# Builds the app and publishes dist/ to the nginx web root.
set -euo pipefail
cd "$(dirname "$0")"
npm run build
rsync -a --delete dist/ /var/www/html/
