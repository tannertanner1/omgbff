import { notFound } from 'next/navigation'
import { Form, type Field } from '@/components/form'
import { STATUSES } from '@/data/invoice-statuses'
import { getOrganizationCustomers } from '@/db/queries'
import { createAction } from '../actions'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { IconMoodEmpty } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

export default async function Page({
  params
}: {
  params: Promise<{ userId: string; organizationId: string }>
}) {
  const { userId, organizationId } = await params
  const customers = await getOrganizationCustomers(organizationId)

  if (!customers) return notFound()

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
                  href={`/${userId}/organizations/${organizationId}/customers/new`}
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
                  href={`/${userId}/organizations/${organizationId}`}
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
      name: 'organizationId',
      type: 'hidden',
      defaultValue: organizationId
    },
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
      }))
    },
    {
      name: 'customerId',
      label: 'Customer',
      type: 'select',
      required: true,
      options: customers.map(customer => ({
        label: customer.name,
        value: customer.id
      }))
    },
    {
      name: 'value',
      label: 'Value',
      type: 'number',
      required: true
    }
  ]

  return <Form fields={fields} action={createAction} button='Create' />
}
