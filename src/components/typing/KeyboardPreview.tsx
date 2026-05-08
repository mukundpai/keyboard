'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { LastKeyPress, KeyPressState } from '@/hooks/useTypingEngine';

const ROWS: string[][] = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

interface KeyboardPreviewProps {
  lastKeyPress: LastKeyPress | null;
  engineState: 'idle' | 'active' | 'finished';
}

interface KeyProps {
  label: string;
  isActive: boolean;
  activeState: KeyPressState | null;
  width?: number;
}

function Key({ label, isActive, activeState, width }: KeyProps) {
  const glow =
    activeState === 'correct'
      ? '0 0 10px 2px rgba(212,165,116,0.7), 0 2px 6px rgba(0,0,0,0.35)'
      : activeState === 'wrong'
        ? '0 0 10px 2px rgba(239,68,68,0.65), 0 2px 6px rgba(0,0,0,0.35)'
        : '0 0 6px 1px rgba(148,163,184,0.4), 0 2px 4px rgba(0,0,0,0.3)';

  const activeBg =
    activeState === 'correct'
      ? 'linear-gradient(to bottom, rgba(212,165,116,0.2), rgba(0,0,0,0.06))'
      : activeState === 'wrong'
        ? 'linear-gradient(to bottom, rgba(239,68,68,0.18), rgba(0,0,0,0.06))'
        : 'linear-gradient(to bottom, rgba(255,255,255,0.09), rgba(0,0,0,0.06))';

  const activeBorder =
    activeState === 'correct'
      ? 'rgba(212,165,116,0.5)'
      : activeState === 'wrong'
        ? 'rgba(239,68,68,0.45)'
        : 'rgba(148,163,184,0.35)';

  return (
    <motion.div
      className={cn(
        'relative flex items-center justify-center rounded-[4px] select-none overflow-hidden',
        'text-[9px] font-mono font-semibold uppercase tracking-wide',
        'transition-colors duration-150',
        isActive ? 'text-text-primary' : 'text-text-disabled',
      )}
      style={{
        width: width ?? 22,
        height: 20,
        background: isActive
          ? activeBg
          : 'linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(0,0,0,0.1))',
        border: `1px solid ${isActive ? activeBorder : 'rgba(255,255,255,0.07)'}`,
        boxShadow: isActive ? glow : '0 1px 2px rgba(0,0,0,0.3)',
      }}
      animate={isActive ? { scale: [1, 0.84, 1.02, 1] } : { scale: 1 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      <div className="absolute inset-x-0 top-0 h-[1px] bg-white/10 rounded-t-[4px]" />
      <span className="relative z-10 leading-none">{label}</span>
    </motion.div>
  );
}

export function KeyboardPreview({ lastKeyPress, engineState }: KeyboardPreviewProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [activeState, setActiveState] = useState<KeyPressState | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSeqRef = useRef(-1);

  useEffect(() => {
    if (!lastKeyPress || lastKeyPress.seq === lastSeqRef.current) return;
    lastSeqRef.current = lastKeyPress.seq;

    if (timerRef.current) clearTimeout(timerRef.current);
    setActiveKey(lastKeyPress.key);
    setActiveState(lastKeyPress.state);

    timerRef.current = setTimeout(() => {
      setActiveKey(null);
      setActiveState(null);
    }, 280);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [lastKeyPress]);

  return (
    <div
      className="flex flex-col items-center gap-[5px] py-2"
      aria-hidden="true"
      style={{ opacity: engineState === 'active' ? 1 : 0.4, transition: 'opacity 0.3s' }}
    >
      <div className="flex gap-[3px]">
        {ROWS[0].map((k) => (
          <Key key={k} label={k} isActive={activeKey === k} activeState={activeKey === k ? activeState : null} />
        ))}
      </div>

      <div className="flex gap-[3px]" style={{ marginLeft: 11 }}>
        {ROWS[1].map((k) => (
          <Key key={k} label={k} isActive={activeKey === k} activeState={activeKey === k ? activeState : null} />
        ))}
      </div>

      <div className="flex gap-[3px]" style={{ marginLeft: 22 }}>
        {ROWS[2].map((k) => (
          <Key key={k} label={k} isActive={activeKey === k} activeState={activeKey === k ? activeState : null} />
        ))}
      </div>

      <div className="flex gap-[3px] items-center" style={{ marginLeft: 22 }}>
        <Key
          label="&#x232B;"
          isActive={activeKey === 'backspace'}
          activeState={activeKey === 'backspace' ? activeState : null}
          width={46}
        />
        <motion.div
          className="relative rounded-[4px] overflow-hidden"
          style={{
            width: 130,
            height: 20,
            background:
              activeKey === 'space'
                ? 'linear-gradient(to bottom, rgba(255,255,255,0.09), rgba(0,0,0,0.06))'
                : 'linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(0,0,0,0.1))',
            border: `1px solid ${activeKey === 'space' ? 'rgba(148,163,184,0.35)' : 'rgba(255,255,255,0.07)'}`,
            boxShadow:
              activeKey === 'space'
                ? '0 0 6px 1px rgba(148,163,184,0.4), 0 2px 4px rgba(0,0,0,0.3)'
                : '0 1px 2px rgba(0,0,0,0.3)',
          }}
          animate={activeKey === 'space' ? { scaleX: [1, 0.96, 1] } : { scaleX: 1 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          <div className="absolute inset-x-0 top-0 h-[1px] bg-white/10 rounded-t-[4px]" />
        </motion.div>
      </div>
    </div>
  );
}
