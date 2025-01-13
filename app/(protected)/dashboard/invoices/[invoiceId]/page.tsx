import { auth } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import { db } from '@/db'
import { customers, invoices } from '@/db/schema/invoices'
import { eq } from 'drizzle-orm'
import { Invoice } from './invoice'

export default async function Page({
  params: paramsPromise
}: {
  params: Promise<{ invoiceId: string }>
}) {
  const [session, params] = await Promise.all([auth(), paramsPromise])

  if (!session) {
    redirect('/login')
  }

  const invoiceId = Number.parseInt(params.invoiceId)
  if (Number.isNaN(invoiceId)) {
    throw new Error('Invalid Invoice ID')
  }

  const [result] = await db
    .select()
    .from(invoices)
    .innerJoin(customers, eq(invoices.customerId, customers.id))
    .where(eq(invoices.id, invoiceId))
    .limit(1)

  if (!result) {
    notFound()
  }

  const invoice = {
    ...result.invoices,
    customer: result.customers
  }

  return <Invoice invoice={invoice} />
}
