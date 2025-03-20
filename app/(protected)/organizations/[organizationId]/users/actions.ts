'use server'

import { revalidatePath } from 'next/cache'
import { eq, and, gt } from 'drizzle-orm'
import * as z from 'zod'
import { db } from '@/db'
import { users, userOrganizations, invitations } from '@/db/schema'
import { Action, type ActionResponse } from '@/types/forms'
import { signIn } from '@/lib/auth'
import { ROLES } from '@/data/system-roles'
import { verifySession } from '@/lib/dal'
import { hasPermission, type User } from '@/lib/abac'

const schema = z.object({
  organizationId: z.string().min(1, 'Required'),
  name: z.string().optional().nullable(),
  email: z.string().email('Required'),
  role: z.enum(ROLES)
})

const { FormData } = Action(schema)

async function createAction(
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const currentUser = await verifySession()

  if (!hasPermission(currentUser, 'users', 'create')) {
    return {
      success: false,
      message: 'Unauthorized to create users'
    }
  }

  const rawData = {
    organizationId: formData.get('organizationId') as string,
    name: (formData.get('name') as string) || null,
    email: formData.get('email') as string,
    role: formData.get('role') as 'user' | 'admin' | 'owner'
  }

  // Validate role based on current user's permissions
  if (
    (rawData.role === 'owner' && currentUser.role !== 'owner') ||
    (rawData.role === 'admin' && currentUser.role === 'user')
  ) {
    return {
      success: false,
      message: 'Unauthorized to create user with this role'
    }
  }

  const validatedData = schema.safeParse(rawData)

  if (!validatedData.success) {
    const errors = validatedData.error.flatten().fieldErrors
    console.log('Validation failed:', {
      rawData,
      errors
    })
    return {
      success: false,
      message:
        'Validation failed: ' +
        Object.entries(errors)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', '),
      errors,
      inputs: rawData
    }
  }

  try {
    console.log(
      'Starting user invitation process for:',
      validatedData.data.email
    )

    // First, clean up any existing expired invitations for this email and organization
    await db
      .delete(invitations)
      .where(
        and(
          eq(invitations.email, validatedData.data.email),
          eq(invitations.organizationId, validatedData.data.organizationId),
          eq(invitations.expiresAt, new Date())
        )
      )

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, validatedData.data.email)
    })

    console.log('Existing user found:', existingUser ? 'Yes' : 'No')

    let userId: string

    if (existingUser) {
      userId = existingUser.id

      // Check if user is already in this organization - DEBUGGING THIS PART
      console.log(
        'Checking if user is already in organization:',
        validatedData.data.organizationId
      )

      const existingUserOrg = await db.query.userOrganizations.findFirst({
        where: and(
          eq(userOrganizations.userId, existingUser.id),
          eq(
            userOrganizations.organizationId,
            validatedData.data.organizationId
          )
        )
      })

      console.log(
        'Existing user organization found:',
        existingUserOrg ? 'Yes' : 'No'
      )

      if (existingUserOrg) {
        // User is already in this organization
        return {
          success: false,
          message: 'User is already a member of this organization',
          inputs: rawData
        }
      }

      // Check if there's a pending invitation
      const pendingInvitation = await db.query.invitations.findFirst({
        where: and(
          eq(invitations.email, validatedData.data.email),
          eq(invitations.organizationId, validatedData.data.organizationId),
          gt(invitations.expiresAt, new Date()) // Not expired
        )
      })

      if (pendingInvitation) {
        return {
          success: false,
          message: 'User has already been invited to this organization',
          inputs: rawData
        }
      }

      // If user exists but is not in the organization, add them
      console.log('Adding existing user to organization')
      await db.insert(userOrganizations).values({
        userId: existingUser.id,
        organizationId: validatedData.data.organizationId,
        role: validatedData.data.role
      })
    } else {
      // Create new user
      console.log('Creating new user')
      const [newUser] = await db
        .insert(users)
        .values({
          name: validatedData.data.name,
          email: validatedData.data.email,
          role: validatedData.data.role,
          status: 'pending',
          updatedAt: new Date()
        })
        .returning()

      userId = newUser.id

      // Add user to organization
      console.log('Adding new user to organization')
      await db.insert(userOrganizations).values({
        userId: newUser.id,
        organizationId: validatedData.data.organizationId,
        role: validatedData.data.role
      })
    }

    // Create invitation record
    console.log('Creating invitation record')
    const token = crypto.randomUUID()
    await db.insert(invitations).values({
      userId: currentUser.id, // This is the inviter
      organizationId: validatedData.data.organizationId,
      email: validatedData.data.email,
      token: token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      role: validatedData.data.role
    })

    // Use NextAuth's built-in email provider to send the verification/login email
    console.log('Sending email via signIn')
    await signIn('resend', {
      email: validatedData.data.email,
      redirect: false,
      redirectTo: `/organizations/${validatedData.data.organizationId}`
    })

    // Fix the redirect path - use the organization page instead of users
    revalidatePath(`/organizations/${validatedData.data.organizationId}`)

    return {
      success: true,
      message: 'User invited successfully',
      redirect: `/organizations/${validatedData.data.organizationId}`
    }
  } catch (error) {
    console.error('Error details:', {
      error,
      rawData,
      validatedData: validatedData.data
    })
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred. Please try again.',
      inputs: rawData
    }
  }
}

