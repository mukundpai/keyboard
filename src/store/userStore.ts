'use client';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { UserProfile } from '@/types/user';
import { xpToLevel } from '@/lib/calculations';

interface UserState {
  profile: UserProfile | null;
  isAuthenticated: boolean;

  setProfile: (profile: UserProfile) => void;
  recordTest: (wpm: number, accuracy: number, xpGained: number) => void;
  clearProfile: () => void;
}

const isDev = process.env.NODE_ENV === 'development';

const storeImpl = (set: Parameters<typeof create<UserState>>[0]) => ({
  profile: null as UserProfile | null,
  isAuthenticated: false,

  setProfile: (profile: UserProfile) =>
    set({ profile, isAuthenticated: true }),

  recordTest: (wpm: number, accuracy: number, xpGained: number) =>
    set((s) => {
      if (!s.profile) return s;

      const newXP = s.profile.xp + xpGained;
      const { level, xpToNextLevel } = xpToLevel(newXP);
      const prevStats = s.profile.stats;
      const n = prevStats.totalTests;

      return {
        profile: {
          ...s.profile,
          xp: newXP,
          level,
          xpToNextLevel,
          stats: {
            ...prevStats,
            totalTests: n + 1,
            bestWpm: Math.max(prevStats.bestWpm, wpm),
            avgWpm: Math.round((prevStats.avgWpm * n + wpm) / (n + 1)),
            avgAccuracy:
              Math.round(
                ((prevStats.avgAccuracy * n + accuracy) / (n + 1)) * 10,
              ) / 10,
          },
        },
      };
    }),

  clearProfile: () =>
    set({ profile: null, isAuthenticated: false }),
});

export const useUserStore = create<UserState>()(
  isDev
    ? devtools(storeImpl as Parameters<typeof devtools>[0], { name: 'user-store' })
    : storeImpl as Parameters<typeof create<UserState>>[0],
);
