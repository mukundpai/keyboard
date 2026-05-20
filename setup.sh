#!/usr/bin/env bash
# ============================================================
# KeyMaster Pro — Developer Setup Script (macOS / Linux)
# ============================================================
# Usage:
#   chmod +x setup.sh && ./setup.sh

set -euo pipefail

CYAN='\033[0;36m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'

step() { echo -e "\n${CYAN}[$1] $2${NC}\n$(printf '%0.s-' {1..48})"; }
ok()   { echo -e "  ${GREEN}✓ $1${NC}"; }
warn() { echo -e "  ${YELLOW}! $1${NC}"; }
fail() { echo -e "  ${RED}✗ $1${NC}"; exit 1; }

echo -e "\n  ${CYAN}KeyMaster Pro — Dev Setup${NC}"
echo -e "  ==========================\n"

# ── 0. Pre-flight checks ────────────────────────────────────
step 0 "Pre-flight checks"

for cmd in node npm docker; do
  if command -v "$cmd" &>/dev/null; then
    ok "$cmd $($cmd --version 2>&1 | head -1)"
  else
    fail "$cmd not found — please install it first"
  fi
done

NODE_MAJOR=$(node --version | sed 's/v//' | cut -d. -f1)
if [ "$NODE_MAJOR" -lt 20 ]; then
  fail "Node.js >= 20 required (found $NODE_MAJOR). Install via https://nodejs.org"
fi

# ── 1. Install dependencies ─────────────────────────────────
step 1 "Installing npm dependencies"
npm install
ok "Dependencies installed"

# ── 2. Environment file ─────────────────────────────────────
step 2 "Environment configuration"

if [ -f ".env.local" ]; then
  warn ".env.local already exists — skipping copy"
  warn "Edit it manually if you need to change values"
else
  cp .env.local.example .env.local
  ok "Copied .env.local.example → .env.local"
  warn "IMPORTANT: Open .env.local and set AUTH_SECRET:"
  warn "           Run: openssl rand -hex 32"
fi

# ── 3. Start Postgres via Docker ────────────────────────────
step 3 "Starting PostgreSQL (Docker)"

if docker ps --filter "name=keymasterpro_db" --format "{{.Names}}" | grep -q keymasterpro_db; then
  ok "keymasterpro_db already running"
else
  docker compose up -d
  ok "Docker container started"

  echo -n "  Waiting for Postgres to be ready"
  retries=0
  until [ "$(docker inspect --format '{{.State.Health.Status}}' keymasterpro_db 2>/dev/null)" = "healthy" ] || [ $retries -ge 15 ]; do
    echo -n "."
    sleep 2
    retries=$((retries + 1))
  done
  echo ""

  if [ "$(docker inspect --format '{{.State.Health.Status}}' keymasterpro_db 2>/dev/null)" != "healthy" ]; then
    fail "Postgres did not become healthy in time. Check: docker logs keymasterpro_db"
  fi
  ok "Postgres is healthy"
fi

# ── 4. Prisma — generate + migrate ──────────────────────────
step 4 "Prisma: generate client + run migrations"

npx prisma generate
ok "Prisma client generated"

npx prisma migrate deploy
ok "Migrations applied"

# ── 5. Seed database ────────────────────────────────────────
step 5 "Seeding database"

read -r -p "  Seed database with sample data? [y/N] " ans
if [[ "$ans" =~ ^[Yy]$ ]]; then
  npx tsx prisma/seed.ts
  ok "Database seeded"
else
  warn "Skipped seeding"
fi

# ── 6. Done ─────────────────────────────────────────────────
echo -e "\n  ${GREEN}Setup complete!${NC}\n"
echo "  Start dev servers:"
echo "    npm run dev:all    — Next.js (3000) + Socket.io (3001)"
echo "    npm run dev        — Next.js only"
echo "    npm run dev:socket — Socket.io server only"
echo ""
echo "  Other useful commands:"
echo "    npm run db:studio  — Prisma Studio (DB GUI)"
echo "    npm run db:reset   — Reset + reseed the database"
echo "    npm run type-check — TypeScript compile check"
echo ""
