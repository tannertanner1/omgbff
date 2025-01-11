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
        <div className='container mx-auto w-full max-w-5xl'>
          <div className='flex flex-col items-center py-12'>
            <Link
              href='/login'
              className='flex items-center gap-2 self-center font-medium'
            >
              <IconPaw className='h-12 w-12' aria-hidden='true' />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
