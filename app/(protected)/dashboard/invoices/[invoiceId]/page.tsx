import { auth } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import { db } from '@/db'
import { customers, invoices } from '@/db/schema/invoices'
import { eq } from 'drizzle-orm'
import { Invoice } from './invoice'

export default async function Page({
  params
}: {
  params: { invoiceId: string }
}) {
  const session = await auth()

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

// import { redirect } from 'next/navigation'
// import { auth } from '@/lib/auth'
// import { notFound } from 'next/navigation'
// import { db } from '@/db'
// import { customers, invoices } from '@/db/schema/invoices'
// import { eq } from 'drizzle-orm'
// import { Invoice } from './invoice'

// export default async function Page({
//   params
// }: {
//   params: { invoiceId: string }
// }) {
//   const session = await auth()
//   if (!session?.user?.id) {
//     redirect('/login')
//   }

//   const invoiceId = Number.parseInt(params.invoiceId)
//   if (Number.isNaN(invoiceId)) {
//     throw new Error('Invalid Invoice ID')
//   }

//   const [result] = await db
//     .select()
//     .from(invoices)
//     .innerJoin(customers, eq(invoices.customerId, customers.id))
//     .where(eq(invoices.id, invoiceId))
//     .limit(1)

//   if (!result) {
//     notFound()
//   }

//   const invoice = {
//     ...result.invoices,
//     customer: result.customers
//   }

//   return <Invoice invoice={invoice} />
// }

// import { verifySession } from '@/lib/dal'
// import { notFound } from 'next/navigation'
// import { db } from '@/db'
// import { customers, invoices } from '@/db/schema/invoices'
// import { eq } from 'drizzle-orm'
// import { Invoice } from './invoice'

// export default async function Page({
//   params
// }: {
//   params: { invoiceId: string }
// }) {
//   const { user } = await verifySession()

//   const invoiceId = Number.parseInt(params.invoiceId)
//   if (Number.isNaN(invoiceId)) {
//     throw new Error('Invalid Invoice ID')
//   }

//   const [result] = await db
//     .select()
//     .from(invoices)
//     .innerJoin(customers, eq(invoices.customerId, customers.id))
//     .where(eq(invoices.id, invoiceId))
//     .limit(1)

//   if (!result) {
//     notFound()
//   }

//   const invoice = {
//     ...result.invoices,
//     customer: result.customers
//   }

//   return <Invoice invoice={invoice} />
// }

// import { auth } from '@/lib/auth'
// import { notFound } from 'next/navigation'
// import { db } from '@/db'
// import { customers, invoices } from '@/db/schema/invoices'
// import { eq } from 'drizzle-orm'
// import { Invoice } from './invoice'

// export default async function Page({
//   params
// }: {
//   params: { invoiceId: string }
// }) {
//   const session = await auth()
//   if (!session?.user?.id) {
//     notFound()
//   }

//   const invoiceId = Number.parseInt(params.invoiceId)

//   if (Number.isNaN(invoiceId)) {
//     throw new Error('Invalid Invoice ID')
//   }

//   const [result] = await db
//     .select()
//     .from(invoices)
//     .innerJoin(customers, eq(invoices.customerId, customers.id))
//     .where(eq(invoices.id, invoiceId))
//     .limit(1)

//   if (!result) {
//     notFound()
//   }

//   const invoice = {
//     ...result.invoices,
//     customer: result.customers
//   }

//   return <Invoice invoice={invoice} />
// }
