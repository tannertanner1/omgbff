import { notFound } from "next/navigation"
import { getOrganizationById } from "@/db/queries"
import { Form, type Field } from "@/components/form"
import { updateAction } from "../../actions"

export default async function Page({
  params,
}: {
  params: Promise<{ organizationId: string }>
}) {
  const { organizationId } = await params
  const organization = await getOrganizationById({ organizationId })

  if (!organization) return notFound()

  const fields: Field[] = [
    {
      name: "id",
      type: "hidden" as const,
      defaultValue: organization.id,
    },
    {
      name: "name",
      label: "Name",
      type: "text" as const,
      required: true,
      defaultValue: organization.name,
    },
  ]

  return (
    <Form
      fields={fields}
      action={updateAction}
      button="Save"
      data={{
        id: organization.id,
        name: organization.name,
      }}
    />
  )
}
