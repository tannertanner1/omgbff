import { redirect } from "next/navigation"
import { getAllOrganizations } from "@/db/queries"
import { ADDRESS, COUNTRY, PHONE } from "@/data/customer-fields"
import { hasPermission } from "@/lib/abac"
import { verifySession } from "@/lib/dal"
import { Form } from "@/components/form"
import type { Field } from "@/components/form"
import { Empty } from "@/components/form/empty"
import { createAction } from "../actions"

export default async function Page() {
  const user = await verifySession()
  if (!hasPermission(user, "customers", "create")) {
    redirect("/customers")
  }

  const organizations = await getAllOrganizations()
  if (organizations.length === 0) {
    return (
      <Empty name="organization" form="/organizations/new" back="/customers" />
    )
  }

  const fields: Field[] = [
    {
      name: "organizationId",
      label: "Organization",
      type: "select",
      required: true,
      options: organizations.map((org) => ({
        label: org.name,
        value: org.id,
      })),
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
    },
    {
      name: "address",
      label: "Address",
      type: "address",
      required: true,
      defaultValue: [
        {
          label: ADDRESS[0],
          line1: "",
          line2: "",
          city: "",
          region: "",
          postal: "",
          country: COUNTRY[0],
        },
      ],
    },
    {
      name: "phone",
      label: "Phone",
      type: "phone",
      required: true,
      defaultValue: [{ label: PHONE[0], number: "" }],
    },
  ]

  return <Form fields={fields} action={createAction} button="Create" />
}
