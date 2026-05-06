import type { Metadata } from 'next';
import { LobbyRoom } from '@/components/arena/LobbyRoom';

export const metadata: Metadata = { title: 'Arena — Race Friends' };

export default function ArenaPage() {
  return (
    <section className="flex flex-col items-center justify-start min-h-[calc(100dvh-11rem)] px-4 py-10">
      <div className="text-center mb-8 animate-slide-up">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Typing <span className="text-gradient">Arena</span>
        </h1>
        <p className="text-sm text-text-secondary max-w-sm mx-auto">
          Create a lobby, share the link, and race your friends in real-time.
        </p>
      </div>

      <div className="w-full max-w-md">
        <LobbyRoom />
      </div>
    </section>
  );
}
