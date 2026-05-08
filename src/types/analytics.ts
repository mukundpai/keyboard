/**
 * Analytics Types and Interfaces
 * Defines the data structures for tracking user activity and performance metrics
 */

export type EventType = 
  | 'user_login' 
  | 'session_start' 
  | 'session_end' 
  | 'challenge_completed' 
  | 'arena_race' 
  | 'user_signup';

export interface AnalyticsEvent {
  id: string;
  userId: string;
  username: string;
  eventType: EventType;
  timestamp: string;
  sessionId: string;
  metadata: {
    wpm?: number;
    accuracy?: number;
    duration?: number;
    mode?: 'words' | 'time' | 'code' | 'zen';
    errors?: number;
    wordCount?: number;
  };
}

export interface UserStats {
  userId: string;
  username: string;
  totalSessions: number;
  totalTypingTime: number; // in seconds
  averageWpm: number;
  averageAccuracy: number;
  bestWpm: number;
  bestAccuracy: number;
  createdAt: string;
  lastLoginAt: string;
  sessionsThisWeek: number;
  sessionsThisMonth: number;
}

export interface AnalyticsDashboard {
  totalUsers: number;
  uniqueUsersToday: number;
  uniqueUsersThisWeek: number;
  uniqueUsersThisMonth: number;
  totalSessions: number;
  sessionsToday: number;
  averageSessionDuration: number;
  averageWpm: number;
  averageAccuracy: number;
  topUsers: UserStats[];
  loginTrend: { date: string; logins: number }[];
  sessionTrend: { date: string; sessions: number }[];
  modeDistribution: { mode: string; count: number }[];
  userRetention: {
    day1: number;
    day7: number;
    day30: number;
  };
}

export interface SessionData {
  sessionId: string;
  userId: string;
  username: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  sessions: AnalyticsEvent[];
}
