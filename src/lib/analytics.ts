/**
 * Server-side analytics store (module-level singleton)
 *
 * This module runs ONLY in the Node.js runtime (API routes).
 * It keeps a single shared in-memory store across all API route
 * invocations for the lifetime of the server process.
 *
 * Production upgrade path: swap `events` / `users` for Supabase queries.
 */

import type { AnalyticsEvent, UserStats, AnalyticsDashboard } from '@/types/analytics';
import { randomUUID } from 'crypto';

/* ─── In-process store ──────────────────────────────────────── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const g = globalThis as any;

if (!g.__kmAnalyticsEvents) g.__kmAnalyticsEvents = [] as AnalyticsEvent[];
if (!g.__kmAnalyticsUsers) g.__kmAnalyticsUsers = new Map<string, UserStats>();

const events: AnalyticsEvent[]          = g.__kmAnalyticsEvents;
const users:  Map<string, UserStats>    = g.__kmAnalyticsUsers;

/* ─── Public writers ────────────────────────────────────────── */

export function addEvent(raw: Omit<AnalyticsEvent, 'id'>): AnalyticsEvent {
  const event: AnalyticsEvent = { ...raw, id: randomUUID() };
  events.push(event);
  if (events.length > 50_000) events.splice(0, events.length - 50_000);
  _upsertUser(event);
  return event;
}

/* ─── Public readers ────────────────────────────────────────── */

export function getAllEvents(): AnalyticsEvent[] { return events; }
export function getAllUsers():  UserStats[]       { return Array.from(users.values()); }

export function computeDashboard(): AnalyticsDashboard {
  const now = Date.now();
  const todayStart  = startOfDay(now);
  const weekAgo     = now - 7  * 864e5;
  const monthAgo    = now - 30 * 864e5;

  const loginEvents   = events.filter(e => e.eventType === 'user_login');
  const sessionEvents = events.filter(e => e.eventType === 'session_end');

  const totalUsers           = users.size;
  const uniqueUsersToday     = uniqueSet(loginEvents,   todayStart);
  const uniqueUsersThisWeek  = uniqueSet(events,        weekAgo);
  const uniqueUsersThisMonth = uniqueSet(events,        monthAgo);
  const totalSessions        = sessionEvents.length;
  const sessionsToday        = sessionEvents.filter(e => ts(e) >= todayStart).length;

  const avgDuration = avg(sessionEvents, e => e.metadata.duration  || 0);
  const avgWpm      = avg(sessionEvents, e => e.metadata.wpm       || 0);
  const avgAccuracy = avg(sessionEvents, e => e.metadata.accuracy  || 0);

  const topUsers = Array.from(users.values()).sort((a, b) => b.bestWpm - a.bestWpm).slice(0, 10);

  const loginTrend   = trend7(loginEvents,   'logins');
  const sessionTrend = trend7(sessionEvents, 'sessions');

  const modeMap = new Map<string, number>();
  sessionEvents.forEach(e => {
    const m = e.metadata.mode ?? 'words';
    modeMap.set(m, (modeMap.get(m) ?? 0) + 1);
  });
  const modeDistribution = Array.from(modeMap.entries()).map(([mode, count]) => ({ mode, count }));

  return {
    totalUsers,
    uniqueUsersToday,
    uniqueUsersThisWeek,
    uniqueUsersThisMonth,
    totalSessions,
    sessionsToday,
    averageSessionDuration: Math.round(avgDuration),
    averageWpm: round1(avgWpm),
    averageAccuracy: round1(avgAccuracy),
    topUsers,
    loginTrend,
    sessionTrend,
    modeDistribution,
    userRetention: { day1: 0, day7: 0, day30: 0 },
  };
}

/* ─── Internals ─────────────────────────────────────────────── */

function ts(e: AnalyticsEvent): number { return new Date(e.timestamp).getTime(); }

