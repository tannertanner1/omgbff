import Link from "next/link"
import { redirect } from "next/navigation"
import { IconCirclePlus } from "@tabler/icons-react"
import { auth } from "@/lib/auth"
import { hasPermission } from "@/lib/abac"
import { getUserOrganizations } from "@/db/queries"
import { DataTable } from "@/components/data-table"
import { columns } from "./columns"

export default async function Page({
  params: paramsPromise,
  searchParams,
}: {
  params: Promise<{ userId: string }>
  searchParams: { query?: string }
}) {
  const [session, params] = await Promise.all([auth(), paramsPromise])
  if (!session) {
    redirect("/login")
  }

  const { userId } = params
  if (session.user.id !== userId) {
    redirect(`/${session.user.id}/organizations`)
  }

  const userOrganizations = await getUserOrganizations()
  const organizations = userOrganizations.map((uo) => ({
    ...uo.organization,
    userId,
  }))

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-5xl p-4">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Organizations</h1>
          {hasPermission(session.user, "organizations", "create") && (
            <Link href={`/${userId}/organizations/new`}>
              <IconCirclePlus className="h-6 w-6" />
            </Link>
          )}
        </div>

        <DataTable
          columns={columns}
          data={organizations}
          filterColumn="name"
          filterPlaceholder="Filter organizations..."
        />
      </div>
    </div>
  )
}

// import Link from "next/link"
// import { redirect } from "next/navigation"
// import { IconCirclePlus } from "@tabler/icons-react"
// import { auth } from "@/lib/auth"
// import { hasPermission } from "@/lib/abac"
// import { getUserOrganizations } from "@/db/queries"
// import { DataTable } from "@/components/data-table"
// import { columns } from "./columns"

// export default async function Page({
//   params,
// }: {
//   params: { userId: string }
// }) {
//   const session = await auth()
//   if (!session) {
//     redirect("/login")
//   }

//   const { userId } = params
//   if (session.user.id !== userId) {
//     redirect(`/${session.user.id}/organizations`)
//   }

//   const userOrganizations = await getUserOrganizations()
//   const organizations = userOrganizations.map((uo) => ({
//     ...uo.organization,
//     userId,
//   }))

//   return (
//     <div className="min-h-screen">
//       <div className="mx-auto max-w-5xl p-4">
//         <div className="mb-8 flex items-center justify-between">
//           <h1 className="text-2xl font-semibold">Organizations</h1>
//           {hasPermission(session.user, "organizations", "create") && (
//             <Link href={`/${userId}/organizations/new`}>
//               <IconCirclePlus className="h-6 w-6" />
//             </Link>
//           )}
//         </div>

//         <DataTable
//           columns={columns}
//           data={organizations}
//           filterColumn="name"
//           filterPlaceholder="Filter organizations..."
//         />
//       </div>
//     </div>
//   )
// }

// import { Suspense } from 'react'
// import Link from 'next/link'
// import { redirect } from 'next/navigation'
// import { IconCirclePlus } from '@tabler/icons-react'
// import { auth } from '@/lib/auth'
// import { hasPermission } from '@/lib/abac'
// import { getUserOrganizations } from '@/db/queries'
// import { DataTable } from '@/components/data-table'
// import { columns } from './columns'

// export default async function OrganizationsPage({
//   params: { userId },
//   searchParams
// }: {
//   params: { userId: string }
//   searchParams: { [key: string]: string | string[] | undefined }
// }) {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   if (session.user.id !== userId) {
//     redirect(`/${session.user.id}/organizations`)
//   }

//   // Parse query params
//   const page = Number(searchParams.page) || 1
//   const per_page = Number(searchParams.per_page) || 10
//   const sort = searchParams.sort as string | undefined
//   const search = searchParams.search as string | undefined

//   // Fetch data
//   const { data, pageCount } = await getUserOrganizations({
//     userId,
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
//         <div className='mb-8 flex items-center justify-between'>
//           <h1 className='text-2xl font-semibold'>Organizations</h1>
//           {hasPermission(session.user, 'organizations', 'create') && (
//             <Link href={`/${userId}/organizations/new`}>
//               <IconCirclePlus className='h-6 w-6' />
//             </Link>
//           )}
//         </div>

//         <Suspense fallback={<div>Loading...</div>}>
//           <DataTable
//             columns={columns}
//             data={data}
//             pageCount={pageCount}
//             filterColumn='name'
//             searchPlaceholder='Filter organizations...'
//           />
//         </Suspense>
//       </div>
//     </div>
//   )
// }

// import { Suspense } from 'react'
// import Link from 'next/link'
// import { redirect } from 'next/navigation'
// import { IconCirclePlus } from '@tabler/icons-react'
// import { auth } from '@/lib/auth'
// import { hasPermission } from '@/lib/abac'
// import { getUserOrganizations } from '@/db/queries'
// import { DataTable } from '@/components/data-table'
// import { columns } from './columns'

// export default async function OrganizationsPage({
//   params: paramsPromise,
//   searchParams
// }: {
//   params: Promise<{ userId: string }>
//   searchParams: { [key: string]: string | string[] | undefined }
// }) {
//   const [session, params] = await Promise.all([auth(), paramsPromise])
//   if (!session) {
//     redirect('/login')
//   }

//   const { userId } = params
//   if (session.user.id !== userId) {
//     redirect(`/${session.user.id}/organizations`)
//   }

