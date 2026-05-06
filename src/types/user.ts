export interface UserProfile {
  id: string;
  username: string;
  avatarUrl?: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  joinedAt: number;
  stats: UserStats;
  badges: Badge[];
}

export interface UserStats {
  totalTests: number;
  totalTimeTyping: number; // seconds
  bestWpm: number;
  avgWpm: number;
  avgAccuracy: number;
  totalWords: number;
  streak: number; // consecutive days active
  lastActive: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatarUrl?: string;
  wpm: number;
  accuracy: number;
  consistency: number;
  level: number;
}
