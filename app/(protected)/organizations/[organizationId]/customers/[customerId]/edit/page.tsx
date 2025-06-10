import { notFound, redirect } from "next/navigation"
import { getCustomerById } from "@/db/queries"
import { ADDRESS, PHONE } from "@/data/customer-fields"
import { hasPermission } from "@/lib/abac"
import { verifySession } from "@/lib/dal"
import { Form } from "@/components/form"
import type { Field } from "@/components/form"
import { updateAction } from "../../actions"

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ organizationId: string; customerId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const user = await verifySession()
  const { organizationId, customerId } = await params
  const resolvedSearchParams = await searchParams
  const returnTo =
    (resolvedSearchParams.returnTo as string) ||
    `/organizations/${organizationId}/customers`

  if (!hasPermission(user, "customers", "update")) {
    redirect(`/organizations/${organizationId}/customers`)
  }

  const customer = await getCustomerById({ customerId })

  if (!customer) {
    return notFound()
  }

  const fields: Field[] = [
    {
      name: "organizationId",
      type: "hidden",
      defaultValue: organizationId,
    },
    {
      name: "id",
      type: "hidden",
      defaultValue: customer.id,
    },
    {
      name: "returnTo",
      type: "hidden",
      defaultValue: returnTo,
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
      defaultValue: customer.name,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      defaultValue: customer.email,
    },
    {
      name: "address",
      type: "address",
      required: true,
      defaultValue: customer.address || [
        {
          label: ADDRESS[0],
          line1: "",
          line2: "",
          city: "",
          region: "British Columbia",
          postal: "",
          country: "Canada",
        },
      ],
    },
    {
      name: "phone",
      type: "phone",
      required: true,
      defaultValue: customer.phone || [
        {
          label: PHONE[0],
          number: "",
        },
      ],
    },
  ]

  return <Form fields={fields} action={updateAction} button="Save" />
}
