'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { IconAlertCircle } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

const errorMessages = {
  Configuration: 'Configuration issue',
  AccessDenied: 'Access denied',
  Verification: 'Verification failed',
  Default: 'Authentication error'
} as const

type AuthError = keyof typeof errorMessages

export default function Page() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') as AuthError
  const errorMessage = errorMessages[error] || errorMessages.Default

  return (
    <div className='flex h-screen'>
      <div className='flex min-w-0 flex-1 flex-col'>
        <div className='container mx-auto w-full max-w-5xl'>
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <IconAlertCircle className='mx-auto h-12 w-12' />
            <span className='sr-only'>Authentication error</span>
            <h1 className='mt-6 text-4xl font-semibold'>{errorMessage}</h1>
            <Link href='/login' className='mt-6 inline-block' prefetch={false}>
              <Button />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

/** @see https://authjs.dev/guides/pages/error?framework=next-js */
