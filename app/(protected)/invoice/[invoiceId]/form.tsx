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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { IconLoader } from '@tabler/icons-react'

import { invoiceSchema } from './schema'
import { createInvoice } from './actions'

export function InvoiceForm({
  userId,
  organizationId,
  customers
}: {
  userId: string
  organizationId: string
  customers: Array<{ id: number; name: string }>
}) {
  const router = useRouter()
  const [isPending, setPending] = useState(false)

  const form = useForm({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      customerId: '',
      amount: '',
      description: ''
    }
  })

  async function onSubmit(data: {
    customerId: string
    amount: string
    description: string
  }) {
    setPending(true)
    try {
      const formData = new FormData()
      formData.append('customerId', data.customerId)
      formData.append('amount', data.amount)
      formData.append('description', data.description)
      const result = await createInvoice(organizationId, null, formData)
      if (result.success) {
        router.refresh()
        router.push(`/${userId}/${organizationId}`)
      } else {
        // Handle error
        console.error(result.message)
      }
    } catch (error) {
      console.error('Failed to create invoice:', error)
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
          name='customerId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a customer' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {customers.map(customer => (
                    <SelectItem
                      key={customer.id}
                      value={customer.id.toString()}
                    >
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the customer for this invoice.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='amount'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type='number' step='0.01' {...field} />
              </FormControl>
              <FormDescription>
                Enter the invoice amount in dollars.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder='Invoice for services rendered' {...field} />
              </FormControl>
              <FormDescription>
                Provide a brief description of the invoice.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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
      </form>
    </Form>
  )
}
