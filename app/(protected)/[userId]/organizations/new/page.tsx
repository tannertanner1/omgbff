import { Form } from '@/components/form'
import { createAction } from '../actions'

export default function Page() {
  const fields = [
    {
      name: 'name',
      label: 'Name',
      type: 'text' as const,
      required: true
    }
  ]

  return <Form fields={fields} action={createAction} button='Create' />
}
