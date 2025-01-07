'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function SubmitButton({
  className,
  children
}: {
  className?: string
  children: React.ReactNode
}) {
  const { pending } = useFormStatus()

  return (
    <Button
      type={pending ? 'button' : 'submit'}
      disabled={pending}
      aria-disabled={pending}
      className={cn('w-full rounded-full', className)}
    >
      {children}
      <span aria-live='polite' className='sr-only' role='status'>
        {pending ? 'Loading' : 'Continue'}
      </span>
    </Button>
  )
}
