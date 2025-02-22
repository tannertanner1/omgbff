'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Section({
  title,
  summary,
  children,
  onRemove,
  defaultOpen = false
}: {
  title: string
  summary: string
  children: React.ReactNode
  onRemove?: () => void
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <div className='overflow-hidden rounded-lg border bg-background shadow-sm'>
      <button
        type='button'
        className='flex w-full items-center justify-between px-4 py-3 text-left'
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className='flex items-center gap-2'>
          <Badge className='border border-accent bg-accent text-primary'>
            {title}
          </Badge>
          <span className='truncate text-sm text-muted-foreground'>
            {summary}
          </span>
        </div>
        <ChevronDown
          className={cn(
            'h-5 w-5 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className='overflow-hidden'
          >
            <div className='space-y-4 p-4'>
              {children}
              {onRemove && (
                <Button
                  type='button'
                  variant='outline'
                  className='w-full border border-[#DB4437] bg-background text-[#DB4437] hover:bg-[#DB4437] hover:text-background'
                  onClick={onRemove}
                >
                  Remove
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
