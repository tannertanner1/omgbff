'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Header } from '@/components/data-table/header'
import { Actions } from '@/components/data-table/actions'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { role } from '@/data/system-roles'

export type User = {
  id: string
  email: string
  name: string | null
  role: string
  emailVerified: string | Date | null
  createdAt: string | Date
  updatedAt: string | Date
}

export function getUserColumns(
  userId: string,
  onEdit: (row: User) => void,
  onDelete: (row: User) => Promise<void>
): ColumnDef<User>[] {
  return [
    {
      accessorKey: 'id',
      header: ({ column }) => <Header column={column} label='ID' />,
      cell: ({ row }) => (
        <div className='whitespace-nowrap px-4'>{row.getValue('id')}</div>
      )
    },
    {
      accessorKey: 'email',
      header: ({ column }) => <Header column={column} label='Email' />,
      cell: ({ row }) => (
        <div className='whitespace-nowrap px-4'>{row.getValue('email')}</div>
      )
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <Header column={column} label='Name' />,
      cell: ({ row }) => (
        <div className='whitespace-nowrap px-4'>
          {row.getValue('name') || ''}
        </div>
      )
    },
    {
      accessorKey: 'role',
      header: ({ column }) => <Header column={column} label='Role' />,
      cell: ({ row }) => {
        const userRole = row.getValue('role') as keyof typeof role
        return (
          <div className='px-4'>
            <Badge
              className={cn('text-background', {
                'bg-[#9AA0A6]': userRole === 'owner',
                'bg-[#FBBC04]': userRole === 'admin',
                'bg-[#4285F4]': userRole === 'user'
              })}
            >
              {role[userRole].label}
            </Badge>
          </div>
        )
      }
    },
    // {
    //   accessorKey: 'emailVerified',
    //   header: ({ column }) => <Header column={column} label='Verified' />,
    //   cell: ({ row }) => {
    //     const dateValue = row.getValue('emailVerified')
    //     return (
    //       <div className='whitespace-nowrap px-4'>
    //         {dateValue
    //           ? dateValue instanceof Date
    //             ? format(dateValue, 'MMM d, yyyy')
    //             : typeof dateValue === 'string'
    //               ? format(new Date(dateValue), 'MMM d, yyyy')
    //               : 'Invalid Date'
    //           : 'Not verified'}
    //       </div>
    //     )
    //   }
    // },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <Header column={column} label='Created' />,
      cell: ({ row }) => {
        const dateValue = row.getValue('createdAt')
        return (
          <div className='whitespace-nowrap px-4'>
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
          <div className='whitespace-nowrap px-4'>
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
