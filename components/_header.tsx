'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  IconCircleFilled,
  IconCircle,
  IconPercentage50,
  IconMail,
  IconSend,
  IconUserCircle,
  IconPhotoCircle
} from '@tabler/icons-react'
import {
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuContent
} from '@/components/ui/dropdown-menu'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import { logout } from '@/actions/logout'
import { cn } from '@/lib/utils'
import { getSession } from '@/_private/actions/session'

import { Session } from 'next-auth'

export function Header() {
  const [session, setSession] = React.useState<Session | null>(null)

  React.useEffect(() => {
    getSession().then(setSession)
  }, [])

  return (
    <div className='mx-auto flex h-14 max-w-5xl flex-grow items-center justify-between px-4'>
      <div className='flex items-center'>
        <Link href='/'>
          <div>
            <IconCircle className='h-6 w-6' />
          </div>
        </Link>
      </div>
      <div className='flex items-center'>
        <Dropdown session={session} />
        <Toggle />
      </div>
    </div>
  )
}

function Dropdown({ session }: { session: Session | null }) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type='button' className='rounded-full'>
          <IconCircleFilled className='h-6 w-6 cursor-pointer' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className={
          session ? 'w-[200px]' : 'w-[--radix-dropdown-menu-trigger-width]'
        }
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
        {session?.user ? (
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
  )
}

export function Toggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      type='button'
      className={cn(
        'relative overflow-hidden rounded-md bg-transparent text-primary transition-all duration-300 [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] active:-translate-y-1 active:scale-x-90 active:scale-y-110'
      )}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <IconPercentage50
        aria-hidden='true'
        className='dark:rotate-360 h-6 w-6 dark:hidden'
      />
      <IconPercentage50
        aria-hidden='true'
        className='rotate-360 hidden h-6 w-6 dark:block'
      />
      <span className='sr-only'>Toggle theme</span>
    </button>
  )
}

// 'use client'

// import * as React from 'react'
// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import {
//   IconCircleFilled,
//   IconCircle,
//   IconPercentage50,
//   IconMail,
//   IconSend,
//   IconUserCircle,
//   IconPhotoCircle
// } from '@tabler/icons-react'
// import {
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenu,
//   DropdownMenuContent
// } from '@/components/ui/dropdown-menu'
// import { useTheme } from 'next-themes'
// import { usePathname } from 'next/navigation'
// import { logout } from '@/actions/logout'
// import { cn } from '@/lib/utils'
// import { getSession } from '@/actions/session'
// import { Session } from 'next-auth'

// export function Header() {
//   const pathname = usePathname()
//   const [session, setSession] = useState<any>(null)

//   useEffect(() => {
//     let mounted = true

//     async function fetchSession() {
//       try {
//         const sessionData = await getSession()
//         if (mounted) {
//           setSession(sessionData)
//         }
//       } catch (error) {
//         console.error('Failed to fetch session:', error)
//         if (mounted) {
//           setSession(null)
//         }
//       }
//     }

//     fetchSession()

//     // Cleanup function to prevent memory leaks
//     return () => {
//       mounted = false
//     }
//   }, [pathname]) // Updated useEffect dependency array

//   return (
//     <div className='mx-auto flex h-14 max-w-5xl flex-grow items-center justify-between px-4'>
//       {' '}
//       <div className='flex items-center'>
//         <Link href='/'>
//           <div
//           // className='-mt-0.5'
//           >
//             <IconCircle
//               className='h-6 w-6'
//               // className='h-8 w-8'
//             />
//           </div>
//         </Link>
//       </div>
//       <div className='flex items-center'>
//         <Dropdown session={session} setSession={setSession} />
//         <Toggle />
//       </div>
//     </div>
//   )
// }

