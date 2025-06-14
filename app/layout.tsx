import type React from "react"
import type { Metadata, Viewport } from "next"
import { cookies } from "next/headers"
import { auth } from "@/lib/auth"
import { fontVariables } from "@/lib/fonts"
import { META_THEME_COLORS } from "@/lib/themes"
import { cn } from "@/lib/utils"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { ActiveThemeProvider } from "@/components/active-theme"
import { Analytics } from "@/components/analytics"
import { Layout } from "@/components/layout"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://omgbff.com"),
  alternates: { canonical: "https://omgbff.com" },
  title: "omgbff",
  description:
    "All-in-one client portal and admin dashboard. Manage accounts, tasks, and billing without spreadsheets or extra overhead.",
  authors: [
    {
      name: "tannertanner1",
      url: "https://tannertanner.me",
    },
  ],
  creator: "tannertanner1",
  icons: { icon: [{ rel: "icon", type: "image/svg+xml", url: "/icon.svg" }] },
  openGraph: {
    type: "website",
    siteName: "omgbff",
    url: "https://omgbff.com",
    title: "omgbff",
    description:
      "All-in-one client portal and admin dashboard. Manage accounts, tasks, and billing—without spreadsheets or extra overhead.",
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
    description:
      "All-in-one client portal and admin dashboard. Manage accounts, tasks, and billing—without spreadsheets or extra overhead.",
    images: ["https://tannertanner.me/image.png"],
    creator: "tannertanner1",
  },
}

export const viewport: Viewport = { themeColor: META_THEME_COLORS.light }

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "omgbff",
      url: "https://omgbff.com",
      description:
        "A full-stack e-commerce admin dashboard app created by tannertanner1 using Next.js, React, TypeScript, Tailwind CSS, Stripe for payments, and Resend for email receipts",
      keywords: [
        "tannertanner1",
        "React",
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Shadcn UI",
        "Motion",
        "Auth.js",
        "Neon",
        "Drizzle",
        "Resend",
        "Stripe",
        "Vercel",
      ],
      author: {
        "@type": "Person",
        name: "tannertanner1",
        url: "https://tannertanner.me",
        identifier: "tannertanner1",
        image: {
          "@type": "ImageObject",
          url: "https://tannertanner.me/photo.png",
          width: 1600,
          height: 800,
          alt: "tannertanner1",
        },
        sameAs: [
          "https://github.com/tannertanner1",
          "https://x.com/tannertanner404",
          "https://omgbff.com",
          "https://ilutoo.com",
        ],
      },
      image: {
        "@type": "ImageObject",
        url: "https://tannertanner.me/image.png",
        width: 1600,
        height: 800,
        alt: "tannertanner1",
      },
      creator: "tannertanner1",
      publisher: {
        "@type": "Person",
        name: "tannertanner1",
        url: "https://tannertanner.me",
      },
    },
    {
      "@type": "SoftwareSourceCode",
      name: "omgbff",
      codeRepository: "https://github.com/tannertanner1/omgbff",
      programmingLanguage: "TypeScript",
      runtimePlatform: "Node.js",
      codeSampleType: "full-solution",
      creator: {
        "@type": "Person",
        name: "tannertanner1",
        url: "https://tannertanner.me",
      },
      author: {
        "@type": "Person",
        name: "tannertanner1",
        url: "https://tannertanner.me",
      },
      description:
        "A full-stack e-commerce admin dashboard app created by tannertanner1 using Next.js, React, TypeScript, Tailwind CSS, Stripe for payments, and Resend for email receipts",
      about: {
        "@type": "SoftwareApplication",
        name: "omgbff",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          availability: "ComingSoon",
        },
        featureList: [
          "Passwordless authentication",
          "Attribute based access control",
          "Admin dashboard",
          "CRM",
          "Stripe payment processing",
          "PDF email receipts via Resend",
        ],
      },
      creativeWorkStatus: "Incomplete",
      isAccessibleForFree: true,
    },
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  const cookieStore = await cookies()
  const activeThemeValue = cookieStore.get("active_theme")?.value || "default"
  const isScaled = activeThemeValue?.endsWith("-scaled")
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
          "bg-sidebar overscroll-none font-sans antialiased",
          activeThemeValue ? `theme-${activeThemeValue}` : "",
          isScaled ? "theme-scaled" : "",
          fontVariables
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
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
              <Layout session={session}>{children}</Layout>
            </SidebarProvider>
            <Toaster />
            <Analytics />
          </ActiveThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
