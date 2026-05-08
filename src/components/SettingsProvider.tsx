'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useSettingsStore } from '@/store/settingsStore';
import { useTypingStore } from '@/store/typingStore';

/**
 * Bridges the persisted settings store to next-themes, the typing engine,
 * and the document. Runs on every settings change so the UI stays in sync.
 */
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { setTheme } = useTheme();
  const { settings } = useSettingsStore();
  const setConfig = useTypingStore((s) => s.setConfig);

  useEffect(() => {
    // Theme: 'auto' → follow OS preference via next-themes 'system'
    setTheme(settings.theme === 'auto' ? 'system' : settings.theme);

    // Sync typing-engine config from settings store
    setConfig({
      soundEnabled: settings.soundEnabled,
      smoothCaret: settings.smoothCaret,
      showLiveWpm: settings.showStats,
      fontSize: settings.fontSize,
    });

    // Apply font size CSS variable
    const root = document.documentElement;
    root.style.setProperty(
      '--font-size-base',
      settings.fontSize === 'sm' ? '14px' : settings.fontSize === 'lg' ? '18px' : '16px',
    );

    // Apply language
    document.documentElement.lang = settings.language;
  }, [settings, setTheme, setConfig]);

  return <>{children}</>;
}
