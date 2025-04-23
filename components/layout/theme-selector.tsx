"use client"

import { useThemeConfig } from "@/components/active-theme"
import { THEMES } from "@/lib/themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IconCheck } from "@tabler/icons-react"

function ThemeSelector({ children }: { children: React.ReactNode }) {
  const { activeTheme, setActiveTheme } = useThemeConfig()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side="top"
        align="center"
        sideOffset={4}
        alignOffset={0}
        // data-slot="dropdown-footer"
      >
        {THEMES.map((theme) => (
          <DropdownMenuItem
            key={theme.value}
            onClick={() => setActiveTheme(theme.value)}
            className="flex items-center justify-between"
          >
            {theme.name}
            {activeTheme === theme.value && <IconCheck className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { ThemeSelector }

// "use client"

// import { useThemeConfig } from "@/components/active-theme"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"

// const THEMES = [
//   {
//     name: "Default",
//     value: "default",
//   },
//   {
//     name: "Neobrutal",
//     value: "neobrutalism",
//   },
//   {
//     name: "Clay",
//     value: "claymorphism",
//   },
// ]

// type Theme = (typeof THEMES)[number]

// function ThemeSelector() {
//   const { activeTheme, setActiveTheme } = useThemeConfig()

//   return (
//     <Select value={activeTheme} onValueChange={setActiveTheme}>
//       <SelectTrigger size="sm" className="w-32">
//         <SelectValue placeholder="Select a theme" />
//       </SelectTrigger>
//       <SelectContent align="end">
//         {THEMES.map((theme) => (
//           <SelectItem key={theme.name} value={theme.value}>
//             {theme.name}
//           </SelectItem>
//         ))}
//       </SelectContent>
//     </Select>
//   )
// }

// export { THEMES, type Theme, ThemeSelector }
