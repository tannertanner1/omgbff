import type React from 'react'
import { cn } from '@/lib/utils'

function Section({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('container mx-auto max-w-5xl px-4', className)}>
      <div className='flex flex-col items-start justify-start space-y-8 text-start md:items-center md:justify-center md:text-center'>
        {children}
      </div>
    </div>
  )
}

export { Section }