// function Dropdown({
//   session,
//   setSession
// }: {
//   session: Session | null
//   setSession: (session: Session | null) => void
// }) {
//   const handleLogout = async () => {
//     try {
//       await logout()
//       setSession(null)
//     } catch (error) {
//       console.error('Logout failed:', error)
//     }
//   }

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <button className='rounded-full'>
//           <IconCircleFilled className='h-6 w-6 cursor-pointer' />
//         </button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent
//         align='end'
//         className={
//           session ? 'w-[200px]' : 'w-[--radix-dropdown-menu-trigger-width]'
//         }
//       >
//         {session?.user && (
//           <>
//             <DropdownMenuLabel className='font-normal'>
//               <div className='flex flex-col space-y-1'>
//                 <p className='truncate text-sm font-medium leading-none'>
//                   {session.user.email}
//                 </p>
//                 <p className='truncate text-xs leading-none text-muted-foreground'>
//                   {session.user.id}
//                 </p>
//               </div>
//             </DropdownMenuLabel>
//             <DropdownMenuSeparator />
//           </>
//         )}
//         <DropdownMenuItem asChild>
//           <Link href='/contact' className='flex items-center gap-2'>
//             <IconMail className='h-4 w-4' />
//             Contact
//           </Link>
//         </DropdownMenuItem>
//         <DropdownMenuItem asChild>
//           <Link href='/feedback' className='flex items-center gap-2'>
//             <IconSend className='h-4 w-4' />
//             Contact
//           </Link>
//         </DropdownMenuItem>
//         <DropdownMenuSeparator />
//         {session?.user ? (
//           <DropdownMenuItem onClick={handleLogout} className='gap-2'>
//             <IconPhotoCircle className='h-4 w-4' />
//             Sign out
//           </DropdownMenuItem>
//         ) : (
//           <DropdownMenuItem asChild>
//             <Link href='/login' className='flex items-center gap-2'>
//               <IconUserCircle className='h-4 w-4' />
//               Sign in
//             </Link>
//           </DropdownMenuItem>
//         )}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }

// export function Toggle() {
//   const { theme, setTheme } = useTheme()

//   return (
//     <button
//       className={cn(
//         'relative overflow-hidden rounded-md bg-transparent text-primary transition-all duration-300 [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] active:-translate-y-1 active:scale-x-90 active:scale-y-110'
//       )}
//       onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
//     >
//       <IconPercentage50
//         aria-hidden='true'
//         className='dark:rotate-360 h-6 w-6 dark:hidden'
//       />
//       <IconPercentage50
//         aria-hidden='true'
//         className='rotate-360 hidden h-6 w-6 dark:block'
//       />
//       <span className='sr-only'>Toggle theme</span>
//     </button>
//   )
// }

/**
 * @see https://tabler.io/icons
 * @see https://syntaxui.com/components/tabs
 * @see https://ui.shadcn.com/docs/components/dropdown-menu
 * @see https://ui.shadcn.com/docs/dark-mode/next
 */

// @note orignal... before adding conditional to root

// 'use client'

// import * as React from 'react'
// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import {
//   IconCircleFilled,
//   IconCircle,
//   IconPercentage50,
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
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenu,
//   DropdownMenuContent
// } from '@/components/ui/dropdown-menu'
// import { useTheme } from 'next-themes'
// import { usePathname } from 'next/navigation'
// import { logout } from '@/actions/logout'
// import { cn } from '@/lib/utils'
// import { getSession } from '@/actions/session'

// export function Header() {
//   const pathname = usePathname()
//   const showTabs = pathname?.startsWith('/dashboard')
//   const [session, setSession] = useState<any>(null)

//   useEffect(() => {
//     let mounted = true

//     async function fetchSession() {
//       try {
//         const sessionData = await getSession()
//         if (mounted) {
//           setSession(sessionData)
//         }
//       } catch (error) {
//         console.error('Failed to fetch session:', error)
//         if (mounted) {
//           setSession(null)
//         }
//       }
//     }

//     fetchSession()

