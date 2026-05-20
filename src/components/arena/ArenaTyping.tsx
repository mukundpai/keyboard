'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock } from 'lucide-react';
import { useArenaStore } from '@/store/arenaStore';
import { useSocket } from '@/hooks/useSocket';
import { calculateWPM, calculateAccuracy } from '@/lib/calculations';
import { cn } from '@/lib/utils';

// ─── Character state ──────────────────────────────────────────────────────────

type CharState = 'idle' | 'correct' | 'wrong';

interface CharData {
  char: string;
  state: CharState;
}

// ─── Throttle helper ──────────────────────────────────────────────────────────

function useThrottledEmit(emit: (event: string, payload?: unknown) => void, ms = 150) {
  const lastRef = useRef(0);
  return useCallback(
    (event: string, payload?: unknown) => {
      const now = Date.now();
      if (now - lastRef.current >= ms) {
        lastRef.current = now;
        emit(event, payload);
      }
    },
    [emit, ms],
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ArenaTypingProps {
  onFinish?: (wpm: number, accuracy: number) => void;
}

export function ArenaTyping({ onFinish }: ArenaTypingProps) {
  const { room, localPlayerId, updateProgress } = useArenaStore();
  const { emit } = useSocket();
  const throttledEmit = useThrottledEmit(emit, 120);

  const text = room?.text ?? '';
  const chars = text.split('');

  // ── State ──
  const [charStates, setCharStates] = useState<CharState[]>(() =>
    chars.map(() => 'idle'),
  );
  const [cursorPos, setCursorPos] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  const startTimeRef = useRef<number>(0);
  const totalTypedRef = useRef(0);
  const correctCharsRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Reset when room text changes (new race)
  useEffect(() => {
    setCharStates(chars.map(() => 'idle'));
    setCursorPos(0);
    setStarted(false);
    setFinished(false);
    setElapsed(0);
    setWpm(0);
    setAccuracy(100);
    totalTypedRef.current = 0;
    correctCharsRef.current = 0;
    if (timerRef.current) clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  // Live WPM timer
  useEffect(() => {
    if (!started || finished) return;
    timerRef.current = setInterval(() => {
      const secs = (Date.now() - startTimeRef.current) / 1000;
      setElapsed(secs);
      const newWpm = calculateWPM(correctCharsRef.current, secs);
      const newAcc = calculateAccuracy(correctCharsRef.current, totalTypedRef.current);
      setWpm(newWpm);
      setAccuracy(newAcc);
    }, 250);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [started, finished]);

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (finished || !room || room.status !== 'racing') return;
      if (e.key === 'Shift' || e.key === 'Alt' || e.key === 'Control' ||
          e.key === 'Meta' || e.key === 'CapsLock' || e.key === 'Tab') return;

      e.preventDefault();

      // Start timer on first keystroke
      if (!started) {
        setStarted(true);
        startTimeRef.current = Date.now();
      }

      const newStates = [...charStates];

      if (e.key === 'Backspace') {
        if (cursorPos === 0) return;
        const prev = cursorPos - 1;
        newStates[prev] = 'idle';
        setCharStates(newStates);
        setCursorPos(prev);
        return;
      }

      if (cursorPos >= chars.length) return;

      totalTypedRef.current += 1;
      const expected = chars[cursorPos];
      const isCorrect = e.key === expected;

      newStates[cursorPos] = isCorrect ? 'correct' : 'wrong';
      if (isCorrect) correctCharsRef.current += 1;

      setCharStates(newStates);

      const nextPos = cursorPos + 1;
      setCursorPos(nextPos);

      // Compute live stats
      const secs = started ? (Date.now() - startTimeRef.current) / 1000 : 0;
      const liveWpm = calculateWPM(correctCharsRef.current, Math.max(secs, 0.1));
      const liveAcc = calculateAccuracy(correctCharsRef.current, totalTypedRef.current);
      const progress = Math.round((nextPos / chars.length) * 100);

      // Update own position in store immediately
      updateProgress(localPlayerId ?? '', progress, liveWpm, liveAcc);

      // Throttled broadcast to server
      throttledEmit('player:progress', {
        progress,
        wpm: liveWpm,
        accuracy: liveAcc,
      });

      // Check finish
      if (nextPos >= chars.length) {
        const finalSecs = (Date.now() - startTimeRef.current) / 1000;
        const finalWpm = calculateWPM(correctCharsRef.current, finalSecs);
        const finalAcc = calculateAccuracy(correctCharsRef.current, totalTypedRef.current);

        setFinished(true);
        setWpm(finalWpm);
        setAccuracy(finalAcc);
        if (timerRef.current) clearInterval(timerRef.current);

        emit('player:finish', { wpm: finalWpm, accuracy: finalAcc });
        onFinish?.(finalWpm, finalAcc);
      }
    },
    [
      finished, room, started, charStates, cursorPos, chars,
      emit, throttledEmit, updateProgress, localPlayerId, onFinish,
    ],
  );

  if (!text) return null;

  const minutes = Math.floor(elapsed / 60);
  const seconds = Math.floor(elapsed % 60);
  const timeStr = `${minutes}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="glass-card p-6 sm:p-8 space-y-5">
      {/* ── Stats bar ── */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-text-secondary">
            <Zap size={13} className="text-accent-light" />
            <span className="font-mono tabular-nums font-semibold text-text-primary">{wpm}</span>
            <span className="text-text-muted text-xs">wpm</span>
          </div>
          <div className="text-text-secondary text-xs">
            <span className="font-mono tabular-nums font-semibold text-text-primary">{accuracy.toFixed(1)}</span>
            <span className="text-text-muted">% acc</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-text-muted text-xs">
          <Clock size={12} />
          <span className="font-mono tabular-nums">{timeStr}</span>
        </div>
      </div>

      {/* ── Text display ── */}
      <div
        ref={containerRef}
        className="relative cursor-text rounded-xl bg-surface-raised/50 border border-border-active/20
                   p-5 sm:p-6 font-mono text-lg leading-relaxed tracking-wide select-none"
        onClick={focusInput}
      >
        {chars.map((char, i) => {
          const state = charStates[i];
          const isCursor = i === cursorPos;

          return (
            <span key={i} className="relative">
              {isCursor && (
                <motion.span
                  className="absolute -left-px top-0 bottom-0 w-0.5 bg-accent-light rounded-full"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                />
              )}
              <span
                className={cn(
                  'char',
                  state === 'idle' && 'char-idle',
                  state === 'correct' && 'char-correct',
                  state === 'wrong' && 'char-wrong',
                )}
              >
                {char}
              </span>
            </span>
          );
        })}

        {/* Hidden input captures keystrokes */}
        <input
          ref={inputRef}
          className="absolute inset-0 opacity-0 cursor-text w-full h-full"
          onKeyDown={handleKeyDown}
          readOnly
          aria-label="Typing input"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </div>

      {/* ── Progress bar ── */}
      <div className="space-y-1">
        <div className="progress-track">
          <motion.div
            className="progress-fill"
            animate={{ width: `${Math.round((cursorPos / chars.length) * 100)}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>
        <div className="text-right text-xs text-text-muted tabular-nums font-mono">
          {cursorPos}/{chars.length} chars
        </div>
      </div>

      {/* ── Finished overlay ── */}
      {finished && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-4 py-3 rounded-xl
                     bg-success/10 border border-success/25"
        >
          <span className="text-success font-semibold text-sm">Finished!</span>
          <span className="text-text-muted text-xs font-mono">{wpm} wpm · {accuracy.toFixed(1)}% acc</span>
        </motion.div>
      )}
    </div>
  );
}
