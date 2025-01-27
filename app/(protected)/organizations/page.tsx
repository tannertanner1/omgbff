import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { organizations, userOrganizations } from '@/db/schema/users'
import { eq } from 'drizzle-orm'
import { DataTable } from '@/components/data-table'
import { CreateOrganizationForm } from './form'
import { columns } from './columns'

export default async function Page() {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }

  const userOrgs = await db
    .select({
      id: organizations.id,
      name: organizations.name,
      createdAt: organizations.createdAt
    })
    .from(organizations)
    .innerJoin(
      userOrganizations,
      eq(userOrganizations.organizationId, organizations.id)
    )
    .where(eq(userOrganizations.userId, session.user.id))
    .orderBy(organizations.createdAt)

  return (
    <div className='space-y-4 p-8 pt-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold tracking-tight'>Organizations</h1>
        <CreateOrganizationForm userId={session.user.id} />
      </div>
      {/* <DataTable columns={columns} data={userOrgs} filterColumn='name' /> */}
    </div>
  )
}

// import { auth } from '@/lib/auth'
// import { redirect } from 'next/navigation'
// import { db } from '@/db'
// import { organizations, userOrganizations } from '@/db/schema/users'
// import { eq } from 'drizzle-orm'
// import { DataTable } from '@/components/data-table'
// import { CreateOrganizationForm } from './form'
// import Link from 'next/link'
// import { formatDistanceToNow } from 'date-fns'

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
//     {
//       accessorKey: 'name',
//       header: 'Name',
//       cell: ({ row }) => (
//         <Link
//           href={`/organizations/${row.original.id}`}
//           className='hover:underline'
//         >
//           {row.getValue('name')}
//         </Link>
//       )
//     },
//     {
//       accessorKey: 'createdAt',
//       header: 'Created',
//       cell: ({ row }) =>
//         formatDistanceToNow(row.getValue('createdAt'), { addSuffix: true })
//     }
//   ]

//   return (
//     <div className='space-y-4 p-8 pt-6'>
//       <div className='flex items-center justify-between'>
//         <h1 className='text-3xl font-bold tracking-tight'>Organizations</h1>
//         <CreateOrganizationForm userId={session.user.id} />
//       </div>
//       <DataTable columns={columns} data={userOrgs} filterColumn='name' />
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
// import { columns } from './columns'
// import { Button } from '@/components/ui/button'
// import { IconCirclePlus } from '@tabler/icons-react'

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
//     <div className='flex h-screen'>
//       <div className='mx-auto w-full max-w-5xl px-4'>
//         <div className='mb-4 flex items-center justify-between'>
//           <h1 className='text-2xl font-bold'>Organizations</h1>
//           <Form userId={session.user.id}>
//             <Button>
//               <IconCirclePlus className='mr-2 h-4 w-4' />
//               Create Organization
//             </Button>
//           </Form>
//         </div>
//         <DataTable columns={columns} data={userOrgs} filterColumn='name' />
//       </div>
//     </div>
//   )
// }

// import { auth } from "@/lib/auth"
// import { redirect } from "next/navigation"
// import { db } from "@/db"
// import { organizations, userOrganizations } from "@/db/schema/users"
// import { eq } from "drizzle-orm"
// import { DataTable } from "@/components/data-table"
// import { columns } from "./columns"
// import { Button } from "@/components/ui/button"
// import { IconCirclePlus } from "@tabler/icons-react"
// import Link from "next/link"

// export default async function Page() {
//   const session = await auth()
//   if (!session) {
//     redirect("/login")
//   }

//   const userOrgs = await db
//     .select({
//       id: organizations.id,
//       name: organizations.name,
//       createdAt: organizations.createdAt,
//     })
//     .from(organizations)
//     .innerJoin(userOrganizations, eq(userOrganizations.organizationId, organizations.id))
//     .where(eq(userOrganizations.userId, session.user.id))
//     .orderBy(organizations.createdAt)

