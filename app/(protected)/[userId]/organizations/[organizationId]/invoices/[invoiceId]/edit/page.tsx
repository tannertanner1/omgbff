import { notFound } from 'next/navigation'
import { Form, type Field } from '@/components/form'
import { STATUSES } from '@/data/invoice-statuses'
import { updateAction } from '../../actions'
import { getInvoiceById, getOrganizationCustomers } from '@/db/queries'
import { verifySession } from '@/lib/dal'

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

  const user = await verifySession()
  const hasAccess = user.role === 'admin' || user.role === 'owner'

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
      required: hasAccess, // Only required if user has access
      options: STATUSES.map(status => ({
        label: status.charAt(0).toUpperCase() + status.slice(1),
        value: status
      })),
      defaultValue: invoice.status,
      disabled: !hasAccess
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
      label: 'Amount',
      type: 'currency',
      required: true,
      defaultValue: invoice.value.toFixed(2)
    }
  ]

  return (
    <Form
      fields={fields}
      action={updateAction}
      button='Update'
      data={{ status: invoice.status }}
    />
  )
}
