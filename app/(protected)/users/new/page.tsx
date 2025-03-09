import { redirect } from 'next/navigation'
import { Form, type Field } from '@/components/form'
import { verifySession } from '@/lib/dal'
import { hasPermission } from '@/lib/abac'
import { createAction } from '../actions'
import { ROLES } from '@/data/system-roles'
import { getAllOrganizations } from '@/db/queries'
import { Empty } from '@/components/form/empty'

export default async function Page() {
  const user = await verifySession()

  if (!hasPermission(user, 'users', 'create')) {
    redirect('/users')
  }

  const organizations = await getAllOrganizations()
  if (organizations.length === 0) {
    return <Empty name='organization' form='/organizations/new' back='/users' />
  }

  const roles =
    user.role === 'owner'
      ? ROLES
      : user.role === 'admin'
        ? ['user', 'admin']
        : ['user']

  const fields: Field[] = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: false
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true
    },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      required: true,
      options: roles.map(role => ({
        label: role.charAt(0).toUpperCase() + role.slice(1),
        value: role
      })),
      defaultValue: 'user',
      disabled: user.role === 'user'
    },
    {
      name: 'organizationId',
      label: 'Organization',
      type: 'select',
      required: true,
      options: organizations.map(organization => ({
        label: organization.name,
        value: organization.id
      }))
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
