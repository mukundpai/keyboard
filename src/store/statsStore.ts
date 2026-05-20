'use client';

/**
 * statsStore — persisted across sessions via localStorage.
 * Stores test history, per-key error totals, streak, and
 * completed drill IDs for the badge system.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TestResults } from '@/types/typing';
import { BADGE_DEFS, type BadgeDef } from '@/data/badges';

/** A lightweight summary stored per session (not the full result). */
export interface HistoryEntry {
  timestamp: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  duration: number;
  mode: string;
}

interface StatsState {
  /** Last 200 test summaries, newest first. */
  history: HistoryEntry[];

  /** Cumulative per-key error counts across all tests. */
  keyErrors: Record<string, number>;

  /** IDs of drills the user has completed at least once. */
  completedDrillIds: string[];

  /** Number of daily challenges ever completed. */
  dailyChallengesCompleted: number;

  /** YYYY-MM-DD of the last daily challenge completed. */
  lastDailyChallengeDate: string;

  /** Current consecutive-day practice streak. */
  streak: number;

  /** Epoch ms for the last day the user completed a test. */
  lastActiveDayMs: number;

  /** IDs of badges already awarded (to avoid duplicate toasts). */
  awardedBadgeIds: string[];

  // ── Actions ──────────────────────────────────────────────────────────────
  recordResult: (result: TestResults) => { newBadges: BadgeDef[] };
  markDrillComplete: (drillId: string) => { newBadges: BadgeDef[] };
  recordDailyChallenge: () => { newBadges: BadgeDef[] };
  clearHistory: () => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function startOfDayMs(ms: number): number {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function checkNewBadges(
  awarded: string[],
  input: Parameters<BadgeDef['check']>[0],
): BadgeDef[] {
  return BADGE_DEFS.filter(
    (b) => !awarded.includes(b.id) && b.check(input),
  );
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      history: [],
      keyErrors: {},
      completedDrillIds: [],
      dailyChallengesCompleted: 0,
      lastDailyChallengeDate: '',
      streak: 0,
      lastActiveDayMs: 0,
      awardedBadgeIds: [],

      recordResult: (result) => {
        const state = get();

        // ── Merge per-key errors ──
        const merged = { ...state.keyErrors };
        for (const [key, count] of Object.entries(result.keyErrors ?? {})) {
          merged[key] = (merged[key] ?? 0) + count;
        }

        // ── Update streak ──
        const today = startOfDayMs(Date.now());
        const lastDay = startOfDayMs(state.lastActiveDayMs || 0);
        const daysDiff = (today - lastDay) / 86_400_000;
        const newStreak =
          daysDiff === 0
            ? state.streak               // already practiced today
            : daysDiff === 1
              ? state.streak + 1         // consecutive day
              : 1;                       // streak broken

        // ── History ──
        const entry: HistoryEntry = {
          timestamp:   result.timestamp,
          wpm:         result.wpm,
          rawWpm:      result.rawWpm,
          accuracy:    result.accuracy,
          consistency: result.consistency,
          duration:    result.duration,
          mode:        result.mode,
        };
        const history = [entry, ...state.history].slice(0, 200);

        // ── Compute derived stats for badge checks ──
        const bestWpm = history.reduce((m, h) => Math.max(m, h.wpm), 0);
        const avgAcc =
          history.length
            ? Math.round(
                (history.reduce((s, h) => s + h.accuracy, 0) / history.length) * 10,
              ) / 10
            : 0;

        // ── Check new badges ──
        const newBadges = checkNewBadges(state.awardedBadgeIds, {
          bestWpm,
          avgAccuracy: avgAcc,
          totalTests: history.length,
          streak: newStreak,
          completedDrillIds: state.completedDrillIds,
          dailyChallengesCompleted: state.dailyChallengesCompleted,
        });

        set({
          history,
          keyErrors: merged,
          streak: newStreak,
          lastActiveDayMs: Date.now(),
          awardedBadgeIds: [
            ...state.awardedBadgeIds,
            ...newBadges.map((b) => b.id),
          ],
        });

        return { newBadges };
      },

      markDrillComplete: (drillId) => {
        const state = get();
        if (state.completedDrillIds.includes(drillId)) return { newBadges: [] };

        const completedDrillIds = [...state.completedDrillIds, drillId];
        const history = state.history;
        const bestWpm = history.reduce((m, h) => Math.max(m, h.wpm), 0);
        const avgAcc =
          history.length
            ? Math.round(
                (history.reduce((s, h) => s + h.accuracy, 0) / history.length) * 10,
              ) / 10
            : 0;

        const newBadges = checkNewBadges(state.awardedBadgeIds, {
          bestWpm,
          avgAccuracy: avgAcc,
          totalTests: history.length,
          streak: state.streak,
          completedDrillIds,
          dailyChallengesCompleted: state.dailyChallengesCompleted,
        });

        set({
          completedDrillIds,
          awardedBadgeIds: [
            ...state.awardedBadgeIds,
            ...newBadges.map((b) => b.id),
          ],
        });

        return { newBadges };
      },

      recordDailyChallenge: () => {
        const state = get();
        const dailyChallengesCompleted = state.dailyChallengesCompleted + 1;
        const history = state.history;
        const bestWpm = history.reduce((m, h) => Math.max(m, h.wpm), 0);
        const avgAcc =
          history.length
            ? Math.round(
                (history.reduce((s, h) => s + h.accuracy, 0) / history.length) * 10,
              ) / 10
            : 0;

        const newBadges = checkNewBadges(state.awardedBadgeIds, {
          bestWpm,
          avgAccuracy: avgAcc,
          totalTests: history.length,
          streak: state.streak,
          completedDrillIds: state.completedDrillIds,
          dailyChallengesCompleted,
        });

        set({
          dailyChallengesCompleted,
          lastDailyChallengeDate: new Date().toISOString().slice(0, 10),
          awardedBadgeIds: [
            ...state.awardedBadgeIds,
            ...newBadges.map((b) => b.id),
          ],
        });

        return { newBadges };
      },

      clearHistory: () =>
        set({
          history: [],
          keyErrors: {},
          streak: 0,
          lastActiveDayMs: 0,
        }),
    }),
    { name: 'keymaster-stats' },
  ),
);

// ── Selectors ─────────────────────────────────────────────────────────────────

export function selectBestWpm(state: StatsState): number {
  return state.history.reduce((m, h) => Math.max(m, h.wpm), 0);
}

export function selectAvgWpm(state: StatsState): number {
  if (!state.history.length) return 0;
  return Math.round(
    state.history.reduce((s, h) => s + h.wpm, 0) / state.history.length,
  );
}

export function selectAvgAccuracy(state: StatsState): number {
  if (!state.history.length) return 0;
  return (
    Math.round(
      (state.history.reduce((s, h) => s + h.accuracy, 0) / state.history.length) * 10,
    ) / 10
  );
}

/** Returns the top-N error keys sorted by count descending. */
export function selectTopErrorKeys(
  state: StatsState,
  topN = 5,
): Array<{ key: string; count: number }> {
  return Object.entries(state.keyErrors)
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}
