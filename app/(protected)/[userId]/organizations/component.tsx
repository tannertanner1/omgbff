'use client'

import Link from 'next/link'
import { Table } from '@/components/data-table/table'
import { IconCirclePlus } from '@tabler/icons-react'
import { getColumns, type Organization } from './columns'
import { useRouter } from 'next/navigation'
import { deleteAction } from './actions'

export function Component({
  organizations,
  userId
}: {
  organizations: Organization[]
  userId: string
}) {
  const router = useRouter()

  const handleEdit = (row: Organization) => {
    router.push(`/${userId}/organizations/${row.id}/edit`)
  }

  const handleDelete = async (row: Organization) => {
    if (!confirm('Are you sure you want to delete this organization?')) {
      return
    }

    const formData = new FormData()
    formData.append('id', row.id)

    try {
      const result = await deleteAction(null, formData)
      if (result.success) {
        router.refresh()
      } else {
        alert(result.message || 'Failed to delete organization')
      }
    } catch (error) {
      console.error('Failed to delete:', error)
      alert('Failed to delete organization')
    }
  }

  const columns = getColumns(userId, handleEdit, handleDelete)

  return (
    <div className='min-h-screen'>
      <div className='mx-auto max-w-5xl p-4'>
        <div className='mb-6 flex items-center justify-between'>
          <h1 className='text-2xl font-semibold'>Organizations</h1>
          <Link href={`/${userId}/organizations/new`}>
            <IconCirclePlus className='h-6 w-6 text-muted-foreground transition-colors hover:text-primary' />
          </Link>
        </div>
        <Table
          data={organizations}
          columns={columns}
          link={row => `/${userId}/organizations/${row.id}`}
        />
      </div>
    </div>
  )
}
