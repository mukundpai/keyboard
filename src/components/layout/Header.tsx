'use client';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Keyboard, Trophy, User, Zap, Moon, Sun } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { useSettingsStore } from '@/store/settingsStore';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/',            label: 'Type',        Icon: Keyboard },
  { href: '/arena',       label: 'Arena',       Icon: Zap },
  { href: '/leaderboard', label: 'Leaderboard', Icon: Trophy },
  { href: '/profile',     label: 'Profile',     Icon: User },
];

export default function Header() {
  const profile = useUserStore((s) => s.profile);
  const { theme, setTheme } = useTheme();
  const { updateSettings } = useSettingsStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border-active/20 bg-background/85 backdrop-blur-md">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: -12, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/30
                       flex items-center justify-center shadow-glow-sm"
          >
            <Keyboard size={16} className="text-accent-light" />
          </motion.div>
          <span className="text-sm font-bold text-text-primary tracking-widest uppercase font-display">
            Key<span className="text-gradient">Master</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-1" aria-label="Primary navigation">
          {NAV.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm',
                'text-text-muted hover:text-text-primary hover:bg-surface-raised',
                'transition-colors duration-150',
              )}
            >
              <Icon size={14} />
              {label}
            </Link>
          ))}
        </nav>

        {/* User pill / sign-in */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => {
                const next = theme === 'dark' ? 'light' : 'dark';
                setTheme(next);
                updateSettings({ theme: next });
              }}
              className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary
                         hover:bg-surface-raised transition-colors"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          )}

          {profile ? (
            <Link
              href="/profile"
              className="level-badge hover:bg-accent/20 transition-colors"
            >
              <span className="text-text-muted">Lv</span>
              <span>{profile.level}</span>
              <span className="text-text-secondary">{profile.username}</span>
            </Link>
          ) : (
            <Link
              href="/profile"
              className="px-3 py-1.5 rounded-lg border border-border-active/40
                         text-sm text-text-secondary hover:text-text-primary
                         hover:border-accent/40 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}
