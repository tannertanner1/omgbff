import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Form } from './form'

export default async function Page() {
  const session = await auth()
  // Early redirect vs. conditional rendering with redirect
  if (session) {
    redirect('/')
  }

  return (
    <div className='flex h-fit'>
      <div className='flex min-w-0 flex-1 flex-col'>
        <div className='container mx-auto w-full max-w-5xl'>
          <div className='flex flex-col items-center py-12'>
            <Form />
            {/* {!session ? <Form /> : redirect('/')} */}
          </div>
        </div>
      </div>
    </div>
  )
}

/** @see https://nextjs.org/docs/app/building-your-application/routing/redirecting */
