"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function Section({
  title,
  summary,
  children,
  onRemove,
  error,
  defaultOpen = false,
}: {
  title: string
  summary: string
  children: React.ReactNode
  onRemove?: () => void
  error?: {
    type: string
    message?: string
  } | null
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <div
      className={cn(
        "bg-background overflow-visible rounded-lg",
        // Add padding to accommodate neobrutal shadows
        "-m-1 p-1",
        error && ""
      )}
    >
      <button
        type="button"
        className="flex w-full items-center justify-between py-3 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={cn("flex items-center gap-2")}>
          <Badge
            className={cn(
              error
                ? "bg-background border border-[#DB4437] text-[#DB4437]"
                : "bg-accent border-accent text-primary border"
            )}
          >
            {title}
          </Badge>
          <span className="text-muted-foreground truncate text-sm">
            {summary}
          </span>
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-visible"
          >
            <div className="space-y-4 overflow-visible">
              {children}
              {onRemove && (
                <div className="py-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="[&[data-slot=button]]:bg-background [&[data-slot=button]]:hover:text-background mt-4 border transition-colors duration-300 ease-in-out [&[data-slot=button]]:w-[21rem] [&[data-slot=button]]:border-[#DB4437] [&[data-slot=button]]:text-[#DB4437] [&[data-slot=button]]:hover:bg-[#DB4437]"
                    onClick={onRemove}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
