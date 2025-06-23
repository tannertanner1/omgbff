import { CustomTrigger } from "./custom-trigger"
import { ModeToggle } from "./mode-toggle"
import { ThemeSelector } from "./theme-selector"

function SiteHeader() {
  return (
    <header className="site-header mx-2 flex items-center justify-between">
      <div className="ml-1 flex items-center">
        <CustomTrigger />
      </div>
      <div className="mr-1 flex items-center gap-2">
        <ThemeSelector />
        <ModeToggle />
      </div>
    </header>
  )
}

export { SiteHeader }
