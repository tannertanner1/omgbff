import { auth } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { IconArrowLeft } from '@tabler/icons-react'
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
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Link href={`/${params.userId}/organizations`}>
            <Button variant='ghost' size='icon'>
              <IconArrowLeft className='h-4 w-4' />
            </Button>
          </Link>
          <h1 className='text-2xl font-bold'>{organization.name}</h1>
        </div>
        <div className='flex items-center gap-2'>
          {hasPermission(session.user, 'organizations', 'update') && (
            <Button variant='outline' asChild>
              <Link
                href={`/${params.userId}/organizations/${organization.id}/edit`}
              >
                Edit
              </Link>
            </Button>
          )}
          {hasPermission(session.user, 'organizations', 'delete') && (
            <Button variant='destructive' asChild>
              <Link
                href={`/${params.userId}/organizations/${organization.id}/delete`}
              >
                Delete
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className='grid gap-6'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold'>Customers</h2>
            {hasPermission(session.user, 'customers', 'create') && (
              <Button asChild>
                <Link
                  href={`/${params.userId}/customers/new?org=${organization.id}`}
                >
                  Add Customer
                </Link>
              </Button>
            )}
          </div>
          <DataTable
            columns={customerColumns}
            data={customers.map(customer => ({
              ...customer,
              userId: params.userId
            }))}
            filterColumn='name'
          />
        </div>

        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold'>Invoices</h2>
            {hasPermission(session.user, 'invoices', 'create') && (
              <Button asChild>
                <Link
                  href={`/${params.userId}/invoices/new?org=${organization.id}`}
                >
                  Create Invoice
                </Link>
              </Button>
            )}
          </div>
          <DataTable
            columns={invoiceColumns}
            data={invoices.map(invoice => ({
              ...invoice,
              userId: params.userId,
              customerName: invoice.customer.name // Add the customer name from the relation
            }))}
            filterColumn='customerName'
          />
        </div>
      </div>
    </div>
  )
}
