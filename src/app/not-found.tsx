'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Home, Search } from 'lucide-react';

/* ─── The "missing" key rows ──────────────────────────────────── */
const ROW_1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
const ROW_2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
const ROW_3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];
const ALL_ROWS = [ROW_1, ROW_2, ROW_3];

// Keys that spell "404" are missing from the board
const MISSING_KEYS = new Set(['4', '0']); // numeric — shown as phantom slots

/* ─── Typewriter hook ─────────────────────────────────────────── */
function useTypewriter(text: string, speed = 55) {
  const [output, setOutput] = useState('');
  useEffect(() => {
    setOutput('');
    let i = 0;
    const id = setInterval(() => {
      i++;
      setOutput(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return output;
}

/* ─── Floating ghost key ──────────────────────────────────────── */
function GhostKey({ label, delay }: { label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: [0, 0.25, 0], y: [10, -18, -28] }}
      transition={{ delay, duration: 2.4, repeat: Infinity, repeatDelay: 3 }}
      className="absolute inline-flex items-center justify-center w-8 h-8
                 rounded-md border border-dashed border-text-muted/40
                 text-text-muted/50 text-xs font-mono font-bold select-none"
    >
      {label}
    </motion.div>
  );
}

/* ─── Key component ───────────────────────────────────────────── */
function Key({ label, delay }: { label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 220, damping: 14 }}
      className="inline-flex items-center justify-center
                 w-8 h-8 rounded-md text-xs font-bold select-none
                 bg-surface border border-border text-text-secondary
                 shadow-[0_2px_0px_0px_hsl(var(--border))]"
    >
      {label}
    </motion.div>
  );
}

/* ─── 404 digit display ───────────────────────────────────────── */
function BigDigit({ char, delay }: { char: string; delay: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 160 }}
      className="font-mono font-black text-7xl sm:text-8xl leading-none
                 text-transparent bg-clip-text
                 bg-gradient-to-b from-accent-light to-accent"
    >
      {char}
    </motion.span>
  );
}

/* ─── Main ────────────────────────────────────────────────────── */
export default function NotFound() {
  const message = useTypewriter("The key you're looking for doesn't exist on this board.");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setShowCursor((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80dvh] gap-8 px-4 text-center overflow-hidden">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Soft glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      w-[350px] h-[200px] rounded-full bg-accent/6 blur-3xl" />

      {/* ── Keyboard ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 110, delay: 0.05 }}
        className="relative flex flex-col items-center gap-1.5"
      >
        {/* Floating ghost keys (the "missing" ones) */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-6">
          <GhostKey label="4" delay={1.0} />
          <GhostKey label="0" delay={1.5} />
          <GhostKey label="4" delay={2.0} />
        </div>

        {ALL_ROWS.map((row, ri) => (
          <div key={ri} className="flex gap-1.5">
            {row.map((k, ki) => (
              <Key key={ki} label={k} delay={0.04 * (ri * 10 + ki)} />
            ))}
          </div>
        ))}

        {/* Space bar row */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.6 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 160 }}
          className="w-48 h-8 rounded-md bg-surface border border-border
                     shadow-[0_2px_0px_0px_hsl(var(--border))]"
        />
      </motion.div>

      {/* ── 404 number ── */}
      <div className="flex items-end gap-1 leading-none">
        <BigDigit char="4" delay={0.4} />
        <BigDigit char="0" delay={0.55} />
        <BigDigit char="4" delay={0.7} />
      </div>

      {/* ── Typewriter message ── */}
      <div className="min-h-[1.5rem]">
        <p className="text-sm font-mono text-text-secondary">
          {message}
          <span className={`inline-block w-0.5 h-3.5 bg-accent-light align-middle ml-0.5 ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
        </p>
      </div>

      {/* ── Actions ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="flex flex-wrap items-center justify-center gap-3"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                     bg-accent/90 hover:bg-accent text-white text-sm font-semibold
                     shadow-lg shadow-accent/20 hover:shadow-accent/40
                     transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
        >
          <Home size={15} />
          Back to typing
        </Link>

        <Link
          href="/arena"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                     bg-surface border border-border hover:border-border-active
                     text-text-primary text-sm font-medium
                     transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
        >
          <Search size={15} />
          Browse races
        </Link>
      </motion.div>
    </div>
  );
}
