'use client'

import { CreateOrganizationForm } from './form'
import { DataTable } from '@/_private/components/data-table'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import type { ColumnDef } from '@tanstack/react-table'

type Organization = {
  id: string
  name: string
  createdAt: Date
}

const columns: ColumnDef<Organization>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <Link
        href={`/organizations/${row.original.id}`}
        className='hover:underline'
      >
        {row.getValue('name')}
      </Link>
    )
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) =>
      formatDistanceToNow(row.original.createdAt, { addSuffix: true })
  }
]

export function Component({
  userId,
  userOrgs
}: {
  userId: string
  userOrgs: Organization[]
}) {
  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-bold'>Organizations</h1>
      <CreateOrganizationForm userId={userId} />
      <DataTable columns={columns} data={userOrgs} filterColumn='name' />
    </div>
  )
}

// 'use client'

// import { Form } from './form'
// import { DataTable } from '@/components/data-table'
// import Link from 'next/link'
// import { formatDistanceToNow } from 'date-fns'
// import type { ColumnDef } from '@tanstack/react-table'

// type Organization = {
//   id: string
//   name: string
//   createdAt: Date
// }

// const columns: ColumnDef<Organization>[] = [
//   {
//     accessorKey: 'name',
//     header: 'Name',
//     cell: ({ row }) => (
//       <Link
//         href={`/organizations/${row.original.id}`}
//         className='hover:underline'
//       >
//         {row.getValue('name')}
//       </Link>
//     )
//   },
//   {
//     accessorKey: 'createdAt',
//     header: 'Created',
//     cell: ({ row }) =>
//       formatDistanceToNow(row.original.createdAt, { addSuffix: true })
//   }
// ]

// export function Component({
//   userId,
//   userOrgs
// }: {
//   userId: string
//   userOrgs: Organization[]
// }) {
//   return (
//     <div className='space-y-4'>
//       <h1 className='text-2xl font-bold'>Organizations</h1>
//       <Form userId={userId} />
//       <DataTable columns={columns} data={userOrgs} filterColumn='name' />
//     </div>
//   )
// }

// 'use client'

// import { DataTable } from '@/components/data-table'
// import Link from 'next/link'
// import { formatDistanceToNow } from 'date-fns'
// import type { ColumnDef } from '@tanstack/react-table'

// type Organization = {
//   id: string
//   name: string
//   createdAt: Date
// }

// const columns: ColumnDef<Organization>[] = [
//   {
//     accessorKey: 'name',
//     header: 'Name',
//     cell: ({ row }) => (
//       <Link
//         href={`/organizations/${row.original.id}`}
//         className='hover:underline'
//       >
//         {row.getValue('name')}
//       </Link>
//     )
//   },
//   {
//     accessorKey: 'createdAt',
//     header: 'Created',
//     cell: ({ row }) =>
//       formatDistanceToNow(row.original.createdAt, { addSuffix: true })
//   }
// ]

// export function Component({ userOrgs }: { userOrgs: Organization[] }) {
//   return (
//     <div className='space-y-4'>
//       <h1 className='text-2xl font-bold'>Organizations</h1>
//       <DataTable
//         columns={columns}
//         data={userOrgs}
//         filterColumn='name'
//         createLink='/organizations/new'
//         createLabel='Create Organization'
//       />
//     </div>
//   )
// }

// import { auth } from '@/lib/auth'
// import { redirect } from 'next/navigation'
// import { db } from '@/db'
// import { organizations, userOrganizations } from '@/db/schema/users'
// import { eq } from 'drizzle-orm'
// import { DataTable } from '@/components/data-table'
// import Link from 'next/link'
// import { formatDistanceToNow } from 'date-fns'
// import type { ColumnDef } from '@tanstack/react-table'

// type Organization = {
//   id: string
//   name: string
//   createdAt: Date
// }

// const columns: ColumnDef<Organization>[] = [
//   {
//     accessorKey: 'name',
//     header: 'Name',
//     cell: ({ row }) => (
//       <Link
//         href={`/organizations/${row.original.id}`}
//         className='hover:underline'
//       >
//         {row.getValue('name')}
//       </Link>
//     )
//   },
//   {
//     accessorKey: 'createdAt',
//     header: 'Created',
//     cell: ({ row }) =>
//       formatDistanceToNow(row.original.createdAt, { addSuffix: true })
//   }
// ]

// export default async function Page() {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   const userOrgs = await db
//     .select({
//       id: organizations.id,
//       name: organizations.name,
//       createdAt: organizations.createdAt
//     })
//     .from(organizations)
//     .innerJoin(
//       userOrganizations,
//       eq(userOrganizations.organizationId, organizations.id)
//     )
//     .where(eq(userOrganizations.userId, session.user.id))
//     .orderBy(organizations.createdAt)

//   return (
//     <div className='space-y-4'>
//       <h1 className='text-2xl font-bold'>Organizations</h1>
//       <DataTable
//         columns={columns}
//         data={userOrgs}
//         filterColumn='name'
//         createLink='/organizations/new'
//         createLabel='Create Organization'
//       />
//     </div>
//   )
// }

// import { auth } from '@/lib/auth'
// import { redirect } from 'next/navigation'
// import { db } from '@/db'
// import { organizations, userOrganizations } from '@/db/schema/users'
// import { eq } from 'drizzle-orm'
// import { DataTable } from '@/components/data-table'
// import { Form } from './form'
// import { deleteAction } from './actions'

// export default async function Page() {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   const userOrgs = await db
//     .select({
//       id: organizations.id,
//       name: organizations.name,
//       createdAt: organizations.createdAt
//     })
//     .from(organizations)
//     .innerJoin(
//       userOrganizations,
//       eq(userOrganizations.organizationId, organizations.id)
//     )
//     .where(eq(userOrganizations.userId, session.user.id))
//     .orderBy(organizations.createdAt)

//   const columns = [
//     { header: 'Name', accessorKey: 'name' },
//     {
//       header: 'Created At',
//       accessorKey: 'createdAt',
//       cell: (item: (typeof userOrgs)[number]) =>
//         new Date(item.createdAt).toLocaleDateString()
//     }
//   ]

//   return (
//     <div className='space-y-4'>
//       <div className='flex items-center justify-between'>
//         <h1 className='text-2xl font-bold'>Organizations</h1>
//         <Form userId={session.user.id} />
//       </div>
//       <DataTable
//         data={userOrgs}
//         columns={columns}
//         onEdit={item => (
//           <Form
//             userId={session.user.id}
//             organization={{ id: item.id, name: item.name }}
//           />
//         )}
//         onDelete={deleteAction}
//         detailsPath='/organizations'
//       />
//     </div>
//   )
// }
