import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

function PageWrapper({
  className,
  children
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn('mx-auto w-full max-w-5xl flex-grow', className)}>
      {children}
    </div>
  )
}

export { PageWrapper }
