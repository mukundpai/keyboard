'use client';

import { useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';
import { useArenaStore } from '@/store/arenaStore';
import { useUserStore } from '@/store/userStore';
import { LobbyRoom } from '@/components/arena/LobbyRoom';
import { ArenaTyping } from '@/components/arena/ArenaTyping';
import { RaceTrack } from '@/components/arena/RaceTrack';
import { RaceResults } from '@/components/arena/RaceResults';
import { CountdownOverlay } from '@/components/arena/CountdownOverlay';

export default function ArenaRoomPage() {
  const params = useParams<{ roomId: string }>();
  const router = useRouter();
  const roomId = params.roomId;

  const { room, localPlayerId, countdown, clearRoom } = useArenaStore();
  const { connect, emit } = useSocket();
  const profile = useUserStore((s) => s.profile);
  const leftRef = useRef(false);

  // Connect socket on mount (the actual join is handled inside LobbyRoom)
  useEffect(() => {
    connect();
  }, [connect]);

  // Leave room + clean up on unmount.
  // Guard: StrictMode double-invokes effects; only run cleanup on a real unmount
  // by gating on a short timeout that won't fire during the simulated unmount.
  useEffect(() => {
    const canCleanup = { value: false };
    const t = setTimeout(() => { canCleanup.value = true; }, 300);
    return () => {
      clearTimeout(t);
      if (!canCleanup.value || leftRef.current) return;
      leftRef.current = true;
      emit('room:leave', { roomId });
      clearRoom();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  const handlePlayAgain = () => {
    // Server auto-resets room to 'waiting' after 30s; just reload state
    router.refresh();
  };

  const isWaiting = !room || room.status === 'waiting';
  const isRacing = room?.status === 'racing';
  const isFinished = room?.status === 'finished';
  const showCountdown = countdown !== null;

  return (
    <>
      {/* ── Full-screen countdown overlay ── */}
      <CountdownOverlay seconds={countdown} />

      <section className="relative min-h-[calc(100dvh-11rem)] px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-7xl space-y-6">

          {/* ── Page title ── */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <Swords size={18} className="text-accent-light" />
            <h1 className="text-xl font-bold text-text-primary">
              Arena{' '}
              <span className="font-mono text-text-muted text-base font-normal">
                #{roomId}
              </span>
            </h1>
          </motion.div>

          {/* ── Main layout ── */}
          <div className="grid lg:grid-cols-[1fr_320px] gap-5 items-start">

            {/* ── Left column: lobby / typing / results ── */}
            <AnimatePresence mode="wait">
              {isFinished ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                >
                  <RaceResults
                    players={room!.players}
                    localPlayerId={localPlayerId}
                    onPlayAgain={handlePlayAgain}
                  />
                </motion.div>
              ) : isRacing ? (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <ArenaTyping />
                </motion.div>
              ) : (
                <motion.div
                  key="lobby"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <LobbyRoom roomId={roomId} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Right column: live race track (visible once room exists) ── */}
            <AnimatePresence>
              {room && (isRacing || isFinished || room.players.length > 1) && (
                <motion.div
                  key="track"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ delay: 0.1 }}
                >
                  <RaceTrack players={room.players} localPlayerId={localPlayerId} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
}

