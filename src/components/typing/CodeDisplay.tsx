'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Caret } from './Caret';
import type { WordData } from '@/types/typing';
import type { TokenType } from '@/types/typing';

interface CodeDisplayProps {
  words: WordData[];
  currentWordIndex: number;
  currentCharIndex: number;
  engineState: 'idle' | 'active' | 'finished';
  smoothCaret: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const LINE_HEIGHT = 26; // px – keep in sync with style below
const VISIBLE_LINES = 12;

function tokenClass(tt?: TokenType): string {
  switch (tt) {
    case 'keyword':  return 'text-[#569CD6]';
    case 'string':   return 'text-[#CE9178]';
    case 'comment':  return 'text-[#6A9955] italic';
    case 'number':   return 'text-[#B5CEA8]';
    case 'function': return 'text-[#DCDCAA]';
    case 'type':     return 'text-[#4EC9B0]';
    case 'operator': return 'text-[#D4D4D4]';
    case 'bracket':  return 'text-[#FFD700]';
    case 'tag':      return 'text-[#4FC1FF]';
    default:         return 'text-[#D4D4D4]';
  }
}

export function CodeDisplay({
  words,
  currentWordIndex,
  currentCharIndex,
  engineState,
  smoothCaret,
  containerRef,
}: CodeDisplayProps) {
  const [offsetY, setOffsetY] = useState(0);

  /* Scroll so active line stays near the top of the visible area */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const lineEl = container.querySelector<HTMLElement>(
      `[data-word="${currentWordIndex}"]`,
    );
    if (!lineEl) return;

    const cRect = container.getBoundingClientRect();
    const lRect = lineEl.getBoundingClientRect();
    const relTop = lRect.top - cRect.top - offsetY;

    if (relTop > LINE_HEIGHT * 3) {
      setOffsetY((prev) => prev + LINE_HEIGHT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWordIndex]);

  /* Reset scroll on new snippet */
  useEffect(() => {
    setOffsetY(0);
  }, [words]);

  const lineNumWidth = String(words.length).length + 1; // dynamic gutter width

  return (
    <div
      className="relative select-none overflow-hidden rounded-lg border border-[#3e3e42] bg-[#1e1e1e]"
      style={{ height: `${LINE_HEIGHT * VISIBLE_LINES}px`, fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace", fontSize: '13px' }}
      role="presentation"
    >
      {/* Scrolling content */}
      <motion.div
        ref={containerRef as React.RefObject<HTMLDivElement>}
        className="relative"
        animate={{ y: -offsetY }}
        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
      >
        {words.map((line, li) => {
          const isActive = li === currentWordIndex;
          const isFuture = li > currentWordIndex;

          return (
            <div
              key={line.id}
              data-word={li}
              className={cn(
                'flex items-center',
                isActive && 'bg-[#ffffff07]',
              )}
              style={{ height: `${LINE_HEIGHT}px`, lineHeight: `${LINE_HEIGHT}px` }}
            >
              {/* Line number gutter */}
              <span
                className={cn(
                  'select-none text-right shrink-0 tabular-nums pr-3',
                  isActive ? 'text-[#C6C6C6]' : 'text-[#495157]',
                )}
                style={{ width: `${lineNumWidth + 1}ch`, fontSize: '11px' }}
              >
                {li + 1}
              </span>

              {/* Divider */}
              <span className="shrink-0 w-px bg-[#3e3e42] mr-3 self-stretch" />

              {/* Characters */}
              <span className="flex-1 whitespace-pre">
                {line.chars.map((char, ci) => {
                  const baseColor = tokenClass(char.tokenType);
                  const isSpace = char.char === ' ';

                  return (
                    <span
                      key={ci}
                      data-wi={li}
                      data-ci={ci}
                      className={cn(
                        baseColor,
                        /* idle chars: dimmed depending on context */
                        char.state === 'idle' && isFuture && 'opacity-25',
                        char.state === 'idle' && isActive && 'opacity-50',
                        char.state === 'idle' && !isActive && !isFuture && 'opacity-25',
                        /* typed states */
                        char.state === 'correct' && 'opacity-100',
                        char.state === 'wrong' && '!text-[#F44747]',
                        char.state === 'extra' && '!text-[#F44747] opacity-60',
                        /* show indent guides on active spaces */
                        isSpace && char.state === 'idle' && isActive && 'border-b border-dashed border-[#ffffff18]',
                      )}
                    >
                      {char.char}
                    </span>
                  );
                })}

                {/* End-of-line anchor so caret can sit after last char */}
                <span
                  data-wi={li}
                  data-ci={line.chars.length}
                  className="inline-block w-0 overflow-hidden"
                />
              </span>
            </div>
          );
        })}

        {/* Caret lives inside the scrolling div so coordinates match */}
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
