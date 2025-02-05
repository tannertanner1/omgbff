import { Form } from '@/components/form'
import { updateAction } from '../../actions'
import { getCustomerById } from '@/db/queries'
import { notFound } from 'next/navigation'

export default async function Page({
  params
}: {
  params: { userId: string; organizationId: string; customerId: string }
}) {
  const customer = await getCustomerById(params.customerId)

  if (!customer) {
    notFound()
  }

  const fields = [
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
    },
    {
      name: 'id',
      type: 'hidden' as const,
      defaultValue: customer.id.toString()
    },
    {
      name: 'organizationId',
      type: 'hidden' as const,
      defaultValue: params.organizationId
    }
  ]

  return <Form fields={fields} action={updateAction} button='Update' />
}
