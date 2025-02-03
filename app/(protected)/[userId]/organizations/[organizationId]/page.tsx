import { auth } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { IconArrowLeft } from '@tabler/icons-react'
import { Table } from '@/components/data-table/table'
import { hasPermission } from '@/lib/abac'
import {
  getOrganizationById,
  getOrganizationCustomers,
  getOrganizationInvoices
} from '@/db/queries'
// import { getCustomerColumns } from './customers'
// import { getInvoiceColumns } from './invoices'

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

  const [customers, invoices] = await Promise.all([
    getOrganizationCustomers(params.organizationId),
    getOrganizationInvoices(params.organizationId)
  ])

  // const customerColumns = getCustomerColumns(
  //   params.userId,
  //   () => {}, // Add editAction
  //   async () => {} // Add deleteAction
  // )

  // const invoiceColumns = getInvoiceColumns(
  //   params.userId,
  //   () => {}, // Add editAction
  //   async () => {} // Add deleteAction
  // )

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
            <h2 className='mb-4 text-lg font-semibold'>Customers</h2>
            {/* <Table data={customers} columns={customerColumns} /> */}
          </section>

          <section>
            <h2 className='mb-4 text-lg font-semibold'>Invoices</h2>
            {/* <Table data={invoices} columns={invoiceColumns} /> */}
          </section>
        </div>
      </div>
    </div>
  )
}
