'use server'

import { revalidatePath } from 'next/cache'
import { eq, and } from 'drizzle-orm'
import * as z from 'zod'
import { db } from '@/db'
import { users, userOrganizations, invitations } from '@/db/schema'
import { Action, type ActionResponse } from '@/types/forms'
import { verifySession } from '@/lib/dal'
import { hasPermission, type User } from '@/lib/abac'
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
      console.log('Existing user organization details:', existingUserOrg)

      if (existingUserOrg) {
        // User is already in this organization
        return {
          success: false,
          message: 'User is already a member of this organization',
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

    revalidatePath(`/organizations/${organizationId}`)

    return {
      success: true,
      message: 'User updated successfully',
      redirect: `/organizations/${organizationId}`
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

// @note before

// 'use server'

// import { revalidatePath } from 'next/cache'
// import { eq, and } from 'drizzle-orm'
// import * as z from 'zod'
// import { db } from '@/db'
// import { users, userOrganizations, invitations } from '@/db/schema'
// import { Action, type ActionResponse } from '@/types/forms'
// import { verifySession } from '@/lib/dal'
// import { hasPermission, type User } from '@/lib/abac'
// import { signIn } from '@/lib/auth'

// const schema = z.object({
//   organizationId: z
//     .string({
//       required_error: 'Organization ID is required',
//       invalid_type_error: 'Organization ID must be a string'
//     })
//     .min(1, 'Organization ID cannot be empty'),
//   name: z.string().optional().nullable(),
//   email: z
//     .string({
//       required_error: 'Email is required',
//       invalid_type_error: 'Email must be a string'
//     })
//     .email('Invalid email format'),
//   role: z.enum(['user', 'admin', 'owner'], {
//     required_error: 'Role is required',
//     invalid_type_error: 'Invalid role selection'
//   })
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
//       message: 'Unauthorized to create users'
//     }
//   }

//   const rawData = {
//     organizationId: formData.get('organizationId') as string,
//     name: (formData.get('name') as string) || null,
//     email: formData.get('email') as string,
//     role: formData.get('role') as 'user' | 'admin' | 'owner'
//   }

//   // Validate role based on current user's permissions
//   if (
//     (rawData.role === 'owner' && currentUser.role !== 'owner') ||
//     (rawData.role === 'admin' && currentUser.role === 'user')
//   ) {
//     return {
//       success: false,
//       message: 'Unauthorized to create user with this role'
//     }
//   }

//   const validatedData = schema.safeParse(rawData)

//   if (!validatedData.success) {
//     const errors = validatedData.error.flatten().fieldErrors
//     console.log('Validation failed:', {
//       rawData,
//       errors
//     })
//     return {
//       success: false,
//       message:
//         'Validation failed: ' +
//         Object.entries(errors)
//           .map(([key, value]) => `${key}: ${value}`)
//           .join(', '),
//       errors,
//       inputs: rawData
//     }
//   }

//   try {
//     // Check if user already exists
//     const existingUser = await db.query.users.findFirst({
//       where: eq(users.email, validatedData.data.email)
//     })

//     let userId: string

//     if (existingUser) {
//       userId = existingUser.id
//       // If user exists, just add them to the organization
//       const existingUserOrg = await db.query.userOrganizations.findFirst({
//         where: fields =>
//           eq(fields.userId, existingUser.id) &&
//           eq(fields.organizationId, validatedData.data.organizationId)
//       })

//       if (!existingUserOrg) {
//         await db.insert(userOrganizations).values({
//           userId: existingUser.id,
//           organizationId: validatedData.data.organizationId,
//           role: validatedData.data.role
//         })
//       }
//     } else {
//       // Create new user
//       const [newUser] = await db
//         .insert(users)
//         .values({
//           name: validatedData.data.name,
//           email: validatedData.data.email,
//           role: validatedData.data.role,
//           status: 'pending',
//           updatedAt: new Date()
//         })
//         .returning()

//       userId = newUser.id

//       // Add user to organization
//       await db.insert(userOrganizations).values({
//         userId: newUser.id,
//         organizationId: validatedData.data.organizationId,
//         role: validatedData.data.role
//       })
//     }

//     // Create invitation record - THIS WAS MISSING
//     await db.insert(invitations).values({
//       userId: currentUser.id, // This is the inviter
//       organizationId: validatedData.data.organizationId,
//       email: validatedData.data.email,
//       token: crypto.randomUUID(),
//       expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
//       role: validatedData.data.role
//     })

//     // Use NextAuth's built-in email provider to send the verification/login email
//     await signIn('resend', {
//       email: validatedData.data.email,
//       redirect: false,
//       redirectTo: `/organizations/${validatedData.data.organizationId}`
//     })

//     revalidatePath(`/organizations/${rawData.organizationId}/users`)

//     return {
//       success: true,
//       message: 'User invited successfully',
//       redirect: `/organizations/${rawData.organizationId}/users`
//     }
//   } catch (error) {
//     console.error('Error details:', {
//       error,
//       rawData,
//       validatedData: validatedData.data
//     })
//     return {
//       success: false,
//       message:
//         error instanceof Error
//           ? error.message
//           : 'An unexpected error occurred. Please try again.',
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
//   const userId = formData.get('id') as string
//   const name = formData.get('name') as string
//   const email = formData.get('email') as string
//   const role = formData.get('role') as 'user' | 'admin' | 'owner'

//   if (!hasPermission(currentUser, 'users', 'update')) {
//     return {
//       success: false,
//       message: 'Unauthorized to update users'
//     }
//   }

//   // Check if the current user has permission to change to this role
//   if (
//     (role === 'owner' && currentUser.role !== 'owner') ||
//     (role === 'admin' && currentUser.role === 'user')
//   ) {
//     return {
//       success: false,
//       message: 'Unauthorized to change user to this role'
//     }
//   }

//   try {
//     await db
//       .update(users)
//       .set({
//         name,
//         email,
//         updatedAt: new Date()
//       })
//       .where(eq(users.id, userId))

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
//   const currentUser: User = await verifySession()
//   const userId = formData.get('id') as string
//   const organizationId = formData.get('organizationId') as string

//   if (!hasPermission(currentUser, 'users', 'delete')) {
//     return {
//       success: false,
//       message: 'Unauthorized to remove users'
//     }
//   }

//   try {
//     const userToDelete = await db.query.userOrganizations.findFirst({
//       where: and(
//         eq(userOrganizations.userId, userId),
//         eq(userOrganizations.organizationId, organizationId)
//       ),
//       with: {
//         user: true
//       }
//     })

//     if (!userToDelete) {
//       return {
//         success: false,
//         message: 'User not found in this organization'
//       }
//     }

//     // Check if current user has permission to delete this user
//     if (
//       currentUser.role !== 'owner' &&
//       (userToDelete.user.role === 'owner' || userToDelete.user.role === 'admin')
//     ) {
//       return {
//         success: false,
//         message: 'Unauthorized to remove users with higher roles'
//       }
//     }

//     await db
//       .delete(userOrganizations)
//       .where(
//         and(
//           eq(userOrganizations.userId, userId),
//           eq(userOrganizations.organizationId, organizationId)
//         )
//       )

//     // Check if the user is part of any other organizations
//     const remainingOrgs = await db.query.userOrganizations.findMany({
//       where: eq(userOrganizations.userId, userId)
//     })

//     if (remainingOrgs.length === 0) {
//       // If not part of any organization, delete the user entirely
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
// import { users, userOrganizations, organizations } from '@/db/schema'
// import { Action, type ActionResponse } from '@/types/forms'
// import { verifySession } from '@/lib/dal'
// import { hasPermission, type User } from '@/lib/abac'
// import { Resend } from 'resend'
// import InviteEmail from '@/emails/invite-email'

// const resend = new Resend(process.env.AUTH_RESEND_KEY)

// const schema = z.object({
//   organizationId: z.string().min(1, 'Required'),
//   name: z.string().optional(),
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
//       message: 'Unauthorized to create users'
//     }
//   }

//   const rawData = {
//     organizationId: formData.get('organizationId') as string,
//     name: (formData.get('name') as string) || null,
//     email: formData.get('email') as string,
//     role: formData.get('role') as 'user' | 'admin' | 'owner'
//   }

//   // Validate role based on current user's permissions
//   if (
//     (rawData.role === 'owner' && currentUser.role !== 'owner') ||
//     (rawData.role === 'admin' && currentUser.role === 'user')
//   ) {
//     return {
//       success: false,
//       message: 'Unauthorized to create user with this role'
//     }
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
//     // Check if user already exists
//     const existingUser = await db.query.users.findFirst({
//       where: eq(users.email, validatedData.data.email)
//     })

//     if (existingUser) {
//       // If user exists, just add them to the organization
//       await db.insert(userOrganizations).values({
//         userId: existingUser.id,
//         organizationId: validatedData.data.organizationId,
//         role: validatedData.data.role
//       })

//       // Send login email since user already exists
//       const organization = await db.query.organizations.findFirst({
//         where: eq(organizations.id, validatedData.data.organizationId),
//         columns: { name: true }
//       })
//       await resend.emails.send({
//         from: process.env.AUTH_RESEND_EMAIL!,
//         to: validatedData.data.email,
//         subject: `Invitation to join ${organization?.name || 'our organization'}`,
//         react: InviteEmail({
//           url: `/api/auth/signin/resend?email=${encodeURIComponent(validatedData.data.email)}`
//         })
//       })
//     } else {
//       // Create new user
//       const [newUser] = await db
//         .insert(users)
//         .values({
//           name: validatedData.data.name,
//           email: validatedData.data.email,
//           role: validatedData.data.role,
//           status: 'pending'
//         })
//         .returning()

//       // Add user to organization
//       await db.insert(userOrganizations).values({
//         userId: newUser.id,
//         organizationId: validatedData.data.organizationId,
//         role: validatedData.data.role
//       })

//       // Send invite email for new user
//       const organization = await db.query.organizations.findFirst({
//         where: eq(organizations.id, validatedData.data.organizationId),
//         columns: { name: true }
//       })
//       await resend.emails.send({
//         from: process.env.AUTH_RESEND_EMAIL!,
//         to: validatedData.data.email,
//         subject: `Invitation to join ${organization?.name || 'our organization'}`,
//         react: InviteEmail({
//           url: `/api/auth/signin/resend?email=${encodeURIComponent(validatedData.data.email)}`
//         })
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
//   const userId = formData.get('id') as string
//   const name = formData.get('name') as string
//   const email = formData.get('email') as string
//   const role = formData.get('role') as 'user' | 'admin' | 'owner'

//   if (!hasPermission(currentUser, 'users', 'update')) {
//     return {
//       success: false,
//       message: 'Unauthorized to update users'
//     }
//   }

//   // Check if the current user has permission to change to this role
//   if (
//     (role === 'owner' && currentUser.role !== 'owner') ||
//     (role === 'admin' && currentUser.role === 'user')
//   ) {
//     return {
//       success: false,
//       message: 'Unauthorized to change user to this role'
//     }
//   }

//   try {
//     await db
//       .update(users)
//       .set({
//         name,
//         email,
//         updatedAt: new Date()
//       })
//       .where(eq(users.id, userId))

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
//   const currentUser: User = await verifySession()
//   const userId = formData.get('id') as string
//   const organizationId = formData.get('organizationId') as string

//   if (!hasPermission(currentUser, 'users', 'delete')) {
//     return {
//       success: false,
//       message: 'Unauthorized to remove users'
//     }
//   }

//   try {
//     const userToDelete = await db.query.userOrganizations.findFirst({
//       where: and(
//         eq(userOrganizations.userId, userId),
//         eq(userOrganizations.organizationId, organizationId)
//       ),
//       with: {
//         user: true
//       }
//     })

//     if (!userToDelete) {
//       return {
//         success: false,
//         message: 'User not found in this organization'
//       }
//     }

//     // Check if current user has permission to delete this user
//     if (
//       currentUser.role !== 'owner' &&
//       (userToDelete.user.role === 'owner' || userToDelete.user.role === 'admin')
//     ) {
//       return {
//         success: false,
//         message: 'Unauthorized to remove users with higher roles'
//       }
//     }

//     await db
//       .delete(userOrganizations)
//       .where(
//         and(
//           eq(userOrganizations.userId, userId),
//           eq(userOrganizations.organizationId, organizationId)
//         )
//       )

//     // Check if the user is part of any other organizations
//     const remainingOrgs = await db.query.userOrganizations.findMany({
//       where: eq(userOrganizations.userId, userId)
//     })

//     if (remainingOrgs.length === 0) {
//       // If not part of any organization, delete the user entirely
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
