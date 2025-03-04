'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Header } from '@/components/data-table/header'
import { Actions } from '@/components/data-table/actions'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { role } from '@/data/system-roles'

export type User = {
  id: string
  name: string | null
  email: string
  emailVerified: Date | null
  image: string | null
  role: 'user' | 'admin' | 'owner'
  status: 'active' | 'pending' | 'inactive'
  organizationId: string | null
}

export function getUserColumns(
  currentUserId: string,
  organizationId: string,
  onEdit: (row: User) => Promise<void>,
  onDelete: (row: User) => Promise<void>
): ColumnDef<User>[] {
  return [
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
    {
      accessorKey: 'status',
      header: ({ column }) => <Header column={column} label='Status' />,
      cell: ({ row }) => {
        const status = row.getValue('status') as string
        return (
          <div className='px-4'>
            <Badge
              className={cn('text-background', {
                'bg-green-500': status === 'active',
                'bg-yellow-500': status === 'pending',
                'bg-red-500': status === 'inactive'
              })}
            >
              {status}
            </Badge>
          </div>
        )
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Actions
          row={row.original}
          onEdit={onEdit}
          onDelete={onDelete}
          // disableEdit={row.original.id === currentUserId}
          // disableDelete={row.original.id === currentUserId}
        />
      )
    }
  ]
}
