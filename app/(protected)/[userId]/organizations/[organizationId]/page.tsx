import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { IconCircleX } from '@tabler/icons-react'
import { Customers } from './customers/component'
import { Invoices } from './invoices/component'
import {
  getOrganizationById,
  getOrganizationCustomers,
  getOrganizationInvoices
} from '@/db/queries'
import { verifySession } from '@/lib/dal'
import { hasPermission } from '@/lib/abac'
import type { Customer } from './customers/columns'
import type { Invoice } from './invoices/columns'

export default async function Page({
  params
}: {
  params: Promise<{ userId: string; organizationId: string }>
}) {
  const user = await verifySession()

  const { userId, organizationId } = await params

  if (!hasPermission(user, 'organizations', 'view')) {
    redirect(`/${user.id}/organizations`)
  }

  const [organization, customersData, invoicesData] = await Promise.all([
    getOrganizationById(organizationId),
    getOrganizationCustomers(organizationId),
    getOrganizationInvoices({ organizationId })
  ])

  if (!organization) return notFound()

  // Ensure data matches expected types and provide default empty arrays
  const customers: Customer[] =
    customersData?.map(customer => ({
      ...customer,
      createdAt:
        customer.createdAt instanceof Date
          ? customer.createdAt.toISOString()
          : customer.createdAt,
      updatedAt:
        customer.updatedAt instanceof Date
          ? customer.updatedAt.toISOString()
          : customer.updatedAt,
      invoiceCount: Number(customer.invoiceCount) || 0,
      invoiceTotal: Number(customer.invoiceTotal) || 0
    })) || []

  const invoices: Invoice[] =
    invoicesData?.map(invoice => ({
      ...invoice,
      createdAt:
        invoice.createdAt instanceof Date
          ? invoice.createdAt.toISOString()
          : invoice.createdAt,
      updatedAt:
        invoice.updatedAt instanceof Date
          ? invoice.updatedAt.toISOString()
          : invoice.updatedAt
    })) || []

  return (
    <div className='flex h-fit'>
      <div className='mx-auto w-full max-w-5xl p-4'>
        <div className='mb-8 flex items-center justify-between'>
          <h1 className='text-2xl font-semibold'>{organization.name}</h1>
          <Link href={`/${userId}/organizations`}>
            <IconCircleX className='h-6 w-6 text-muted-foreground transition-colors hover:text-primary' />
          </Link>
        </div>

        <div className='space-y-8'>
          <Customers
            customers={customers}
            userId={userId}
            organizationId={organizationId}
          />
          <Invoices
            invoices={invoices}
            userId={userId}
            organizationId={organizationId}
          />
        </div>
      </div>
    </div>
  )
}
