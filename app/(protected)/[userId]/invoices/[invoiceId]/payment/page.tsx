// import { notFound } from 'next/navigation'

// import { db } from '@/db'
// import { customers, invoices } from '@/db/schema/invoices'
// import { eq } from 'drizzle-orm'
// import { Invoice } from '../invoice'

// import Stripe from 'stripe'
// const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY))

// export default async function InvoicePage({
//   params
// }: {
//   params: { invoiceId: string }
// }) {
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
//     id: result.invoices.id,
//     status: result.invoices.status,
//     value: result.invoices.value,
//     description: result.invoices.description,
//     customer: {
//       name: result.customers.name,
//       email: result.customers.email
//     }
//   }

//   return <Invoice invoice={invoice} />
// }
