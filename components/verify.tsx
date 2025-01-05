'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Verify() {
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (!canResend) {
      timer = setInterval(() => {
        setCountdown(prevCount => {
          if (prevCount === 0) {
            setCanResend(true)
            clearInterval(timer)
            return 0
          }
          return prevCount - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [canResend])

  return (
    <div className='container flex h-[100vh] items-center justify-center'>
      <Card className='w-full max-w-md border-0 shadow-none'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-semibold tracking-tight'>
            Verify your email
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <p className='text-sm text-muted-foreground'>
            We&apos;ve sent a verification email to{' '}
            <span className='font-medium text-foreground'>
              example@email.com
            </span>
            . Please check your inbox and click the link to confirm your email
            address.
          </p>
          <div className='flex items-center justify-between'>
            <p className='text-sm text-muted-foreground'>
              {!canResend
                ? `Resend in ${countdown} seconds`
                : "Didn't receive the email?"}
            </p>
            <Button
              variant='ghost'
              disabled={!canResend}
              onClick={() => {
                setCountdown(60)
                setCanResend(false)
              }}
            >
              Resend
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
