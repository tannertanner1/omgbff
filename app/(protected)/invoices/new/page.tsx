import { Form, type Field } from '@/components/form'
import { STATUSES } from '@/data/invoice-statuses'
import { verifySession } from '@/lib/dal'
import { getAllOrganizations, getAllCustomers } from '@/db/queries'
import { createAction } from '../actions'
import { Empty } from '@/components/form/empty'

export default async function Page({
  searchParams
}: {
  searchParams: { organizationId?: string }
}) {
  const user = await verifySession()
  const { organizationId } = searchParams
  const [organizations, customers] = await Promise.all([
    getAllOrganizations(),
    getAllCustomers()
  ])

  if (organizations.length === 0) {
    return (
      <Empty name='organization' form='/organizations/new' back='/invoices' />
    )
  }

  if (customers.length === 0) {
    return <Empty name='customer' form='/customers/new' back='/invoices' />
  }

  const hasAccess = user.role === 'admin' || user.role === 'owner'
  const selectedOrganizationId = organizationId || organizations[0].id

  const filteredCustomers = selectedOrganizationId
    ? customers.filter(
        customer => customer.organizationId === selectedOrganizationId
      )
    : customers

  const fields: Field[] = [
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
      name: 'organizationId',
      label: 'Organization',
      type: 'select',
      required: true,
      options: organizations.map(org => ({
        label: org.name,
        value: org.id
      })),
      defaultValue: selectedOrganizationId
    },
    {
      name: 'customerId',
      label: 'Customer',
      type: 'select',
      required: true,
      options: filteredCustomers.map(customer => ({
        label: customer.name,
        value: customer.id
      })),
      disabled: !selectedOrganizationId
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
