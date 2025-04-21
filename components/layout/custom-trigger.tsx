import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import {
  IconLayoutSidebarRightFilled,
  IconLayoutSidebarFilled,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"

function CustomTrigger({ className }: { className?: string }) {
  const { state, toggleSidebar } = useSidebar()
  const isExpanded = state === "expanded"

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className={cn(
        "h-8 w-8 p-0",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        // "hover:bg-transparent dark:hover:bg-transparent",
        className
      )}
      aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
      data-slot="sidebar-trigger"
    >
      {isExpanded ? (
        <IconLayoutSidebarFilled className="h-5 w-5 hover:text-shadow-lg" />
      ) : (
        <IconLayoutSidebarRightFilled className="h-5 w-5 hover:text-shadow-lg" />
      )}
    </Button>
  )
}

export { CustomTrigger }
