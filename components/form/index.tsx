'use client'

import * as React from 'react'
import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { IconLoader } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

export function Form({
  fields,
  action,
  button = 'Submit',
  data = {},
  title
}: {
  fields: Array<{
    name: string
    label?: string
    type?: 'text' | 'email' | 'number' | 'textarea' | 'hidden'
    required?: boolean
    defaultValue?: string
  }>
  action: (prevState: any, formData: FormData) => Promise<any>
  button?: string
  data?: Record<string, any>
  title?: string
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
    if (state?.success && state?.redirect) {
      router.push(state.redirect)
    }
  }, [state?.success, state?.redirect, router])

  return (
    <div className='mx-auto max-w-5xl p-1'>
      <div className='flex items-center justify-center'>
        <div className={cn('w-full max-w-[30rem]')}>
          <Card className={cn('w-full max-w-[30rem] border-0')}>
            {title && (
              <CardHeader>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
            )}
            <form action={formAction}>
              <CardContent className='space-y-4 p-4'>
                {fields.map(
                  ({ name, label, type = 'text', required, defaultValue }) => (
                    <div key={name} className='space-y-2'>
                      {type !== 'hidden' && label && (
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
                      )}
                      {type === 'textarea' ? (
                        <div>
                          <Textarea
                            id={name}
                            name={name}
                            aria-describedby={`${name}-error`}
                            className={cn(
                              state?.errors?.[name]
                                ? 'border-[#DB4437]'
                                : 'mb-7'
                            )}
                            defaultValue={defaultValue || state?.inputs?.[name]}
                          />
                        </div>
                      ) : (
                        <div>
                          <Input
                            id={name}
                            name={name}
                            type={type}
                            aria-describedby={`${name}-error`}
                            className={cn(
                              state?.errors?.[name]
                                ? 'border-[#DB4437]'
                                : 'mb-7',
                              type === 'hidden' ? 'hidden' : ''
                            )}
                            defaultValue={defaultValue || state?.inputs?.[name]}
                          />
                        </div>
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
              <CardFooter className='flex flex-col gap-2 p-4'>
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
                <div className='py-0.5' />
                <Button
                  variant='ghost'
                  className='w-full border border-accent bg-accent text-primary hover:border-primary hover:bg-primary hover:text-background'
                  disabled={isPending}
                  aria-disabled={isPending}
                  onClick={() => router.back()}
                >
                  {isPending ? (
                    <IconLoader className='h-4 w-4 animate-spin motion-reduce:hidden' />
                  ) : (
                    'Cancel'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
