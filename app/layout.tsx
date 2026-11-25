import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { DEFAULT_THEME, THEME_STORAGE_KEY } from '@/lib/theme/storage'
import { AuthProvider } from '@/providers/auth-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import { ToastProvider } from '@/providers/toast-provider'
import { WalletProvider } from '@/providers/wallet-provider'
import { Footer } from '@/components/blocks/footer'
import { Navbar } from '@/components/navigation/navbar'

const geistSans = localFont({
  src: '../public/fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: '../public/fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: {
    default: 'BlockEstate — Premium real estate, tokenized for everyone',
    template: '%s | BlockEstate',
  },
  description:
    'Own a verified slice of premium real estate with crypto, starting from $100 — tokenized and fractional, settled on-chain.',
}

// Runs before first paint so the saved theme never flashes the wrong palette.
// Kept inline and dependency-free because nothing else has executed yet.
const noFlashThemeScript = `
(function () {
  function apply(theme) {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.dataset.theme = theme;
  }
  try {
    var stored = localStorage.getItem('${THEME_STORAGE_KEY}');
    var theme = stored === 'light' || stored === 'dark'
      ? stored
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    apply(theme);
  } catch (error) {
    apply('${DEFAULT_THEME}');
  }
})();
`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashThemeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-surface-base min-h-screen pt-[68px]`}
      >
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <WalletProvider>
                <Navbar />
                {children}
                <Footer />
              </WalletProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
