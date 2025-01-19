import '@/app/globals.css'
import Providers from '@/app/providers'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { Header } from '@/components/header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://omgbff.vercel.app'),
  alternates: { canonical: 'https://omgbff.vercel.app' },
  icons: { icon: [{ rel: 'icon', type: 'image/svg+xml', url: '/icon.svg' }] },
  title: '😍',
  description: 'PNPM, React 19, Next, TypeScript, Tailwind CSS, shadcn UI',
  openGraph: {
    title: 'OMGBFF',
    description: '❤️',
    images: {
      url: 'https://omgbff.vercel.app/icon.png',
      alt: '❤️OMGBFF❤️',
      width: 800,
      height: 400
    },
    url: 'https://omgbff.vercel.app',
    siteName: 'OMGBFF',
    type: 'website'
  },
  generator: 'Next.js',
  applicationName: 'OMG BFF',
  authors: [{ name: '@tannertanner1', url: 'https://tannertanner.me' }]
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
