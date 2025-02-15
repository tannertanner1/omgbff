'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { IconCirclePlus } from '@tabler/icons-react'
import { Table } from '@/components/data-table/table'
import { getUserColumns, type User } from './columns'

export function Component({
  users,
  userId
}: {
  users: User[]
  userId: string
}) {
  const router = useRouter()

  const handleEdit = (row: User) => {
    router.push(`/users/${row.id}/edit`)
  }

  const handleDelete = async (row: User) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return
    }

    const formData = new FormData()
    formData.append('id', row.id)

    try {
      const response = await fetch(`/api/users/${row.id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        router.refresh()
      } else {
        alert('Failed to delete user')
      }
    } catch (error) {
      console.error('Failed to delete:', error)
      alert('Failed to delete user')
    }
  }

  const columns = getUserColumns(userId, handleEdit, handleDelete)

  return (
    <div className='flex h-fit'>
      <div className='mx-auto w-full max-w-5xl p-4'>
        <div className='mb-8 flex items-center justify-between'>
          <h1 className='text-2xl font-semibold'>Users</h1>
          <Link href={`/users/new`}>
            <IconCirclePlus className='h-6 w-6 text-muted-foreground transition-colors hover:text-primary' />
          </Link>
        </div>
        <Table
          data={users}
          columns={columns}
          link={row => `/users/${row.id}/edit`}
        />
      </div>
    </div>
  )
}
