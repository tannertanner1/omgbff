import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { invoices, customers } from '@/db/schema/invoices'
import { eq } from 'drizzle-orm'
import { DataTable } from '@/components/data-table'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { columns } from './columns'

export default async function InvoicesPage({
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
    redirect(`/${session.user.id}/invoices`)
  }

  const userInvoices = await db
    .select({
      id: invoices.id,
      customerId: invoices.customerId,
      customerName: customers.name,
      value: invoices.value,
      status: invoices.status,
      createdAt: invoices.createdAt,
      userId: invoices.userId // Add this line
    })
    .from(invoices)
    .innerJoin(customers, eq(invoices.customerId, customers.id))
    .where(eq(invoices.userId, params.id))
    .orderBy(invoices.createdAt)

  return (
    <div className='space-y-4 p-8 pt-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold tracking-tight'>Invoices</h1>
        <Button asChild>
          <Link href={`/${params.id}/invoices/new`}>Create Invoice</Link>
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={userInvoices}
        filterColumn='customerName'
      />
    </div>
  )
}

// import { auth } from "@/lib/auth"
// import { redirect } from "next/navigation"
// import { db } from "@/db"
// import { invoices, customers } from "@/db/schema/invoices"
// import { eq } from "drizzle-orm"
// import { DataTable } from "@/components/data-table"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { columns } from "./columns"

// export default async function InvoicesPage({ params }: { params: { id: string } }) {
//   const session = await auth()
//   if (!session) {
//     redirect("/login")
//   }

//   // Verify the user is accessing their own page
//   if (session.user.id !== params.id) {
//     redirect(`/${session.user.id}/invoices`)
//   }

//   const userInvoices = await db
//     .select({
//       id: invoices.id,
//       customerId: invoices.customerId,
//       customerName: customers.name,
//       value: invoices.value,
//       status: invoices.status,
//       createdAt: invoices.createdAt,
//     })
//     .from(invoices)
//     .innerJoin(customers, eq(invoices.customerId, customers.id))
//     .where(eq(invoices.userId, params.id))
//     .orderBy(invoices.createdAt)

//   return (
//     <div className="space-y-4 p-8 pt-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
//         <Button asChild>
//           <Link href={`/${params.id}/invoices/new`}>Create Invoice</Link>
//         </Button>
//       </div>
//       <DataTable columns={columns} data={userInvoices} filterColumn="customerName" />
//     </div>
//   )
// }
