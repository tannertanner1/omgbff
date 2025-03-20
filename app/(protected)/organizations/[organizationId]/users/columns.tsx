'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Header } from '@/components/data-table/header'
import { Actions } from '@/components/data-table/actions'
import { format } from 'date-fns'
import type { User } from '@/lib/abac'

export function getUserColumns(
  userId: string,
  organizationId: string,
  onEdit: (row: User) => Promise<void>,
  onDelete: (row: User) => Promise<void>
): ColumnDef<User>[] {
  return [
    {
      accessorKey: 'id',
      header: ({ column }) => <Header column={column} label='ID' />,
      cell: ({ row }) => row.getValue('id')
    },
    {
      accessorKey: 'email',
      header: ({ column }) => <Header column={column} label='Email' />,
      cell: ({ row }) => row.getValue('email')
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <Header column={column} label='Name' />,
      cell: ({ row }) => row.getValue('name') || ''
    },
    // Removed 'role' column as per requirements
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
        // If updatedAt is null (for invited users who haven't accepted), show blank
        if (!dateValue) return ''

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
