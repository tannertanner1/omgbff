'use client'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer'
import { useMediaQuery } from '@/hooks/use-media-query'
import { Component } from './component'
import { cn } from '@/lib/utils'

export function Form({
  fields,
  action,
  button,
  data,
  open = true
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
  open?: boolean
}) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const FormContent = (
    <Component fields={fields} action={action} button={button} data={data} />
  )

  return isDesktop ? (
    <Dialog open={open}>
      <DialogContent>
        <DialogTitle className='sr-only'>Form</DialogTitle>
        <div className={cn('pb-3 pt-1.5')}>{FormContent}</div>
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer open={open}>
      <DrawerContent>
        <DrawerTitle className='sr-only'>Form</DrawerTitle>
        <div className={cn('-pt-0.5 p-1 px-0.5 pb-1')}>{FormContent}</div>
      </DrawerContent>
    </Drawer>
  )
}

// 'use client'
// import { Dialog, DialogContent } from '@/components/ui/dialog'
// import { Drawer, DrawerContent } from '@/components/ui/drawer'
// import { useMediaQuery } from '@/hooks/use-media-query'
// import { Component } from './component'

// export function Form({
//   fields,
//   action,
//   button,
//   data,
//   open = true
// }: {
//   fields: Array<{
//     name: string
//     label: string
//     type?: 'text' | 'email' | 'number' | 'textarea'
//     required?: boolean
//     defaultValue?: string
//   }>
//   action: (prevState: any, formData: FormData) => Promise<any>
//   button?: string
//   data?: Record<string, any>
//   open?: boolean
// }) {
//   const isDesktop = useMediaQuery('(min-width: 768px)')
//   const FormContent = (
//     <Component fields={fields} action={action} button={button} data={data} />
//   )

//   return isDesktop ? (
//     <Dialog open={open}>
//       <DialogContent>{FormContent}</DialogContent>
//     </Dialog>
//   ) : (
//     <Drawer open={open}>
//       <DrawerContent>{FormContent}</DrawerContent>
//     </Drawer>
//   )
// }

/**
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

export function Form({
  fields,
  action,
  button = 'Submit'
}: {
  fields: Array<{
    name: string
    label: string
    type?: 'text' | 'email' | 'number' | 'textarea'
    required?: boolean
  }>
  action: (prevState: any, formData: FormData) => Promise<any>
  button?: string
}) {
  const router = useRouter()
  const initialState = {
    success: false,
    message: '',
    errors: {},
    inputs: {},
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
                {fields.map(({ name, label, type = 'text', required }) => (
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
                        defaultValue={state?.inputs?.[name]}
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
                        defaultValue={state?.inputs?.[name]}
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
                ))}
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
*/
