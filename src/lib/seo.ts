/**
 * SEO Metadata helper
 */

import type { Metadata } from 'next';

export function createMetadata(
  title: string,
  description: string,
  options?: {
    image?: string;
    url?: string;
    type?: 'website' | 'article';
  }
): Metadata {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://keymaster-pro.com';
  const image = options?.image || '/og-image.png';
  const url = options?.url || appUrl;

  return {
    title: `${title} | KeyMaster Pro`,
    description,
    keywords: ['typing test', 'typing speed', 'wpm', 'keyboard', 'competitive typing'],
    authors: [{ name: 'KeyMaster Pro' }],
    openGraph: {
      title: `${title} | KeyMaster Pro`,
      description,
      url,
      siteName: 'KeyMaster Pro',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: options?.type || 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | KeyMaster Pro`,
      description,
      images: [image],
      creator: '@keymaster_pro',
    },
    alternates: { canonical: url },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  };
}
