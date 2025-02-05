import { Form, type Field } from '@/components/form'
import { createAction } from '../actions'
import { STATUSES } from '@/data/invoice-statuses'
import { getOrganizationCustomers } from '@/db/queries'

export default async function Page({
  params
}: {
  params: { userId: string; organizationId: string }
}) {
  const customers = await getOrganizationCustomers(params.organizationId)

  const fields: Field[] = [
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      required: true
    },
    {
      name: 'value',
      label: 'Value',
      type: 'number',
      required: true
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: STATUSES.map(status => ({
        label: status.label,
        value: status.id
      }))
    },
    {
      name: 'customerId',
      label: 'Customer',
      type: 'select',
      required: true,
      options: customers.map(customer => ({
        label: customer.name,
        value: customer.id.toString()
      }))
    },
    {
      name: 'organizationId',
      type: 'hidden',
      defaultValue: params.organizationId
    }
  ]

  return <Form fields={fields} action={createAction} button='Create' />
}
