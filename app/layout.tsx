import type { Metadata, Viewport } from 'next'
import { cookies } from 'next/headers'

import { fontVariables } from '@/lib/fonts'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'

import './globals.css'
import { cn } from '@/lib/utils'
import { ActiveThemeProvider } from '@/components/active-theme'

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
  const cookieStore = await cookies()
  const activeThemeValue = cookieStore.get('active_theme')?.value
  const isScaled = activeThemeValue?.endsWith('-scaled')

  return (
    <html lang='en' suppressHydrationWarning>
      <head>
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
          'overscroll-none bg-background font-mono antialiased',
          activeThemeValue ? `theme-${activeThemeValue}` : '',
          isScaled ? 'theme-scaled' : '',
          fontVariables
        )}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          <ActiveThemeProvider initialTheme={activeThemeValue}>
            {children}
            <Toaster />
          </ActiveThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
