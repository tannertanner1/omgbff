"use client"

import * as React from "react"
import {
  IconArrowDown,
  IconArrowUp,
  IconEyeOff,
  IconSelector,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const Header = React.memo(
  ({ column, label }: { column: any; label: string }) => {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <div
            className={cn(
              "flex cursor-pointer items-center gap-2 select-none",
              "hover:text-primary transition-colors",
              isOpen && "text-primary"
            )}
          >
            <span>{label}</span>
            <IconSelector className="h-4 w-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          side="bottom"
          sticky="partial"
          className="[&[data-slot=dropdown-menu-content]]:bg-background [&[data-slot=dropdown-menu-content]]:text-foreground w-[100px]"
          collisionPadding={12}
          updatePositionStrategy="always"
        >
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <IconArrowUp className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <IconArrowDown className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <IconEyeOff className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
)
Header.displayName = "Header"
