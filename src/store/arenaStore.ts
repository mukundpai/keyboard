'use client';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ArenaRoom, ArenaPlayer } from '@/types/arena';

interface ArenaState {
  room: ArenaRoom | null;
  localPlayerId: string | null;
  /** null = no countdown; 0 = GO; 1-3 = countdown ticking */
  countdown: number | null;
  /** Error message from the server (room full, not found, etc.) */
  serverError: string | null;

  setRoom: (room: ArenaRoom) => void;
  patchRoom: (updates: Partial<ArenaRoom>) => void;
  setLocalPlayer: (id: string) => void;
  upsertPlayer: (player: ArenaPlayer) => void;
  removePlayer: (id: string) => void;
  updateProgress: (
    id: string,
    progress: number,
    wpm: number,
    accuracy: number,
  ) => void;
  markFinished: (id: string, rank: number, wpm: number, accuracy: number) => void;
  setCountdown: (n: number | null) => void;
  setServerError: (msg: string | null) => void;
  clearRoom: () => void;
}

export const useArenaStore = create<ArenaState>()(
  devtools(
    (set) => ({
      room: null,
      localPlayerId: null,
      countdown: null,
      serverError: null,

      setRoom: (room) => set({ room }),

      patchRoom: (updates) =>
        set((s) => ({ room: s.room ? { ...s.room, ...updates } : null })),

      setLocalPlayer: (id) => set({ localPlayerId: id }),

      upsertPlayer: (player) =>
        set((s) => {
          if (!s.room) return s;
          const exists = s.room.players.some((p) => p.id === player.id);
          return {
            room: {
              ...s.room,
              players: exists
                ? s.room.players.map((p) => (p.id === player.id ? player : p))
                : [...s.room.players, player],
            },
          };
        }),

      removePlayer: (id) =>
        set((s) => ({
          room: s.room
            ? { ...s.room, players: s.room.players.filter((p) => p.id !== id) }
            : null,
        })),

      updateProgress: (id, progress, wpm, accuracy) =>
        set((s) => ({
          room: s.room
            ? {
                ...s.room,
                players: s.room.players.map((p) =>
                  p.id === id ? { ...p, progress, wpm, accuracy } : p,
                ),
              }
            : null,
        })),

      markFinished: (id, rank, wpm, accuracy) =>
        set((s) => ({
          room: s.room
            ? {
                ...s.room,
                players: s.room.players.map((p) =>
                  p.id === id
                    ? { ...p, isFinished: true, progress: 100, rank, wpm, accuracy, finishedAt: Date.now() }
                    : p,
                ),
              }
            : null,
        })),

      setCountdown: (n) => set({ countdown: n }),

      setServerError: (msg) => set({ serverError: msg }),

      clearRoom: () => set({ room: null, localPlayerId: null, countdown: null, serverError: null }),
    }),
    { name: 'arena-store' },
  ),
);
