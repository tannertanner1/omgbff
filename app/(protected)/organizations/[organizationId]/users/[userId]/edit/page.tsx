import { notFound, redirect } from "next/navigation"
import { getUserById } from "@/db/queries"
import { ROLES } from "@/data/system-roles"
import { hasPermission } from "@/lib/abac"
import { verifySession } from "@/lib/dal"
import { Form } from "@/components/form"
import type { Field } from "@/components/form"
import { updateAction } from "../../actions"

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ organizationId: string; userId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const user = await verifySession()
  const { organizationId, userId } = await params
  const resolvedSearchParams = await searchParams
  const returnTo =
    (resolvedSearchParams.returnTo as string) ||
    `/organizations/${organizationId}/users`

  if (!hasPermission(user, "users", "update")) {
    redirect(`/organizations/${organizationId}/users`)
  }

  const userToEdit = await getUserById({ userId })

  if (!userToEdit) {
    return notFound()
  }

  const availableRoles =
    user.role === "owner"
      ? ROLES
      : user.role === "admin"
        ? ["user", "admin"]
        : ["user"]

  // Add this logic after retrieving the user data
  const isSelfEdit = user.id === userId
  const canEditUser =
    user.role === "owner" ||
    (user.role === "admin" && userToEdit.role === "user") ||
    isSelfEdit

  // Then update the fields array to disable name and email fields when appropriate
  const fields: Field[] = [
    {
      name: "organizationId",
      type: "hidden",
      defaultValue: organizationId,
    },
    {
      name: "id",
      type: "hidden",
      defaultValue: userToEdit.id,
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
      required: false,
      defaultValue: userToEdit.name,
      disabled: !canEditUser,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      defaultValue: userToEdit.email,
      disabled: !canEditUser,
    },
    {
      name: "role",
      label: "Role",
      type: "select",
      required: true,
      options: availableRoles.map((role) => ({
        label: role.charAt(0).toUpperCase() + role.slice(1),
        value: role,
      })),
      defaultValue: userToEdit.role,
      disabled:
        user.role === "user" ||
        (user.role === "admin" && userToEdit.role === "owner"),
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
      defaultValue: userToEdit.status,
      disabled: true,
    },
  ]

  return (
    <Form
      fields={fields}
      action={updateAction}
      button="Save"
      data={{ role: userToEdit.role }}
    />
  )
}
