import type { Metadata, Viewport } from "next"
import { cookies } from "next/headers"
import { Geist, Geist_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { ActiveThemeProvider } from "@/components/active-theme"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Layout } from "@/components/layout"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"
import "./globals.css"

const fontSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
})
const fontMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
})

const META_THEME_COLORS = {
  light: "oklch(0.985 0 0)",
  dark: "oklch(0.21 0.006 285.885)",
}

export const metadata: Metadata = {
  title: "omgbff",
  description: "@tannertanner1",
  metadataBase: new URL("https://omgbff.com"),
  authors: [
    {
      name: "@tannertanner1",
      url: "https://tannertanner.me",
    },
  ],
  creator: "@tannertanner1",
  icons: { icon: [{ rel: "icon", type: "image/svg+xml", url: "/icon.svg" }] },
  openGraph: {
    type: "website",
    siteName: "omgbff",
    url: "https://omgbff.com",
    title: "omgbff",
    description: "@tannertanner1",
    images: [
      {
        url: "https://tannertanner.me/image.png",
        width: 1600,
        height: 800,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "omgbff",
    description: "@tannertanner1",
    images: ["https://tannertanner.me/image.png"],
    creator: "@tannertanner1",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: META_THEME_COLORS.light },
    { media: "(prefers-color-scheme: dark)", color: META_THEME_COLORS.dark },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  // Get active theme from cookies
  const activeThemeValue = cookieStore.get("active_theme")?.value || "default"
  const isScaled = activeThemeValue?.endsWith("-scaled")
  // Get sidebar state from cookies
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <html lang="en" suppressHydrationWarning>
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
            `,
          }}
        />
      </head>
      <body
        className={cn(
          "bg-background overscroll-none font-sans antialiased",
          activeThemeValue ? `theme-${activeThemeValue}` : "",
          isScaled ? "theme-scaled" : "",
          fontSans.variable,
          fontMono.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          // enableColorScheme
        >
          <ActiveThemeProvider initialTheme={activeThemeValue}>
            <SidebarProvider
              defaultOpen={defaultOpen}
              style={
                {
                  "--sidebar-width": "16rem",
                  "--header-height": "3rem",
                  "--content-padding": "0",
                } as React.CSSProperties
              }
            >
              <Layout>{children}</Layout>
            </SidebarProvider>
            <Toaster />
          </ActiveThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
