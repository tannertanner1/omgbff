import '@/app/globals.css'
import Providers from '@/app/providers'
import { Viewport } from 'next'
import type { Metadata } from 'next'
// import { Inter } from 'next/font/google'
import localFont from 'next/font/local'

// const inter = Inter({ subsets: ["latin"] });
const sans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-sans',
  weight: '100 900'
})
const mono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-mono',
  weight: '100 900'
})

export const metadata: Metadata = {
  title: 'My App',
  description: 'PNPM, React 19, Next, TypeScript, Tailwind CSS, shadcn UI'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        // className={`${inter.className} font-sans antialiased`}
        className={`${sans.variable} ${mono.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
