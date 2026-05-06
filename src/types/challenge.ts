/* ─── Challenge Invite Types ────────────────────────────── */
export type ChallengeStatus = 'pending' | 'accepted' | 'declined' | 'active' | 'completed';

export interface ChallengeInvite {
  id: string;                    // Unique challenge ID
  code: string;                  // Short shareable code
  inviterId: string;             // Who created the challenge
  inviterName: string;
  inviteeId?: string;            // Who was invited (if direct)
  status: ChallengeStatus;
  config: {
    mode: 'time' | 'words';
    duration: number;            // timeLimit or wordCount
  };
  inviterResults?: {             // Populated after inviter finishes
    wpm: number;
    accuracy: number;
    timestamp: number;
  };
  inviteeResults?: {             // Populated after invitee finishes
    wpm: number;
    accuracy: number;
    timestamp: number;
  };
  createdAt: number;
  expiresAt: number;             // 48 hours from creation
  completedAt?: number;
}

export interface ChallengeLink {
  code: string;                  // Code to share
  url: string;                   // Full URL to join
  expiresAt: number;
}
