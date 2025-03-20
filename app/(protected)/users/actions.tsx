'use server'

import { revalidatePath } from 'next/cache'
import { eq, and, gt } from 'drizzle-orm'
import * as z from 'zod'
import { db } from '@/db'
import { users, userOrganizations, customers, invitations } from '@/db/schema'
import { Action, type ActionResponse } from '@/types/forms'
import { verifySession } from '@/lib/dal'
import { hasPermission } from '@/lib/abac'
import { ROLES } from '@/data/system-roles'
import { signIn } from '@/lib/auth'

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
    name: (formData.get('name') as string) || null,
    email: formData.get('email') as string,
    role: formData.get('role') as (typeof ROLES)[number],
    organizationId: formData.get('organizationId') as string
  }

  console.log('Raw form data:', rawData)

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
    console.log('Validation errors:', errors)
    return {
      success: false,
      message: 'Please fix the errors in the form',
      errors,
      inputs: rawData
    }
  }

  try {
    console.log('Checking if user exists with email:', validatedData.data.email)

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

      console.log(
        'Checking if user is already in organization:',
        validatedData.data.organizationId
      )
      // Check if user is already in organization
      const existingUserOrg = await db.query.userOrganizations.findFirst({
        where: fields =>
          and(
            eq(fields.userId, existingUser.id),
            eq(fields.organizationId, validatedData.data.organizationId)
          )
      })

      console.log(
        'User already in organization:',
        existingUserOrg ? 'Yes' : 'No'
      )

      if (existingUserOrg) {
        // User is already in this organization
        console.log('User is already a member of this organization')
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

      console.log('Adding user to organization')
      await db.insert(userOrganizations).values({
        userId: existingUser.id,
        organizationId: validatedData.data.organizationId,
        role: validatedData.data.role
      })
    } else {
      console.log('Creating new user')
      // Create new user
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
      console.log('New user created with ID:', userId)

      console.log('Adding user to organization')
      // Add user to organization
      await db.insert(userOrganizations).values({
        userId: newUser.id,
        organizationId: validatedData.data.organizationId,
        role: validatedData.data.role
      })
    }

    console.log('Creating invitation record')
    // Create invitation record
    const token = crypto.randomUUID()
    await db.insert(invitations).values({
      userId: currentUser.id, // This is the inviter
      organizationId: validatedData.data.organizationId,
      email: validatedData.data.email,
      token: token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      role: validatedData.data.role
    })

    console.log('Sending invitation email')
    // Use NextAuth's built-in email provider to send the verification/login email
    // for both new and existing users
    await signIn('resend', {
      email: validatedData.data.email,
      redirect: false,
      redirectTo: `/organizations/${validatedData.data.organizationId}`
    })

    console.log('Invitation process completed successfully')
    revalidatePath('/users')
    return {
      success: true,
      message: 'User invited successfully',
      redirect: '/users'
    }
  } catch (error) {
    console.error('Error creating/inviting user:', error)
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
    name: (formData.get('name') as string) || null,
    email: formData.get('email') as string,
    role: formData.get('role') as (typeof ROLES)[number],
    organizationId: formData.get('organizationId') as string
  }

  // Get the user being edited
  const userToEdit = await db.query.users.findFirst({
    where: eq(users.id, id)
  })

  if (!userToEdit) {
    return {
      success: false,
      message: 'User not found'
    }
  }

  // Check if the current user has permission to edit this user based on roles
  const isSelfEdit = currentUser.id === id
  const canEditUser =
    currentUser.role === 'owner' ||
    (currentUser.role === 'admin' && userToEdit.role === 'user') ||
    isSelfEdit

  // Determine which fields the current user can edit
  const updatedFields: Record<string, any> = {
    updatedAt: new Date()
  }

  // Only include fields the user has permission to edit
  if (canEditUser) {
    updatedFields.name = rawData.name
    updatedFields.email = rawData.email
  }

  // Only owners or admins can change roles, and with restrictions
  if (
    currentUser.role === 'owner' ||
    (currentUser.role === 'admin' &&
      userToEdit.role === 'user' &&
      rawData.role === 'user')
  ) {
    updatedFields.role = rawData.role
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
    await db.update(users).set(updatedFields).where(eq(users.id, id))

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

  try {
    // Get the user to delete
    const userToDelete = await db.query.users.findFirst({
      where: eq(users.id, id)
    })

    if (!userToDelete) {
      return {
        success: false,
        message: 'User not found'
      }
    }

    // Apply role-based deletion rules:
    // 1. Owners can delete anyone except themselves
    // 2. Admins can delete themselves and users, but not owners or other admins
    // 3. Users can only delete themselves

    const isSelfDeletion = currentUser.id === id

    if (currentUser.role === 'owner') {
      // Owners can't delete themselves
      if (isSelfDeletion) {
        return {
          success: false,
          message: 'Owners cannot delete their own account'
        }
      }
      // Otherwise owners can delete anyone
    } else if (currentUser.role === 'admin') {
      // Admins can delete themselves
      if (isSelfDeletion) {
        // Allow self-deletion
      }
      // Admins can't delete owners or other admins
      else if (userToDelete.role === 'owner' || userToDelete.role === 'admin') {
        return {
          success: false,
          message: 'Admins cannot delete owners or other admins'
        }
      }
      // Admins can delete users
    } else if (currentUser.role === 'user') {
      // Users can only delete themselves
      if (!isSelfDeletion) {
        return {
          success: false,
          message: 'Users can only delete their own account'
        }
      }
    }

    // Delete any pending invitations for this user
    if (userToDelete.email) {
      await db
        .delete(invitations)
        .where(eq(invitations.email, userToDelete.email))
    }

    // Delete in the correct order to handle foreign key constraints
    // 1. Delete customer records first
    await db.delete(customers).where(eq(customers.userId, id))

    // 2. Delete user organization associations
    await db.delete(userOrganizations).where(eq(userOrganizations.userId, id))

    // 3. Finally delete the user
    await db.delete(users).where(eq(users.id, id))

    revalidatePath('/users')
    return {
      success: true,
      message: 'User deleted successfully'
    }
  } catch (error) {
    console.error('Error deleting user:', error)
    return {
      success: false,
      message: 'An unexpected error occurred while deleting the user'
    }
  }
}

export { createAction, updateAction, deleteAction }
