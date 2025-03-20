'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { IconCirclePlus } from '@tabler/icons-react'
import { Table } from '@/components/data-table/table'
import { getColumns } from './columns'
import type { Invoice } from '@/lib/abac.ts'

export function Component({
  invoices,
  userId
}: {
  invoices: Invoice[]
  userId: string
}) {
  const router = useRouter()

  const handleEdit = (row: Invoice) => {
    router.push(`/invoices/${row.id}/edit`)
  }

  const handleDelete = async (row: Invoice) => {
    if (!confirm('Are you sure you want to delete this invoice?')) {
      return
    }

    const formData = new FormData()
    formData.append('id', row.id)

    try {
      const response = await fetch(`/api/invoices/${row.id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        router.refresh()
      } else {
        alert('Failed to delete invoice')
      }
    } catch (error) {
      console.error('Failed to delete:', error)
      alert('Failed to delete invoice')
    }
  }

  const columns = getColumns(userId, handleEdit, handleDelete)

  return (
    <div className='h-fit'>
      <div className='mx-auto max-w-5xl p-4'>
        <div className='-mt-3 mb-2 flex items-center justify-between'>
          <h1 className='text-2xl font-semibold'>Invoices</h1>
          <Link href={'/invoices/new'}>
            <IconCirclePlus className='h-6 w-6 text-muted-foreground transition-colors hover:text-primary' />
          </Link>
        </div>
        <Table
          data={invoices}
          columns={columns}
          link={row =>
            `/organizations/${row.organizationId}/invoices/${row.id}/edit`
          }
        />
      </div>
    </div>
  )
}
