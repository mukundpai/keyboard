'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Volume2, VolumeX, Bell, BellOff, Moon, Sun, Type } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/Button';

export function SettingsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, updateSettings } = useSettingsStore();
  const { theme, setTheme } = useTheme();

  return (
    <>
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 p-3 rounded-full bg-accent/20 hover:bg-accent/30 border border-accent/30 transition-all duration-200 hover:scale-110"
        title="Settings"
      >
        <Settings size={20} className="text-accent-light" />
      </button>

      {/* Settings Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: 400 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 400 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 h-full w-full max-w-sm bg-background border-l border-border-active/10 shadow-2xl z-50 overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border-active/10 p-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-text-primary">Settings</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-surface-raised transition-colors"
                >
                  <X size={20} className="text-text-secondary" />
                </button>
              </div>

              {/* Settings Content */}
              <div className="p-6 space-y-6">
                {/* Sound */}
                <div className="space-y-2">
                  <label className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary flex items-center gap-2">
                      {settings.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                      Sound Effects
                    </span>
                    <input
                      type="checkbox"
                      checked={settings.soundEnabled}
                      onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
                      className="w-4 h-4 rounded accent"
                    />
                  </label>
                  <p className="text-xs text-text-secondary">Keyboard click and result sounds</p>
                </div>

                {/* Notifications */}
                <div className="space-y-2">
                  <label className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary flex items-center gap-2">
                      {settings.notificationsEnabled ? <Bell size={16} /> : <BellOff size={16} />}
                      Notifications
                    </span>
                    <input
                      type="checkbox"
                      checked={settings.notificationsEnabled}
                      onChange={(e) => updateSettings({ notificationsEnabled: e.target.checked })}
                      className="w-4 h-4 rounded accent"
                    />
                  </label>
                  <p className="text-xs text-text-secondary">Alerts for achievements and races</p>
                </div>

                {/* Theme */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-text-primary flex items-center gap-2">
                    {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                    Theme
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['light', 'dark', 'auto'] as const).map((t) => {
                      // Determine active: 'auto' matches when next-themes resolves system
                      const isActive =
                        t === 'auto'
                          ? settings.theme === 'auto'
                          : theme === t && settings.theme !== 'auto';
                      return (
                        <button
                          key={t}
                          onClick={() => {
                            updateSettings({ theme: t });
                            setTheme(t === 'auto' ? 'system' : t);
                          }}
                          className={`p-3 rounded-lg border-2 transition-all capitalize text-sm font-medium ${
                            isActive
                              ? 'border-accent bg-accent/10 text-accent-light'
                              : 'border-border-active/10 text-text-secondary hover:border-border-active/30'
                          }`}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Font Size */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-text-primary flex items-center gap-2">
                    <Type size={16} />
                    Font Size
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['sm', 'md', 'lg'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => updateSettings({ fontSize: size })}
                        className={`p-3 rounded-lg border-2 transition-all capitalize text-sm font-medium ${
                          settings.fontSize === size
                            ? 'border-accent bg-accent/10 text-accent-light'
                            : 'border-border-active/10 text-text-secondary hover:border-border-active/30'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Keyboard Layout */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-text-primary">Keyboard Layout</label>
                  <select
                    value={settings.keyboardLayout}
                    onChange={(e) => updateSettings({ keyboardLayout: e.target.value as any })}
                    className="w-full px-4 py-2 rounded-lg bg-surface border border-border-active/10 text-text-primary text-sm focus:outline-none focus:border-accent transition-colors"
                  >
                    <option value="qwerty">QWERTY</option>
                    <option value="dvorak">Dvorak</option>
                    <option value="colemak">Colemak</option>
                  </select>
                </div>

                {/* Smooth Caret */}
                <div className="space-y-2">
                  <label className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary">Smooth Caret</span>
                    <input
                      type="checkbox"
                      checked={settings.smoothCaret}
                      onChange={(e) => updateSettings({ smoothCaret: e.target.checked })}
                      className="w-4 h-4 rounded accent"
                    />
                  </label>
                  <p className="text-xs text-text-secondary">Smooth caret movement during typing</p>
                </div>

                {/* Show Stats */}
                <div className="space-y-2">
                  <label className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary">Show Live Stats</span>
                    <input
                      type="checkbox"
                      checked={settings.showStats}
                      onChange={(e) => updateSettings({ showStats: e.target.checked })}
                      className="w-4 h-4 rounded accent"
                    />
                  </label>
                  <p className="text-xs text-text-secondary">Display WPM and accuracy while typing</p>
                </div>

                {/* Language */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-text-primary">Language</label>
                  <select
                    value={settings.language}
                    onChange={(e) => updateSettings({ language: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-surface border border-border-active/10 text-text-primary text-sm focus:outline-none focus:border-accent transition-colors"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-border-active/10 p-6 space-y-3">
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="primary"
                  className="w-full"
                >
                  Done
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
