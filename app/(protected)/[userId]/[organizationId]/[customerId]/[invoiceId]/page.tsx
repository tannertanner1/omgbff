import { auth } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import { db } from '@/db'
import { invoices, customers } from '@/db/schema/invoices'
import { eq } from 'drizzle-orm'
import Link from 'next/link'

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
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-semibold'>Invoice #{invoice.id}</h1>
        <Link
          href={`/${params.userId}/${params.organizationId}`}
          className='text-blue-500 hover:underline'
        >
          Back to Organization
        </Link>
      </div>
      <div className='rounded-lg bg-white p-6 shadow'>
        <h2 className='mb-4 text-xl font-semibold'>Invoice Details</h2>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <p className='text-gray-600'>Amount</p>
            <p className='font-medium'>${invoice.value / 100}</p>
          </div>
          <div>
            <p className='text-gray-600'>Status</p>
            <p className='font-medium'>{invoice.status}</p>
          </div>
          <div>
            <p className='text-gray-600'>Customer</p>
            <p className='font-medium'>{customer.name}</p>
          </div>
          <div>
            <p className='text-gray-600'>Customer Email</p>
            <p className='font-medium'>{customer.email}</p>
          </div>
          <div>
            <p className='text-gray-600'>Description</p>
            <p className='font-medium'>{invoice.description}</p>
          </div>
          <div>
            <p className='text-gray-600'>Created At</p>
            <p className='font-medium'>
              {new Date(invoice.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
