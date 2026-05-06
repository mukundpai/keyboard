'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Share2, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useChallengeStore } from '@/store/challengeStore';
import { useTypingStore } from '@/store/typingStore';
import type { ChallengeInvite } from '@/types/challenge';

interface ChallengeInviteProps {
  isOpen: boolean;
  onClose: () => void;
  onStartChallenge?: (challenge: ChallengeInvite) => void;
}

export function ChallengeInvite({ isOpen, onClose, onStartChallenge }: ChallengeInviteProps) {
  const [copied, setCopied] = useState(false);
  const { createChallenge } = useChallengeStore();
  const { config } = useTypingStore();
  
  const [activeChallenge, setActiveChallenge] = useState<ReturnType<typeof createChallenge> | null>(null);

  const handleCreateChallenge = () => {
    // Create challenge with current config
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
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(`${text}\n\n${activeChallenge.url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative glass-card w-full max-w-md mx-4 p-8 space-y-6"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              <X size={20} />
            </button>

            {!activeChallenge ? (
              <>
                {/* Title */}
                <div className="space-y-2">
                  <h2 className="text-3xl font-serif font-bold text-text-primary">
                    Challenge a Friend
                  </h2>
                  <p className="text-text-secondary">
                    Invite them to beat your score in a thrilling typing race.
                  </p>
                </div>

                {/* Challenge info */}
                <div className="space-y-3 bg-surface-raised/50 rounded-lg p-4 border border-border-active/20">
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary text-sm font-medium">Mode</span>
                    <span className="text-text-primary font-mono uppercase">
                      {config.mode === 'time' ? `${config.timeLimit}s` : `${config.wordCount}w`}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted">
                    They'll race against the same settings you're using right now.
                  </p>
                </div>

                {/* Create button */}
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleCreateChallenge}
                  className="w-full"
                  icon={<Share2 size={16} />}
                >
                  Create Challenge Link
                </Button>
              </>
            ) : (
              <>
                {/* Success state */}
                <div className="space-y-2 text-center">
                  <div className="text-accent text-4xl mb-3">🎯</div>
                  <h3 className="text-2xl font-serif font-bold text-text-primary">
                    Challenge Created!
                  </h3>
                  <p className="text-text-secondary text-sm">
                    Share this link with your friends to challenge them
                  </p>
                </div>

                {/* Challenge code display */}
                <div className="bg-surface-raised/50 rounded-lg p-4 border border-border-active/20 space-y-3">
                  <p className="text-xs text-text-muted uppercase font-medium tracking-wide">
                    Challenge Code
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 font-mono text-lg font-bold text-accent break-all">
                      {activeChallenge.code}
                    </code>
                    <button
                      onClick={handleCopyLink}
                      className={`p-2 rounded-lg transition-colors ${
                        copied
                          ? 'bg-correct text-white'
                          : 'bg-surface hover:bg-surface-raised text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                {/* Invite message */}
                <div className="bg-surface-raised/50 rounded-lg p-4 border border-border-active/20">
                  <p className="text-xs text-text-muted mb-2">Share message template:</p>
                  <p className="text-sm text-text-secondary italic">
                    "I just challenged you to a typing race on KeyMaster Pro! Can you beat my score? 🏎️"
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

                {/* Close button */}
                <Button
                  variant="outline"
                  size="lg"
                  onClick={onClose}
                  className="w-full"
                >
                  Done
                </Button>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
