import { notFound } from 'next/navigation'
import { Form, type Field } from '@/components/form'
import { STATUSES } from '@/data/invoice-statuses'
import { getOrganizationCustomers } from '@/db/queries'
import { verifySession } from '@/lib/dal'
import { createAction } from '../actions'
import { Empty } from '@/components/form/empty'

export default async function Page({
  params
}: {
  params: Promise<{ organizationId: string }>
}) {
  const { organizationId } = await params
  const customers = await getOrganizationCustomers({ organizationId })
  if (!customers) return notFound()

  const user = await verifySession()
  const hasAccess = user.role === 'admin' || user.role === 'owner'

  if (customers.length === 0) {
    return (
      <Empty
        name='customer'
        form={`/organizations/${organizationId}/customers/new`}
        back={`/organizations/${organizationId}`}
      />
    )
  }

  const fields: Field[] = [
    {
      name: 'organizationId',
      type: 'hidden',
      defaultValue: organizationId
    },
    {
      name: 'description',
      label: 'Description',
      type: 'text'
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      defaultValue: 'open',
      options: STATUSES.map(status => ({
        label: status.charAt(0).toUpperCase() + status.slice(1),
        value: status
      })),
      disabled: !hasAccess
    },
    {
      name: 'customerId',
      label: 'Customer',
      type: 'select',
      required: true,
      options: customers.map(customer => ({
        label: customer.name,
        value: customer.id
      }))
    },
    {
      name: 'amount',
      label: 'Amount',
      type: 'currency',
      required: true,
      step: '0.01'
    }
  ]

  return (
    <Form
      fields={fields}
      action={createAction}
      button='Create'
      data={{ status: 'open' }}
    />
  )
}