async function updateAction(
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const currentUser: User = await verifySession()
  const organizationId = formData.get('organizationId') as string
  const userId = formData.get('id') as string
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const role = formData.get('role') as 'user' | 'admin' | 'owner'
  const returnTo =
    (formData.get('returnTo') as string) ||
    `/organizations/${organizationId}/users`

  if (!hasPermission(currentUser, 'users', 'update')) {
    return {
      success: false,
      message: 'Unauthorized to update users'
    }
  }

  // Get the user being edited
  const userToEdit = await db.query.users.findFirst({
    where: eq(users.id, userId)
  })

  if (!userToEdit) {
    return {
      success: false,
      message: 'User not found'
    }
  }

  // Check if the current user has permission to edit this user based on roles
  const isSelfEdit = currentUser.id === userId
  const canEditUser =
    currentUser.role === 'owner' ||
    (currentUser.role === 'admin' && userToEdit.role === 'user') ||
    isSelfEdit

  try {
    // Only update fields the user has permission to edit
    if (canEditUser) {
      await db
        .update(users)
        .set({
          name,
          email,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId))
    }

    // Only update role if the user has permission
    if (
      currentUser.role === 'owner' ||
      (currentUser.role === 'admin' &&
        userToEdit.role === 'user' &&
        role === 'user')
    ) {
      await db
        .update(userOrganizations)
        .set({
          role,
          updatedAt: new Date()
        })
        .where(
          and(
            eq(userOrganizations.userId, userId),
            eq(userOrganizations.organizationId, organizationId)
          )
        )
    }

    revalidatePath(`/organizations/${organizationId}`)

    return {
      success: true,
      message: 'User updated successfully',
      redirect: returnTo
    }
  } catch (error) {
    console.error('Error updating user:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.'
    }
  }
}

async function deleteAction(
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const currentUser: User = await verifySession()
  const userId = formData.get('id') as string
  const organizationId = formData.get('organizationId') as string

  if (!hasPermission(currentUser, 'users', 'delete')) {
    return {
      success: false,
      message: 'Unauthorized to remove users'
    }
  }

  try {
    const userToDelete = await db.query.userOrganizations.findFirst({
      where: and(
        eq(userOrganizations.userId, userId),
        eq(userOrganizations.organizationId, organizationId)
      ),
      with: {
        user: true
      }
    })

    if (!userToDelete) {
      return {
        success: false,
        message: 'User not found in this organization'
      }
    }

    // Check if current user has permission to delete this user
    if (
      currentUser.role !== 'owner' &&
      (userToDelete.user.role === 'owner' || userToDelete.user.role === 'admin')
    ) {
      return {
        success: false,
        message: 'Unauthorized to remove users with higher roles'
      }
    }

    // Delete any pending invitations for this user in this organization
    if (userToDelete.user.email) {
      await db
        .delete(invitations)
        .where(
          and(
            eq(invitations.email, userToDelete.user.email),
            eq(invitations.organizationId, organizationId)
          )
        )
    }

    await db
      .delete(userOrganizations)
      .where(
        and(
          eq(userOrganizations.userId, userId),
          eq(userOrganizations.organizationId, organizationId)
        )
      )

    // Check if the user is part of any other organizations
    const remainingOrgs = await db.query.userOrganizations.findMany({
      where: eq(userOrganizations.userId, userId)
    })

    if (remainingOrgs.length === 0) {
      // If not part of any organization, delete the user entirely
      await db.delete(users).where(eq(users.id, userId))
    }

    revalidatePath(`/organizations/${organizationId}`)

    return {
      success: true,
      message: 'User removed successfully',
      redirect: `/organizations/${organizationId}`
    }
  } catch (error) {
    console.error('Error removing user:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.'
    }
  }
}

export { createAction, updateAction, deleteAction }
