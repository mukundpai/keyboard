'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useSettingsStore } from '@/store/settingsStore';

/**
 * Bridges the persisted settings store to next-themes and the document.
 * Runs on every settings change so the UI stays in sync.
 */
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { setTheme } = useTheme();
  const { settings } = useSettingsStore();

  useEffect(() => {
    // 'auto' → let next-themes follow the OS preference ('system')
    setTheme(settings.theme === 'auto' ? 'system' : settings.theme);

    // Apply font size
    const root = document.documentElement;
    root.style.setProperty(
      '--font-size-base',
      settings.fontSize === 'sm' ? '14px' : settings.fontSize === 'lg' ? '18px' : '16px',
    );

    // Apply language
    document.documentElement.lang = settings.language;
  }, [settings, setTheme]);

  return <>{children}</>;
}
