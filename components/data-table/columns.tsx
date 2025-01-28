'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  IconSelector,
  IconArrowUp,
  IconArrowDown,
  IconEyeOff,
  IconDots,
  IconPencil,
  IconTrash
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'

export function Columns<T extends object>(data: T[]): ColumnDef<T>[] {
  if (data.length === 0) return []

  const sample = data[0]
  const columns: ColumnDef<T>[] = Object.keys(sample).map(key => ({
    accessorKey: key,
    header: ({ column }) => {
      return (
        <div className='px-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                className={cn(
                  '-ml-3 h-8 hover:bg-transparent', // data-[state=open]:bg-accent
                  'justify-start font-medium'
                )}
              >
                <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                <IconSelector className='ml-2 h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start'>
              <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                <IconArrowUp className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
                Asc
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                <IconArrowDown className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
                Desc
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                <IconEyeOff className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
                Hide
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
    cell: ({ row }) => (
      <div className='px-2'>{row.getValue(key)?.toString()}</div>
    )
  }))

  columns.push({
    id: 'actions',
    cell: ({ row }) => {
      const item = row.original
      return (
        <div className='px-2 text-right'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className='h-8 w-8 p-0 hover:bg-transparent'
              >
                <span className='sr-only'>Open menu</span>
                <IconDots className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem
                onClick={() => console.log('Edit', item)}
                className='hover:bg-secondary'
              >
                <IconPencil className='mr-2 h-4 w-4' />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => console.log('Delete', item)}
                className='text-[#DB4437] hover:bg-[#DB4437] hover:text-background'
              >
                <IconTrash className='mr-2 h-4 w-4' />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  })

  return columns
}
