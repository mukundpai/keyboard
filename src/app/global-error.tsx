'use client';

// global-error.tsx wraps the root layout — it must ship its own <html>/<body>
// and cannot rely on any layout providers (themes, fonts, etc.)

import { useEffect, useState } from 'react';
import { RotateCcw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const id = setInterval(
      () => setDots((d) => (d.length >= 3 ? '' : d + '.')),
      400,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          background: '#1a1a1a',
          color: '#f2f2f2',
          fontFamily: "'Space Mono', Consolas, monospace",
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
          padding: '1.5rem',
          textAlign: 'center',
        }}
      >
        {/* ASCII keyboard art */}
        <pre
          style={{
            fontSize: '0.6rem',
            lineHeight: 1.4,
            color: '#d4a574',
            letterSpacing: '0.05em',
            margin: 0,
          }}
        >
          {`┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐
│ Q │ W │[E]│[R]│ T │ Y │ U │ I │[O]│ P │
├───┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴──┤
│  A  │ S │ D │ F │ G │ H │ J │ K │ L  │
├─────┴──┬┴──┬┴──┬┴──┬┴──┬┴──┬┴──┬┴────┤
│   Z    │ X │ C │ V │ B │ N │[M]│     │
└────────┴───┴───┴───┴───┴───┴───┴─────┘`}
        </pre>

        <div>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.3em', color: '#ef4444', margin: '0 0 0.5rem' }}>
            GLOBAL FAULT · ROOT LAYOUT CRASH
          </p>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '0.2em', margin: '0 0 0.75rem', color: '#f2f2f2' }}>
            SYSTEM MELTDOWN
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#999', maxWidth: '320px', margin: '0 auto', lineHeight: 1.6 }}>
            A critical keystroke error has taken down the entire engine.
            The system is trying to recover{dots}
          </p>
        </div>

        {error.message && (
          <div
            style={{
              width: '100%',
              maxWidth: '420px',
              background: '#111',
              border: '1px solid #333',
              borderRadius: '0.75rem',
              padding: '0.75rem 1rem',
              textAlign: 'left',
            }}
          >
            <p style={{ fontSize: '0.65rem', color: '#666', marginBottom: '0.25rem' }}>
              {'>'} error.message
            </p>
            <p style={{ fontSize: '0.75rem', color: '#ef4444', wordBreak: 'break-all', margin: 0 }}>
              {error.message}
            </p>
            {error.digest && (
              <p style={{ fontSize: '0.6rem', color: '#555', marginTop: '0.5rem', margin: '0.5rem 0 0' }}>
                digest: {error.digest}
              </p>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={reset}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 1.25rem',
              borderRadius: '0.75rem',
              background: '#d4a574',
              color: '#1a1a1a',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            ↺ Retry
          </button>
          <a
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 1.25rem',
              borderRadius: '0.75rem',
              background: '#2d2d2d',
              color: '#f2f2f2',
              border: '1px solid #444',
              fontSize: '0.875rem',
              fontWeight: 500,
              textDecoration: 'none',
              fontFamily: 'inherit',
            }}
          >
            ⌂ Back home
          </a>
        </div>
      </body>
    </html>
  );
}
