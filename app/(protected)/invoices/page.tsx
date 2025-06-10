import { redirect } from "next/navigation"
import { getAllInvoices } from "@/db/queries"
import { hasPermission, type Invoice } from "@/lib/abac"
import { verifySession } from "@/lib/dal"
import { Component } from "./component"

export default async function Page() {
  const user = await verifySession()

  if (!hasPermission(user, "invoices", "view")) {
    redirect("/")
  }

  const data = await getAllInvoices()

  const invoices: Invoice[] = data.map((invoice) => ({
    ...invoice,
    createdAt:
      invoice.createdAt instanceof Date
        ? invoice.createdAt.toISOString()
        : invoice.createdAt,
    updatedAt:
      invoice.updatedAt instanceof Date
        ? invoice.updatedAt.toISOString()
        : invoice.updatedAt,
    customer: {
      email: invoice.customer.email,
      name: invoice.customer.name,
    },
  }))

  return <Component invoices={invoices} userId={user.id} />
}
