import { feedback } from './actions'
import { Form, type Field } from '@/components/form'

export default function Page() {
  const fields: Field[] = [
    {
      name: 'name',
      label: 'Name',
      type: 'text' as const
    },
    {
      name: 'message',
      label: 'Message',
      type: 'textarea' as const,
      required: true
    }
  ]

  return <Form fields={fields} action={feedback} button='Submit' />
}
