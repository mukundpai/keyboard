'use client';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useUserStore } from '@/store/userStore';
import { xpToLevel } from '@/lib/calculations';

/**
 * Syncs the NextAuth session into the Zustand user store so all
 * client components that read from the store see the correct auth state.
 */
export function StoreHydration() {
  const { data: session, status } = useSession();
  const setProfile = useUserStore((s) => s.setProfile);
  const clearProfile = useUserStore((s) => s.clearProfile);

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'authenticated' && session?.user) {
      const { id, name, email, image } = session.user;
      const username = name ?? email?.split('@')[0] ?? 'Player';
      const { level, xpToNextLevel } = xpToLevel(0);

      setProfile({
        id,
        username,
        avatarUrl: image ?? undefined,
        level,
        xp: 0,
        xpToNextLevel,
        joinedAt: Date.now(),
        stats: {
          totalTests: 0,
          totalTimeTyping: 0,
          bestWpm: 0,
          avgWpm: 0,
          avgAccuracy: 0,
          totalWords: 0,
          streak: 0,
          lastActive: Date.now(),
        },
        badges: [],
      });
    } else if (status === 'unauthenticated') {
      clearProfile();
    }
  }, [status, session, setProfile, clearProfile]);

  return null;
}
