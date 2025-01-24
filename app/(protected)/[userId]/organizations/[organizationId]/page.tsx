import { auth } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { IconArrowLeft, IconCirclePlus } from '@tabler/icons-react'
import { DataTable } from '@/components/data-table/table'
import { columns as customerColumns } from './customer-columns'
import { columns as invoiceColumns } from './invoice-columns'
import { hasPermission } from '@/lib/abac'
import {
  getOrganizationById,
  getOrganizationCustomers,
  getOrganizationInvoices
} from '@/db/queries'

export default async function Page({
  params: paramsPromise
}: {
  params: Promise<{ userId: string; organizationId: string }>
}) {
  const [session, params] = await Promise.all([auth(), paramsPromise])
  if (!session) {
    redirect('/login')
  }

  if (!hasPermission(session.user, 'organizations', 'view')) {
    redirect(`/${session.user.id}/organizations`)
  }

  const organization = await getOrganizationById(params.organizationId)
  if (!organization) {
    notFound()
  }

  const [customers, invoices] = await Promise.all([
    getOrganizationCustomers(params.organizationId),
    getOrganizationInvoices(params.organizationId)
  ])

  return (
    <div className='min-h-screen'>
      <div className='mx-auto w-full max-w-5xl p-4'>
        <div className='mb-8 flex flex-col gap-4'>
          <Link href={`/${params.userId}/organizations`}>
            <IconArrowLeft className='h-6 w-6' />
          </Link>
          <h1 className='text-2xl font-bold'>{organization.name}</h1>
        </div>

        <div className='space-y-8'>
          <section>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-lg font-semibold'>Customers</h2>
              {hasPermission(session.user, 'customers', 'create') && (
                <Link
                  href={`/${params.userId}/customers/new?org=${organization.id}`}
                >
                  <IconCirclePlus className='h-6 w-6' />
                </Link>
              )}
            </div>
            <DataTable
              columns={customerColumns}
              data={customers.map(customer => ({
                ...customer,
                userId: params.userId
              }))}
              searchPlaceholder='Filter name...'
              searchColumn='name'
            />
          </section>

          <section>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-lg font-semibold'>Invoices</h2>
              {hasPermission(session.user, 'invoices', 'create') && (
                <Link
                  href={`/${params.userId}/invoices/new?org=${organization.id}`}
                >
                  <IconCirclePlus className='h-6 w-6' />
                </Link>
              )}
            </div>
            <DataTable
              columns={invoiceColumns}
              data={invoices.map(invoice => ({
                ...invoice,
                userId: params.userId,
                customerName: invoice.customer.name
              }))}
              searchPlaceholder='Filter customer name...'
              searchColumn='customerName'
            />
          </section>
        </div>
      </div>
    </div>
  )
}

// import { auth } from '@/lib/auth'
// import { notFound, redirect } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import Link from 'next/link'
// import { IconCircleChevronRight } from '@tabler/icons-react'
// import { DataTable } from '@/_private/components/data-table'
// import { columns as customerColumns } from './customer-columns'
// import { columns as invoiceColumns } from './invoice-columns'
// import { hasPermission } from '@/lib/abac'
// import {
//   getOrganizationById,
//   getOrganizationCustomers,
//   getOrganizationInvoices
// } from '@/db/queries'

// export default async function Page({
//   params
// }: {
//   params: { userId: string; organizationId: string }
// }) {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   if (session.user.id !== params.userId) {
//     redirect(`/${session.user.id}/organizations/${params.organizationId}`)
//   }

//   const organization = await getOrganizationById(params.organizationId)
//   if (!organization) {
//     notFound()
//   }

//   const customers = await getOrganizationCustomers(params.organizationId)
//   const invoices = await getOrganizationInvoices(params.organizationId)

//   return (
//     <>
//       <div className='flex h-screen'>
//         <div className='flex min-w-0 flex-1 flex-col'>
//           <div className='mx-auto w-full max-w-5xl'>
//             <div className='mb-8 flex flex-col items-center px-4'>
//               <Link href={`/${params.userId}/organizations`}>
//                 <IconCircleChevronRight className='h-6 w-6' />
//               </Link>
//               <h1 className='text-2xl font-bold'>{organization.name}</h1>
//             </div>
//             <div className='flex items-center gap-2'>
//               {hasPermission(session.user, 'organizations', 'update') && (
//                 <Button variant='outline' asChild>
//                   <Link
//                     href={`/${params.userId}/organizations/${organization.id}/edit`}
//                   >
//                     Edit
//                   </Link>
//                 </Button>
//               )}
//               {hasPermission(session.user, 'organizations', 'delete') && (
//                 <Button variant='destructive' asChild>
//                   <Link
//                     href={`/${params.userId}/organizations/${organization.id}/delete`}
//                   >
//                     Delete
//                   </Link>
//                 </Button>
//               )}
//             </div>
//           </div>

//           <div className='grid gap-6'>
//             <div className='mx-auto w-full max-w-5xl space-y-4 px-4'>
//               <div className='flex items-center justify-between'>
//                 <h2 className='text-lg font-semibold'>Customers</h2>
//                 {hasPermission(session.user, 'customers', 'create') && (
//                   <Button asChild>
//                     <Link
//                       href={`/${params.userId}/customers/new?org=${organization.id}`}
//                     >
//                       Add Customer
//                     </Link>
//                   </Button>
//                 )}
//               </div>
//               <DataTable
//                 columns={customerColumns}
//                 data={customers.map(customer => ({
//                   ...customer,
//                   userId: params.userId
//                 }))}
//                 filterColumn='name'
//               />
//             </div>

//             <div className='mx-auto w-full max-w-5xl space-y-4 px-4'>
//               <div className='flex items-center justify-between'>
//                 <h2 className='text-lg font-semibold'>Invoices</h2>
//                 {hasPermission(session.user, 'invoices', 'create') && (
//                   <Button asChild>
//                     <Link
//                       href={`/${params.userId}/invoices/new?org=${organization.id}`}
//                     >
//                       Create Invoice
//                     </Link>
//                   </Button>
//                 )}
//               </div>
//               <DataTable
//                 columns={invoiceColumns}
//                 data={invoices.map(invoice => ({
//                   ...invoice,
//                   userId: params.userId,
//                   customerName: invoice.customer.name // Add the customer name from the relation
//                 }))}
//                 filterColumn='customerName'
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }
