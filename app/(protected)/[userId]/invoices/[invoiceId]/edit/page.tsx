import { notFound, redirect } from 'next/navigation'
import { Form, type Field } from '@/components/form'
import {
  getInvoiceById,
  getAllOrganizations,
  getAllCustomers
} from '@/db/queries'
import { updateAction } from '../../actions'
import { verifySession } from '@/lib/dal'
import { hasPermission } from '@/lib/abac'
import { STATUSES } from '@/data/invoice-statuses'

export default async function Page({
  params
}: {
  params: Promise<{ userId: string; invoiceId: string }>
}) {
  const user = await verifySession()
  const { userId, invoiceId } = await params

  if (!hasPermission(user, 'invoices', 'update')) {
    redirect(`/${user.id}/invoices`)
  }

  if (user.id !== userId) {
    redirect(`/${user.id}/invoices/${invoiceId}/edit`)
  }

  const [invoice, organizations, customers] = await Promise.all([
    getInvoiceById({ invoiceId }),
    getAllOrganizations(),
    getAllCustomers()
  ])

  if (!invoice) return notFound()

  const fields: Field[] = [
    {
      name: 'customerId',
      label: 'Customer',
      type: 'select',
      required: true,
      options: customers.map(customer => ({
        label: `${customer.name} (${customer.email})`,
        value: customer.id
      })),
      defaultValue: invoice.customerId
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
      defaultValue: invoice.organizationId
    },
    {
      name: 'amount',
      label: 'Amount',
      type: 'currency',
      required: true,
      defaultValue: invoice.amount.toFixed(2)
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: STATUSES.map(status => ({
        label: status.charAt(0).toUpperCase() + status.slice(1),
        value: status
      })),
      defaultValue: invoice.status
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      defaultValue: invoice.description || ''
    },
    {
      name: 'id',
      type: 'hidden',
      defaultValue: invoice.id
    }
  ]

  return <Form fields={fields} action={updateAction} button='Update' />
}
