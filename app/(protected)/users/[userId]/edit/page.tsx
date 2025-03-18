import { notFound } from 'next/navigation'
import { Form, type Field } from '@/components/form'
import { updateAction } from '../../actions'
import { ROLES } from '@/data/system-roles'
import { verifySession } from '@/lib/dal'
import { getUserById } from '@/db/queries'

export default async function Page({
  params
}: {
  params: Promise<{ organizationId: string; userId: string }>
}) {
  const user = await verifySession()
  const { userId } = await params

  if (!userId) {
    return notFound()
  }

  const userToEdit = await getUserById({ userId })

  if (!userToEdit) {
    return notFound()
  }

  // Add this logic after retrieving the user data
  const isSelfEdit = user.id === userId
  const canEditUser =
    user.role === 'owner' ||
    (user.role === 'admin' && userToEdit.role === 'user') ||
    isSelfEdit

  const hasAccess = user.role === 'admin' || user.role === 'owner'

  const fields: Field[] = [
    {
      name: 'id',
      type: 'hidden',
      defaultValue: userToEdit.id
    },
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: false,
      defaultValue: userToEdit.name || '',
      disabled: !canEditUser
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      defaultValue: userToEdit.email || '',
      disabled: !canEditUser
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
      defaultValue: userToEdit.role || '',
      disabled: !hasAccess
    }
  ]

  return (
    <Form
      fields={fields}
      action={updateAction}
      button='Save'
      data={{
        id: userToEdit.id,
        name: userToEdit.name || '',
        email: userToEdit.email || '',
        role: userToEdit.role
      }}
    />
  )
}
