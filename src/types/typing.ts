/* ─── Test configuration ─────────────────────────────────── */
export type TestMode = 'time' | 'words' | 'zen' | 'code';
export type TimeOption = 15 | 30 | 60 | 120;
export type WordOption = 10 | 25 | 50 | 100;
export type CodeLanguage = 'python' | 'react' | 'django';
export type FontSize = 'sm' | 'md' | 'lg';

export interface TestConfig {
  mode: TestMode;
  timeLimit: TimeOption;
  wordCount: WordOption;
  codeLanguage: CodeLanguage;
  fontSize: FontSize;
  showLiveWpm: boolean;
  smoothCaret: boolean;
  soundEnabled: boolean;
}

/* ─── Engine state machine ───────────────────────────────── */
export type EngineState = 'idle' | 'active' | 'finished';

/* ─── Per-character typing state ─────────────────────────── */
export type CharState = 'idle' | 'correct' | 'wrong' | 'extra';

export interface CharData {
  char: string;
  state: CharState;
  typedChar?: string;
}

export interface WordData {
  id: number;
  chars: CharData[];
  isCompleted: boolean;
}

/* ─── Statistics snapshots ───────────────────────────────── */
export interface WpmSnapshot {
  second: number;
  wpm: number;
  raw: number;
  errors: number;
}

/* ─── Post-test results ──────────────────────────────────── */
export interface TestResults {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  correctChars: number;
  incorrectChars: number;
  extraChars: number;
  totalChars: number;
  duration: number;
  mode: TestMode;
  wpmHistory: WpmSnapshot[];
  timestamp: number;
}
