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
          className="hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <IconCircleChevronLeft
            className={cn(
              "size-5 transition-colors",
              // !table.getCanPreviousPage()
              //   ? "text-muted-foreground/50"
              //   : "text-muted-foreground hover:text-primary"
              !table.getCanPreviousPage()
                ? "text-primary"
                : "text-primary hover:text-muted-foreground"
            )}
          />
          <span className="sr-only">Prev</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <IconCircleChevronRight
            className={cn(
              "size-5 transition-colors",
              // !table.getCanNextPage()
              //   ? "text-muted-foreground/50"
              //   : "text-muted-foreground hover:text-primary"
              !table.getCanNextPage()
                ? "text-primary"
                : "text-primary hover:text-muted-foreground"
            )}
          />
          <span className="sr-only">Next</span>
        </Button>
      </div>
    </div>
  )
}
