import { createdAt, customerId, invoiceId, updatedAt } from "@/db/helpers"
import { InferInsertModel, relations } from "drizzle-orm"
import { integer, jsonb, pgTable, text } from "drizzle-orm/pg-core"
import { ADDRESS, PHONE } from "@/data/customer-fields"
import type { Country, Region } from "@/data/customer-fields"
import { STATUSES } from "@/data/invoice-statuses"
import { organizations, users } from "./users"

const customers = pgTable("customers", {
  id: customerId,
  // Optionally remove organizationId
  organizationId: text()
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  userId: text()
    .notNull()
    .references(() => users.id),
  createdAt,
  updatedAt,
  /** @note email, name, streetAddress, phoneNumber */
  email: text().notNull(),
  name: text().notNull(),
  address: jsonb()
    .$type<
      Array<{
        label: (typeof ADDRESS)[number]
        line1: string
        line2?: string
        city: string
        region: Region
        postal: string
        country: Country
      }>
    >()
    .default([]),
  phone: jsonb()
    .$type<
      Array<{
        label: (typeof PHONE)[number]
        number: string
      }>
    >()
    .default([]),
})

// const organizationCustomers = pgTable(
//   'organizationCustomers',
//   {
//     organizationId: text()
//       .notNull()
//       .references(() => organizations.id, { onDelete: 'cascade' }),
//     customerId: integer()
//       .notNull()
//       .references(() => customers.id, { onDelete: 'cascade' }),
//     createdAt,
//     updatedAt
//   },
//   organizationCustomers => [
//     primaryKey({
//       columns: [
//         organizationCustomers.organizationId,
//         organizationCustomers.customerId
//       ]
//     })
//   ]
// )

const invoices = pgTable("invoices", {
  id: invoiceId,
  // Optionally remove customerId
  customerId: text()
    .notNull()
    .references(() => customers.id, { onDelete: "cascade" }),
  organizationId: text()
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  userId: text()
    .notNull()
    .references(() => users.id),
  createdAt,
  updatedAt,
  /** @note description, status, amount */
  description: text(),
  status: text("status", { enum: STATUSES }).notNull().default("open"),
  amount: integer().notNull(),
})

// const customerInvoices = pgTable('customerInvoices', {
//   customerId: text()
//     .notNull()
//     .references(() => customers.id, { onDelete: 'cascade' }),
//   invoiceId: text()
//     .notNull()
//     .references(() => invoices.id, { onDelete: 'cascade' }),
//   amount: integer().notNull(),
//   createdAt,
//   updatedAt
//   }, customerInvoices => [
//     primaryKey({
//       columns: [customerInvoices.customerId, customerInvoices.invoiceId]
//     })
//   ]
// )

// const organizationsRelations = relations(organizations, ({ many }) => ({
//   customers: many(organizationCustomers),
// }));

const customersRelations = relations(customers, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [customers.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [customers.userId],
    references: [users.id],
  }),
  invoices: many(invoices),
}))
// const customersRelations = relations(customers, ({ many }) => ({
//   invoices: many(customerInvoices),
// }));

const invoicesRelations = relations(invoices, ({ one }) => ({
  customer: one(customers, {
    fields: [invoices.customerId],
    references: [customers.id],
  }),
  // customers: many(customerInvoices),
  user: one(users, {
    fields: [invoices.userId],
    references: [users.id],
  }),
}))

export { customers, invoices, customersRelations, invoicesRelations }

export type NewCustomer = InferInsertModel<typeof customers>
export type NewInvoice = InferInsertModel<typeof invoices>
