'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSocket } from '@/hooks/useSocket';
import { useArenaStore } from '@/store/arenaStore';
import { RaceTrack } from '@/components/arena/RaceTrack';
import { TypingEngine } from '@/components/typing/TypingEngine';
import { LobbyRoom } from '@/components/arena/LobbyRoom';

export default function ArenaRoomPage() {
  const params = useParams<{ roomId: string }>();
  const { room, localPlayerId } = useArenaStore();
  const { connect, emit } = useSocket();

  /* Join room on mount */
  useEffect(() => {
    connect();
    emit('room:join', { roomId: params.roomId });
    return () => {
      emit('room:leave', { roomId: params.roomId });
    };
  }, [params.roomId, connect, emit]);

  const isRacing = room?.status === 'racing';
  const isFinished = room?.status === 'finished';

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-text-primary"
      >
        Arena <span className="text-gradient">#{params.roomId}</span>
      </motion.h1>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">

        {/* Left: typing or lobby */}
        <div>
          {isRacing || isFinished ? (
            <TypingEngine />
          ) : (
            <LobbyRoom />
          )}
        </div>

        {/* Right: live race track */}
        {room && (
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <RaceTrack players={room.players} localPlayerId={localPlayerId} />
          </motion.div>
        )}
      </div>
    </section>
  );
}
