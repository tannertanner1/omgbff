'use client'

import type React from 'react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export function Tabs({
  tabs
}: {
  tabs: Array<{
    title: string
    content: React.ReactNode
  }>
}) {
  const [isActive, setActive] = useState(0)
  const [isHover, setHover] = useState<number | null>(null)

  return (
    <div className='mx-auto w-full max-w-5xl px-6'>
      <nav className='flex gap-2'>
        {tabs.map((tab, index) => {
          const active = isActive === index
          const hover = active || (isHover === index && !active)

          return (
            <button
              key={index}
              onClick={() => setActive(index)}
              onMouseEnter={() => !active && setHover(index)}
              onMouseLeave={() => setHover(null)}
              className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                active ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              <span className='relative z-10'>{tab.title}</span>
              {hover && (
                <motion.div
                  layoutId='background'
                  className='absolute inset-0 rounded-md bg-[#f1f1f1] dark:bg-[#ffffff1a]'
                  animate={{ opacity: active ? 1 : 0.7 }}
                  transition={{
                    type: 'spring',
                    stiffness: 350,
                    damping: 30
                  }}
                />
              )}
            </button>
          )
        })}
      </nav>
      <div className='mt-8 px-4'>
        <AnimatePresence mode='wait' initial={false}>
          <motion.div
            key={isActive}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {tabs[isActive].content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

/**
 * @see https://syntaxui.com/components/tabs
 * @see https://motion-primitives.com/docs/transition-panel
 */
