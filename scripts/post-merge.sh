#!/bin/bash
set -e
pnpm install --frozen-lockfile
pnpm --filter db push
# Rebuild composite TypeScript packages so declaration files stay in sync
cd lib/api-client-react && npx tsc --build && cd -
cd lib/api-zod && npx tsc --build 2>/dev/null || true && cd -
