#!/bin/bash
set -e
pnpm install --frozen-lockfile
# Apply database changes only through an explicitly reviewed migration.
# A source merge must never infer or push a production schema change.
# Rebuild composite TypeScript packages so declaration files stay in sync
cd lib/api-client-react && npx tsc --build && cd -
cd lib/api-zod && npx tsc --build 2>/dev/null || true && cd -
