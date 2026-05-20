'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Keyboard } from 'lucide-react';
import { useTypingEngine } from '@/hooks/useTypingEngine';
import { useTypingStore } from '@/store/typingStore';
import { WordDisplay } from './WordDisplay';
import { CodeDisplay } from './CodeDisplay';
import { StatsBar } from './StatsBar';
import { ModeSelector } from './ModeSelector';
import { ComboStreak } from './ComboStreak';
import { ResultsPanel } from './ResultsPanel';
import { CommandDeck } from './CommandDeck';
import { KeyboardPreview } from './KeyboardPreview';
import { Button } from '@/components/ui/Button';

export function TypingEngine() {
  const { config } = useTypingStore();
  const [showKeyboard, setShowKeyboard] = useState(false);

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
    lastKeyPress,
    containerRef,
    inputRef,
    handleKeyDown,
    restart,
    focusInput,
  } = useTypingEngine();

  /* Compute finished state early for dependency arrays */
  const isFinished = engineState === 'finished';

  /* Auto-focus the hidden input on mount and when entering idle state */
  useEffect(() => {
    focusInput();
  }, [focusInput]);

  /* Keep input focused while test is active or idle (MonkeyType style) */
  useEffect(() => {
    const handleWindowClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Don't focus if clicking on interactive elements (buttons, links, inputs)
      if (!target.closest('button') && !target.closest('a') && !target.closest('input[type="radio"]') && !target.closest('input[type="button"]')) {
        if (!isFinished) {
          focusInput();
        }
      }
    };

    window.addEventListener('click', handleWindowClick);
    return () => window.removeEventListener('click', handleWindowClick);
  }, [focusInput, isFinished]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">

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
            className="glass-card p-8 sm:p-12 space-y-6 shadow-surface-lg cursor-text"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-active/15 pb-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-text-muted">
                  Typing Chamber
                </p>
                <p className="mt-1 text-sm text-text-secondary">
                  {engineState === 'idle'
                    ? 'Center yourself. Start typing whenever you\'re ready.'
                    : 'Locked in. Stay smooth and keep the streak alive.'}
                </p>
              </div>

              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white shadow-glow-sm">
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

            {/* Word / Code display */}
            <div className="relative">
              {config.mode === 'code' ? (
                <CodeDisplay
                  words={words}
                  currentWordIndex={currentWordIndex}
                  currentCharIndex={currentCharIndex}
                  engineState={engineState}
                  smoothCaret={config.smoothCaret}
                  containerRef={containerRef}
                />
              ) : (
                <WordDisplay
                  words={words}
                  currentWordIndex={currentWordIndex}
                  currentCharIndex={currentCharIndex}
                  engineState={engineState}
                  smoothCaret={config.smoothCaret}
                  fontSize={config.fontSize}
                  containerRef={containerRef}
                />
              )}

              {/* Combo streak overlay */}
              <ComboStreak combo={combo} />
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

            {/* Footer row: keyboard toggle + restart hint */}
            <div className="flex items-center justify-between">
              <button
                onClick={(e) => { e.stopPropagation(); setShowKeyboard((v) => !v); }}
                title={showKeyboard ? 'Hide keyboard' : 'Show keyboard preview'}
                className={`flex items-center gap-1.5 text-xs transition-colors ${
                  showKeyboard
                    ? 'text-accent-light'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                <Keyboard size={12} />
                <span>{showKeyboard ? 'keyboard on' : 'keyboard'}</span>
              </button>

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

      {/* Floating keyboard preview — outside the card so no border artifacts */}
      <AnimatePresence>
        {showKeyboard && !isFinished && (
          <motion.div
            key="kbd-preview"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="flex justify-center"
          >
            <KeyboardPreview
              lastKeyPress={lastKeyPress}
              engineState={engineState}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab key shortcut listener */}
      <TabRestartListener
        onRestart={restart}
        engineState={engineState}
        isCodeMode={config.mode === 'code'}
      />
    </div>
  );
}

/* Listen for Tab key globally to restart test */
function TabRestartListener({
  onRestart,
  engineState,
  isCodeMode,
}: {
  onRestart: () => void;
  engineState: string;
  isCodeMode: boolean;
}) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Tab') {
        e.preventDefault();
        // Don't restart mid-test in code mode (Tab is used for indentation)
        if (isCodeMode && engineState === 'active') return;
        onRestart();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onRestart, engineState, isCodeMode]);
  return null;
}
