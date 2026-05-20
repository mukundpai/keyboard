# KeyMaster Pro — Developer Guide

## Prerequisites

| Tool | Minimum | Notes |
|---|---|---|
| Node.js | v20+ | [nodejs.org](https://nodejs.org) |
| npm | v10+ | Bundled with Node |
| Docker | any | For local Postgres |
| Git | any | Version control |

---

## Quick Start

### 1 · Clone and enter the project

```bash
git clone <repo-url>
cd keyboard
```

### 2 · Run the setup script

**Windows (PowerShell):**
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\setup.ps1
```

**macOS / Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

The script will:
- Verify Node.js and Docker are installed
- Run `npm install`
- Copy `.env.local.example` → `.env.local`
- Start the PostgreSQL Docker container
- Generate the Prisma client
- Apply all database migrations
- Optionally seed the database with sample data

### 3 · Set AUTH_SECRET in .env.local

Open `.env.local` and replace the placeholder:

```bash
# Generate a secure secret
openssl rand -hex 32        # macOS / Linux
# or
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Paste the output as the value of `AUTH_SECRET`.

### 4 · Start dev servers

```bash
npm run dev:all
```

This starts both servers concurrently:
- **Next.js** → `http://localhost:3000`
- **Socket.io** → `http://localhost:3001` (arena multiplayer)

---

## Environment Variables

Copy `.env.local.example` to `.env.local`. All required variables:

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_SOCKET_URL` | Socket.io server URL (client-visible) | `http://localhost:3001` |
| `NEXT_PUBLIC_APP_URL` | App base URL (client-visible) | `http://localhost:3000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5433/keymasterpro` |
| `AUTH_SECRET` | NextAuth signing secret (32-char hex) | `openssl rand -hex 32` |
| `AUTH_URL` | NextAuth base URL | `http://localhost:3000` |
| `ADMIN_EMAILS` | Comma-separated admin email addresses | `you@example.com` |

---

## npm Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Next.js dev server (port 3000) |
| `npm run dev:socket` | Start Socket.io server with hot-reload (port 3001) |
| `npm run dev:all` | Start both servers concurrently |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run type-check` | TypeScript compile check (no emit) |
| `npm run lint` | ESLint |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:migrate` | Create + apply a new migration (dev) |
| `npm run db:migrate:prod` | Apply pending migrations (production) |
| `npm run db:seed` | Seed the database |
| `npm run db:reset` | Drop, re-migrate, and reseed the database |
| `npm run db:studio` | Open Prisma Studio at `http://localhost:5555` |
| `npm run db:push` | Push schema changes without a migration file |

---

## Project Structure

```
keyboard/
├── socket-server.ts        # Standalone Socket.io server (port 3001)
├── docker-compose.yml      # PostgreSQL container
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── migrations/         # Migration history
│   └── seed.ts             # Database seeder
└── src/
    ├── app/                # Next.js App Router pages
    │   ├── arena/          # Multiplayer racing feature
    │   ├── auth/           # Sign-in / sign-up pages
    │   ├── challenge/      # Daily challenge
    │   ├── leaderboard/    # Global rankings
    │   └── admin/          # Admin dashboard
    ├── components/
    │   └── arena/          # Arena-specific components
    │       ├── LobbyRoom.tsx
    │       ├── ArenaTyping.tsx
    │       ├── CountdownOverlay.tsx
    │       ├── RaceResults.tsx
    │       └── RaceTrack.tsx
    ├── hooks/
    │   └── useSocket.ts    # Socket.io React hook
    ├── store/
    │   └── arenaStore.ts   # Zustand store for arena state
    ├── lib/
    │   ├── socket.ts       # Socket.io singleton (client)
    │   └── supabase.ts     # (unused — legacy reference)
    └── types/
        └── arena.ts        # Arena TypeScript types
```

---

## Architecture

### Next.js App Router
- Server components by default; add `'use client'` only where needed
- Auth via **NextAuth v5** (`src/auth.ts`)
- Middleware at `src/middleware.ts` protects `/admin`, `/account`, `/arena` routes

### Database
- **PostgreSQL** in Docker (port `5433` locally)
- **Prisma ORM** with generated client at `src/generated/prisma`
- Schema: `User`, `Account`, `Session`, `TypingResult`

### Real-time Arena (Socket.io)
- **socket-server.ts** runs as a separate Node process on port `3001`
- In-memory room state (no DB) — rooms reset on server restart
- Client singleton in `src/lib/socket.ts` — one connection per browser tab
- Event flow:

```
client              server
  |── room:create ──▶ creates room, assigns host
  |◀─ self:joined ─── sends playerId + full room state
  |── player:ready ──▶ marks player ready
  |── room:start ───▶ triggers 3-2-1 countdown
  |◀─ room:countdown ─ ticks 3, 2, 1, 0 (GO)
  |◀─ room:start ───── broadcasts race text + status=racing
  |── player:progress ▶ live wpm/accuracy updates
  |── player:finish ──▶ records rank + final stats
  |◀─ room:end ──────── all finished or 3min timeout
```

### State Management
- **Zustand** stores: `arenaStore`, `userStore`
- Arena store manages: `room`, `localPlayerId`, `countdown`, `serverError`

---

## Database Migrations

**Create a new migration after changing schema.prisma:**
```bash
npm run db:migrate -- --name describe_your_change
```

**Apply existing migrations (CI / fresh clone):**
```bash
npx prisma migrate deploy
```

**Inspect the database visually:**
```bash
npm run db:studio
# Opens http://localhost:5555
```

---

## Common Issues

### Port already in use
```powershell
# Windows — free port 3001 (socket server)
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3001 | Select -ExpandProperty OwningProcess -First 1) -Force

# macOS / Linux
lsof -ti:3001 | xargs kill -9
```

### Prisma client out of sync
```bash
npm run db:generate
```

### Docker container not healthy
```bash
docker logs keymasterpro_db
docker compose restart
```

### TypeScript errors after pulling changes
```bash
npm install          # new packages may have been added
npm run db:generate  # schema may have changed
npm run type-check   # verify
```

---

## Arena Manual Testing

1. Start both servers: `npm run dev:all`
2. Open `http://localhost:3000/arena`
3. Click **Create Lobby** — you'll be redirected to `/arena/[roomId]`
4. Open a second browser tab/window with the invite link shown
5. Enter a username in the second window and click **Join Race**
6. Both players click **Ready Up**
7. Host clicks **Start Race** — 3→2→1→GO countdown fires
8. Both windows can type; watch live progress bars update
9. First to finish sees the results podium
