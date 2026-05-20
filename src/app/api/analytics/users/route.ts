/**
 * Analytics Users API
 * GET /api/analytics/users — list registered users from the database
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAllUsers } from '@/lib/analytics';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const search = (searchParams.get('search') ?? '').toLowerCase();
    const sortBy = searchParams.get('sortBy') ?? 'createdAt';
    const order = searchParams.get('order') === 'asc' ? 'asc' : 'desc';
    const limit = Math.min(Number(searchParams.get('limit') ?? 50), 200);

    // Pull registered users from DB
    const dbUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        _count: { select: { sessions: true } },
      },
      where: search
        ? {
            OR: [
              { email: { contains: search, mode: 'insensitive' } },
              { name: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: sortBy === 'createdAt' ? { createdAt: order } : { createdAt: 'desc' },
      take: limit,
    });

    const total = await prisma.user.count();

    // Merge with in-memory typing stats where available
    const inMemory = getAllUsers();
    const statsMap = new Map(inMemory.map((u) => [u.userId, u]));

    const users = dbUsers.map((u) => {
      const stats = statsMap.get(u.id);
      return {
        userId: u.id,
        username: u.name ?? u.email,
        email: u.email,
        createdAt: u.createdAt.toISOString(),
        totalSessions: stats?.totalSessions ?? 0,
        totalTypingTime: stats?.totalTypingTime ?? 0,
        averageWpm: stats?.averageWpm ?? 0,
        averageAccuracy: stats?.averageAccuracy ?? 0,
        bestWpm: stats?.bestWpm ?? 0,
        bestAccuracy: stats?.bestAccuracy ?? 0,
        lastLoginAt: stats?.lastLoginAt ?? u.createdAt.toISOString(),
      };
    });

    return NextResponse.json({ users, total });
  } catch (error) {
    console.error('Analytics users error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

