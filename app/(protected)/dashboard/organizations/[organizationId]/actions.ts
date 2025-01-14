'use server'

import { auth } from '@/lib/auth'
import { db } from '@/db'
import { organizations, users } from '@/db/schema/users'
import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type OrganizationResponse = {
  success: boolean
  message: string
  role?: string
}

export async function updateOrganizationRole(
  prevState: OrganizationResponse | null,
  formData: FormData
): Promise<OrganizationResponse> {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }

  const organizationId = formData.get('organizationId') as string
  const role = formData.get('role') as 'owner' | 'admin' | 'user'

  try {
    await db
      .update(users)
      .set({ role })
      .where(
        and(
          eq(users.organizationId, organizationId),
          eq(users.id, session.user.id)
        )
      )

    revalidatePath(`/dashboard/organizations/${organizationId}`)
    return {
      success: true,
      message: 'Organization role updated successfully',
      role
    }
  } catch (error) {
    console.error('Error updating organization role:', error)
    return {
      success: false,
      message: 'Failed to update organization role',
      role: prevState?.role
    }
  }
}

export async function deleteOrganization(formData: FormData) {
  const session = await auth()
  if (!session) {
    throw new Error('You must be logged in to delete organizations')
  }

  const organizationId = formData.get('organizationId') as string

  try {
    await db.delete(organizations).where(eq(organizations.id, organizationId))
    revalidatePath('/dashboard/organizations')
    return { success: true }
  } catch (error) {
    console.error('Error deleting organization:', error)
    return { success: false, error: 'Failed to delete organization' }
  }
}
