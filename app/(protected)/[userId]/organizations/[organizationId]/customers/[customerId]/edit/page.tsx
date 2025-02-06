import { notFound } from 'next/navigation'
import { Form, type Field } from '@/components/form'
import { getCustomerById } from '@/db/queries'
import { updateAction } from '../../actions'

export default async function Page({
  params
}: {
  params: Promise<{
    userId: string
    organizationId: string
    customerId: string
  }>
}) {
  const { userId, organizationId, customerId } = await params
  const customer = await getCustomerById(customerId)

  if (!customer) return notFound()

  const fields: Field[] = [
    {
      name: 'name',
      label: 'Name',
      type: 'text' as const,
      required: true,
      defaultValue: customer.name
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email' as const,
      required: true,
      defaultValue: customer.email
    },
    {
      name: 'id',
      type: 'hidden' as const,
      defaultValue: customer.id.toString()
    },
    {
      name: 'organizationId',
      type: 'hidden' as const,
      defaultValue: organizationId
    }
  ]

  return <Form fields={fields} action={updateAction} button='Update' />
}

// import { getCustomerById } from '@/db/queries'
// import { notFound } from 'next/navigation'
// import { Form } from '@/components/form'
// import { updateAction } from '../../actions'

// export default async function Page({
//   params
// }: {
//   // params: { userId: string; organizationId: string; customerId: string }
//   params: Promise<{
//     userId: string
//     organizationId: string
//     customerId: string
//   }>
// }) {
//   // const customer = await getCustomerById(params.customerId)
//   // if (!customer) {
//   //   notFound()
//   // }
//   const { userId, organizationId, customerId } = await params
//   const customer = await getCustomerById(customerId)
//   if (customer == null) return notFound()

//   const fields = [
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
//     },
//     {
//       name: 'id',
//       type: 'hidden' as const,
//       defaultValue: customer.id.toString()
//     },
//     {
//       name: 'organizationId',
//       type: 'hidden' as const,
//       // defaultValue: params.organizationId
//       defaultValue: organizationId
//     }
//   ]

//   return <Form fields={fields} action={updateAction} button='Update' />
// }
