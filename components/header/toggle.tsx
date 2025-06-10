"use client"

import { IconPercentage50 } from "@tabler/icons-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function Toggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      className={cn(
        "relative overflow-hidden rounded-md bg-transparent text-primary transition-all duration-300 [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] active:-translate-y-1 active:scale-x-90 active:scale-y-110"
      )}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <IconPercentage50
        aria-hidden="true"
        className="dark:rotate-360 h-6 w-6 dark:hidden"
      />
      <IconPercentage50
        aria-hidden="true"
        className="rotate-360 hidden h-6 w-6 dark:block"
      />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
