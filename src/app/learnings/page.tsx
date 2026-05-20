import type { Metadata } from 'next';
import {
  Target, BookOpen, Zap, Activity, Shield, Hand, MousePointer,
  Code2, Timer, AlignLeft, ArrowRight, Lightbulb, ChevronRight,
} from 'lucide-react';
import { TiltCard } from '@/components/ui/TiltCard';
import Link from 'next/link';
import {
  DRILLS, DRILL_GROUPS, DIFFICULTY_LABEL, DIFFICULTY_COLOR,
  type DrillDef, type DrillGroup, type DrillDifficulty,
} from '@/data/drills';
import WeakSpots from '@/components/learnings/WeakSpots';

export const metadata: Metadata = {
  title: 'Learnings & Drills | KeyMaster Pro',
  description: 'Train your typing skills with targeted drills and tasks on KeyMaster Pro by MegaMinds.',
};

// ── Group config ────────────────────────────────────────────────────────────────
const GROUP_ORDER: DrillGroup[] = [
  'foundation',
  'finger-isolation',
  'speed-building',
  'coding',
  'endurance',
];

const GROUP_ICON: Record<DrillGroup, React.ReactNode> = {
  foundation:          <Shield size={16} />,
  'finger-isolation':  <Hand size={16} />,
  'speed-building':    <Zap size={16} />,
  coding:              <Code2 size={16} />,
  endurance:           <Activity size={16} />,
};

