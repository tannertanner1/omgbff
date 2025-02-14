import { pgEnum } from 'drizzle-orm/pg-core'

const ROLES = ['owner', 'admin', 'user'] as const

type Role = (typeof ROLES)[number]

const roles = pgEnum('role', ROLES)

const role: Record<Role, { label: string; color: string }> = {
  owner: {
    label: 'Owner',
    color: '#9AA0A6' // grey
  },
  admin: {
    label: 'Admin',
    color: '#FBBC04' // yellow
  },
  user: {
    label: 'User',
    color: '#4285F4' // blue
  }
}

export { ROLES, type Role, roles, role }
