export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface BadgeDef {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji
  rarity: BadgeRarity;
  /** Returns true when the badge should be awarded */
  check: (stats: BadgeCheckInput) => boolean;
}

export interface BadgeCheckInput {
  bestWpm: number;
  avgAccuracy: number;
  totalTests: number;
  streak: number;
  completedDrillIds: string[];
  dailyChallengesCompleted: number;
}

export const BADGE_DEFS: BadgeDef[] = [
  // ── Speed milestones ─────────────────────────────────────────────────────
  {
    id: 'wpm-40',
    name: 'Warm Fingers',
    description: 'Reached 40 WPM.',
    icon: '🔥',
    rarity: 'common',
    check: ({ bestWpm }) => bestWpm >= 40,
  },
  {
    id: 'wpm-60',
    name: 'Smooth Operator',
    description: 'Reached 60 WPM.',
    icon: '⚡',
    rarity: 'common',
    check: ({ bestWpm }) => bestWpm >= 60,
  },
  {
    id: 'wpm-80',
    name: 'Speed Typist',
    description: 'Reached 80 WPM.',
    icon: '🚀',
    rarity: 'rare',
    check: ({ bestWpm }) => bestWpm >= 80,
  },
  {
    id: 'wpm-100',
    name: 'Century Mark',
    description: 'Broke 100 WPM.',
    icon: '💯',
    rarity: 'rare',
    check: ({ bestWpm }) => bestWpm >= 100,
  },
  {
    id: 'wpm-120',
    name: 'Two Hands, One Mind',
    description: 'Reached 120 WPM — you are thinking faster than most people speak.',
    icon: '🧠',
    rarity: 'epic',
    check: ({ bestWpm }) => bestWpm >= 120,
  },
  {
    id: 'wpm-150',
    name: 'Supersonic',
    description: 'Reached 150 WPM. You are in the top 1%.',
    icon: '🌩️',
    rarity: 'epic',
    check: ({ bestWpm }) => bestWpm >= 150,
  },
  {
    id: 'wpm-200',
    name: 'Apex Predator',
    description: '200 WPM. Legendary.',
    icon: '👑',
    rarity: 'legendary',
    check: ({ bestWpm }) => bestWpm >= 200,
  },

  // ── Accuracy milestones ───────────────────────────────────────────────────
  {
    id: 'acc-95',
    name: 'Precision Draft',
    description: 'Maintained 95%+ average accuracy.',
    icon: '🎯',
    rarity: 'common',
    check: ({ avgAccuracy }) => avgAccuracy >= 95,
  },
  {
    id: 'acc-98',
    name: 'Surgical',
    description: 'Maintained 98%+ average accuracy.',
    icon: '🔬',
    rarity: 'rare',
    check: ({ avgAccuracy }) => avgAccuracy >= 98,
  },
  {
    id: 'acc-100',
    name: 'Flawless',
    description: 'Achieved 100% accuracy on a full test.',
    icon: '💎',
    rarity: 'epic',
    check: ({ avgAccuracy }) => avgAccuracy === 100,
  },

  // ── Volume milestones ─────────────────────────────────────────────────────
  {
    id: 'tests-10',
    name: 'First Steps',
    description: 'Completed 10 tests.',
    icon: '👟',
    rarity: 'common',
    check: ({ totalTests }) => totalTests >= 10,
  },
  {
    id: 'tests-50',
    name: 'Dedicated',
    description: 'Completed 50 tests.',
    icon: '📚',
    rarity: 'common',
    check: ({ totalTests }) => totalTests >= 50,
  },
  {
    id: 'tests-100',
    name: 'Centurion',
    description: 'Completed 100 tests.',
    icon: '🏛️',
    rarity: 'rare',
    check: ({ totalTests }) => totalTests >= 100,
  },
  {
    id: 'tests-500',
    name: 'Obsessed',
    description: 'Completed 500 tests. Touch grass occasionally.',
    icon: '🌿',
    rarity: 'epic',
    check: ({ totalTests }) => totalTests >= 500,
  },

  // ── Streak milestones ─────────────────────────────────────────────────────
  {
    id: 'streak-3',
    name: 'Habit Forming',
    description: '3-day practice streak.',
    icon: '📅',
    rarity: 'common',
    check: ({ streak }) => streak >= 3,
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: '7-day practice streak.',
    icon: '🗓️',
    rarity: 'rare',
    check: ({ streak }) => streak >= 7,
  },
  {
    id: 'streak-30',
    name: 'Iron Discipline',
    description: '30-day practice streak.',
    icon: '⚔️',
    rarity: 'epic',
    check: ({ streak }) => streak >= 30,
  },
  {
    id: 'streak-100',
    name: 'Unbreakable',
    description: '100-day practice streak.',
    icon: '🏆',
    rarity: 'legendary',
    check: ({ streak }) => streak >= 100,
  },

  // ── Drills ────────────────────────────────────────────────────────────────
  {
    id: 'drills-foundation',
    name: 'Solid Foundation',
    description: 'Completed all Foundation drills.',
    icon: '🧱',
    rarity: 'common',
    check: ({ completedDrillIds }) =>
      ['home-row', 'top-row', 'bottom-row', 'all-rows'].every(id =>
        completedDrillIds.includes(id),
      ),
  },
  {
    id: 'drills-fingers',
    name: 'Ten Fingers',
    description: 'Completed all Finger Isolation drills.',
    icon: '✋',
    rarity: 'rare',
    check: ({ completedDrillIds }) =>
      ['index-fingers', 'middle-fingers', 'ring-fingers', 'pinky-fingers',
       'left-hand-only', 'right-hand-only'].every(id =>
        completedDrillIds.includes(id),
      ),
  },
  {
    id: 'drills-all',
    name: 'Master Driller',
    description: 'Completed every drill and task.',
    icon: '🎓',
    rarity: 'legendary',
    check: ({ completedDrillIds }) => completedDrillIds.length >= 22,
  },

  // ── Daily challenge ───────────────────────────────────────────────────────
  {
    id: 'daily-1',
    name: 'Day One',
    description: 'Completed your first daily challenge.',
    icon: '☀️',
    rarity: 'common',
    check: ({ dailyChallengesCompleted }) => dailyChallengesCompleted >= 1,
  },
  {
    id: 'daily-7',
    name: 'Daily Devotion',
    description: 'Completed 7 daily challenges.',
    icon: '🌟',
    rarity: 'rare',
    check: ({ dailyChallengesCompleted }) => dailyChallengesCompleted >= 7,
  },
  {
    id: 'daily-30',
    name: 'Ritual',
    description: 'Completed 30 daily challenges.',
    icon: '🔱',
    rarity: 'legendary',
    check: ({ dailyChallengesCompleted }) => dailyChallengesCompleted >= 30,
  },
];

export const RARITY_COLORS: Record<BadgeRarity, string> = {
  common:    'border-slate-500/40  bg-slate-500/10  text-slate-300',
  rare:      'border-blue-500/40   bg-blue-500/10   text-blue-300',
  epic:      'border-purple-500/40 bg-purple-500/10 text-purple-300',
  legendary: 'border-amber-400/50  bg-amber-400/10  text-amber-300',
};
