import * as React from 'react'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { IconCircleFilled } from '@tabler/icons-react'
import { Dropdown } from './dropdown'
import { Toggle } from './toggle'

// import { AppSidebar } from '@/components/app-sidebar'
// import { Theme } from '@/components/theme'

export async function Header() {
  const session = await auth()

  return (
    <div className='mx-auto flex h-14 max-w-5xl flex-grow items-center justify-between px-4'>
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
    // <header className='sticky top-0 z-50 px-4 py-4'>
    //   <div className='relative mx-auto flex max-w-5xl items-center justify-between px-6'>
    //     <div className='group'>
    //       <AppSidebar />
    //     </div>
    //     <div className='group'>
    //       <Theme />
    //     </div>
    //   </div>
    // </header>
  )
}
