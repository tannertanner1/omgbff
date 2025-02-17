import { notFound } from 'next/navigation'
import { Form, type Field } from '@/components/form'
import { getOrganizationById } from '@/db/queries'
import { createAction } from '../actions'

export default async function Page({
  params
}: {
  params: Promise<{ organizationId: string }>
}) {
  const { organizationId } = await params
  const organization = await getOrganizationById({ organizationId })

  if (!organization) return notFound()

  const fields: Field[] = [
    {
      name: 'organizationId',
      type: 'hidden' as const,
      defaultValue: organizationId
    },
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
    }
  ]

  return <Form fields={fields} action={createAction} button='Create' />
}
