import '@/app/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Providers from '@/app/providers'
import { Header } from '@/components/header'

const inter = Inter({ subsets: ['latin'] })

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

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${inter.className} font-sans antialiased`}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  )
}