function startOfDay(t: number): number {
  const d = new Date(t);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function uniqueSet(evts: AnalyticsEvent[], since: number): number {
  return new Set(evts.filter(e => ts(e) >= since).map(e => e.userId)).size;
}

function avg(evts: AnalyticsEvent[], fn: (e: AnalyticsEvent) => number): number {
  if (!evts.length) return 0;
  return evts.reduce((s, e) => s + fn(e), 0) / evts.length;
}

function round1(n: number): number { return Math.round(n * 10) / 10; }

function trend7(evts: AnalyticsEvent[], key: 'logins' | 'sessions') {
  const now = Date.now();
  return Array.from({ length: 7 }, (_, i) => {
    const dayStart = startOfDay(now - (6 - i) * 864e5);
    const dayEnd   = dayStart + 864e5;
    const count    = evts.filter(e => ts(e) >= dayStart && ts(e) < dayEnd).length;
    const label    = new Date(dayStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    // Return with the required key always present
    if (key === 'logins')   return { date: label, logins: count, sessions: 0 };
    return { date: label, sessions: count, logins: 0 };
  });
}

function _upsertUser(event: AnalyticsEvent) {
  const { userId, username, eventType, metadata, timestamp } = event;
  const existing = users.get(userId);
  const isSession = eventType === 'session_end';

  if (!existing) {
    users.set(userId, {
      userId,
      username,
      totalSessions:    isSession ? 1 : 0,
      totalTypingTime:  isSession ? (metadata.duration  ?? 0) : 0,
      averageWpm:       isSession ? (metadata.wpm       ?? 0) : 0,
      averageAccuracy:  isSession ? (metadata.accuracy  ?? 0) : 0,
      bestWpm:          isSession ? (metadata.wpm       ?? 0) : 0,
      bestAccuracy:     isSession ? (metadata.accuracy  ?? 0) : 0,
      createdAt:        timestamp,
      lastLoginAt:      timestamp,
      sessionsThisWeek:  isSession ? 1 : 0,
      sessionsThisMonth: isSession ? 1 : 0,
    });
    return;
  }

  const n = existing.totalSessions;
  users.set(userId, {
    ...existing,
    username,
    lastLoginAt:    timestamp,
    totalSessions:  existing.totalSessions  + (isSession ? 1 : 0),
    totalTypingTime: existing.totalTypingTime + (isSession ? (metadata.duration ?? 0) : 0),
    averageWpm:     isSession && n > 0
      ? Math.round((existing.averageWpm * n + (metadata.wpm ?? 0)) / (n + 1))
      : existing.averageWpm,
    averageAccuracy: isSession && n > 0
      ? round1((existing.averageAccuracy * n + (metadata.accuracy ?? 0)) / (n + 1))
      : existing.averageAccuracy,
    bestWpm:     Math.max(existing.bestWpm,     isSession ? (metadata.wpm      ?? 0) : 0),
    bestAccuracy: Math.max(existing.bestAccuracy, isSession ? (metadata.accuracy ?? 0) : 0),
  });
}

/* ─── Demo seed (runs once per process) ────────────────────── */

if (events.length === 0) {
  const USERS = [
    { id: 'u01', username: 'SpeedDemon99'   },
    { id: 'u02', username: 'KeyboardNinja'  },
    { id: 'u03', username: 'TypeMaster'     },
    { id: 'u04', username: 'SwiftTypist'    },
    { id: 'u05', username: 'ProTyper2026'   },
    { id: 'u06', username: 'Wordsmith'      },
    { id: 'u07', username: 'ClickClackPro'  },
    { id: 'u08', username: 'NightOwlTyper'  },
    { id: 'u09', username: 'DawnTypist'     },
    { id: 'u10', username: 'RacingKeys'     },
  ] as const;
  const MODES = ['words', 'time', 'code', 'zen'] as const;
  const rand  = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const now   = Date.now();

  for (let day = 6; day >= 0; day--) {
    const base   = now - day * 864e5;
    const logins = rand(3, 8);

    for (let i = 0; i < logins; i++) {
      const user      = USERS[rand(0, USERS.length - 1)];
      const sessionId = `s_${randomUUID().slice(0, 6)}`;
      const loginTime = new Date(base + rand(0, 20) * 3600_000).toISOString();

      addEvent({ userId: user.id, username: user.username, eventType: 'user_login',
        timestamp: loginTime, sessionId, metadata: {} });

      const runs = rand(1, 4);
      for (let r = 0; r < runs; r++) {
        const wpm      = rand(40, 130);
        const accuracy = rand(82, 100);
        const duration = rand(15, 90);
        addEvent({
          userId: user.id, username: user.username, eventType: 'session_end',
          timestamp: new Date(new Date(loginTime).getTime() + (r + 1) * 300_000).toISOString(),
          sessionId,
          metadata: { wpm, accuracy, duration, mode: MODES[rand(0, 3)], wordCount: Math.round(wpm * duration / 60) },
        });
      }
    }
  }
}
