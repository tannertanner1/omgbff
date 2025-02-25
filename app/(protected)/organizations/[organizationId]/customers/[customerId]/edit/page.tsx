import { notFound, redirect } from 'next/navigation'
import { Form } from '@/components/form'
import type { Field } from '@/components/form'
import { getCustomerById } from '@/db/queries'
import { updateAction } from '../../actions'
import { verifySession } from '@/lib/dal'
import { hasPermission } from '@/lib/abac'
import { ADDRESS, PHONE } from '@/data/customer-fields'

export default async function Page({
  params,
  searchParams
}: {
  params: Promise<{ organizationId: string; customerId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const user = await verifySession()
  const { organizationId, customerId } = await params
  const resolvedSearchParams = await searchParams
  const returnTo =
    (resolvedSearchParams.returnTo as string) ||
    `/organizations/${organizationId}/customers`

  if (!hasPermission(user, 'customers', 'update')) {
    redirect(`/organizations/${organizationId}/customers`)
  }

  const customer = await getCustomerById({ customerId })

  if (!customer) {
    return notFound()
  }

  const fields: Field[] = [
    {
      name: 'organizationId',
      type: 'hidden',
      defaultValue: organizationId
    },
    {
      name: 'id',
      type: 'hidden',
      defaultValue: customer.id
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
      defaultValue: customer.name
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      defaultValue: customer.email
    },
    {
      name: 'address',
      type: 'address',
      required: true,
      defaultValue: customer.address || [
        {
          label: ADDRESS[0],
          line1: '',
          line2: '',
          city: '',
          region: 'British Columbia',
          postal: '',
          country: 'Canada'
        }
      ]
    },
    {
      name: 'phone',
      type: 'phone',
      required: true,
      defaultValue: customer.phone || [
        {
          label: PHONE[0],
          number: ''
        }
      ]
    }
  ]

  return <Form fields={fields} action={updateAction} button='Save' />
}

// @note

// import { notFound, redirect } from 'next/navigation'
// import { Form } from '@/components/form'
// import type { Field } from '@/components/form'
// import { getCustomerById } from '@/db/queries'
// import { updateAction } from '../../actions'
// import { verifySession } from '@/lib/dal'
// import { hasPermission } from '@/lib/abac'
// import { ADDRESS, PHONE, COUNTRY } from '@/data/customer-fields'

// export default async function Page({
//   params
// }: {
//   params: Promise<{ organizationId: string; customerId: string }>
// }) {
//   const user = await verifySession()
//   const { organizationId, customerId } = await params

//   if (!hasPermission(user, 'customers', 'update')) {
//     redirect(`/organizations/${organizationId}/customers`)
//   }

//   const customer = await getCustomerById({ customerId })

//   if (!customer) {
//     return notFound()
//   }

//   // Ensure address and phone arrays exist with at least one item
//   const defaultAddress = customer.address?.length
//     ? customer.address
//     : [
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

//   const defaultPhone = customer.phone?.length
//     ? customer.phone
//     : [
//         {
//           label: PHONE[0],
//           number: ''
//         }
//       ]

//   const fields: Field[] = [
//     {
//       name: 'organizationId',
//       type: 'hidden',
//       defaultValue: organizationId
//     },
//     {
//       name: 'id',
//       type: 'hidden',
//       defaultValue: customer.id
//     },
//     {
//       name: 'name',
//       label: 'Name',
//       type: 'text',
//       required: true,
//       defaultValue: customer.name
//     },
//     {
//       name: 'email',
//       label: 'Email',
//       type: 'email',
//       required: true,
//       defaultValue: customer.email
//     },
//     {
//       name: 'address',
//       label: 'Address',
//       type: 'address',
//       required: true,
//       defaultValue: customer.address || [
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
//       defaultValue: customer.phone || [
//         {
//           label: PHONE[0],
//           number: ''
//         }
//       ]
//     }
//   ]

//   return <Form fields={fields} action={updateAction} button='Save' />
// }

// @note

// import { notFound } from 'next/navigation'
// import { Form, type Field } from '@/components/form'
// import { getCustomerById } from '@/db/queries'
// import { updateAction } from '../../actions'

// export default async function Page({
//   params
// }: {
//   params: Promise<{ organizationId: string; customerId: string }>
// }) {
//   const { organizationId, customerId } = await params
//   const customer = await getCustomerById({ customerId })

//   if (!customer) return notFound()

//   const fields: Field[] = [
//     {
//       name: 'organizationId',
//       type: 'hidden' as const,
//       defaultValue: organizationId
//     },
//     {
//       name: 'id',
//       type: 'hidden' as const,
//       defaultValue: customer.id
//     },
//     {
//       name: 'name',
//       label: 'Name',
//       type: 'text' as const,
//       required: true,
//       defaultValue: customer.name
//     },
//     {
//       name: 'email',
//       label: 'Email',
//       type: 'email' as const,
//       required: true,
//       defaultValue: customer.email
//     }
//   ]

//   return <Form fields={fields} action={updateAction} button='Update' />
// }
