import { notFound } from 'next/navigation'
import { Form, type Field } from '@/components/form'
import { STATUSES } from '@/data/invoice-statuses'
import { getOrganizationCustomers } from '@/db/queries'
import { createAction } from '../actions'

export default async function Page({
  params
}: {
  params: Promise<{ userId: string; organizationId: string }>
}) {
  const { userId, organizationId } = await params
  const customers = await getOrganizationCustomers(organizationId)

  if (!customers) return notFound()

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
      }))
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
      name: 'value',
      label: 'Value',
      type: 'number',
      required: true
    }
  ]

  return <Form fields={fields} action={createAction} button='Create' />
}
