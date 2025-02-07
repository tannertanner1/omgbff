import { contact } from './actions'
import { Form, type Field } from '@/components/form'

export default function Page() {
  const fields: Field[] = [
    {
      name: 'name',
      label: 'Name',
      type: 'text' as const
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email' as const,
      required: true
    },
    {
      name: 'message',
      label: 'Message',
      type: 'textarea' as const,
      required: true
    }
  ]

  return <Form fields={fields} action={contact} button='Send' />
}
