// import { Suspense } from "react"
// import { redirect } from "next/navigation"
// import { auth } from "@/lib/auth"
// import { hasPermission } from "@/lib/abac"
// import { getOrganizationCustomers } from "@/db/queries"
// import { DataTable } from "@/components/data-table"
// import { columns } from "./customer-columns"

// export default async function OrganizationPage({
//   params,
//   searchParams,
// }: {
//   params: { userId: string; organizationId: string }
//   searchParams: { [key: string]: string | string[] | undefined }
// }) {
//   const session = await auth()
//   if (!session) {
//     redirect("/login")
//   }

//   const { userId, organizationId } = params
//   if (session.user.id !== userId) {
//     redirect(`/${session.user.id}/organizations/${organizationId}`)
//   }

//   if (!hasPermission(session.user, "organizations", "view")) {
//     redirect(`/${userId}/organizations`)
//   }

//   // Parse query params
//   const page = Number(searchParams.page) || 1
//   const per_page = Number(searchParams.per_page) || 10
//   const sort = searchParams.sort as string | undefined
//   const search = searchParams.search as string | undefined

//   // Fetch data
//   const { data, pageCount } = await getOrganizationCustomers({
//     organizationId,
//     page,
//     perPage: per_page,
//     sort: sort
//       ? {
//           column: sort.split(".")[0],
//           order: sort.split(".")[1] as "asc" | "desc",
//         }
//       : undefined,
//     search,
//   })

//   return (
//     <div className="min-h-screen bg-background text-foreground">
//       <div className="mx-auto max-w-7xl p-4">
//         <h1 className="mb-8 text-2xl font-semibold">Organization Customers</h1>
//         <Suspense fallback={<div>Loading...</div>}>
//           <DataTable
//             columns={columns}
//             data={data}
//             pageCount={pageCount}
//             searchableColumns={[
//               {
//                 id: "name",
//                 title: "Name",
//               },
//               {
//                 id: "email",
//                 title: "Email",
//               },
//             ]}
//           />
//         </Suspense>
//       </div>
//     </div>
//   )
// }

// import { Suspense } from 'react'
// import { redirect } from 'next/navigation'
// import { auth } from '@/lib/auth'
// import { hasPermission } from '@/lib/abac'
// import { getOrganizationCustomers } from '@/db/queries'
// import { DataTable } from '@/components/data-table'
// import { columns } from './customer-columns'

// export default async function OrganizationPage({
//   params,
//   searchParams
// }: {
//   params: { userId: string; organizationId: string }
//   searchParams: { [key: string]: string | string[] | undefined }
// }) {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   const { userId, organizationId } = params
//   if (session.user.id !== userId) {
//     redirect(`/${session.user.id}/organizations/${organizationId}`)
//   }

//   if (!hasPermission(session.user, 'organizations', 'view')) {
//     redirect(`/${userId}/organizations`)
//   }

//   // Parse query params
//   const page = Number(searchParams.page) || 1
//   const per_page = Number(searchParams.per_page) || 10
//   const sort = searchParams.sort as string | undefined
//   const search = searchParams.search as string | undefined

//   // Fetch data
//   const { data, pageCount } = await getOrganizationCustomers({
//     organizationId,
//     page,
//     perPage: per_page,
//     sort: sort
//       ? {
//           column: sort.split('.')[0],
//           order: sort.split('.')[1] as 'asc' | 'desc'
//         }
//       : undefined,
//     search
//   })

//   return (
//     <div className='min-h-screen bg-background text-foreground'>
//       <div className='mx-auto max-w-7xl p-4'>
//         <h1 className='mb-8 text-2xl font-semibold'>Organization Customers</h1>
//         <Suspense fallback={<div>Loading...</div>}>
//           <DataTable
//             columns={columns}
//             data={data}
//             pageCount={pageCount}
//             searchableColumns={[
//               {
//                 id: 'name',
//                 title: 'Name'
//               },
//               {
//                 id: 'email',
//                 title: 'Email'
//               }
//             ]}
//           />
//         </Suspense>
//       </div>
//     </div>
//   )
// }

import { auth } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { IconArrowLeft, IconCirclePlus } from '@tabler/icons-react'
import { DataTable } from '@/components/data-table'
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

  // const [customers, invoices] = await Promise.all([
  //   getOrganizationCustomers(params.organizationId),
  //   getOrganizationInvoices(params.organizationId)
  // ])

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
            {/* <DataTable
              columns={customerColumns}
              data={customers.map(customer => ({
                ...customer,
                userId: params.userId
              }))}
              filterColumn='name'
              filterPlaceholder='Filter customers...'
            /> */}
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
            {/* <DataTable
              columns={invoiceColumns}
              data={invoices.map(invoice => ({
                ...invoice,
                userId: params.userId,
                customerName: invoice.customer.name
              }))}
              filterColumn='customerName'
              filterPlaceholder='Filter invoices...'
            /> */}
          </section>
        </div>
      </div>
    </div>
  )
}
