import { notFound } from 'next/navigation'
import { Form, type Field } from '@/components/form'
import { getOrganizationById } from '@/db/queries'
import { createAction } from '../actions'

export default async function Page({
  params
}: {
  params: Promise<{ userId: string; organizationId: string }>
}) {
  const { userId, organizationId } = await params
  // const organization = await getOrganizationById(organizationId)

  // if (!organization) return notFound()

  const fields: Field[] = [
    {
      name: 'name',
      label: 'Name',
      type: 'text' as const,
      required: true
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email' as const,
      required: true
    },
    {
      name: 'organizationId',
      type: 'hidden' as const,
      defaultValue: organizationId
    }
  ]

  return <Form fields={fields} action={createAction} button='Create' />
}

// import { Form } from '@/components/form'
// import { createAction } from '../actions'

// export default function Page({
//   params
// }: {
//   params: { userId: string; organizationId: string }
// }) {
//   const fields = [
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
//     },
//     {
//       name: 'organizationId',
//       type: 'hidden' as const,
//       defaultValue: params.organizationId
//     }
//   ]

//   return <Form fields={fields} action={createAction} button='Create' />
// }
