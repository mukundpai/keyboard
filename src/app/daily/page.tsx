import type { Metadata } from 'next';
import DailyChallengeClient from './DailyChallengeClient';

export const metadata: Metadata = {
  title: 'Daily Challenge — KeyMaster Pro',
  description: 'One quote, one attempt. Beat the leaderboard every day.',
};

export default function DailyChallengePage() {
  return <DailyChallengeClient />;
}
