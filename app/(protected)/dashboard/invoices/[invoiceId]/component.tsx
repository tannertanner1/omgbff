'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { IconLoader } from '@tabler/icons-react'
import { updateInvoiceStatus, deleteInvoice } from './actions'
import type { Status } from '@/db/schema/invoices'

const statusConfig: Record<Status, { bg: string; text: string }> = {
  open: { bg: 'bg-[#4285F4]', text: 'text-[#4285F4]' },
  paid: { bg: 'bg-[#0F9D58]', text: 'text-[#0F9D58]' },
  void: { bg: 'bg-[#F4B400]', text: 'text-[#F4B400]' },
  uncollectible: { bg: 'bg-[#DB4437]', text: 'text-[#DB4437]' }
}

export function Invoice({
  invoice
}: {
  invoice: {
    id: number
    status: Status
    value: number
    description: string
    customer: {
      name: string
      email: string
    }
  }
}) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()
  const [status, setStatus] = React.useState<Status>(invoice.status)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const updateStatus = (newStatus: Status) => {
    startTransition(async () => {
      const formData = new FormData()
      formData.set('invoiceId', invoice.id.toString())
      formData.set('status', newStatus)

      const result = await updateInvoiceStatus(null, formData)
      if (result.success) {
        setStatus(newStatus)
        router.refresh()
      }
    })
  }

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsDeleting(true)
    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement)
      const result = await deleteInvoice(formData)
      if (result.success) {
        router.push('/dashboard/invoices')
      } else {
        setIsDeleting(false)
      }
    } catch (error) {
      console.error('Delete failed:', error)
      setIsDeleting(false)
    }
  }

  return (
    <div className='mx-auto w-full max-w-2xl p-6'>
      <div className='mb-8 flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Invoice #{invoice.id}</h1>
        <Select
          value={status}
          onValueChange={updateStatus}
          disabled={isPending}
        >
          <SelectTrigger
            className={cn(
              'w-[144px] border capitalize text-background',
              statusConfig[status].bg
            )}
          >
            <SelectValue>
              {isPending ? (
                <IconLoader className='h-4 w-4 animate-spin' />
              ) : (
                status
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className='border-zinc-800 bg-background'>
            {(Object.keys(statusConfig) as Status[]).map(value => (
              <SelectItem
                key={value}
                value={value}
                className={cn(
                  'bg-transparent capitalize',
                  statusConfig[value].text
                )}
              >
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-6 text-lg'>
        <div>
          <span className='text-zinc-400'>Email:</span> {invoice.customer.email}
        </div>
        <div>
          <span className='text-zinc-400'>Amount:</span> $
          {(invoice.value / 100).toFixed(2)}
        </div>
        <div>
          <span className='text-zinc-400'>Description:</span>{' '}
          {invoice.description}
        </div>
      </div>

      <form onSubmit={handleDelete} className='mt-8'>
        <input type='hidden' name='invoiceId' value={invoice.id} />
        <Button
          type='submit'
          variant='destructive'
          className='w-full border border-[#DB4437] bg-background text-[#DB4437] hover:bg-[#DB4437] hover:text-background'
          disabled={isDeleting}
        >
          {isDeleting ? (
            <IconLoader className='h-4 w-4 animate-spin' />
          ) : (
            'Delete'
          )}
        </Button>
      </form>
    </div>
  )
}
