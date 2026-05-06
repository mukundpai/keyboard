'use client';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { TestConfig, TestResults, EngineState, WpmSnapshot } from '@/types/typing';

interface TypingState {
  config: TestConfig;
  engineState: EngineState;
  results: TestResults | null;
  wpmHistory: WpmSnapshot[];

  setConfig: (config: Partial<TestConfig>) => void;
  setEngineState: (state: EngineState) => void;
  setResults: (results: TestResults) => void;
  addWpmSnapshot: (snapshot: WpmSnapshot) => void;
  resetTest: () => void;
}

export const DEFAULT_CONFIG: TestConfig = {
  mode: 'time',
  timeLimit: 60,
  wordCount: 50,
  codeLanguage: 'python',
  fontSize: 'md',
  showLiveWpm: true,
  smoothCaret: true,
  soundEnabled: false,
};

export const useTypingStore = create<TypingState>()(
  devtools(
    (set) => ({
      config: DEFAULT_CONFIG,
      engineState: 'idle',
      results: null,
      wpmHistory: [],

      setConfig: (config) =>
        set((s) => ({ config: { ...s.config, ...config } })),

      setEngineState: (engineState) => set({ engineState }),

      setResults: (results) => set({ results }),

      addWpmSnapshot: (snapshot) =>
        set((s) => ({ wpmHistory: [...s.wpmHistory, snapshot] })),

      resetTest: () =>
        set({ engineState: 'idle', results: null, wpmHistory: [] }),
    }),
    { name: 'typing-store' },
  ),
);
