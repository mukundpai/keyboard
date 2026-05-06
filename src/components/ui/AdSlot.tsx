/**
 * AdSlot — reserved containers for future Google AdSense placements.
 *
 * Each variant pre-reserves the IAB standard dimensions so the layout
 * never shifts (zero CLS) when an ad eventually loads.
 *
 * Usage:
 *   <AdSlot variant="banner" />          // 728×90  leaderboard
 *   <AdSlot variant="rectangle" />       // 300×250 medium rectangle
 *   <AdSlot variant="sidebar" />         // 160×600 wide skyscraper
 */

import { cn } from '@/lib/utils';

type AdVariant = 'banner' | 'rectangle' | 'sidebar';

interface AdSlotProps {
  variant?: AdVariant;
  /** Slot ID passed to AdSense `data-ad-slot` — populate in production */
  slotId?: string;
  className?: string;
}

const dimensions: Record<AdVariant, { w: string; h: string }> = {
  banner:    { w: 'w-full max-w-[728px]', h: 'h-[90px]' },
  rectangle: { w: 'w-[300px]',            h: 'h-[250px]' },
  sidebar:   { w: 'w-[160px]',            h: 'min-h-[600px]' },
};

export function AdSlot({ variant = 'banner', slotId, className }: AdSlotProps) {
  const { w, h } = dimensions[variant];

  return (
    <div
      data-ad-variant={variant}
      data-ad-slot={slotId}
      aria-label="Advertisement"
      className={cn(
        'ad-slot flex-shrink-0',
        w,
        h,
        className,
      )}
      style={{ contain: 'layout style' }} // belt-and-suspenders CLS guard
    >
      {/* AdSense ins tag — uncomment and populate in production:
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '100%' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      */}
      <span className="text-[10px] text-text-muted/30 uppercase tracking-widest select-none">
        ad
      </span>
    </div>
  );
}
