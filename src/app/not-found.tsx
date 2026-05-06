import Link from 'next/link';
import { Keyboard } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60dvh] gap-5 px-4 text-center">
      <Keyboard size={40} className="text-text-muted" />
      <div>
        <h1 className="text-5xl font-bold text-gradient tabular">404</h1>
        <p className="mt-2 text-text-secondary">Page not found.</p>
      </div>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-xl bg-accent-muted border border-accent/25
                   text-sm font-medium text-accent-light
                   hover:bg-accent/20 transition-colors"
      >
        Back to typing
      </Link>
    </div>
  );
}
