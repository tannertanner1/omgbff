'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { ActionResponse } from '@/types/auth'
import { useActionState } from 'react'
import { signin } from './actions'

const initialState: ActionResponse = {
  success: false,
  message: ''
}

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [state, action, isPending] = useActionState(signin, initialState)
  const [clientError, setClientError] = useState<ActionResponse | null>(null)

  const handleSubmit = async (formData: FormData) => {
    const email = formData.get('email') as string
    if (!email || !email.includes('@')) {
      setClientError({
        success: false,
        message: 'Please enter a valid email address',
        errors: { email: ['Invalid email address'] }
      })
      return // Prevent form submission
    }
    setClientError(null)
    await action(formData)
  }

  const displayState = clientError || state

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form
        action={handleSubmit}
        noValidate // Disable HTML5 validation
      >
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col items-center gap-2'>
            <Link
              href='/'
              className='flex flex-col items-center gap-2 font-medium'
            >
              <div className='flex h-8 w-8 items-center justify-center rounded-md'>
                <Cat className='size-6' />
              </div>
              <span className='sr-only'>OMG BFF</span>
            </Link>
            <h1 className='text-xl font-bold'>Welcome</h1>
          </div>
          <div className='flex flex-col gap-6'>
            <div className='grid gap-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                name='email'
                type='email'
                placeholder='tanner@tannertanner.me'
                aria-describedby='email-error'
                className={cn(displayState?.errors?.email && 'border-red-500')}
                // noValidate // Disable HTML5 validation
              />
              {displayState?.errors?.email && (
                <p id='email-error' className='text-sm text-red-500'>
                  {displayState.errors.email[0]}
                </p>
              )}
            </div>
            <Button type='submit' className='w-full'>
              Continue
            </Button>
          </div>
        </div>
      </form>
      {displayState?.message && (
        <div className='inline-flex'>
          <Alert
            variant={displayState.success ? 'default' : 'destructive'}
            className='w-full'
          >
            <div className='flex items-start gap-2'>
              {displayState.success ? (
                <CircleCheck className='mt-0.5 h-4 w-4 flex-shrink-0' />
              ) : (
                <CircleX className='mt-0.5 h-4 w-4 flex-shrink-0' />
              )}
              <AlertDescription>{displayState.message}</AlertDescription>
            </div>
          </Alert>
        </div>
      )}
      <div className='text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary'>
        By clicking continue, you agree to our <a href='#'>Terms of Service</a>{' '}
        and <a href='#'>Privacy Policy</a>.
      </div>
    </div>
  )
}

// 'use client'

// import React, { useState } from 'react'
// import Link from 'next/link'
// import { cn } from '@/lib/utils'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Alert, AlertDescription } from '@/components/ui/alert'
// import type { ActionResponse } from '@/types/auth'
// import { useActionState } from 'react'
// import { signin } from './actions'

// const initialState: ActionResponse = {
//   success: false,
//   message: ''
// }

// export function Form({
//   className,
//   ...props
// }: React.ComponentPropsWithoutRef<'div'>) {
//   const [state, action, isPending] = useActionState(signin, initialState)
//   const [clientError, setClientError] = useState<ActionResponse | null>(null)

//   const handleSubmit = async (formData: FormData) => {
//     const email = formData.get('email') as string
//     if (!email || !email.includes('@')) {
//       setClientError({
//         success: false,
//         message: 'Please enter a valid email address',
//         errors: { email: ['Invalid email address'] }
//       })
//     } else {
//       setClientError(null)
//       await action(formData)
//     }
//   }

//   const displayState = clientError || state

//   return (
//     <div className={cn('flex flex-col gap-6', className)} {...props}>
//       <form action={handleSubmit}>
//         <div className='flex flex-col gap-6'>
//           <div className='flex flex-col items-center gap-2'>
//             <Link
//               href='/'
//               className='flex flex-col items-center gap-2 font-medium'
//             >
//               <div className='flex h-8 w-8 items-center justify-center rounded-md'>
//                 <Cat className='size-6' />
//               </div>
//               <span className='sr-only'>OMG BFF</span>
//             </Link>
//             <h1 className='text-xl font-bold'>Welcome</h1>
//           </div>
//           <div className='flex flex-col gap-6'>
//             <div className='grid gap-2'>
//               <Label htmlFor='email'>Email</Label>
//               <Input
//                 id='email'
//                 name='email'
//                 type='email'
//                 placeholder='tanner@tannertanner.me'
//                 aria-describedby='email-error'
//                 className={cn(displayState?.errors?.email && 'border-red-500')}
//               />
//               {displayState?.errors?.email && (
//                 <p id='email-error' className='text-sm text-red-500'>
//                   {displayState.errors.email[0]}
//                 </p>
//               )}
//             </div>
//             <Button type='submit' className='w-full'>
//               Continue
//             </Button>
//           </div>
//         </div>
//       </form>
//       {displayState?.message && (
//         <div className='inline-flex'>
//           <Alert variant={displayState.success ? 'default' : 'destructive'}>
//             {displayState.success ? (
//               <CircleCheck className='h-4 w-4 flex-shrink-0' />
//             ) : (
//               <CircleX className='-mt-1' />
//             )}
//             <AlertDescription>
//               <div className='ml-2 mt-1'>{displayState.message}</div>
//             </AlertDescription>
//           </Alert>
//         </div>
//       )}
//       <div className='text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary'>
//         By clicking continue, you agree to our <a href='#'>Terms of Service</a>{' '}
//         and <a href='#'>Privacy Policy</a>.
//       </div>
//     </div>
//   )
// }

