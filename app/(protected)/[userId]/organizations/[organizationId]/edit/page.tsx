import { notFound } from 'next/navigation'
import { Form, type Field } from '@/components/form'
import { getOrganizationById } from '@/db/queries'
import { updateAction } from '../../actions'

export default async function Page({
  params
}: {
  params: Promise<{ userId: string; organizationId: string }>
}) {
  const { userId, organizationId } = await params
  const organization = await getOrganizationById(organizationId)

  if (!organization) return notFound()

  const fields: Field[] = [
    {
      name: 'name',
      label: 'Name',
      type: 'text' as const,
      required: true,
      defaultValue: organization.name
    },
    {
      name: 'id',
      type: 'hidden' as const,
      defaultValue: organization.id
    }
  ]

  return (
    <Form
      fields={fields}
      action={updateAction}
      button='Save'
      data={{
        id: organization.id,
        name: organization.name
      }}
    />
  )
}
