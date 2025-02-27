import { redirect } from 'next/navigation'
import { Form } from '@/components/form'
import type { Field } from '@/components/form'
import { ADDRESS, PHONE, COUNTRY } from '@/data/customer-fields'
import { createAction } from '../actions'
import { verifySession } from '@/lib/dal'
import { hasPermission } from '@/lib/abac'

export default async function Page({
  params
}: {
  params: Promise<{ organizationId: string }>
}) {
  const user = await verifySession()
  const { organizationId } = await params

  if (!hasPermission(user, 'customers', 'create')) {
    redirect(`/organizations/${organizationId}/customers`)
  }

  const fields: Field[] = [
    {
      name: 'organizationId',
      type: 'hidden',
      defaultValue: organizationId
    },
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
      name: 'address',
      label: 'Address',
      type: 'address',
      required: true,
      defaultValue: [
        {
          label: ADDRESS[0],
          line1: '',
          line2: '',
          city: '',
          region: '',
          postal: '',
          country: COUNTRY[0]
        }
      ]
    },
    {
      name: 'phone',
      label: 'Phone',
      type: 'phone',
      required: true,
      defaultValue: [{ label: PHONE[0], number: '' }]
    }
  ]

  return <Form fields={fields} action={createAction} button='Create' />
}

// @note ...

// import { redirect } from 'next/navigation'
// import { Form } from '@/components/form'
// import type { Field } from '@/components/form'
// import { ADDRESS, PHONE, COUNTRY } from '@/data/customer-fields'
// import { createAction } from '../actions'
// import { verifySession } from '@/lib/dal'
// import { hasPermission } from '@/lib/abac'

// export default async function Page({
//   params
// }: {
//   params: Promise<{ organizationId: string }>
// }) {
//   const user = await verifySession()
//   const { organizationId } = await params

//   if (!hasPermission(user, 'customers', 'create')) {
//     redirect(`/organizations/${organizationId}/customers`)
//   }

//   const fields: Field[] = [
//     {
//       name: 'organizationId',
//       type: 'hidden',
//       defaultValue: organizationId
//     },
//     {
//       name: 'name',
//       label: 'Name',
//       type: 'text',
//       required: true
//     },
//     {
//       name: 'email',
//       label: 'Email',
//       type: 'email',
//       required: true
//     },
//     {
//       name: 'address',
//       label: 'Addresses',
//       type: 'address',
//       required: true,
//       defaultValue: [
//         {
//           label: ADDRESS[0],
//           line1: '',
//           line2: '',
//           city: '',
//           region: '',
//           postal: '',
//           country: COUNTRY[0]
//         }
//       ]
//     },
//     {
//       name: 'phone',
//       label: 'Phone',
//       type: 'phone',
//       required: true,
//       defaultValue: [{ label: PHONE[0], number: '' }]
//     }
//   ]

//   return <Form fields={fields} action={createAction} button='Save' />
// }

// @note

// import { notFound } from 'next/navigation'
// import { Form, type Field } from '@/components/form'
// import { getOrganizationById } from '@/db/queries'
// import { createAction } from '../actions'

// export default async function Page({
//   params
// }: {
//   params: Promise<{ organizationId: string }>
// }) {
//   const { organizationId } = await params
//   const organization = await getOrganizationById({ organizationId })

//   if (!organization) return notFound()

//   const fields: Field[] = [
//     {
//       name: 'organizationId',
//       type: 'hidden' as const,
//       defaultValue: organizationId
//     },
//     {
//       name: 'name',
//       label: 'Name',
//       type: 'text' as const,
//       required: true
//     },
//     {
//       name: 'email',
//       label: 'Email',
//       type: 'email' as const,
//       required: true
//     }
//   ]

//   return <Form fields={fields} action={createAction} button='Create' />
// }
