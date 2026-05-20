'use client';
import { create, type StateCreator } from 'zustand';
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

const isDev = process.env.NODE_ENV === 'development';

const storeImpl: StateCreator<TypingState> = (set) => ({
  config: DEFAULT_CONFIG,
  engineState: 'idle' as EngineState,
  results: null,
  wpmHistory: [],

  setConfig: (config: Partial<TestConfig>) =>
    set((s) => ({ config: { ...s.config, ...config } })),

  setEngineState: (engineState: EngineState) => set({ engineState }),

  setResults: (results: TestResults) => set({ results }),

  addWpmSnapshot: (snapshot: WpmSnapshot) =>
    set((s) => ({ wpmHistory: [...s.wpmHistory, snapshot] })),

  resetTest: () =>
    set({ engineState: 'idle', results: null, wpmHistory: [] }),
});

export const useTypingStore = create<TypingState>()(storeImpl);
