"use server"

import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { invoices } from "@/db/schema/invoices"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import type { ActionResponse } from "./types"

const schema = z.object({
  customerId: z.string().min(1, { message: "Customer is required" }),
  amount: z.string().min(1, { message: "Amount is required" }),
  description: z.string().min(1, { message: "Description is required" }),
})

export async function createInvoice(
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
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    description: formData.get("description"),
  })

  if (!validatedData.success) {
    return {
      success: false,
      message: "Please fix the errors in the form",
      errors: validatedData.error.flatten().fieldErrors,
      inputs: {
        customerId: formData.get("customerId") as string,
        amount: formData.get("amount") as string,
        description: formData.get("description") as string,
      },
    }
  }

  try {
    await db.insert(invoices).values({
      customerId: Number.parseInt(validatedData.data.customerId, 10),
      value: Math.floor(Number.parseFloat(validatedData.data.amount) * 100),
      description: validatedData.data.description,
      userId: userId,
      status: "open",
    })

    revalidatePath(`/${userId}/invoices`)
    return { success: true, message: "Invoice created successfully" }
  } catch (error) {
    console.error("Error creating invoice:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
      inputs: validatedData.data,
    }
  }
}

