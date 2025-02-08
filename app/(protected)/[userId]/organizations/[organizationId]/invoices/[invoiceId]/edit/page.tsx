import { notFound } from 'next/navigation'
import { Form, type Field } from '@/components/form'
import { STATUSES } from '@/data/invoice-statuses'
import { updateAction } from '../../actions'
import { getInvoiceById, getOrganizationCustomers } from '@/db/queries'

export default async function Page({
  params
}: {
  params: Promise<{ userId: string; organizationId: string; invoiceId: string }>
}) {
  const { userId, organizationId, invoiceId } = await params
  const [invoice, customers] = await Promise.all([
    getInvoiceById({ invoiceId }),
    getOrganizationCustomers(organizationId)
  ])

  if (!invoice) return notFound()

  const fields: Field[] = [
    {
      name: 'organizationId',
      type: 'hidden' as const,
      defaultValue: organizationId
    },
    {
      name: 'id',
      type: 'hidden' as const,
      defaultValue: invoice.id
    },
    {
      name: 'description',
      label: 'Description',
      type: 'text' as const,
      defaultValue: invoice.description || ''
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select' as const,
      required: true,
      options: STATUSES.map(status => ({
        label: status.charAt(0).toUpperCase() + status.slice(1),
        value: status
      })),
      defaultValue: invoice.status
    },
    {
      name: 'customerId',
      label: 'Customer',
      type: 'select' as const,
      required: true,
      options: customers.map(customer => ({
        label: customer.name,
        value: customer.id
      })),
      defaultValue: invoice.customerId
    },
    {
      name: 'value',
      label: 'Value',
      type: 'number' as const,
      required: true,
      defaultValue: invoice.value.toString()
    }
  ]

  return <Form fields={fields} action={updateAction} button='Update' />
}
