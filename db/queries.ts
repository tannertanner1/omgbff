import { eq, inArray } from 'drizzle-orm'
import { db } from '@/db'
import {
  organizations,
  userOrganizations,
  customers,
  invoices
} from '@/db/schema'
import { hasPermission } from '@/lib/abac'
import { verifySession } from '@/lib/dal'
import { notFound } from 'next/navigation'

async function getUserOrganizations() {
  const user = await verifySession()
  if (!user || !hasPermission(user, 'organizations', 'view')) {
    return []
  }

  return await db.query.userOrganizations.findMany({
    where: eq(userOrganizations.userId, user.id),
    with: {
      organization: true
    },
    orderBy: (userOrganizations, { desc }) => [
      desc(userOrganizations.createdAt)
    ]
  })
}

async function getOrganizationById(organizationId: string) {
  const user = await verifySession()
  if (!user || !hasPermission(user, 'organizations', 'view')) {
    return null
  }

  const organization = await db.query.organizations.findFirst({
    where: eq(organizations.id, organizationId),
    with: {
      userOrganizations: {
        with: {
          user: true
        }
      }
    }
  })

  if (!organization) {
    notFound()
  }

  return organization
}

async function getOrganizationCustomers(organizationId: string) {
  const user = await verifySession()
  if (!user || !hasPermission(user, 'customers', 'view')) {
    return []
  }

  return await db.query.customers
    .findMany({
      where: eq(customers.organizationId, organizationId),
      with: {
        invoices: {
          columns: {
            id: true,
            value: true
          }
        }
      }
    })
    .then(customers =>
      customers.map(customer => ({
        ...customer,
        invoiceCount: customer.invoices.length,
        invoiceTotal: customer.invoices.reduce(
          (sum, invoice) => sum + invoice.value,
          0
        )
      }))
    )
}

async function getOrganizationInvoices({
  organizationId
}: {
  organizationId: string
}) {
  const user = await verifySession()
  if (!user || !hasPermission(user, 'invoices', 'view')) {
    return []
  }

  const organizationCustomers = await getOrganizationCustomers(organizationId)
  const customerIds = organizationCustomers.map(customer => customer.id)

  return await db.query.invoices.findMany({
    where: inArray(invoices.customerId, customerIds),
    with: {
      customer: true
    }
  })
}

async function getCustomerById({
  customerId
}: {
  customerId: string
  userId?: string
  organizationId?: string
}) {
  if (!customerId) return null

  const customer = await db.query.customers.findFirst({
    where: eq(customers.id, customerId)
  })

  return customer
}

async function getInvoiceById({ invoiceId }: { invoiceId: string }) {
  const user = await verifySession()
  if (!user || !hasPermission(user, 'invoices', 'view')) {
    return null
  }

  const invoice = await db.query.invoices.findFirst({
    where: eq(invoices.id, invoiceId),
    with: {
      customer: true
    }
  })

  if (!invoice) {
    notFound()
  }

  return invoice
}

export {
  getUserOrganizations,
  getOrganizationById,
  getOrganizationCustomers,
  getOrganizationInvoices,
  getCustomerById,
  getInvoiceById
}
