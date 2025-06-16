"use client"

import { motion } from "motion/react"
import { ITEMS } from "@/data/menu-items"
import type { User } from "@/lib/abac"
import { cn } from "@/lib/utils"
import { Component } from "./component"

function Menu({ user, className }: { user: User; className?: string }) {
  // const items = ITEMS.flat().filter((item) => {
  const items = ITEMS[0].filter((item) => {
    if (item.permission) {
      const { resource, action } = item.permission
      if (resource === "users" && action === "view") {
        return user.role === "owner" || user.role === "admin"
      }
      // return hasPermission(user, resource, action)
    }
    // Items without permission are visible to all user roles
    return true
  })

  return (
    <motion.div
      className={cn(
        "w-full min-w-sm space-y-3 overflow-visible p-4 px-4",
        className
      )}
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

export { Menu }
