"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { invoices } from "@/db/schema"
import { eq } from "drizzle-orm"
import * as z from "zod"
import { Action, type ActionResponse } from "@/types/forms"
import { STATUSES, type Status } from "@/data/invoice-statuses"
import type { User } from "@/lib/abac"
import { verifySession } from "@/lib/dal"

const schema = z.object({
  organizationId: z.string().min(1, "Required"),
  customerId: z.string().min(1, "Required"),
  description: z
    .string()
    .max(32, { message: "Must be at most 32 characters" })
    .optional(),
  status: z.enum(STATUSES).optional(),
  amount: z.number().min(1, "Must be at least 1 dollar"),
})

const { FormData } = Action(schema)

async function createAction(
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const user: User = await verifySession()
  const organizationId = formData.get("organizationId") as string

  const hasAccess = user.role === "admin" || user.role === "owner"

  const rawData = {
    organizationId: formData.get("organizationId") as string,
    customerId: formData.get("customerId") as string,
    description: formData.get("description") as string,
    status: hasAccess ? (formData.get("status") as Status) : "open",
    amount: Number(formData.get("amount")),
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

    revalidatePath(`/organizations/${rawData.organizationId}`)
    revalidatePath("/invoices")

    return {
      success: true,
      message: "Invoice created successfully",
      redirect: `/organizations/${rawData.organizationId}`,
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
  const user: User = await verifySession()
  const organizationId = formData.get("organizationId") as string

  const hasAccess = user.role === "admin" || user.role === "owner"

  const rawData = {
    organizationId: formData.get("organizationId") as string,
    customerId: formData.get("customerId") as string,
    id: formData.get("id") as string,
    description: formData.get("description") as string,
    status: hasAccess ? (formData.get("status") as Status) : undefined,
    amount: Number(formData.get("amount")),
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
    const currentInvoice = await db.query.invoices.findFirst({
      where: eq(invoices.id, validatedData.data.id),
    })

    if (!currentInvoice) {
      return {
        success: false,
        message: "Invoice not found",
        inputs: rawData,
      }
    }

    const updateData: Partial<typeof validatedData.data> = {
      customerId: validatedData.data.customerId,
      description: validatedData.data.description,
      amount: validatedData.data.amount,
    }

    if (hasAccess && validatedData.data.status) {
      updateData.status = validatedData.data.status
    }

    await db
      .update(invoices)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(invoices.id, validatedData.data.id))

    revalidatePath(`/organizations/${rawData.organizationId}`)
    revalidatePath("/invoices")

    return {
      success: true,
      message: "Invoice updated successfully",
      redirect: `/organizations/${rawData.organizationId}`,
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
  const user: User = await verifySession()
  const organizationId = formData.get("organizationId") as string
  const id = formData.get("id") as string

  const hasAccess = user.role === "admin" || user.role === "owner"

  if (!hasAccess) {
    return {
      success: false,
      message: "Unauthorized to delete invoices",
    }
  }

  try {
    await db.delete(invoices).where(eq(invoices.id, id))

    revalidatePath(`/organizations/${organizationId}`)
    revalidatePath("/invoices")

    return {
      success: true,
      message: "Invoice deleted successfully",
      redirect: `/organizations/${organizationId}`,
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
