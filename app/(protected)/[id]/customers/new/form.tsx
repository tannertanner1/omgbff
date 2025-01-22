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

export function CustomerForm({ userId }: { userId: string }) {
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
      const result = await createCustomer(userId, null, formData)
      if (result.success) {
        router.refresh()
        router.push(`/${userId}/customers`)
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
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='John Doe' {...field} />
              </FormControl>
              <FormDescription>Customer&apos;s full name</FormDescription>
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
              <FormDescription>Customer&apos;s email address</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='w-full' disabled={isPending}>
          {isPending ? (
            <IconLoader className='mr-2 h-4 w-4 animate-spin' />
          ) : (
            'Add Customer'
          )}
        </Button>
      </form>
    </Form>
  )
}
