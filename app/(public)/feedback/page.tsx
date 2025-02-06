import { feedback } from './actions'
import { Form } from '@/components/form'

export default function Page() {
  const fields = [
    {
      name: 'name',
      label: 'Name',
      type: 'text' as const
    },
    {
      name: 'message',
      label: 'Message',
      type: 'textarea' as const,
      required: true
    }
  ]

  return <Form fields={fields} action={feedback} button='Submit' />
}

// import { Form } from './form'

// export default async function Page() {
//   return (
//     <div className='flex h-fit'>
//       <div className='flex min-w-0 flex-1 flex-col'>
//         <div className='mx-auto w-full max-w-5xl'>
//           <div className='flex flex-col items-center'>
//             <Form />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

/**

'use client'

import * as React from 'react'
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

import { feedback } from './actions'
import { ActionResponse } from './types'

const initialState: ActionResponse = {
  success: false,
  message: '',
  errors: undefined,
  inputs: { name: '', message: '' }
}

export function Form({ className }: React.ComponentProps<typeof Card>) {
  const [state, action, isPending] = React.useActionState(
    feedback,
    initialState
  )

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
              {state?.errors?.name && (
                <p id='name-error' className='text-sm text-[#DB4437]'>
                  {state.errors.name[0]}
                </p>
              )}
            </div>
            <div className='grid gap-2'>
              <Label
                htmlFor='message'
                className="after:ml-0.5 after:text-[#DB4437] after:content-['*']"
              >
                Message
              </Label>
              <Textarea
                id='message'
                name='message'
                aria-describedby='message-error'
                className={state?.errors?.message ? 'border-[#DB4437]' : 'mb-7'}
                defaultValue={state?.inputs?.message}
              />
              {state?.errors?.message && (
                <p id='message-error' className='text-sm text-[#DB4437]'>
                  {state.errors.message[0]}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className='flex flex-col gap-4'>
            <Button
              type='submit'
              variant='outline'
              className={cn(
                // 'w-full border border-background bg-primary text-background hover:border-primary hover:bg-background hover:text-primary',
                'w-full border border-primary bg-background text-primary hover:bg-primary hover:text-background',
                state?.errors?.message ? '' : ''
              )}
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
  )
}

 */
