'use client'

import * as React from 'react'
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

export function Options<TData>({ table }: { table: Table<TData> }) {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>Columns</DropdownMenuSubTrigger>
      <DropdownMenuSubContent className='w-[144px] p-0'>
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
                      <span className='truncate'>{column.id}</span>
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
