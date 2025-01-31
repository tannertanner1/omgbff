import { auth } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { IconArrowLeft } from '@tabler/icons-react'
import { Table } from '@/components/data-table/table'
import { hasPermission } from '@/lib/abac'
import {
  getOrganizationById,
  getOrganizationCustomers,
  getOrganizationInvoices
} from '@/db/queries'

export default async function Page({
  params
}: {
  params: { userId: string; organizationId: string }
}) {
  const session = await auth()
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
            <h2 className='mb-4 text-lg font-semibold'>Customers</h2>
            <Table data={customers} />
          </section>

          <section>
            <h2 className='mb-4 text-lg font-semibold'>Invoices</h2>
            <Table data={invoices} />
          </section>
        </div>
      </div>
    </div>
  )
}

// import { auth } from '@/lib/auth'
// import { notFound, redirect } from 'next/navigation'
// import Link from 'next/link'
// import { IconArrowLeft, IconCirclePlus } from '@tabler/icons-react'
// import { DataTable } from '@/components/data-table'
// import { columns as customerColumns } from './customer-columns'
// import { columns as invoiceColumns } from './invoice-columns'
// import { hasPermission } from '@/lib/abac'
// import {
//   getOrganizationById,
//   getOrganizationCustomers,
//   getOrganizationInvoices
// } from '@/db/queries'

// export default async function Page({
//   params: paramsPromise
// }: {
//   params: Promise<{ userId: string; organizationId: string }>
// }) {
//   const [session, params] = await Promise.all([auth(), paramsPromise])
//   if (!session) {
//     redirect('/login')
//   }

//   if (!hasPermission(session.user, 'organizations', 'view')) {
//     redirect(`/${session.user.id}/organizations`)
//   }

//   const organization = await getOrganizationById(params.organizationId)
//   if (!organization) {
//     notFound()
//   }

//   // const [customers, invoices] = await Promise.all([
//   //   getOrganizationCustomers(params.organizationId),
//   //   getOrganizationInvoices(params.organizationId)
//   // ])

//   return (
//     <div className='min-h-screen'>
//       <div className='mx-auto w-full max-w-5xl p-4'>
//         <div className='mb-8 flex flex-col gap-4'>
//           <Link href={`/${params.userId}/organizations`}>
//             <IconArrowLeft className='h-6 w-6' />
//           </Link>
//           <h1 className='text-2xl font-bold'>{organization.name}</h1>
//         </div>

//         <div className='space-y-8'>
//           <section>
//             <div className='mb-4 flex items-center justify-between'>
//               <h2 className='text-lg font-semibold'>Customers</h2>
//               {hasPermission(session.user, 'customers', 'create') && (
//                 <Link
//                   href={`/${params.userId}/customers/new?org=${organization.id}`}
//                 >
//                   <IconCirclePlus className='h-6 w-6' />
//                 </Link>
//               )}
//             </div>
//             {/* <DataTable
//               columns={customerColumns}
//               data={customers.map(customer => ({
//                 ...customer,
//                 userId: params.userId
//               }))}
//               filterColumn='name'
//               filterPlaceholder='Filter customers...'
//             /> */}
//           </section>

//           <section>
//             <div className='mb-4 flex items-center justify-between'>
//               <h2 className='text-lg font-semibold'>Invoices</h2>
//               {hasPermission(session.user, 'invoices', 'create') && (
//                 <Link
//                   href={`/${params.userId}/invoices/new?org=${organization.id}`}
//                 >
//                   <IconCirclePlus className='h-6 w-6' />
//                 </Link>
//               )}
//             </div>
//             {/* <DataTable
//               columns={invoiceColumns}
//               data={invoices.map(invoice => ({
//                 ...invoice,
//                 userId: params.userId,
//                 customerName: invoice.customer.name
//               }))}
//               filterColumn='customerName'
//               filterPlaceholder='Filter invoices...'
//             /> */}
//           </section>
//         </div>
//       </div>
//     </div>
//   )
// }
