import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default async function Page() {
  const session = await auth()
  if (!session) redirect('/dashboard')

  return (
    <div className='mx-auto w-full max-w-5xl flex-grow'>
      <div className='flex flex-col items-center py-12'>
        <div className='flex items-center gap-2 self-center'></div>
      </div>
    </div>
  )
}
