import { notFound, redirect } from 'next/navigation'
import { Form } from '@/components/form'
import type { Field } from '@/components/form'
import { getUserById } from '@/db/queries'
import { updateAction } from '../../actions'
import { verifySession } from '@/lib/dal'
import { hasPermission } from '@/lib/abac'
import { ROLES } from '@/data/system-roles'

export default async function Page({
  params,
  searchParams
}: {
  params: Promise<{ organizationId: string; userId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const user = await verifySession()
  const { organizationId, userId } = await params
  const resolvedSearchParams = await searchParams
  const returnTo =
    (resolvedSearchParams.returnTo as string) ||
    `/organizations/${organizationId}/users`

  if (!hasPermission(user, 'users', 'update')) {
    redirect(`/organizations/${organizationId}/users`)
  }

  const userToEdit = await getUserById({ userId })

  if (!userToEdit) {
    return notFound()
  }

  const hasAccess = user.role === 'admin' || user.role === 'owner'

  const fields: Field[] = [
    {
      name: 'organizationId',
      type: 'hidden',
      defaultValue: organizationId
    },
    {
      name: 'id',
      type: 'hidden',
      defaultValue: userToEdit.id
    },
    {
      name: 'returnTo',
      type: 'hidden',
      defaultValue: returnTo
    },
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      defaultValue: userToEdit.name
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      defaultValue: userToEdit.email
    },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      required: hasAccess,
      options: ROLES.map(role => ({
        label: role.charAt(0).toUpperCase() + role.slice(1),
        value: role
      })),
      defaultValue: userToEdit.role,
      disabled: !hasAccess
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Pending', value: 'pending' }
      ],
      defaultValue: userToEdit.status
    }
  ]

  return (
    <Form
      fields={fields}
      action={updateAction}
      button='Save'
      data={{ role: userToEdit.role, status: userToEdit.status }}
    />
  )
}
