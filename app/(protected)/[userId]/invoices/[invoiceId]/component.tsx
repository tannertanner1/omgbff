'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { IconLoader, IconChevronDown } from '@tabler/icons-react'
import { updateInvoiceStatus, deleteInvoice } from './actions'
import { STATUSES, type Status } from '@/data/invoice-statuses'

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
        <h1 className='text-2xl font-bold'>Invoice {invoice.id}</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='outline'
              className='w-[180px] justify-start px-3'
              disabled={isPending}
            >
              {isPending ? (
                <IconLoader className='h-4 w-4 animate-spin' />
              ) : (
                <>
                  <div
                    className='h-2 w-2 rounded-full'
                    style={{
                      backgroundColor: STATUSES.find(s => s.id === status)
                        ?.color
                    }}
                  />
                  <span className='flex-1 text-left capitalize'>{status}</span>
                  <IconChevronDown className='h-4 w-4 opacity-50' />
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-[180px]'>
            {STATUSES.map(({ id, color }) => (
              <DropdownMenuItem
                key={id}
                onClick={() => updateStatus(id)}
                className='flex items-center gap-2'
              >
                <div
                  className='h-2 w-2 rounded-full'
                  style={{ backgroundColor: color }}
                />
                <span className='capitalize'>{id}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className='space-y-6 text-lg'>
        <div className='flex justify-between'>
          <div>{invoice.customer.email}</div>
          <div className='justify-end text-right'>
            ${(invoice.value / 100).toFixed(2)}
          </div>
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
