/**
 * Analytics Stats API
 * GET /api/analytics/stats — returns aggregated dashboard metrics
 */

import { NextResponse } from 'next/server';
import { computeDashboard } from '@/lib/analytics';

export async function GET() {
  try {
    const metrics = computeDashboard();
    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Analytics stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
