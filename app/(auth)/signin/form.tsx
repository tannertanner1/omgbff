import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signin } from './actions'

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

function Form({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form action={signin}>
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col items-center gap-2'>
            <a
              href='#'
              className='flex flex-col items-center gap-2 font-medium'
            >
              <div className='flex h-8 w-8 items-center justify-center rounded-md'>
                <Cat className='size-6' />
              </div>
              <span className='sr-only'>OMG BFF</span>
            </a>
            <h1 className='text-xl font-bold'>Welcome</h1>
          </div>
          <div className='flex flex-col gap-6'>
            <div className='grid gap-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='tanner@tannertanner.me'
                required
              />
            </div>
            <Button type='submit' className='w-full'>
              Continue
            </Button>
          </div>
        </div>
      </form>
      <div className='text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary'>
        By clicking continue, you agree to our <a href='#'>Terms of Service</a>{' '}
        and <a href='#'>Privacy Policy</a>.
      </div>
    </div>
  )
}

export { Form }

/** @see https://ui.shadcn.com/blocks/authentication#login-05 */

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
