'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Header } from '@/components/data-table/header'
import { Actions } from '@/components/data-table/actions'
import { format } from 'date-fns'
import type { Organization } from '@/lib/abac'

export function getColumns(
  userId: string,
  onEdit: (row: Organization) => void,
  onDelete: (row: Organization) => Promise<void>
): ColumnDef<Organization>[] {
  return [
    {
      accessorKey: 'id',
      header: ({ column }) => <Header column={column} label='ID' />,
      cell: ({ row }) => row.getValue('id')
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <Header column={column} label='Name' />,
      cell: ({ row }) => row.getValue('name')
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => <Header column={column} label='Updated' />,
      cell: ({ row }) =>
        format(new Date(row.getValue('updatedAt')), 'MMM d, yyyy')
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <Header column={column} label='Created' />,
      cell: ({ row }) =>
        format(new Date(row.getValue('createdAt')), 'MMM d, yyyy')
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Actions row={row.original} onEdit={onEdit} onDelete={onDelete} />
      )
    }
  ]
}