//     // Cleanup function to prevent memory leaks
//     return () => {
//       mounted = false
//     }
//   }, [pathname]) // Updated useEffect dependency array

//   return (
//     <div className='mx-auto flex h-14 max-w-5xl flex-grow items-center justify-between px-4'>
//       {' '}
//       <div className='flex items-center'>
//         <Link href='/'>
//           <div
//           // className='-mt-0.5'
//           >
//             <IconCircle
//               className='h-6 w-6'
//               // className='h-8 w-8'
//             />
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
//         <UserDropdown session={session} setSession={setSession} />
//       </div>
//     </div>
//   )
// }

// const tabs = [
//   { title: 'Dashboard', icon: IconDashboard, href: '/' },
//   { title: 'Invoices', icon: IconInvoice, href: '/invoices' }
// ]

// function IconTabs() {
//   const pathname = usePathname()
//   const [selected, setSelected] = useState<(typeof tabs)[number]>(
//     tabs.find(tab => tab.href === pathname) ?? tabs[0]
//   )

//   const buttonVariants = {
//     initial: { gap: 0, paddingLeft: '.5rem', paddingRight: '.5rem' },
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
//   session,
//   setSession
// }: {
//   session: any
//   setSession: (session: any) => void
// }) {
//   const { theme, setTheme } = useTheme()
//   const handleLogout = async () => {
//     try {
//       await logout()
//       setSession(null)
//     } catch (error) {
//       console.error('Logout failed:', error)
//     }
//   }

//   return (
//     <>
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <button className='rounded-full'>
//             <IconCircleFilled className='h-6 w-6 cursor-pointer' />
//           </button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent
//           align='end'
//           className={
//             session ? 'w-[200px]' : 'w-[--radix-dropdown-menu-trigger-width]'
//           }
//         >
//           {session?.user && (
//             <>
//               <DropdownMenuLabel className='font-normal'>
//                 <div className='flex flex-col space-y-1'>
//                   <p className='truncate text-sm font-medium leading-none'>
//                     {session.user.email}
//                   </p>
//                   <p className='truncate text-xs leading-none text-muted-foreground'>
//                     {session.user.id}
//                   </p>
//                 </div>
//               </DropdownMenuLabel>
//               <DropdownMenuSeparator />
//             </>
//           )}
//           <DropdownMenuItem asChild>
//             <Link href='/contact' className='flex items-center gap-2'>
//               <IconHelp className='h-4 w-4' />
//               Contact
//             </Link>
//           </DropdownMenuItem>
//           {session?.user ? (
//             <DropdownMenuItem onClick={handleLogout} className='gap-2'>
//               <IconPhotoCircle className='h-4 w-4' />
//               Sign out
//             </DropdownMenuItem>
//           ) : (
//             <DropdownMenuItem asChild>
//               <Link href='/login' className='flex items-center gap-2'>
//                 <IconUserCircle className='h-4 w-4' />
//                 Sign in
//               </Link>
//             </DropdownMenuItem>
//           )}
//         </DropdownMenuContent>
//       </DropdownMenu>
//       <button
//         className={cn(
//           'relative overflow-hidden rounded-md bg-transparent text-primary transition-all duration-300 [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] active:-translate-y-1 active:scale-x-90 active:scale-y-110'
//         )}
//         onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
//       >
//         <IconPercentage50
//           aria-hidden='true'
//           className='dark:rotate-360 h-6 w-6 dark:hidden'
//         />
//         <IconPercentage50
//           aria-hidden='true'
//           className='rotate-360 hidden h-6 w-6 dark:block'
//         />
//         <span className='sr-only'>Toggle theme</span>
//       </button>
//     </>
//   )
// }

// /**
//  * @see https://tabler.io/icons
//  * @see https://syntaxui.com/components/tabs
//  * @see https://ui.shadcn.com/docs/components/dropdown-menu
//  * @see https://ui.shadcn.com/docs/dark-mode/next
//  */
