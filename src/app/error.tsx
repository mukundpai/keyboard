'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { RotateCcw, Home, Terminal } from 'lucide-react';

/* ─── Broken key visual ───────────────────────────────────────── */
const BROKEN_KEYS = ['E', 'R', 'R', 'O', 'R'];

const KEYBOARD_ROW = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

/* ─── Glitch hook ─────────────────────────────────────────────── */
function useGlitch(text: string, interval = 80) {
  const chars = '!@#$%^&*<>?/|\\~`';
  const [glitched, setGlitched] = useState(text);
  const frame = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      frame.current++;
      if (frame.current % 6 === 0) {
        // Occasionally glitch 1–2 chars
        setGlitched(
          text
            .split('')
            .map((c, i) =>
              Math.random() < 0.08 ? chars[Math.floor(Math.random() * chars.length)] : c,
            )
            .join(''),
        );
      } else {
        setGlitched(text);
      }
    }, interval);
    return () => clearInterval(id);
  }, [text, interval]);

  return glitched;
}

/* ─── Key component ───────────────────────────────────────────── */
function Key({
  label,
  isError,
  delay,
}: {
  label: string;
  isError: boolean;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
      className={`
        relative inline-flex items-center justify-center
        w-8 h-8 rounded-md text-xs font-bold select-none
        border shadow-[0_2px_0px_0px] transition-colors
        ${
          isError
            ? 'bg-red-500/20 border-red-500/60 shadow-red-900/60 text-red-400 ring-1 ring-red-500/40'
            : 'bg-surface border-border shadow-border/80 text-text-secondary'
        }
      `}
    >
      {label}
      {isError && (
        <motion.span
          className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500"
          animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        />
      )}
    </motion.div>
  );
}

/* ─── Typing log lines ────────────────────────────────────────── */
const LOG_LINES = [
  '> Initializing keystroke engine…',
  '> Loading WPM tracker………… OK',
  '> Calibrating finger sensors… OK',
  '> Mounting race engine………… OK',
  '> Checking error state……… FAILED',
  '> Attempting recovery………… FAILED',
  '> Dumping keystroke buffer…',
];

function TerminalLog({ error }: { error?: Error }) {
  const [visible, setVisible] = useState<string[]>([]);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      if (i < LOG_LINES.length) {
        setVisible((v) => [...v, LOG_LINES[i]]);
        i++;
      } else {
        clearInterval(id);
      }
    }, 200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="w-full max-w-md rounded-xl border border-border bg-surface/60 backdrop-blur text-xs font-mono overflow-hidden">
      {/* terminal title bar */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border bg-surface-raised">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        <Terminal size={12} className="ml-2 text-text-muted" />
        <span className="text-text-muted text-[10px] ml-1">keymaster — error trace</span>
      </div>

      <div className="p-3 space-y-0.5">
        <AnimatePresence>
          {visible.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className={
                line.includes('FAILED')
                  ? 'text-red-400'
                  : line.includes('OK')
                    ? 'text-green-400'
                    : 'text-text-muted'
              }
            >
              {line}
            </motion.p>
          ))}
        </AnimatePresence>

        {visible.length === LOG_LINES.length && error?.message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-red-300 mt-1 break-all"
          >
            {'> '}
            <span className="text-red-400">{error.message}</span>
          </motion.p>
        )}

        {/* blinking cursor */}
        <motion.span
          className="inline-block w-1.5 h-3.5 bg-accent-light align-middle ml-0.5"
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.7, ease: 'steps(1)' }}
        />
      </div>
    </div>
  );
}

/* ─── Main Error Page ─────────────────────────────────────────── */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const title = useGlitch('KEYSTROKE ANOMALY');

  return (
    <div className="relative min-h-screen bg-background overflow-hidden flex flex-col items-center justify-center gap-8 p-6">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Radial glow behind keyboard */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] rounded-full bg-red-500/8 blur-3xl" />

      {/* ── Keyboard visual ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 120, delay: 0.1 }}
        className="flex flex-col items-center gap-1.5"
      >
        {KEYBOARD_ROW.map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-1.5">
            {row.map((key, keyIdx) => {
              const globalIdx = rowIdx * 10 + keyIdx;
              const isError = BROKEN_KEYS.includes(key);
              return (
                <Key
                  key={`${key}-${keyIdx}`}
                  label={key}
                  isError={isError}
                  delay={0.05 * globalIdx}
                />
              );
            })}
          </div>
        ))}
      </motion.div>

      {/* ── Glitch title ── */}
      <div className="text-center space-y-2">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs tracking-[0.3em] uppercase text-red-400/80 font-mono"
        >
          Critical Fault · Code 500
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl sm:text-4xl font-bold tracking-widest text-text-primary font-mono"
          style={{ textShadow: '2px 0 0 rgba(239,68,68,0.3), -2px 0 0 rgba(99,102,241,0.3)' }}
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-text-secondary text-sm max-w-xs mx-auto"
        >
          The typing engine encountered an unexpected error and had to stop. Your keystrokes are safe.
        </motion.p>
      </div>

      {/* ── Terminal log ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full flex justify-center"
      >
        <TerminalLog error={error} />
      </motion.div>

      {/* ── Actions ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8 }}
        className="flex flex-wrap items-center justify-center gap-3"
      >
        <button
          onClick={reset}
          className="
            inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
            bg-accent/90 hover:bg-accent text-white text-sm font-semibold
            shadow-lg shadow-accent/20 hover:shadow-accent/40
            transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0
          "
        >
          <RotateCcw size={15} />
          Retry
        </button>

        <Link
          href="/"
          className="
            inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
            bg-surface border border-border hover:border-border-active
            text-text-primary text-sm font-medium
            transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0
          "
        >
          <Home size={15} />
          Back home
        </Link>
      </motion.div>

      {error.digest && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-[10px] text-text-muted font-mono"
        >
          digest: {error.digest}
        </motion.p>
      )}
    </div>
  );
}
