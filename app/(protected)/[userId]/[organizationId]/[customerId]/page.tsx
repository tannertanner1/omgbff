import { auth } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import { db } from '@/db'
import { customers, invoices } from '@/db/schema/invoices'
import { eq } from 'drizzle-orm'
import Link from 'next/link'

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
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-semibold'>{customer.name}</h1>
        <Link
          href={`/${params.userId}/${params.organizationId}`}
          className='text-blue-500 hover:underline'
        >
          Back to Organization
        </Link>
      </div>
      <div className='rounded-lg bg-white p-6 shadow'>
        <h2 className='mb-4 text-xl font-semibold'>Customer Details</h2>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <p className='text-gray-600'>Name</p>
            <p className='font-medium'>{customer.name}</p>
          </div>
          <div>
            <p className='text-gray-600'>Email</p>
            <p className='font-medium'>{customer.email}</p>
          </div>
        </div>
      </div>
      <div className='rounded-lg bg-white p-6 shadow'>
        <h2 className='mb-4 text-xl font-semibold'>Customer Invoices</h2>
        {customerInvoices.length > 0 ? (
          <ul className='divide-y divide-gray-200'>
            {customerInvoices.map(invoice => (
              <li key={invoice.id} className='py-4'>
                <Link
                  href={`/${params.userId}/${params.organizationId}/invoices/${invoice.id}`}
                  className='hover:underline'
                >
                  Invoice #{invoice.id} - ${invoice.value / 100} -{' '}
                  {invoice.status}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No invoices found for this customer.</p>
        )}
      </div>
    </div>
  )
}
