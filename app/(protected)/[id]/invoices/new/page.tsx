import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { customers } from '@/db/schema/invoices'
import { eq } from 'drizzle-orm'
import { InvoiceForm } from './form'

export default async function NewInvoicePage({
  params
}: {
  params: { id: string }
}) {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }

  // Verify the user is accessing their own page
  if (session.user.id !== params.id) {
    redirect(`/${session.user.id}/invoices/new`)
  }

  const userCustomers = await db
    .select({
      id: customers.id,
      name: customers.name
    })
    .from(customers)
    .where(eq(customers.userId, params.id))
    .orderBy(customers.name)

  const formattedCustomers = userCustomers.map(customer => ({
    id: customer.id.toString(),
    name: customer.name
  }))

  return (
    <div className='mx-auto max-w-2xl space-y-8 p-8'>
      <h1 className='text-3xl font-bold'>Create New Invoice</h1>
      <InvoiceForm userId={params.id} customers={formattedCustomers} />
    </div>
  )
}

// import { auth } from '@/lib/auth'
// import { redirect } from 'next/navigation'
// import { db } from '@/db'
// import { customers } from '@/db/schema/invoices'
// import { eq } from 'drizzle-orm'
// import { InvoiceForm } from './form'

// export default async function NewInvoicePage({
//   params
// }: {
//   params: { id: string }
// }) {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   // Verify the user is accessing their own page
//   if (session.user.id !== params.id) {
//     redirect(`/${session.user.id}/invoices/new`)
//   }

//   const userCustomers = await db
//     .select({ id: customers.id.toString(), name: customers.name })
//     .from(customers)
//     .where(eq(customers.userId, params.id))
//     .orderBy(customers.name)

//   return (
//     <div className='mx-auto max-w-2xl space-y-8 p-8'>
//       <h1 className='text-3xl font-bold'>Create New Invoice</h1>
//       <InvoiceForm userId={params.id} customers={userCustomers} />
//     </div>
//   )
// }

// import { auth } from "@/lib/auth"
// import { redirect } from "next/navigation"
// import { db } from "@/db"
// import { customers } from "@/db/schema/invoices"
// import { eq } from "drizzle-orm"
// import { InvoiceForm } from "./form"

// export default async function NewInvoicePage({ params }: { params: { id: string } }) {
//   const session = await auth()
//   if (!session) {
//     redirect("/login")
//   }

//   // Verify the user is accessing their own page
//   if (session.user.id !== params.id) {
//     redirect(`/${session.user.id}/invoices/new`)
//   }

//   const userCustomers = await db
//     .select({ id: customers.id, name: customers.name })
//     .from(customers)
//     .where(eq(customers.userId, params.id))
//     .orderBy(customers.name)

//   return (
//     <div className="mx-auto max-w-2xl space-y-8 p-8">
//       <h1 className="text-3xl font-bold">Create New Invoice</h1>
//       <InvoiceForm userId={params.id} customers={userCustomers} />
//     </div>
//   )
// }
