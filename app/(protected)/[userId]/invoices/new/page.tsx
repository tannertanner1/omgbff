import { notFound } from 'next/navigation'
import { Form, type Field } from '@/components/form'
import { STATUSES } from '@/data/invoice-statuses'
import { getAllCustomers } from '@/db/queries'
import { createAction } from '../actions'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { IconMoodEmpty } from '@tabler/icons-react'
import { verifySession } from '@/lib/dal'

export default async function Page({
  params
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params
  const customers = await getAllCustomers()

  if (!customers) return notFound()

  const user = await verifySession()
  const hasAccess = user.role === 'admin' || user.role === 'owner'

  if (customers.length === 0) {
    return (
      <div className='flex h-fit'>
        <div className='flex min-w-0 flex-1 flex-col'>
          <div className='container mx-auto w-full max-w-sm'>
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <h1 className='mt-6 text-balance text-4xl font-semibold'>
                <div className='flex items-center justify-center text-muted-foreground'>
                  <IconMoodEmpty className='h-24 w-24' />
                </div>
              </h1>
              <div className='mx-auto mt-6 flex w-full max-w-5xl flex-col justify-center gap-4'>
                <Link
                  href={`/${userId}/customers/new`}
                  className='w-full'
                  prefetch={false}
                >
                  <Button
                    variant='outline'
                    className='w-full border border-primary bg-background text-primary hover:bg-primary hover:text-background'
                  >
                    Create customer
                  </Button>
                </Link>
                <Link
                  href={`/${userId}/invoices`}
                  className='inline-flex'
                  prefetch={false}
                >
                  <Button
                    variant='outline'
                    className='w-full border border-accent bg-accent text-primary hover:border-primary hover:bg-primary hover:text-background'
                  >
                    Go back
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const fields: Field[] = [
    {
      name: 'description',
      label: 'Description',
      type: 'text'
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      defaultValue: 'open',
      options: STATUSES.map(status => ({
        label: status.charAt(0).toUpperCase() + status.slice(1),
        value: status
      })),
      disabled: !hasAccess
    },
    {
      name: 'customerId',
      label: 'Customer',
      type: 'select',
      required: true,
      options: customers.map(customer => ({
        label: `${customer.name} <${customer.email}>`,
        value: customer.id
      }))
    },
    {
      name: 'organizationId',
      label: 'Organization',
      type: 'select',
      required: true,
      options: customers.map(customer => ({
        label: customer.organization.name,
        value: customer.organization.id
      }))
    },
    {
      name: 'amount',
      label: 'Amount',
      type: 'currency',
      required: true,
      step: '0.01'
    }
  ]

  return (
    <Form
      fields={fields}
      action={createAction}
      button='Create'
      data={{ status: 'open' }}
    />
  )
}
