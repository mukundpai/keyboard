/**
 * Analytics tracking hook for client-side event collection
 */

import { useEffect, useCallback, useRef } from 'react';
import { useUserStore } from '@/store/userStore';
import type { EventType } from '@/types/analytics';
import { nanoid } from 'nanoid';

export function useAnalyticsTracking() {
  const sessionIdRef = useRef<string>(nanoid());
  const profile = useUserStore(s => s.profile);
  const userId  = profile?.id;
  const username = profile?.username;

  const trackEvent = useCallback(async (
    eventType: EventType,
    metadata?: Record<string, unknown>
  ) => {
    if (!userId) return;

    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          username: username ?? 'Anonymous',
          eventType,
          timestamp: new Date().toISOString(),
          sessionId: sessionIdRef.current,
          metadata: metadata ?? {},
        }),
      });
    } catch (error) {
      console.error('Failed to track analytics event:', error);
    }
  }, [userId, username]);

  // Track user login on mount / when profile changes
  useEffect(() => {
    if (userId) {
      trackEvent('user_login');
    }
  }, [userId, trackEvent]);

  return { trackEvent, sessionId: sessionIdRef.current };
}
