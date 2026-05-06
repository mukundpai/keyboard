'use client';

import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface CaretProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  currentWordIndex: number;
  currentCharIndex: number;
  smooth: boolean;
}

export function Caret({
  containerRef,
  currentWordIndex,
  currentCharIndex,
  smooth,
}: CaretProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 520, damping: 32, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 520, damping: 32, mass: 0.6 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Find the character element at the current position
    const charEl = container.querySelector<HTMLElement>(
      `[data-wi="${currentWordIndex}"][data-ci="${currentCharIndex}"]`,
    );

    if (charEl) {
      const cRect = container.getBoundingClientRect();
      const eRect = charEl.getBoundingClientRect();
      x.set(eRect.left - cRect.left);
      y.set(eRect.top - cRect.top);
    } else {
      // Caret is at end of last word — position after the last typed char
      const lastCharEl = container.querySelector<HTMLElement>(
        `[data-wi="${currentWordIndex}"][data-ci="${currentCharIndex - 1}"]`,
      );
      if (lastCharEl) {
        const cRect = container.getBoundingClientRect();
        const eRect = lastCharEl.getBoundingClientRect();
        x.set(eRect.right - cRect.left);
        y.set(eRect.top - cRect.top);
      }
    }
  }, [currentWordIndex, currentCharIndex, containerRef, x, y]);

  return (
    <motion.div
      className="absolute top-0 left-0 pointer-events-none z-10"
      style={{
        x: smooth ? springX : x,
        y: smooth ? springY : y,
      }}
    >
      {/* Vertical beam */}
      <div
        className="w-[2px] bg-caret rounded-full animate-caret-blink"
        style={{ height: 'var(--line-height-typing, 2rem)' }}
      />
    </motion.div>
  );
}
