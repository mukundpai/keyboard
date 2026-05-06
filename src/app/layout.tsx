import type { Metadata, Viewport } from 'next';
import { Inter, Space_Mono, Syncopate, Merriweather } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { StoreHydration } from '@/components/StoreHydration';
import './globals.css';

/* ─── Fonts (loaded via next/font for zero-CLS, self-hosted) ─── */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
  weight: ['400', '700'],
});

const syncopate = Syncopate({
  subsets: ['latin'],
  variable: '--font-syncopate',
  display: 'swap',
  weight: ['400', '700'],
});

const merriweather = Merriweather({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['300', '400', '700'],
});

/* ─── Metadata ──────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: {
    default: 'KeyMaster Pro — Elite Typing Test & Multiplayer Racing',
    template: '%s | KeyMaster Pro',
  },
  description:
    'Premium gamified typing test with real-time multiplayer races, detailed analytics, and challenge friends features. Improve your WPM and typing accuracy.',
  keywords: [
    'typing test',
    'wpm',
    'words per minute',
    'typing speed',
    'keyboard test',
    'multiplayer typing',
    'typing race',
    'type racing',
    'typing game',
    'competitive typing',
    'typing challenge',
  ],
  authors: [{ name: 'KeyMaster Pro' }],
  creator: 'KeyMaster Pro',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://keymaster.pro',
    siteName: 'KeyMaster Pro',
    title: 'KeyMaster Pro — Elite Typing Test & Multiplayer Racing',
    description: 'Race friends in real-time typing competitions. Challenge others, improve your WPM, and dominate the leaderboards.',
    images: [
      {
        url: 'https://keymaster.pro/og-image.png',
        width: 1200,
        height: 630,
        alt: 'KeyMaster Pro - Elite Typing Test',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KeyMaster Pro — Elite Typing Test',
    description: 'Race friends and crush your typing speed records.',
    creator: '@keystmasterpro',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://keymaster.pro',
  },
  category: 'Games',
};

export const viewport: Viewport = {
  themeColor: '#F5E6D3',
  colorScheme: 'light',
};

/* ─── Root Layout ───────────────────────────────────────────── */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`dark ${inter.variable} ${spaceMono.variable} ${syncopate.variable} ${merriweather.variable}`}
    >
      <body className="font-sans bg-background text-text-primary min-h-dvh flex flex-col antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true} storageKey="keymaster-theme">
          <StoreHydration />

          {/* ── Ambient background ── */}
          <div
            className="fixed inset-0 pointer-events-none overflow-hidden -z-10"
            aria-hidden="true"
          >
            {/* Warm sepia bloom — top left */}
            <div className="absolute -top-48 -left-48 w-[600px] h-[600px] rounded-full bg-[#8B6F47]/15 blur-[140px]" />
            {/* Aged gold glow — bottom right */}
            <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#C4A57B]/12 blur-[120px]" />
            {/* Cream center vignette */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[#DCC5B3]/8 blur-[160px]" />
          </div>

          {/* ── App chrome ── */}
          <Header />

          <main className="flex-1 relative">
            {children}
          </main>

          <Footer />

          {/* ─────────────────────────────────────────────────────────── *
           *  AD SLOT — bottom banner                                      *
           *  Reserved height (90px) prevents CLS when AdSense loads.      *
           * ─────────────────────────────────────────────────────────── */}
          <aside
            className="w-full flex justify-center items-center py-2 px-4
                       bg-surface/30 border-t border-border-active/20"
            aria-label="Advertisement"
          >
            <div className="ad-slot ad-slot-banner max-w-[728px] w-full">
              {/* Google AdSense slot — inject script here in production */}
              <span className="text-[10px] text-text-muted/40 uppercase tracking-widest select-none">
                ad
              </span>
            </div>
          </aside>

        </ThemeProvider>
      </body>
    </html>
  );
}
