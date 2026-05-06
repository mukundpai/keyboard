import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── LIGHT MODE: Retro Vintage Coffee Palette (1950s classical) ──
        background: 'hsl(var(--bg) / <alpha-value>)',
        surface: {
          DEFAULT: 'hsl(var(--surface) / <alpha-value>)',
          raised: 'hsl(var(--surface-raised) / <alpha-value>)',
          elevated: 'hsl(var(--surface-elevated) / <alpha-value>)',
        },
        border: {
          DEFAULT: 'hsl(var(--border) / <alpha-value>)',
          subtle: 'hsl(var(--border-subtle) / <alpha-value>)',
          active: 'hsl(var(--border-active) / <alpha-value>)',
        },
        text: {
          primary: 'hsl(var(--text-primary) / <alpha-value>)',
          secondary: 'hsl(var(--text-secondary) / <alpha-value>)',
          muted: 'hsl(var(--text-muted) / <alpha-value>)',
          disabled: 'hsl(var(--text-disabled) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          light: 'hsl(var(--accent-light) / <alpha-value>)',
          dark: 'hsl(var(--accent-dark) / <alpha-value>)',
          muted: 'hsl(var(--accent-muted) / <alpha-value>)',
        },
        correct: {
          DEFAULT: '#86EFAC',
          dim: '#4ADE8066',
        },
        wrong: {
          DEFAULT: '#FCA5A5',
          dim: '#F8717166',
        },
        caret: 'hsl(var(--accent) / <alpha-value>)',
        success: '#4ADE80',
        warning: '#8B6F47',           // Sepia warning
        danger: '#F87171',
      },

      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-space-mono)', '"Space Mono"', 'Consolas', 'monospace'],
        display: ['var(--font-syncopate)', 'Syncopate', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Merriweather', 'Georgia', 'serif'],
      },

      fontSize: {
        'type-sm': ['1rem', { lineHeight: '1.85rem', letterSpacing: '0.01em' }],
        'type-md': ['1.125rem', { lineHeight: '2rem', letterSpacing: '0.01em' }],
        'type-lg': ['1.3rem', { lineHeight: '2.3rem', letterSpacing: '0.015em' }],
      },

      animation: {
        'caret-blink': 'caretBlink 1.1s ease-in-out infinite',
        'float-up': 'floatUp 0.9s ease-out forwards',
        'shake': 'shake 0.25s ease-in-out',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.34,1.56,0.64,1) forwards',
      },

      keyframes: {
        caretBlink: {
          '0%, 45%': { opacity: '1' },
          '55%, 100%': { opacity: '0' },
        },
        floatUp: {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-48px) scale(0.85)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-4px)' },
          '40%': { transform: 'translateX(4px)' },
          '60%': { transform: 'translateX(-2px)' },
          '80%': { transform: 'translateX(2px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(139,111,71,0.3)' },
          '50%': { boxShadow: '0 0 28px rgba(139,111,71,0.5)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.88)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },

      boxShadow: {
        'glow-sm': '0 0 10px rgba(139,111,71,0.25)',
        'glow-md': '0 0 22px rgba(139,111,71,0.3)',
        'glow-lg': '0 0 48px rgba(139,111,71,0.35)',
        'inner-glow': 'inset 0 0 24px rgba(139,111,71,0.08)',
        'surface': '0 4px 12px rgba(62,39,35,0.12)',
        'surface-lg': '0 10px 24px rgba(62,39,35,0.15)',
        'coffee': '0 0 0 1px rgba(139,111,71,0.2), 0 4px 12px rgba(62,39,35,0.1)',
      },

      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
