'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Check, Users, Zap, Crown, Play, UserCircle2, AlertCircle } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useArenaStore } from '@/store/arenaStore';
import { useSocket } from '@/hooks/useSocket';
import { useUserStore } from '@/store/userStore';
import { cn } from '@/lib/utils';

// ─── Join panel (shown at /arena/[roomId] before connect) ─────────────────────

interface JoinPanelProps {
  roomId: string;
  onJoin: (username: string) => void;
  error: string | null;
}

function JoinPanel({ roomId, onJoin, error }: JoinPanelProps) {
  const profile = useUserStore((s) => s.profile);
  const [username, setUsername] = useState(profile?.username ?? '');
  const [joining, setJoining] = useState(false);

  const handleJoin = () => {
    const name = username.trim() || 'Guest';
    setJoining(true);
    onJoin(name);
  };

  return (
    <div className="glass-card p-8 flex flex-col items-center gap-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-accent-muted border border-accent/20 flex items-center justify-center">
        <Users size={24} className="text-accent-light" />
      </div>

      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-text-primary">Join Arena</h2>
        <p className="text-sm text-text-secondary">
          Room <span className="font-mono text-text-primary">#{roomId}</span>
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-danger bg-danger/10 border border-danger/20 rounded-lg px-4 py-2.5 w-full">
          <AlertCircle size={14} className="shrink-0" />
          {error}
        </div>
      )}

      <div className="w-full space-y-3">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
          placeholder="Your name"
          maxLength={20}
          className="w-full px-4 py-2.5 text-sm rounded-xl border border-border-active/40
                     bg-surface-raised text-text-primary placeholder:text-text-muted
                     focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          loading={joining}
          icon={<UserCircle2 size={16} />}
          onClick={handleJoin}
        >
          Join Race
        </Button>
      </div>
    </div>
  );
}

// ─── Create panel (shown at /arena before any room exists) ────────────────────

interface CreatePanelProps {
  onCreateRoom: () => void;
  creating: boolean;
  error: string | null;
}

function CreatePanel({ onCreateRoom, creating, error }: CreatePanelProps) {
  return (
    <div className="glass-card p-8 flex flex-col items-center gap-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-accent-muted border border-accent/20 flex items-center justify-center">
        <Zap size={24} className="text-accent-light" />
      </div>

      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-text-primary">Typing Arena</h2>
        <p className="text-sm text-text-secondary max-w-xs">
          Race up to 5 friends in real-time. First to finish wins.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-danger bg-danger/10 border border-danger/20 rounded-lg px-4 py-2.5 w-full">
          <AlertCircle size={14} className="shrink-0" />
          {error}
        </div>
      )}

      <Button
        variant="primary"
        size="lg"
        loading={creating}
        icon={<Users size={16} />}
        onClick={onCreateRoom}
      >
        Create Lobby
      </Button>
    </div>
  );
}

// ─── Main LobbyRoom ───────────────────────────────────────────────────────────

interface LobbyRoomProps {
  /** When provided, we are in a specific room page and should auto-join */
  roomId?: string;
}

