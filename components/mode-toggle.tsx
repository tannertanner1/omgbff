"use client"

import * as React from "react"
import { IconPercentage50, IconContrastFilled } from "@tabler/icons-react"
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
        "hover:bg-transparent dark:hover:bg-transparent"
        // "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
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

// "use client"

// import * as React from "react"
// import { IconPercentage50 } from "@tabler/icons-react"
// import { useTheme } from "next-themes"
// import { Button } from "@/components/ui/button"
// import { META_THEME_COLORS, useMetaColor } from "@/hooks/use-meta-color"

// function ModeSwitcher() {
//   const { setTheme, resolvedTheme } = useTheme()
//   const { setMetaColor } = useMetaColor()

//   const toggleTheme = React.useCallback(() => {
//     setTheme(resolvedTheme === "dark" ? "light" : "dark")
//     setMetaColor(
//       resolvedTheme === "dark"
//         ? META_THEME_COLORS.light
//         : META_THEME_COLORS.dark
//     )
//   }, [resolvedTheme, setTheme, setMetaColor])

//   return (
//     <Button
//       variant="outline"
//       size="icon"
//       className="group/toggle size-8"
//       onClick={toggleTheme}
//     >
//       <IconPercentage50 className="hidden [html.dark_&]:block" />
//       <IconPercentage50 className="hidden rotate-360 [html.light_&]:block" />
//       <span className="sr-only">Toggle theme</span>
//     </Button>
//   )
// }

// export { ModeSwitcher }
