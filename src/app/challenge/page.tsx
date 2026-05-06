'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Copy, Share2, Check } from 'lucide-react';
import { useTypingStore } from '@/store/typingStore';
import { useChallengeStore } from '@/store/challengeStore';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 26 } },
};

export default function ChallengePage() {
  const { config } = useTypingStore();
  const { createChallenge } = useChallengeStore();
  const [copied, setCopied] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState<ReturnType<typeof createChallenge> | null>(null);

  const handleCreateChallenge = () => {
    const challenge = createChallenge('user-1', 'You', {
      mode: config.mode === 'time' ? 'time' : 'words',
      duration: config.mode === 'time' ? config.timeLimit : config.wordCount,
    });
    setActiveChallenge(challenge);
  };

  const handleCopyLink = async () => {
    if (!activeChallenge) return;
    try {
      await navigator.clipboard.writeText(activeChallenge.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    if (!activeChallenge) return;
    
    const text = `I just challenged you to a typing race on KeyMaster Pro! Can you beat my score? 🏎️`;
    const shareData = {
      title: 'KeyMaster Pro Challenge',
      text,
      url: activeChallenge.url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      await navigator.clipboard.writeText(`${text}\n\n${activeChallenge.url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-[calc(100dvh-11rem)] px-4 py-10">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-2xl space-y-8"
      >
        {/* Header */}
        <motion.div variants={item} className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-muted px-4 py-1.5 text-xs uppercase tracking-[0.28em] text-accent">
            <Zap size={13} />
            Challenge Hub
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary font-serif">
            Challenge Your Friends
          </h1>
          <p className="text-text-secondary max-w-md mx-auto">
            Create a unique challenge link and race your friends. Share it, watch them crush (or get crushed), and build your community one typing race at a time.
          </p>
        </motion.div>

        {/* Main challenge card */}
        <motion.div variants={item} className="glass-card p-8 space-y-6">
          {!activeChallenge ? (
            <>
              {/* Challenge settings preview */}
              <div className="space-y-4 bg-surface-raised/50 rounded-lg p-6 border border-border-active/20">
                <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
                  Your Challenge Settings
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Mode</p>
                    <p className="text-lg font-mono font-bold text-text-primary">
                      {config.mode}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Duration</p>
                    <p className="text-lg font-mono font-bold text-text-primary">
                      {config.mode === 'time' ? `${config.timeLimit}s` : `${config.wordCount} words`}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Font Size</p>
                    <p className="text-lg font-mono font-bold text-text-primary">
                      {config.fontSize.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Live WPM</p>
                    <p className="text-lg font-mono font-bold text-text-primary">
                      {config.showLiveWpm ? 'ON' : 'OFF'}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-text-muted mt-4">
                  Your friends will race using these exact settings.{' '}
                  <Link href="/" className="text-accent hover:text-accent-light font-medium">
                    Customize
                  </Link>{' '}
                  them first if needed.
                </p>
              </div>

              {/* Create challenge button */}
              <Button
                variant="primary"
                size="lg"
                onClick={handleCreateChallenge}
                icon={<Zap size={16} />}
                className="w-full text-base"
              >
                Generate Challenge Link
              </Button>
            </>
          ) : (
            <>
              {/* Success state */}
              <div className="text-center space-y-3">
                <div className="text-5xl mb-3">🎯</div>
                <h2 className="text-2xl font-serif font-bold text-text-primary">
                  Challenge Created!
                </h2>
                <p className="text-text-secondary">
                  Share this code with your friends and let the games begin.
                </p>
              </div>

              {/* Challenge code */}
              <div className="bg-surface-raised/80 rounded-lg p-6 border-2 border-accent/30 space-y-3 text-center">
                <p className="text-xs text-text-muted uppercase font-medium tracking-wide">
                  Challenge Code
                </p>
                <div className="flex items-center justify-center gap-3">
                  <code className="text-3xl font-mono font-bold text-accent tracking-widest">
                    {activeChallenge.code}
                  </code>
                  <button
                    onClick={handleCopyLink}
                    className={`p-3 rounded-lg transition-all ${
                      copied
                        ? 'bg-correct text-white'
                        : 'bg-surface hover:bg-surface-raised text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
                <p className="text-xs text-text-muted">
                  {copied ? 'Copied to clipboard!' : 'Click to copy code'}
                </p>
              </div>

              {/* Full URL display */}
              <div className="space-y-2">
                <p className="text-xs text-text-muted uppercase font-medium tracking-wide">
                  Full Challenge Link
                </p>
                <div className="bg-surface-raised/50 rounded-lg p-4 border border-border-active/20 break-all text-sm font-mono text-text-secondary">
                  {activeChallenge.url}
                </div>
              </div>

              {/* Share template */}
              <div className="bg-surface-raised/50 rounded-lg p-6 border border-border-active/20 space-y-3">
                <p className="text-xs text-text-muted uppercase font-medium tracking-wide">
                  Share Message
                </p>
                <p className="text-sm text-text-secondary italic leading-relaxed">
                  "I just challenged you to a typing race on KeyMaster Pro! {config.mode === 'time' ? `${config.timeLimit} seconds` : `${config.wordCount} words`}, your move. Can you beat my score? 🏎️"
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleCopyLink}
                  icon={<Copy size={16} />}
                  className="flex-1"
                >
                  {copied ? 'Copied!' : 'Copy Link'}
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleShare}
                  icon={<Share2 size={16} />}
                  className="flex-1"
                >
                  Share
                </Button>
              </div>

              {/* Reset button */}
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setActiveChallenge(null);
                  setCopied(false);
                }}
                className="w-full"
              >
                Create Another Challenge
              </Button>
            </>
          )}
        </motion.div>

        {/* How it works section */}
        <motion.div variants={item} className="glass-card p-6 space-y-4">
          <h3 className="font-serif font-semibold text-text-primary">How It Works</h3>
          <div className="space-y-3">
            {[
              { step: '1', title: 'Create', desc: 'Generate a unique challenge link with your chosen settings.' },
              { step: '2', title: 'Share', desc: 'Send the link to friends via text, email, or social media.' },
              { step: '3', title: 'Race', desc: 'They click the link, join the challenge, and typing begins.' },
              { step: '4', title: 'Compare', desc: 'After you both finish, see who had the higher WPM and accuracy.' },
            ].map((item) => (
              <div key={item.step} className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 border border-accent flex items-center justify-center text-accent font-semibold text-sm">
                  {item.step}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{item.title}</p>
                  <p className="text-xs text-text-secondary">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Back to typing */}
        <motion.div variants={item} className="text-center">
          <Link
            href="/"
            className="text-sm text-accent hover:text-accent-light font-medium transition-colors"
          >
            ← Back to Typing
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
