'use server'
import { auth } from '@/lib/auth'
import { db } from '@/db'
import { organizations } from '@/db/schema'
import { schema } from './schema'
import type { ActionResponse, FormData } from './types'

export async function createAction(
  prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  const session = await auth()
  if (!session) {
    return {
      success: false,
      message: 'You must be logged in to create an organization',
      errors: {},
      inputs: { name: formData.get('name') as string }
    }
  }

  const validatedData = schema.safeParse(Object.fromEntries(formData))

  if (validatedData.success) {
    try {
      const [organization] = await db
        .insert(organizations)
        .values({
          name: validatedData.data.name,
          userId: session.user.id
        })
        .returning()

      return {
        success: true,
        message: 'Organization created successfully',
        organizationId: organization.id,
        redirect: `/${session.user.id}/organizations/${organization.id}`,
        errors: {},
        inputs: { name: validatedData.data.name }
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create organization',
        errors: { name: ['An unexpected error occurred'] },
        inputs: { name: validatedData.data.name }
      }
    }
  } else {
    return {
      success: false,
      message: 'Failed to create organization',
      errors: validatedData.error.flatten().fieldErrors,
      inputs: { name: formData.get('name') as string }
    }
  }
}
