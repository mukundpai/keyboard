import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  username: string;
  wpm: number;
  accuracy: number;
  totalTests: number;
  level: number;
};

export async function GET() {
  try {
    type RawRow = {
      user_id: string;
      username: string;
      best_wpm: bigint | number;
      best_accuracy: number;
      total_tests: bigint | number;
    };

    const rows = await prisma.$queryRaw<RawRow[]>`
      SELECT
        u.id                                                      AS user_id,
        COALESCE(u.name, split_part(u.email, '@', 1))            AS username,
        best.wpm                                                  AS best_wpm,
        best.accuracy                                             AS best_accuracy,
        stats.total_tests                                         AS total_tests
      FROM (
        SELECT DISTINCT ON ("userId") "userId", wpm, accuracy
        FROM   "TypingResult"
        ORDER  BY "userId", wpm DESC
      ) best
      JOIN "User"  u     ON u.id = best."userId"
      JOIN (
        SELECT "userId", COUNT(*)::int AS total_tests
        FROM   "TypingResult"
        GROUP  BY "userId"
      ) stats ON stats."userId" = best."userId"
      ORDER  BY best.wpm DESC
      LIMIT  50
    `;

    const entries: LeaderboardEntry[] = rows.map((row, idx) => {
      const totalTests = Number(row.total_tests);
      return {
        rank:       idx + 1,
        userId:     row.user_id,
        username:   row.username,
        wpm:        Number(row.best_wpm),
        accuracy:   Math.round(Number(row.best_accuracy) * 10) / 10,
        totalTests,
        // level: every 5 completed tests = 1 level, minimum 1
        level:      Math.max(1, Math.floor(totalTests / 5)),
      };
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error('[leaderboard] query failed:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
