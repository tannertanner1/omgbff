import Link from 'next/link'
import { redirect } from 'next/navigation'
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
import { IconCirclePlus } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { auth } from '@/lib/auth'
import { eq, sql } from 'drizzle-orm'
import { db } from '@/db'
import { invoices, customers } from '@/db/schema/invoices'
import { users } from '@/db/schema/users'

export default async function Page() {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }

  // First, get the user's organization
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1)

  if (!user || !user.organizationId) {
    return (
      <p>No organization found. Please create or join an organization first.</p>
    )
  }

  // Then, fetch invoices for the user's organization
  // Cast the serial id to text for the join
  const results = await db
    .select({
      invoice: invoices,
      customer: customers
    })
    .from(invoices)
    .innerJoin(
      customers,
      eq(invoices.customerId, sql`${customers.id}::integer`)
    )
    .where(eq(customers.organizationId, user.organizationId))

  console.log('Fetched invoices:', results) // Debug log

  const invoicesList = results.map(({ invoice, customer }) => ({
    ...invoice,
    customer: customer
  }))

  return (
    <main className='mx-auto w-full max-w-5xl px-4 pt-2'>
      <div className='mb-6 flex justify-between'>
        <h1 className='text-3xl font-semibold'>Invoices</h1>
        <Link href='/invoices/new' className='inline-flex items-center gap-2'>
          <IconCirclePlus className='h-6 w-6' />
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
                    href={`/invoices/${invoice.id}`}
                    className='block p-4 font-semibold'
                  >
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </Link>
                </TableCell>
                <TableCell className='p-0'>
                  <Link
                    href={`/invoices/${invoice.id}`}
                    className='block p-4 font-semibold'
                  >
                    {invoice.customer.name}
                  </Link>
                </TableCell>
                <TableCell className='p-0'>
                  <Link href={`/invoices/${invoice.id}`} className='block p-4'>
                    {invoice.customer.email}
                  </Link>
                </TableCell>
                <TableCell className='p-0 text-center'>
                  <Link href={`/invoices/${invoice.id}`} className='block p-4'>
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
                    href={`/invoices/${invoice.id}`}
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
