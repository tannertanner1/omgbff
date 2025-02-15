'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { IconCirclePlus } from '@tabler/icons-react'
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
    <div className='h-fit'>
      <div className='mx-auto max-w-5xl p-4'>
        <div className='-mt-3 mb-2 flex items-center justify-between'>
          <h1 className='text-2xl font-semibold'>Customers</h1>
          <Link href={`/${userId}/customers/new`}>
            <IconCirclePlus className='h-6 w-6 text-muted-foreground transition-colors hover:text-primary' />
          </Link>
        </div>
        <Table
          data={customers}
          columns={columns}
          link={row =>
            `/${userId}/organizations/${row.organizationId}/customers/${row.id}/edit`
          }
        />
      </div>
    </div>
  )
}
