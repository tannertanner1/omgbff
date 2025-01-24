'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { IconChevronRight } from '@tabler/icons-react'

export function Component({
  icon,
  title,
  description,
  id,
  href,
  index
}: {
  icon: React.ElementType
  title: string
  description: string
  id: string
  href: string
  index: number
}) {
  return (
    <motion.a
      href={`/${id}${href}`}
      className='flex cursor-pointer items-center gap-4 rounded-2xl border border-border bg-background p-4 no-underline shadow-sm'
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <motion.div
        className='flex h-12 w-12 items-center justify-center rounded-full bg-primary'
        whileHover={{ rotate: 5 }}
        whileTap={{ scale: 0.9 }}
      >
        {React.createElement(icon, { className: 'h-6 w-6 text-background' })}
      </motion.div>
      <div className='flex-1'>
        <h3 className='text-xl font-semibold text-primary'>{title}</h3>
        <p className='text-sm text-muted-foreground'>{description}</p>
      </div>
      <motion.div
        className='text-accent-foreground'
        whileHover={{ x: 3 }}
        whileTap={{ x: -2 }}
      >
        <IconChevronRight className='h-6 w-6' />
      </motion.div>
    </motion.a>
  )
}