//   return (
//     <div className="flex h-screen">
//       <div className="mx-auto w-full max-w-5xl px-4">
//         <div className="mb-4 flex items-center justify-between">
//           <h1 className="text-2xl font-bold">Organizations</h1>
//           <Button asChild>
//             <Link href="/organizations/new">
//               <IconCirclePlus className="mr-2 h-4 w-4" />
//               Create Organization
//             </Link>
//           </Button>
//         </div>
//         <DataTable columns={columns} data={userOrgs} filterColumn="name" />
//       </div>
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
// import { columns } from './columns'
// import { IconCirclePlus } from '@tabler/icons-react'
// import { Button } from '@/components/ui/button'

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
//     <div className='flex h-screen'>
//       <div className='mx-auto w-full max-w-5xl px-4'>
//         <div className='mb-4 flex items-center justify-between'>
//           <h1 className='text-2xl font-bold'>Organizations</h1>
//           <Form userId={session.user.id}>
//             <Button variant='outline' size='icon' className='h-9 w-9'>
//               <IconCirclePlus className='h-5 w-5' />
//               <span className='sr-only'>Create Organization</span>
//             </Button>
//           </Form>
//         </div>
//         <DataTable columns={columns} data={userOrgs} filterColumn='name' />
//       </div>
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
// import { columns } from './columns'
// import { hasPermission } from '@/lib/abac'

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

//   const canCreateOrganization = hasPermission(
//     session.user,
//     'organizations',
//     'create'
//   )

//   return (
//     <div className='flex h-screen'>
//       <div className='mx-auto w-full max-w-5xl px-4'>
//         <h1 className='mb-4 text-2xl font-bold'>Organizations</h1>
//         <DataTable
//           columns={columns}
//           data={userOrgs}
//           filterColumn='name'
//           createButton={
//             canCreateOrganization && <Form userId={session.user.id} />
//           }
//         />
//       </div>
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
// import { columns } from './columns'
// import { hasPermission } from '@/lib/abac'
// import { IconCirclePlus } from '@tabler/icons-react'
// import { Button } from '@/components/ui/button'

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

//   const canCreateOrganization = hasPermission(
//     session.user,
//     'organizations',
//     'create'
//   )

//   return (
//     <div className='flex h-screen'>
//       <div className='mx-auto w-full max-w-5xl px-4'>
//         <h1 className='mb-4 text-2xl font-bold'>Organizations</h1>
//         <DataTable
//           columns={columns}
//           data={userOrgs}
//           filterColumn='name'
//           createButton={
//             canCreateOrganization && (
//               <Form userId={session.user.id}>
//                 <Button variant='ghost' size='icon'>
//                   <IconCirclePlus className='h-6 w-6' />
//                   <span className='sr-only'>Create Organization</span>
//                 </Button>
//               </Form>
//             )
//           }
//         />
//       </div>
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
// import { columns } from './columns'
// import { hasPermission } from '@/lib/abac'

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

//   const canCreateOrganization = hasPermission(
//     session.user,
//     'organizations',
//     'create'
//   )

//   return (
//     <div className='flex h-screen'>
//       <div className='mx-auto w-full max-w-5xl px-4'>
//         <div className='flex items-center justify-between'>
//           <h1 className='mb-4 text-2xl font-bold'>Organizations</h1>
//           {canCreateOrganization && <Form userId={session.user.id} />}
//         </div>
//         <DataTable columns={columns} data={userOrgs} filterColumn='name' />
//       </div>
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
// import Link from 'next/link'
// import { formatDistanceToNow } from 'date-fns'
// import type { ColumnDef } from '@tanstack/react-table'
// import { hasPermission } from '@/lib/abac'

// type Organization = {
//   id: string
//   name: string
//   createdAt: Date
// }

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

