import { auth } from '@/lib/auth'
import { Form } from './form'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await auth()

  return (
    <div className='flex h-screen'>
      <div className='flex min-w-0 flex-1 flex-col'>
        <div className='flex h-14 items-center justify-between'>
          <div className='relative flex flex-1 items-center overflow-x-auto pt-2'></div>
          <div className='flex shrink-0 items-center gap-6 self-center pt-2'></div>
        </div>
        <main className='mx-auto w-full max-w-[1200px] flex-1 overflow-auto py-2 lg:-ml-2'>
          <div className='flex flex-col items-center py-12'>
            {!session ? <Form /> : redirect('/dashboard')}
          </div>
        </main>
      </div>
    </div>
  )
}
