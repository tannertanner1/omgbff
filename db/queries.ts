import { eq, inArray } from 'drizzle-orm'
import { db } from '@/db'
import {
  organizations,
  userOrganizations,
  customers,
  invoices,
  type users
} from '@/db/schema'
import { hasPermission } from '@/lib/abac'
import { verifySession } from '@/lib/dal'
import { notFound } from 'next/navigation'

async function getAllUsers(): Promise<(typeof users.$inferSelect)[] | []> {
  const user = await verifySession()
  if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
    return []
  }

  return await db.query.users.findMany({
    orderBy: (users, { desc }) => [desc(users.createdAt)]
  })
}

async function getAllOrganizations(): Promise<
  (typeof organizations.$inferSelect)[] | []
> {
  const user = await verifySession()
  if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
    return []
  }

  return await db.query.organizations.findMany({
    orderBy: (organizations, { desc }) => [desc(organizations.createdAt)]
  })
}

async function getAllCustomers(): Promise<
  | (typeof customers.$inferSelect & {
      invoiceCount: number
      invoiceTotal: number
      invoices: { id: string; amount: number }[]
    })[]
  | []
> {
  const user = await verifySession()
  if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
    return []
  }

  return await db.query.customers
    .findMany({
      with: {
        invoices: {
          columns: {
            id: true,
            amount: true
          }
        },
        organization: true
      }
    })
    .then(customers =>
      customers.map(customer => ({
        ...customer,
        invoiceCount: customer.invoices.length,
        invoiceTotal: customer.invoices.reduce(
          (sum: number, invoice: { amount: number }) => sum + invoice.amount,
          0
        ),
        invoices: customer.invoices
      }))
    )
}

async function getAllInvoices(): Promise<
  | (typeof invoices.$inferSelect & {
      customer: { name: string; email: string; organizationId: string }
    })[]
  | []
> {
  const user = await verifySession()
  if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
    return []
  }

  return await db.query.invoices.findMany({
    with: {
      customer: {
        columns: {
          name: true,
          email: true,
          organizationId: true
        }
      }
    },
    orderBy: (invoices, { desc }) => [desc(invoices.createdAt)]
  })
}

async function getUserOrganizations(): Promise<
  | (typeof userOrganizations.$inferSelect & {
      organization: typeof organizations.$inferSelect
    })[]
  | []
> {
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

async function getUserCustomers({ userId }: { userId: string }): Promise<
  (typeof customers.$inferSelect & {
    invoiceCount: number
    invoiceTotal: number
    invoices: { id: string; amount: number }[]
  })[]
> {
  return await db.query.customers
    .findMany({
      where: eq(customers.userId, userId),
      with: {
        invoices: {
          columns: {
            id: true,
            amount: true
          }
        }
      }
    })
    .then(customers =>
      customers.map(customer => ({
        ...customer,
        invoiceCount: customer.invoices.length,
        invoiceTotal: customer.invoices.reduce(
          (sum: number, invoice: { amount: number }) => sum + invoice.amount,
          0
        ),
        invoices: customer.invoices
      }))
    )
}

async function getUserInvoices({
  userId
}: {
  userId: string
}): Promise<
  (typeof invoices.$inferSelect & { customer: typeof customers.$inferSelect })[]
> {
  return await db.query.invoices.findMany({
    where: eq(invoices.userId, userId),
    with: {
      customer: true
    }
  })
}

async function getOrganizationById({
  organizationId
}: {
  organizationId: string
}): Promise<
  | (typeof organizations.$inferSelect & {
      userOrganizations: { user: typeof users.$inferSelect }[]
    })
  | null
> {
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

async function getOrganizationCustomers({
  organizationId
}: {
  organizationId: string
}): Promise<
  | (typeof customers.$inferSelect & {
      invoiceCount: number
      invoiceTotal: number
      invoices: { id: string; amount: number }[]
    })[]
  | []
> {
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
            amount: true
          }
        }
      }
    })
    .then(customers =>
      customers.map(customer => ({
        ...customer,
        invoiceCount: customer.invoices.length,
        invoiceTotal: customer.invoices.reduce(
          (sum: number, invoice: { amount: number }) => sum + invoice.amount,
          0
        ),
        invoices: customer.invoices
      }))
    )
}

async function getOrganizationInvoices({
  organizationId
}: {
  organizationId: string
}): Promise<
  | (typeof invoices.$inferSelect & {
      customer: typeof customers.$inferSelect
    })[]
  | []
> {
  const user = await verifySession()
  if (!user || !hasPermission(user, 'invoices', 'view')) {
    return []
  }

  const organizationCustomers = await getOrganizationCustomers({
    organizationId
  })
  const customerIds = organizationCustomers.map(customer => customer.id)

  return await db.query.invoices.findMany({
    where: inArray(invoices.customerId, customerIds),
    with: {
      customer: true
    }
  })
}

async function getCustomerById({ customerId }: { customerId: string }): Promise<
  | (typeof customers.$inferSelect & {
      invoices: (typeof invoices.$inferSelect)[]
    })
  | null
> {
  const user = await verifySession()
  if (!user || !hasPermission(user, 'customers', 'view')) {
    return null
  }

  if (!customerId) return null

  const customer = await db.query.customers.findFirst({
    where: eq(customers.id, customerId),
    with: {
      invoices: true
    }
  })

  return customer || null
}

async function getInvoiceById({
  invoiceId
}: {
  invoiceId: string
}): Promise<
  | (typeof invoices.$inferSelect & { customer: typeof customers.$inferSelect })
  | null
> {
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
  // All
  getAllUsers,
  getAllOrganizations,
  getAllCustomers,
  getAllInvoices,
  // User
  getUserOrganizations,
  getUserCustomers,
  getUserInvoices,
  // Organization
  getOrganizationById,
  getOrganizationCustomers,
  getOrganizationInvoices,
  getCustomerById,
  getInvoiceById
}
