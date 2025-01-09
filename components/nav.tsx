'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
  Dashboard,
  Folders,
  Files,
  Placeholder,
  Invoice
} from '@/components/icons'

const items = [
  { title: 'Dashboard', icon: Dashboard, href: '/dashboard' },
  { title: 'Invoices', icon: Invoice, href: '/dashboard/invoices' }
  // { title: 'Accounts', icon: Folders, href: '/dashboard/accounts' },
  // { title: 'Services', icon: Files, href: '/dashboard/services' },
  // { title: 'One', icon: Placeholder, href: '/dashboard/one' },
  // { title: 'Two', icon: Placeholder, href: '/dashboard/two' },
  // { title: 'Three', icon: Placeholder, href: '/dashboard/three' },
  // { title: 'Four', icon: Placeholder, href: '/dashboard/four' }
]

export function Nav({ isHorizontal = false }: { isHorizontal?: boolean }) {
  const pathname = usePathname()

  return (
    <div
      className={cn(
        'flex gap-1',
        isHorizontal
          ? 'scrollbar-none flex-row overflow-x-auto px-4 lg:hidden'
          : 'flex-col p-2'
      )}
    >
      {items.map(item => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'relative rounded-md px-3 py-2 text-sm font-medium hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              isActive ? 'text-primary' : 'text-muted-foreground',
              isHorizontal ? 'flex-shrink-0' : 'w-full'
            )}
          >
            <span className='relative z-10 flex items-center gap-2'>
              <Icon className='h-4 w-4' />
              <span>{item.title}</span>
            </span>
            {isActive && (
              <motion.span
                layoutId={isHorizontal ? 'horizontal-nav' : 'vertical-nav'}
                className='absolute inset-0 z-0 rounded-md bg-muted'
                transition={{ type: 'spring', duration: 0.6 }}
              />
            )}
          </Link>
        )
      })}
    </div>
  )
}
