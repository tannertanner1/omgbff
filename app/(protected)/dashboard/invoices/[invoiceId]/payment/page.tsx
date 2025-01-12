import { verifySession } from '@/lib/dal'
import { notFound } from 'next/navigation'

import { db } from '@/db'
import { customers, invoices } from '@/db/schema/invoices'
import { eq } from 'drizzle-orm'
import { Invoice } from '../invoice'

export default async function InvoicePage({
  params
}: {
  params: { invoiceId: string }
}) {
  await verifySession()

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
    id: result.invoices.id,
    status: result.invoices.status,
    value: result.invoices.value,
    description: result.invoices.description,
    customer: {
      name: result.customers.name,
      email: result.customers.email
    }
  }

  return <Invoice invoice={invoice} />
}

// import { auth } from '@/lib/auth'
// import { and, eq, isNull } from 'drizzle-orm'
// import { notFound } from 'next/navigation'

// import { db } from '@/db'
// import { customers, invoices } from '@/db/schema/invoices'
// import { Invoice } from '../invoice'

// export default async function InvoicePage({
//   params
// }: {
//   params: { invoiceId: string }
// }) {
//   const { userId, orgId } = auth()

//   if (!userId) return

//   const invoiceId = Number.parseInt(params.invoiceId)

//   if (Number.isNaN(invoiceId)) {
//     throw new Error('Invalid Invoice ID')
//   }

//   // Displaying all invoices for public demo

//   let [result]: Array<{
//     invoices: typeof invoices.$inferSelect
//     customers: typeof customers.$inferSelect
//   }> = await db
//     .select()
//     .from(invoices)
//     .innerJoin(customers, eq(invoices.customerId, customers.id))
//     .limit(1)

//   // if (orgId) {
//   //   [result] = await db
//   //     .select()
//   //     .from(Invoices)
//   //     .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
//   //     .where(
//   //       and(eq(Invoices.id, invoiceId), eq(Invoices.organizationId, orgId)),
//   //     )
//   //     .limit(1);
//   // } else {
//   //   [result] = await db
//   //     .select()
//   //     .from(Invoices)
//   //     .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
//   //     .where(
//   //       and(
//   //         eq(Invoices.id, invoiceId),
//   //         eq(Invoices.userId, userId),
//   //         isNull(Invoices.organizationId),
//   //       ),
//   //     )
//   //     .limit(1);
//   // }

//   if (!result) {
//     notFound()
//   }

//   const invoice = {
//     ...result.invoices,
//     customer: result.customers
//   }

//   return <Invoice invoice={invoice} />
// }
