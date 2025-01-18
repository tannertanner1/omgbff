'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { IconLoader } from '@tabler/icons-react'

import { customerSchema } from './schema'
import { createCustomer } from './actions'

export function CustomerForm({
  userId,
  organizationId
}: {
  userId: string
  organizationId: string
}) {
  const router = useRouter()
  const [isPending, setPending] = useState(false)

  const form = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      email: ''
    }
  })

  async function onSubmit(data: { name: string; email: string }) {
    setPending(true)
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('email', data.email)
      const result = await createCustomer(organizationId, null, formData)
      if (result.success) {
        router.refresh()
        router.push(`/${userId}/${organizationId}`)
      } else {
        // Handle error
        console.error(result.message)
      }
    } catch (error) {
      console.error('Failed to create customer:', error)
    } finally {
      setPending(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='-mt-8 space-y-8 p-4'
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='John Doe' {...field} />
              </FormControl>
              <FormDescription>
                This is the customer&apos;s full name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type='email' placeholder='john@example.com' {...field} />
              </FormControl>
              <FormDescription>
                This is the customer&apos;s email address.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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
            'Create'
          )}
        </Button>
      </form>
    </Form>
  )
}
