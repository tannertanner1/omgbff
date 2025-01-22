import { pgEnum } from 'drizzle-orm/pg-core'

export const ROLES = [
  { id: 'owner' as const, label: 'Owner' },
  { id: 'admin' as const, label: 'Admin' },
  { id: 'user' as const, label: 'User' }
] as const

export type Role = (typeof ROLES)[number]['id']

export const roles = pgEnum(
  'role',
  ROLES.map(({ id }) => id) as [Role, ...Array<Role>]
)

export const role: Record<Role, string> = ROLES.reduce(
  (acc, role) => {
    acc[role.id] = role.label
    return acc
  },
  {} as Record<Role, string>
)
