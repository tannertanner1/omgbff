"use client"

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import * as React from "react"
import { ThemeProvider, useTheme } from "next-themes"
import { META_THEME_COLORS, useMetaColor } from "@/hooks/use-meta-color"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { ControlledTrigger, AppSidebar } from "./app-sidebar"
import { ModeSwitcher } from "@/components/mode-switcher"
import { Toaster } from "@/components/ui/sonner"

const COOKIE_NAME = "active_theme"
const DEFAULT_THEME = "default"

function setThemeCookie(theme: string) {
  if (typeof window === "undefined") return

  document.cookie = `${COOKIE_NAME}=${theme}; path=/; max-age=31536000; SameSite=Lax; ${window.location.protocol === "https:" ? "Secure;" : ""}`
}

type ThemeContextType = {
  activeTheme: string
  setActiveTheme: (theme: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function ActiveThemeProvider({
  children,
  initialTheme,
}: {
  children: ReactNode
  initialTheme?: string
}) {
  const [activeTheme, setActiveTheme] = useState<string>(
    () => initialTheme || DEFAULT_THEME
  )

  useEffect(() => {
    setThemeCookie(activeTheme)

    Array.from(document.body.classList)
      .filter((className) => className.startsWith("theme-"))
      .forEach((className) => {
        document.body.classList.remove(className)
      })
    document.body.classList.add(`theme-${activeTheme}`)
    if (activeTheme.endsWith("-scaled")) {
      document.body.classList.add("theme-scaled")
    }
  }, [activeTheme])

  return (
    <ThemeContext.Provider value={{ activeTheme, setActiveTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

function useThemeConfig() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useThemeConfig must be used within an ActiveThemeProvider")
  }
  return context
}

function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true)

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <AppSidebar variant="inset" collapsible="offcanvas" />
      <SidebarInset className="flex h-[98svh] flex-col overflow-hidden">
        <header className="bg-sidebar flex h-[52px] items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <ControlledTrigger className="-ml-1" />
          </div>
          <div className="flex items-center">
            <ModeSwitcher />
          </div>
        </header>
        <div className="bg-sidebar flex flex-1 flex-col overflow-hidden p-4">
          <div className="border-border bg-background flex flex-1 flex-col overflow-hidden rounded-xl border">
            <div className="flex-1 overflow-y-auto p-4">{children}</div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

function ToasterProvider() {
  const { resolvedTheme } = useTheme()
  return (
    <Toaster
      richColors
      closeButton
      position="top-center"
      theme={resolvedTheme === "dark" ? "dark" : "light"}
    />
  )
}

// function ContextProviders({ children }: { children: React.ReactNode }) {
//   return (
//     <ThemeProvider
//       enableSystem
//       attribute="class"
//       defaultTheme="dark"
//       disableTransitionOnChange
//     >
//       <ActiveThemeProvider initialTheme={activeThemeValue}>
//         <AppShell>{children}</AppShell>
//         {/* {children} */}
//       </ActiveThemeProvider>
//       {children}
//       <ToasterProvider />
//     </ThemeProvider>
//   )
// }

// export { ActiveThemeProvider, useThemeConfig, ContextProviders }
export { ActiveThemeProvider, useThemeConfig }
