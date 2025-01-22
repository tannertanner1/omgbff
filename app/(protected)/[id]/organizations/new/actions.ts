"use server"

import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { organizations, userOrganizations } from "@/db/schema/users"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import type { Role } from "@/data/system-roles"
import type { ActionResponse } from "./types"

const schema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
})

export async function createOrganization(
  userId: string,
  _: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const session = await auth()
  if (!session) {
    redirect("/login")
  }

  // Verify the user is performing action for their own account
  if (session.user.id !== userId) {
    throw new Error("Unauthorized")
  }

  const validatedData = schema.safeParse({
    name: formData.get("name"),
  })

  if (!validatedData.success) {
    return {
      success: false,
      message: "Please fix the errors in the form",
      errors: validatedData.error.flatten().fieldErrors,
      inputs: { name: formData.get("name") as string },
    }
  }

  try {
    const [org] = await db
      .insert(organizations)
      .values({
        name: validatedData.data.name,
      })
      .returning()

    await db.insert(userOrganizations).values({
      userId: userId,
      organizationId: org.id,
      role: "owner" as Role,
    })

    revalidatePath(`/${userId}/organizations`)
    return { success: true, message: "Organization created successfully" }
  } catch (error) {
    console.error("Error creating organization:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
      inputs: { name: validatedData.data.name },
    }
  }
}

