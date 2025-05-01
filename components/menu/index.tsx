"use client"

import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import type { User } from "@/lib/abac"
import { ITEMS } from "@/data/menu-items"
import { Component } from "./component"

function Menu({ user, className }: { user: User; className?: string }) {
  const items = ITEMS.flat().filter((item) => {
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
      className={cn("w-full min-w-sm space-y-4 p-4 px-2", className)}
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

// @note

// "use client"

// import { motion } from "motion/react"
// import { cn } from "@/lib/utils"
// import { ITEMS } from "@/data/menu-items"
// import { Component } from "./component"

// function Menu({ className }: { className?: string }) {
//   return (
//     <motion.div
//       className={cn("w-full min-w-sm space-y-4 p-4", className)}
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//     >
//       {ITEMS.map((item, index) => (
//         <Component key={item.title} {...item} index={index + 1} />
//       ))}
//     </motion.div>
//   )
// }

// export { Menu }
