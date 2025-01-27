"use client"

import * as React from "react"
import { IconCheck, IconSelector, IconAdjustments } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { Table } from "@tanstack/react-table"

export function Options<TData>({ table }: { table: Table<TData> }) {
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          aria-label="Toggle columns"
          variant="outline"
          size="sm"
          className="ml-auto h-8 gap-2 lg:flex"
        >
          <IconAdjustments className="size-4" />
          View
          <IconSelector className="ml-auto size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[200px] p-0" onCloseAutoFocus={() => triggerRef.current?.focus()}>
        <Command>
          <CommandInput placeholder="Search columns..." className="border-0" />
          <CommandList>
            <CommandEmpty>No columns found.</CommandEmpty>
            <CommandGroup>
              {table
                .getAllColumns()
                .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
                .map((column) => {
                  return (
                    <CommandItem
                      key={column.id}
                      onSelect={() => column.toggleVisibility(!column.getIsVisible())}
                      className="capitalize"
                    >
                      <span className="truncate">{column.id}</span>
                      <IconCheck
                        className={cn("ml-auto size-4 shrink-0", column.getIsVisible() ? "opacity-100" : "opacity-0")}
                      />
                    </CommandItem>
                  )
                })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
