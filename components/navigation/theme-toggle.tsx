'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/providers/theme-provider'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const label = isDark ? 'Switch to light theme' : 'Switch to dark theme'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      aria-pressed={isDark}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 bg-ink/5 text-content-secondary transition-colors hover:bg-ink/10 hover:text-content focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink/40"
    >
      {isDark ? (
        <Sun className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Moon className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  )
}
