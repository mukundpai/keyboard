/** WPM = (correct chars ÷ 5) ÷ (elapsed seconds ÷ 60) */
export function calculateWPM(correctChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0) return 0;
  return Math.round((correctChars / 5) / (elapsedSeconds / 60));
}

/** Raw WPM ignores errors */
export function calculateRawWPM(totalChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0) return 0;
  return Math.round((totalChars / 5) / (elapsedSeconds / 60));
}

/** Accuracy as a percentage (0–100) */
export function calculateAccuracy(correctChars: number, totalTyped: number): number {
  if (totalTyped === 0) return 100;
  return Math.round((correctChars / totalTyped) * 1000) / 10; // 1 decimal place
}

/**
 * Consistency: 100 = perfectly steady pace, 0 = wildly uneven.
 * Derived from (1 - coefficient of variation) of per-second WPM readings.
 */
export function calculateConsistency(wpmHistory: { wpm: number }[]): number {
  const wpms = wpmHistory.map((h) => h.wpm).filter((w) => w > 0);
  if (wpms.length < 2) return 100;

  const mean = wpms.reduce((a, b) => a + b, 0) / wpms.length;
  if (mean === 0) return 100;

  const variance = wpms.reduce((sum, w) => sum + (w - mean) ** 2, 0) / wpms.length;
  const cv = Math.sqrt(variance) / mean; // coefficient of variation

  // Map CV 0 → 100%, CV 1 → 0%  (clamped)
  return Math.max(0, Math.min(100, Math.round((1 - cv) * 100)));
}

/**
 * XP gained for a test.
 * Longer tests and higher accuracy award more.
 */
export function calculateXP(
  wpm: number,
  accuracy: number,
  durationSeconds: number,
): number {
  const base = Math.floor(wpm * (accuracy / 100));
  const durationMult = durationSeconds >= 120 ? 2 : durationSeconds >= 60 ? 1.5 : 1;
  return Math.max(1, Math.floor(base * durationMult));
}

/** Derive level/progress from raw XP using a quadratic XP curve. */
export function xpToLevel(xp: number): {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
} {
  let level = 1;
  let accumulated = 0;

  // XP required for level n: n^2 * 100
  while (accumulated + level * level * 100 <= xp) {
    accumulated += level * level * 100;
    level++;
  }

  const xpToNextLevel = level * level * 100;
  return { level, currentXP: xp - accumulated, xpToNextLevel };
}
