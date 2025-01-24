import { auth } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import { db } from '@/db'
import { organizations } from '@/db/schema/users'
import { customers, invoices } from '@/db/schema/invoices'
import { eq } from 'drizzle-orm'
import { DataTable } from '@/_private/components/data-table'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { IconArrowLeft } from '@tabler/icons-react'
import { formatDistanceToNow } from 'date-fns'

export default async function OrganizationPage({
  params
}: {
  params: { id: string }
}) {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }

  const [organization] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, params.id))
    .limit(1)

  if (!organization) {
    notFound()
  }

  const organizationCustomers = await db
    .select()
    .from(customers)
    .where(eq(customers.organizationId, organization.id))

  const organizationInvoices = await db
    .select({
      id: invoices.id,
      customerId: invoices.customerId,
      customerName: customers.name,
      value: invoices.value,
      status: invoices.status,
      createdAt: invoices.createdAt
    })
    .from(invoices)
    .innerJoin(customers, eq(invoices.customerId, customers.id))
    .where(eq(customers.organizationId, organization.id))

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Link href='/organizations'>
            <Button variant='ghost' size='icon'>
              <IconArrowLeft className='h-4 w-4' />
            </Button>
          </Link>
          <h1 className='text-2xl font-bold'>{organization.name}</h1>
        </div>
        <div className='text-sm text-muted-foreground'>
          Created{' '}
          {formatDistanceToNow(organization.createdAt, { addSuffix: true })}
        </div>
      </div>

      <div className='grid gap-6'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold'>Customers</h2>
            <Button asChild>
              <Link href={`/organizations/${organization.id}/customers/new`}>
                Add Customer
              </Link>
            </Button>
          </div>
          <DataTable
            columns={[
              {
                accessorKey: 'name',
                header: 'Name'
              },
              {
                accessorKey: 'email',
                header: 'Email'
              },
              {
                accessorKey: 'createdAt',
                header: 'Created',
                cell: ({ row }) =>
                  formatDistanceToNow(row.original.createdAt, {
                    addSuffix: true
                  })
              }
            ]}
            data={organizationCustomers}
            filterColumn='name'
          />
        </div>

        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold'>Invoices</h2>
            <Button asChild>
              <Link href={`/organizations/${organization.id}/invoices/new`}>
                Create Invoice
              </Link>
            </Button>
          </div>
          <DataTable
            columns={[
              {
                accessorKey: 'customerName',
                header: 'Customer'
              },
              {
                accessorKey: 'value',
                header: 'Amount',
                cell: ({ row }) => `$${(row.original.value / 100).toFixed(2)}`
              },
              {
                accessorKey: 'status',
                header: 'Status'
              },
              {
                accessorKey: 'createdAt',
                header: 'Created',
                cell: ({ row }) =>
                  formatDistanceToNow(row.original.createdAt, {
                    addSuffix: true
                  })
              }
            ]}
            data={organizationInvoices}
            filterColumn='customerName'
          />
        </div>
      </div>
    </div>
  )
}

// import { auth } from '@/lib/auth'
// import { notFound, redirect } from 'next/navigation'
// import { db } from '@/db'
// import { organizations } from '@/db/schema/users'
// import { customers, invoices } from '@/db/schema/invoices'
// import { eq } from 'drizzle-orm'
// import { DataTable } from '@/components/data-table'
// import Link from 'next/link'
// import { formatDistanceToNow } from 'date-fns'
// import { Button } from '@/components/ui/button'
// import { IconArrowLeft } from '@tabler/icons-react'
// import type { ColumnDef } from '@tanstack/react-table'

// type Customer = {
//   id: number
//   name: string
//   email: string
//   createdAt: Date
// }

// type Invoice = {
//   id: number
//   customerName: string
//   value: number
//   status: string
//   createdAt: Date
// }

// const customerColumns: ColumnDef<Customer>[] = [
//   {
//     accessorKey: 'name',
//     header: 'Name',
//     cell: ({ row }) => (
//       <Link href={`/customers/${row.original.id}`} className='hover:underline'>
//         {row.getValue('name')}
//       </Link>
//     )
//   },
//   {
//     accessorKey: 'email',
//     header: 'Email'
//   },
//   {
//     accessorKey: 'createdAt',
//     header: 'Created',
//     cell: ({ row }) =>
//       formatDistanceToNow(row.original.createdAt, { addSuffix: true })
//   }
// ]

