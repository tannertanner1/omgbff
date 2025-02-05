import { Form } from '@/components/form'
import { updateAction } from '../../actions'
import { getInvoiceById, getOrganizationCustomers } from '@/db/queries'
import { notFound } from 'next/navigation'
import { STATUSES } from '@/data/invoice-statuses'

export default async function Page({
  params
}: {
  params: { userId: string; organizationId: string; invoiceId: string }
}) {
  const [invoice, customers] = await Promise.all([
    getInvoiceById(params.invoiceId),
    getOrganizationCustomers(params.organizationId)
  ])

  if (!invoice) {
    notFound()
  }

  const fields = [
    {
      name: 'description',
      label: 'Description',
      type: 'text' as const,
      required: true,
      defaultValue: invoice.description
    },
    {
      name: 'value',
      label: 'Value',
      type: 'number' as const,
      required: true,
      defaultValue: invoice.value.toString()
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select' as const,
      required: true,
      options: STATUSES.map(status => ({
        label: status.label,
        value: status.id
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
        value: customer.id.toString()
      })),
      defaultValue: invoice.customerId.toString()
    },
    {
      name: 'id',
      type: 'hidden' as const,
      defaultValue: invoice.id.toString()
    },
    {
      name: 'organizationId',
      type: 'hidden' as const,
      defaultValue: params.organizationId
    }
  ]

  return <Form fields={fields} action={updateAction} button='Update' />
}
