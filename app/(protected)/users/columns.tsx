'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Header } from '@/components/data-table/header'
import { Actions } from '@/components/data-table/actions'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { role } from '@/data/system-roles'
import type { User } from '@/lib/abac'

export function getColumns(
  userId: string,
  onEdit: (row: User) => void,
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
    {
      accessorKey: 'role',
      header: ({ column }) => <Header column={column} label='Role' />,
      cell: ({ row }) => {
        const userRole = row.getValue('role') as keyof typeof role
        return (
          <Badge
            className='text-background'
            style={{ backgroundColor: role[userRole].color }}
          >
            {role[userRole].label}
          </Badge>
        )
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
      accessorKey: 'invitedBy',
      header: ({ column }) => <Header column={column} label='Invited' />,
      cell: ({ row }) => {
        const user = row.original
        return (user as any).invitedBy || ''
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
