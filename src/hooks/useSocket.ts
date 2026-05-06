'use client';
import { useEffect, useRef, useCallback } from 'react';
import { connectSocket, disconnectSocket, getSocket } from '@/lib/socket';
import { useArenaStore } from '@/store/arenaStore';
import type { ArenaRoom, ArenaPlayer } from '@/types/arena';

export function useSocket(autoConnect = false) {
  const { setRoom, patchRoom, upsertPlayer, removePlayer, updateProgress } =
    useArenaStore();
  const connectedRef = useRef(false);

  const connect = useCallback(async () => {
    if (connectedRef.current) return;
    const socket = await connectSocket();
    connectedRef.current = true;

    socket.on('room:state', (room: ArenaRoom) => setRoom(room));
    socket.on('room:patch', (patch: Partial<ArenaRoom>) => patchRoom(patch));
    socket.on('player:join', (player: ArenaPlayer) => upsertPlayer(player));
    socket.on('player:leave', (id: string) => removePlayer(id));
    socket.on('player:progress', ({ id, progress, wpm, accuracy }: {
      id: string; progress: number; wpm: number; accuracy: number;
    }) => updateProgress(id, progress, wpm, accuracy));
  }, [setRoom, patchRoom, upsertPlayer, removePlayer, updateProgress]);

  const disconnect = useCallback(() => {
    disconnectSocket();
    connectedRef.current = false;
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
