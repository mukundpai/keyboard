'use client';
import { useEffect, useCallback } from 'react';
import { connectSocket, disconnectSocket, getSocket, areListenersSetUp, markListenersSetUp } from '@/lib/socket';
import { useArenaStore } from '@/store/arenaStore';
import type { ArenaRoom, ArenaPlayer } from '@/types/arena';

export function useSocket(autoConnect = false) {
  const {
    setRoom,
    patchRoom,
    upsertPlayer,
    removePlayer,
    updateProgress,
    markFinished,
    setLocalPlayer,
    setCountdown,
    setServerError,
  } = useArenaStore();

  const connect = useCallback(async () => {
    const socket = await connectSocket();
    // Guard: only register listeners once per socket singleton lifetime
    if (areListenersSetUp()) return;
    markListenersSetUp();

    // Full room snapshot sent only to the joining player
    socket.on('self:joined', ({ playerId, room }: { playerId: string; room: ArenaRoom }) => {
      setLocalPlayer(playerId);
      setRoom(room);
    });

    // Full room state push
    socket.on('room:state', (room: ArenaRoom) => setRoom(room));

    // Partial update (player list, hostId, status)
    socket.on('room:patch', (patch: Partial<ArenaRoom>) => patchRoom(patch));

    // Another player joined
    socket.on('player:join', (player: ArenaPlayer) => upsertPlayer(player));

    // A player left
    socket.on('player:leave', (id: string) => removePlayer(id));

    // Live typing progress
    socket.on('player:progress', ({ id, progress, wpm, accuracy }: {
      id: string; progress: number; wpm: number; accuracy: number;
    }) => updateProgress(id, progress, wpm, accuracy));

    // A player finished the race
    socket.on('player:finish', ({ id, rank, wpm, accuracy }: {
      id: string; rank: number; wpm: number; accuracy: number;
    }) => markFinished(id, rank, wpm, accuracy));

    // Countdown tick: 3 → 2 → 1 → 0 (GO)
    socket.on('room:countdown', ({ seconds }: { seconds: number }) => {
      setCountdown(seconds);
    });

    // Race officially started — room now carries the text
    socket.on('room:start', (room: ArenaRoom) => {
      setRoom(room);
      setTimeout(() => setCountdown(null), 800);
    });

    // Race ended (all finished or timeout)
    socket.on('room:end', (room: ArenaRoom) => {
      setRoom(room);
    });

    // Server-side errors
    socket.on('room:error', ({ message }: { message: string }) => {
      setServerError(message);
    });
  }, [
    setRoom, patchRoom, upsertPlayer, removePlayer, updateProgress,
    markFinished, setLocalPlayer, setCountdown, setServerError,
  ]);

  const disconnect = useCallback(() => {
    disconnectSocket();
  }, []);

  const emit = useCallback(async (event: string, payload?: unknown) => {
    const socket = await getSocket();
    socket.emit(event, payload);
  }, []);

  useEffect(() => {
    if (autoConnect) connect();
    return () => { if (autoConnect) disconnect(); };
  }, [autoConnect, connect, disconnect]);

  return { connect, disconnect, emit };
}
