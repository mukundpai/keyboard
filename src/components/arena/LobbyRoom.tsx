'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Check, Users, Zap } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useArenaStore } from '@/store/arenaStore';
import { useSocket } from '@/hooks/useSocket';
import { cn } from '@/lib/utils';

export function LobbyRoom() {
  const router = useRouter();
  const { room } = useArenaStore();
  const { connect, emit } = useSocket();

  const [copied, setCopied] = useState(false);
  const [creating, setCreating] = useState(false);

  const inviteUrl = room
    ? `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/arena/${room.id}`
    : null;

  /* Copy invite link */
  const copyLink = useCallback(async () => {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [inviteUrl]);

  /* Create a new lobby room */
  const createRoom = useCallback(() => {
    setCreating(true);
    const roomId = nanoid(8);
    connect();
    emit('room:create', { roomId });
    router.push(`/arena/${roomId}`);
  }, [connect, emit, router]);

  /* Ready up */
  const setReady = useCallback(() => {
    emit('player:ready');
  }, [emit]);

  if (!room) {
    return (
      <div className="glass-card p-8 flex flex-col items-center gap-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-accent-muted border border-accent/20
                        flex items-center justify-center">
          <Zap size={24} className="text-accent-light" />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-text-primary">Typing Arena</h2>
          <p className="text-sm text-text-secondary max-w-xs">
            Race up to 5 friends in real-time. First to finish wins.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          loading={creating}
          icon={<Users size={16} />}
          onClick={createRoom}
        >
          Create Lobby
        </Button>
      </div>
    );
  }

  const isWaiting = room.status === 'waiting';

  return (
    <div className="glass-card p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-text-muted uppercase tracking-widest mb-0.5">
            Lobby · {room.id}
          </p>
          <h2 className="text-lg font-semibold text-text-primary">
            {room.players.length}/{room.maxPlayers} players
          </h2>
        </div>

        {/* Status badge */}
        <span
          className={cn(
            'text-xs font-semibold px-3 py-1 rounded-full border',
            isWaiting
              ? 'bg-warning/10 border-warning/25 text-warning'
              : 'bg-success/10 border-success/25 text-success',
          )}
        >
          {room.status}
        </span>
      </div>

      {/* Invite link */}
      {inviteUrl && (
        <div className="flex items-center gap-2">
          <div className="flex-1 truncate text-xs font-mono text-text-muted
                          bg-surface-raised px-3 py-2 rounded-lg border border-border-active/30">
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

      {/* Player list */}
      <div className="space-y-2">
        {room.players.map((player) => (
          <motion.div
            key={player.id}
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg
                       bg-surface-raised border border-border-active/20"
          >
            <span className="text-sm text-text-secondary">{player.username}</span>
            <span
              className={cn(
                'text-xs font-medium',
                player.isReady ? 'text-success' : 'text-text-muted',
              )}
            >
              {player.isReady ? '✓ Ready' : 'Waiting…'}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Ready button */}
      {isWaiting && (
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={setReady}
        >
          Ready Up
        </Button>
      )}
    </div>
  );
}
