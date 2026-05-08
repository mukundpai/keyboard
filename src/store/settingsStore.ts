/**
 * Settings/Preferences Store
 * User preferences and app settings
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  keyboardLayout: 'qwerty' | 'dvorak' | 'colemak';
  fontSize: 'sm' | 'md' | 'lg';
  smoothCaret: boolean;
  showStats: boolean;
  language: string;
}

interface SettingsStore {
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: UserSettings = {
  theme: 'dark',
  soundEnabled: true,
  notificationsEnabled: true,
  keyboardLayout: 'qwerty',
  fontSize: 'md',
  smoothCaret: true,
  showStats: true,
  language: 'en',
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },
      resetSettings: () => {
        set({ settings: defaultSettings });
      },
    }),
    {
      name: 'keymaster-settings',
    }
  )
);
