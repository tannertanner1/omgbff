import { redirect } from 'next/navigation'
import { Form, type Field } from '@/components/form'
import { createAction } from '../actions'
import { verifySession } from '@/lib/dal'
import { hasPermission } from '@/lib/abac'
import { getAllOrganizations } from '@/db/queries'

export default async function Page() {
  const user = await verifySession()

  if (!hasPermission(user, 'customers', 'create')) {
    redirect('/customers')
  }

  const organizations = await getAllOrganizations()

  const fields: Field[] = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true
    },
    {
      name: 'organizationId',
      label: 'Organization',
      type: 'select',
      required: true,
      options: organizations.map(org => ({
        label: org.name,
        value: org.id
      }))
    }
  ]

  return <Form fields={fields} action={createAction} button='Create' />
}
