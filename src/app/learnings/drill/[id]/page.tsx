import { notFound } from 'next/navigation';
import { DRILLS, DIFFICULTY_LABEL, DIFFICULTY_COLOR } from '@/data/drills';
import { DrillEngine } from '@/components/typing/DrillEngine';
import Link from 'next/link';
import { ArrowLeft, Lightbulb } from 'lucide-react';

// Re-export the difficulty maps so the client gets them via the data module
// (they live in the server component only; DrillEngine already receives the full DrillDef)

export default async function DrillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const drill = DRILLS[id];

  if (!drill) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 animate-fade-in flex flex-col min-h-[calc(100dvh-11rem)]">
      <div className="mb-8">
        <Link
          href="/learnings"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors mb-6"
        >
          <ArrowLeft size={14} /> Back to Learnings
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary font-display">
            {drill.title}
          </h1>
          <span
            className={`hidden sm:inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide ${DIFFICULTY_COLOR[drill.difficulty]}`}
          >
            {DIFFICULTY_LABEL[drill.difficulty]}
          </span>
        </div>

        <p className="text-sm text-text-secondary mb-4">{drill.description}</p>

        {drill.tip && (
          <div className="flex items-start gap-2.5 rounded-xl border border-border-subtle bg-surface-raised/60 px-4 py-3 max-w-2xl">
            <Lightbulb size={13} className="mt-0.5 shrink-0 text-accent-light" />
            <p className="text-xs text-text-muted leading-relaxed">
              <span className="text-text-secondary font-medium">Technique tip: </span>
              {drill.tip}
            </p>
          </div>
        )}
      </div>

      <div className="flex-grow flex flex-col">
        <DrillEngine drill={drill} />
      </div>
    </div>
  );
}
