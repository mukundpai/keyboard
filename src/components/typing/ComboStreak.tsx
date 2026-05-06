'use client';

import { useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface FloatingLabel {
  id: number;
  text: string;
  x: number;
}

interface ComboStreakProps {
  combo: number;
}

const MILESTONES = [10, 25, 50, 100, 200];
const LABELS = ['Nice!', 'Great!', 'Amazing!', 'Incredible!', 'Godlike!'];

export function ComboStreak({ combo }: ComboStreakProps) {
  const [labels, setLabels] = useState<FloatingLabel[]>([]);
  const idRef = useRef(0);
  const prevComboRef = useRef(0);

  // Fire a floating label when a milestone is crossed
  if (combo !== prevComboRef.current) {
    const mi = MILESTONES.indexOf(combo);
    if (mi !== -1) {
      const label: FloatingLabel = {
        id: ++idRef.current,
        text: `${combo} ${LABELS[mi]}`,
        x: Math.random() * 60 - 30, // slight horizontal spread
      };
      setLabels((prev) => [...prev, label]);
      setTimeout(
        () => setLabels((prev) => prev.filter((l) => l.id !== label.id)),
        900,
      );
    }
    prevComboRef.current = combo;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
      <AnimatePresence>
        {labels.map((label) => (
          <motion.div
            key={label.id}
            initial={{ opacity: 1, y: 0, scale: 1, x: label.x }}
            animate={{ opacity: 0, y: -52, scale: 0.85, x: label.x }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            className="absolute bottom-1/2 left-1/2 -translate-x-1/2
                       text-sm font-semibold text-accent-light
                       px-3 py-1 rounded-full bg-accent-muted border border-accent/20
                       whitespace-nowrap"
          >
            {label.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
