'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  IconFish,
  IconCircleFilled,
  IconCircle,
  IconCircleHalf,
  IconPercentage50,
  IconCheck,
  IconHelp,
  IconUserCircle,
  IconPhotoCircle,
  IconDashboard,
  IconInvoice
} from '@tabler/icons-react'
import { motion, AnimatePresence } from 'motion/react'
import {
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuContent
} from '@/components/ui/dropdown-menu'
import { useTheme } from 'next-themes'
// import { usePathname, useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { logout } from '@/actions/logout'
import { cn } from '@/lib/utils'
import { getSession } from '@/actions/session'

export function Header() {
  const pathname = usePathname()
  const showTabs = pathname?.startsWith('/dashboard')
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    let mounted = true

    async function fetchSession() {
      try {
        const sessionData = await getSession()
        if (mounted) {
          setSession(sessionData)
        }
      } catch (error) {
        console.error('Failed to fetch session:', error)
        if (mounted) {
          setSession(null)
        }
      }
    }

    fetchSession()

    // Cleanup function to prevent memory leaks
    return () => {
      mounted = false
    }
  }, [pathname]) // Updated useEffect dependency array

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
        <UserDropdown session={session} setSession={setSession} />
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
  session,
  setSession
}: {
  session: any
  setSession: (session: any) => void
}) {
  // function UserDropdown({
  //   isAuthed,
  //   setIsAuthed,
  //   checkAuth,
  //   className,
  //   ...props
  // }: React.HTMLAttributes<HTMLButtonElement> & {
  //   isAuthed: boolean
  //   setIsAuthed: React.Dispatch<React.SetStateAction<boolean>>
  //   checkAuth: () => Promise<void>
  // }) {
  const { theme, setTheme } = useTheme()
  // const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
      setSession(null)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }
  // const handleSubmit = async () => {
  //   if (!isAuthed) {
  //     router.push('/login')
  //   } else {
  //     setIsAuthed(false) // Immediately update the UI
  //     await logout()
  //     checkAuth() // Double-check the auth state after logout
  //   }
  // }
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
        <button className='rounded-full'>
          <IconCircleFilled className='h-6 w-6 cursor-pointer' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-[var(--radix-dropdown-menu-trigger-width)]'
        align='end'
      >
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
        <DropdownMenuItem asChild>
          <Link href='/contact' className='flex items-center gap-2'>
            <IconHelp className='h-4 w-4' />
            <span>Contact</span>
          </Link>
        </DropdownMenuItem>
        {session?.user ? (
          <DropdownMenuItem onClick={handleLogout}>
            {/* <form action={logout}>
              <button type='submit'>
                <IconPhotoCircle className='h-4 w-4' />
                <span>Sign out</span>
              </button>
            </form> */}
            <IconPhotoCircle className='h-4 w-4' />
            <span>Sign out</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild>
            <Link href='/login' className='flex items-center gap-2'>
              <IconUserCircle className='h-4 w-4' />
              <span>Sign in</span>
            </Link>
          </DropdownMenuItem>
        )}
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

// @note

// 'use client'

// import * as React from 'react'
// import { useState, useEffect, useCallback } from 'react'
// import Link from 'next/link'
// import {
//   IconFish,
//   IconCircleFilled,
//   IconCircle,
//   IconCircleHalf,
//   IconPercentage50,
//   IconCheck,
//   IconHelp,
//   IconUserCircle,
//   IconPhotoCircle,
//   IconDashboard,
//   IconInvoice
// } from '@tabler/icons-react'
// import { motion, AnimatePresence } from 'motion/react'
// import {
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSub,
//   DropdownMenuSubContent,
//   DropdownMenuSubTrigger,
//   DropdownMenuTrigger
// } from '@/components/ui/dropdown-menu'
// import { useTheme } from 'next-themes'
// import { usePathname, useRouter } from 'next/navigation'
// import { logout } from '@/actions/logout'
// import { cn } from '@/lib/utils'

// export function Header() {
//   const pathname = usePathname()
//   const showTabs = pathname?.startsWith('/dashboard')
//   const [isAuthed, setIsAuthed] = useState(false)

//   // const [user, setUser] = useState<{
//   //   name?: string
//   //   id?: string
//   //   email?: string
//   // } | null>(null)

//   const checkAuth = useCallback(async () => {
//     try {
//       const res = await fetch('/api/auth/session')
//       if (!res.ok) {
//         throw new Error('Failed to fetch session')
//       }
//       const session = await res.json()
//       setIsAuthed(!!session && !!session.user)
//     } catch (error) {
//       console.error('Error checking auth:', error)
//       setIsAuthed(false)
//     }
//   }, [])

//   useEffect(() => {
//     checkAuth()
//   }, [checkAuth])

//   return (
//     <div className='mx-auto flex h-14 max-w-5xl flex-grow items-center justify-between px-4'>
//       <div className='flex items-center'>
//         <Link href='/'>
//           <div className='-mt-0.5'>
//             <IconFish className='h-8 w-8' />
//           </div>
//         </Link>
//       </div>
//       {showTabs && (
//         <div className='relative flex flex-1 items-center justify-center overflow-hidden'>
//           <div className='pointer-events-none absolute left-0 z-20 h-full w-8 bg-gradient-to-r from-background to-transparent' />
//           <div className='pointer-events-none absolute right-0 z-20 h-full w-8 bg-gradient-to-l from-background to-transparent' />
//           <div className='scrollbar-none w-full overflow-x-auto'>
//             <IconTabs />
//           </div>
//         </div>
//       )}
//       <div className='flex items-center'>
//         <UserDropdown
//           isAuthed={isAuthed}
//           setIsAuthed={setIsAuthed}
//           checkAuth={checkAuth}
//         />
//       </div>
//     </div>
//   )
// }

