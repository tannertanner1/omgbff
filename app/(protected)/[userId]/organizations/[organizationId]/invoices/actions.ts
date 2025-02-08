'use server'

import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { invoices } from '@/db/schema'
import * as z from 'zod'
import { STATUSES } from '@/data/invoice-statuses'
import { Action, type ActionResponse } from '@/types/forms'
import { verifySession } from '@/lib/dal'
import { hasPermission } from '@/lib/abac'

const schema = z.object({
  organizationId: z.string().min(1, 'Organization required'),
  customerId: z.string().min(1, 'Customer required'),
  value: z.number().min(0, 'Value must be positive'),
  status: z.enum(STATUSES),
  description: z
    .string()
    .max(32, { message: 'Name must be at most 32 characters' })
    .optional()
})

const { FormData } = Action(schema)

async function createAction(
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const user = await verifySession()

  if (!hasPermission(user, 'invoices', 'create')) {
    return {
      success: false,
      message: 'Unauthorized to create invoices'
    }
  }

  const rawData = {
    description: formData.get('description') as string,
    value: Number(formData.get('value')),
    status: formData.get('status') as string,
    organizationId: formData.get('organizationId') as string,
    customerId: formData.get('customerId') as string
  }

  const validatedData = schema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      message: 'Please fix the errors in the form',
      errors: validatedData.error.flatten().fieldErrors,
      inputs: rawData
    }
  }

  try {
    const [invoice] = await db
      .insert(invoices)
      .values({
        ...validatedData.data,
        userId: user.id
      })
      .returning()

    revalidatePath(`/${user.id}/organizations/${rawData.organizationId}`)

    return {
      success: true,
      message: 'Invoice created successfully',
      redirect: `/${user.id}/organizations/${rawData.organizationId}`
    }
  } catch (error) {
    console.error('Error creating invoice:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      inputs: rawData
    }
  }
}

async function updateAction(
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const user = await verifySession()

  if (!hasPermission(user, 'invoices', 'update')) {
    return {
      success: false,
      message: 'Unauthorized to update invoices'
    }
  }

  const rawData = {
    id: formData.get('id') as string,
    description: formData.get('description') as string,
    value: Number(formData.get('value')),
    status: formData.get('status') as string,
    customerId: formData.get('customerId') as string,
    organizationId: formData.get('organizationId') as string
  }

  const validatedData = schema.extend({ id: z.string() }).safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      message: 'Please fix the errors in the form',
      errors: validatedData.error.flatten().fieldErrors,
      inputs: rawData
    }
  }

  try {
    await db
      .update(invoices)
      .set({
        description: validatedData.data.description,
        value: validatedData.data.value,
        status: validatedData.data.status,
        customerId: validatedData.data.customerId,
        updatedAt: new Date()
      })
      .where(eq(invoices.id, validatedData.data.id))

    revalidatePath(`/${user.id}/organizations/${rawData.organizationId}`)

    return {
      success: true,
      message: 'Invoice updated successfully',
      redirect: `/${user.id}/organizations/${rawData.organizationId}`
    }
  } catch (error) {
    console.error('Error updating invoice:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      inputs: rawData
    }
  }
}

async function deleteAction(
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const user = await verifySession()
  const id = formData.get('id') as string
  const organizationId = formData.get('organizationId') as string

  if (!hasPermission(user, 'invoices', 'delete')) {
    return {
      success: false,
      message: 'Unauthorized to delete invoices'
    }
  }

  try {
    await db.delete(invoices).where(eq(invoices.id, id))

    revalidatePath(`/${user.id}/organizations/${organizationId}`)

    return {
      success: true,
      message: 'Invoice deleted successfully',
      redirect: `/${user.id}/organizations/${organizationId}`
    }
  } catch (error) {
    console.error('Error deleting invoice:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.'
    }
  }
}

export { createAction, updateAction, deleteAction }
