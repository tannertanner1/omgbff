"use client"

import {
  IconCircleChevronLeft,
  IconCircleChevronRight,
} from "@tabler/icons-react"
import type { Table } from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function Pagination<TData>({ table }: { table: Table<TData> }) {
  return (
    <div className="flex items-center justify-end pt-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0 [&[data-slot=button]:disabled]:opacity-100"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <IconCircleChevronLeft
            className={cn(
              "text-primary size-5 transition-colors",
              table.getCanPreviousPage() &&
                "hover:bg-accent hover:text-accent-foreground"
            )}
          />
          <span className="sr-only">Prev</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0 [&[data-slot=button]:disabled]:opacity-100"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <IconCircleChevronRight
            className={cn(
              "text-primary size-5 transition-colors",
              table.getCanNextPage() &&
                "hover:bg-accent hover:text-accent-foreground"
            )}
          />
          <span className="sr-only">Next</span>
        </Button>
      </div>
    </div>
  )
}
