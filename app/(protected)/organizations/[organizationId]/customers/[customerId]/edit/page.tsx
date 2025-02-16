import { notFound } from 'next/navigation'
import { Form, type Field } from '@/components/form'
import { getCustomerById } from '@/db/queries'
import { updateAction } from '../../actions'

export default async function Page({
  params
}: {
  params: Promise<{ organizationId: string; customerId: string }>
}) {
  const { organizationId, customerId } = await params
  const customer = await getCustomerById({ customerId })

  if (!customer) return notFound()

  const fields: Field[] = [
    {
      name: 'organizationId',
      type: 'hidden' as const,
      defaultValue: organizationId
    },
    {
      name: 'id',
      type: 'hidden' as const,
      defaultValue: customer.id
    },
    {
      name: 'name',
      label: 'Name',
      type: 'text' as const,
      required: true,
      defaultValue: customer.name
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email' as const,
      required: true,
      defaultValue: customer.email
    }
  ]

  return <Form fields={fields} action={updateAction} button='Update' />
}
