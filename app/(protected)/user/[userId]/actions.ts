'use server'

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { organizations, users } from '@/db/schema/users'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { ActionResponse } from './types'
import { schema } from './schema'
import * as z from 'zod'

export async function createAction(
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }

  const rawData = {
    name: formData.get('name') as string
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
    const [organization] = await db
      .insert(organizations)
      .values({
        name: validatedData.data.name
      })
      .returning()

    await db
      .update(users)
      .set({ organizationId: organization.id })
      .where(eq(users.id, session.user.id))

    revalidatePath(`/${session.user.id}`)
    return {
      success: true,
      message: 'Organization created successfully',
      inputs: { name: '' },
      organizationId: organization.id
    }
  } catch (error) {
    console.error('Error creating organization:', error)
    return {
      success: false,
      message: 'An unexpected error occurred',
      inputs: rawData
    }
  }
}

export async function updateAction(
  formData: FormData
): Promise<ActionResponse> {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }

  const rawData = {
    id: formData.get('id') as string,
    name: formData.get('name') as string
  }

  const validatedData = schema.extend({ id: z.string() }).safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      message: 'Please fix the errors in the form',
      errors: validatedData.error.flatten().fieldErrors,
      inputs: { name: rawData.name }
    }
  }

  try {
    await db
      .update(organizations)
      .set({ name: validatedData.data.name })
      .where(eq(organizations.id, validatedData.data.id))

    revalidatePath(`/${session.user.id}`)
    return {
      success: true,
      message: 'Organization updated successfully',
      inputs: { name: '' }
    }
  } catch (error) {
    console.error('Error updating organization:', error)
    return {
      success: false,
      message: 'Failed to update organization',
      inputs: { name: rawData.name }
    }
  }
}

export async function deleteAction(
  formData: FormData
): Promise<ActionResponse> {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }

  const id = formData.get('id') as string
  if (!id) {
    return {
      success: false,
      message: 'ID is required',
      errors: { id: ['ID is required'] },
      inputs: { name: '' }
    }
  }

  try {
    await db.delete(organizations).where(eq(organizations.id, id))

    revalidatePath(`/${session.user.id}`)
    return {
      success: true,
      message: 'Organization deleted successfully',
      inputs: { name: '' }
    }
  } catch (error) {
    console.error('Error deleting organization:', error)
    return {
      success: false,
      message: 'Failed to delete organization',
      inputs: { name: '' }
    }
  }
}
