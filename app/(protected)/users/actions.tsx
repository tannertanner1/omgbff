'use server'

import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import * as z from 'zod'
import { db } from '@/db'
import { users } from '@/db/schema'
import { Action, type ActionResponse } from '@/types/forms'
import { verifySession } from '@/lib/dal'
import { hasPermission } from '@/lib/abac'
import { ROLES } from '@/data/system-roles'

const schema = z.object({
  email: z.string().email('Email required'),
  role: z.enum(ROLES)
})

const { FormData } = Action(schema)

async function createAction(
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const user = await verifySession()

  if (!hasPermission(user, 'users', 'create')) {
    return {
      success: false,
      message: 'Unauthorized to create users'
    }
  }

  const rawData = {
    email: formData.get('email') as string,
    role: formData.get('role') as (typeof ROLES)[number]
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
    const [newUser] = await db
      .insert(users)
      .values({
        ...validatedData.data,
        updatedAt: new Date()
      })
      .returning()

    revalidatePath('/users')
    return {
      success: true,
      message: 'User created successfully',
      redirect: '/users'
    }
  } catch (error) {
    console.error('Error creating user:', error)
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
  const currentUser = await verifySession()
  const id = formData.get('id') as string

  if (!hasPermission(currentUser, 'users', 'update')) {
    return {
      success: false,
      message: 'Unauthorized to update users'
    }
  }

  const rawData = {
    id,
    email: formData.get('email') as string,
    role: formData.get('role') as (typeof ROLES)[number]
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
      .update(users)
      .set({
        email: validatedData.data.email,
        role: validatedData.data.role,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))

    revalidatePath('/users')
    return {
      success: true,
      message: 'User updated successfully',
      redirect: '/users'
    }
  } catch (error) {
    console.error('Error updating user:', error)
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
  const currentUser = await verifySession()
  const id = formData.get('id') as string

  if (!hasPermission(currentUser, 'users', 'delete')) {
    return {
      success: false,
      message: 'Unauthorized to delete users'
    }
  }

  try {
    await db.delete(users).where(eq(users.id, id))

    revalidatePath('/users')
    return {
      success: true,
      message: 'User deleted successfully',
      redirect: '/users'
    }
  } catch (error) {
    console.error('Error deleting user:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.'
    }
  }
}

export { createAction, updateAction, deleteAction }
