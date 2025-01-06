'use client'

// Error boundaries must be Client Components

import React from 'react'
import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className='flex min-h-[40dvh] flex-col items-center justify-center bg-background pb-12 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-md text-center'>
        <div className='container h-12 w-12 text-primary' />
        <h1 className='text-balance text-4xl font-bold tracking-tight text-foreground'>
          Something went wrong!
        </h1>
        <div className='mt-6 flex flex-row items-center justify-center gap-2'>
          <Link href='/' className='inline-flex' prefetch={false}>
            <Button
              className={cn(
                'relative bg-background text-primary after:absolute after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-left after:scale-x-100 after:bg-primary after:transition-transform after:duration-300 after:ease-in-out hover:bg-transparent hover:after:origin-bottom-right hover:after:scale-x-0'
              )}
              onClick={() => router.back()}
            >
              Go back
            </Button>
          </Link>
          <Link href='/' className='inline-flex' prefetch={false}>
            <Button
              className={cn(
                'relative bg-background text-primary after:absolute after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-left after:scale-x-100 after:bg-primary after:transition-transform after:duration-300 after:ease-in-out hover:bg-transparent hover:after:origin-bottom-right hover:after:scale-x-0'
              )}
              onClick={() => reset()}
            >
              Try again
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
