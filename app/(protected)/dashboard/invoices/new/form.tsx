'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import { IconCircleCheck, IconCircleX, IconLoader } from '@tabler/icons-react'

import { create } from './actions'
import { ActionResponse } from './types'

const initialState: ActionResponse = {
  success: false,
  message: ''
}

export function Form({ className }: React.ComponentProps<typeof Card>) {
  const router = useRouter()
  const [state, action, isPending] = React.useActionState(create, initialState)

  React.useEffect(() => {
    if (state?.success && state?.invoiceId) {
      router.push(`/dashboard/invoices/${state.invoiceId}`)
    }
  }, [state?.success, state?.invoiceId, router])

  return (
    <div className={cn('w-full max-w-sm')}>
      <Card className={cn('w-full max-w-sm border-0', className)}>
        <CardHeader className='-mt-8'>
          <CardTitle></CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <form action={action}>
          <CardContent className='flex flex-col gap-6'>
            <div className='grid gap-2'>
              <Label htmlFor='name'>Name</Label>
              <Input
                id='name'
                name='name'
                aria-describedby='name-error'
                className='mb-7'
                defaultValue={state?.inputs?.name}
              />
            </div>
            <div className='grid gap-2'>
              <Label
                htmlFor='email'
                className="after:ml-0.5 after:text-[#DB4437] after:content-['*']"
              >
                Email
              </Label>
              <Input
                id='email'
                name='email'
                type='email'
                aria-describedby='email-error'
                className={state?.errors?.email ? 'border-[#DB4437]' : 'mb-7'}
                defaultValue={state?.inputs?.email}
              />
              {state?.errors?.email && (
                <p id='email-error' className='text-sm text-[#DB4437]'>
                  {state.errors.email[0]}
                </p>
              )}
            </div>
            <div className='grid gap-2'>
              <Label
                htmlFor='value'
                className="after:ml-0.5 after:text-[#DB4437] after:content-['*']"
              >
                Amount
              </Label>
              <Input
                id='value'
                name='value'
                type='number'
                step='0.01'
                aria-describedby='value-error'
                className={state?.errors?.value ? 'border-[#DB4437]' : 'mb-7'}
                defaultValue={state?.inputs?.value}
              />
              {state?.errors?.value && (
                <p id='value-error' className='text-sm text-[#DB4437]'>
                  {state.errors.value[0]}
                </p>
              )}
            </div>
            <div className='grid gap-2'>
              <Label
                htmlFor='description'
                className="after:ml-0.5 after:text-[#DB4437] after:content-['*']"
              >
                Description
              </Label>
              <Textarea
                id='description'
                name='description'
                aria-describedby='description-error'
                className={
                  state?.errors?.description ? 'border-[#DB4437]' : 'mb-7'
                }
                defaultValue={state?.inputs?.description}
              />
              {state?.errors?.description && (
                <p id='description-error' className='text-sm text-[#DB4437]'>
                  {state.errors.description[0]}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className='flex flex-col gap-4'>
            <Button
              type='submit'
              variant='outline'
              className='w-full'
              disabled={isPending}
              aria-disabled={isPending}
            >
              {isPending ? (
                <IconLoader className='h-4 w-4 animate-spin motion-reduce:hidden' />
              ) : (
                'Submit'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      {state?.message && (
        <div className='mx-auto mt-7 w-full max-w-sm px-6'>
          <Alert
            className={cn(
              'w-full',
              state.success
                ? 'border-[#0F9D58] text-[#0F9D58]'
                : 'border-[#DB4437] text-[#DB4437]'
            )}
          >
            <div className='flex items-start gap-2'>
              {state.success ? (
                <IconCircleCheck className='mt-0.5 h-4 w-4 flex-shrink-0 font-bold text-[#0F9D58]' />
              ) : (
                <IconCircleX className='mt-0.5 h-4 w-4 flex-shrink-0 font-bold text-[#DB4437]' />
              )}
              <AlertDescription
                className={cn(
                  'w-full',
                  state.success ? 'text-[#0F9D58]' : 'text-[#DB4437]'
                )}
              >
                {state.message}
              </AlertDescription>
            </div>
          </Alert>
        </div>
      )}
    </div>
  )
}
