'use client'

import { useRouter } from 'next/navigation'
import { Table } from '@/components/data-table/table'
import { getInvoiceColumns, type Invoice } from './columns'

export function Component({
  invoices,
  userId
}: {
  invoices: Invoice[]
  userId: string
}) {
  const router = useRouter()

  const handleEdit = (row: Invoice) => {
    router.push(`/${userId}/invoices/${row.id}/edit`)
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

  const columns = getInvoiceColumns(userId, handleEdit, handleDelete)

  return (
    <Table
      data={invoices}
      columns={columns}
      link={row =>
        `/${userId}/organizations/${row.organizationId}/invoices/${row.id}/edit`
      }
    />
  )
}
