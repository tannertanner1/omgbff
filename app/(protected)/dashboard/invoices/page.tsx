import { auth } from '@/lib/auth'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import { CirclePlus } from 'lucide-react'
import { redirect } from 'next/navigation'

import { db } from '@/db'
import { customers, invoices } from '@/db/schema/invoices'

import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

export default async function Page() {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }

  const results = await db
    .select()
    .from(invoices)
    .innerJoin(customers, eq(invoices.customerId, customers.id))
    .where(eq(invoices.userId, session.user.id))

  console.log('Fetched invoices:', results) // Debug log

  const invoicesList = results.map(({ invoices, customers }) => ({
    ...invoices,
    customer: customers
  }))

  return (
    <main className='mx-auto w-full max-w-5xl px-4 pt-2'>
      <div className='mb-6 flex justify-between'>
        <h1 className='text-3xl font-semibold'>Invoices</h1>
        <Link
          href='/dashboard/invoices/new'
          className='inline-flex items-center gap-2'
        >
          <CirclePlus className='h-6 w-6' />
        </Link>
      </div>
      {invoicesList.length === 0 ? (
        <p>No invoices found. Create your first invoice!</p>
      ) : (
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[100px] p-4'>Date</TableHead>
              <TableHead className='p-4'>Customer</TableHead>
              <TableHead className='p-4'>Email</TableHead>
              <TableHead className='p-4 text-center'>Status</TableHead>
              <TableHead className='p-4 text-right'>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoicesList.map(invoice => (
              <TableRow key={invoice.id}>
                <TableCell className='p-0 font-medium'>
                  <Link
                    href={`/dashboard/invoices/${invoice.id}`}
                    className='block p-4 font-semibold'
                  >
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </Link>
                </TableCell>
                <TableCell className='p-0'>
                  <Link
                    href={`/dashboard/invoices/${invoice.id}`}
                    className='block p-4 font-semibold'
                  >
                    {invoice.customer.name}
                  </Link>
                </TableCell>
                <TableCell className='p-0'>
                  <Link
                    href={`/dashboard/invoices/${invoice.id}`}
                    className='block p-4'
                  >
                    {invoice.customer.email}
                  </Link>
                </TableCell>
                <TableCell className='p-0 text-center'>
                  <Link
                    href={`/dashboard/invoices/${invoice.id}`}
                    className='block p-4'
                  >
                    <Badge
                      className={cn(
                        'rounded-full capitalize',
                        invoice.status === 'open' && 'bg-blue-500',
                        invoice.status === 'paid' && 'bg-green-600',
                        invoice.status === 'void' && 'bg-zinc-700',
                        invoice.status === 'uncollectible' && 'bg-red-600'
                      )}
                    >
                      {invoice.status}
                    </Badge>
                  </Link>
                </TableCell>
                <TableCell className='p-0 text-right'>
                  <Link
                    href={`/dashboard/invoices/${invoice.id}`}
                    className='block p-4 font-semibold'
                  >
                    ${(invoice.value / 100).toFixed(2)}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </main>
  )
}
