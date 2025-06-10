"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { invoices } from "@/db/schema"
import { eq } from "drizzle-orm"
import * as z from "zod"
import { Action, type ActionResponse } from "@/types/forms"
import { STATUSES, type Status } from "@/data/invoice-statuses"
import { hasPermission } from "@/lib/abac"
import { verifySession } from "@/lib/dal"

const schema = z.object({
  description: z.string().optional(),
  status: z.enum(STATUSES),
  organizationId: z.string().min(1, "Required"),
  customerId: z.string().min(1, "Required"),
  amount: z.number().min(0.01, "Must be greater than 1"),
})

const { FormData } = Action(schema)

async function createAction(
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const user = await verifySession()

  if (!hasPermission(user, "invoices", "create")) {
    return {
      success: false,
      message: "Unauthorized to create invoices",
    }
  }

  const rawData = {
    description: formData.get("description") as string,
    status: formData.get("status") as Status,
    organizationId: formData.get("organizationId") as string,
    customerId: formData.get("customerId") as string,
    amount: Number.parseFloat(formData.get("amount") as string),
  }

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
    const [invoice] = await db
      .insert(invoices)
      .values({
        ...validatedData.data,
        userId: user.id,
      })
      .returning()

    revalidatePath("/invoices")
    return {
      success: true,
      message: "Invoice created successfully",
      redirect: "/invoices",
    }
  } catch (error) {
    console.error("Error creating invoice:", error)
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

  if (!hasPermission(user, "invoices", "update")) {
    return {
      success: false,
      message: "Unauthorized to update invoices",
    }
  }

  const rawData = {
    id,
    customerId: formData.get("customerId") as string,
    organizationId: formData.get("organizationId") as string,
    amount: Number.parseFloat(formData.get("amount") as string),
    status: formData.get("status") as Status,
    description: formData.get("description") as string,
  }

  const validatedData = schema.extend({ id: z.string() }).safeParse(rawData)

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
      .update(invoices)
      .set({
        customerId: validatedData.data.customerId,
        organizationId: validatedData.data.organizationId,
        amount: validatedData.data.amount,
        status: validatedData.data.status,
        description: validatedData.data.description,
        updatedAt: new Date(),
      })
      .where(eq(invoices.id, id))

    revalidatePath("/invoices")
    return {
      success: true,
      message: "Invoice updated successfully",
      redirect: "/invoices",
    }
  } catch (error) {
    console.error("Error updating invoice:", error)
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

  if (!hasPermission(user, "invoices", "delete")) {
    return {
      success: false,
      message: "Unauthorized to delete invoices",
    }
  }

  try {
    await db.delete(invoices).where(eq(invoices.id, id))

    revalidatePath("/invoices")
    return {
      success: true,
      message: "Invoice deleted successfully",
      redirect: "/invoices",
    }
  } catch (error) {
    console.error("Error deleting invoice:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}

export { createAction, updateAction, deleteAction }
