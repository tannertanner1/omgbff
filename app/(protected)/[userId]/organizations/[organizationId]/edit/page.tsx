import { Form } from '@/components/form'
import { getOrganizationById } from '@/db/queries'
import { updateAction } from '../../actions'
import { notFound } from 'next/navigation'

export default async function Page({
  params: paramsPromise
}: {
  params: Promise<{ userId: string; organizationId: string }>
}) {
  const params = await paramsPromise
  const organization = await getOrganizationById(params.organizationId)

  if (!organization) {
    notFound()
  }

  const fields = [
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
      title='Edit Organization'
    />
  )
}
