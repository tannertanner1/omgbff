import { auth } from '@/lib/auth'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import { CirclePlus } from 'lucide-react'
import { redirect } from 'next/navigation'

import { db } from '@/db'
import { customers, invoices } from '@/db/schema/invoices'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

export default async function Page() {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }

  const results = await db
    .select()
    .from(invoices)
    .innerJoin(customers, eq(invoices.customerId, customers.id))
    .where(eq(invoices.userId, session.user.id))

  console.log('Fetched invoices:', results) // Debug log

  const invoicesList = results.map(({ invoices, customers }) => ({
    ...invoices,
    customer: customers
  }))

  return (
    <main className='mx-auto w-full max-w-5xl px-6 pt-2'>
      <div className='mb-6 flex justify-between'>
        <h1 className='text-3xl font-semibold'>Invoices</h1>
        <Button variant='outline' asChild>
          <Link
            href='/dashboard/invoices/new'
            className='inline-flex items-center gap-2'
          >
            <CirclePlus className='h-4 w-4' />
            Create Invoice
          </Link>
        </Button>
      </div>
      {invoicesList.length === 0 ? (
        <p>No invoices found. Create your first invoice!</p>
      ) : (
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[100px] p-4'>Date</TableHead>
              <TableHead className='p-4'>Customer</TableHead>
              <TableHead className='p-4'>Email</TableHead>
              <TableHead className='p-4 text-center'>Status</TableHead>
              <TableHead className='p-4 text-right'>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoicesList.map(invoice => (
              <TableRow key={invoice.id}>
                <TableCell className='p-0 font-medium'>
                  <Link
                    href={`/dashboard/invoices/${invoice.id}`}
                    className='block p-4 font-semibold'
                  >
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </Link>
                </TableCell>
                <TableCell className='p-0'>
                  <Link
                    href={`/dashboard/invoices/${invoice.id}`}
                    className='block p-4 font-semibold'
                  >
                    {invoice.customer.name}
                  </Link>
                </TableCell>
                <TableCell className='p-0'>
                  <Link
                    href={`/dashboard/invoices/${invoice.id}`}
                    className='block p-4'
                  >
                    {invoice.customer.email}
                  </Link>
                </TableCell>
                <TableCell className='p-0 text-center'>
                  <Link
                    href={`/dashboard/invoices/${invoice.id}`}
                    className='block p-4'
                  >
                    <Badge
                      className={cn(
                        'rounded-full capitalize',
                        invoice.status === 'open' && 'bg-blue-500',
                        invoice.status === 'paid' && 'bg-green-600',
                        invoice.status === 'void' && 'bg-zinc-700',
                        invoice.status === 'uncollectible' && 'bg-red-600'
                      )}
                    >
                      {invoice.status}
                    </Badge>
                  </Link>
                </TableCell>
                <TableCell className='p-0 text-right'>
                  <Link
                    href={`/dashboard/invoices/${invoice.id}`}
                    className='block p-4 font-semibold'
                  >
                    ${(invoice.value / 100).toFixed(2)}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </main>
  )
}

// import { auth } from '@/lib/auth'
// import { eq } from 'drizzle-orm'
// import Link from 'next/link'
// import { CirclePlus } from 'lucide-react'
// import { redirect } from 'next/navigation'

// import { db } from '@/db'
// import { customers, invoices } from '@/db/schema/invoices'

// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow
// } from '@/components/ui/table'
// import { cn } from '@/lib/utils'

// export default async function Page() {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   const results = await db
//     .select()
//     .from(invoices)
//     .innerJoin(customers, eq(invoices.customerId, customers.id))
//     .where(eq(invoices.userId, session?.user?.id))

//   const invoicesList = results.map(({ invoices, customers }) => ({
//     ...invoices,
//     customer: customers
//   }))

//   return (
//     <main className='mx-auto w-full max-w-5xl px-6 pt-2'>
//       <div className='mb-6 flex justify-between'>
//         <h1 className='text-3xl font-semibold'>Invoices</h1>
//         <Button variant='outline' asChild>
//           <Link
//             href='/dashboard/invoices/new'
//             className='inline-flex items-center gap-2'
//           >
//             <CirclePlus className='h-4 w-4' />
//             Create Invoice
//           </Link>
//         </Button>
//       </div>
//       <Table>
//         <TableCaption>A list of your recent invoices.</TableCaption>
//         <TableHeader>
//           <TableRow>
//             <TableHead className='w-[100px] p-4'>Date</TableHead>
//             <TableHead className='p-4'>Customer</TableHead>
//             <TableHead className='p-4'>Email</TableHead>
//             <TableHead className='p-4 text-center'>Status</TableHead>
//             <TableHead className='p-4 text-right'>Value</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {invoicesList.map(invoice => (
//             <TableRow key={invoice.id}>
//               <TableCell className='p-0 font-medium'>
//                 <Link
//                   href={`/dashboard/invoices/${invoice.id}`}
//                   className='block p-4 font-semibold'
//                 >
//                   {new Date(invoice.createdAt).toLocaleDateString()}
//                 </Link>
//               </TableCell>
//               <TableCell className='p-0'>
//                 <Link
//                   href={`/dashboard/invoices/${invoice.id}`}
//                   className='block p-4 font-semibold'
//                 >
//                   {invoice.customer.name}
//                 </Link>
//               </TableCell>
//               <TableCell className='p-0'>
//                 <Link
//                   href={`/dashboard/invoices/${invoice.id}`}
//                   className='block p-4'
//                 >
//                   {invoice.customer.email}
//                 </Link>
//               </TableCell>
//               <TableCell className='p-0 text-center'>
//                 <Link
//                   href={`/dashboard/invoices/${invoice.id}`}
//                   className='block p-4'
//                 >
//                   <Badge
//                     className={cn(
//                       'rounded-full capitalize',
//                       invoice.status === 'open' && 'bg-blue-500',
//                       invoice.status === 'paid' && 'bg-green-600',
//                       invoice.status === 'void' && 'bg-zinc-700',
//                       invoice.status === 'uncollectible' && 'bg-red-600'
//                     )}
//                   >
//                     {invoice.status}
//                   </Badge>
//                 </Link>
//               </TableCell>
//               <TableCell className='p-0 text-right'>
//                 <Link
//                   href={`/dashboard/invoices/${invoice.id}`}
//                   className='block p-4 font-semibold'
//                 >
//                   ${(invoice.value / 100).toFixed(2)}
//                 </Link>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </main>
//   )
// }

// @note idek

// import { auth } from '@/lib/auth'
// import { redirect } from 'next/navigation'
// import { eq } from 'drizzle-orm'
// import Link from 'next/link'

// import { db } from '@/db'
// import { customers, invoices } from '@/db/schema/invoices'

// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow
// } from '@/components/ui/table'
// import { cn } from '@/lib/utils'

// export default async function Page() {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   const results = await db
//     .select()
//     .from(invoices)
//     .innerJoin(customers, eq(invoices.customerId, customers.id))
//     .where(eq(invoices.userId, session.user.id))

//   const invoicesList = results.map(({ invoices, customers }) => ({
//     ...invoices,
//     customer: customers
//   }))

//   return (
//     <main className='mx-auto w-full max-w-5xl px-6 pt-2'>
//       <div className='mb-6 flex justify-between'>
//         <h1 className='text-3xl font-semibold'>Invoices</h1>
//         <Button variant='outline' asChild>
//           <Link
//             href='/dashboard/invoices/new'
//             className='inline-flex items-center gap-2'
//           >
//             Create
//           </Link>
//         </Button>
//       </div>
//       <Table>
//         <TableCaption>A list of your recent invoices.</TableCaption>
//         <TableHeader>
//           <TableRow>
//             <TableHead className='w-[100px] p-4'>Date</TableHead>
//             <TableHead className='p-4'>Customer</TableHead>
//             <TableHead className='p-4'>Email</TableHead>
//             <TableHead className='p-4 text-center'>Status</TableHead>
//             <TableHead className='p-4 text-right'>Value</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {invoicesList.map(invoice => (
//             <TableRow key={invoice.id}>
//               <TableCell className='p-0 font-medium'>
//                 <Link
//                   href={`/dashboard/invoices/${invoice.id}`}
//                   className='block p-4 font-semibold'
//                 >
//                   {new Date(invoice.createdAt).toLocaleDateString()}
//                 </Link>
//               </TableCell>
//               <TableCell className='p-0'>
//                 <Link
//                   href={`/dashboard/invoices/${invoice.id}`}
//                   className='block p-4 font-semibold'
//                 >
//                   {invoice.customer.name}
//                 </Link>
//               </TableCell>
//               <TableCell className='p-0'>
//                 <Link
//                   href={`/dashboard/invoices/${invoice.id}`}
//                   className='block p-4'
//                 >
//                   {invoice.customer.email}
//                 </Link>
//               </TableCell>
//               <TableCell className='p-0 text-center'>
//                 <Link
//                   href={`/dashboard/invoices/${invoice.id}`}
//                   className='block p-4'
//                 >
//                   <Badge
//                     className={cn(
//                       'rounded-full capitalize',
//                       invoice.status === 'open' && 'bg-blue-500',
//                       invoice.status === 'paid' && 'bg-green-600',
//                       invoice.status === 'void' && 'bg-zinc-700',
//                       invoice.status === 'uncollectible' && 'bg-red-600'
//                     )}
//                   >
//                     {invoice.status}
//                   </Badge>
//                 </Link>
//               </TableCell>
//               <TableCell className='p-0 text-right'>
//                 <Link
//                   href={`/dashboard/invoices/${invoice.id}`}
//                   className='block p-4 font-semibold'
//                 >
//                   ${(invoice.value / 100).toFixed(2)}
//                 </Link>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </main>
//   )
// }

// @note doenst work...

// import { verifySession } from '@/lib/dal'
// import { eq } from 'drizzle-orm'
// import Link from 'next/link'
// import { CirclePlus } from 'lucide-react'

// import { db } from '@/db'
// import { customers, invoices } from '@/db/schema/invoices'

// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow
// } from '@/components/ui/table'
// import { cn } from '@/lib/utils'

// export default async function Page() {
//   const { user } = await verifySession()

//   const results = await db
//     .select()
//     .from(invoices)
//     .innerJoin(customers, eq(invoices.customerId, customers.id))
//     .where(eq(invoices.userId, user.id))

//   const invoicesList = results.map(({ invoices, customers }) => ({
//     ...invoices,
//     customer: customers
//   }))

//   return (
//     <main className='mx-auto w-full max-w-5xl px-6 pt-2'>
//       <div className='mb-6 flex justify-between'>
//         <h1 className='text-3xl font-semibold'>Invoices</h1>
//         <Button variant='outline' asChild>
//           <Link
//             href='/dashboard/invoices/new'
//             className='inline-flex items-center gap-2'
//           >
//             <CirclePlus className='h-4 w-4' />
//             Create Invoice
//           </Link>
//         </Button>
//       </div>
//       <Table>
//         <TableCaption>A list of your recent invoices.</TableCaption>
//         <TableHeader>
//           <TableRow>
//             <TableHead className='w-[100px] p-4'>Date</TableHead>
//             <TableHead className='p-4'>Customer</TableHead>
//             <TableHead className='p-4'>Email</TableHead>
//             <TableHead className='p-4 text-center'>Status</TableHead>
//             <TableHead className='p-4 text-right'>Value</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {invoicesList.map(invoice => (
//             <TableRow key={invoice.id}>
//               <TableCell className='p-0 font-medium'>
//                 <Link
//                   href={`/dashboard/invoices/${invoice.id}`}
//                   className='block p-4 font-semibold'
//                 >
//                   {new Date(invoice.createdAt).toLocaleDateString()}
//                 </Link>
//               </TableCell>
//               <TableCell className='p-0'>
//                 <Link
//                   href={`/dashboard/invoices/${invoice.id}`}
//                   className='block p-4 font-semibold'
//                 >
//                   {invoice.customer.name}
//                 </Link>
//               </TableCell>
//               <TableCell className='p-0'>
//                 <Link
//                   href={`/dashboard/invoices/${invoice.id}`}
//                   className='block p-4'
//                 >
//                   {invoice.customer.email}
//                 </Link>
//               </TableCell>
//               <TableCell className='p-0 text-center'>
//                 <Link
//                   href={`/dashboard/invoices/${invoice.id}`}
//                   className='block p-4'
//                 >
//                   <Badge
//                     className={cn(
//                       'rounded-full capitalize',
//                       invoice.status === 'open' && 'bg-blue-500',
//                       invoice.status === 'paid' && 'bg-green-600',
//                       invoice.status === 'void' && 'bg-zinc-700',
//                       invoice.status === 'uncollectible' && 'bg-red-600'
//                     )}
//                   >
//                     {invoice.status}
//                   </Badge>
//                 </Link>
//               </TableCell>
//               <TableCell className='p-0 text-right'>
//                 <Link
//                   href={`/dashboard/invoices/${invoice.id}`}
//                   className='block p-4 font-semibold'
//                 >
//                   ${(invoice.value / 100).toFixed(2)}
//                 </Link>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </main>
//   )
// }

// @note worked ?

// import { auth } from '@/lib/auth'
// import { notFound } from 'next/navigation'
// import { eq } from 'drizzle-orm'
// import Link from 'next/link'

// import { db } from '@/db'
// import { customers, invoices } from '@/db/schema/invoices'

// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow
// } from '@/components/ui/table'
// import { cn } from '@/lib/utils'

// export default async function Page() {
//   const session = await auth()
//   // if (!session?.user?.id) {
//   //   notFound()
//   // }

//   const results = await db
//     .select()
//     .from(invoices)
//     .innerJoin(customers, eq(invoices.customerId, customers.id))
//     .where(eq(invoices.userId, session?.user.id))

//   const invoicesList = results.map(({ invoices, customers }) => ({
//     ...invoices,
//     customer: customers
//   }))

//   return (
//     <main className='mx-auto w-full max-w-5xl px-6 pt-2'>
//       <div className='mb-6 flex justify-between'>
//         <h1 className='text-3xl font-semibold'>Invoices</h1>
//         <Button variant='outline' asChild>
//           <Link
//             href='/dashboard/invoices/new'
//             className='inline-flex items-center gap-2'
//           >
//             Create
//           </Link>
//         </Button>
//       </div>
//       <Table>
//         <TableCaption>A list of your recent invoices.</TableCaption>
//         <TableHeader>
//           <TableRow>
//             <TableHead className='w-[100px] p-4'>Date</TableHead>
//             <TableHead className='p-4'>Customer</TableHead>
//             <TableHead className='p-4'>Email</TableHead>
//             <TableHead className='p-4 text-center'>Status</TableHead>
//             <TableHead className='p-4 text-right'>Value</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {invoicesList.map(invoice => (
//             <TableRow key={invoice.id}>
//               <TableCell className='p-0 font-medium'>
//                 <Link
//                   href={`/invoices/${invoice.id}`}
//                   className='block p-4 font-semibold'
//                 >
//                   {new Date(invoice.createdAt).toLocaleDateString()}
//                 </Link>
//               </TableCell>
//               <TableCell className='p-0'>
//                 <Link
//                   href={`/invoices/${invoice.id}`}
//                   className='block p-4 font-semibold'
//                 >
//                   {invoice.customer.name}
//                 </Link>
//               </TableCell>
//               <TableCell className='p-0'>
//                 <Link href={`/invoices/${invoice.id}`} className='block p-4'>
//                   {invoice.customer.email}
//                 </Link>
//               </TableCell>
//               <TableCell className='p-0 text-center'>
//                 <Link href={`/invoices/${invoice.id}`} className='block p-4'>
//                   <Badge
//                     className={cn(
//                       'rounded-full capitalize',
//                       invoice.status === 'open' && 'bg-blue-500',
//                       invoice.status === 'paid' && 'bg-green-600',
//                       invoice.status === 'void' && 'bg-zinc-700',
//                       invoice.status === 'uncollectible' && 'bg-red-600'
//                     )}
//                   >
//                     {invoice.status}
//                   </Badge>
//                 </Link>
//               </TableCell>
//               <TableCell className='p-0 text-right'>
//                 <Link
//                   href={`/invoices/${invoice.id}`}
//                   className='block p-4 font-semibold'
//                 >
//                   ${(invoice.value / 100).toFixed(2)}
//                 </Link>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </main>
//   )
// }

// import { redirect } from 'next/navigation'
// import { auth } from '@/lib/auth'
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle
// } from '@/components/ui/card'
// import { Input } from '@/components/ui/input'
// import { Button } from '@/components/ui/button'
// import { cn } from '@/lib/utils'

// export default async function Page() {
//   const session = await auth()
//   if (!session) redirect('/dashboard')

//   return (
//     <div className='min-w-sm container mx-auto w-full max-w-lg'>
//       <div className='flex items-center gap-2 self-center'>
//         <Card className={cn('w-full shadow-none backdrop-blur-sm')}>
//           <CardHeader>
//             <CardTitle>Invoice</CardTitle>
//             <CardDescription></CardDescription>
//           </CardHeader>
//           <CardContent className='mt-6 space-y-4'>
//             <div>
//               <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
//                 Name
//               </label>
//               <Input
//                 className={cn('mt-2 w-full shadow-none focus-visible:ring-0')}
//                 placeholder=''
//               />
//             </div>
//             <div>
//               <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
//                 Email
//               </label>
//               <Input className='mt-2' placeholder='' />
//             </div>
//             <div>
//               <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
//                 Value
//               </label>
//               <Input className='mt-2' placeholder='' />
//             </div>
//             <div>
//               <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
//                 Description
//               </label>
//               <Input className='mt-2' placeholder='' />
//             </div>
//           </CardContent>
//           <CardFooter className='flex justify-end gap-4'>
//             <Button variant='ghost'>Submit</Button>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   )
// }
