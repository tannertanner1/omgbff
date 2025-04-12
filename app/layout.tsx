import type { Metadata, Viewport } from 'next'
import { cookies } from 'next/headers'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import Providers from '@/app/providers'
import { ActiveThemeProvider } from '@/components/theme/active-theme'
// import { Header } from '@/components/header'

const fontSans = Geist({
  variable: '--font-sans',
  subsets: ['latin']
})
const fontMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin']
})

const META_THEME_COLORS = {
  light: '#ffffff',
  dark: '#09090b'
}

export const metadata: Metadata = {
  title: 'omgbff',
  description: '@tannertanner1',
  metadataBase: new URL('https://omgbff.com'),
  authors: [
    {
      name: '@tannertanner1',
      url: 'https://tannertanner.me'
    }
  ],
  creator: '@tannertanner1',
  icons: { icon: [{ rel: 'icon', type: 'image/svg+xml', url: '/icon.svg' }] },
  openGraph: {
    type: 'website',
    siteName: 'omgbff',
    url: 'https://omgbff.com',
    title: 'omgbff',
    description: '@tannertanner1',
    images: [
      {
        url: 'https://tannertanner.me/image.png',
        width: 1600,
        height: 800
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'omgbff',
    description: '@tannertanner1',
    images: ['https://tannertanner.me/image.png'],
    creator: '@tannertanner1'
  }
}

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  // Get active theme from cookies
  const cookieStore = await cookies()
  const activeThemeValue = cookieStore.get('active_theme')?.value || 'default'
  const isScaled = activeThemeValue?.endsWith('-scaled')

  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        {/* This script runs before React hydration to prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
              } catch (_) {}
            `
          }}
        />
      </head>
      <body
        className={cn(
          'overscroll-none bg-background font-sans antialiased',
          activeThemeValue ? `theme-${activeThemeValue}` : '',
          isScaled ? 'theme-scaled' : '',
          fontSans.variable,
          fontMono.variable
        )}
      >
        <Providers>
          <ActiveThemeProvider initialTheme={activeThemeValue}>
            {/* <Header /> */}
            {children}
          </ActiveThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