//   // Parse query params
//   const page = Number(searchParams.page) || 1
//   const per_page = Number(searchParams.per_page) || 10
//   const sort = searchParams.sort as string | undefined
//   const search = searchParams.search as string | undefined
//   const status = searchParams.status as string | undefined
//   const priority = searchParams.priority as string | undefined

//   // Fetch data
//   const { data, pageCount } = await getUserOrganizations({
//     page,
//     perPage: per_page,
//     sort: sort
//       ? {
//           column: sort.split('.')[0],
//           order: sort.split('.')[1] as 'asc' | 'desc'
//         }
//       : undefined,
//     search,
//     status,
//     priority
//   })

//   const organizations = data.map(organization => ({
//     ...organization,
//     userId
//   }))

//   return (
//     <div className='min-h-screen bg-background text-foreground'>
//       <div className='mx-auto max-w-7xl p-4'>
//         <div className='mb-8 flex items-center justify-between'>
//           <h1 className='text-2xl font-semibold'>Organizations</h1>
//           {hasPermission(session.user, 'organizations', 'create') && (
//             <Link href={`/${userId}/organizations/new`}>
//               <IconCirclePlus className='h-6 w-6' />
//             </Link>
//           )}
//         </div>

//         <Suspense fallback={<div>Loading...</div>}>
//           <DataTable
//             columns={columns}
//             data={organizations}
//             pageCount={pageCount}
//             filterableColumns={[
//               {
//                 id: 'status',
//                 title: 'Status',
//                 options: [
//                   { label: 'Active', value: 'active' },
//                   { label: 'Inactive', value: 'inactive' }
//                 ]
//               },
//               {
//                 id: 'priority',
//                 title: 'Priority',
//                 options: [
//                   { label: 'High', value: 'high' },
//                   { label: 'Medium', value: 'medium' },
//                   { label: 'Low', value: 'low' }
//                 ]
//               }
//             ]}
//             searchableColumns={[
//               {
//                 id: 'name',
//                 title: 'Name'
//               }
//             ]}
//           />
//         </Suspense>
//       </div>
//     </div>
//   )
// }

// import Link from 'next/link'
// import { redirect } from 'next/navigation'
// import { IconCirclePlus } from '@tabler/icons-react'
// import { auth } from '@/lib/auth'
// import { hasPermission } from '@/lib/abac'
// import { getUserOrganizations } from '@/db/queries'
// import { DataTable } from '@/components/data-table'
// import { columns } from './columns'

// export default async function Page({
//   params: paramsPromise,
//   searchParams
// }: {
//   params: Promise<{ userId: string }>
//   searchParams: { query?: string }
// }) {
//   const [session, params] = await Promise.all([auth(), paramsPromise])
//   if (!session) {
//     redirect('/login')
//   }

//   const { userId } = params
//   if (session.user.id !== userId) {
//     redirect(`/${session.user.id}/organizations`)
//   }

//   const userOrganizations = await getUserOrganizations()
//   const organizations = userOrganizations.map(uo => ({
//     ...uo.organization,
//     userId
//   }))

//   return (
//     <div className='min-h-screen bg-background text-foreground'>
//       <div className='mx-auto max-w-7xl p-4'>
//         <div className='mb-8 flex items-center justify-between'>
//           <h1 className='text-2xl font-semibold'>Organizations</h1>
//           {hasPermission(session.user, 'organizations', 'create') && (
//             <Link href={`/${userId}/organizations/new`}>
//               <IconCirclePlus className='h-6 w-6' />
//             </Link>
//           )}
//         </div>

//         <DataTable
//           columns={columns}
//           data={organizations}
//           filterColumn='name'
//           filterPlaceholder='Filter organizations...'
//         />
//       </div>
//     </div>
//   )
// }

// import Link from 'next/link'
// import { redirect } from 'next/navigation'
// import { IconCirclePlus } from '@tabler/icons-react'
// import { auth } from '@/lib/auth'
// import { hasPermission } from '@/lib/abac'
// import { getUserOrganizations } from '@/db/queries'
// import { DataTable } from '@/components/data-table'
// import { columns } from './columns'

// export default async function Page({
//   params: paramsPromise,
//   searchParams
// }: {
//   params: Promise<{ userId: string }>
//   searchParams: { query?: string }
// }) {
//   const [session, params] = await Promise.all([auth(), paramsPromise])
//   if (!session) {
//     redirect('/login')
//   }

//   const { userId } = params
//   if (session.user.id !== userId) {
//     redirect(`/${session.user.id}/organizations`)
//   }

//   const userOrganizations = await getUserOrganizations()
//   const organizations = userOrganizations.map(uo => ({
//     ...uo.organization,
//     userId
//   }))

//   return (
//     <div className='min-h-screen'>
//       <div className='mx-auto max-w-5xl p-4'>
//         <div className='mb-8 flex items-center justify-between'>
//           <h1 className='text-2xl font-semibold'>Organizations</h1>
//           {hasPermission(session.user, 'organizations', 'create') && (
//             <Link href={`/${userId}/organizations/new`}>
//               <IconCirclePlus className='h-6 w-6' />
//             </Link>
//           )}
//         </div>

//         <DataTable
//           columns={columns}
//           data={organizations}
//           filterColumn='name'
//           filterPlaceholder='Filter organizations...'
//         />
//       </div>
//     </div>
//   )
// }
