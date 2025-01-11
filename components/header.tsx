'use client'

import * as React from 'react'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  IconFish,
  IconCircleFilled,
  IconCircle,
  IconCircleHalf,
  IconPercentage50,
  IconCheck,
  IconHelp,
  IconLogin2,
  IconLogout2,
  IconDashboard,
  IconInvoice
} from '@tabler/icons-react'
import { motion, AnimatePresence } from 'motion/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useTheme } from 'next-themes'
import { usePathname, useRouter } from 'next/navigation'
import { logout } from '@/actions/logout'
import { cn } from '@/lib/utils'

export function Header() {
  const pathname = usePathname()
  const showTabs = pathname?.startsWith('/dashboard')
  const [isAuthed, setIsAuthed] = useState(false)

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session')
      if (!res.ok) {
        throw new Error('Failed to fetch session')
      }
      const session = await res.json()
      setIsAuthed(!!session && !!session.user)
    } catch (error) {
      console.error('Error checking auth:', error)
      setIsAuthed(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <div className='mx-auto flex h-14 max-w-5xl flex-grow items-center justify-between px-4'>
      <div className='flex items-center'>
        <Link href='/'>
          <div className='-mt-0.5'>
            <IconFish className='h-8 w-8' />
          </div>
        </Link>
      </div>
      {showTabs && (
        <div className='relative flex flex-1 items-center justify-center overflow-hidden'>
          <div className='pointer-events-none absolute left-0 z-20 h-full w-8 bg-gradient-to-r from-background to-transparent' />
          <div className='pointer-events-none absolute right-0 z-20 h-full w-8 bg-gradient-to-l from-background to-transparent' />
          <div className='scrollbar-none w-full overflow-x-auto'>
            <IconTabs />
          </div>
        </div>
      )}
      <div className='flex items-center'>
        <UserDropdown
          isAuthed={isAuthed}
          setIsAuthed={setIsAuthed}
          checkAuth={checkAuth}
        />
      </div>
    </div>
  )
}

const tabs = [
  { title: 'Dashboard', icon: IconDashboard, href: '/dashboard' },
  { title: 'Invoices', icon: IconInvoice, href: '/dashboard/invoices' }
]

function IconTabs() {
  const pathname = usePathname()
  const [selected, setSelected] = useState<(typeof tabs)[number]>(
    tabs.find(tab => tab.href === pathname) ?? tabs[0]
  )

  const buttonVariants = {
    initial: {
      gap: 0,
      paddingLeft: '.5rem',
      paddingRight: '.5rem'
    },
    animate: (isSelected: boolean) => ({
      gap: isSelected ? '.5rem' : 0,
      paddingLeft: isSelected ? '1rem' : '.5rem',
      paddingRight: isSelected ? '1rem' : '.5rem'
    })
  }

  const transition = { delay: 0.1, type: 'spring', bounce: 0, duration: 0.35 }

  return (
    <div className='flex items-center justify-center gap-2'>
      {tabs.map(tab => {
        const Icon = tab.icon
        const isSelected = selected === tab

        return (
          <Link key={tab.href} href={tab.href} onClick={() => setSelected(tab)}>
            <motion.div
              variants={buttonVariants}
              initial='initial'
              animate='animate'
              custom={isSelected}
              transition={transition}
              className={cn(
                'relative flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 focus-within:outline-gray-500/50',
                isSelected
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              )}
            >
              <Icon className='h-5 w-5' />
              <AnimatePresence>
                {isSelected && (
                  <motion.span
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 'auto', opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={transition}
                    className='overflow-hidden'
                  >
                    {tab.title}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>
        )
      })}
    </div>
  )
}

function UserDropdown({
  isAuthed,
  setIsAuthed,
  checkAuth,
  className,
  ...props
}: React.HTMLAttributes<HTMLButtonElement> & {
  isAuthed: boolean
  setIsAuthed: React.Dispatch<React.SetStateAction<boolean>>
  checkAuth: () => Promise<void>
}) {
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const handleSubmit = async () => {
    if (!isAuthed) {
      router.push('/login')
    } else {
      setIsAuthed(false) // Immediately update the UI
      await logout()
      checkAuth() // Double-check the auth state after logout
    }
  }
  // const handleSubmit = () => {
  //   if (pathname === '/' || pathname === '/login') {
  //     router.push('/login')
  //   } else {
  //     logout()
  //   }
  // }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button {...props}>
          <IconCircleFilled className='h-6 w-6 cursor-pointer' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-[var(--radix-dropdown-menu-trigger-width)]'
        align='end'
      >
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className='flex items-center gap-2'>
            <IconCircle className='h-4 w-4' /> Preferences
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className='w-[var(--radix-dropdown-menu-trigger-width)]'>
            <DropdownMenuItem onClick={() => setTheme('system')}>
              <IconCircleHalf className='h-4 w-4' />
              <span>System</span>
              {theme === 'system' && <IconCheck className='ml-auto h-4 w-4' />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('light')}>
              <IconPercentage50 className='h-4 w-4 dark:rotate-180' />
              <span>Light</span>
              {theme === 'light' && <IconCheck className='ml-auto h-4 w-4' />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              <IconPercentage50 className='h-4 w-4 rotate-180 dark:rotate-0' />
              <span>Dark</span>
              {theme === 'dark' && <IconCheck className='ml-auto h-4 w-4' />}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem>
          <Link
            href='/contact'
            prefetch={true}
            className='flex items-center gap-2'
          >
            <IconHelp className='h-4 w-4' />
            <span>Contact</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSubmit}>
          {isAuthed ? (
            <>
              {/* <form action={logout}>
                <button type='submit'>
                  <IconLogout2 className='h-4 w-4' />
                  <span>Sign out</span>
                </button>
              </form> */}
              <IconLogout2 className='h-4 w-4' />
              <span>Sign out</span>
            </>
          ) : (
            <>
              <IconLogin2 className='h-4 w-4' />
              <span>Sign in</span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * @see https://tabler.io/icons
 * @see https://syntaxui.com/components/tabs
 * @see https://ui.shadcn.com/docs/components/dropdown-menu
 * @see https://ui.shadcn.com/docs/dark-mode/next
 */
