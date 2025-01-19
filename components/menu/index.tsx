'use client'

import { motion } from 'motion/react'
import { ITEMS } from './items'
import { Item } from './item'
import { cn } from '@/lib/utils'

export function Menu() {
  return (
    <motion.div
      className={cn('min-w-sm mx-auto w-full space-y-3 pt-4')}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {ITEMS.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Item
            icon={item.icon}
            title={item.title}
            description={item.description}
            iconClassName={item.iconClassName}
            href={item.href}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
