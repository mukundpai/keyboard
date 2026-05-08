'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Caret } from './Caret';
import type { WordData } from '@/types/typing';

interface WordDisplayProps {
  words: WordData[];
  currentWordIndex: number;
  currentCharIndex: number;
  engineState: 'idle' | 'active' | 'finished';
  smoothCaret: boolean;
  fontSize: 'sm' | 'md' | 'lg';
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const fontSizeCls = {
  sm: 'text-type-sm',
  md: 'text-type-md',
  lg: 'text-type-lg',
};

const LINE_HEIGHT_PX = 36; // must match --line-height-typing approx value
const VISIBLE_LINES = 5;

export function WordDisplay({
  words,
  currentWordIndex,
  currentCharIndex,
  engineState,
  smoothCaret,
  fontSize,
  containerRef,
}: WordDisplayProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [offsetY, setOffsetY] = useState(0);

  /* Scroll the word display so the current line is always on row 1 */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const wordEl = container.querySelector<HTMLElement>(
      `[data-word="${currentWordIndex}"]`,
    );
    if (!wordEl) return;

    const cRect = container.getBoundingClientRect();
    const wRect = wordEl.getBoundingClientRect();
    const relTop = wRect.top - cRect.top - offsetY;

    // When the word is past the first line, shift up by one line
    if (relTop > LINE_HEIGHT_PX) {
      setOffsetY((prev) => prev + LINE_HEIGHT_PX);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWordIndex]);

  return (
    <div
      className="relative select-none font-mono overflow-hidden rounded-lg border border-border-active/10 bg-surface-raised/30 p-4"
      style={{ height: `${LINE_HEIGHT_PX * VISIBLE_LINES}px` }}
      ref={scrollRef}
      role="presentation"
    >

      {/* Sliding word container */}
      <motion.div
        ref={containerRef as React.RefObject<HTMLDivElement>}
        className={cn(
          'relative flex flex-wrap gap-x-[0.5ch] gap-y-0 leading-none',
          fontSizeCls[fontSize],
        )}
        animate={{ y: -offsetY }}
        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
        style={{ lineHeight: `${LINE_HEIGHT_PX}px` }}
      >
        {words.map((word, wi) => (
          <Word
            key={word.id}
            word={word}
            wordIndex={wi}
            isActive={wi === currentWordIndex}
          />
        ))}

        {/* Animated caret */}
        {engineState !== 'finished' && (
          <Caret
            containerRef={containerRef}
            currentWordIndex={currentWordIndex}
            currentCharIndex={currentCharIndex}
            smooth={smoothCaret}
          />
        )}
      </motion.div>
    </div>
  );
}

/* ─── Word sub-component ─────────────────────────────────── */
interface WordProps {
  word: WordData;
  wordIndex: number;
  isActive: boolean;
}

function Word({ word, wordIndex, isActive }: WordProps) {
  const [shakeKey, setShakeKey] = useState(0);
  const prevActive = useRef(false);

  // Detect when we leave this word with errors → trigger shake
  useEffect(() => {
    if (!isActive && prevActive.current) {
      const hasError = word.chars.some(
        (c) => c.state === 'wrong' || c.state === 'extra',
      );
      if (hasError) setShakeKey((k) => k + 1);
    }
    prevActive.current = isActive;
  }, [isActive, word.chars]);

  return (
    <motion.span
      data-word={wordIndex}
      key={shakeKey > 0 ? `shake-${shakeKey}` : `word-${wordIndex}`}
      animate={
        shakeKey > 0
          ? { x: [0, -4, 4, -3, 3, -1, 1, 0] }
          : { x: 0 }
      }
      transition={{ duration: 0.28, ease: 'easeInOut' }}
      className={cn(
        'relative inline-block',
        word.isCompleted &&
          word.chars.some((c) => c.state === 'wrong') &&
          'underline decoration-wrong/40 decoration-dotted underline-offset-4',
      )}
    >
      {word.chars.map((char, ci) => (
        <span
          key={ci}
          data-wi={wordIndex}
          data-ci={ci}
          className={cn(
            'char',
            char.state === 'idle'    && 'char-idle',
            char.state === 'correct' && 'char-correct',
            char.state === 'wrong'   && 'char-wrong',
            char.state === 'extra'   && 'char-extra',
          )}
        >
          {char.char}
        </span>
      ))}
    </motion.span>
  );
}
