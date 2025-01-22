'use client'

import Link from 'next/link'
import type { ColumnDef } from '@tanstack/react-table'
import { formatDistanceToNow } from 'date-fns'

// Define the type for our organization data
type Organization = {
  id: string
  name: string
  createdAt: Date
  userId: string
}

export const columns: ColumnDef<Organization>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <Link
        href={`/${row.original.userId}/organizations/${row.original.id}`}
        className='hover:underline'
      >
        {row.getValue('name')}
      </Link>
    )
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) =>
      formatDistanceToNow(new Date(row.getValue('createdAt')), {
        addSuffix: true
      })
  }
]
