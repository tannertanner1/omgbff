import Link from 'next/link'
import {
  IconHelp,
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

export function UserDropdown({ session }: { session: any }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='rounded-full'>
          <IconCircleFilled className='h-6 w-6 cursor-pointer' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {session?.user && (
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
            <IconHelp className='h-4 w-4' />
            Contact
          </Link>
        </DropdownMenuItem>
        {session?.user ? (
          <DropdownMenuItem asChild>
            <Link href='/api/auth/signout' className='flex items-center gap-2'>
              <IconPhotoCircle className='h-4 w-4' />
              Sign out
            </Link>
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
  )
}
