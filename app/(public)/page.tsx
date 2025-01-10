import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { IconPaw } from '@tabler/icons-react'

export default async function Page() {
  const session = await auth()
  if (session) return redirect('/dashboard')

  return (
    <div className='flex h-screen px-2'>
      <div className='flex min-w-0 flex-1 flex-col'>
        <div className='flex h-14 items-center justify-between'>
          <div className='relative flex flex-1 items-center overflow-x-auto pt-2'></div>
          <div className='flex shrink-0 items-center gap-6 self-center px-4 pt-2'></div>
        </div>
        <main className='mx-auto w-full max-w-[1200px] flex-1 overflow-auto px-4 py-2 lg:-ml-2'>
          <div className='flex flex-col items-center py-12'>
            <Link
              href='/login'
              className='flex items-center gap-2 self-center font-medium'
            >
              <IconPaw className='h-12 w-12' aria-hidden='true' />
            </Link>{' '}
          </div>
        </main>
      </div>
    </div>
  )
}
