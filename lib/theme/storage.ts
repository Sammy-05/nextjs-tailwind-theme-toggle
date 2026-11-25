import type { Theme } from '@/types/theme'

export const THEME_STORAGE_KEY = 'blockestate-theme'

export const DEFAULT_THEME: Theme = 'dark'

// One MediaQueryList for the whole app: the resolver and the listener share it
// rather than each registering their own.
let systemDarkQuery: MediaQueryList | null = null

export function getSystemDarkQuery(): MediaQueryList {
  systemDarkQuery ??= window.matchMedia('(prefers-color-scheme: dark)')
  return systemDarkQuery
}

function isTheme(value: string | null | undefined): value is Theme {
  return value === 'light' || value === 'dark'
}

export function readStoredTheme(): Theme | null {
  try {
    return isTheme(window.localStorage.getItem(THEME_STORAGE_KEY))
      ? (window.localStorage.getItem(THEME_STORAGE_KEY) as Theme)
      : null
  } catch {
    return null
  }
}

export function writeStoredTheme(theme: Theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Private browsing or blocked storage: the theme still applies for this visit.
  }
}

// What the pre-paint script in app/layout.tsx already decided, so nothing
// recomputes the answer after hydration.
export function readAppliedTheme(): Theme {
  const applied = document.documentElement.dataset.theme
  return isTheme(applied) ? applied : DEFAULT_THEME
}
