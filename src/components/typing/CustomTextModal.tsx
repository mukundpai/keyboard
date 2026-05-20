'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Type } from 'lucide-react';
import { useTypingStore } from '@/store/typingStore';

const MAX_CHARS = 5000;

interface CustomTextModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CustomTextModal({ open, onClose }: CustomTextModalProps) {
  const setConfig = useTypingStore((s) => s.setConfig);
  const config = useTypingStore((s) => s.config);
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleApply() {
    const trimmed = text.trim();
    if (!trimmed) return;
    setConfig({ ...config, mode: 'custom', customText: trimmed });
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed z-50 inset-x-4 top-[15%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[560px] glass-card border border-white/10 rounded-2xl p-6 shadow-2xl"
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-semibold text-text-primary">
                  Custom Text
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) =>
                setText(e.target.value.slice(0, MAX_CHARS))
              }
              placeholder="Paste any text or code you want to type…"
              className="w-full h-44 resize-none bg-black/30 border border-white/10 rounded-xl p-3 text-sm text-text-primary placeholder:text-muted font-mono focus:outline-none focus:border-indigo-500/50 transition-colors"
              autoFocus
              spellCheck={false}
            />

            {/* Footer */}
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-muted">
                {text.length} / {MAX_CHARS}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-lg text-xs text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  disabled={!text.trim()}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
                >
                  Start Typing
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
