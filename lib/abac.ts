import type { Role } from '@/data/system-roles'
import { and, eq } from 'drizzle-orm'
import { db } from '@/db'
import { userOrganizations } from '@/db/schema'
import type { Status } from '@/data/invoice-statuses'
import type { ADDRESS, PHONE, Country, Region } from '@/data/customer-fields'

export type Organization = {
  userId: string
  id: string
  organizationId?: string
  name: string
  createdAt: Date | string
  updatedAt: Date | string
}

// User type matching session user object
export type User = {
  id: string
  email: string | null
  role: Role
  name: string | null
  emailVerified: Date | null
  image: string | null
  organizationId?: string | null
  createdAt?: Date
  updatedAt?: Date
  invitedBy?: string | null
}

export type Invitation = {
  id: string
  email: string
  role: Role
  organizationId: string
  createdAt: Date
  updatedAt: Date
}

export type Customer = {
  id: string
  organizationId: string
  userId: string
  email: string
  name: string
  invoiceCount: number
  invoiceTotal: number
  invoices: Array<{ id: string; amount: number }>
  address: Array<{
    label: (typeof ADDRESS)[number]
    line1: string
    line2?: string
    city: string
    region: Region
    postal: string
    country: Country
  }> | null
  phone: Array<{
    label: (typeof PHONE)[number]
    number: string
  }> | null
  createdAt: string | Date
  updatedAt: string | Date
}

export type Invoice = {
  id: string
  customerId: string
  userId: string
  organizationId: string
  amount: number
  description: string | null
  status: Status
  createdAt: string | Date
  updatedAt: string | Date
  customer: {
    name: string
    email: string
  }
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
  users: {
    dataType: User
    action: 'view' | 'create' | 'update' | 'delete'
  }
  invitations: {
    dataType: Invitation
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
  },
  users: {
    view: user => user.role === 'owner' || user.role === 'admin',
    create: user => user.role === 'owner',
    update: user => user.role === 'owner',
    delete: user => user.role === 'owner'
  },
  invitations: {
    view: user => user.role === 'owner' || user.role === 'admin',
    create: user => user.role === 'owner' || user.role === 'admin',
    update: user => user.role === 'owner' || user.role === 'admin',
    delete: user => user.role === 'owner' || user.role === 'admin'
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

export { hasPermission }

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
