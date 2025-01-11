import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function Page() {
  const session = await auth()
  if (!session) redirect('/dashboard')

  return (
    <div className='mx-auto w-full max-w-5xl flex-grow'>
      <div className='flex flex-col items-center'>
        <div className='flex items-center gap-2 self-center' />
      </div>
    </div>
  )
}
