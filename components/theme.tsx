"use client"

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import * as React from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { META_THEME_COLORS, useMetaColor } from "@/hooks/use-meta-color"
import { IconPercentage50, IconCircleHalf } from "@tabler/icons-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

const THEMES = [
  {
    name: "Default",
    value: "default",
  },
  {
    name: "Neobrutal",
    value: "neobrutalism",
  },
  {
    name: "Clay",
    value: "claymorphism",
  },
]
// type Style = (typeof THEMES)[number]

function Theme() {
  const [mounted, setMounted] = React.useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { activeTheme, setActiveTheme } = useThemeConfig()
  const { setMetaColor } = useMetaColor()

  // Set mounted state after component mounts
  React.useEffect(() => setMounted(true), [])

  // Handle theme change with meta color update
  const handleThemeChange = React.useCallback(
    (value: string) => {
      setTheme(value)

      // Update meta color based on the new theme
      const newResolvedTheme =
        value === "system"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : value

      setMetaColor(
        newResolvedTheme === "dark"
          ? META_THEME_COLORS.dark
          : META_THEME_COLORS.light
      )
    },
    [setTheme, setMetaColor]
  )

  // Handle style theme change
  const handleStyleChange = React.useCallback(
    (value: string) => {
      setActiveTheme(value)
    },
    [setActiveTheme]
  )

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="group/toggle text-primary rounded-full"
      >
        <IconCircleHalf
          aria-hidden="true"
          className="h-12 w-12 text-shadow-lg"
        />
        <span className="sr-only">Theme settings</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="group/toggle text-primary rounded-full"
        >
          <IconPercentage50
            aria-hidden="true"
            className="h-12 w-12 text-shadow-lg dark:hidden dark:rotate-360"
          />
          <IconPercentage50
            aria-hidden="true"
            className="hidden h-12 w-12 rotate-360 text-shadow-lg dark:block"
          />
          <span className="sr-only">Theme settings</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Mode</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuRadioGroup
            value={theme}
            onValueChange={handleThemeChange}
          >
            <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Vibe</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuRadioGroup
            value={activeTheme}
            onValueChange={handleStyleChange}
          >
            {THEMES.map((item) => (
              <DropdownMenuRadioItem key={item.value} value={item.value}>
                {item.name}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { ActiveThemeProvider, useThemeConfig, Theme }
