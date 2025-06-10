"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { organizations, userOrganizations } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { Action, type ActionResponse } from "@/types/forms"
import { hasPermission } from "@/lib/abac"
import { verifySession } from "@/lib/dal"

const schema = z.object({
  name: z.string().min(1, "Required"),
})

const { FormData } = Action(schema)

async function createAction(
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const user = await verifySession()

  // Check if user has permission to create organization
  if (!hasPermission(user, "organizations", "create")) {
    return {
      success: false,
      message: "Unauthorized to create",
      errors: {},
      inputs: { name: formData.get("name") as string },
    }
  }

  const rawData = { name: formData.get("name") as string }
  const validatedData = schema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      message: "Please fix the errors in the form",
      errors: validatedData.error.flatten().fieldErrors,
      inputs: rawData,
    }
  }

  try {
    // Create organization and link it to the user
    const [organization] = await db
      .insert(organizations)
      .values({ name: validatedData.data.name })
      .returning()

    await db.insert(userOrganizations).values({
      userId: user.id,
      organizationId: organization.id,
      role: "owner", // Set the creator as the owner
    })

    revalidatePath(`/organizations`)
    return {
      success: true,
      message: "Organization created successfully",
      redirect: `/organizations/${organization.id}`,
    }
  } catch (error) {
    console.error("Error creating organization:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
      inputs: rawData,
    }
  }
}

async function updateAction(
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const user = await verifySession()
  const id = formData.get("id") as string

  console.log("Updating organization:", id, "for user:", user.id)

  if (!id) {
    return {
      success: false,
      message: "Organization ID is required",
      errors: {},
    }
  }

  // Check if user is associated with organization
  const userOrganization = await db.query.userOrganizations.findFirst({
    where: and(
      eq(userOrganizations.userId, user.id),
      eq(userOrganizations.organizationId, id)
    ),
  })

  console.log("User organization relationship:", userOrganization)

  if (!userOrganization) {
    return {
      success: false,
      message: "User is not associated with this organization",
      errors: {},
      inputs: { name: formData.get("name") as string },
    }
  }

  // Allow update if user is owner or admin
  if (userOrganization.role !== "owner" && userOrganization.role !== "admin") {
    return {
      success: false,
      message: "Unauthorized to update",
      errors: {},
      inputs: { name: formData.get("name") as string },
    }
  }

  const rawData = { name: formData.get("name") as string }
  const validatedData = schema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      message: "Please fix the errors in the form",
      errors: validatedData.error.flatten().fieldErrors,
      inputs: rawData,
    }
  }

  try {
    await db
      .update(organizations)
      .set({ name: validatedData.data.name, updatedAt: new Date() })
      .where(eq(organizations.id, id))

    revalidatePath("/organizations")
    return {
      success: true,
      message: "Organization updated successfully",
      redirect: "/organizations",
    }
  } catch (error) {
    console.error("Error updating organization:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
      inputs: rawData,
    }
  }
}

async function deleteAction(
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const user = await verifySession()
  const id = formData.get("id") as string

  if (!id) {
    return { success: false, message: "Organization ID is required" }
  }

  // Check if the user has owner or admin role in the organization
  const userOrganization = await db.query.userOrganizations.findFirst({
    where: and(
      eq(userOrganizations.userId, user.id),
      eq(userOrganizations.organizationId, id)
    ),
  })

  if (
    !userOrganization ||
    (userOrganization.role !== "owner" && userOrganization.role !== "admin")
  ) {
    return {
      success: false,
      message: "Unauthorized to delete",
    }
  }

  try {
    await db.delete(organizations).where(eq(organizations.id, id))
    revalidatePath("/organizations")
    return {
      success: true,
      message: "Organization deleted successfully",
      redirect: "/organizations",
    }
  } catch (error) {
    console.error("Error deleting organization:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}

export { createAction, updateAction, deleteAction }
