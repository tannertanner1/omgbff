import { auth } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import { db } from '@/db'
import { customers, invoices } from '@/db/schema/invoices'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import { Back } from '@/components/back'
import { IconCircleChevronLeft } from '@tabler/icons-react'

export default async function Page({
  params
}: {
  params: { userId: string; organizationId: string; customerId: string }
}) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  // Verify the user is accessing their own page
  if (session.user.id !== params.userId) {
    redirect(`/${session.user.id}`)
  }

  const [customer] = await db
    .select()
    .from(customers)
    .where(eq(customers.id, parseInt(params.customerId, 10)))
    .limit(1)

  if (!customer) {
    notFound()
  }

  const customerInvoices = await db
    .select()
    .from(invoices)
    .where(eq(invoices.customerId, customer.id))

  return (
    <div className='mx-auto w-full max-w-5xl p-4'>
      <div className='mb-8 flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>{customer.id}</h1>
        <div>
          {/* <Link href={`/${params.userId}/${params.organizationId}`}>
            <IconCircleChevronLeft className='h-6 w-6' />
          </Link> */}
          <Back>
            <IconCircleChevronLeft className='h-6 w-6' />
          </Back>
        </div>
      </div>
      <div className='space-y-4'>
        <h2 className='mb-4 text-xl font-semibold'>Customer</h2>
        <div className='space-y-2'>
          <div className='inline-flex items-center gap-2'>
            <p className='text-muted-foreground'>Name</p>
            <p className='font-medium'>{customer.name}</p>
          </div>
        </div>
        <div className='space-y-4'>
          <div className='inline-flex items-center gap-2'>
            <p className='text-muted-foreground'>Email</p>
            <p className='font-medium'>{customer.email}</p>
          </div>
        </div>
      </div>
      <div className='pt-6'>
        <h2 className='mb-4 text-xl font-semibold'>Invoices</h2>
        {customerInvoices.length > 0 ? (
          <ul className='capitalize'>
            {customerInvoices.map(invoice => (
              <li key={invoice.id} className='py-2'>
                <Link
                  href={`/${params.userId}/${params.organizationId}/invoices/${invoice.id}`}
                  className='hover:underline'
                >
                  {invoice.id}, ${invoice.value / 100}, {invoice.status}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No invoices found for this customer</p>
        )}
      </div>
    </div>
  )
}
