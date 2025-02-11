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
import { IconLoader, IconCircleCheck, IconCircleX } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Currency } from '@/components/currency'

export type Field = {
  name: string
  label?: string
  type?:
    | 'text'
    | 'email'
    | 'number'
    | 'textarea'
    | 'hidden'
    | 'select'
    | 'currency'
  required?: boolean
  defaultValue?: string
  min?: number
  step?: string
  options?: Array<{ label: string; value: string }>
  disabled?: boolean
}

export function Form({
  fields,
  action,
  button = 'Submit',
  data = {},
  title
}: {
  fields: Field[]
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
    <div className='h-fit'>
      <div className='flex min-w-0 flex-1 flex-col'>
        <div className='mx-auto w-full max-w-5xl'>
          <div className='flex flex-col items-center'>
            <div className='w-full max-w-sm'>
              <Card className='w-full max-w-sm border-0'>
                {title && (
                  <CardHeader className='-mt-3 mb-2 text-xl font-semibold'>
                    <CardTitle>{title}</CardTitle>
                  </CardHeader>
                )}
                <form action={formAction} noValidate>
                  <CardContent className='flex flex-col pt-4'>
                    {fields.map(
                      ({
                        name,
                        label,
                        type = 'text',
                        required,
                        defaultValue,
                        min,
                        options,
                        disabled,
                        step
                      }) => (
                        <div key={name} className='grid gap-2'>
                          {type !== 'hidden' && label && (
                            <Label
                              htmlFor={name}
                              className={cn(
                                'mt-6',
                                required
                                  ? "after:ml-0.5 after:text-[#DB4437] after:content-['*']"
                                  : ''
                              )}
                            >
                              {label}
                            </Label>
                          )}
                          {type === 'textarea' ? (
                            <Textarea
                              id={name}
                              name={name}
                              aria-describedby={`${name}-error`}
                              className={cn(
                                state?.errors?.[name]
                                  ? 'border-[#DB4437]'
                                  : 'mb-7'
                              )}
                              defaultValue={
                                defaultValue || state?.inputs?.[name]
                              }
                              required={required}
                              disabled={disabled}
                            />
                          ) : type === 'select' ? (
                            <Select
                              name={name}
                              defaultValue={
                                defaultValue || state?.inputs?.[name]
                              }
                              required={required}
                              disabled={disabled}
                            >
                              <SelectTrigger
                                className={cn(
                                  state?.errors?.[name]
                                    ? 'border-[#DB4437]'
                                    : 'mb-7'
                                )}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {options?.map(option => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : type === 'currency' ? (
                            <Currency
                              id={name}
                              name={name}
                              aria-describedby={`${name}-error`}
                              className={cn(
                                state?.errors?.[name]
                                  ? 'border-[#DB4437]'
                                  : 'mb-7'
                              )}
                              defaultValue={
                                defaultValue || state?.inputs?.[name]
                              }
                              required={required}
                              disabled={disabled}
                            />
                          ) : (
                            <Input
                              id={name}
                              name={name}
                              type={type}
                              min={min}
                              step={step}
                              aria-describedby={`${name}-error`}
                              className={cn(
                                state?.errors?.[name]
                                  ? 'border-[#DB4437]'
                                  : 'mb-7',
                                type === 'hidden' ? 'hidden' : ''
                              )}
                              defaultValue={
                                defaultValue || state?.inputs?.[name]
                              }
                              required={required}
                              disabled={disabled}
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
                <div className='mx-auto mt-[0.25rem] w-full max-w-sm px-6'>
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
      </div>
    </div>
  )
}
