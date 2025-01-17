import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { organizations, users } from './users'
import { InferInsertModel } from 'drizzle-orm'
import { STATUS } from '@/data/invoice-statuses'

const customers = pgTable('customer', {
  id: serial('id').primaryKey().notNull(),
  organizationId: text('organizationId')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  userId: text('userId')
    .notNull()
    .references(() => users.id),
  email: text('email').notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
})

const invoices = pgTable('invoice', {
  id: serial('id').primaryKey().notNull(),
  customerId: integer('customerId')
    .notNull()
    .references(() => customers.id, { onDelete: 'cascade' }),
  userId: text('userId')
    .notNull()
    .references(() => users.id),
  value: integer('value').notNull(),
  description: text('description').notNull(),
  status: STATUS('status').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
})

export { customers, invoices }

export type NewCustomer = InferInsertModel<typeof customers>
export type NewInvoice = InferInsertModel<typeof invoices>

/**
 * @see https://youtu.be/Mcw8Mp8PYUE?si=vuf6VVt5Jv-AXct3
 * @see https://github.com/colbyfayock/my-invoicing-app
 */

// import {
//   integer,
//   pgEnum,
//   pgTable,
//   serial,
//   text,
//   timestamp
// } from 'drizzle-orm/pg-core'
// import { organizations, users } from './users'
// import { InferInsertModel } from 'drizzle-orm'
// import { STATUS } from '@/data/invoice-status'

// // const STATUSES = [
// //   { id: 'open', label: 'Open' },
// //   { id: 'paid', label: 'Paid' },
// //   { id: 'void', label: 'Void' },
// //   { id: 'uncollectible', label: 'Uncollectible' }
// // ]

// // export type Status = (typeof STATUSES)[number]['id']

// // const statuses = STATUSES.map(({ id }) => id) as Array<Status>

// // export const statusEnum = pgEnum(
// //   'status',
// //   statuses as [Status, ...Array<Status>]
// // )

// const customers = pgTable('customer', {
//   id: serial('id').primaryKey().notNull(),
//   organizationId: text('organizationId')
//     .notNull()
//     .references(() => organizations.id, { onDelete: 'cascade' }),
//   userId: text('userId')
//     .notNull()
//     .references(() => users.id),
//   email: text('email').notNull(),
//   name: text('name').notNull(),
//   createdAt: timestamp('createdAt').defaultNow().notNull(),
//   updatedAt: timestamp('updatedAt').defaultNow().notNull()
// })

// const invoices = pgTable('invoice', {
//   id: serial('id').primaryKey().notNull(),
//   customerId: integer('customerId')
//     .notNull()
//     .references(() => customers.id, { onDelete: 'cascade' }),
//   userId: text('userId')
//     .notNull()
//     .references(() => users.id),
//   value: integer('value').notNull(),
//   description: text('description').notNull(),
//   // status: statusEnum('status').notNull(),
//   status: STATUS('status').notNull(),
//   createdAt: timestamp('createdAt').defaultNow().notNull(),
//   updatedAt: timestamp('updatedAt').defaultNow().notNull()
// })

// export { customers, invoices }

// export type NewCustomer = InferInsertModel<typeof customers>
// export type NewInvoice = InferInsertModel<typeof invoices>

// /**
//  * @see https://youtu.be/Mcw8Mp8PYUE?si=vuf6VVt5Jv-AXct3
//  * @see https://github.com/colbyfayock/my-invoicing-app
//  */
