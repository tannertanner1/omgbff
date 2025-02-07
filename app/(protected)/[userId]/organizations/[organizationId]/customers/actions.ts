'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import * as z from 'zod'
import { db } from '@/db'
import { customers } from '@/db/schema'
import { Action, type ActionResponse } from '@/types/forms'
import { verifySession } from '@/lib/dal'
import { hasPermission } from '@/lib/abac'

const schema = z.object({
  organizationId: z.string().min(1, 'Organization required'),

  name: z.string().min(1, 'Name required'),
  email: z.string().email('Email required')
})

const { FormData } = Action(schema)

async function createAction(
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const user = await verifySession()

  if (!hasPermission(user, 'customers', 'create')) {
    return {
      success: false,
      message: 'Unauthorized to create customers'
    }
  }

  const rawData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
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
    const [customer] = await db
      .insert(customers)
      .values({
        ...validatedData.data,
        userId: user.id
      })
      .returning()

    revalidatePath(`/${user.id}/organizations/${rawData.organizationId}`)

    return {
      success: true,
      message: 'Customer created successfully',
      redirect: `/${user.id}/organizations/${rawData.organizationId}`
    }
  } catch (error) {
    console.error('Error creating customer:', error)
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

  if (!hasPermission(user, 'customers', 'update')) {
    return {
      success: false,
      message: 'Unauthorized to update customers'
    }
  }

  const rawData = {
    id: Number(formData.get('id')),
    name: formData.get('name') as string,
    email: formData.get('email') as string,
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
      .update(customers)
      .set({
        name: validatedData.data.name,
        email: validatedData.data.email,
        updatedAt: new Date()
      })
      .where(eq(customers.id, validatedData.data.id))

    revalidatePath(`/${user.id}/organizations/${rawData.organizationId}`)

    return {
      success: true,
      message: 'Customer updated successfully',
      redirect: `/${user.id}/organizations/${rawData.organizationId}`
    }
  } catch (error) {
    console.error('Error updating customer:', error)
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

  if (!hasPermission(user, 'customers', 'delete')) {
    return {
      success: false,
      message: 'Unauthorized to delete customers'
    }
  }

  try {
    await db.delete(customers).where(eq(customers.id, id))

    revalidatePath(`/${user.id}/organizations/${organizationId}`)

    return {
      success: true,
      message: 'Customer deleted successfully',
      redirect: `/${user.id}/organizations/${organizationId}`
    }
  } catch (error) {
    console.error('Error deleting customer:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.'
    }
  }
}

export { createAction, updateAction, deleteAction }