// const invoiceColumns: ColumnDef<Invoice>[] = [
//   {
//     accessorKey: 'customerName',
//     header: 'Customer'
//   },
//   {
//     accessorKey: 'value',
//     header: 'Amount',
//     cell: ({ row }) => `$${(row.original.value / 100).toFixed(2)}`
//   },
//   {
//     accessorKey: 'status',
//     header: 'Status'
//   },
//   {
//     accessorKey: 'createdAt',
//     header: 'Created',
//     cell: ({ row }) =>
//       formatDistanceToNow(row.original.createdAt, { addSuffix: true })
//   }
// ]

// export default async function Page({ params }: { params: { id: string } }) {
//   const { id } = params

//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   const [organization] = await db
//     .select()
//     .from(organizations)
//     .where(eq(organizations.id, id))
//     .limit(1)

//   if (!organization) {
//     notFound()
//   }

//   const organizationCustomers = await db
//     .select()
//     .from(customers)
//     .where(eq(customers.organizationId, organization.id))

//   const organizationInvoices = await db
//     .select({
//       id: invoices.id,
//       customerId: invoices.customerId,
//       customerName: customers.name,
//       value: invoices.value,
//       status: invoices.status,
//       createdAt: invoices.createdAt
//     })
//     .from(invoices)
//     .innerJoin(customers, eq(invoices.customerId, customers.id))
//     .where(eq(customers.organizationId, organization.id))

//   return (
//     <div className='space-y-6'>
//       <div className='flex items-center justify-between'>
//         <div className='flex items-center gap-4'>
//           <Link href='/organizations'>
//             <Button variant='ghost' size='icon'>
//               <IconArrowLeft className='h-4 w-4' />
//             </Button>
//           </Link>
//           <h1 className='text-2xl font-bold'>{organization.name}</h1>
//         </div>
//       </div>

//       <div className='grid gap-6'>
//         <div className='space-y-4'>
//           <div className='flex items-center justify-between'>
//             <h2 className='text-lg font-semibold'>Customers</h2>
//             <Link
//               href={`/organizations/${organization.id}/customers/new`}
//               passHref
//             >
//               <Button>Add Customer</Button>
//             </Link>
//           </div>
//           <DataTable
//             columns={customerColumns}
//             data={organizationCustomers}
//             filterColumn='name'
//           />
//         </div>

//         <div className='space-y-4'>
//           <div className='flex items-center justify-between'>
//             <h2 className='text-lg font-semibold'>Invoices</h2>
//             <Link
//               href={`/organizations/${organization.id}/invoices/new`}
//               passHref
//             >
//               <Button>Create Invoice</Button>
//             </Link>
//           </div>
//           <DataTable
//             columns={invoiceColumns}
//             data={organizationInvoices}
//             filterColumn='customerName'
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// import { auth } from '@/lib/auth'
// import { notFound, redirect } from 'next/navigation'
// import { db } from '@/db'
// import { organizations } from '@/db/schema/users'
// import { customers, invoices } from '@/db/schema/invoices'
// import { eq } from 'drizzle-orm'
// import { DataTable } from '@/components/data-table'
// import Link from 'next/link'
// import { formatDistanceToNow } from 'date-fns'
// import { Button } from '@/components/ui/button'
// import { IconArrowLeft } from '@tabler/icons-react'
// import type { ColumnDef } from '@tanstack/react-table'

// type Customer = {
//   id: number
//   name: string
//   email: string
//   createdAt: Date
// }

// type Invoice = {
//   id: number
//   customerName: string
//   value: number
//   status: string
//   createdAt: Date
// }

// const customerColumns: ColumnDef<Customer>[] = [
//   {
//     accessorKey: 'name',
//     header: 'Name',
//     cell: ({ row }) => (
//       <Link href={`/customers/${row.original.id}`} className='hover:underline'>
//         {row.getValue('name')}
//       </Link>
//     )
//   },
//   {
//     accessorKey: 'email',
//     header: 'Email'
//   },
//   {
//     accessorKey: 'createdAt',
//     header: 'Created',
//     cell: ({ row }) =>
//       formatDistanceToNow(row.original.createdAt, { addSuffix: true })
//   }
// ]

// const invoiceColumns: ColumnDef<Invoice>[] = [
//   {
//     accessorKey: 'customerName',
//     header: 'Customer'
//   },
//   {
//     accessorKey: 'value',
//     header: 'Amount',
//     cell: ({ row }) => `$${(row.original.value / 100).toFixed(2)}`
//   },
//   {
//     accessorKey: 'status',
//     header: 'Status'
//   },
//   {
//     accessorKey: 'createdAt',
//     header: 'Created',
//     cell: ({ row }) =>
//       formatDistanceToNow(row.original.createdAt, { addSuffix: true })
//   }
// ]

