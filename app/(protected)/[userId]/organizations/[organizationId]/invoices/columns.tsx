'use client'

import { format } from 'date-fns'
import type { ColumnDef } from '@tanstack/react-table'
import { Header } from '@/components/data-table/header'
import { Actions } from '@/components/data-table/actions'
import { type Status, status } from '@/data/invoice-statuses'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type Invoice = {
  id: string
  customerId: string
  userId: string
  value: number
  description: string | null
  status: Status
  createdAt: string | Date
  updatedAt: string | Date
}

export function getInvoiceColumns(
  userId: string,
  organizationId: string,
  onEdit: (row: Invoice) => void,
  onDelete: (row: Invoice) => Promise<void>
): ColumnDef<Invoice>[] {
  return [
    {
      accessorKey: 'description',
      header: ({ column }) => <Header column={column} label='Description' />,
      cell: ({ row }) => (
        <div className='px-4'>{row.getValue('description')}</div>
      )
    },
    {
      accessorKey: 'value',
      header: ({ column }) => <Header column={column} label='Value' />,
      cell: ({ row }) => (
        <div className='px-4'>
          ${(row.getValue('value') as number).toFixed(2)}
        </div>
      )
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <Header column={column} label='Status' />,
      cell: ({ row }) => {
        const invoiceStatus = row.getValue('status') as Status
        return (
          <div className='px-4'>
            <Badge
              className={cn('text-background', {
                'bg-[#4285F4]': invoiceStatus === 'open',
                'bg-[#0F9D58]': invoiceStatus === 'paid',
                'bg-[#F4B400]': invoiceStatus === 'void',
                'bg-[#DB4437]': invoiceStatus === 'uncollectible'
              })}
            >
              {invoiceStatus.charAt(0).toUpperCase() + invoiceStatus.slice(1)}
            </Badge>
          </div>
        )
      }
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <Header column={column} label='Created' />,
      cell: ({ row }) => {
        const dateValue = row.getValue('createdAt')
        return (
          <div className='px-4'>
            {dateValue instanceof Date
              ? format(dateValue, 'MMM d, yyyy')
              : typeof dateValue === 'string'
                ? format(new Date(dateValue), 'MMM d, yyyy')
                : 'Invalid Date'}
          </div>
        )
      }
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => <Header column={column} label='Updated' />,
      cell: ({ row }) => {
        const dateValue = row.getValue('updatedAt')
        return (
          <div className='px-4'>
            {dateValue instanceof Date
              ? format(dateValue, 'MMM d, yyyy')
              : typeof dateValue === 'string'
                ? format(new Date(dateValue), 'MMM d, yyyy')
                : 'Invalid Date'}
          </div>
        )
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
