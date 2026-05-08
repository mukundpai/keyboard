/**
 * Analytics Events API
 * POST /api/analytics/events  — ingest an event
 * GET  /api/analytics/events  — retrieve recent events (admin)
 */

import { NextRequest, NextResponse } from 'next/server';
import { addEvent, getAllEvents } from '@/lib/analytics';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.userId || !body.eventType || !body.timestamp) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const event = addEvent({
      userId:    body.userId,
      username:  body.username  ?? 'Anonymous',
      eventType: body.eventType,
      timestamp: body.timestamp,
      sessionId: body.sessionId ?? '',
      metadata:  body.metadata  ?? {},
    });

    return NextResponse.json({ success: true, id: event.id }, { status: 201 });
  } catch (error) {
    console.error('Analytics events POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const limit  = Math.min(Number(searchParams.get('limit')  ?? 100), 500);
    const type   = searchParams.get('type')   ?? '';
    const userId = searchParams.get('userId') ?? '';

    let events = getAllEvents();

    if (type)   events = events.filter(e => e.eventType === type);
    if (userId) events = events.filter(e => e.userId    === userId);

    // Return most recent first
    const result = [...events].reverse().slice(0, limit);

    return NextResponse.json({ events: result, total: events.length });
  } catch (error) {
    console.error('Analytics events GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
