import Link from 'next/link'
import { redirect } from 'next/navigation'
import { IconCat } from '@tabler/icons-react'
import { auth } from '@/lib/auth'
import { Form } from '@/components/form'
import { login } from './actions'

export default async function Page() {
  const session = await auth()

  if (session) {
    redirect('/')
  }

  const fields = [
    {
      name: 'email',
      label: 'Email',
      type: 'email' as const,
      required: true
    }
  ]

  return (
    <>
      <div className='mt-12 flex h-fit flex-col items-center gap-2'>
        <Link href='/' className='flex flex-col items-center gap-2 font-medium'>
          <div className='flex items-center justify-center rounded-md'>
            <IconCat className='h-12 w-12' />
          </div>
          <span className='sr-only'>OMG BFF</span>
        </Link>
        <h1 className='mb-2 text-2xl font-bold'>Welcome</h1>
      </div>
      <Form fields={fields} action={login} button='Continue' />
      {/* <div className='text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary'>
        By clicking continue, you agree to our
        <a href='#'>Terms of Service</a>{' '}and <a href='#'>Privacy Policy</a>.
      </div> */}
      <div className='container mx-auto mt-7 text-balance text-center text-xs text-muted-foreground'>
        <div>By clicking continue, you agree to our</div>
        <div>
          <Link
            href='/terms'
            className='relative after:absolute after:bottom-[-4px] after:left-0 after:h-px after:w-full after:origin-bottom-left after:scale-x-100 after:bg-muted-foreground after:transition-transform after:duration-300 hover:after:origin-bottom-right hover:after:scale-x-0'
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            href='/privacy'
            className='relative after:absolute after:bottom-[-4px] after:left-0 after:h-px after:w-full after:origin-bottom-left after:scale-x-100 after:bg-muted-foreground after:transition-transform after:duration-300 hover:after:origin-bottom-right hover:after:scale-x-0'
          >
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </>
  )
}

/**
 * @see https://ui.shadcn.com/blocks/authentication#login-05
 * @see https://v0.dev/chat/CiFWYqPHKvT?b=b_0...&f=0
 * @see https://nextjs.org/docs/app/building-your-application/routing/redirecting
 */

// import { redirect } from 'next/navigation'
// import { auth } from '@/lib/auth'
// import { Form } from './form'

// export default async function Page() {
//   const session = await auth()
//   // Early redirect vs. conditional rendering with redirect
//   if (session) {
//     redirect('/')
//   }

//   return (
//     <div className='flex h-fit'>
//       <div className='flex min-w-0 flex-1 flex-col'>
//         <div className='container mx-auto w-full max-w-5xl'>
//           <div className='flex flex-col items-center py-12'>
//             <Form />
//             {/* {!session ? <Form /> : redirect('/')} */}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

/**

'use client'

import React from 'react'
import { useActionState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import {
  IconCat,
  IconLoader,
  IconCircleCheck,
  IconCircleX
} from '@tabler/icons-react'
import type { ActionResponse } from './types'
import { login } from './actions'

const initialState: ActionResponse = {
  success: false,
  message: '',
  inputs: { email: '' }
}

export function Form() {
  const [state, action, isPending] = useActionState(login, initialState)

  return (
    <div className={'flex flex-col gap-6'}>
      <form action={action}>
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col items-center gap-2'>
            <Link
              href='/'
              className='flex flex-col items-center gap-2 font-medium'
            >
              <div className='flex items-center justify-center rounded-md'>
                <IconCat className='h-12 w-12' />
              </div>
              <span className='sr-only'>OMG BFF</span>
            </Link>
            <h1 className='mb-3.5 text-2xl font-bold'>Welcome</h1>
          </div>
          <div className='flex flex-col gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                name='email'
                placeholder='tanner@tannertanner.me'
                autoComplete='email'
                aria-describedby='email-error'
                className={state?.errors?.email ? 'border-[#DB4437]' : ''}
                defaultValue={state?.inputs?.email}
              />
              {state?.errors?.email && (
                <p id='email-error' className='text-sm text-[#DB4437]'>
                  {state.errors.email[0]}
                </p>
              )}
            </div>
            <Button
              type='submit'
              // className={cn('w-full', state?.errors?.email ? '' : 'mt-7')}
              className={cn(
                // 'w-full border border-background bg-primary text-background hover:border-primary hover:bg-background hover:text-primary',
                'w-full border border-primary bg-background text-primary hover:bg-primary hover:text-background',
                state?.errors?.email ? '' : 'mt-7'
              )}
              disabled={isPending}
              aria-disabled={isPending}
            >
              {isPending ? (
                <IconLoader className='h-4 w-4 animate-spin motion-reduce:hidden' />
              ) : (
                'Continue'
              )}
            </Button>
          </div>
        </div>
      </form>

      {state?.message && (
        <div className='inline-flex'>
          <Alert
            className={`w-full ${state.success ? 'border-[#0F9D58] text-[#0F9D58]' : 'border-[#DB4437] text-[#DB4437]'}`}
          >
            <div className='flex items-start gap-2'>
              {state.success ? (
                <IconCircleCheck className='mt-0.5 h-4 w-4 flex-shrink-0 font-bold text-[#0F9D58]' />
              ) : (
                <IconCircleX className='mt-0.5 h-4 w-4 flex-shrink-0 font-bold text-[#DB4437]' />
              )}
              <AlertDescription
                className={`w-full ${state.success ? 'text-[#0F9D58]' : 'text-[#DB4437]'}`}
              >
                {state.message}
              </AlertDescription>
            </div>
          </Alert>
        </div>
      )}
      <div className='container mx-auto text-balance text-center text-xs text-muted-foreground'>
        <div>By clicking continue, you agree to our</div>
        <div>
          <Link
            href='/terms'
            className='relative after:absolute after:bottom-[-4px] after:left-0 after:h-px after:w-full after:origin-bottom-left after:scale-x-100 after:bg-muted-foreground after:transition-transform after:duration-300 hover:after:origin-bottom-right hover:after:scale-x-0'
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            href='privacy'
            className='relative after:absolute after:bottom-[-4px] after:left-0 after:h-px after:w-full after:origin-bottom-left after:scale-x-100 after:bg-muted-foreground after:transition-transform after:duration-300 hover:after:origin-bottom-right hover:after:scale-x-0'
          >
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </div>
  )
}

 */
