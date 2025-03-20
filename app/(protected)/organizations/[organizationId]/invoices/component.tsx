'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { IconCirclePlus, IconMoodEmpty } from '@tabler/icons-react'
import { Table } from '@/components/data-table/table'
import { deleteAction } from './actions'
import { getInvoiceColumns } from './columns'
import type { Invoice } from '@/lib/abac'

export function Invoices({
  invoices,
  organizationId,
  userId
}: {
  invoices: Invoice[]
  organizationId: string
  userId: string
}) {
  const router = useRouter()

  const handleEdit = (row: Invoice) => {
    router.push(`/organizations/${organizationId}/invoices/${row.id}/edit`)
  }

  const handleDelete = async (row: Invoice) => {
    if (!confirm('Are you sure you want to delete this invoice?')) {
      return
    }

    const formData = new FormData()
    formData.append('organizationId', organizationId)
    formData.append('id', row.id.toString())

    try {
      const result = await deleteAction(null, formData)
      if (result.success) {
        router.refresh()
      } else {
        alert(result.message || 'Failed to delete invoice')
      }
    } catch (error) {
      console.error('Failed to delete:', error)
      alert('Failed to delete invoice')
    }
  }

  const columns = getInvoiceColumns(organizationId, handleEdit, handleDelete)

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>Invoices</h2>
        <Link href={`/organizations/${organizationId}/invoices/new`}>
          <IconCirclePlus className='h-6 w-6 text-muted-foreground transition-colors hover:text-primary' />
        </Link>
      </div>
      {/* {invoices && invoices.length > 0 ? (
        <Table
          data={invoices}
          columns={columns}
          link={row =>
            `/organizations/${organizationId}/invoices/${row.id}/edit`
          }
        />
      ) : (
        <div className='flex items-center justify-center text-muted-foreground'>
          <IconMoodEmpty className='h-10 w-10' />
        </div>
      )} */}
      <Table
        data={invoices}
        columns={columns}
        link={row => `/organizations/${organizationId}/invoices/${row.id}/edit`}
      />
    </div>
  )
}
