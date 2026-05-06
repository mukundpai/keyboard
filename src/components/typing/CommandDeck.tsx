'use client';

import { Gauge, Sparkles, Radar, Type, AudioLines } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTypingStore } from '@/store/typingStore';
import { cn } from '@/lib/utils';
import type { FontSize } from '@/types/typing';

const FONT_SIZES: FontSize[] = ['sm', 'md', 'lg'];

export function CommandDeck() {
  const { config, setConfig } = useTypingStore();

  const targetLabel =
    config.mode === 'time'
      ? `${config.timeLimit}s`
      : config.mode === 'words'
        ? `${config.wordCount}w`
        : config.mode === 'code'
          ? `${config.codeLanguage}`
          : 'zen';

  return (
    <div className="glass-card px-4 py-3 shadow-surface">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Quick info pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-accent/20 bg-accent-muted/60 px-2.5 py-1 text-xs text-accent-light font-medium">
            <Gauge size={12} />
            <span>{targetLabel}</span>
          </div>
          <div className={cn(
            'flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-medium',
            config.showLiveWpm ? 'border-correct/40 bg-correct/10 text-correct' : 'border-border-active/20 bg-surface-raised/50 text-text-muted'
          )}>
            <Radar size={12} />
            <span>{config.showLiveWpm ? 'Live' : 'Off'}</span>
          </div>
          <div className={cn(
            'flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-medium',
            config.smoothCaret ? 'border-accent/40 bg-accent-muted text-accent-light' : 'border-border-active/20 bg-surface-raised/50 text-text-muted'
          )}>
            <Sparkles size={12} />
            <span>{config.smoothCaret ? 'Smooth' : 'Snap'}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={config.soundEnabled ? 'primary' : 'outline'}
            size="sm"
            icon={<AudioLines size={13} />}
            onClick={() => setConfig({ soundEnabled: !config.soundEnabled })}
            className="text-xs px-2 py-1 h-auto"
          >
            Audio
          </Button>
          
          {/* Font size quick toggle */}
          <div className="flex items-center gap-0.5 border border-border-active/20 rounded-lg bg-surface-raised/50 p-0.5">
            {FONT_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setConfig({ fontSize: size })}
                className={cn(
                  'px-2 py-1 text-xs rounded font-medium transition-all',
                  config.fontSize === size 
                    ? 'bg-accent text-white' 
                    : 'text-text-muted hover:text-text-primary',
                )}
              >
                {size.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Removed unused InfoTile component - replaced with compact pill-based layout