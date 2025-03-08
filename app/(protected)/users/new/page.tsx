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

// @note added params but missing organization field...

// import { redirect } from 'next/navigation'
// import { Form, type Field } from '@/components/form'
// import { verifySession } from '@/lib/dal'
// import { hasPermission } from '@/lib/abac'
// import { createAction } from '../actions'
// import { ROLES } from '@/data/system-roles'

// export default async function Page({
//   params
// }: {
//   params: { organizationId: string }
// }) {
//   const user = await verifySession()
//   const { organizationId } = params

//   if (!hasPermission(user, 'users', 'create')) {
//     redirect(`/organizations/${organizationId}/users`)
//   }

//   const availableRoles =
//     user.role === 'owner'
//       ? ROLES
//       : user.role === 'admin'
//         ? ['user', 'admin']
//         : ['user']

//   const fields: Field[] = [
//     {
//       name: 'organizationId',
//       type: 'hidden',
//       defaultValue: organizationId,
//       required: true
//     },
//     {
//       name: 'name',
//       label: 'Name',
//       type: 'text',
//       required: true,
//       defaultValue: ''
//     },
//     {
//       name: 'email',
//       label: 'Email',
//       type: 'email',
//       required: true
//     },
//     {
//       name: 'role',
//       label: 'Role',
//       type: 'select',
//       required: true,
//       options: availableRoles.map(role => ({
//         label: role.charAt(0).toUpperCase() + role.slice(1),
//         value: role
//       })),
//       defaultValue: 'user',
//       disabled: !hasPermission(user, 'users', 'update')
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

// @note form not properly sending organizationId field

// import { redirect } from 'next/navigation'
// import { Form, type Field } from '@/components/form'
// import { createAction } from '../actions'
// import { ROLES } from '@/data/system-roles'
// import { verifySession } from '@/lib/dal'
// import { hasPermission } from '@/lib/abac'
// import { getAllOrganizations } from '@/db/queries'
// import { Empty } from '@/components/form/empty'

// export default async function Page() {
//   const user = await verifySession()

//   if (!hasPermission(user, 'users', 'create')) {
//     redirect('/users')
//   }

//   const organizations = await getAllOrganizations()
//   if (organizations.length === 0) {
//     return <Empty name='organization' form='/organizations/new' back='/users' />
//   }

//   const availableRoles =
//     user.role === 'owner'
//       ? ROLES
//       : user.role === 'admin'
//         ? ['user', 'admin']
//         : ['user']

//   const fields: Field[] = [
//     {
//       name: 'name',
//       label: 'Name',
//       type: 'text',
//       required: false
//     },
//     {
//       name: 'email',
//       label: 'Email',
//       type: 'email',
//       required: true
//     },
//     {
//       name: 'role',
//       label: 'Role',
//       type: 'select',
//       required: true,
//       options: availableRoles.map(role => ({
//         label: role.charAt(0).toUpperCase() + role.slice(1),
//         value: role
//       })),
//       defaultValue: 'user',
//       disabled: user.role === 'user'
//     },
//     {
//       name: 'organizationId',
//       label: 'Organization',
//       type: 'select',
//       required: true,
//       options: organizations.map(org => ({
//         label: org.name,
//         value: org.id
//       }))
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
