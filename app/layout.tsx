import '@/app/globals.css'
import Providers from '@/app/providers'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { Header } from '@/components/header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OMGBFF',
  description: 'PNPM, React 19, Next, TypeScript, Tailwind CSS, shadcn UI'
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
