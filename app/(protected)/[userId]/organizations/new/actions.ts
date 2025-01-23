'use server'

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { organizations, userOrganizations } from '@/db/schema/users'
import { revalidatePath } from 'next/cache'
import type { Role } from '@/data/system-roles'
import { schema } from './schema'
import type { ActionResponse } from './types'

export async function createAction(
  userId: string,
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }

  if (session.user.id !== userId) {
    return {
      success: false,
      message: 'Unauthorized',
      errors: {},
      inputs: { name: formData.get('name') as string }
    }
  }

  const validatedData = schema.safeParse({
    name: formData.get('name')
  })

  if (!validatedData.success) {
    return {
      success: false,
      message: 'Please fix the errors in the form',
      errors: validatedData.error.flatten().fieldErrors,
      inputs: { name: formData.get('name') as string }
    }
  }

  try {
    const [organization] = await db
      .insert(organizations)
      .values({
        name: validatedData.data.name
      })
      .returning()

    await db.insert(userOrganizations).values({
      userId: userId,
      organizationId: organization.id,
      role: 'owner' as Role
    })

    revalidatePath(`/${userId}/organizations`)
    return {
      success: true,
      message: 'Organization created successfully',
      errors: {},
      inputs: { name: validatedData.data.name }
    }
  } catch (error) {
    console.error('Error creating organization:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      errors: {},
      inputs: { name: validatedData.data.name }
    }
  }
}
