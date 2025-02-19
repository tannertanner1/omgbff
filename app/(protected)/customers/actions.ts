'use server'

import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import * as z from 'zod'
import { db } from '@/db'
import { customers } from '@/db/schema'
import { Action, type ActionResponse } from '@/types/forms'
import { verifySession } from '@/lib/dal'
import { hasPermission } from '@/lib/abac'
import {
  ADDRESS,
  PHONE,
  COUNTRY,
  STATE,
  PROVINCE
} from '@/data/customer-fields'

// const schema = z.object({
//   name: z.string().min(1, 'Required'),
//   email: z.string().email('Required'),
//   organizationId: z.string().min(1, 'Required')
// })
const schema = z.object({
  organizationId: z.string().min(1, 'Organization required'),
  name: z.string().min(1, 'Name required'),
  email: z.string().email('Email required'),
  address: z
    .array(
      z.object({
        label: z.enum(ADDRESS),
        line1: z.string().min(1, 'Address line 1 is required'),
        line2: z.string().optional(),
        city: z.string().min(1, 'City is required'),
        region: z.union([z.enum(STATE), z.enum(PROVINCE)]),
        postal: z.string().min(5, 'Postal code must be at least 5 characters'),
        country: z.enum(COUNTRY)
      })
    )
    .min(1, 'At least one address is required'),
  phone: z
    .array(
      z.object({
        label: z.enum(PHONE),
        number: z.string().min(10, 'Phone number must be at least 10 digits')
      })
    )
    .min(1, 'At least one phone number is required')
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

    revalidatePath('/customers')
    return {
      success: true,
      message: 'Customer created successfully',
      redirect: '/customers'
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
  const id = formData.get('id') as string

  if (!hasPermission(user, 'customers', 'update')) {
    return {
      success: false,
      message: 'Unauthorized to update customers'
    }
  }

  const rawData = {
    id,
    name: formData.get('name') as string,
    email: formData.get('email') as string,
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
      .update(customers)
      .set({
        name: validatedData.data.name,
        email: validatedData.data.email,
        organizationId: validatedData.data.organizationId,
        updatedAt: new Date()
      })
      .where(eq(customers.id, id))

    revalidatePath('/customers')
    return {
      success: true,
      message: 'Customer updated successfully',
      redirect: '/customers'
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
  const id = formData.get('id') as string

  if (!hasPermission(user, 'customers', 'delete')) {
    return {
      success: false,
      message: 'Unauthorized to delete customers'
    }
  }

  try {
    await db.delete(customers).where(eq(customers.id, id))

    revalidatePath('/customers')
    return {
      success: true,
      message: 'Customer deleted successfully',
      redirect: '/customers'
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
