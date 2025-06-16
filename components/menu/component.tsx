"use client"

import * as React from "react"
import { IconChevronRight } from "@tabler/icons-react"
import { motion } from "motion/react"

function Component({
  title,
  url,
  icon,
  description,
  index,
}: {
  title: string
  url: string
  icon: React.ElementType
  description?: string
  index: number
}) {
  return (
    <motion.a
      href={url}
      className="border-border bg-background flex cursor-pointer items-center gap-4 rounded-2xl border p-4 no-underline shadow-xs"
      whileHover={{ scale: 1.01, zIndex: 10 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <motion.div
        className="bg-primary flex h-12 w-12 items-center justify-center rounded-full"
        whileHover={{ rotate: 5 }}
        whileTap={{ scale: 0.9 }}
      >
        {React.createElement(icon, { className: "h-6 w-6 text-background" })}
      </motion.div>
      <div className="flex-1">
        <h3 className="text-primary text-xl font-semibold">{title}</h3>
        {description && (
          <p className="text-muted-foreground text-sm">{description ?? ""}</p>
        )}
      </div>
      <motion.div
        className="text-accent-foreground"
        whileHover={{ x: 3 }}
        whileTap={{ x: -2 }}
      >
        <IconChevronRight className="h-6 w-6" />
      </motion.div>
    </motion.a>
  )
}

export { Component }
