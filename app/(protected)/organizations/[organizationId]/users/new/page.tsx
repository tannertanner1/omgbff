import { redirect } from 'next/navigation'
import { Form, type Field } from '@/components/form'
import { verifySession } from '@/lib/dal'
import { hasPermission } from '@/lib/abac'
import { createAction } from '../actions'
import { ROLES } from '@/data/system-roles'

export default async function Page({
  params
}: {
  params: Promise<{ organizationId: string }>
}) {
  const user = await verifySession()
  const { organizationId } = await params

  if (!hasPermission(user, 'users', 'create')) {
    redirect(`/organizations/${organizationId}/users`)
  }

  const hasAccess = user.role === 'admin' || user.role === 'owner'

  const fields: Field[] = [
    {
      name: 'organizationId',
      type: 'hidden',
      defaultValue: organizationId
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true
    },
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true
    },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      required: true,
      options: ROLES.map(role => ({
        label: role.charAt(0).toUpperCase() + role.slice(1),
        value: role
      })),
      disabled: !hasAccess
    }
  ]

  return (
    <Form
      fields={fields}
      action={createAction}
      button='Invite'
      data={{ status: 'pending' }}
    />
  )
}
