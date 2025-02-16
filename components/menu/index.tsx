'use client'

import { motion } from 'framer-motion'
import { ITEMS } from '@/data/menu-items'
import { Component } from './component'

export function Menu() {
  return (
    <motion.div
      className='min-w-sm -pt-2 w-full space-y-4 pb-2'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {ITEMS.map((item, index) => (
        <Component key={item.title} {...item} index={index + 1} />
      ))}
    </motion.div>
  )
}
