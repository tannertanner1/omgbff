'use client'

import { format } from 'date-fns'
import type { ColumnDef } from '@tanstack/react-table'
import { Header } from '@/components/data-table/header'
import { Actions } from '@/components/data-table/actions'
import { STATUSES, type Status } from '@/data/invoice-statuses'

export type Invoice = {
  id: number
  customerId: number
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
        const status = row.getValue('status') as Status || 'open'
        const statusInfo = STATUSES.find(s => s.id === status)

        if (!statusInfo) {
          console.error('Missing status definition for:', status)
          return <div className='px-4'>Unknown Status</div>
        }

        return (
          <div className='px-4'>
            <span
              className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${statusInfo.color}`}
            >
              {statusInfo.label}
            </span>
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
