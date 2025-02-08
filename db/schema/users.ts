import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  uniqueIndex
} from 'drizzle-orm/pg-core'
import { id, createdAt, updatedAt } from '@/db/helpers'
import { ROLES } from '@/data/system-roles'
import { relations } from 'drizzle-orm'
import type { AdapterAccountType } from 'next-auth/adapters'
import { InferInsertModel } from 'drizzle-orm'

const organizations = pgTable('organizations', {
  id,
  createdAt,
  updatedAt,
  /** name */
  name: text().notNull()
})

const users = pgTable(
  'users',
  {
    id,
    organizationId: text().references(() => organizations.id, {
      onDelete: 'set null'
    }),
    role: text('role', { enum: ROLES }).notNull().default('user'),
    emailVerified: timestamp({ mode: 'date' }),
    createdAt,
    updatedAt,
    image: text(),
    /** email, name */
    email: text().unique(),
    name: text()
  },
  users => [uniqueIndex().on(users.email)]
)

const userOrganizations = pgTable(
  'userOrganizations',
  {
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    organizationId: text()
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    role: text('role', { enum: ROLES }).notNull().default('user'),
    createdAt,
    updatedAt
  },
  userOrganizations => [
    primaryKey({
      columns: [userOrganizations.userId, userOrganizations.organizationId]
    })
  ]
)

const accounts = pgTable(
  'accounts',
  {
    provider: text().notNull(),
    providerAccountId: text().notNull(),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text().$type<AdapterAccountType>().notNull(),
    refresh_token: text(),
    access_token: text(),
    expires_at: integer(),
    token_type: text(),
    scope: text(),
    id_token: text(),
    session_state: text()
  },
  accounts => [
    primaryKey({
      columns: [accounts.provider, accounts.providerAccountId]
    })
  ]
)

const sessions = pgTable('sessions', {
  sessionToken: text().primaryKey(),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp({ mode: 'date' }).notNull()
})

const verificationTokens = pgTable(
  'verificationTokens',
  {
    token: text().notNull(),
    identifier: text().notNull(),
    expires: timestamp({ mode: 'date' }).notNull()
  },
  verificationTokens => [
    primaryKey({
      columns: [verificationTokens.identifier, verificationTokens.token]
    })
  ]
)

const usersRelations = relations(users, ({ many }) => ({
  userOrganizations: many(userOrganizations)
}))

const organizationsRelations = relations(organizations, ({ many }) => ({
  userOrganizations: many(userOrganizations)
}))

const userOrganizationsRelations = relations(userOrganizations, ({ one }) => ({
  user: one(users, {
    fields: [userOrganizations.userId],
    references: [users.id]
  }),
  organization: one(organizations, {
    fields: [userOrganizations.organizationId],
    references: [organizations.id]
  })
}))

export {
  organizations,
  users,
  userOrganizations,
  accounts,
  sessions,
  verificationTokens,
  usersRelations,
  organizationsRelations,
  userOrganizationsRelations
}

export type NewOrganization = InferInsertModel<typeof organizations>
export type NewUser = InferInsertModel<typeof users>
export type NewSession = InferInsertModel<typeof sessions>

/**
 * @see https://authjs.dev/getting-started/adapters/drizzle#schemas
 * @see https://github.com/WebDevSimplified/course-platform/blob/082e1fce0c80dd14a0bdda44ef51b76b9a3b749e/src/drizzle/schema/user.ts
 */
