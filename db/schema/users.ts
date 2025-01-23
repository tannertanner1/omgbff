import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  uniqueIndex
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import type { AdapterAccountType } from 'next-auth/adapters'
import { InferInsertModel } from 'drizzle-orm'

const organizations = pgTable('organization', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

const users = pgTable(
  'user',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    email: text('email').unique(),
    organizationId: text('organizationId').references(() => organizations.id, {
      onDelete: 'set null'
    }),

    role: text('role', { enum: ['owner', 'admin', 'user'] })
      .notNull()
      .default('user'),
    name: text('name'),
    emailVerified: timestamp('emailVerified', { mode: 'date' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    image: text('image')
  },
  user => [uniqueIndex('unique_idx').on(user.email)]
)

const userOrganizations = pgTable(
  'user_organization',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    organizationId: text('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    role: text('role', { enum: ['owner', 'admin', 'user'] })
      .notNull()
      .default('user'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow()
  },
  userOrganization => [
    primaryKey({
      columns: [userOrganization.userId, userOrganization.organizationId]
    })
  ]
)

const accounts = pgTable(
  'account',
  {
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    type: text('type').$type<AdapterAccountType>().notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state')
  },
  account => [
    primaryKey({
      columns: [account.provider, account.providerAccountId]
    })
  ]
)

const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  expires: timestamp('expires', { mode: 'date' }).notNull()
})

const verificationTokens = pgTable(
  'verificationToken',
  {
    token: text('token').notNull(),
    identifier: text('identifier').notNull(),

    expires: timestamp('expires', { mode: 'date' }).notNull()
  },
  verificationToken => [
    primaryKey({
      columns: [verificationToken.identifier, verificationToken.token]
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

/** @see https://authjs.dev/getting-started/adapters/drizzle#schemas */
