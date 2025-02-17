import { redirect } from 'next/navigation'
import { getAllInvoices, getUserInvoices } from '@/db/queries'
import { verifySession } from '@/lib/dal'
import { hasPermission } from '@/lib/abac'
import { Component } from './component'
import type { Invoice } from './columns'

export default async function Page() {
  const user = await verifySession()

  if (!hasPermission(user, 'invoices', 'view')) {
    redirect('/')
  }

  let invoiceData
  if (user.role === 'admin' || user.role === 'owner') {
    invoiceData = await getAllInvoices()
  } else {
    invoiceData = await getUserInvoices({ userId: user.id })
  }

  const invoices: Invoice[] = invoiceData.map(invoice => ({
    ...invoice,
    createdAt:
      invoice.createdAt instanceof Date
        ? invoice.createdAt.toISOString()
        : invoice.createdAt,
    updatedAt:
      invoice.updatedAt instanceof Date
        ? invoice.updatedAt.toISOString()
        : invoice.updatedAt,
    customer: {
      email: invoice.customer.email,
      name: invoice.customer.name
    }
  }))

  return <Component invoices={invoices} userId={user.id} />
}

// import { notFound, redirect } from 'next/navigation'
// import { getAllInvoices } from '@/db/queries'
// import { verifySession } from '@/lib/dal'
// import { hasPermission } from '@/lib/abac'
// import { Component } from './component'
// import type { Invoice } from './columns'

// export default async function Page() {
//   const user = await verifySession()

//   if (!hasPermission(user, 'invoices', 'view')) {
//     redirect('/')
//   }
//   if (user.role !== 'admin' && user.role !== 'owner') {
//     notFound()
//   }

//   const invoiceData = await getAllInvoices()
//   const invoices: Invoice[] = invoiceData.map(invoice => ({
//     ...invoice,
//     createdAt:
//       invoice.createdAt instanceof Date
//         ? invoice.createdAt.toISOString()
//         : invoice.createdAt,
//     updatedAt:
//       invoice.updatedAt instanceof Date
//         ? invoice.updatedAt.toISOString()
//         : invoice.updatedAt,
//     customer: {
//       email: invoice.customer.email,
//       name: invoice.customer.name
//     }
//   }))

//   return <Component invoices={invoices} userId={user.id} />
// }
