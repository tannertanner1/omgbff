import { notFound } from 'next/navigation'
import { Form, type Field } from '@/components/form'
import { updateAction } from '../../actions'
import { ROLES } from '@/data/system-roles'
import { verifySession } from '@/lib/dal'

export default async function Page() {
  const user = await verifySession()
  if (!user) return notFound()

  const hasAccess = user.role === 'admin' || user.role === 'owner'

  const fields: Field[] = [
    {
      name: 'email',
      label: 'Email',
      type: 'email' as const,
      required: true,
      defaultValue: user.email || ''
    },
    {
      name: 'role',
      label: 'Role',
      type: 'select' as const,
      required: true,
      options: ROLES.map(role => ({
        label: role.charAt(0).toUpperCase() + role.slice(1),
        value: role
      })),
      defaultValue: user.role || '',
      disabled: !hasAccess
    },
    {
      name: 'id',
      type: 'hidden' as const,
      defaultValue: user.id
    }
  ]

  return (
    <Form
      fields={fields}
      action={updateAction}
      button='Save'
      data={{
        id: user.id,
        email: user.email || '',
        role: user.role
      }}
    />
  )
}
