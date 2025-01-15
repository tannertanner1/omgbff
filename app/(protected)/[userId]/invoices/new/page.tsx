import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Form } from './form'

export default async function Page() {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className='flex h-screen'>
      <div className='flex min-w-0 flex-1 flex-col'>
        <div className='mx-auto w-full max-w-5xl'>
          <div className='flex flex-col items-center'>
            <Form />
          </div>
        </div>
      </div>
    </div>
  )
}
