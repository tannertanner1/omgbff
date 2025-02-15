import { Form, type Field } from '@/components/form'
import { createAction } from '../actions'
import { ROLES } from '@/data/system-roles'

export default function Page() {
  const fields: Field[] = [
    {
      name: 'email',
      label: 'Email',
      type: 'email' as const,
      required: true
    },
    {
      name: 'role',
      label: 'Role',
      type: 'select' as const,
      required: true,
      options: ROLES.map(role => ({
        label: role.charAt(0).toUpperCase() + role.slice(1),
        value: role
      }))
    }
  ]

  return <Form fields={fields} action={createAction} button='Create' />
}
