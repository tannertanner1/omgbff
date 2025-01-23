import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { CreateForm } from './form'

export default async function Page({ params }: { params: { userId: string } }) {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }

  const userId = params.userId as string

  if (session.user.id !== userId) {
    redirect(`/${session.user.id}/organizations/new`)
  }

  return (
    <div className='mx-auto max-w-2xl space-y-8 p-8'>
      <h1 className='text-3xl font-bold'>Organization</h1>
      <CreateForm userId={userId} />
    </div>
  )
}
