import { notFound, redirect } from "next/navigation"
import {
  getAllCustomers,
  getAllOrganizations,
  getInvoiceById,
} from "@/db/queries"
import { STATUSES } from "@/data/invoice-statuses"
import { hasPermission } from "@/lib/abac"
import { verifySession } from "@/lib/dal"
import { Form, type Field } from "@/components/form"
import { updateAction } from "../../actions"

export default async function Page({
  params,
}: {
  params: Promise<{ invoiceId: string }>
}) {
  const user = await verifySession()
  const { invoiceId } = await params

  if (!hasPermission(user, "invoices", "update")) {
    redirect("/invoices")
  }

  const [invoice, organizations, customers] = await Promise.all([
    getInvoiceById({ invoiceId }),
    getAllOrganizations(),
    getAllCustomers(),
  ])

  if (!invoice) return notFound()

  const fields: Field[] = [
    {
      name: "id",
      type: "hidden",
      defaultValue: invoice.id,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      defaultValue: invoice.description || "",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      options: STATUSES.map((status) => ({
        label: status.charAt(0).toUpperCase() + status.slice(1),
        value: status,
      })),
      defaultValue: invoice.status,
    },
    {
      name: "organizationId",
      label: "Organization",
      type: "select",
      required: true,
      options: organizations.map((org) => ({
        label: org.name,
        value: org.id,
      })),
      defaultValue: invoice.organizationId,
    },
    {
      name: "customerId",
      label: "Customer",
      type: "select",
      required: true,
      options: customers.map((customer) => ({
        label: `${customer.name} <${customer.email}>`,
        value: customer.id,
      })),
      defaultValue: invoice.customerId,
    },
    {
      name: "amount",
      label: "Amount",
      type: "currency",
      required: true,
      defaultValue: invoice.amount.toFixed(2),
    },
  ]

  return <Form fields={fields} action={updateAction} button="Save" />
}
