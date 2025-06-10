import { redirect } from "next/navigation"
import { getAllOrganizations } from "@/db/queries"
import { hasPermission, type Organization } from "@/lib/abac"
import { verifySession } from "@/lib/dal"
import { Component } from "./component"

export default async function Page() {
  const user = await verifySession()

  if (!hasPermission(user, "organizations", "view")) {
    redirect("/")
  }

  const data = await getAllOrganizations()

  const organizations: Organization[] = data.map((organization) => ({
    ...organization,
    userId: user.id,
    organizationId: organization.id,
    createdAt:
      organization.createdAt instanceof Date
        ? organization.createdAt.toISOString()
        : organization.createdAt,
    updatedAt:
      organization.updatedAt instanceof Date
        ? organization.updatedAt.toISOString()
        : organization.updatedAt,
  }))

  return <Component organizations={organizations} userId={user.id} />
}
