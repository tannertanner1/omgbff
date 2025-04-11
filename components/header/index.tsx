import * as React from 'react'
import Link from 'next/link'
import { auth } from '@/lib/auth'
// import { AppSidebar } from '@/components/app-sidebar'
// import { Theme } from '@/components/theme'
import { IconCircleFilled } from '@tabler/icons-react'
import { Dropdown } from './dropdown'
import { Toggle } from './toggle'

export async function Header() {
  const session = await auth()

  return (
    // <header className='sticky top-0 z-50 w-full py-4'>
    //   <div className='container mx-auto flex items-center justify-between px-0'>
    //     <div className='ml-[-0.5rem]'>
    //       <AppSidebar />
    //     </div>
    //     <div className='mr-[-0.5rem]'>
    //       <Theme />
    //     </div>
    //   </div>
    // </header>
    <div className='mx-auto flex h-14 max-w-5xl grow items-center justify-between px-4'>
      <div className='flex items-center'>
        <Link href='/'>
          <div>
            <IconCircleFilled className='h-6 w-6' />
          </div>
        </Link>
      </div>
      <div className='flex items-center gap-2'>
        <Dropdown session={session} />
        <Toggle />
      </div>
    </div>
  )
}
