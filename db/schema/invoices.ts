import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  primaryKey
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { organizations, users } from './users'
import { InferInsertModel } from 'drizzle-orm'
import { STATUS } from '@/data/invoice-statuses'

const customers = pgTable('customer', {
  id: serial('id').primaryKey().notNull(),
  // Optionally remove `organizationId`
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

// const organizationCustomers = pgTable(
//   'organization_customer',
//   {
//     organizationId: text('organization_id')
//       .notNull()
//       .references(() => organizations.id, { onDelete: 'cascade' }),
//     customerId: integer('customer_id')
//       .notNull()
//       .references(() => customers.id, { onDelete: 'cascade' }),
//     createdAt: timestamp('created_at').notNull().defaultNow(),
//     updatedAt: timestamp('updated_at').notNull().defaultNow()
//   },
//   organizationCustomer => [
//     primaryKey({
//       columns: [
//         organizationCustomer.organizationId,
//         organizationCustomer.customerId
//       ]
//     })
//   ]
// )

const invoices = pgTable('invoice', {
  id: serial('id').primaryKey().notNull(),
  // Optionally remove `customerId`
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

// const customerInvoices = pgTable('customer_invoice', {
//   customerId: integer('customer_id')
//     .notNull()
//     .references(() => customers.id, { onDelete: 'cascade' }),
//   invoiceId: integer('invoice_id')
//     .notNull()
//     .references(() => invoices.id, { onDelete: 'cascade' }),
//   amount: integer('amount').notNull(),
//   createdAt: timestamp('created_at').notNull().defaultNow(),
//   updatedAt: timestamp('updated_at').notNull().defaultNow()
//   }, customerInvoice => [
//     primaryKey({
//       columns: [customerInvoice.customerId, customerInvoice.invoiceId]
//     })
//   ]
// )

// const organizationsRelations = relations(organizations, ({ many }) => ({
//   customers: many(organizationCustomers),
// }));

const customersRelations = relations(customers, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [customers.organizationId],
    references: [organizations.id]
  }),
  user: one(users, {
    fields: [customers.userId],
    references: [users.id]
  }),
  invoices: many(invoices)
}))
// const customersRelations = relations(customers, ({ many }) => ({
//   invoices: many(customerInvoices),
// }));

const invoicesRelations = relations(invoices, ({ one }) => ({
  customer: one(customers, {
    fields: [invoices.customerId],
    references: [customers.id]
  }),
  // customers: many(customerInvoices),
  user: one(users, {
    fields: [invoices.userId],
    references: [users.id]
  })
}))

export { customers, invoices, customersRelations, invoicesRelations }

export type NewCustomer = InferInsertModel<typeof customers>
export type NewInvoice = InferInsertModel<typeof invoices>

/**
 * @see https://youtu.be/Mcw8Mp8PYUE?si=vuf6VVt5Jv-AXct3
 * @see https://github.com/colbyfayock/my-invoicing-app
 */