export function LobbyRoom({ roomId: propRoomId }: LobbyRoomProps) {
  const router = useRouter();
  const { room, localPlayerId, serverError, setServerError } = useArenaStore();
  const { connect, emit } = useSocket();
  const profile = useUserStore((s) => s.profile);

  const [copied, setCopied] = useState(false);
  const [creating, setCreating] = useState(false);
  const [joined, setJoined] = useState(false);
  const [pendingNav, setPendingNav] = useState<string | null>(null);

  const username = profile?.username ?? 'Guest';
  const avatarUrl = profile?.avatarUrl;

  // Navigate to room page only after room state is set in store (avoids race)
  useEffect(() => {
    if (pendingNav && room && room.id === pendingNav) {
      router.push(`/arena/${pendingNav}`);
      setPendingNav(null);
    }
  }, [pendingNav, room, router]);

  const inviteUrl = room
    ? `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/arena/${room.id}`
    : null;

  const copyLink = useCallback(async () => {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [inviteUrl]);

  // Create a new room from the /arena page
  const createRoom = useCallback(async () => {
    setCreating(true);
    setServerError(null);
    const roomId = nanoid(8);
    await connect();
    emit('room:create', { roomId, username, avatarUrl });
    setPendingNav(roomId); // navigate once self:joined sets room in store
  }, [connect, emit, username, avatarUrl, setServerError]);

  // Join an existing room (called from JoinPanel or auto on mount)
  const joinRoom = useCallback(async (nameOverride?: string) => {
    if (!propRoomId || joined) return;
    setServerError(null);
    await connect();
    emit('room:join', {
      roomId: propRoomId,
      username: nameOverride ?? username,
      avatarUrl,
    });
    setJoined(true);
  }, [propRoomId, joined, connect, emit, username, avatarUrl, setServerError]);

  const toggleReady = useCallback(() => {
    emit('player:ready');
  }, [emit]);

  const startRace = useCallback(() => {
    emit('room:start');
  }, [emit]);

  // ── If we're in a room page but haven't joined yet, show join panel ────────
  if (propRoomId && !room) {
    return (
      <JoinPanel
        roomId={propRoomId}
        onJoin={joinRoom}
        error={serverError}
      />
    );
  }

  // ── If no room exists and no roomId prop, show create panel ───────────────
  if (!room) {
    return (
      <CreatePanel
        onCreateRoom={createRoom}
        creating={creating}
        error={serverError}
      />
    );
  }

  const isWaiting = room.status === 'waiting';
  const isHost = room.hostId === localPlayerId;
  const localPlayer = room.players.find((p) => p.id === localPlayerId);
  const isReady = localPlayer?.isReady ?? false;
  const allReady = room.players.length >= 1 && room.players.every((p) => p.isReady);

  const statusColors: Record<string, string> = {
    waiting: 'bg-warning/10 border-warning/25 text-warning',
    countdown: 'bg-accent-muted border-accent/25 text-accent-light',
    racing: 'bg-success/10 border-success/25 text-success',
    finished: 'bg-surface-elevated border-border-active/30 text-text-muted',
  };

  return (
    <div className="glass-card p-6 space-y-5">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-text-muted uppercase tracking-widest mb-0.5 font-mono">
            Lobby · {room.id}
          </p>
          <h2 className="text-lg font-semibold text-text-primary">
            {room.players.length}<span className="text-text-muted">/{room.maxPlayers}</span> players
          </h2>
        </div>
        <span className={cn('text-xs font-semibold px-3 py-1 rounded-full border capitalize', statusColors[room.status] ?? statusColors.waiting)}>
          {room.status}
        </span>
      </div>

      {/* ── Invite link ── */}
      {inviteUrl && (
        <div className="flex items-center gap-2">
          <div className="flex-1 truncate text-xs font-mono text-text-muted bg-surface-raised px-3 py-2 rounded-lg border border-border-active/30">
            {inviteUrl}
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={copied ? <Check size={13} className="text-success" /> : <Link2 size={13} />}
            onClick={copyLink}
          >
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
      )}

      {/* ── Server error ── */}
      {serverError && (
        <div className="flex items-center gap-2 text-sm text-danger bg-danger/10 border border-danger/20 rounded-lg px-3 py-2">
          <AlertCircle size={13} className="shrink-0" />
          {serverError}
        </div>
      )}

      {/* ── Player list ── */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-muted uppercase tracking-widest">Players</p>
        <AnimatePresence initial={false}>
          {room.players.map((player) => {
            const isLocal = player.id === localPlayerId;
            const isPlayerHost = player.id === room.hostId;
            return (
              <motion.div
                key={player.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className={cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-xl border',
                  isLocal
                    ? 'bg-accent-muted border-accent/30'
                    : 'bg-surface-raised border-border-active/20',
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {isPlayerHost && <Crown size={12} className="text-warning shrink-0" />}
                  <span className={cn(
                    'text-sm font-medium truncate',
                    isLocal ? 'text-text-primary' : 'text-text-secondary',
                  )}>
                    {player.username}
                    {isLocal && <span className="ml-1 text-xs text-text-muted font-normal">(you)</span>}
                  </span>
                </div>
                <span className={cn(
                  'text-xs font-semibold shrink-0',
                  player.isReady ? 'text-success' : 'text-text-muted',
                )}>
                  {player.isReady ? '✓ Ready' : '…'}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Empty slots */}
        {Array.from({ length: Math.max(0, room.maxPlayers - room.players.length) }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="flex items-center px-3 py-2.5 rounded-xl border border-dashed border-border-active/15"
          >
            <span className="text-xs text-text-disabled">Waiting for player…</span>
          </div>
        ))}
      </div>

      {/* ── Actions (waiting state only) ── */}
      {isWaiting && (
        <div className="flex flex-col gap-2 pt-1">
          {/* Ready toggle */}
          <Button
            variant={isReady ? 'outline' : 'primary'}
            size="lg"
            className="w-full"
            onClick={toggleReady}
          >
            {isReady ? 'Cancel Ready' : 'Ready Up'}
          </Button>

          {/* Host-only: start race */}
          {isHost && (
            <Button
              variant="ghost"
              size="md"
              className="w-full"
              disabled={!allReady}
              icon={<Play size={14} />}
              onClick={startRace}
            >
              {allReady ? 'Start Race' : 'Waiting for all to ready…'}
            </Button>
          )}
        </div>
      )}

      {/* ── Waiting message for non-host during countdown / racing ── */}
      {!isWaiting && room.status !== 'finished' && (
        <p className="text-center text-sm text-text-muted pt-1">
          {room.status === 'countdown' ? 'Get ready…' : 'Race in progress!'}
        </p>
      )}
    </div>
  );
}

