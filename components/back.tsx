'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import React from 'react'

export function Back({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const router = useRouter()

  return (
    // <button type='button' {...props} onClick={() => router.back()}>
    //   {children}
    // </button>
    <Button {...props} onClick={() => router.back()} variant='ghost'>
      {children}
    </Button>
  )
}
