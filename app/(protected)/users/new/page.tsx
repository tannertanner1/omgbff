import { redirect } from 'next/navigation'
import { Form, type Field } from '@/components/form'
import { createAction } from '../actions'
import { ROLES } from '@/data/system-roles'
import { verifySession } from '@/lib/dal'
import { hasPermission } from '@/lib/abac'
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

  const availableRoles =
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
      options: availableRoles.map(role => ({
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
      options: organizations.map(org => ({
        label: org.name,
        value: org.id
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

// @note

// import { Form, type Field } from '@/components/form'
// import { createAction } from '../actions'
// import { ROLES } from '@/data/system-roles'
// import { verifySession } from '@/lib/dal'

// export default async function Page() {
//   const user = await verifySession()
//   const hasAccess = user.role === 'admin' || user.role === 'owner'

//   // Determine available roles based on current user's role
//   const availableRoles =
//     user.role === 'owner' ? ROLES : ROLES.filter(role => role !== 'owner')

//   const fields: Field[] = [
//     {
//       name: 'name',
//       label: 'Name',
//       type: 'text' as const,
//       required: false
//     },
//     {
//       name: 'email',
//       label: 'Email',
//       type: 'email' as const,
//       required: true
//     },
//     {
//       name: 'role',
//       label: 'Role',
//       type: 'select' as const,
//       required: true,
//       options: availableRoles.map(role => ({
//         label: role.charAt(0).toUpperCase() + role.slice(1),
//         value: role
//       })),
//       defaultValue: 'user',
//       disabled: !hasAccess
//     }
//   ]

//   return (
//     <Form
//       fields={fields}
//       action={createAction}
//       button='Invite'
//       data={{ status: 'pending' }}
//     />
//   )
// }

// @note

// import { Form, type Field } from '@/components/form'
// import { createAction } from '../actions'
// import { ROLES } from '@/data/system-roles'

// export default function Page() {
//   const fields: Field[] = [
//     {
//       name: 'email',
//       label: 'Email',
//       type: 'email' as const,
//       required: true
//     },
//     {
//       name: 'role',
//       label: 'Role',
//       type: 'select' as const,
//       required: true,
//       options: ROLES.map(role => ({
//         label: role.charAt(0).toUpperCase() + role.slice(1),
//         value: role
//       }))
//     }
//   ]

//   return <Form fields={fields} action={createAction} button='Create' />
// }
