/**
 * Analytics Users API
 * GET /api/analytics/users — list all tracked users with stats
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers } from '@/lib/analytics';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const sortBy = (searchParams.get('sortBy') ?? 'bestWpm') as keyof ReturnType<typeof getAllUsers>[number];
    const order  = searchParams.get('order') === 'asc' ? 'asc' : 'desc';
    const search = (searchParams.get('search') ?? '').toLowerCase();
    const limit  = Math.min(Number(searchParams.get('limit') ?? 50), 200);

    let users = getAllUsers();

    if (search) {
      users = users.filter(u => u.username.toLowerCase().includes(search));
    }

    users.sort((a, b) => {
      const av = (a as unknown as Record<string, unknown>)[sortBy as string];
      const bv = (b as unknown as Record<string, unknown>)[sortBy as string];
      if (typeof av === 'number' && typeof bv === 'number') {
        return order === 'asc' ? av - bv : bv - av;
      }
      return 0;
    });

    return NextResponse.json({ users: users.slice(0, limit), total: users.length });
  } catch (error) {
    console.error('Analytics users error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
