import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Form } from '@/components/form'
import { createAction } from './actions'
import { hasPermission } from '@/lib/abac'

export default async function Page({
  params: paramsPromise
}: {
  params: Promise<{ userId: string }>
}) {
  const [session, params] = await Promise.all([auth(), paramsPromise])
  if (!session) {
    redirect('/login')
  }

  if (session.user.id !== params.userId) {
    redirect(`/${session.user.id}/organizations/new`)
  }

  if (!hasPermission(session.user, 'organizations', 'create')) {
    redirect(`/${params.userId}/organizations`)
  }

  const fields = [
    {
      name: 'name',
      label: 'Name',
      type: 'text' as const,
      required: true
    }
  ]

  return (
    <div className='min-h-screen'>
      <div className='mx-auto w-full max-w-5xl'>
        <Form fields={fields} action={createAction} button='Create' />
      </div>
    </div>
  )
}
