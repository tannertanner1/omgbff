'use client'

import { IconCheck } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  DropdownMenuSubTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent
} from '@/components/ui/dropdown-menu'
import type { Table } from '@tanstack/react-table'

// Helper function to get column label
const getColumnLabel = (column: any) => {
  if (typeof column.columnDef.header === 'string') {
    return column.columnDef.header
  }
  if (typeof column.columnDef.header === 'function') {
    const headerProps = { column } // Minimal props needed for the header function
    const headerContent = column.columnDef.header(headerProps)
    // If it's a React element with a label prop, try to extract it
    if (headerContent?.props?.label) {
      return headerContent.props.label
    }
  }
  // Fallback to formatted column ID if no header is found
  return column.id.charAt(0).toUpperCase() + column.id.slice(1)
}

export function Options<TData>({ table }: { table: Table<TData> }) {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>Columns</DropdownMenuSubTrigger>
      <DropdownMenuSubContent className='w-[200px] p-0'>
        <Command>
          <CommandInput placeholder='Search...' className='border-0' />
          <CommandList>
            <CommandEmpty>No columns found.</CommandEmpty>
            <CommandGroup>
              {table
                .getAllColumns()
                .filter(
                  column =>
                    typeof column.accessorFn !== 'undefined' &&
                    column.getCanHide()
                )
                .map(column => {
                  return (
                    <CommandItem
                      key={column.id}
                      onSelect={() =>
                        column.toggleVisibility(!column.getIsVisible())
                      }
                      className='capitalize'
                    >
                      <span className='truncate'>{getColumnLabel(column)}</span>
                      <IconCheck
                        className={cn(
                          'ml-auto size-4 shrink-0',
                          column.getIsVisible() ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  )
                })}
            </CommandGroup>
          </CommandList>
        </Command>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  )
}
