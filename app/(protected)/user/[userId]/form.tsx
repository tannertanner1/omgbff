'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
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
import { IconLoader } from '@tabler/icons-react'

import { createAction } from './actions'
import { ActionResponse } from './types'

const initialState: ActionResponse = {
  success: false,
  message: '',
  errors: undefined,
  inputs: { name: '' }
}

export function Form({
  userId,
  onSuccess
}: {
  userId: string
  onSuccess?: () => void
}) {
  const router = useRouter()
  const [state, action, isPending] = React.useActionState(
    createAction,
    initialState
  )
  React.useEffect(() => {
    if (state?.success && state?.organizationId) {
      if (onSuccess) onSuccess()
      router.push(`/${userId}/${state.organizationId}`)
    }
  }, [state?.success, state?.organizationId, router, userId, onSuccess])

  return (
    <Card className='border-0'>
      <CardHeader className='-mt-8'>
        <CardTitle>Organization</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <form action={action}>
        <CardContent className='flex flex-col gap-6'>
          <div className='mt-5 grid gap-2'>
            <Label htmlFor='name'>Name</Label>
            <Input
              id='name'
              name='name'
              aria-describedby='name-error'
              className={state?.errors?.name ? 'border-[#DB4437]' : 'mb-7'}
              defaultValue={state?.inputs?.name}
            />
            {state?.errors?.name && (
              <p id='name-error' className='text-sm text-[#DB4437]'>
                {state.errors.name[0]}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className='flex flex-col gap-4'>
          <Button
            type='submit'
            className='w-full border border-primary bg-background text-primary hover:bg-primary hover:text-background'
            disabled={isPending}
            aria-disabled={isPending}
          >
            {isPending ? (
              <IconLoader className='h-4 w-4 animate-spin motion-reduce:hidden' />
            ) : (
              'Create'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
