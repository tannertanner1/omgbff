'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'
import { ROUTES, type Route } from '@/data/public-routes'

type Tab = {
  title: string
  icon: React.ComponentType<{ className?: string }>
  href: string
}

export function IconTabs({ tabs }: { tabs: readonly Tab[] }) {
  const pathname = usePathname()
  const [selected, setSelected] = React.useState<Tab>(
    tabs.find(tab => tab.href === pathname) ?? tabs[0]
  )

  const buttonVariants = {
    initial: { gap: 0, paddingLeft: '.5rem', paddingRight: '.5rem' },
    animate: (isSelected: boolean) => ({
      gap: isSelected ? '.5rem' : 0,
      paddingLeft: isSelected ? '1rem' : '.5rem',
      paddingRight: isSelected ? '1rem' : '.5rem'
    })
  }

  const transition = { delay: 0.1, type: 'spring', bounce: 0, duration: 0.35 }

  // Type-safe check if we're on a public route
  if (ROUTES.includes(pathname as Route)) {
    return null
  }

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

// 'use client'

// import * as React from 'react'
// import Link from 'next/link'
// import { usePathname } from 'next/navigation'
// import { motion, AnimatePresence } from 'motion/react'
// import { cn } from '@/lib/utils'
// import { ROUTES, type Route } from '@/data/public-routes'

// type Tab = {
//   title: string
//   icon: React.ComponentType<{ className?: string }>
//   href: string
// }

// export function IconTabs({ tabs }: { tabs: readonly Tab[] }) {
//   const pathname = usePathname()

//   // Type-safe check if we're on a public route
//   if (ROUTES.includes(pathname as Route)) {
//     return null
//   }

//   const [selected, setSelected] = React.useState<Tab>(
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