//   const columns: ColumnDef<Organization>[] = [
//     {
//       accessorKey: 'name',
//       header: 'Name',
//       cell: ({ row }) => {
//         const value = row.getValue('name') as string
//         const id = row.original.id
//         return (
//           <Link href={`/organizations/${id}`} className='hover:underline'>
//             {value}
//           </Link>
//         )
//       }
//     },
//     {
//       accessorKey: 'createdAt',
//       header: 'Created',
//       cell: ({ row }) => {
//         const date = row.getValue('createdAt') as Date
//         return formatDistanceToNow(date, { addSuffix: true })
//       }
//     }
//   ]

//   const canCreateOrganization = hasPermission(
//     session.user,
//     'organizations',
//     'create'
//   )

//   return (
//     <div className='space-y-4'>
//       <div className='flex items-center justify-between'>
//         <h1 className='text-2xl font-bold'>Organizations</h1>
//         {canCreateOrganization && <Form userId={session.user.id} />}
//       </div>
//       <DataTable columns={columns} data={userOrgs} filterColumn='name' />
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
// import Link from 'next/link'
// import { formatDistanceToNow } from 'date-fns'
// import type { ColumnDef } from '@tanstack/react-table'
// import { hasPermission } from '@/lib/abac'

// type Organization = {
//   id: string
//   name: string
//   createdAt: Date
// }

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

//   const columns: ColumnDef<Organization>[] = [
//     {
//       accessorKey: 'name',
//       header: 'Name',
//       cell: ({ row }) => (
//         <Link
//           href={`/organizations/${row.original.id}`}
//           className='hover:underline'
//         >
//           {row.getValue('name')}
//         </Link>
//       )
//     },
//     {
//       accessorKey: 'createdAt',
//       header: 'Created',
//       cell: ({ row }) =>
//         formatDistanceToNow(new Date(row.getValue('createdAt')), {
//           addSuffix: true
//         })
//     }
//   ]

//   const canCreateOrganization = hasPermission(
//     session.user,
//     'organizations',
//     'create'
//   )

//   return (
//     <div className='space-y-4'>
//       <div className='flex items-center justify-between'>
//         <h1 className='text-2xl font-bold'>Organizations</h1>
//         {canCreateOrganization && <Form userId={session.user.id} />}
//       </div>
//       <DataTable columns={columns} data={userOrgs} filterColumn='name' />
//     </div>
//   )
// }

// import { auth } from "@/lib/auth"
// import { redirect } from "next/navigation"
// import { db } from "@/db"
// import { organizations, userOrganizations } from "@/db/schema/users"
// import { eq } from "drizzle-orm"
// import { DataTable } from "@/components/data-table"
// import { Form } from "./form"
// import Link from "next/link"
// import { formatDistanceToNow } from "date-fns"
// import type { ColumnDef } from "@tanstack/react-table"
// import { hasPermission } from "@/lib/abac"

// type Organization = {
//   id: string
//   name: string
//   createdAt: Date
// }

// export default async function Page() {
//   const session = await auth()
//   if (!session) {
//     redirect("/login")
//   }

//   const userOrgs = await db
//     .select({
//       id: organizations.id,
//       name: organizations.name,
//       createdAt: organizations.createdAt,
//     })
//     .from(organizations)
//     .innerJoin(userOrganizations, eq(userOrganizations.organizationId, organizations.id))
//     .where(eq(userOrganizations.userId, session.user.id))
//     .orderBy(organizations.createdAt)

//   const columns: ColumnDef<Organization>[] = [
//     {
//       accessorKey: "name",
//       header: "Name",
//       cell: ({ row }) => (
//         <Link href={`/organizations/${row.original.id}`} className="hover:underline">
//           {row.getValue("name")}
//         </Link>
//       ),
//     },
//     {
//       accessorKey: "createdAt",
//       header: "Created",
//       cell: ({ row }) => formatDistanceToNow(new Date(row.getValue("createdAt")), { addSuffix: true }),
//     },
//   ]

