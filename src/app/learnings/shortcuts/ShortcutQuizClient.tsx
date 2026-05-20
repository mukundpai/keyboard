'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, CheckCircle2, XCircle, RotateCcw, Trophy } from 'lucide-react';
import { SHORTCUT_QUESTIONS, APP_LABELS, getShortcutDeck, type ShortcutQuestion } from '@/data/shortcuts';

const DECK_SIZE = 15;

function ShortcutCard({
  question,
  onAnswer,
}: {
  question: ShortcutQuestion;
  onAnswer: (correct: boolean) => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const [answered, setAnswered] = useState<boolean | null>(null);

  function handleAnswer(correct: boolean) {
    setAnswered(correct);
    setTimeout(() => onAnswer(correct), 600);
  }

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
      className="glass-card p-8 space-y-6 max-w-lg mx-auto"
    >
      {/* App badge */}
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-xs font-semibold text-indigo-300">
          {APP_LABELS[question.app]}
        </span>
        <span className="text-xs text-muted capitalize">{question.difficulty}</span>
      </div>

      {/* Action prompt */}
      <div className="text-center space-y-1">
        <p className="text-xs text-muted uppercase tracking-widest">What is the shortcut for…</p>
        <p className="text-xl font-bold text-text-primary">{question.action}</p>
      </div>

      {/* Reveal / Answer area */}
      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="w-full py-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-sm font-semibold text-indigo-300 transition-colors"
        >
          Show Answer
        </button>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <div className="inline-flex flex-wrap gap-1.5 justify-center">
              {question.keys.map((k) => (
                <kbd
                  key={k}
                  className="px-2.5 py-1 rounded-lg bg-surface-raised border border-white/20 text-sm font-mono font-bold text-text-primary shadow-sm"
                >
                  {k}
                </kbd>
              ))}
            </div>
            <p className="text-xs text-muted mt-1">{question.shortcut}</p>
          </div>

          {answered === null ? (
            <div className="flex gap-3">
              <button
                onClick={() => handleAnswer(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-sm font-semibold transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                Got it!
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 text-sm font-semibold transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Missed
              </button>
            </div>
          ) : (
            <div
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold ${
                answered
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'bg-red-500/10 text-red-400'
              }`}
            >
              {answered ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {answered ? 'Nice!' : 'Keep practicing!'}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default function ShortcutQuizClient() {
  const [deck, setDeck] = useState<ShortcutQuestion[]>(() => getShortcutDeck(undefined, DECK_SIZE));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const handleAnswer = useCallback(
    (correct: boolean) => {
      if (correct) setScore((s) => s + 1);
      const next = index + 1;
      if (next >= deck.length) {
        setDone(true);
      } else {
        setIndex(next);
      }
    },
    [index, deck.length],
  );

  function restart() {
    setDeck(getShortcutDeck(undefined, DECK_SIZE));
    setIndex(0);
    setScore(0);
    setDone(false);
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-10 space-y-8">
      {/* Header */}
      <div className="glass-card p-6 animate-slide-up">
        <div className="flex items-center gap-2 mb-1">
          <Keyboard className="w-5 h-5 text-indigo-400" />
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">
            Shortcut Quiz
          </span>
        </div>
        <h1 className="text-2xl font-bold text-text-primary">Keyboard Shortcut Challenge</h1>
        <p className="text-sm text-muted mt-1">
          Test your knowledge of VS Code, Chrome, and Figma shortcuts.
        </p>
      </div>

      {/* Progress */}
      {!done && (
        <div className="flex items-center gap-3 text-sm">
          <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-indigo-500 rounded-full"
              animate={{ width: `${((index) / deck.length) * 100}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
          <span className="text-muted tabular-nums">{index + 1} / {deck.length}</span>
          <span className="text-emerald-400 font-semibold tabular-nums">{score} ✓</span>
        </div>
      )}

      {/* Card */}
      <AnimatePresence mode="wait">
        {!done ? (
          <ShortcutCard
            key={deck[index].id}
            question={deck[index]}
            onAnswer={handleAnswer}
          />
        ) : (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 text-center space-y-4 max-w-lg mx-auto"
          >
            <Trophy className="w-10 h-10 text-amber-400 mx-auto" />
            <h2 className="text-2xl font-bold text-text-primary">Quiz Complete!</h2>
            <p className="text-4xl font-bold text-indigo-400">
              {score} <span className="text-xl text-muted font-normal">/ {deck.length}</span>
            </p>
            <p className="text-sm text-muted">
              {score === deck.length
                ? 'Perfect score! You know your shortcuts. 🎉'
                : score >= deck.length * 0.7
                  ? 'Great job! Keep drilling the ones you missed.'
                  : 'Keep practicing — shortcuts become second nature with repetition.'}
            </p>
            <button
              onClick={restart}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
