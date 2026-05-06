'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { useTypingEngine } from '@/hooks/useTypingEngine';
import { useTypingStore } from '@/store/typingStore';
import { WordDisplay } from './WordDisplay';
import { StatsBar } from './StatsBar';
import { ModeSelector } from './ModeSelector';
import { ComboStreak } from './ComboStreak';
import { ResultsPanel } from './ResultsPanel';
import { CommandDeck } from './CommandDeck';
import { Button } from '@/components/ui/Button';

export function TypingEngine() {
  const { config } = useTypingStore();

  const {
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
    containerRef,
    inputRef,
    handleKeyDown,
    restart,
    focusInput,
  } = useTypingEngine();

  /* Auto-focus the hidden input on mount */
  useEffect(() => {
    focusInput();
  }, [focusInput]);

  const isFinished = engineState === 'finished';

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">

      <CommandDeck />

      {/* ── Mode selector (hidden while typing) ── */}
      <AnimatePresence>
        {engineState !== 'active' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ModeSelector onRestart={restart} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main test area ── */}
      <AnimatePresence mode="wait">
        {!isFinished ? (
          <motion.div
            key="test"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="glass-card p-6 sm:p-8 space-y-5 shadow-surface-lg"
            onClick={focusInput}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-active/15 pb-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-text-muted">
                  Typing Chamber
                </p>
                <p className="mt-1 text-sm text-text-secondary">
                  {engineState === 'idle'
                    ? 'Warm up, center the cursor, then start the run.'
                    : 'Locked in. Stay smooth and keep the streak alive.'}
                </p>
              </div>

              <div className="rounded-full border border-accent/20 bg-accent-muted px-3 py-1 text-xs font-medium text-accent-light">
                {config.mode === 'code'
                  ? `${config.codeLanguage} mode`
                  : config.mode === 'words'
                    ? `${config.wordCount} words`
                    : config.mode === 'time'
                      ? `${config.timeLimit}s run`
                      : 'zen mode'}
              </div>
            </div>

            {/* Live stats bar */}
            {engineState === 'active' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <StatsBar
                  wpm={wpm}
                  rawWpm={rawWpm}
                  accuracy={accuracy}
                  errors={errors}
                  timeLeft={timeLeft}
                  timeElapsed={timeElapsed}
                  showLiveWpm={config.showLiveWpm}
                  mode={config.mode}
                />
              </motion.div>
            )}

            {/* Word display */}
            <div className="relative">
              <WordDisplay
                words={words}
                currentWordIndex={currentWordIndex}
                currentCharIndex={currentCharIndex}
                engineState={engineState}
                smoothCaret={config.smoothCaret}
                fontSize={config.fontSize}
                containerRef={containerRef}
              />

              {/* Combo streak overlay */}
              <ComboStreak combo={combo} />

              {/* Idle hint */}
              <AnimatePresence>
                {engineState === 'idle' && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.4 }}
                    className="absolute inset-0 flex items-center justify-center
                               text-sm font-medium text-text-secondary pointer-events-none
                               opacity-40 hover:opacity-100 transition-opacity duration-300"
                  >
                    Click here or start typing to begin
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Hidden input — captures all keystrokes */}
            <input
              ref={inputRef}
              onKeyDown={handleKeyDown}
              className="sr-only"
              aria-label="Typing input"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              readOnly={isFinished}
            />

            {/* Restart shortcut hint */}
            <div className="flex items-center justify-end">
              <button
                onClick={restart}
                title="Restart (Tab)"
                className="flex items-center gap-1.5 text-xs text-text-muted
                           hover:text-text-secondary transition-colors"
              >
                <RotateCcw size={11} />
                <span>Tab to restart</span>
              </button>
            </div>
          </motion.div>
        ) : (
          /* ── Results panel ── */
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          >
            {results && (
              <ResultsPanel results={results} onRestart={restart} />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab key shortcut listener */}
      <TabRestartListener onRestart={restart} />
    </div>
  );
}

/* Listen for Tab key globally to restart test */
function TabRestartListener({ onRestart }: { onRestart: () => void }) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Tab') {
        e.preventDefault();
        onRestart();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onRestart]);
  return null;
}
