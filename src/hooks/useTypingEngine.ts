'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTypingStore } from '@/store/typingStore';
import { generateWords } from '@/lib/words';
import { getCodeSnippet } from '@/lib/codeSnippets';
import { tokenize } from '@/lib/syntaxHighlight';
import {
  calculateWPM,
  calculateRawWPM,
  calculateAccuracy,
  calculateConsistency,
} from '@/lib/calculations';
import type {
  CharData,
  CharState,
  WordData,
  EngineState,
  WpmSnapshot,
  TestResults,
  CodeLanguage,
} from '@/types/typing';

/* ─── Public interface ──────────────────────────────────── */
export type KeyPressState = 'correct' | 'wrong' | 'neutral';

export interface LastKeyPress {
  key: string;
  state: KeyPressState;
  seq: number;
}

export interface TypingEngineReturn {
  words: WordData[];
  currentWordIndex: number;
  currentCharIndex: number;
  engineState: EngineState;
  timeLeft: number | null;
  timeElapsed: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errors: number;
  combo: number;
  results: TestResults | null;
  lastKeyPress: LastKeyPress | null;
  containerRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  restart: () => void;
  focusInput: () => void;
}

/* ─── Helpers ────────────────────────────────────────────── */
function buildWords(text: string): WordData[] {
  return text.split(' ').map((word, wi) => ({
    id: wi,
    isCompleted: false,
    chars: word.split('').map((char) => ({
      char,
      state: 'idle' as CharState,
    })),
  }));
}

/** Build code words: each line is one "word", chars carry token types */
function buildCodeWords(text: string, lang: CodeLanguage): WordData[] {
  const tokenized = tokenize(text, lang);
  const lines: { char: string; tokenType: CharData['tokenType'] }[][] = [[]];

  for (const item of tokenized) {
    if (item.char === '\n') {
      lines.push([]);
    } else {
      lines[lines.length - 1].push(item);
    }
  }

  // Drop trailing empty line if present
  if (lines[lines.length - 1].length === 0 && lines.length > 1) {
    lines.pop();
  }

  return lines.map((lineChars, wi) => ({
    id: wi,
    isCompleted: false,
    chars: lineChars.map(({ char, tokenType }) => ({
      char,
      state: 'idle' as CharState,
      tokenType,
    })),
  }));
}

