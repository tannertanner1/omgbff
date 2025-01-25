'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Header } from './header'
import { Actions } from './actions'
import {
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { Pen, Trash } from 'lucide-react'

export const columns: ColumnDef<{
  id: string
  name: string
  createdAt: string
  userId: string
}>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <Header column={column} title='Name' />,
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-[500px] truncate font-medium'>
            {row.getValue('name')}
          </span>
        </div>
      )
    }
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <Header column={column} title='Created At' />,
    cell: ({ row }) => {
      return (
        <div className='flex w-[100px] items-center'>
          {new Date(row.getValue('createdAt')).toLocaleDateString()}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <Actions row={row}>
        <DropdownMenuItem asChild>
          <Link
            href={`/${row.original.userId}/organizations/${row.original.id}/edit`}
          >
            <Pen className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href={`/${row.original.userId}/organizations/${row.original.id}/delete`}
          >
            <Trash className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
            Delete
          </Link>
        </DropdownMenuItem>
      </Actions>
    )
  }
]
