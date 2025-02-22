import { notFound } from 'next/navigation'
import { eq, inArray } from 'drizzle-orm'
import { db } from '@/db'
import {
  organizations,
  userOrganizations,
  customers,
  invoices,
  type users
} from '@/db/schema'
import { verifySession } from '@/lib/dal'
import { hasPermission } from '@/lib/abac'

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
  if (user.role === 'admin' || user.role === 'owner') {
    return await db.query.organizations.findMany({
      orderBy: (organizations, { desc }) => [desc(organizations.createdAt)]
    })
  } else {
    return await db.query.userOrganizations
      .findMany({
        where: eq(userOrganizations.userId, user.id),
        with: {
          organization: true
        },
        orderBy: (userOrganizations, { desc }) => [
          desc(userOrganizations.createdAt)
        ]
      })
      .then(results => results.map(result => result.organization))
  }
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
  let customersQuery

  if (user.role === 'admin' || user.role === 'owner') {
    customersQuery = db.query.customers.findMany({
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
  } else {
    customersQuery = db.query.customers.findMany({
      where: eq(customers.userId, user.id),
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
  }

  return customersQuery.then(customers =>
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
  if (user.role === 'admin' || user.role === 'owner') {
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
  } else {
    return await db.query.invoices.findMany({
      where: eq(invoices.userId, user.id),
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
  getAllUsers,
  getAllOrganizations,
  getAllCustomers,
  getAllInvoices,
  getOrganizationById,
  getOrganizationCustomers,
  getOrganizationInvoices,
  getCustomerById,
  getInvoiceById
}
