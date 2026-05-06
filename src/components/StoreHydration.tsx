'use client';
import { useEffect } from 'react';

/**
 * Placeholder hydration component.
 * Previously triggered Zustand persist rehydration — kept for future use.
 */
export function StoreHydration() {
  useEffect(() => {
    // no-op: user store no longer uses persist middleware
  }, []);
  return null;
}