/* ─── Hook ───────────────────────────────────────────────── */
export function useTypingEngine(): TypingEngineReturn {
  const { config, setEngineState, setResults, addWpmSnapshot, resetTest } =
    useTypingStore();

  /* ── Rendered state ── */
  const [words, setWords] = useState<WordData[]>([]);
  const [currentWordIndex, setCWI] = useState(0);
  const [currentCharIndex, setCCI] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [rawWpm, setRawWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [combo, setCombo] = useState(0);
  const [results, setLocalResults] = useState<TestResults | null>(null);
  const [engineState, setLocalEngineState] = useState<EngineState>('idle');
  const [lastKeyPress, setLastKeyPress] = useState<LastKeyPress | null>(null);
  const lastKeySeqRef = useRef(0);

  /* ── Mutable refs (used inside callbacks to avoid stale closures) ── */
  const cwiRef = useRef(0);   // current word index
  const cciRef = useRef(0);   // current char index
  const correctRef = useRef(0);
  const totalRef = useRef(0);
  const errRef = useRef(0);
  const comboRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const historyRef = useRef<WpmSnapshot[]>([]);
  const engineStateRef = useRef<EngineState>('idle');
  const configRef = useRef(config);
  const wordsRef = useRef<WordData[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastToneAtRef = useRef(0);

  /* Keep refs in sync with fast-changing state / config */
  useEffect(() => { cwiRef.current = currentWordIndex; }, [currentWordIndex]);
  useEffect(() => { cciRef.current = currentCharIndex; }, [currentCharIndex]);
  useEffect(() => { engineStateRef.current = engineState; }, [engineState]);
  useEffect(() => { configRef.current = config; }, [config]);
  useEffect(() => { wordsRef.current = words; }, [words]);

  /* DOM refs */
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  /* ── Helpers ── */
  const syncEngineState = useCallback((s: EngineState) => {
    engineStateRef.current = s;
    setLocalEngineState(s);
    setEngineState(s);
  }, [setEngineState]);

  const playKeyTone = useCallback((kind: 'input' | 'space' | 'backspace') => {
    if (!configRef.current.soundEnabled || typeof window === 'undefined') return;

    const now = performance.now();
    if (now - lastToneAtRef.current < 18) return;
    lastToneAtRef.current = now;

    const AudioContextCtor = window.AudioContext || (window as typeof window & {
      webkitAudioContext?: typeof AudioContext;
    }).webkitAudioContext;

    if (!AudioContextCtor) return;

    try {
      const ctx = audioCtxRef.current ?? new AudioContextCtor();
      audioCtxRef.current = ctx;

      if (ctx.state === 'suspended') {
        void ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const time = ctx.currentTime;
      const isBackspace = kind === 'backspace';

      osc.type = isBackspace ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(
        kind === 'space' ? 510 : isBackspace ? 220 : 360,
        time,
      );

      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.exponentialRampToValueAtTime(0.018, time + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.075);
    } catch {
      // Ignore browsers that block or fail Web Audio initialization.
    }
  }, []);

  /* ── Init / Reset ── */
  const initWords = useCallback(() => {
    // Use getState() so we always see the latest config even when called
    // immediately after setConfig() (before React re-renders/useEffect).
    const cfg = useTypingStore.getState().config;
    let rawText: string;

    if (cfg.mode === 'code') {
      const lang = cfg.codeLanguage ?? 'python';
      rawText = getCodeSnippet(lang);
      const wordData = buildCodeWords(rawText, lang);
      setWords(wordData);
      setCWI(0);
      setCCI(0);
      cwiRef.current = 0;
      cciRef.current = 0;
      correctRef.current = 0;
      totalRef.current = 0;
      errRef.current = 0;
      comboRef.current = 0;
      historyRef.current = [];
      startTimeRef.current = null;
      setErrors(0);
      setCombo(0);
      setWpm(0);
      setRawWpm(0);
      setAccuracy(100);
      setLocalResults(null);
      setTimeElapsed(0);
      setTimeLeft(null); // code mode has no time limit
      setLastKeyPress(null);
      lastKeySeqRef.current = 0;
      return;
    } else {
      const count =
        cfg.mode === 'words'
          ? (cfg.wordCount ?? 50)
          : Math.max(200, (cfg.timeLimit ?? 60) * 4);
      rawText = generateWords(count);
    }

    const wordData = buildWords(rawText);
    setWords(wordData);
    setCWI(0);
    setCCI(0);
    cwiRef.current = 0;
    cciRef.current = 0;

    correctRef.current = 0;
    totalRef.current = 0;
    errRef.current = 0;
    comboRef.current = 0;
    historyRef.current = [];
    startTimeRef.current = null;

    setErrors(0);
    setCombo(0);
    setWpm(0);
    setRawWpm(0);
    setAccuracy(100);
    setLocalResults(null);
    setTimeElapsed(0);
    setTimeLeft(cfg.mode === 'time' ? (cfg.timeLimit ?? 60) : null);
    setLastKeyPress(null);
    lastKeySeqRef.current = 0;
  }, []);

  useEffect(() => {
    initWords();
  }, [initWords]);

  /* ── Timer ── */
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const finishTest = useCallback(() => {
    stopTimer();
    syncEngineState('finished');

    const elapsed = startTimeRef.current
      ? Math.max(1, Math.floor((Date.now() - startTimeRef.current) / 1000))
      : 1;

    const finalWpm = calculateWPM(correctRef.current, elapsed);
    const finalRaw = calculateRawWPM(totalRef.current, elapsed);
    const finalAcc = calculateAccuracy(correctRef.current, totalRef.current);
    const finalCon = calculateConsistency(historyRef.current);

    const testResults: TestResults = {
      wpm: finalWpm,
      rawWpm: finalRaw,
      accuracy: finalAcc,
      consistency: finalCon,
      correctChars: correctRef.current,
      incorrectChars: errRef.current,
      extraChars: 0,
      totalChars: totalRef.current,
      duration: elapsed,
      mode: configRef.current.mode,
      wpmHistory: historyRef.current,
      timestamp: Date.now(),
    };

    setLocalResults(testResults);
    setResults(testResults);
  }, [stopTimer, syncEngineState, setResults]);

  const startTimer = useCallback(() => {
    if (timerRef.current) return;
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current!) / 1000);
      setTimeElapsed(elapsed);

      const cfg = configRef.current;

      if (cfg.mode === 'time') {
        const remaining = (cfg.timeLimit ?? 60) - elapsed;
        const clamped = Math.max(0, remaining);
        setTimeLeft(clamped);
        if (clamped <= 0) {
          finishTest();
          return;
        }
      }

      /* WPM snapshot */
      const snap: WpmSnapshot = {
        second: elapsed,
        wpm: calculateWPM(correctRef.current, elapsed),
        raw: calculateRawWPM(totalRef.current, elapsed),
        errors: errRef.current,
      };
      historyRef.current.push(snap);
      addWpmSnapshot(snap);

      setWpm(snap.wpm);
      setRawWpm(snap.raw);
      setAccuracy(calculateAccuracy(correctRef.current, totalRef.current));
    }, 1000);
  }, [finishTest, addWpmSnapshot]);

  /* ── Keystroke handlers ── */
  const handleChar = useCallback((key: string) => {
    const wi = cwiRef.current;
    const ci = cciRef.current;

    // Determine correctness for keyboard preview before mutating state
    const currentWord = wordsRef.current[wi];
    const isWithinWord = ci < currentWord.chars.length;
    const isCorrect = isWithinWord && currentWord.chars[ci].char === key;
    lastKeySeqRef.current += 1;
    setLastKeyPress({ key: key.toLowerCase(), state: isCorrect ? 'correct' : 'wrong', seq: lastKeySeqRef.current });

    setWords((prev) => {
      const next = prev.map((w, i) => {
        if (i !== wi) return w;

        const chars = [...w.chars];
        const isWithinWord = ci < chars.length;

        totalRef.current++;

        if (isWithinWord) {
          const correct = chars[ci].char === key;
          if (correct) {
            correctRef.current++;
            comboRef.current++;
          } else {
            errRef.current++;
            comboRef.current = 0;
          }
          chars[ci] = {
            ...chars[ci],
            state: (correct ? 'correct' : 'wrong') as CharState,
            typedChar: key,
          };
        } else {
          // extra character beyond word length
          errRef.current++;
          comboRef.current = 0;
          chars.push({ char: key, state: 'extra', typedChar: key });
        }

        return { ...w, chars };
      });

      wordsRef.current = next;
      return next;
    });

    setCombo(comboRef.current);
    setErrors(errRef.current);
    setCCI((c) => c + 1);
    cciRef.current++;
  }, []);

  const handleBackspace = useCallback(() => {
    const ci = cciRef.current;
    const wi = cwiRef.current;
    lastKeySeqRef.current += 1;
    setLastKeyPress({ key: 'backspace', state: 'neutral', seq: lastKeySeqRef.current });

    if (ci === 0) {
      // Attempt to jump back to previous word if it has errors
      if (wi === 0) return;
      const prevWord = wordsRef.current[wi - 1];
      const hasErrors = prevWord.chars.some(
        (c) => c.state === 'wrong' || c.state === 'extra',
      );
      if (!hasErrors) return;

      const prevLen = prevWord.chars.length;
      setCWI(wi - 1);
      setCCI(prevLen);
      cwiRef.current = wi - 1;
      cciRef.current = prevLen;

      setWords((prev) =>
        prev.map((w, i) =>
          i === wi - 1 ? { ...w, isCompleted: false } : w,
        ),
      );
      return;
    }

    setWords((prev) =>
      prev.map((w, i) => {
        if (i !== wi) return w;
        const chars = [...w.chars];
        const idx = ci - 1;
        if (chars[idx]?.state === 'extra') {
          chars.splice(idx, 1);
        } else if (chars[idx]) {
          chars[idx] = { char: chars[idx].char, state: 'idle' };
        }
        return { ...w, chars };
      }),
    );

    setCCI((c) => Math.max(0, c - 1));
    cciRef.current = Math.max(0, cciRef.current - 1);
  }, []);

  const handleSpace = useCallback(() => {
    const ci = cciRef.current;
    const wi = cwiRef.current;
    if (ci === 0) return; // don't skip on empty word
    lastKeySeqRef.current += 1;
    setLastKeyPress({ key: 'space', state: 'neutral', seq: lastKeySeqRef.current });

    // Mark any untyped characters in current word as wrong
    setWords((prev) => {
      const next = prev.map((w, i) => {
        if (i !== wi) return w;
        const chars = w.chars.map((c) => {
          if (c.state === 'idle') {
            errRef.current++;
            return { ...c, state: 'wrong' as CharState };
          }
          return c;
        });
        return { ...w, chars, isCompleted: true };
      });
      wordsRef.current = next;
      return next;
    });

    const nextWI = wi + 1;
    const cfg = configRef.current;
    const totalWords = wordsRef.current.length;

    if (
      (cfg.mode === 'words' && nextWI >= (cfg.wordCount ?? 50)) ||
      nextWI >= totalWords
    ) {
      finishTest();
      return;
    }

    setCWI(nextWI);
    setCCI(0);
    cwiRef.current = nextWI;
    cciRef.current = 0;
  }, [finishTest]);

  /* ── Code-mode: advance past an empty line or trigger handleSpace ── */
  const handleCodeEnter = useCallback(() => {
    const ci = cciRef.current;
    const wi = cwiRef.current;
    const currentLine = wordsRef.current[wi];

    if (ci === 0 && (!currentLine || currentLine.chars.length === 0)) {
      // Empty line: advance without error-marking
      const nextWI = wi + 1;
      setWords((prev) =>
        prev.map((w, i) => (i === wi ? { ...w, isCompleted: true } : w)),
      );
      if (nextWI >= wordsRef.current.length) {
        finishTest();
      } else {
        setCWI(nextWI);
        setCCI(0);
        cwiRef.current = nextWI;
        cciRef.current = 0;
      }
      return;
    }

    handleSpace(); // handles normal line advancement + error marking
  }, [finishTest, handleSpace]);

  /* ── Main key handler ── */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Ignore while test is over
      if (engineStateRef.current === 'finished') return;

      // Ignore modifier combos
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const key = e.key;
      const isCode = configRef.current.mode === 'code';

      // Non-printing keys we handle explicitly (Tab handled separately)
      const ignored = [
        'Shift', 'Control', 'Alt', 'Meta', 'CapsLock',
        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
        'Home', 'End', 'PageUp', 'PageDown', 'Insert', 'Delete',
        'Escape', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6',
        'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
      ];
      if (ignored.includes(key)) return;

      // Start the timer on first real keystroke
      if (engineStateRef.current === 'idle') {
        syncEngineState('active');
        startTimer();
      }

      if (key === 'Backspace') {
        e.preventDefault();
        playKeyTone('backspace');
        handleBackspace();
        return;
      }

      /* ── Tab: type leading indentation spaces in code mode ── */
      if (key === 'Tab') {
        e.preventDefault();
        if (isCode && engineStateRef.current === 'active') {
          const ci = cciRef.current;
          const currentLine = wordsRef.current[cwiRef.current];
          if (ci === 0 && currentLine) {
            let spaceCount = 0;
            for (const c of currentLine.chars) {
              if (c.char === ' ') spaceCount++;
              else break;
            }
            if (spaceCount > 0) {
              playKeyTone('input');
              for (let k = 0; k < spaceCount; k++) handleChar(' ');
              return;
            }
          }
        }
        // Non-code or no indent: propagate so TabRestartListener can restart
        return;
      }

      /* ── Enter: advance to next code line ── */
      if (key === 'Enter') {
        if (isCode) {
          e.preventDefault();
          playKeyTone('space');
          handleCodeEnter();
        }
        return;
      }

      /* ── Space: regular char in code mode, word-advance in others ── */
      if (key === ' ') {
        e.preventDefault();
        if (isCode) {
          playKeyTone('input');
          handleChar(' ');
        } else {
          playKeyTone('space');
          handleSpace();
        }
        return;
      }

      if (key.length === 1) {
        playKeyTone('input');
        handleChar(key);
      }
    },
    [syncEngineState, startTimer, handleBackspace, handleSpace, handleChar, handleCodeEnter, playKeyTone, finishTest],
  );

  /* ── Restart ── */
  const restart = useCallback(() => {
    stopTimer();
    resetTest();
    syncEngineState('idle');
    initWords();
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [stopTimer, resetTest, syncEngineState, initWords]);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  /* ── Cleanup ── */
  useEffect(
    () => () => {
      stopTimer();
      void audioCtxRef.current?.close();
      audioCtxRef.current = null;
    },
    [stopTimer],
  );

  return {
    words,
    currentWordIndex,
    currentCharIndex,
    engineState,
    timeLeft,
    timeElapsed,
    wpm,
    rawWpm,
    accuracy,
    errors,
    combo,
    results,
    lastKeyPress,
    containerRef,
    inputRef,
    handleKeyDown,
    restart,
    focusInput,
  };
}
