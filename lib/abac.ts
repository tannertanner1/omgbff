import type { Role } from '@/data/system-roles'
import { and, eq } from 'drizzle-orm'
import { db } from '@/db'
import { userOrganizations } from '@/db/schema'
import type { Status } from '@/data/invoice-statuses'

type Organization = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

// User type matching session user object
type User = {
  id: string
  email: string | null
  role: Role
  name: string | null
  emailVerified: Date | null
  image: string | null
  organizationId?: string | null
  createdAt?: Date
  updatedAt?: Date
}

type Customer = {
  id: string
  name: string
  email: string
  organizationId: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

type Invoice = {
  id: string
  customerId: string
  userId: string
  organizationId: string
  value: number
  description: string | null
  status: Status
  createdAt: Date
  updatedAt: Date
}

type PermissionCheck<T> =
  | boolean
  | ((user: User, data?: T) => boolean | Promise<boolean>)

type Permissions = {
  organizations: {
    dataType: Organization
    action: 'view' | 'create' | 'update' | 'delete'
  }
  customers: {
    dataType: Customer
    action: 'view' | 'create' | 'update' | 'delete'
  }
  invoices: {
    dataType: Invoice
    action: 'view' | 'create' | 'update' | 'delete'
  }
}

const PERMISSION_RULES: {
  [Resource in keyof Permissions]: {
    [Action in Permissions[Resource]['action']]: PermissionCheck<
      Permissions[Resource]['dataType']
    >
  }
} = {
  organizations: {
    view: true,
    create: true,
    update: (user, organization) =>
      user.role === 'owner' || user.role === 'admin',
    delete: (user, organization) => user.role === 'owner'
  },
  customers: {
    view: true,
    create: async (user, customer) => {
      if (user.role === 'owner' || user.role === 'admin') return true
      if (!customer?.organizationId) return false

      // Check if user is creator of organization
      const userOrganization = await db.query.userOrganizations.findFirst({
        where: and(
          eq(userOrganizations.userId, user.id),
          eq(userOrganizations.organizationId, customer.organizationId)
        )
      })

      return !!userOrganization
    },
    update: async (user, customer) => {
      if (user.role === 'owner' || user.role === 'admin') return true
      if (!customer?.organizationId) return false

      const userOrganization = await db.query.userOrganizations.findFirst({
        where: and(
          eq(userOrganizations.userId, user.id),
          eq(userOrganizations.organizationId, customer.organizationId)
        )
      })

      return !!userOrganization
    },
    delete: async (user, customer) => {
      if (user.role === 'owner' || user.role === 'admin') return true
      if (!customer?.organizationId) return false

      const userOrganization = await db.query.userOrganizations.findFirst({
        where: and(
          eq(userOrganizations.userId, user.id),
          eq(userOrganizations.organizationId, customer.organizationId)
        )
      })

      return !!userOrganization
    }
  },
  invoices: {
    view: true,
    create: async (user, invoice) => {
      if (user.role === 'owner' || user.role === 'admin') return true
      if (!invoice?.organizationId) return false

      // Check if user is associated with the organization
      const userOrganization = await db.query.userOrganizations.findFirst({
        where: and(
          eq(userOrganizations.userId, user.id),
          eq(userOrganizations.organizationId, invoice.organizationId)
        )
      })

      return !!userOrganization
    },
    update: async (user, invoice) => {
      if (user.role === 'owner' || user.role === 'admin') return true
      if (!invoice?.organizationId) return false

      const userOrganization = await db.query.userOrganizations.findFirst({
        where: and(
          eq(userOrganizations.userId, user.id),
          eq(userOrganizations.organizationId, invoice.organizationId)
        )
      })

      // Users with 'user' role can update invoices but not change the status
      return !!userOrganization
    },
    delete: async (user, invoice) => {
      if (user.role === 'owner' || user.role === 'admin') return true
      return false // Users with 'user' role cannot delete invoices
    }
  }
}

async function hasPermission<Resource extends keyof Permissions>(
  user: User,
  resource: Resource,
  action: Permissions[Resource]['action'],
  data?: Permissions[Resource]['dataType']
): Promise<boolean> {
  const permissionCheck = PERMISSION_RULES[resource][action]
  return typeof permissionCheck === 'boolean'
    ? permissionCheck
    : await permissionCheck(user, data)
}

export { hasPermission, type User }

/**
 * @see https://github.com/WebDevSimplified/permission-system/blob/main/auth-abac.ts
 * @see https://youtu.be/5GG-VUvruzE?si=SzQTMPIyGfbsAB94
 */

/**

// USAGE
const user: User = { id: '1', role: 'owner' }
const organization: Organization = {
  id: 'o1',
  name: 'Team',
  userId: 'u1'
}
const customer: Customer = {
  id: 'c1',
  name: 'Bob',
  email: 'bob@example.com',
  organizationId: 'o1'
}
const invoice: Invoice = {
  id: 'i1',
  customerId: 'c1',
  amount: 100,
  organizationId: 'o1'
}

// Can create an organization
console.log(
  hasPermission(user, 'organizations', 'create', organization, organization)
)

// Can view the customer
console.log(hasPermission(user, 'customers', 'view', customer, organization))

// Can update the invoice
console.log(hasPermission(user, 'invoices', 'update', invoice, organization))

// A member trying to create a customer
const memberUser: User = { id: '2', role: 'member' }
console.log(
  hasPermission(memberUser, 'customers', 'create', customer, organization)
)

*/