// const tabs = [
//   { title: 'Dashboard', icon: IconDashboard, href: '/dashboard' },
//   { title: 'Invoices', icon: IconInvoice, href: '/dashboard/invoices' }
// ]

// function IconTabs() {
//   const pathname = usePathname()
//   const [selected, setSelected] = useState<(typeof tabs)[number]>(
//     tabs.find(tab => tab.href === pathname) ?? tabs[0]
//   )

//   const buttonVariants = {
//     initial: {
//       gap: 0,
//       paddingLeft: '.5rem',
//       paddingRight: '.5rem'
//     },
//     animate: (isSelected: boolean) => ({
//       gap: isSelected ? '.5rem' : 0,
//       paddingLeft: isSelected ? '1rem' : '.5rem',
//       paddingRight: isSelected ? '1rem' : '.5rem'
//     })
//   }

//   const transition = { delay: 0.1, type: 'spring', bounce: 0, duration: 0.35 }

//   return (
//     <div className='flex items-center justify-center gap-2'>
//       {tabs.map(tab => {
//         const Icon = tab.icon
//         const isSelected = selected === tab

//         return (
//           <Link key={tab.href} href={tab.href} onClick={() => setSelected(tab)}>
//             <motion.div
//               variants={buttonVariants}
//               initial='initial'
//               animate='animate'
//               custom={isSelected}
//               transition={transition}
//               className={cn(
//                 'relative flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 focus-within:outline-gray-500/50',
//                 isSelected
//                   ? 'text-primary'
//                   : 'text-muted-foreground hover:text-primary'
//               )}
//             >
//               <Icon className='h-5 w-5' />
//               <AnimatePresence>
//                 {isSelected && (
//                   <motion.span
//                     initial={{ width: 0, opacity: 0 }}
//                     animate={{ width: 'auto', opacity: 1 }}
//                     exit={{ width: 0, opacity: 0 }}
//                     transition={transition}
//                     className='overflow-hidden'
//                   >
//                     {tab.title}
//                   </motion.span>
//                 )}
//               </AnimatePresence>
//             </motion.div>
//           </Link>
//         )
//       })}
//     </div>
//   )
// }

// function UserDropdown({
//   isAuthed,
//   setIsAuthed,
//   checkAuth,
//   className,
//   ...props
// }: React.HTMLAttributes<HTMLButtonElement> & {
//   isAuthed: boolean
//   setIsAuthed: React.Dispatch<React.SetStateAction<boolean>>
//   checkAuth: () => Promise<void>
// }) {
//   const { theme, setTheme } = useTheme()
//   const router = useRouter()

//   const handleSubmit = async () => {
//     if (!isAuthed) {
//       router.push('/login')
//     } else {
//       setIsAuthed(false) // Immediately update the UI
//       await logout()
//       checkAuth() // Double-check the auth state after logout
//     }
//   }
//   // const handleSubmit = () => {
//   //   if (pathname === '/' || pathname === '/login') {
//   //     router.push('/login')
//   //   } else {
//   //     logout()
//   //   }
//   // }

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <button {...props}>
//           <IconCircleFilled className='h-6 w-6 cursor-pointer' />
//         </button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent
//         className='w-[var(--radix-dropdown-menu-trigger-width)]'
//         align='end'
//       >
//         <DropdownMenuSub>
//           <DropdownMenuSubTrigger className='flex items-center gap-2'>
//             <IconCircle className='h-4 w-4' /> Preferences
//           </DropdownMenuSubTrigger>
//           <DropdownMenuSubContent className='w-[var(--radix-dropdown-menu-trigger-width)]'>
//             <DropdownMenuItem onClick={() => setTheme('system')}>
//               <IconCircleHalf className='h-4 w-4' />
//               <span>System</span>
//               {theme === 'system' && <IconCheck className='ml-auto h-4 w-4' />}
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={() => setTheme('light')}>
//               <IconPercentage50 className='h-4 w-4 dark:rotate-180' />
//               <span>Light</span>
//               {theme === 'light' && <IconCheck className='ml-auto h-4 w-4' />}
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={() => setTheme('dark')}>
//               <IconPercentage50 className='h-4 w-4 rotate-180 dark:rotate-0' />
//               <span>Dark</span>
//               {theme === 'dark' && <IconCheck className='ml-auto h-4 w-4' />}
//             </DropdownMenuItem>
//           </DropdownMenuSubContent>
//         </DropdownMenuSub>
//         <DropdownMenuItem>
//           <Link
//             href='/contact'
//             prefetch={true}
//             className='flex items-center gap-2'
//           >
//             <IconHelp className='h-4 w-4' />
//             <span>Contact</span>
//           </Link>
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={handleSubmit}>
//           {isAuthed ? (
//             <>
//               {/* <form action={logout}>
//                 <button type='submit'>
//                   <IconPhotoCircle className='h-4 w-4' />
//                   <span>Sign out</span>
//                 </button>
//               </form> */}
//               <IconPhotoCircle className='h-4 w-4' />
//               <span>Sign out</span>
//             </>
//           ) : (
//             <>
//               <IconUserCircle className='h-4 w-4' />
//               <span>Sign in</span>
//             </>
//           )}
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }
