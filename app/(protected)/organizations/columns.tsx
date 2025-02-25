'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Header } from '@/components/data-table/header'
import { Actions } from '@/components/data-table/actions'
import { format } from 'date-fns'

export type Organization = {
  userId: string
  id: string
  organizationId: string
  name: string
  createdAt: Date | string
  updatedAt: Date | string
}

export function getColumns(
  userId: string,
  onEdit: (row: Organization) => void,
  onDelete: (row: Organization) => Promise<void>
): ColumnDef<Organization>[] {
  return [
    {
      accessorKey: 'id',
      header: ({ column }) => <Header column={column} label='ID' />,
      cell: ({ row }) => (
        <div className='whitespace-nowrap px-4'>{row.getValue('id')}</div>
      )
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <Header column={column} label='Name' />,
      cell: ({ row }) => (
        <div className='whitespace-nowrap px-4'>{row.getValue('name')}</div>
      )
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <Header column={column} label='Created' />,
      cell: ({ row }) => (
        <div className='whitespace-nowrap px-4'>
          {format(new Date(row.getValue('createdAt')), 'MMM d, yyyy')}
        </div>
      )
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => <Header column={column} label='Updated' />,
      cell: ({ row }) => (
        <div className='whitespace-nowrap px-4'>
          {format(new Date(row.getValue('updatedAt')), 'MMM d, yyyy')}
        </div>
      )
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Actions row={row.original} onEdit={onEdit} onDelete={onDelete} />
      )
    }
  ]
}
