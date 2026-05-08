'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, X } from 'lucide-react';

const SHORTCUTS = [
  { key: 'Tab', action: 'Restart test' },
  { key: 'Esc', action: 'Close modals' },
  { key: 'Ctrl/Cmd + /​', action: 'Show shortcuts' },
  { key: 'Ctrl/Cmd + K', action: 'Open command palette' },
];

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);

  // Listen for Ctrl+/ to open shortcuts
  // This would be implemented in a hook or global listener

  return (
    <>
      {/* Help button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 z-40 p-2 rounded-lg hover:bg-surface-raised transition-colors"
        title="Keyboard Shortcuts (Ctrl+/)"
      >
        <Keyboard size={20} className="text-text-secondary hover:text-text-primary transition-colors" />
      </button>

      {/* Shortcuts Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background border border-border-active/10 rounded-lg shadow-xl z-50 max-w-sm w-full mx-4"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                    <Keyboard size={20} />
                    Keyboard Shortcuts
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-surface-raised rounded transition-colors"
                  >
                    <X size={20} className="text-text-secondary" />
                  </button>
                </div>

                <div className="space-y-3">
                  {SHORTCUTS.map((shortcut, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">{shortcut.action}</span>
                      <kbd className="px-2 py-1 bg-surface-raised border border-border-active/20 rounded text-xs font-mono text-accent-light">
                        {shortcut.key}
                      </kbd>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full mt-6 px-4 py-2 rounded-lg bg-accent/20 hover:bg-accent/30 border border-accent/30 text-accent-light font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
