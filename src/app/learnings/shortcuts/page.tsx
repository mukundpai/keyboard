import type { Metadata } from 'next';
import ShortcutQuizClient from './ShortcutQuizClient';

export const metadata: Metadata = {
  title: 'Shortcut Quiz — KeyMaster Pro',
  description: 'Test your keyboard shortcut knowledge across VS Code, Chrome, and Figma.',
};

export default function ShortcutQuizPage() {
  return <ShortcutQuizClient />;
}
