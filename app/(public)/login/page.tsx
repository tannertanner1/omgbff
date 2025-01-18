import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Form } from './form'

export default async function Page() {
  const session = await auth()

  return (
    <div className='flex h-screen'>
      <div className='flex min-w-0 flex-1 flex-col'>
        <div className='container mx-auto w-full max-w-5xl'>
          <div className='flex flex-col items-center py-12'>
            {!session ? <Form /> : redirect('/')}
          </div>
        </div>
      </div>
    </div>
  )
}
