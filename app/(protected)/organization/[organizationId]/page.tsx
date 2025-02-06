export default async function Page() {
  return <>Hi</>
}

// import { auth } from '@/lib/auth'
// import { redirect } from 'next/navigation'
// import { db } from '@/db'
// import { organizations } from '@/db/schema/users'
// import { customers, invoices } from '@/db/schema/invoices'
// import { eq, and } from 'drizzle-orm'
// import { Organization } from './component'

// export default async function Page({
//   params
// }: {
//   params: { userId: string; organizationId: string }
// }) {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   // Verify the user is accessing their own page
//   if (session.user.id !== params.userId) {
//     redirect(`/${session.user.id}`)
//   }

//   const [organization] = await db
//     .select()
//     .from(organizations)
//     .where(eq(organizations.id, params.organizationId))
//     .limit(1)

//   if (!organization) {
//     redirect(`/${params.userId}`)
//   }

//   const organizationCustomers = await db
//     .select()
//     .from(customers)
//     .where(eq(customers.organizationId, params.organizationId))

//   const organizationInvoices = await db
//     .select({
//       id: invoices.id,
//       customerId: invoices.customerId,
//       value: invoices.value,
//       description: invoices.description,
//       status: invoices.status,
//       createdAt: invoices.createdAt,
//       updatedAt: invoices.updatedAt
//     })
//     .from(invoices)
//     .innerJoin(customers, eq(invoices.customerId, customers.id))
//     .where(eq(customers.organizationId, params.organizationId))

//   return (
//     <main className='mx-auto w-full max-w-5xl'>
//       {/* {organizationId.length === 0 ? (
//       <></>
//     ) : (
//       <></>
//     )} */}
//       <Organization
//         organization={organization}
//         customers={organizationCustomers}
//         invoices={organizationInvoices}
//         userId={params.userId}
//         organizationId={params.organizationId}
//       />
//     </main>
//   )
// }
