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

import { organizationSchema } from './schema'
import { createOrganization } from './actions'

export function OrganizationForm({ userId }: { userId: string }) {
  const router = useRouter()
  const [isPending, setPending] = useState(false)

  const form = useForm({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: ''
    }
  })

  async function onSubmit(data: { name: string }) {
    setPending(true)
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      const result = await createOrganization(userId, null, formData)
      if (result.success) {
        router.refresh()
        router.push(`/${userId}/organizations`)
      } else {
        // Handle error
        console.error(result.message)
      }
    } catch (error) {
      console.error('Failed to create organization:', error)
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
                <Input placeholder='My Organization' {...field} />
              </FormControl>
              <FormDescription>
                This is your organization&apos;s name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='w-full' disabled={isPending}>
          {isPending ? (
            <IconLoader className='mr-2 h-4 w-4 animate-spin' />
          ) : (
            'Create Organization'
          )}
        </Button>
      </form>
    </Form>
  )
}
