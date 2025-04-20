"use client"

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

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

export { ActiveThemeProvider, useThemeConfig }

// "use client"

// import {
//   ReactNode,
//   createContext,
//   useContext,
//   useEffect,
//   useState,
// } from "react"
// import * as React from "react"
// import { useTheme } from "next-themes"
// import { Button } from "@/components/ui/button"
// import { META_THEME_COLORS, useMetaColor } from "@/hooks/use-meta-color"

// const COOKIE_NAME = "active_theme"
// const DEFAULT_THEME = "default"

// function setThemeCookie(theme: string) {
//   if (typeof window === "undefined") return

//   document.cookie = `${COOKIE_NAME}=${theme}; path=/; max-age=31536000; SameSite=Lax; ${window.location.protocol === "https:" ? "Secure;" : ""}`
// }

// type ThemeContextType = {
//   activeTheme: string
//   setActiveTheme: (theme: string) => void
// }

// const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// function ActiveThemeProvider({
//   children,
//   initialTheme,
// }: {
//   children: ReactNode
//   initialTheme?: string
// }) {
//   const [activeTheme, setActiveTheme] = useState<string>(
//     () => initialTheme || DEFAULT_THEME
//   )

//   useEffect(() => {
//     setThemeCookie(activeTheme)

//     Array.from(document.body.classList)
//       .filter((className) => className.startsWith("theme-"))
//       .forEach((className) => {
//         document.body.classList.remove(className)
//       })
//     document.body.classList.add(`theme-${activeTheme}`)
//     if (activeTheme.endsWith("-scaled")) {
//       document.body.classList.add("theme-scaled")
//     }
//   }, [activeTheme])

//   return (
//     <ThemeContext.Provider value={{ activeTheme, setActiveTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   )
// }

// function useThemeConfig() {
//   const context = useContext(ThemeContext)
//   if (context === undefined) {
//     throw new Error("useThemeConfig must be used within an ActiveThemeProvider")
//   }
//   return context
// }

// export { ActiveThemeProvider, useThemeConfig }
