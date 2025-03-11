'use server'

import { revalidatePath } from 'next/cache'
import { eq, and } from 'drizzle-orm'
import * as z from 'zod'
import { db } from '@/db'
import { users, userOrganizations, organizations } from '@/db/schema'
import { Action, type ActionResponse } from '@/types/forms'
import { verifySession } from '@/lib/dal'
import { hasPermission, type User } from '@/lib/abac'
import { Resend } from 'resend'
import InviteEmail from '@/emails/invite-email'

const resend = new Resend(process.env.AUTH_RESEND_KEY)

const schema = z.object({
  organizationId: z.string().min(1, 'Required'),
  name: z.string().optional(),
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
    return {
      success: false,
      message: 'Please fix the errors in the form',
      errors,
      inputs: rawData
    }
  }

  try {
    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, validatedData.data.email)
    })

    if (existingUser) {
      // If user exists, just add them to the organization
      await db.insert(userOrganizations).values({
        userId: existingUser.id,
        organizationId: validatedData.data.organizationId,
        role: validatedData.data.role
      })

      // Send login email since user already exists
      const organization = await db.query.organizations.findFirst({
        where: eq(organizations.id, validatedData.data.organizationId),
        columns: { name: true }
      })
      await resend.emails.send({
        from: process.env.AUTH_RESEND_EMAIL!,
        to: validatedData.data.email,
        subject: `Invitation to join ${organization?.name || 'our organization'}`,
        react: InviteEmail({
          url: `/api/auth/signin/resend?email=${encodeURIComponent(validatedData.data.email)}`
        })
      })
    } else {
      // Create new user
      const [newUser] = await db
        .insert(users)
        .values({
          name: validatedData.data.name,
          email: validatedData.data.email,
          role: validatedData.data.role,
          status: 'pending'
        })
        .returning()

      // Add user to organization
      await db.insert(userOrganizations).values({
        userId: newUser.id,
        organizationId: validatedData.data.organizationId,
        role: validatedData.data.role
      })

      // Send invite email for new user
      const organization = await db.query.organizations.findFirst({
        where: eq(organizations.id, validatedData.data.organizationId),
        columns: { name: true }
      })
      await resend.emails.send({
        from: process.env.AUTH_RESEND_EMAIL!,
        to: validatedData.data.email,
        subject: `Invitation to join ${organization?.name || 'our organization'}`,
        react: InviteEmail({
          url: `/api/auth/signin/resend?email=${encodeURIComponent(validatedData.data.email)}`
        })
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
  const userId = formData.get('id') as string
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const role = formData.get('role') as 'user' | 'admin' | 'owner'

  if (!hasPermission(currentUser, 'users', 'update')) {
    return {
      success: false,
      message: 'Unauthorized to update users'
    }
  }

  // Check if the current user has permission to change to this role
  if (
    (role === 'owner' && currentUser.role !== 'owner') ||
    (role === 'admin' && currentUser.role === 'user')
  ) {
    return {
      success: false,
      message: 'Unauthorized to change user to this role'
    }
  }

  try {
    await db
      .update(users)
      .set({
        name,
        email,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))

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

// @note

// 'use server'

// import { revalidatePath } from 'next/cache'
// import { eq, and } from 'drizzle-orm'
// import * as z from 'zod'
// import { db } from '@/db'
// import {
//   users,
//   userOrganizations,
//   invitations,
//   organizations
// } from '@/db/schema'
// import { Action, type ActionResponse } from '@/types/forms'
// import { verifySession } from '@/lib/dal'
// import { hasPermission, type User } from '@/lib/abac'
// import { Resend } from 'resend'
// import InviteEmail from '@/emails/invite-email'
// import crypto from 'crypto'

// const resend = new Resend(process.env.AUTH_RESEND_KEY)

// const schema = z.object({
//   organizationId: z.string().min(1, 'Required'),
//   name: z.string().optional(), // Make name optional
//   email: z.string().email('Invalid'),
//   role: z.enum(['user', 'admin', 'owner'])
// })

// const { FormData } = Action(schema)

// async function createAction(
//   _: ActionResponse | null,
//   formData: FormData
// ): Promise<ActionResponse> {
//   const user = await verifySession()

//   if (!hasPermission(user, 'users', 'create')) {
//     return {
//       success: false,
//       message: 'Unauthorized to create'
//     }
//   }

//   const rawData = {
//     organizationId: formData.get('organizationId') as string,
//     name: (formData.get('name') as string) || null, // Handle name as optional
//     email: formData.get('email') as string,
//     role: formData.get('role') as 'user' | 'admin' | 'owner'
//   }

//   // Validate role based on current user's permissions
//   if (rawData.role === 'owner' && user.role !== 'owner') {
//     rawData.role = 'admin' // Downgrade to admin if not owner
//   }

//   const validatedData = schema.safeParse(rawData)

//   if (!validatedData.success) {
//     const errors = validatedData.error.flatten().fieldErrors
//     return {
//       success: false,
//       message: 'Please fix the errors in the form',
//       errors,
//       inputs: rawData
//     }
//   }

//   try {
//     const existingUser = await db.query.users.findFirst({
//       where: eq(users.email, validatedData.data.email)
//     })

//     if (existingUser) {
//       await db.insert(userOrganizations).values({
//         userId: existingUser.id,
//         organizationId: validatedData.data.organizationId,
//         role: validatedData.data.role
//       })
//     } else {
//       // Always set status to 'pending' for new users
//       const [newUser] = await db
//         .insert(users)
//         .values({
//           name: validatedData.data.name,
//           email: validatedData.data.email,
//           role: validatedData.data.role,
//           status: 'pending' // Always set to pending
//         })
//         .returning()

//       const token = crypto.randomUUID()
//       const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now

//       await db.insert(invitations).values({
//         token,
//         expiresAt,
//         organizationId: validatedData.data.organizationId,
//         userId: newUser.id,
//         email: validatedData.data.email,
//         role: validatedData.data.role
//       })

//       const organization = await db.query.organizations.findFirst({
//         where: eq(organizations.id, validatedData.data.organizationId),
//         columns: { name: true }
//       })

//       const url = `/invite?token=${token}`

//       await resend.emails.send({
//         from: process.env.AUTH_RESEND_EMAIL!,
//         to: validatedData.data.email,
//         subject: `Invitation to join ${organization?.name || 'tannertanner.me'}`,
//         react: InviteEmail({ url })
//       })
//     }

//     revalidatePath(`/organizations/${rawData.organizationId}/users`)

//     return {
//       success: true,
//       message: 'User invited successfully',
//       redirect: `/organizations/${rawData.organizationId}/users`
//     }
//   } catch (error) {
//     console.error('Error inviting user:', error)
//     return {
//       success: false,
//       message: 'An unexpected error occurred. Please try again.',
//       inputs: rawData
//     }
//   }
// }

// async function updateAction(
//   _: ActionResponse | null,
//   formData: FormData
// ): Promise<ActionResponse> {
//   const user: User = await verifySession()
//   const organizationId = formData.get('organizationId') as string
//   const userId = formData.get('id') as string
//   const name = formData.get('name') as string
//   const email = formData.get('email') as string
//   const role = formData.get('role') as 'user' | 'admin' | 'owner'

//   if (!hasPermission(user, 'users', 'update')) {
//     return {
//       success: false,
//       message: 'Unauthorized to update'
//     }
//   }

//   try {
//     // Update user information but don't change status
//     await db
//       .update(users)
//       .set({
//         name,
//         email,
//         updatedAt: new Date()
//       })
//       .where(eq(users.id, userId))

//     // Update role in the organization
//     await db
//       .update(userOrganizations)
//       .set({
//         role,
//         updatedAt: new Date()
//       })
//       .where(
//         and(
//           eq(userOrganizations.userId, userId),
//           eq(userOrganizations.organizationId, organizationId)
//         )
//       )

//     revalidatePath(`/organizations/${organizationId}/users`)

//     return {
//       success: true,
//       message: 'User updated successfully',
//       redirect: `/organizations/${organizationId}/users`
//     }
//   } catch (error) {
//     console.error('Error updating user:', error)
//     return {
//       success: false,
//       message: 'An unexpected error occurred. Please try again.'
//     }
//   }
// }

// async function deleteAction(
//   _: ActionResponse | null,
//   formData: FormData
// ): Promise<ActionResponse> {
//   const user: User = await verifySession()
//   const userId = formData.get('id') as string
//   const organizationId = formData.get('organizationId') as string

//   if (!hasPermission(user, 'users', 'delete')) {
//     return {
//       success: false,
//       message: 'Unauthorized to remove'
//     }
//   }

//   try {
//     await db
//       .delete(userOrganizations)
//       .where(
//         and(
//           eq(userOrganizations.userId, userId),
//           eq(userOrganizations.organizationId, organizationId)
//         )
//       )

//     const remainingOrgs = await db.query.userOrganizations.findMany({
//       where: eq(userOrganizations.userId, userId)
//     })

//     if (remainingOrgs.length === 0) {
//       await db.delete(users).where(eq(users.id, userId))
//     }

//     revalidatePath(`/organizations/${organizationId}/users`)

//     return {
//       success: true,
//       message: 'User removed successfully',
//       redirect: `/organizations/${organizationId}/users`
//     }
//   } catch (error) {
//     console.error('Error removing user:', error)
//     return {
//       success: false,
//       message: 'An unexpected error occurred. Please try again.'
//     }
//   }
// }

// export { createAction, updateAction, deleteAction }

// @note

// 'use server'

// import { revalidatePath } from 'next/cache'
// import { eq, and } from 'drizzle-orm'
// import * as z from 'zod'
// import { db } from '@/db'
// import {
//   users,
//   userOrganizations,
//   invitations,
//   organizations
// } from '@/db/schema'
// import { Action, type ActionResponse } from '@/types/forms'
// import { verifySession } from '@/lib/dal'
// import { hasPermission, type User } from '@/lib/abac'
// import { Resend } from 'resend'
// import InviteEmail from '@/emails/invite-email'
// import crypto from 'crypto'

// const resend = new Resend(process.env.AUTH_RESEND_KEY)

// const schema = z.object({
//   organizationId: z.string().min(1, 'Required'),
//   email: z.string().email('Invalid'),
//   role: z.enum(['user', 'admin', 'owner'])
// })

// const { FormData } = Action(schema)

// async function createAction(
//   _: ActionResponse | null,
//   formData: FormData
// ): Promise<ActionResponse> {
//   const currentUser = await verifySession()

//   if (!hasPermission(currentUser, 'users', 'create')) {
//     return {
//       success: false,
//       message: 'Unauthorized to create'
//     }
//   }

//   const rawData = {
//     organizationId: formData.get('organizationId') as string,
//     email: formData.get('email') as string,
//     role: formData.get('role') as 'user' | 'admin' | 'owner'
//   }

//   const validatedData = schema.safeParse(rawData)

//   if (!validatedData.success) {
//     const errors = validatedData.error.flatten().fieldErrors
//     return {
//       success: false,
//       message: 'Please fix the errors in the form',
//       errors,
//       inputs: rawData
//     }
//   }

//   try {
//     const existingUser = await db.query.users.findFirst({
//       where: eq(users.email, validatedData.data.email)
//     })

//     if (existingUser) {
//       await db.insert(userOrganizations).values({
//         userId: existingUser.id,
//         organizationId: validatedData.data.organizationId,
//         role: validatedData.data.role
//       })
//     } else {
//       const [newUser] = await db
//         .insert(users)
//         .values({
//           email: validatedData.data.email,
//           role: validatedData.data.role,
//           status: 'pending'
//         })
//         .returning()

//       const token = crypto.randomUUID()
//       const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now

//       await db.insert(invitations).values({
//         email: validatedData.data.email,
//         role: validatedData.data.role,
//         organizationId: validatedData.data.organizationId,
//         userId: newUser.id,
//         token,
//         expiresAt
//       })

//       const organization = await db.query.organizations.findFirst({
//         where: eq(organizations.id, validatedData.data.organizationId),
//         columns: { name: true }
//       })

//       const url = `/invite?token=${token}`

//       await resend.emails.send({
//         from: process.env.AUTH_RESEND_EMAIL!,
//         to: validatedData.data.email,
//         subject: `Invitation to join ${organization?.name || 'our platform'}`,
//         react: InviteEmail({ url })
//       })
//     }

//     revalidatePath(`/organizations/${rawData.organizationId}/users`)

//     return {
//       success: true,
//       message: 'User invited successfully',
//       redirect: `/organizations/${rawData.organizationId}/users`
//     }
//   } catch (error) {
//     console.error('Error inviting user:', error)
//     return {
//       success: false,
//       message: 'An unexpected error occurred. Please try again.',
//       inputs: rawData
//     }
//   }
// }

// async function updateAction(
//   _: ActionResponse | null,
//   formData: FormData
// ): Promise<ActionResponse> {
//   const currentUser: User = await verifySession()
//   const organizationId = formData.get('organizationId') as string
//   const userId = formData.get('userId') as string
//   const role = formData.get('role') as 'user' | 'admin' | 'owner'

//   if (!hasPermission(currentUser, 'users', 'update')) {
//     return {
//       success: false,
//       message: 'Unauthorized to update'
//     }
//   }

//   try {
//     await db
//       .update(userOrganizations)
//       .set({ role, updatedAt: new Date() })
//       .where(
//         and(
//           eq(userOrganizations.userId, userId),
//           eq(userOrganizations.organizationId, organizationId)
//         )
//       )

//     revalidatePath(`/organizations/${organizationId}/users`)

//     return {
//       success: true,
//       message: 'User updated successfully',
//       redirect: `/organizations/${organizationId}/users`
//     }
//   } catch (error) {
//     console.error('Error updating user:', error)
//     return {
//       success: false,
//       message: 'An unexpected error occurred. Please try again.'
//     }
//   }
// }

// async function deleteAction(
//   _: ActionResponse | null,
//   formData: FormData
// ): Promise<ActionResponse> {
//   const currentUser: User = await verifySession()
//   const userId = formData.get('id') as string
//   const organizationId = formData.get('organizationId') as string

//   if (!hasPermission(currentUser, 'users', 'delete')) {
//     return {
//       success: false,
//       message: 'Unauthorized to remove'
//     }
//   }

//   try {
//     await db
//       .delete(userOrganizations)
//       .where(
//         and(
//           eq(userOrganizations.userId, userId),
//           eq(userOrganizations.organizationId, organizationId)
//         )
//       )

//     const remainingOrgs = await db.query.userOrganizations.findMany({
//       where: eq(userOrganizations.userId, userId)
//     })

//     if (remainingOrgs.length === 0) {
//       await db.delete(users).where(eq(users.id, userId))
//     }

//     revalidatePath(`/organizations/${organizationId}/users`)

//     return {
//       success: true,
//       message: 'User removed successfully',
//       redirect: `/organizations/${organizationId}/users`
//     }
//   } catch (error) {
//     console.error('Error removing user:', error)
//     return {
//       success: false,
//       message: 'An unexpected error occurred. Please try again.'
//     }
//   }
// }

// export { createAction, updateAction, deleteAction }
