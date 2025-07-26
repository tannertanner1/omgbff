"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { customers } from "@/db/schema"
import { eq } from "drizzle-orm"
import * as z from "zod"
import { Action, type ActionResponse } from "@/types/forms"
import {
  ADDRESS,
  COUNTRY,
  PHONE,
  PROVINCE,
  STATE,
  PREFECTURE,
} from "@/data/customer-fields"
import { hasPermission, type Customer } from "@/lib/abac"
import { verifySession } from "@/lib/dal"

const addressSchema = z.object({
  label: z.enum(ADDRESS),
  line1: z.string().min(1, "Required"),
  line2: z.string().optional(),
  city: z.string().min(1, "Required"),
  region: z.union([z.enum(STATE), z.enum(PROVINCE), z.enum(PREFECTURE)]),
  postal: z.string().min(1, "Required"),
  country: z.enum(COUNTRY),
})

const phoneSchema = z.object({
  label: z.enum(PHONE),
  number: z.string().min(10, "Invalid"),
})

const schema = z.object({
  organizationId: z.string().min(1, "Required"),
  name: z.string().min(2, "Invalid"),
  email: z.string().email("Required"),
  address: z.array(addressSchema).min(1, "Required"),
  phone: z.array(phoneSchema).min(1, "Required"),
})

const { FormData } = Action(schema)

async function createAction(
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const user = await verifySession()

  if (!hasPermission(user, "customers", "create")) {
    return { success: false, message: "Unauthorized to create" }
  }

  const rawData = {
    organizationId: formData.get("organizationId") as string,
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    address: JSON.parse(formData.get("address") as string),
    phone: JSON.parse(formData.get("phone") as string),
  }

  const validatedData = schema.safeParse(rawData)

  if (!validatedData.success) {
    const errors = validatedData.error.flatten().fieldErrors
    return {
      success: false,
      message: "Please fix the errors in the form",
      errors,
      inputs: rawData,
    }
  }

  try {
    const [customer] = await db
      .insert(customers)
      .values({
        organizationId: validatedData.data.organizationId,
        name: validatedData.data.name,
        email: validatedData.data.email,
        address: validatedData.data.address,
        phone: validatedData.data.phone,
        userId: user.id,
      })
      .returning()

    revalidatePath(`/organizations/${rawData.organizationId}`)

    return {
      success: true,
      message: "Customer created successfully",
      redirect: `/organizations/${rawData.organizationId}`,
    }
  } catch (error) {
    console.error("Error creating customer:", error)
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
  const organizationId = formData.get("organizationId") as string
  const id = formData.get("id") as string
  const returnTo = formData.get("returnTo") as string

  // Create a complete Customer object for permission check with all required properties
  const customerForPermissionCheck: Customer = {
    id,
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    organizationId,
    userId: user.id,
    createdAt: new Date(),
    updatedAt: new Date(),
    // Add the missing properties
    invoiceCount: 0,
    invoiceTotal: 0,
    invoices: [],
    address: JSON.parse(formData.get("address") as string),
    phone: JSON.parse(formData.get("phone") as string),
  }

  if (
    !(await hasPermission(
      user,
      "customers",
      "update",
      customerForPermissionCheck
    ))
  ) {
    return { success: false, message: "Unauthorized to update" }
  }

  const rawData = {
    id,
    organizationId,
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    address: JSON.parse(formData.get("address") as string),
    phone: JSON.parse(formData.get("phone") as string),
  }

  const validatedData = schema.extend({ id: z.string() }).safeParse(rawData)

  if (!validatedData.success) {
    const errors = validatedData.error.flatten().fieldErrors
    return {
      success: false,
      message: "Please fix the errors in the form",
      errors,
      inputs: rawData,
    }
  }

  try {
    await db
      .update(customers)
      .set({
        name: validatedData.data.name,
        email: validatedData.data.email,
        address: validatedData.data.address,
        phone: validatedData.data.phone,
        updatedAt: new Date(),
      })
      .where(eq(customers.id, id))

    // Revalidate both paths to ensure data consistency
    revalidatePath("/customers")
    revalidatePath(`/organizations/${organizationId}/customers`)

    const returnPath =
      (formData.get("returnTo") as string) ||
      `/organizations/${organizationId}/customers`

    return {
      success: true,
      message: "Customer updated successfully",
      redirect: returnPath,
    }
  } catch (error) {
    console.error("Error updating customer:", error)
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
  const organizationId = formData.get("organizationId") as string

  // Create a complete Customer object for permission check with all required properties
  const customerForPermissionCheck: Customer = {
    id,
    organizationId,
    name: "",
    email: "",
    userId: user.id,
    createdAt: new Date(),
    updatedAt: new Date(),
    // Add the missing properties
    invoiceCount: 0,
    invoiceTotal: 0,
    invoices: [],
    address: null,
    phone: null,
  }

  if (
    !(await hasPermission(
      user,
      "customers",
      "delete",
      customerForPermissionCheck
    ))
  ) {
    return { success: false, message: "Unauthorized to delete" }
  }

  try {
    await db.delete(customers).where(eq(customers.id, id))
    revalidatePath(`/organizations/${organizationId}`)
    return {
      success: true,
      message: "Customer deleted successfully",
      redirect: `/organizations/${organizationId}`,
    }
  } catch (error) {
    console.error("Error deleting customer:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}

export { createAction, updateAction, deleteAction }
