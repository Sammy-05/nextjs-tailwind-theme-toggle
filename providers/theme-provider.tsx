'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  DEFAULT_THEME,
  getSystemDarkQuery,
  readAppliedTheme,
  readStoredTheme,
  writeStoredTheme,
} from '@/lib/theme/storage'
import type { Theme, ThemeContextValue } from '@/types/theme'

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Server markup must stay deterministic, so state starts at the SSR default
  // and adopts whatever the pre-paint script already applied.
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME)

  useEffect(() => {
    setTheme(readAppliedTheme())
  }, [])

  // The only writer of the class and the dataset, so the two cannot drift.
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.dataset.theme = theme
  }, [theme])

  // Follow the OS only while the visitor has made no explicit choice.
  useEffect(() => {
    const query = getSystemDarkQuery()

    function handleSystemChange(event: MediaQueryListEvent) {
      if (readStoredTheme()) {
        return
      }
      setTheme(event.matches ? 'dark' : 'light')
    }

    query.addEventListener('change', handleSystemChange)
    return () => query.removeEventListener('change', handleSystemChange)
  }, [])

  function toggleTheme() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    writeStoredTheme(next)
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}
