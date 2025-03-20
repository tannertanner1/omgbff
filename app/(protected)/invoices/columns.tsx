'use client'

import { format } from 'date-fns'
import type { ColumnDef } from '@tanstack/react-table'
import { Header } from '@/components/data-table/header'
import { Actions } from '@/components/data-table/actions'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { status, type Status } from '@/data/invoice-statuses'
import type { Invoice } from '@/lib/abac'

export function getColumns(
  userId: string,
  onEdit: (row: Invoice) => void,
  onDelete: (row: Invoice) => Promise<void>
): ColumnDef<Invoice>[] {
  return [
    {
      accessorKey: 'id',
      header: ({ column }) => <Header column={column} label='ID' />,
      cell: ({ row }) => row.getValue('id')
    },
    {
      accessorKey: 'customer.email',
      header: ({ column }) => <Header column={column} label='Email' />,
      cell: ({ row }) => row.original.customer.email
    },
    {
      accessorKey: 'customer',
      header: ({ column }) => <Header column={column} label='Customer' />,
      cell: ({ row }) => row.original.customer.name
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => <Header column={column} label='Amount' />,
      cell: ({ row }) => (
        <>
          $
          {(row.getValue('amount') as number).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </>
      )
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <Header column={column} label='Status' />,
      cell: ({ row }) => {
        const invoiceStatus = row.getValue('status') as Status
        return (
          <Badge
            className={cn('text-background', {
              [`bg-[${status[invoiceStatus]}]`]: true
            })}
          >
            {invoiceStatus.charAt(0).toUpperCase() + invoiceStatus.slice(1)}
          </Badge>
        )
      }
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <Header column={column} label='Created' />,
      cell: ({ row }) => {
        const dateValue = row.getValue('createdAt')
        return dateValue instanceof Date
          ? format(dateValue, 'MMM d, yyyy')
          : typeof dateValue === 'string'
            ? format(new Date(dateValue), 'MMM d, yyyy')
            : 'Invalid Date'
      }
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => <Header column={column} label='Updated' />,
      cell: ({ row }) => {
        const dateValue = row.getValue('updatedAt')
        return dateValue instanceof Date
          ? format(dateValue, 'MMM d, yyyy')
          : typeof dateValue === 'string'
            ? format(new Date(dateValue), 'MMM d, yyyy')
            : 'Invalid Date'
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Actions row={row.original} onEdit={onEdit} onDelete={onDelete} />
      )
    }
  ]
}
