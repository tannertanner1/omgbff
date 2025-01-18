'use client'

import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import {
  IconMail,
  IconSend,
  IconUserCircle,
  IconPhotoCircle,
  IconCircleFilled
} from '@tabler/icons-react'
import {
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuContent
} from '@/components/ui/dropdown-menu'
import { Session } from 'next-auth'
import { logout } from '@/actions/logout'

export function Dropdown({ session }: { session: Session | null }) {
  const handleLogout = async () => {
    try {
      await logout()
      revalidatePath('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className='rounded-full'>
            <IconCircleFilled className='h-6 w-6 cursor-pointer' />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align='end'
          className={
            session ? 'w-[200px]' : 'w-[--radix-dropdown-menu-trigger-width]'
          }
        >
          {session && (
            <>
              <DropdownMenuLabel className='font-normal'>
                <div className='flex flex-col space-y-1'>
                  <p className='truncate text-sm font-medium leading-none'>
                    {session.user.email}
                  </p>
                  <p className='truncate text-xs leading-none text-muted-foreground'>
                    {session.user.id}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem asChild>
            <Link href='/contact' className='flex items-center gap-2'>
              <IconMail className='h-4 w-4' />
              Contact
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href='/feedback' className='flex items-center gap-2'>
              <IconSend className='h-4 w-4' />
              Feedback
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {session ? (
            <DropdownMenuItem onClick={handleLogout} className='gap-2'>
              <IconPhotoCircle className='h-4 w-4' />
              Sign out
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem asChild>
              <Link href='/login' className='flex items-center gap-2'>
                <IconUserCircle className='h-4 w-4' />
                Sign in
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