// ── Page ────────────────────────────────────────────────────────────────────────
export default function LearningsPage() {
  // Bucket drills by group
  const byGroup = GROUP_ORDER.reduce<Record<DrillGroup, DrillDef[]>>(
    (acc, g) => {
      acc[g] = Object.values(DRILLS).filter(d => d.group === g);
      return acc;
    },
    {} as Record<DrillGroup, DrillDef[]>,
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:py-20 animate-fade-in">
      {/* ── Hero ── */}
      <div className="mb-14">
        <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-3">
          Training Grounds
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary mb-4 font-display">
          Build Skills,{' '}
          <span className="text-gradient">One Drill at a Time</span>
        </h1>
        <p className="text-sm text-text-secondary max-w-2xl leading-relaxed">
          Professional typing is built from isolated practice, not random text. Choose a drill that
          targets your exact weak point — fingers, rows, symbols, or stamina — and repeat until the
          movement is automatic.
        </p>

        {/* Quick-start tip */}
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-border-subtle bg-surface-raised/60 px-4 py-3 max-w-2xl">
          <Lightbulb size={15} className="mt-0.5 shrink-0 text-accent-light" />
          <p className="text-xs text-text-muted leading-relaxed">
            <span className="text-text-secondary font-medium">Where to start?</span> If you are new,
            begin with <strong className="text-text-primary">Home Row Mastery</strong>. Once that
            feels automatic, move to the row drills and then finger isolation. Speed building and
            endurance tasks come last.
          </p>
        </div>
      </div>

      {/* ── Learning path chips ── */}
      <div className="mb-14 overflow-x-auto pb-1">
        <div className="flex items-center gap-0 min-w-max">
          {GROUP_ORDER.map((g, i) => (
            <div key={g} className="flex items-center gap-0">
              <a
                href={`#${g}`}
                className="flex items-center gap-1.5 rounded-full border border-border-subtle bg-surface-raised px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:border-border-active/40 transition-colors"
              >
                <span className="text-accent-light">{GROUP_ICON[g]}</span>
                {DRILL_GROUPS[g].label}
              </a>
              {i < GROUP_ORDER.length - 1 && (
                <ChevronRight size={13} className="mx-1 text-text-muted/40 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Sections ── */}
      <div className="space-y-20">
        {GROUP_ORDER.map(g => {
          const drills = byGroup[g];
          if (!drills.length) return null;
          const meta = DRILL_GROUPS[g];
          const isEndurance = g === 'endurance';

          return (
            <section key={g} id={g} className="scroll-mt-24">
              {/* Section header */}
              <div className="flex items-start justify-between mb-6 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-accent-light">{GROUP_ICON[g]}</span>
                    <h2 className="text-lg font-semibold text-text-primary font-serif">
                      {meta.label}
                    </h2>
                    <span className="text-[10px] font-medium text-text-muted border border-border-subtle rounded-full px-2 py-0.5 bg-surface-raised">
                      {drills.length} {drills.length === 1 ? 'drill' : 'drills'}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted">{meta.description}</p>
                </div>
              </div>

              {/* Cards */}
              <div className={`grid gap-5 perspective-1000 ${isEndurance ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                {drills.map(drill => (
                  <DrillCard key={drill.id} drill={drill} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* ── Weak spots (client component reading statsStore) ── */}
      <WeakSpots />

      {/* ── Technique reference ── */}
      <section className="mt-24 rounded-2xl border border-border-subtle bg-surface-raised/40 p-8">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen size={16} className="text-accent-light" />
          <h2 className="text-base font-semibold text-text-primary font-serif">
            Core Technique Principles
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {TECHNIQUE_TIPS.map(t => (
            <div key={t.title} className="flex gap-3">
              <div className="shrink-0 mt-0.5 h-7 w-7 rounded-lg border border-border-subtle bg-surface-raised flex items-center justify-center text-text-secondary">
                {t.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary mb-0.5">{t.title}</p>
                <p className="text-xs text-text-muted leading-relaxed">{t.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ── Card components ─────────────────────────────────────────────────────────────
function DrillCard({ drill }: { drill: DrillDef }) {
  const isTask = drill.category === 'task';

  return (
    <Link href={`/learnings/drill/${drill.id}`} className="block h-full group">
      <TiltCard className="p-5 h-full flex flex-col transition-colors border-border-active/10 group-hover:border-border-active/30">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide ${DIFFICULTY_COLOR[drill.difficulty]}`}
          >
            {DIFFICULTY_LABEL[drill.difficulty]}
          </span>
          {drill.metric && (
            <span className="inline-flex items-center rounded-full bg-surface-raised px-2.5 py-0.5 text-[10px] font-medium text-text-muted border border-border-subtle shrink-0">
              {drill.metric}
            </span>
          )}
        </div>

        {/* Title & description */}
        <h3 className="text-sm font-semibold text-text-primary mb-1.5 leading-snug">{drill.title}</h3>
        <p className="text-xs text-text-secondary leading-relaxed flex-grow">{drill.description}</p>

        {/* Inline tip preview */}
        {drill.tip && (
          <p className="mt-3 text-[11px] text-text-muted leading-relaxed border-t border-border-active/10 pt-3 line-clamp-2">
            <span className="text-accent-light font-medium">Tip: </span>
            {drill.tip}
          </p>
        )}

        {/* CTA */}
        <div className="mt-4 pt-3 border-t border-border-active/10 text-xs font-medium text-accent flex items-center justify-between group-hover:text-text-primary transition-colors">
          <span>{isTask ? 'Begin Task' : 'Start Drill'}</span>
          <ArrowRight
            size={13}
            className="opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0"
          />
        </div>
      </TiltCard>
    </Link>
  );
}

// ── Static technique reference data ────────────────────────────────────────────
const TECHNIQUE_TIPS = [
  {
    icon: <Hand size={14} />,
    title: 'Home Row Anchoring',
    body: 'Your fingers must always return to ASDF · JKL; between keystrokes. Never let a hand wander. F and J have bumps for a reason.',
  },
  {
    icon: <Target size={14} />,
    title: 'Opposite-Hand Shift',
    body: 'When capitalising a right-hand letter (U, I, O…), use the left shift. When capitalising a left-hand letter (A, S, D…), use the right shift.',
  },
  {
    icon: <AlignLeft size={14} />,
    title: 'Posture & Wrist Angle',
    body: 'Sit upright with elbows at ~90°. Wrists should float, not rest on the desk. A neutral wrist angle prevents repetitive strain.',
  },
  {
    icon: <Timer size={14} />,
    title: 'Accuracy Before Speed',
    body: 'A keylogger counts. Every wrong keystroke is logged twice: once for the error, once for the correction. Train at 95%+ accuracy first.',
  },
  {
    icon: <MousePointer size={14} />,
    title: 'Look Ahead',
    body: 'Your eyes should always be one word ahead of your fingers. Reading ahead lets your subconscious prepare the next finger movements.',
  },
  {
    icon: <Zap size={14} />,
    title: 'Rhythm Over Bursts',
    body: 'Consistent keystroke timing beats sprinting and pausing. A steady 70 WPM with 98% accuracy outperforms an erratic 90 WPM at 85%.',
  },
];
