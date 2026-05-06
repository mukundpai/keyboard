'use client';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ChallengeInvite, ChallengeLink } from '@/types/challenge';

interface ChallengeState {
  // Current active challenge (if any)
  activeChallenge: ChallengeInvite | null;
  challenges: Map<string, ChallengeInvite>;
  
  // Create new challenge invite
  createChallenge: (inviterId: string, inviterName: string, config: { mode: 'time' | 'words'; duration: number }) => ChallengeLink;
  
  // Get challenge by code
  getChallenge: (code: string) => ChallengeInvite | undefined;
  
  // Accept challenge
  acceptChallenge: (code: string, inviteeId: string) => void;
  
  // Submit results to challenge
  submitChallengeResults: (code: string, results: { wpm: number; accuracy: number }, isInviter: boolean) => void;
  
  // Set active challenge
  setActiveChallenge: (challenge: ChallengeInvite | null) => void;
  
  // Get challenge results comparison
  getChallengeResults: (code: string) => { inviter: any; invitee: any; winner: string | null } | null;
}

// Helper to generate short challenge code
const generateCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const useChallengeStore = create<ChallengeState>()(
  devtools(
    (set, get) => ({
      activeChallenge: null,
      challenges: new Map(),

      createChallenge: (inviterId, inviterName, config) => {
        const code = generateCode();
        const now = Date.now();
        const challenge: ChallengeInvite = {
          id: `challenge_${now}_${code}`,
          code,
          inviterId,
          inviterName,
          status: 'pending',
          config,
          createdAt: now,
          expiresAt: now + 48 * 60 * 60 * 1000, // 48 hours
        };

        set((state) => {
          const newChallenges = new Map(state.challenges);
          newChallenges.set(code, challenge);
          return { challenges: newChallenges };
        });

        const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/challenge/${code}`;
        return { code, url, expiresAt: challenge.expiresAt };
      },

      getChallenge: (code: string) => {
        return get().challenges.get(code);
      },

      acceptChallenge: (code: string, inviteeId: string) => {
        const challenge = get().challenges.get(code);
        if (!challenge) return;

        const updated = { ...challenge, status: 'accepted' as const, inviteeId };
        set((state) => {
          const newChallenges = new Map(state.challenges);
          newChallenges.set(code, updated);
          return { challenges: newChallenges };
        });
      },

      submitChallengeResults: (code: string, results, isInviter: boolean) => {
        const challenge = get().challenges.get(code);
        if (!challenge) return;

        const updated = {
          ...challenge,
          [isInviter ? 'inviterResults' : 'inviteeResults']: {
            ...results,
            timestamp: Date.now(),
          },
          status: (challenge.inviterResults && challenge.inviteeResults) ? 'completed' as const : 'active' as const,
          completedAt: (challenge.inviterResults && challenge.inviteeResults) ? Date.now() : undefined,
        };

        set((state) => {
          const newChallenges = new Map(state.challenges);
          newChallenges.set(code, updated);
          return { challenges: newChallenges };
        });
      },

      setActiveChallenge: (challenge) => {
        set({ activeChallenge: challenge });
      },

      getChallengeResults: (code: string) => {
        const challenge = get().challenges.get(code);
        if (!challenge || !challenge.inviterResults || !challenge.inviteeResults) return null;

        const inviter = challenge.inviterResults;
        const invitee = challenge.inviteeResults;
        
        let winner: string | null = null;
        if (inviter.wpm > invitee.wpm) {
          winner = challenge.inviterId;
        } else if (invitee.wpm > inviter.wpm) {
          winner = challenge.inviteeId || 'invitee';
        }

        return { inviter, invitee, winner };
      },
    }),
    { name: 'challenge-store' },
  ),
);
