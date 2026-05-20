'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useSettingsStore } from '@/store/settingsStore';
import type { LastKeyPress, KeyPressState } from '@/hooks/useTypingEngine';

/* ─── Layout maps ────────────────────────────────────────────────
   Each layout stores the visible key labels (not physical positions).
   The `activeKey` from the engine is the character the OS sends,
   so for non-QWERTY OS layouts the highlight still works correctly.
─────────────────────────────────────────────────────────────────── */
const LAYOUTS: Record<string, string[][]> = {
  qwerty: [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
  ],
  dvorak: [
    ["'", ',', '.', 'p', 'y', 'f', 'g', 'c', 'r', 'l'],
    ['a', 'o', 'e', 'u', 'i', 'd', 'h', 't', 'n', 's'],
    [';', 'q', 'j', 'k', 'x', 'b', 'm', 'w', 'v', 'z'],
  ],
  colemak: [
    ['q', 'w', 'f', 'p', 'g', 'j', 'l', 'u', 'y', ';'],
    ['a', 'r', 's', 't', 'd', 'h', 'n', 'e', 'i', 'o'],
    ['z', 'x', 'c', 'v', 'b', 'k', 'm'],
  ],
};

interface KeyboardPreviewProps {
  lastKeyPress: LastKeyPress | null;
  engineState: 'idle' | 'active' | 'finished';
  /** When true, tint each key by the finger responsible for it */
  showFingerGuide?: boolean;
}

interface KeyProps {
  label: string;
  isActive: boolean;
  activeState: KeyPressState | null;
  width?: number;
  /** Finger color tint (rgba string) when finger guide is on */
  fingerColor?: string;
}

function Key({ label, isActive, activeState, width, fingerColor }: KeyProps) {
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
          : fingerColor
            ? fingerColor
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

/* ─── Finger color guide ─────────────────────────────────────
   Colors: pinky=red, ring=orange, middle=yellow, index=green, thumb=blue
─────────────────────────────────────────────────────────────────── */
const FINGER_COLORS: Record<string, string> = {
  // Left pinky
  q: 'rgba(239,68,68,0.18)', a: 'rgba(239,68,68,0.18)', z: 'rgba(239,68,68,0.18)',
  // Left ring
  w: 'rgba(249,115,22,0.18)', s: 'rgba(249,115,22,0.18)', x: 'rgba(249,115,22,0.18)',
  // Left middle
  e: 'rgba(234,179,8,0.18)', d: 'rgba(234,179,8,0.18)', c: 'rgba(234,179,8,0.18)',
  // Left index
  r: 'rgba(34,197,94,0.18)', f: 'rgba(34,197,94,0.18)', v: 'rgba(34,197,94,0.18)',
  t: 'rgba(34,197,94,0.18)', g: 'rgba(34,197,94,0.18)', b: 'rgba(34,197,94,0.18)',
  // Right index
  y: 'rgba(34,197,94,0.18)', h: 'rgba(34,197,94,0.18)', n: 'rgba(34,197,94,0.18)',
  u: 'rgba(34,197,94,0.18)', j: 'rgba(34,197,94,0.18)', m: 'rgba(34,197,94,0.18)',
  // Right middle
  i: 'rgba(234,179,8,0.18)', k: 'rgba(234,179,8,0.18)',
  // Right ring
  o: 'rgba(249,115,22,0.18)', l: 'rgba(249,115,22,0.18)',
  // Right pinky
  p: 'rgba(239,68,68,0.18)',
};

export function KeyboardPreview({ lastKeyPress, engineState, showFingerGuide = false }: KeyboardPreviewProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [activeState, setActiveState] = useState<KeyPressState | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSeqRef = useRef(-1);
  const keyboardLayout = useSettingsStore((s) => s.settings.keyboardLayout);
  const rows = LAYOUTS[keyboardLayout] ?? LAYOUTS.qwerty;

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
        {rows[0].map((k) => (
          <Key key={k} label={k} isActive={activeKey === k} activeState={activeKey === k ? activeState : null} fingerColor={showFingerGuide ? FINGER_COLORS[k] : undefined} />
        ))}
      </div>

      <div className="flex gap-[3px]" style={{ marginLeft: 11 }}>
        {rows[1].map((k) => (
          <Key key={k} label={k} isActive={activeKey === k} activeState={activeKey === k ? activeState : null} fingerColor={showFingerGuide ? FINGER_COLORS[k] : undefined} />
        ))}
      </div>

      <div className="flex gap-[3px]" style={{ marginLeft: 22 }}>
        {rows[2].map((k) => (
          <Key key={k} label={k} isActive={activeKey === k} activeState={activeKey === k ? activeState : null} fingerColor={showFingerGuide ? FINGER_COLORS[k] : undefined} />
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
