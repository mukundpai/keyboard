'use client';

import { useEffect } from 'react';

/**
 * Insert Google AdSense script
 */
export function useAdSense() {
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
    if (!clientId) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);
}

interface AdSlotProps {
  slotId: string;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
}

export function AdSlot({ slotId, format = 'auto', responsive = true }: AdSlotProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const enableAds = process.env.NEXT_PUBLIC_ENABLE_ADS === 'true';

  if (!enableAds || !clientId) {
    return null;
  }

  return (
    <div
      className="my-6"
      data-ad-client={clientId}
      data-ad-slot={slotId}
      data-ad-format={format}
      data-full-width-responsive={responsive}
      style={{ textAlign: 'center', minHeight: '100px' }}
    >
      {/* AdSense ad will be inserted here */}
    </div>
  );
}
