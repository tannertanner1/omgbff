import { Form } from '@/components/form'
import { createAction } from '../actions'

export default function Page({
  params
}: {
  params: { userId: string; organizationId: string }
}) {
  const fields = [
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
      defaultValue: params.organizationId
    }
  ]

  return <Form fields={fields} action={createAction} button='Create' />
}
