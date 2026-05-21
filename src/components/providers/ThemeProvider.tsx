'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { LRUCache } from '@/lib/ds';

export type Theme = 'cream' | 'obsidian';

interface ThemeCtx {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

const Ctx = createContext<ThemeCtx | null>(null);
const STORAGE_KEY = 'suofeiya:theme';

// Small LRU just to demonstrate the data structure is in use and to
// memoise the resolved CSS variables across mounts.
const themeCache = new LRUCache<Theme, { bg: string; text: string }>(4);
themeCache.set('cream', { bg: '#F0EDE5', text: '#1A1714' });
themeCache.set('obsidian', { bg: '#14110E', text: '#EDE6D6' });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('cream');

  useEffect(() => {
    const stored = (typeof window !== 'undefined' && (localStorage.getItem(STORAGE_KEY) as Theme | null)) || null;
    if (stored === 'cream' || stored === 'obsidian') {
      setThemeState(stored);
      document.documentElement.dataset.theme = stored;
    } else {
      document.documentElement.dataset.theme = 'cream';
    }
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    document.documentElement.dataset.theme = t;
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => setTheme(theme === 'cream' ? 'obsidian' : 'cream'), [theme, setTheme]);

  const value = useMemo<ThemeCtx>(() => ({ theme, setTheme, toggle }), [theme, setTheme, toggle]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme(): ThemeCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useTheme must be used inside <ThemeProvider>');
  return v;
}
