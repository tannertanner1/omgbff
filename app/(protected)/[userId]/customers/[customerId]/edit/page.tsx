import { notFound, redirect } from 'next/navigation'
import { Form, type Field } from '@/components/form'
import { getCustomerById, getAllOrganizations } from '@/db/queries'
import { updateAction } from '../../actions'
import { verifySession } from '@/lib/dal'
import { hasPermission } from '@/lib/abac'

export default async function Page({
  params
}: {
  params: Promise<{ userId: string; customerId: string }>
}) {
  const user = await verifySession()
  const { userId, customerId } = await params

  if (!hasPermission(user, 'customers', 'update')) {
    redirect(`/${user.id}/customers`)
  }

  if (user.id !== userId) {
    redirect(`/${user.id}/customers/${customerId}/edit`)
  }

  const [customer, organizations] = await Promise.all([
    getCustomerById({ customerId }),
    getAllOrganizations()
  ])

  if (!customer) return notFound()

  const fields: Field[] = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      defaultValue: customer.name
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      defaultValue: customer.email
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
      defaultValue: customer.organizationId
    },
    {
      name: 'id',
      type: 'hidden',
      defaultValue: customer.id
    }
  ]

  return <Form fields={fields} action={updateAction} button='Update' />
}
