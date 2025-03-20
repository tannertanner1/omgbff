'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { IconCirclePlus } from '@tabler/icons-react'
import { Table } from '@/components/data-table/table'
import { deleteAction } from './actions'
import { getUserColumns } from './columns'
import type { User } from '@/lib/abac'

export function Users({
  users,
  organizationId,
  userId
}: {
  users: User[]
  organizationId: string
  userId: string
}) {
  const router = useRouter()

  const handleEdit = async (row: User) => {
    router.push(`/organizations/${organizationId}/users/${row.id}/edit`)
  }

  const handleDelete = async (row: User) => {
    if (
      !confirm(
        'Are you sure you want to remove this user from the organization?'
      )
    ) {
      return
    }

    const formData = new FormData()
    formData.append('id', row.id)
    formData.append('organizationId', organizationId)

    try {
      const result = await deleteAction(null, formData)
      if (result.success) {
        router.refresh()
      } else {
        alert(result.message || 'Failed to remove user from organization')
      }
    } catch (error) {
      console.error('Failed to remove:', error)
      alert('Failed to remove user from organization')
    }
  }

  const columns = getUserColumns(
    userId,
    organizationId,
    handleEdit,
    handleDelete
  )

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>Users</h2>
        <Link href={`/organizations/${organizationId}/users/new`}>
          <IconCirclePlus className='h-6 w-6 text-muted-foreground transition-colors hover:text-primary' />
        </Link>
      </div>
      <Table
        data={users}
        columns={columns}
        link={row => `/organizations/${organizationId}/users/${row.id}/edit`}
      />
    </div>
  )
}
