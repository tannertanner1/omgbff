import { auth } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import { db } from '@/db'
import { invoices, customers } from '@/db/schema/invoices'
import { eq } from 'drizzle-orm'
import { Back } from '@/components/back'
import { IconCircleChevronLeft } from '@tabler/icons-react'

export default async function Page({
  params
}: {
  params: { userId: string; organizationId: string; invoiceId: string }
}) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  // Verify the user is accessing their own page
  if (session.user.id !== params.userId) {
    redirect(`/${session.user.id}`)
  }

  const [invoice] = await db
    .select()
    .from(invoices)
    .where(eq(invoices.id, parseInt(params.invoiceId, 10)))
    .limit(1)

  if (!invoice) {
    notFound()
  }

  const [customer] = await db
    .select()
    .from(customers)
    .where(eq(customers.id, invoice.customerId))
    .limit(1)

  if (!customer) {
    notFound()
  }

  return (
    <div className='mx-auto w-full max-w-5xl p-4'>
      <div className='mb-8 flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>{invoice.id}</h1>
        <div>
          {/* <Link href={`/${params.userId}/${params.organizationId}`}>
            <IconCircleChevronLeft className='h-6 w-6' />
          </Link> */}
          <Back>
            <IconCircleChevronLeft className='h-6 w-6' />
          </Back>
        </div>
      </div>
      <div>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <p className='text-muted-foreground'>Amount</p>
            <p className='font-medium'>${invoice.value / 100}</p>
          </div>
          <div>
            <p className='capitalize text-muted-foreground'>Status</p>
            <p className='font-medium'>{invoice.status}</p>
          </div>
          <div>
            <p className='text-muted-foreground'>Customer</p>
            <p className='font-medium'>
              {!customer.name
                ? customer.id
                : `${customer.id}, ${customer.name}`}
            </p>
          </div>
          <div>
            <p className='text-muted-foreground'>Email</p>
            <p className='font-medium'>{customer.email}</p>
          </div>
          <div>
            <p className='text-muted-foreground'>Description</p>
            <p className='font-medium'>{invoice.description}</p>
          </div>
          <div>
            <p className='text-muted-foreground'>Created At</p>
            <p className='font-medium'>
              {new Date(invoice.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
      <div className='space-y-4'></div>
      <div className='pt-6'></div>
    </div>
  )
}
