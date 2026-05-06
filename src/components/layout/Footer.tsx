import Link from 'next/link';
import { Github, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border-active/20 bg-background/60">
      <div className="mx-auto max-w-5xl px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-text-muted">
          &copy; {new Date().getFullYear()} KeyMaster Pro
        </p>

        <nav className="flex items-center gap-4" aria-label="Footer navigation">
          {[
            { href: '/privacy', label: 'Privacy' },
            { href: '/terms', label: 'Terms' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              {label}
            </Link>
          ))}

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-text-secondary transition-colors"
            aria-label="GitHub"
          >
            <Github size={14} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-text-secondary transition-colors"
            aria-label="Twitter"
          >
            <Twitter size={14} />
          </a>
        </nav>
      </div>
    </footer>
  );
}
