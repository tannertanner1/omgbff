import { auth } from '@/lib/auth'
import { Menu } from '@/components/menu'
// import Link from 'next/link'
// import { IconPaw } from '@tabler/icons-react'
import { Heatmap } from '@/components/heatmap'

export default async function Page() {
  const session = await auth()

  return (
    <div className='flex h-fit'>
      <div className='flex min-w-0 flex-1 flex-col'>
        <div className='mx-auto w-full max-w-5xl'>
          {session ? (
            <div className='mb-8 flex flex-col items-center px-4'>
              {/* <Menu /> */}
              <Menu user={session.user} />
            </div>
          ) : (
            <div className='flex flex-col items-center py-12'>
              {/* <Link
                href='/login'
                className='flex items-center gap-2 self-center font-medium'
              >
                <IconPaw className='h-12 w-12' aria-hidden='true' />
              </Link> */}
              <Heatmap />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
