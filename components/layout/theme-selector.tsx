"use client"

import { THEMES } from "@/lib/themes"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useThemeConfig } from "@/components/active-theme"

function ThemeSelector() {
  const { activeTheme, setActiveTheme } = useThemeConfig()

  return (
    <div
      className="inline-block"
      style={{ "--select-width": "8rem" } as React.CSSProperties}
    >
      <Select value={activeTheme} onValueChange={setActiveTheme}>
        <SelectTrigger
          size="sm"
          className={cn(
            "[&[data-slot=select-trigger]]:focus-visible:border-input [&[data-slot=select-trigger]]:focus-visible:ring-0",
            "w-[var(--select-width)]" // "w-32"
          )}
        >
          <SelectValue placeholder="Select a theme" />
        </SelectTrigger>
        <SelectContent
          align="end"
          className={cn(
            "w-[var(--select-width)]" // "min-w-32"
          )}
        >
          {THEMES.map((theme) => (
            <SelectItem key={theme.name} value={theme.value}>
              {theme.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export { ThemeSelector }
