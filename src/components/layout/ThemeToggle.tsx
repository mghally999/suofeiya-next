'use client';

import { useTheme } from '@/components/providers/ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'cream' ? 'obsidian' : 'cream'} theme`}
      data-cursor={theme === 'cream' ? 'obsidian' : 'cream'}
    >
      <span aria-hidden>{theme === 'cream' ? '◐' : '◑'}</span>
      {theme === 'cream' ? 'Cream' : 'Obsidian'}
    </button>
  );
}
