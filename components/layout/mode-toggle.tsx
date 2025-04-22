"use client"

import * as React from "react"
import { IconContrastFilled } from "@tabler/icons-react"
import { useTheme } from "next-themes"
import { META_THEME_COLORS, useMetaColor } from "@/hooks/use-meta-color"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function ModeToggle() {
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
      variant="ghost"
      className={cn(
        "group/toggle h-8 w-8 px-0",
        "text-primary rounded-full",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
      onClick={toggleTheme}
    >
      <IconContrastFilled className="hidden text-shadow-lg [html.dark_&]:block" />
      <IconContrastFilled className="hidden rotate-360 text-shadow-lg [html.light_&]:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export { ModeToggle }
