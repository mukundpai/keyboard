/**
 * Analytics Stats API
 * GET /api/analytics/stats — returns aggregated dashboard metrics
 */

import { NextResponse } from 'next/server';
import { computeDashboard } from '@/lib/analytics';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [metrics, totalRegisteredUsers] = await Promise.all([
      computeDashboard(),
      prisma.user.count(),
    ]);

    return NextResponse.json({
      ...metrics,
      totalRegisteredUsers,
    });
  } catch (error) {
    console.error('Analytics stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