// 'use client'

// import React from 'react'
// import Link from 'next/link'
// import { cn } from '@/lib/utils'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'

// import { Alert, AlertDescription } from '@/components/ui/alert'
// import type { ActionResponse } from '@/types/auth'
// import { useActionState } from 'react'
// import { signin } from './actions'

// const initialState: ActionResponse = {
//   success: false,
//   message: ''
// }

// export function Form({
//   className,
//   ...props
// }: React.ComponentPropsWithoutRef<'div'>) {
//   const [state, action, isPending] = useActionState(signin, initialState)

//   return (
//     <div className={cn('flex flex-col gap-6', className)} {...props}>
//       <form action={action}>
//         <div className='flex flex-col gap-6'>
//           <div className='flex flex-col items-center gap-2'>
//             <Link
//               href='/'
//               className='flex flex-col items-center gap-2 font-medium'
//             >
//               <div className='flex h-8 w-8 items-center justify-center rounded-md'>
//                 <Cat className='size-6' />
//               </div>
//               <span className='sr-only'>OMG BFF</span>
//             </Link>
//             <h1 className='text-xl font-bold'>Welcome</h1>
//           </div>
//           <div className='flex flex-col gap-6'>
//             <div className='grid gap-2'>
//               <Label htmlFor='email'>Email</Label>
//               <Input
//                 id='email'
//                 name='email'
//                 type='email'
//                 placeholder='tanner@tannertanner.me'
//                 // required
//                 aria-describedby='email-error'
//                 className={cn(state?.errors?.email && 'border-red-500')}
//               />
//               {state?.errors?.email && (
//                 <p id='email-error' className='text-sm text-red-500'>
//                   {state.errors.email[0]}
//                 </p>
//               )}
//             </div>
//             <Button type='submit' className='w-full' disabled={isPending}>
//               {isPending ? (
//                 <>
//                   <Loader className='h-4 w-4 animate-spin motion-reduce:hidden' />
//                 </>
//               ) : (
//                 'Continue'
//               )}
//             </Button>
//           </div>
//         </div>
//       </form>
//       {state?.message && (
//         <Alert variant={state.success ? 'default' : 'destructive'}>
//           {state.success && <CircleCheck className='h-4 w-4' />}
//           <AlertDescription>{state.message}</AlertDescription>
//         </Alert>
//       )}
//       <div className='text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary'>
//         By clicking continue, you agree to our <a href='#'>Terms of Service</a>{' '}
//         and <a href='#'>Privacy Policy</a>.
//       </div>
//     </div>
//   )
// }

function Cat(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
      <path d='M20 3v10a8 8 0 1 1 -16 0v-10l3.432 3.432a7.963 7.963 0 0 1 4.568 -1.432c1.769 0 3.403 .574 4.728 1.546l3.272 -3.546z' />
      <path d='M2 16h5l-4 4' />
      <path d='M22 16h-5l4 4' />
      <path d='M12 16m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0' />
      <path d='M9 11v.01' />
      <path d='M15 11v.01' />
    </svg>
  )
}

function Loader(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
      <path d='M12 6l0 -3' />
      <path d='M16.25 7.75l2.15 -2.15' />
      <path d='M18 12l3 0' />
      <path d='M16.25 16.25l2.15 2.15' />
      <path d='M12 18l0 3' />
      <path d='M7.75 16.25l-2.15 2.15' />
      <path d='M6 12l-3 0' />
      <path d='M7.75 7.75l-2.15 -2.15' />
    </svg>
  )
}

function CircleCheck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
      <path d='M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0' />
      <path d='M9 12l2 2l4 -4' />
    </svg>
  )
}

function CircleX(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
      <path d='M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0' />
      <path d='M10 10l4 4m0 -4l-4 4' />
    </svg>
  )
}

/**
 * @see https://ui.shadcn.com/blocks/authentication#login-05
 * @see https://v0.dev/chat/CiFWYqPHKvT?b=b_0...&f=0
 */

// import Link from 'next/link'

// import { Button } from '@/components/ui/button'
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle
// } from '@/components/ui/card'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'

// import { signin } from './actions'

// export function Form() {
//   return (
//     <div className='flex w-full max-w-sm flex-col gap-6'>
//       <a href='#' className='flex items-center gap-2 self-center font-medium'>
//         <div className='flex h-6 w-6 items-center justify-center rounded-xl bg-primary text-primary-foreground' />
//         My App
//       </a>
//       <Card className='mx-auto max-w-sm'>
//         <CardHeader>
//           <CardTitle className='text-2xl'>Sign in</CardTitle>
//           <CardDescription>
//             Enter your email below to sign in to your account
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form action={signin}>
//             <div className='grid gap-4'>
//               <div className='grid gap-2'>
//                 <Label htmlFor='email'>Email</Label>
//                 <Input
//                   id='email'
//                   type='email'
//                   placeholder='m@example.com'
//                   required
//                 />
//               </div>
//               <Button type='submit' className='w-full'>
//                 Continue
//               </Button>
//             </div>
//             <div className='mt-4 text-center text-sm'>
//               Don&apos;t have an account?{' '}
//               <Link href='#' className='underline'>
//                 Sign up
//               </Link>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
