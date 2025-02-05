'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Header } from '@/components/data-table/header'
import { Actions } from '@/components/data-table/actions'
import { format } from 'date-fns'

export type Customer = {
  id: number
  organizationId: string
  userId: string
  email: string
  name: string
  createdAt: string | Date
  updatedAt: string | Date
}

export function getCustomerColumns(
  userId: string,
  organizationId: string,
  onEdit: (row: Customer) => void,
  onDelete: (row: Customer) => Promise<void>
): ColumnDef<Customer>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => <Header column={column} label='Name' />,
      cell: ({ row }) => <div className='px-4'>{row.getValue('name')}</div>
    },
    {
      accessorKey: 'email',
      header: ({ column }) => <Header column={column} label='Email' />,
      cell: ({ row }) => <div className='px-4'>{row.getValue('email')}</div>
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
