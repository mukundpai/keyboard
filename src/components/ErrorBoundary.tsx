'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/* Mini keyboard showing E-R-R-O-R keys lit up */
const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];
const ERROR_KEYS = new Set(['E', 'R', 'O']);

function MiniKeyboard() {
  return (
    <div className="flex flex-col items-center gap-1 mb-1">
      {ROWS.map((row, ri) => (
        <div key={ri} className="flex gap-1">
          {row.map((k, ki) => (
            <span
              key={ki}
              className={`
                inline-flex items-center justify-center w-7 h-7 rounded text-[10px] font-bold
                border shadow-[0_2px_0px_0px]
                ${ERROR_KEYS.has(k)
                  ? 'bg-red-500/20 border-red-500/50 text-red-400 shadow-red-900/50 ring-1 ring-red-500/30'
                  : 'bg-surface border-border text-text-muted shadow-border/60'}
              `}
            >
              {k}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-h-screen bg-background flex items-center justify-center p-6"
        >
          <div className="flex flex-col items-center gap-6 text-center max-w-sm w-full">
            <MiniKeyboard />

            <div className="space-y-1.5">
              <p className="text-[10px] tracking-[0.3em] uppercase text-red-400/80 font-mono">
                Keystroke Anomaly
              </p>
              <h2 className="text-2xl font-bold tracking-widest font-mono text-text-primary"
                style={{ textShadow: '1px 0 0 rgba(239,68,68,0.3), -1px 0 0 rgba(99,102,241,0.3)' }}>
                SYSTEM ERROR
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed">
                {this.state.error?.message || 'An unexpected error jammed the typing engine.'}
              </p>
            </div>

            {this.state.error?.message && (
              <div className="w-full rounded-xl border border-border bg-surface/60 p-3 text-left font-mono text-xs">
                <p className="text-text-muted mb-1">{'>'} error.message</p>
                <p className="text-red-400 break-all">{this.state.error.message}</p>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={this.reset}
                className="
                  inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                  bg-accent/90 hover:bg-accent text-white text-sm font-semibold
                  shadow-lg shadow-accent/20 hover:shadow-accent/40
                  transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0
                "
              >
                <RotateCcw size={14} />
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
                <Home size={14} />
                Back home
              </Link>
            </div>
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}
