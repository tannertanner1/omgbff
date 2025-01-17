import Link from 'next/link'
import { auth } from '@/lib/auth'
import { IconCircle } from '@tabler/icons-react'
import { ROUTES } from '@/data/public-routes'
import { TABS } from '@/data/icon-tabs'
import { IconTabs } from './icon-tabs'
import { UserDropdown } from './user-dropdown'
import { ThemeToggle } from './theme-toggle'

export async function Header() {
  const session = await auth()

  return (
    <div className='mx-auto flex h-14 max-w-5xl flex-grow items-center justify-between px-4'>
      <div className='flex items-center'>
        <Link href='/'>
          <div>
            <IconCircle className='h-6 w-6' />
          </div>
        </Link>
      </div>
      <div className='relative flex flex-1 items-center justify-center overflow-hidden'>
        <div className='pointer-events-none absolute left-0 z-20 h-full w-8 bg-gradient-to-r from-background to-transparent' />
        <div className='pointer-events-none absolute right-0 z-20 h-full w-8 bg-gradient-to-l from-background to-transparent' />
        <div className='scrollbar-none w-full overflow-x-auto'>
          <IconTabs tabs={TABS} />
        </div>
      </div>
      <div className='flex items-center'>
        <UserDropdown session={session} />
        <ThemeToggle />
      </div>
    </div>
  )
}
