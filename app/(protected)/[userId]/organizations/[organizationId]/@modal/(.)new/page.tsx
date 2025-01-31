import { Form } from '@/components/form'
import { createAction } from './../../../actions'

const fields = [
  {
    name: 'name',
    label: 'Name',
    type: 'text' as const,
    required: true
  }
]

export default function Page() {
  return <Form fields={fields} action={createAction} button='Create' />
}

/**
import { Form } from '@/components/form'
import { createAction } from '@/app/(protected)/[userId]/organizations/actions'

const fields = [
  {
    name: 'name',
    label: 'Name',
    type: 'text' as const,
    required: true
  }
]

export default function Page() {
  return (
    <div className='min-h-screen'>
      <div className='mx-auto w-full max-w-5xl'>
        <Form fields={fields} action={createAction} button='Create' />
      </div>
    </div>
  )
}
*/
