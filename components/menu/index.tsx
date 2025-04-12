'use client'

import { motion } from 'motion/react'
import { ITEMS } from '@/data/menu-items'
import { Component } from './component'
import type { User } from '@/lib/abac'

export function Menu({ user }: { user: User }) {
  // Filter items based on user permissions
  const items = ITEMS.filter(item => {
    // If the item has a permission requirement, check it
    if (item.permission) {
      const { resource, action } = item.permission
      // For Users menu, only show to owners and admins
      if (resource === 'users' && action === 'view') {
        return user.role === 'owner' || user.role === 'admin'
      }
      // For other resources, we could implement more complex permission checks
      // return hasPermission(user, resource, action)
    }
    // Items without permission requirements are shown to everyone
    return true
  })

  return (
    <motion.div
      className='-pt-2 w-full min-w-sm space-y-4 pb-2'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {items.map((item, index) => (
        <Component key={item.title} {...item} index={index + 1} />
      ))}
    </motion.div>
  )
}
