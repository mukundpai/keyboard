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
        // ── STEALTH OBSIDIAN PALETTE ──
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
          DEFAULT: 'hsl(var(--correct) / <alpha-value>)',
          dim: 'hsl(var(--correct) / 0.4)',
        },
        wrong: {
          DEFAULT: 'hsl(var(--wrong) / <alpha-value>)',
          dim: 'hsl(var(--wrong) / 0.4)',
        },
        caret: 'hsl(var(--text-primary) / <alpha-value>)', // White/Bright caret
        success: 'hsl(var(--correct) / <alpha-value>)',
        warning: 'hsl(var(--accent) / <alpha-value>)',
        danger: 'hsl(var(--wrong) / <alpha-value>)',
      },

      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-space-mono)', '"Space Mono"', 'Consolas', 'monospace'],
        display: ['var(--font-syncopate)', 'Syncopate', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Merriweather', 'Georgia', 'serif'],
      },

      fontSize: {
        'type-sm': ['1rem', { lineHeight: '1.85rem', letterSpacing: '0.02em' }],
        'type-md': ['1.125rem', { lineHeight: '2rem', letterSpacing: '0.02em' }],
        'type-lg': ['1.3rem', { lineHeight: '2.3rem', letterSpacing: '0.025em' }],
      },

      animation: {
        'caret-blink': 'caretBlink 1s ease-in-out infinite',
        'float-up': 'floatUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
        'shake': 'shake 0.3s cubic-bezier(0.36,0.07,0.19,0.97) both',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards',
      },

      keyframes: {
        caretBlink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        floatUp: {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-40px) scale(0.9)' },
        },
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(255,255,255,0.05)' },
          '50%': { boxShadow: '0 0 25px rgba(255,255,255,0.1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },

      boxShadow: {
        'glow-sm': '0 0 12px rgba(255,255,255,0.05)',
        'glow-md': '0 0 24px rgba(255,255,255,0.08)',
        'glow-lg': '0 0 48px rgba(255,255,255,0.1)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        'surface': '0 8px 32px rgba(0,0,0,0.4)',
        'surface-lg': '0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.1), 0 0 0 1px rgba(255,255,255,0.03)',
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
