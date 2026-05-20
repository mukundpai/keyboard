'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTypingStore } from '@/store/typingStore';
import type { TestMode, TimeOption, WordOption, CodeLanguage } from '@/types/typing';
import CustomTextModal from './CustomTextModal';

const TIME_OPTS: TimeOption[] = [15, 30, 60, 120];
const WORD_OPTS: WordOption[] = [10, 25, 50, 100];
const CODE_OPTS: { lang: CodeLanguage; label: string }[] = [
  { lang: 'python', label: 'Python' },
  { lang: 'react',  label: 'React'  },
  { lang: 'django', label: 'Django' },
];

const MODES: { id: TestMode; label: string }[] = [
  { id: 'time',   label: 'time'   },
  { id: 'words',  label: 'words'  },
  { id: 'zen',    label: 'zen'    },
  { id: 'code',   label: 'code'   },
  { id: 'quote',  label: 'quote'  },
  { id: 'custom', label: 'custom' },
];

interface ModeSelectorProps {
  onRestart: () => void;
}

export function ModeSelector({ onRestart }: ModeSelectorProps) {
  const { config, setConfig } = useTypingStore();
  const [customModalOpen, setCustomModalOpen] = useState(false);

  const setMode = (mode: TestMode) => {
    if (mode === 'custom') {
      setCustomModalOpen(true);
      return;
    }
    setConfig({ mode });
    onRestart();
  };
  const setTime  = (t: TimeOption)    => { setConfig({ timeLimit: t }); onRestart(); };
  const setWords = (w: WordOption)    => { setConfig({ wordCount: w }); onRestart(); };
  const setLang  = (l: CodeLanguage)  => { setConfig({ codeLanguage: l }); onRestart(); };

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-2 text-sm">

        {/* Mode tabs */}
        <div className="flex items-center gap-1 bg-surface/50 rounded-full px-1.5 py-1 border border-border-active/20">
          {MODES.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              className={cn(
                'mode-tab',
                config.mode === id && 'mode-tab-active',
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Sub-options */}
        {config.mode === 'time' && (
          <OptionGroup>
            {TIME_OPTS.map((t) => (
              <OptionPill key={t} active={config.timeLimit === t} onClick={() => setTime(t)}>
                {t}s
              </OptionPill>
            ))}
          </OptionGroup>
        )}

        {config.mode === 'words' && (
          <OptionGroup>
            {WORD_OPTS.map((w) => (
              <OptionPill key={w} active={config.wordCount === w} onClick={() => setWords(w)}>
                {w}
              </OptionPill>
            ))}
          </OptionGroup>
        )}

        {config.mode === 'code' && (
          <OptionGroup>
            {CODE_OPTS.map(({ lang, label }) => (
              <OptionPill key={lang} active={config.codeLanguage === lang} onClick={() => setLang(lang)}>
                {label}
              </OptionPill>
            ))}
          </OptionGroup>
        )}

        {config.mode === 'custom' && (
          <OptionGroup>
            <OptionPill active onClick={() => setCustomModalOpen(true)}>
              edit text
            </OptionPill>
          </OptionGroup>
        )}
      </div>

      <CustomTextModal
        open={customModalOpen}
        onClose={() => {
          setCustomModalOpen(false);
          onRestart();
        }}
      />
    </>
  );
}

/* ─── Sub-components ────────────────────────────────────── */
function OptionGroup({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: 0.15 }}
      className="flex items-center gap-1 bg-surface/50 rounded-full px-1.5 py-1 border border-border-active/20"
    >
      {children}
    </motion.div>
  );
}

interface OptionPillProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function OptionPill({ active, onClick, children }: OptionPillProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'mode-tab',
        active && 'mode-tab-active',
      )}
    >
      {children}
    </button>
  );
}
