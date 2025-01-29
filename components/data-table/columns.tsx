'use client'

import type { ColumnDef } from '@tanstack/react-table'
import {
  IconSelector,
  IconArrowUp,
  IconArrowDown,
  IconEyeOff,
  IconDots,
  IconPencil,
  IconTrash
} from '@tabler/icons-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

export function Columns<T extends object>(data: T[]): ColumnDef<T>[] {
  if (data.length === 0) return []

  const sample = data[0]
  const columns: ColumnDef<T>[] = Object.keys(sample).map(key => ({
    accessorKey: key,
    header: ({ column }) => {
      return (
        <div className='flex items-center gap-2'>
          <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className='h-4 w-4 cursor-pointer'>
                <IconSelector className='h-4 w-4' />
              </div>
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
      <div className='px-4'>{row.getValue(key)?.toString()}</div>
    )
  }))

  columns.push({
    id: 'actions',
    cell: ({ row }) => {
      const item = row.original
      return (
        <div className='px-4 text-right'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className='inline-flex h-8 w-8 cursor-pointer items-center justify-center'>
                <IconDots className='h-4 w-4' />
              </button>
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
