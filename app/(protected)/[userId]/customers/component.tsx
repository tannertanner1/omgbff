'use client'

import { useRouter } from 'next/navigation'
import { Table } from '@/components/data-table/table'
import { getCustomerColumns, type Customer } from './columns'

export function Component({
  customers,
  userId
}: {
  customers: Customer[]
  userId: string
}) {
  const router = useRouter()

  const handleEdit = (row: Customer) => {
    router.push(`/${userId}/customers/${row.id}/edit`)
  }

  const handleDelete = async (row: Customer) => {
    if (!confirm('Are you sure you want to delete this customer?')) {
      return
    }

    const formData = new FormData()
    formData.append('id', row.id)

    try {
      const response = await fetch(`/api/customers/${row.id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        router.refresh()
      } else {
        alert('Failed to delete customer')
      }
    } catch (error) {
      console.error('Failed to delete:', error)
      alert('Failed to delete customer')
    }
  }

  const columns = getCustomerColumns(userId, handleEdit, handleDelete)

  return (
    <Table
      data={customers}
      columns={columns}
      link={row =>
        `/${userId}/organizations/${row.organizationId}/customers/${row.id}/edit`
      }
    />
  )
}
