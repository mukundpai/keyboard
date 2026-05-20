export interface ShortcutQuestion {
  id: string;
  action: string;
  shortcut: string; // what the user must type (display form)
  keys: string[];   // individual key labels shown
  app: 'vscode' | 'chrome' | 'figma' | 'general';
  difficulty: 'easy' | 'medium' | 'hard';
}

export const SHORTCUT_QUESTIONS: ShortcutQuestion[] = [
  // ── VS Code ───────────────────────────────────────────────────────────────
  { id: 'vs1',  app: 'vscode',  difficulty: 'easy',   action: 'Save file',                   shortcut: 'Ctrl+S',          keys: ['Ctrl', 'S'] },
  { id: 'vs2',  app: 'vscode',  difficulty: 'easy',   action: 'Undo last change',             shortcut: 'Ctrl+Z',          keys: ['Ctrl', 'Z'] },
  { id: 'vs3',  app: 'vscode',  difficulty: 'easy',   action: 'Redo',                         shortcut: 'Ctrl+Y',          keys: ['Ctrl', 'Y'] },
  { id: 'vs4',  app: 'vscode',  difficulty: 'easy',   action: 'Find in file',                 shortcut: 'Ctrl+F',          keys: ['Ctrl', 'F'] },
  { id: 'vs5',  app: 'vscode',  difficulty: 'easy',   action: 'Open command palette',         shortcut: 'Ctrl+Shift+P',    keys: ['Ctrl', 'Shift', 'P'] },
  { id: 'vs6',  app: 'vscode',  difficulty: 'easy',   action: 'Toggle terminal',              shortcut: 'Ctrl+`',          keys: ['Ctrl', '`'] },
  { id: 'vs7',  app: 'vscode',  difficulty: 'medium', action: 'Duplicate line down',          shortcut: 'Shift+Alt+Down',  keys: ['Shift', 'Alt', '↓'] },
  { id: 'vs8',  app: 'vscode',  difficulty: 'medium', action: 'Move line up',                 shortcut: 'Alt+Up',          keys: ['Alt', '↑'] },
  { id: 'vs9',  app: 'vscode',  difficulty: 'medium', action: 'Delete entire line',           shortcut: 'Ctrl+Shift+K',    keys: ['Ctrl', 'Shift', 'K'] },
  { id: 'vs10', app: 'vscode',  difficulty: 'medium', action: 'Add cursor below',             shortcut: 'Ctrl+Alt+Down',   keys: ['Ctrl', 'Alt', '↓'] },
  { id: 'vs11', app: 'vscode',  difficulty: 'medium', action: 'Rename symbol',                shortcut: 'F2',              keys: ['F2'] },
  { id: 'vs12', app: 'vscode',  difficulty: 'hard',   action: 'Global find and replace',      shortcut: 'Ctrl+Shift+H',    keys: ['Ctrl', 'Shift', 'H'] },
  { id: 'vs13', app: 'vscode',  difficulty: 'hard',   action: 'Select all occurrences',       shortcut: 'Ctrl+Shift+L',    keys: ['Ctrl', 'Shift', 'L'] },
  { id: 'vs14', app: 'vscode',  difficulty: 'hard',   action: 'Format document',              shortcut: 'Shift+Alt+F',     keys: ['Shift', 'Alt', 'F'] },
  { id: 'vs15', app: 'vscode',  difficulty: 'hard',   action: 'Go to definition',             shortcut: 'F12',             keys: ['F12'] },

  // ── Chrome ────────────────────────────────────────────────────────────────
  { id: 'ch1',  app: 'chrome',  difficulty: 'easy',   action: 'Open new tab',                 shortcut: 'Ctrl+T',          keys: ['Ctrl', 'T'] },
  { id: 'ch2',  app: 'chrome',  difficulty: 'easy',   action: 'Close current tab',            shortcut: 'Ctrl+W',          keys: ['Ctrl', 'W'] },
  { id: 'ch3',  app: 'chrome',  difficulty: 'easy',   action: 'Reload page',                  shortcut: 'Ctrl+R',          keys: ['Ctrl', 'R'] },
  { id: 'ch4',  app: 'chrome',  difficulty: 'easy',   action: 'Open DevTools',                shortcut: 'F12',             keys: ['F12'] },
  { id: 'ch5',  app: 'chrome',  difficulty: 'medium', action: 'Go back',                      shortcut: 'Alt+Left',        keys: ['Alt', '←'] },
  { id: 'ch6',  app: 'chrome',  difficulty: 'medium', action: 'Open new incognito window',    shortcut: 'Ctrl+Shift+N',    keys: ['Ctrl', 'Shift', 'N'] },
  { id: 'ch7',  app: 'chrome',  difficulty: 'medium', action: 'Reopen closed tab',            shortcut: 'Ctrl+Shift+T',    keys: ['Ctrl', 'Shift', 'T'] },
  { id: 'ch8',  app: 'chrome',  difficulty: 'hard',   action: 'Focus address bar',            shortcut: 'Ctrl+L',          keys: ['Ctrl', 'L'] },
  { id: 'ch9',  app: 'chrome',  difficulty: 'hard',   action: 'Hard reload (bypass cache)',   shortcut: 'Ctrl+Shift+R',    keys: ['Ctrl', 'Shift', 'R'] },

  // ── Figma ─────────────────────────────────────────────────────────────────
  { id: 'fg1',  app: 'figma',   difficulty: 'easy',   action: 'Zoom to fit',                  shortcut: 'Shift+1',         keys: ['Shift', '1'] },
  { id: 'fg2',  app: 'figma',   difficulty: 'easy',   action: 'Group selection',              shortcut: 'Ctrl+G',          keys: ['Ctrl', 'G'] },
  { id: 'fg3',  app: 'figma',   difficulty: 'easy',   action: 'Ungroup',                      shortcut: 'Ctrl+Shift+G',    keys: ['Ctrl', 'Shift', 'G'] },
  { id: 'fg4',  app: 'figma',   difficulty: 'medium', action: 'Create component',             shortcut: 'Ctrl+Alt+K',      keys: ['Ctrl', 'Alt', 'K'] },
  { id: 'fg5',  app: 'figma',   difficulty: 'medium', action: 'Detach instance',              shortcut: 'Ctrl+Alt+B',      keys: ['Ctrl', 'Alt', 'B'] },
  { id: 'fg6',  app: 'figma',   difficulty: 'hard',   action: 'Show layers panel',            shortcut: 'Ctrl+Alt+L',      keys: ['Ctrl', 'Alt', 'L'] },

  // ── General OS ────────────────────────────────────────────────────────────
  { id: 'gen1', app: 'general', difficulty: 'easy',   action: 'Copy',                         shortcut: 'Ctrl+C',          keys: ['Ctrl', 'C'] },
  { id: 'gen2', app: 'general', difficulty: 'easy',   action: 'Paste',                        shortcut: 'Ctrl+V',          keys: ['Ctrl', 'V'] },
  { id: 'gen3', app: 'general', difficulty: 'easy',   action: 'Cut',                          shortcut: 'Ctrl+X',          keys: ['Ctrl', 'X'] },
  { id: 'gen4', app: 'general', difficulty: 'easy',   action: 'Select all',                   shortcut: 'Ctrl+A',          keys: ['Ctrl', 'A'] },
  { id: 'gen5', app: 'general', difficulty: 'medium', action: 'Switch window',                shortcut: 'Alt+Tab',         keys: ['Alt', 'Tab'] },
  { id: 'gen6', app: 'general', difficulty: 'medium', action: 'Screenshot region',            shortcut: 'Win+Shift+S',     keys: ['Win', 'Shift', 'S'] },
  { id: 'gen7', app: 'general', difficulty: 'hard',   action: 'Lock screen',                  shortcut: 'Win+L',           keys: ['Win', 'L'] },
];

export const APP_LABELS: Record<ShortcutQuestion['app'], string> = {
  vscode:  'VS Code',
  chrome:  'Chrome',
  figma:   'Figma',
  general: 'General',
};

export function getShortcutDeck(app?: ShortcutQuestion['app'], count = 10): ShortcutQuestion[] {
  const pool = app ? SHORTCUT_QUESTIONS.filter(q => q.app === app) : SHORTCUT_QUESTIONS;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