//   const canCreateOrganization = hasPermission(session.user, "organizations", "create")

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold">Organizations</h1>
//         {canCreateOrganization && <Form userId={session.user.id} />}
//       </div>
//       <DataTable columns={columns} data={userOrgs} filterColumn="name" />
//     </div>
//   )
// }

// import { auth } from "@/lib/auth"
// import { redirect } from "next/navigation"
// import { db } from "@/db"
// import { organizations, userOrganizations } from "@/db/schema/users"
// import { eq } from "drizzle-orm"
// import { DataTable } from "@/components/data-table"
// import { Form } from "./form"
// import Link from "next/link"
// import { formatDistanceToNow } from "date-fns"
// import type { ColumnDef } from "@tanstack/react-table"
// import { hasPermission } from "@/lib/abac"

// type Organization = {
//   id: string
//   name: string
//   createdAt: Date
// }

// export default async function Page() {
//   const session = await auth()
//   if (!session) {
//     redirect("/login")
//   }

//   const userOrgs = await db
//     .select({
//       id: organizations.id,
//       name: organizations.name,
//       createdAt: organizations.createdAt,
//     })
//     .from(organizations)
//     .innerJoin(userOrganizations, eq(userOrganizations.organizationId, organizations.id))
//     .where(eq(userOrganizations.userId, session.user.id))
//     .orderBy(organizations.createdAt)

//   const columns: ColumnDef<Organization>[] = [
//     {
//       accessorKey: "name",
//       header: "Name",
//       cell: ({ row }) => (
//         <Link href={`/organizations/${row.original.id}`} className="hover:underline">
//           {row.getValue("name")}
//         </Link>
//       ),
//     },
//     {
//       accessorKey: "createdAt",
//       header: "Created",
//       cell: ({ row }) => formatDistanceToNow(new Date(row.getValue("createdAt")), { addSuffix: true }),
//     },
//   ]

//   const canCreateOrganization = hasPermission(session.user, "organizations", "create")

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold">Organizations</h1>
//         {canCreateOrganization && <Form userId={session.user.id} />}
//       </div>
//       <DataTable columns={columns} data={userOrgs} filterColumn="name" />
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
// import Link from 'next/link'
// import { formatDistanceToNow } from 'date-fns'
// import type { ColumnDef } from '@tanstack/react-table'

// type Organization = {
//   id: string
//   name: string
//   createdAt: Date
// }

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

//   const columns: ColumnDef<Organization>[] = [
//     {
//       accessorKey: 'name',
//       header: 'Name',
//       cell: ({ row }) => (
//         <Link
//           href={`/organizations/${row.original.id}`}
//           className='hover:underline'
//         >
//           {row.getValue('name')}
//         </Link>
//       )
//     },
//     {
//       accessorKey: 'createdAt',
//       header: 'Created',
//       cell: ({ row }) =>
//         formatDistanceToNow(new Date(row.getValue('createdAt')), {
//           addSuffix: true
//         })
//     }
//   ]

//   return (
//     <div className='space-y-4'>
//       <div className='flex items-center justify-between'>
//         <h1 className='text-2xl font-bold'>Organizations</h1>
//         <Form userId={session.user.id} />
//       </div>
//       <DataTable columns={columns} data={userOrgs} filterColumn='name' />
//     </div>
//   )
// }

// import { auth } from '@/lib/auth'
// import { redirect } from 'next/navigation'
// import { db } from '@/db'
// import { organizations, userOrganizations } from '@/db/schema/users'
// import { eq } from 'drizzle-orm'
// import { Component } from './component'

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

//   return <Component userId={session.user.id} userOrgs={userOrgs} />
// }

// import { auth } from '@/lib/auth'
// import { redirect } from 'next/navigation'
// import { db } from '@/db'
// import { organizations, userOrganizations } from '@/db/schema/users'
// import { eq } from 'drizzle-orm'
// import { Component } from './component'

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
//   return <Component />
// }
