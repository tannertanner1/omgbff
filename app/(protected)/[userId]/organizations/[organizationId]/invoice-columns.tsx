'use client'

import Link from 'next/link'
import type { ColumnDef } from '@tanstack/react-table'
import { formatDistanceToNow } from 'date-fns'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

export type Invoice = {
  id: number
  customerId: number
  customerName: string
  value: number
  status: string
  createdAt: Date
  userId: string
}

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: 'id',
    header: 'Invoice #',
    cell: ({ row }) => (
      <Link
        href={`/${row.original.userId}/invoices/${row.original.id}`}
        className='hover:underline'
      >
        #{row.getValue('id')}
      </Link>
    )
  },
  {
    accessorKey: 'customerName',
    header: 'Customer'
  },
  {
    accessorKey: 'value',
    header: 'Amount',
    cell: ({ row }) => `$${(row.getValue<number>('value') / 100).toFixed(2)}`
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge
        variant={
          row.getValue<string>('status') === 'paid'
            ? 'secondary'
            : 'destructive'
        }
      >
        {row.getValue<string>('status')}
      </Badge>
    )
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) =>
      formatDistanceToNow(new Date(row.getValue('createdAt')), {
        addSuffix: true
      })
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const invoice = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(invoice.id.toString())
              }
            >
              Copy invoice ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/${invoice.userId}/invoices/${invoice.id}/edit`}>
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/${invoice.userId}/invoices/${invoice.id}/delete`}>
                Delete
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]
