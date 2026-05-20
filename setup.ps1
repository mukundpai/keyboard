# ============================================================
# KeyMaster Pro — Developer Setup Script (Windows PowerShell)
# ============================================================
# Run from the keyboard/ directory:
#   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
#   .\setup.ps1

$ErrorActionPreference = "Stop"

function Write-Step($n, $msg) {
  Write-Host ""
  Write-Host "[$n] $msg" -ForegroundColor Cyan
  Write-Host ("-" * 48) -ForegroundColor DarkGray
}

function Write-OK($msg)   { Write-Host "  ✓ $msg" -ForegroundColor Green }
function Write-Warn($msg) { Write-Host "  ! $msg" -ForegroundColor Yellow }
function Write-Fail($msg) { Write-Host "  ✗ $msg" -ForegroundColor Red }

Write-Host ""
Write-Host "  KeyMaster Pro — Dev Setup" -ForegroundColor Magenta
Write-Host "  ==========================" -ForegroundColor DarkGray

# ── 0. Pre-flight checks ────────────────────────────────────
Write-Step 0 "Pre-flight checks"

foreach ($cmd in @("node", "npm", "docker")) {
  if (Get-Command $cmd -ErrorAction SilentlyContinue) {
    $ver = & $cmd --version 2>&1 | Select-Object -First 1
    Write-OK "$cmd $ver"
  } else {
    Write-Fail "$cmd not found — please install it first"
    exit 1
  }
}

$nodeVer = (node --version).TrimStart("v").Split(".")[0]
if ([int]$nodeVer -lt 20) {
  Write-Fail "Node.js >= 20 required (found $nodeVer). Install via https://nodejs.org"
  exit 1
}

# ── 1. Install dependencies ─────────────────────────────────
Write-Step 1 "Installing npm dependencies"
npm install
Write-OK "Dependencies installed"

# ── 2. Environment file ─────────────────────────────────────
Write-Step 2 "Environment configuration"

if (Test-Path ".env.local") {
  Write-Warn ".env.local already exists — skipping copy"
  Write-Warn "Edit it manually if you need to change values"
} else {
  Copy-Item ".env.local.example" ".env.local"
  Write-OK "Copied .env.local.example → .env.local"
  Write-Warn "IMPORTANT: Open .env.local and set AUTH_SECRET to a random 32-char hex string"
  Write-Warn "           Run: node -e `"console.log(require('crypto').randomBytes(32).toString('hex'))`""
}

# ── 3. Start Postgres via Docker ────────────────────────────
Write-Step 3 "Starting PostgreSQL (Docker)"

$running = docker ps --filter "name=keymasterpro_db" --format "{{.Names}}" 2>&1
if ($running -match "keymasterpro_db") {
  Write-OK "keymasterpro_db already running"
} else {
  docker compose up -d
  Write-OK "Docker container started"

  Write-Host "  Waiting for Postgres to be ready..." -ForegroundColor DarkGray
  $retries = 0
  do {
    Start-Sleep -Seconds 2
    $health = docker inspect --format "{{.State.Health.Status}}" keymasterpro_db 2>&1
    $retries++
  } while ($health -ne "healthy" -and $retries -lt 15)

  if ($health -ne "healthy") {
    Write-Fail "Postgres did not become healthy in time. Check: docker logs keymasterpro_db"
    exit 1
  }
  Write-OK "Postgres is healthy"
}

# ── 4. Prisma — generate + migrate ──────────────────────────
Write-Step 4 "Prisma: generate client + run migrations"

npx prisma generate
Write-OK "Prisma client generated"

npx prisma migrate deploy
Write-OK "Migrations applied"

# ── 5. Seed database ────────────────────────────────────────
Write-Step 5 "Seeding database"

$ans = Read-Host "  Seed database with sample data? [y/N]"
if ($ans -match "^[Yy]$") {
  npx tsx prisma/seed.ts
  Write-OK "Database seeded"
} else {
  Write-Warn "Skipped seeding"
}

# ── 6. Done ─────────────────────────────────────────────────
Write-Host ""
Write-Host "  Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "  Start dev servers:" -ForegroundColor White
Write-Host "    npm run dev:all    — Next.js (3000) + Socket.io (3001)" -ForegroundColor DarkGray
Write-Host "    npm run dev        — Next.js only" -ForegroundColor DarkGray
Write-Host "    npm run dev:socket — Socket.io server only" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  Other useful commands:" -ForegroundColor White
Write-Host "    npm run db:studio  — Prisma Studio (DB GUI)" -ForegroundColor DarkGray
Write-Host "    npm run db:reset   — Reset + reseed the database" -ForegroundColor DarkGray
Write-Host "    npm run type-check — TypeScript compile check" -ForegroundColor DarkGray
Write-Host ""
