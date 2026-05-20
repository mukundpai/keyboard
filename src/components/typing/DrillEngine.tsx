'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, ShieldCheck } from 'lucide-react';
import type { DrillDef } from '@/data/drills';

export function DrillEngine({ drill }: { drill: DrillDef }) {
  const [engineState, setEngineState] = useState<'idle' | 'active' | 'finished'>('idle');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const targetChars = drill.content.split('');

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    focusInput();
    const handleWindowClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('button') && !target.closest('a')) {
        if (engineState !== 'finished') focusInput();
      }
    };
    window.addEventListener('click', handleWindowClick);
    return () => window.removeEventListener('click', handleWindowClick);
  }, [focusInput, engineState]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (engineState === 'finished') return;
    
    // Ignore meta keys
    if (e.ctrlKey || e.metaKey || e.altKey || e.key.length > 1) {
      if (e.key === 'Backspace' && currentIndex > 0) {
        // Drills are strict: no backspacing allowed, or maybe allow it if we want to be lenient?
        // Let's allow backspace to correct an error state if we had one, but we are doing "strict progression" (must type correctly to advance)
        // In strict progression, you can't advance until you hit the right key, so backspace does nothing.
      }
      return;
    }

    if (engineState === 'idle') {
      setEngineState('active');
      setStartTime(Date.now());
    }

    const expectedChar = targetChars[currentIndex];
    
    if (e.key === expectedChar) {
      // Correct character
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      
      if (nextIndex === targetChars.length) {
        // Finished
        setEngineState('finished');
        setEndTime(Date.now());
      }
    } else {
      // Incorrect character
      setErrors(e => e + 1);
    }
  };

  const handleRestart = () => {
    setEngineState('idle');
    setCurrentIndex(0);
    setErrors(0);
    setStartTime(null);
    setEndTime(null);
    focusInput();
  };

  // Prevent default Tab behavior to allow restart via Tab
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        handleRestart();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const totalTimeSeconds = endTime && startTime ? (endTime - startTime) / 1000 : 0;
  const accuracy = targetChars.length > 0 ? Math.max(0, 100 - (errors / targetChars.length) * 100) : 100;
  const wpm = totalTimeSeconds > 0 ? Math.round(((targetChars.length / 5) / totalTimeSeconds) * 60) : 0;

  return (
    <div className="w-full h-full flex flex-col space-y-6">
      <AnimatePresence mode="wait">
        {engineState !== 'finished' ? (
          <motion.div
            key="drilling"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card flex-grow flex flex-col p-8 sm:p-12 cursor-text shadow-surface-lg relative overflow-hidden"
          >
            {/* Strict mode indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-raised border border-border-subtle text-xs text-text-muted">
              <ShieldCheck size={14} className="text-correct" />
              <span>Strict Progression</span>
            </div>

            <div className="text-sm text-text-secondary mb-8">
              Errors: <span className={errors > 0 ? 'text-wrong font-bold' : ''}>{errors}</span>
            </div>

            {/* Drill Text Area */}
            <div 
              ref={containerRef}
              className="relative text-2xl leading-[2.2rem] font-mono select-none break-words flex-grow"
            >
              {targetChars.map((char, i) => {
                const isPassed = i < currentIndex;
                const isCurrent = i === currentIndex;
                
                return (
                  <span
                    key={i}
                    className={`relative inline-block transition-colors duration-75 ${
                      isPassed ? 'text-text-primary' : isCurrent ? 'text-text-primary' : 'text-text-disabled'
                    }`}
                  >
                    {char === ' ' && !isPassed && !isCurrent ? '_' : char}
                    
                    {/* Active Caret */}
                    {isCurrent && (
                      <span className="absolute left-0 bottom-1 w-full h-[3px] bg-accent animate-pulse" />
                    )}
                  </span>
                );
              })}
            </div>

            <input
              ref={inputRef}
              onKeyDown={handleKeyDown}
              className="sr-only"
              aria-label="Drill input"
              autoComplete="off"
              spellCheck={false}
            />

            <div className="flex items-center justify-between mt-auto pt-6">
              <span className="text-xs text-text-muted">Type the exact character to proceed.</span>
              <button
                onClick={handleRestart}
                className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors"
              >
                <RotateCcw size={11} />
                <span>Tab to restart</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 text-center flex flex-col items-center justify-center flex-grow"
          >
            <ShieldCheck size={48} className="text-correct mb-6" />
            <h2 className="text-2xl font-bold text-text-primary mb-2 font-display">Drill Complete</h2>
            <p className="text-text-secondary mb-10 max-w-sm">
              You successfully completed the <strong className="text-text-primary">{drill.title}</strong> drill.
            </p>

            <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-10">
              <div className="stat-pill">
                <span className="stat-value text-accent-light">{accuracy.toFixed(1)}%</span>
                <span className="stat-label">Accuracy</span>
              </div>
              <div className="stat-pill">
                <span className="stat-value">{wpm}</span>
                <span className="stat-label">WPM</span>
              </div>
            </div>

            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 border border-white/10 text-white font-medium hover:bg-white/20 transition-colors shadow-glow-sm"
            >
              <RotateCcw size={16} />
              Run Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
