'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { invoices } from '@/db/schema'
import { hasPermission } from '@/lib/abac'

import * as z from 'zod'
import { STATUS, type Status } from '@/data/invoice-statuses'
import { verifySession } from '@/lib/dal'
import { Action, type ActionResponse } from '@/types/forms'

const schema = z.object({
  organizationId: z.string().min(1, 'Organization required'),
  customerId: z.number().int().positive('Customer required'),
  value: z.number().min(0, 'Value must be positive'),
  status: z.enum(STATUS.enumValues, {
    required_error: 'Status required',
    invalid_type_error: 'Invalid status'
  }),
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
    organizationId: formData.get('organizationId') as string
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
    id: Number(formData.get('id')),
    description: formData.get('description') as string,
    value: Number(formData.get('value')),
    status: formData.get('status') as string,
    customerId: Number(formData.get('customerId')),
    organizationId: formData.get('organizationId') as string
  }

  const validatedData = schema.extend({ id: z.number() }).safeParse(rawData)

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
  const id = Number(formData.get('id'))
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
