'use server'

import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { invoices } from '@/db/schema'
import * as z from 'zod'
import { STATUSES, type Status } from '@/data/invoice-statuses'
import { Action, type ActionResponse } from '@/types/forms'
import { verifySession } from '@/lib/dal'
import type { User } from '@/lib/abac'

const schema = z.object({
  organizationId: z.string().min(1, 'Organization required'),
  customerId: z.string().min(1, 'Customer required'),
  value: z.number().min(1, 'Value must be at least $1'),
  status: z.enum(STATUSES).optional(), // Make status optional
  description: z
    .string()
    .max(32, { message: 'Description must be at most 32 characters' })
    .optional()
})

const { FormData } = Action(schema)

async function createAction(
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const user: User = await verifySession()
  const organizationId = formData.get('organizationId') as string

  const hasAccess = user.role === 'admin' || user.role === 'owner'

  const rawData = {
    description: formData.get('description') as string,
    value: Number(formData.get('value')),
    status: hasAccess ? (formData.get('status') as Status) : 'open',
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
  const user: User = await verifySession()
  const organizationId = formData.get('organizationId') as string

  const hasAccess = user.role === 'admin' || user.role === 'owner'

  const rawData = {
    id: formData.get('id') as string,
    description: formData.get('description') as string,
    value: Number(formData.get('value')),
    status: hasAccess ? (formData.get('status') as Status) : undefined,
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
    const currentInvoice = await db.query.invoices.findFirst({
      where: eq(invoices.id, validatedData.data.id)
    })

    if (!currentInvoice) {
      return {
        success: false,
        message: 'Invoice not found',
        inputs: rawData
      }
    }

    const updateData: Partial<typeof validatedData.data> = {
      description: validatedData.data.description,
      value: validatedData.data.value,
      customerId: validatedData.data.customerId
    }

    // Only update status if user has access and status was provided
    if (hasAccess && validatedData.data.status) {
      updateData.status = validatedData.data.status
    }

    await db
      .update(invoices)
      .set({
        ...updateData,
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
  const user: User = await verifySession()
  const id = formData.get('id') as string
  const organizationId = formData.get('organizationId') as string

  const hasAccess = user.role === 'admin' || user.role === 'owner'

  if (!hasAccess) {
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
