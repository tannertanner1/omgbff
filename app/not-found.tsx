'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className='flex min-h-[75dvh] flex-col items-center justify-center bg-background pb-12 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-md text-center'>
        <div className='container h-12 w-12 text-primary' />
        <h1 className='text-balance text-6xl font-bold tracking-tight text-foreground'>
          Page not found
        </h1>
        <p className='mt-4 text-balance text-muted-foreground'>
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className='mt-6'>
          <Button
            className={cn(
              'relative bg-background text-base text-primary after:absolute after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-left after:scale-x-100 after:bg-primary after:transition-transform after:duration-300 after:ease-in-out hover:bg-transparent hover:after:origin-bottom-right hover:after:scale-x-0'
            )}
            onClick={() => router.back()}
          >
            Go back
          </Button>
        </div>
      </div>
    </div>
  )
}
