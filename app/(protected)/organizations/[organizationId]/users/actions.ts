'use server'

import { revalidatePath } from 'next/cache'
import { eq, and } from 'drizzle-orm'
import * as z from 'zod'
import { db } from '@/db'
import {
  users,
  userOrganizations,
  invitations,
  organizations
} from '@/db/schema'
import { Action, type ActionResponse } from '@/types/forms'
import { verifySession } from '@/lib/dal'
import { hasPermission, type User } from '@/lib/abac'
import { Resend } from 'resend'
import InviteEmail from '@/emails/invite-email'
import crypto from 'crypto'

const resend = new Resend(process.env.AUTH_RESEND_KEY)

const schema = z.object({
  organizationId: z.string().min(1, 'Required'),
  email: z.string().email('Invalid'),
  role: z.enum(['user', 'admin', 'owner'])
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
      message: 'Unauthorized to create'
    }
  }

  const rawData = {
    organizationId: formData.get('organizationId') as string,
    email: formData.get('email') as string,
    role: formData.get('role') as 'user' | 'admin' | 'owner'
  }

  const validatedData = schema.safeParse(rawData)

  if (!validatedData.success) {
    const errors = validatedData.error.flatten().fieldErrors
    return {
      success: false,
      message: 'Please fix the errors in the form',
      errors,
      inputs: rawData
    }
  }

  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, validatedData.data.email)
    })

    if (existingUser) {
      await db.insert(userOrganizations).values({
        userId: existingUser.id,
        organizationId: validatedData.data.organizationId,
        role: validatedData.data.role
      })
    } else {
      const [newUser] = await db
        .insert(users)
        .values({
          email: validatedData.data.email,
          role: validatedData.data.role,
          status: 'pending'
        })
        .returning()

      const token = crypto.randomUUID()
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now

      await db.insert(invitations).values({
        email: validatedData.data.email,
        role: validatedData.data.role,
        organizationId: validatedData.data.organizationId,
        userId: newUser.id,
        token,
        expiresAt
      })

      const organization = await db.query.organizations.findFirst({
        where: eq(organizations.id, validatedData.data.organizationId),
        columns: { name: true }
      })

      const url = `/invite?token=${token}`

      await resend.emails.send({
        from: process.env.AUTH_RESEND_EMAIL!,
        to: validatedData.data.email,
        subject: `Invitation to join ${organization?.name || 'our platform'}`,
        react: InviteEmail({ url })
      })
    }

    revalidatePath(`/organizations/${rawData.organizationId}/users`)

    return {
      success: true,
      message: 'User invited successfully',
      redirect: `/organizations/${rawData.organizationId}/users`
    }
  } catch (error) {
    console.error('Error inviting user:', error)
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
  const currentUser: User = await verifySession()
  const organizationId = formData.get('organizationId') as string
  const userId = formData.get('userId') as string
  const role = formData.get('role') as 'user' | 'admin' | 'owner'

  if (!hasPermission(currentUser, 'users', 'update')) {
    return {
      success: false,
      message: 'Unauthorized to update'
    }
  }

  try {
    await db
      .update(userOrganizations)
      .set({ role, updatedAt: new Date() })
      .where(
        and(
          eq(userOrganizations.userId, userId),
          eq(userOrganizations.organizationId, organizationId)
        )
      )

    revalidatePath(`/organizations/${organizationId}/users`)

    return {
      success: true,
      message: 'User updated successfully',
      redirect: `/organizations/${organizationId}/users`
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
      message: 'Unauthorized to remove'
    }
  }

  try {
    await db
      .delete(userOrganizations)
      .where(
        and(
          eq(userOrganizations.userId, userId),
          eq(userOrganizations.organizationId, organizationId)
        )
      )

    const remainingOrgs = await db.query.userOrganizations.findMany({
      where: eq(userOrganizations.userId, userId)
    })

    if (remainingOrgs.length === 0) {
      await db.delete(users).where(eq(users.id, userId))
    }

    revalidatePath(`/organizations/${organizationId}/users`)

    return {
      success: true,
      message: 'User removed successfully',
      redirect: `/organizations/${organizationId}/users`
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
