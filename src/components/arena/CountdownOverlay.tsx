'use client';

import { AnimatePresence, motion } from 'framer-motion';

interface CountdownOverlayProps {
  seconds: number | null;
}

export function CountdownOverlay({ seconds }: CountdownOverlayProps) {
  const visible = seconds !== null;
  const isGo = seconds === 0;
  const label = isGo ? 'GO!' : String(seconds);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="countdown-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center
                     bg-background/70 backdrop-blur-md"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={label}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.6, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className="flex flex-col items-center gap-4 select-none"
            >
              <span
                className={
                  isGo
                    ? 'text-8xl font-black font-display tracking-tight text-success drop-shadow-lg'
                    : 'text-9xl font-black font-display tracking-tight text-text-primary drop-shadow-lg'
                }
              >
                {label}
              </span>
              <p className="text-sm text-text-secondary uppercase tracking-[0.3em]">
                {isGo ? 'Type!' : 'Get ready'}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
