'use client'

import * as React from 'react'
import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription
} from '@/components/ui/card'
import { IconLoader, IconCircleCheck, IconCircleX } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

export function Component({
  fields,
  action,
  button = 'Submit',
  data = {}
}: {
  fields: Array<{
    name: string
    label: string
    type?: 'text' | 'email' | 'number' | 'textarea'
    required?: boolean
    defaultValue?: string
  }>
  action: (prevState: any, formData: FormData) => Promise<any>
  button?: string
  data?: Record<string, any>
}) {
  const router = useRouter()
  const initialState = {
    success: false,
    message: '',
    errors: {},
    inputs: data,
    redirect: null
  }

  const [state, formAction, isPending] = useActionState(action, initialState)

  React.useEffect(() => {
    if (state?.success && state.redirect) {
      router.push(state.redirect)
    }
  }, [state?.success, state?.redirect, router])

  return (
    <div className='mx-auto max-w-5xl'>
      <div className='flex items-center justify-center'>
        <div className={cn('w-full max-w-[30rem]')}>
          <Card className={cn('w-full max-w-[30rem] border-0')}>
            <CardHeader className='-mt-8'>
              <CardTitle></CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <form action={formAction}>
              <CardContent className='flex flex-col gap-6'>
                {fields.map(
                  ({ name, label, type = 'text', required, defaultValue }) => (
                    <div key={name} className='grid gap-2'>
                      <Label
                        htmlFor={name}
                        className={
                          required
                            ? "after:ml-0.5 after:text-[#DB4437] after:content-['*']"
                            : ''
                        }
                      >
                        {label}
                      </Label>
                      {type === 'textarea' ? (
                        <Textarea
                          id={name}
                          name={name}
                          aria-describedby={`${name}-error`}
                          className={
                            state?.errors?.[name] ? 'border-[#DB4437]' : 'mb-7'
                          }
                          defaultValue={defaultValue || state?.inputs?.[name]}
                        />
                      ) : (
                        <Input
                          id={name}
                          name={name}
                          type={type}
                          aria-describedby={`${name}-error`}
                          className={
                            state?.errors?.[name] ? 'border-[#DB4437]' : 'mb-7'
                          }
                          defaultValue={defaultValue || state?.inputs?.[name]}
                        />
                      )}
                      {state?.errors?.[name] && (
                        <p
                          id={`${name}-error`}
                          className='text-sm text-[#DB4437]'
                        >
                          {state.errors[name][0]}
                        </p>
                      )}
                    </div>
                  )
                )}
              </CardContent>
              <CardFooter className='flex flex-col gap-4'>
                <Button
                  type='submit'
                  variant='outline'
                  className='w-full border border-primary bg-background text-primary hover:bg-primary hover:text-background'
                  disabled={isPending}
                  aria-disabled={isPending}
                >
                  {isPending ? (
                    <IconLoader className='h-4 w-4 animate-spin motion-reduce:hidden' />
                  ) : (
                    button
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
          {state?.message && (
            <div className='mx-auto mt-7 w-full max-w-[30rem] px-6'>
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
      </div>
    </div>
  )
}
