'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { IconCircleCheck, IconCircleX, IconLoader } from '@tabler/icons-react'
import { createOrganization } from './actions'
import { cn } from '@/lib/utils'

const initialState = {
  success: false,
  message: '',
  errors: undefined,
  inputs: { name: '' }
}

export function Form({ className }: React.ComponentProps<typeof Card>) {
  const router = useRouter()
  const [state, action, isPending] = React.useActionState(
    createOrganization,
    initialState
  )

  React.useEffect(() => {
    if (state?.success) {
      router.push('/dashboard/organizations')
    }
  }, [state, router])

  return (
    <div className={cn('w-full max-w-sm')}>
      <Card className={cn('w-full max-w-sm border-0', className)}>
        <CardHeader>
          <CardTitle>Create Organization</CardTitle>
          <CardDescription>
            Create a new organization to manage invoices
          </CardDescription>
        </CardHeader>
        <form action={action}>
          <CardContent className='space-y-4'>
            <div className='grid gap-2'>
              <Label htmlFor='name'>Organization Name</Label>
              <Input
                id='name'
                name='name'
                placeholder='Enter organization name'
                required
                aria-describedby='name-error'
                className={state?.errors?.name ? 'border-destructive' : ''}
                defaultValue={state?.inputs?.name}
              />
              {state?.errors?.name && (
                <p id='name-error' className='text-sm text-destructive'>
                  {state.errors.name[0]}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type='submit' className='w-full' disabled={isPending}>
              {isPending ? (
                <IconLoader className='h-4 w-4 animate-spin motion-reduce:hidden' />
              ) : (
                'Create Organization'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      {state?.message && (
        <div className='mx-auto mt-4 w-full max-w-sm'>
          <Alert
            className={cn(
              'w-full',
              state.success
                ? 'border-success text-success'
                : 'border-destructive text-destructive'
            )}
          >
            <div className='flex items-start gap-2'>
              {state.success ? (
                <IconCircleCheck className='h-4 w-4' />
              ) : (
                <IconCircleX className='h-4 w-4' />
              )}
              <AlertDescription>{state.message}</AlertDescription>
            </div>
          </Alert>
        </div>
      )}
    </div>
  )
}

// 'use client'

// import * as React from 'react'
// import { useRouter } from 'next/navigation'
// import { useMediaQuery } from '@/hooks/use-media-query'
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle
// } from '@/components/ui/card'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Button } from '@/components/ui/button'
// import { Alert, AlertDescription } from '@/components/ui/alert'
// import { IconCircleCheck, IconCircleX, IconLoader } from '@tabler/icons-react'
// import { createOrganization } from './actions'
// import { cn } from '@/lib/utils'

// const initialState = {
//   success: false,
//   message: '',
//   errors: undefined,
//   inputs: { name: '' }
// }

// export function Form({ className }: React.ComponentProps<typeof Card>) {
//   const router = useRouter()
//   const [state, action, isPending] = React.useActionState(
//     createOrganization,
//     initialState
//   )

//   React.useEffect(() => {
//     if (state?.success) {
//       router.push('/dashboard/organizations')
//     }
//   }, [state, router])

//   return (
//     <div className={cn('w-full max-w-sm')}>
//       <Card className={cn('w-full max-w-sm border-0', className)}>
//         <CardHeader>
//           <CardTitle>Create Organization</CardTitle>
//           <CardDescription>
//             Create a new organization to manage invoices
//           </CardDescription>
//         </CardHeader>
//         <form action={action}>
//           <CardContent className='space-y-4'>
//             <div className='grid gap-2'>
//               <Label htmlFor='name'>Organization Name</Label>
//               <Input
//                 id='name'
//                 name='name'
//                 placeholder='Enter organization name'
//                 required
//                 aria-describedby='name-error'
//                 className={state?.errors?.name ? 'border-destructive' : ''}
//                 defaultValue={state?.inputs?.name}
//               />
//               {state?.errors?.name && (
//                 <p id='name-error' className='text-sm text-destructive'>
//                   {state.errors.name[0]}
//                 </p>
//               )}
//             </div>
//           </CardContent>
//           <CardFooter>
//             <Button type='submit' className='w-full' disabled={isPending}>
//               {isPending ? (
//                 <IconLoader className='h-4 w-4 animate-spin motion-reduce:hidden' />
//               ) : (
//                 'Create Organization'
//               )}
//             </Button>
//           </CardFooter>
//         </form>
//       </Card>
//       {state?.message && (
//         <div className='mx-auto mt-4 w-full max-w-sm'>
//           <Alert
//             className={cn(
//               'w-full',
//               state.success
//                 ? 'border-success text-success'
//                 : 'border-destructive text-destructive'
//             )}
//           >
//             <div className='flex items-start gap-2'>
//               {state.success ? (
//                 <IconCircleCheck className='h-4 w-4' />
//               ) : (
//                 <IconCircleX className='h-4 w-4' />
//               )}
//               <AlertDescription>{state.message}</AlertDescription>
//             </div>
//           </Alert>
//         </div>
//       )}
//     </div>
//   )
// }
