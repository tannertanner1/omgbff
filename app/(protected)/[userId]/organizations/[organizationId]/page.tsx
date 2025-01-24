import { auth } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { IconArrowLeft, IconCirclePlus } from '@tabler/icons-react'
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

  if (session.user.id !== params.userId) {
    redirect(`/${session.user.id}/organizations/${params.organizationId}`)
  }

  const organization = await getOrganizationById(params.organizationId)
  if (!organization) {
    notFound()
  }

  const customers = await getOrganizationCustomers(params.organizationId)
  const invoices = await getOrganizationInvoices(params.organizationId)

  return (
    <div className='min-h-screen bg-black p-4 text-white'>
      <div className='mx-auto max-w-5xl space-y-8'>
        <div className='space-y-4'>
          <Link
            href={`/${params.userId}/organizations`}
            className='inline-block'
          >
            <IconArrowLeft className='h-6 w-6' />
          </Link>
          <h1 className='text-2xl'>{organization.name}</h1>
        </div>

        <section className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl'>Customers</h2>
            <Link
              href={`/${params.userId}/customers/new?org=${organization.id}`}
            >
              <IconCirclePlus className='h-6 w-6' />
            </Link>
          </div>

          <input
            type='text'
            placeholder='Filter name...'
            className='w-full rounded border border-gray-800 bg-black p-2'
          />

          <div className='overflow-hidden rounded border border-gray-800'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-gray-800'>
                  <th className='p-4 text-left'>Name</th>
                  <th className='p-4 text-left'>Email</th>
                  <th className='p-4 text-left'>Created</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className='p-4 text-center text-gray-400'>
                      No results.
                    </td>
                  </tr>
                ) : (
                  customers.map(customer => (
                    <tr key={customer.id} className='border-b border-gray-800'>
                      <td className='p-4'>{customer.name}</td>
                      <td className='p-4'>{customer.email}</td>
                      <td className='p-4 text-gray-400'>
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl'>Invoices</h2>
            <Link
              href={`/${params.userId}/invoices/new?org=${organization.id}`}
            >
              <IconCirclePlus className='h-6 w-6' />
            </Link>
          </div>

          <input
            type='text'
            placeholder='Filter customer...'
            className='w-full rounded border border-gray-800 bg-black p-2'
          />

          <div className='overflow-hidden rounded border border-gray-800'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-gray-800'>
                  <th className='p-4 text-left'>Customer</th>
                  <th className='p-4 text-left'>Amount</th>
                  <th className='p-4 text-left'>Status</th>
                  <th className='p-4 text-left'>Created</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={4} className='p-4 text-center text-gray-400'>
                      No results.
                    </td>
                  </tr>
                ) : (
                  invoices.map(invoice => (
                    <tr key={invoice.id} className='border-b border-gray-800'>
                      <td className='p-4'>{invoice.customer.name}</td>
                      <td className='p-4'>
                        ${(invoice.value / 100).toFixed(2)}
                      </td>
                      <td className='p-4'>
                        <span className='capitalize'>{invoice.status}</span>
                      </td>
                      <td className='p-4 text-gray-400'>
                        {new Date(invoice.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
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