// export default async function Page({ params }: { params: { id: string } }) {
//   const { id } = params // No need to await here since the params object itself is available

//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   const [organization] = await db
//     .select()
//     .from(organizations)
//     .where(eq(organizations.id, id)) // Use id directly here
//     .limit(1)

//   if (!organization) {
//     notFound()
//   }

//   const organizationCustomers = await db
//     .select()
//     .from(customers)
//     .where(eq(customers.organizationId, organization.id))

//   const organizationInvoices = await db
//     .select({
//       id: invoices.id,
//       customerId: invoices.customerId,
//       customerName: customers.name,
//       value: invoices.value,
//       status: invoices.status,
//       createdAt: invoices.createdAt
//     })
//     .from(invoices)
//     .innerJoin(customers, eq(invoices.customerId, customers.id))
//     .where(eq(customers.organizationId, organization.id))

//   return (
//     <div className='space-y-6'>
//       <div className='flex items-center justify-between'>
//         <div className='flex items-center gap-4'>
//           <Link href='/organizations'>
//             <Button variant='ghost' size='icon'>
//               <IconArrowLeft className='h-4 w-4' />
//             </Button>
//           </Link>
//           <h1 className='text-2xl font-bold'>{organization.name}</h1>
//         </div>
//       </div>

//       <div className='grid gap-6'>
//         <div className='space-y-4'>
//           <h2 className='text-lg font-semibold'>Customers</h2>
//           <DataTable
//             columns={customerColumns}
//             data={organizationCustomers}
//             filterColumn='name'
//             createLink={`/organizations/${organization.id}/customers/new`}
//             createLabel='Add Customer'
//           />
//         </div>

//         <div className='space-y-4'>
//           <h2 className='text-lg font-semibold'>Invoices</h2>
//           <DataTable
//             columns={invoiceColumns}
//             data={organizationInvoices}
//             filterColumn='customerName'
//             createLink={`/organizations/${organization.id}/invoices/new`}
//             createLabel='Create Invoice'
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// import { auth } from '@/lib/auth'
// import { notFound, redirect } from 'next/navigation'
// import { db } from '@/db'
// import { organizations } from '@/db/schema/users'
// import { customers, invoices } from '@/db/schema/invoices'
// import { eq } from 'drizzle-orm'
// import { DataTable } from '@/components/data-table'
// import Link from 'next/link'
// import { formatDistanceToNow } from 'date-fns'
// import { Button } from '@/components/ui/button'
// import { IconArrowLeft } from '@tabler/icons-react'
// import type { ColumnDef } from '@tanstack/react-table'

// type Customer = {
//   id: number
//   name: string
//   email: string
//   createdAt: Date
// }

// type Invoice = {
//   id: number
//   customerName: string
//   value: number
//   status: string
//   createdAt: Date
// }

// const customerColumns: ColumnDef<Customer>[] = [
//   {
//     accessorKey: 'name',
//     header: 'Name',
//     cell: ({ row }) => (
//       <Link href={`/customers/${row.original.id}`} className='hover:underline'>
//         {row.getValue('name')}
//       </Link>
//     )
//   },
//   {
//     accessorKey: 'email',
//     header: 'Email'
//   },
//   {
//     accessorKey: 'createdAt',
//     header: 'Created',
//     cell: ({ row }) =>
//       formatDistanceToNow(row.original.createdAt, { addSuffix: true })
//   }
// ]

// const invoiceColumns: ColumnDef<Invoice>[] = [
//   {
//     accessorKey: 'customerName',
//     header: 'Customer'
//   },
//   {
//     accessorKey: 'value',
//     header: 'Amount',
//     cell: ({ row }) => `$${(row.original.value / 100).toFixed(2)}`
//   },
//   {
//     accessorKey: 'status',
//     header: 'Status'
//   },
//   {
//     accessorKey: 'createdAt',
//     header: 'Created',
//     cell: ({ row }) =>
//       formatDistanceToNow(row.original.createdAt, { addSuffix: true })
//   }
// ]

// export default async function Page({ params }: { params: { id: string } }) {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   const [organization] = await db
//     .select()
//     .from(organizations)
//     .where(eq(organizations.id, params.id))
//     .limit(1)

//   if (!organization) {
//     notFound()
//   }

//   const organizationCustomers = await db
//     .select()
//     .from(customers)
//     .where(eq(customers.organizationId, organization.id))

