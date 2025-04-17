"use client"

import { useState } from "react"
import {
  IconLayoutSidebarFilled,
  IconLayoutSidebarRightFilled,
  IconPercentage50,
} from "@tabler/icons-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

function Header() {
  return (
    <div className="relative flex flex-col">
      <header className="w-full py-4">
        <div className="relative mx-auto flex max-w-5xl items-center justify-between px-6">
          <div className="group">
            <Sidebar />
          </div>
          <div className="group">
            <Toggle />
          </div>
        </div>
      </header>
    </div>
  )
}

// function Sidebar() {
//   const [isOpen, setOpen] = useState(true)

//   return (
//     <button
//       onClick={() => setOpen(!isOpen)}
//       className="opacity-0 transition-opacity duration-300 hover:opacity-100 focus:outline-none"
//       aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
//     >
//       {isOpen ? (
//         <IconLayoutSidebarRightFilled className="text-foreground hover:text-primary h-6 w-6 transition-colors" />
//       ) : (
//         <IconLayoutSidebarFilled className="text-foreground hover:text-primary h-6 w-6 transition-colors" />
//       )}
//     </button>
//   )
// }

// function Toggle() {
//   const { theme, setTheme } = useTheme()

//   return (
//     <button
//       className={cn(
//         "text-primary relative overflow-hidden rounded-md bg-transparent opacity-0 duration-300 [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] hover:opacity-100 active:-translate-y-1 active:scale-x-90 active:scale-y-110"
//       )}
//       onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//     >
//       <IconPercentage50
//         aria-hidden="true"
//         className="h-6 w-6 dark:hidden dark:rotate-360"
//       />
//       <IconPercentage50
//         aria-hidden="true"
//         className="hidden h-6 w-6 rotate-360 dark:block"
//       />
//       <span className="sr-only">Toggle theme</span>
//     </button>
//   )
// }

;("use client")

import { IconMoon, IconSun } from "@tabler/icons-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { META_THEME_COLORS, useMetaColor } from "@/hooks/use-meta-color"

function ModeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme()
  const { setMetaColor } = useMetaColor()

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
    setMetaColor(
      resolvedTheme === "dark"
        ? META_THEME_COLORS.light
        : META_THEME_COLORS.dark
    )
  }, [resolvedTheme, setTheme, setMetaColor])

  return (
    <Button
      variant="outline"
      size="icon"
      className="group/toggle size-8"
      onClick={toggleTheme}
    >
      <IconPercentage50 className="hidden [html.dark_&]:block" />
      <IconPercentage50 className="hidden rotate-360 [html.light_&]:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export { ModeSwitcher }