//   const organizationInvoices = await db
//     .select({
//       id: invoices.id,
//       customerId: invoices.customerId,
//       customerName: customers.name,
//       value: invoices.value,
//       status: invoices.status,
//       createdAt: invoices.createdAt
//     })
//     .from(invoices)
//     .innerJoin(customers, eq(invoices.customerId, customers.id))
//     .where(eq(customers.organizationId, organization.id))

//   return (
//     <div className='space-y-6'>
//       <div className='flex items-center justify-between'>
//         <div className='flex items-center gap-4'>
//           <Link href='/organizations'>
//             <Button variant='ghost' size='icon'>
//               <IconArrowLeft className='h-4 w-4' />
//             </Button>
//           </Link>
//           <h1 className='text-2xl font-bold'>{organization.name}</h1>
//         </div>
//       </div>

//       <div className='grid gap-6'>
//         <div className='space-y-4'>
//           <h2 className='text-lg font-semibold'>Customers</h2>
//           <DataTable
//             columns={customerColumns}
//             data={organizationCustomers}
//             filterColumn='name'
//             createLink={`/organizations/${organization.id}/customers/new`}
//             createLabel='Add Customer'
//           />
//         </div>

//         <div className='space-y-4'>
//           <h2 className='text-lg font-semibold'>Invoices</h2>
//           <DataTable
//             columns={invoiceColumns}
//             data={organizationInvoices}
//             filterColumn='customerName'
//             createLink={`/organizations/${organization.id}/invoices/new`}
//             createLabel='Create Invoice'
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// import Link from 'next/link'
// import { notFound, redirect } from 'next/navigation'
// import { eq } from 'drizzle-orm'
// import { Button } from '@/components/ui/button'
// import { IconArrowLeft } from '@tabler/icons-react'
// import { auth } from '@/lib/auth'
// import { db } from '@/db'
// import { organizations } from '@/db/schema/users'
// import { customers, invoices } from '@/db/schema/invoices'
// import { DataTable } from '@/components/data-table'
// import { Form } from '../form'

// export default async function Page({
//   params
// }: {
//   params: { organizationId: string }
// }) {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   const [organization] = await db
//     .select()
//     .from(organizations)
//     .where(eq(organizations.id, params.organizationId))
//     .limit(1)

//   if (!organization) {
//     notFound()
//   }

//   // Fetch related customers and invoices
//   const organizationCustomers = await db
//     .select()
//     .from(customers)
//     .where(eq(customers.organizationId, organization.id))

//   const organizationInvoices = await db
//     .select({
//       id: invoices.id,
//       customerId: invoices.customerId,
//       customerName: customers.name,
//       value: invoices.value,
//       status: invoices.status,
//       createdAt: invoices.createdAt
//     })
//     .from(invoices)
//     .innerJoin(customers, eq(invoices.customerId, customers.id))
//     .where(eq(customers.organizationId, organization.id))

//   return (
//     <div className='space-y-6'>
//       <div className='flex items-center justify-between'>
//         <div className='flex items-center gap-4'>
//           <Link href='/organizations'>
//             <Button variant='ghost' size='icon'>
//               <IconArrowLeft className='h-4 w-4' />
//             </Button>
//           </Link>
//           <h1 className='text-2xl font-bold'>{organization.name}</h1>
//         </div>
//         <Form
//           userId={session.user.id}
//           organization={{ id: organization.id, name: organization.name }}
//         />
//       </div>

//       <div className='grid gap-6'>
//         <div className='space-y-4'>
//           <h2 className='text-lg font-semibold'>Customers</h2>
//           <DataTable
//             data={organizationCustomers}
//             columns={[
//               { header: 'Name', accessorKey: 'name' },
//               { header: 'Email', accessorKey: 'email' },
//               {
//                 header: 'Created',
//                 accessorKey: 'createdAt',
//                 cell: item => new Date(item.createdAt).toLocaleDateString()
//               }
//             ]}
//             detailsPath={`/organizations/${organization.id}/customers`}
//           />
//         </div>

//         <div className='space-y-4'>
//           <h2 className='text-lg font-semibold'>Invoices</h2>
//           <DataTable
//             data={organizationInvoices}
//             columns={[
//               { header: 'Customer', accessorKey: 'customerName' },
//               {
//                 header: 'Amount',
//                 accessorKey: 'value',
//                 cell: item => `$${(item.value / 100).toFixed(2)}`
//               },
//               { header: 'Status', accessorKey: 'status' },
//               {
//                 header: 'Created',
//                 accessorKey: 'createdAt',
//                 cell: item => new Date(item.createdAt).toLocaleDateString()
//               }
//             ]}
//             detailsPath={`/organizations/${organization.id}/invoices`}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }
