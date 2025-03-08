'use server'

import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import * as z from 'zod'
import { db } from '@/db'
import {
  users,
  userOrganizations,
  customers,
  invitations,
  organizations
} from '@/db/schema'
import { Action, type ActionResponse } from '@/types/forms'
import { verifySession } from '@/lib/dal'
import { hasPermission } from '@/lib/abac'
import { ROLES } from '@/data/system-roles'
import { Resend } from 'resend'
import InviteEmail from '@/emails/invite-email'
import crypto from 'crypto'

const resend = new Resend(process.env.AUTH_RESEND_KEY)

const schema = z.object({
  name: z.string().optional(),
  email: z.string().email('Required'),
  role: z.enum(ROLES),
  organizationId: z.string().min(1, 'Required')
})

const { FormData } = Action(schema)

async function createAction(
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const currentUser = await verifySession()

  // Debug logs
  console.log('Received form data:', {
    name: formData.get('name'),
    email: formData.get('email'),
    role: formData.get('role'),
    organizationId: formData.get('organizationId')
  })

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
    console.log('Validation failed:', errors) // Debug log
    return {
      success: false,
      message: 'Please fix the errors in the form: ' + JSON.stringify(errors),
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
    } else {
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

      // Add user to organization
      await db.insert(userOrganizations).values({
        userId: newUser.id,
        organizationId: validatedData.data.organizationId,
        role: validatedData.data.role
      })

      // Create invitation
      const token = crypto.randomUUID()
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now

      await db.insert(invitations).values({
        token,
        expiresAt,
        organizationId: validatedData.data.organizationId,
        userId: newUser.id,
        email: validatedData.data.email,
        role: validatedData.data.role
      })

      // Get organization name for email
      const organization = await db.query.organizations.findFirst({
        where: eq(organizations.id, validatedData.data.organizationId),
        columns: { name: true }
      })

      // Send invitation email
      const url = `/invite?token=${token}`

      await resend.emails.send({
        from: process.env.AUTH_RESEND_EMAIL!,
        to: validatedData.data.email,
        subject: `Invitation to join ${organization?.name || 'our organization'}`,
        react: InviteEmail({ url })
      })
    }

    revalidatePath('/users')
    return {
      success: true,
      message: 'User invited successfully',
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
    name: (formData.get('name') as string) || null,
    email: formData.get('email') as string,
    role: formData.get('role') as (typeof ROLES)[number]
  }

  // Check if the current user has permission to change to this role
  if (
    (rawData.role === 'owner' && currentUser.role !== 'owner') ||
    (rawData.role === 'admin' && currentUser.role === 'user')
  ) {
    return {
      success: false,
      message: 'Unauthorized to change user to this role'
    }
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
        name: validatedData.data.name,
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

// @note missing added create functionality

// 'use server'

// import { revalidatePath } from 'next/cache'
// import { eq } from 'drizzle-orm'
// import * as z from 'zod'
// import { db } from '@/db'
// import { users, userOrganizations, customers } from '@/db/schema'
// import { Action, type ActionResponse } from '@/types/forms'
// import { verifySession } from '@/lib/dal'
// import { hasPermission } from '@/lib/abac'
// import { ROLES } from '@/data/system-roles'

// const schema = z.object({
//   name: z.string().optional(),
//   email: z.string().email('Required'),
//   role: z.enum(ROLES),
//   organizationId: z.string().optional()
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
//     name: (formData.get('name') as string) || null,
//     email: formData.get('email') as string,
//     role: formData.get('role') as (typeof ROLES)[number],
//     organizationId: formData.get('organizationId') as string
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

//   // Ensure 'user' role is associated with an organization
//   if (rawData.role === 'user' && !rawData.organizationId) {
//     return {
//       success: false,
//       message: 'Users with "user" role must be associated with an organization'
//     }
//   }

//   const validatedData = schema.safeParse(rawData)

//   if (!validatedData.success) {
//     return {
//       success: false,
//       message: 'Please fix the errors in the form',
//       errors: validatedData.error.flatten().fieldErrors,
//       inputs: rawData
//     }
//   }

//   try {
//     const [newUser] = await db
//       .insert(users)
//       .values({
//         ...validatedData.data,
//         status: 'pending',
//         updatedAt: new Date()
//       })
//       .returning()

//     if (
//       validatedData.data.role === 'user' &&
//       validatedData.data.organizationId
//     ) {
//       await db.insert(userOrganizations).values({
//         userId: newUser.id,
//         organizationId: validatedData.data.organizationId,
//         role: 'user'
//       })
//     }

//     revalidatePath('/users')
//     return {
//       success: true,
//       message: 'User created successfully',
//       redirect: '/users'
//     }
//   } catch (error) {
//     console.error('Error creating user:', error)
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
//   const currentUser = await verifySession()
//   const id = formData.get('id') as string

//   if (!hasPermission(currentUser, 'users', 'update')) {
//     return {
//       success: false,
//       message: 'Unauthorized to update users'
//     }
//   }

//   const rawData = {
//     id,
//     name: (formData.get('name') as string) || null,
//     email: formData.get('email') as string,
//     role: formData.get('role') as (typeof ROLES)[number]
//   }

//   // Check if the current user has permission to change to this role
//   if (
//     (rawData.role === 'owner' && currentUser.role !== 'owner') ||
//     (rawData.role === 'admin' && currentUser.role === 'user')
//   ) {
//     return {
//       success: false,
//       message: 'Unauthorized to change user to this role'
//     }
//   }

//   const validatedData = schema.extend({ id: z.string() }).safeParse(rawData)

//   if (!validatedData.success) {
//     return {
//       success: false,
//       message: 'Please fix the errors in the form',
//       errors: validatedData.error.flatten().fieldErrors,
//       inputs: rawData
//     }
//   }

//   try {
//     await db
//       .update(users)
//       .set({
//         name: validatedData.data.name,
//         email: validatedData.data.email,
//         role: validatedData.data.role,
//         updatedAt: new Date()
//       })
//       .where(eq(users.id, id))

//     revalidatePath('/users')
//     return {
//       success: true,
//       message: 'User updated successfully',
//       redirect: '/users'
//     }
//   } catch (error) {
//     console.error('Error updating user:', error)
//     return {
//       success: false,
//       message: 'An unexpected error occurred. Please try again.',
//       inputs: rawData
//     }
//   }
// }

// async function deleteAction(
//   _: ActionResponse | null,
//   formData: FormData
// ): Promise<ActionResponse> {
//   const currentUser = await verifySession()
//   const id = formData.get('id') as string

//   try {
//     // Get the user to delete
//     const userToDelete = await db.query.users.findFirst({
//       where: eq(users.id, id)
//     })

//     if (!userToDelete) {
//       return {
//         success: false,
//         message: 'User not found'
//       }
//     }

//     // Apply role-based deletion rules:
//     // 1. Owners can delete anyone except themselves
//     // 2. Admins can delete themselves and users, but not owners or other admins
//     // 3. Users can only delete themselves

//     const isSelfDeletion = currentUser.id === id

//     if (currentUser.role === 'owner') {
//       // Owners can't delete themselves
//       if (isSelfDeletion) {
//         return {
//           success: false,
//           message: 'Owners cannot delete their own account'
//         }
//       }
//       // Otherwise owners can delete anyone
//     } else if (currentUser.role === 'admin') {
//       // Admins can delete themselves
//       if (isSelfDeletion) {
//         // Allow self-deletion
//       }
//       // Admins can't delete owners or other admins
//       else if (userToDelete.role === 'owner' || userToDelete.role === 'admin') {
//         return {
//           success: false,
//           message: 'Admins cannot delete owners or other admins'
//         }
//       }
//       // Admins can delete users
//     } else if (currentUser.role === 'user') {
//       // Users can only delete themselves
//       if (!isSelfDeletion) {
//         return {
//           success: false,
//           message: 'Users can only delete their own account'
//         }
//       }
//     }

//     // Delete in the correct order to handle foreign key constraints
//     // 1. Delete customer records first
//     await db.delete(customers).where(eq(customers.userId, id))

//     // 2. Delete user organization associations
//     await db.delete(userOrganizations).where(eq(userOrganizations.userId, id))

//     // 3. Finally delete the user
//     await db.delete(users).where(eq(users.id, id))

//     revalidatePath('/users')
//     return {
//       success: true,
//       message: 'User deleted successfully'
//     }
//   } catch (error) {
//     console.error('Error deleting user:', error)
//     return {
//       success: false,
//       message: 'An unexpected error occurred while deleting the user'
//     }
//   }
// }

// export { createAction, updateAction, deleteAction }

// @note includes nuanced deletion permission checks

// 'use server'

// import { revalidatePath } from 'next/cache'
// import { eq } from 'drizzle-orm'
// import * as z from 'zod'
// import { db } from '@/db'
// import { users, userOrganizations, customers } from '@/db/schema'
// import { Action, type ActionResponse } from '@/types/forms'
// import { verifySession } from '@/lib/dal'
// import { hasPermission } from '@/lib/abac'
// import { ROLES } from '@/data/system-roles'

// const schema = z.object({
//   name: z.string().optional(),
//   email: z.string().email('Required'),
//   role: z.enum(ROLES),
//   organizationId: z.string().optional()
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
//     name: (formData.get('name') as string) || null,
//     email: formData.get('email') as string,
//     role: formData.get('role') as (typeof ROLES)[number],
//     organizationId: formData.get('organizationId') as string
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

//   // Ensure 'user' role is associated with an organization
//   if (rawData.role === 'user' && !rawData.organizationId) {
//     return {
//       success: false,
//       message: 'Users with "user" role must be associated with an organization'
//     }
//   }

//   const validatedData = schema.safeParse(rawData)

//   if (!validatedData.success) {
//     return {
//       success: false,
//       message: 'Please fix the errors in the form',
//       errors: validatedData.error.flatten().fieldErrors,
//       inputs: rawData
//     }
//   }

//   try {
//     const [newUser] = await db
//       .insert(users)
//       .values({
//         ...validatedData.data,
//         status: 'pending',
//         updatedAt: new Date()
//       })
//       .returning()

//     if (
//       validatedData.data.role === 'user' &&
//       validatedData.data.organizationId
//     ) {
//       await db.insert(userOrganizations).values({
//         userId: newUser.id,
//         organizationId: validatedData.data.organizationId,
//         role: 'user'
//       })
//     }

//     revalidatePath('/users')
//     return {
//       success: true,
//       message: 'User created successfully',
//       redirect: '/users'
//     }
//   } catch (error) {
//     console.error('Error creating user:', error)
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
//   const currentUser = await verifySession()
//   const id = formData.get('id') as string

//   if (!hasPermission(currentUser, 'users', 'update')) {
//     return {
//       success: false,
//       message: 'Unauthorized to update users'
//     }
//   }

//   const rawData = {
//     id,
//     name: (formData.get('name') as string) || null,
//     email: formData.get('email') as string,
//     role: formData.get('role') as (typeof ROLES)[number]
//   }

//   // Check if the current user has permission to change to this role
//   if (
//     (rawData.role === 'owner' && currentUser.role !== 'owner') ||
//     (rawData.role === 'admin' && currentUser.role === 'user')
//   ) {
//     return {
//       success: false,
//       message: 'Unauthorized to change user to this role'
//     }
//   }

//   const validatedData = schema.extend({ id: z.string() }).safeParse(rawData)

//   if (!validatedData.success) {
//     return {
//       success: false,
//       message: 'Please fix the errors in the form',
//       errors: validatedData.error.flatten().fieldErrors,
//       inputs: rawData
//     }
//   }

//   try {
//     await db
//       .update(users)
//       .set({
//         name: validatedData.data.name,
//         email: validatedData.data.email,
//         role: validatedData.data.role,
//         updatedAt: new Date()
//       })
//       .where(eq(users.id, id))

//     revalidatePath('/users')
//     return {
//       success: true,
//       message: 'User updated successfully',
//       redirect: '/users'
//     }
//   } catch (error) {
//     console.error('Error updating user:', error)
//     return {
//       success: false,
//       message: 'An unexpected error occurred. Please try again.',
//       inputs: rawData
//     }
//   }
// }

// async function deleteAction(
//   _: ActionResponse | null,
//   formData: FormData
// ): Promise<ActionResponse> {
//   const currentUser = await verifySession()
//   const id = formData.get('id') as string

//   try {
//     // Get the user to delete
//     const userToDelete = await db.query.users.findFirst({
//       where: eq(users.id, id)
//     })

//     if (!userToDelete) {
//       return {
//         success: false,
//         message: 'User not found'
//       }
//     }

//     // Prevent users from deleting themselves
//     if (currentUser.id === id) {
//       return {
//         success: false,
//         message: 'Cannot delete your own account'
//       }
//     }

//     // Check role-based permissions
//     if (currentUser.role !== 'owner') {
//       return {
//         success: false,
//         message: 'Only owners can delete users'
//       }
//     }

//     // Owners can delete any user except other owners
//     if (userToDelete.role === 'owner') {
//       return {
//         success: false,
//         message: 'Cannot delete other owners'
//       }
//     }

//     // Delete in the correct order to handle foreign key constraints
//     // 1. Delete customer records first
//     await db.delete(customers).where(eq(customers.userId, id))

//     // 2. Delete user organization associations
//     await db.delete(userOrganizations).where(eq(userOrganizations.userId, id))

//     // 3. Finally delete the user
//     await db.delete(users).where(eq(users.id, id))

//     revalidatePath('/users')
//     return {
//       success: true,
//       message: 'User deleted successfully'
//     }
//   } catch (error) {
//     console.error('Error deleting user:', error)
//     return {
//       success: false,
//       message: 'An unexpected error occurred while deleting the user'
//     }
//   }
// }

// export { createAction, updateAction, deleteAction }

// @note foreign key constraint violation

// 'use server'

// import { revalidatePath } from 'next/cache'
// import { eq } from 'drizzle-orm'
// import * as z from 'zod'
// import { db } from '@/db'
// import { users, userOrganizations } from '@/db/schema'
// import { Action, type ActionResponse } from '@/types/forms'
// import { verifySession } from '@/lib/dal'
// import { hasPermission } from '@/lib/abac'
// import { ROLES } from '@/data/system-roles'

// const schema = z.object({
//   name: z.string().optional(),
//   email: z.string().email('Required'),
//   role: z.enum(ROLES),
//   organizationId: z.string().optional()
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
//     name: (formData.get('name') as string) || null,
//     email: formData.get('email') as string,
//     role: formData.get('role') as (typeof ROLES)[number],
//     organizationId: formData.get('organizationId') as string
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

//   // Ensure 'user' role is associated with an organization
//   if (rawData.role === 'user' && !rawData.organizationId) {
//     return {
//       success: false,
//       message: 'Users with "user" role must be associated with an organization'
//     }
//   }

//   const validatedData = schema.safeParse(rawData)

//   if (!validatedData.success) {
//     return {
//       success: false,
//       message: 'Please fix the errors in the form',
//       errors: validatedData.error.flatten().fieldErrors,
//       inputs: rawData
//     }
//   }

//   try {
//     const [newUser] = await db
//       .insert(users)
//       .values({
//         ...validatedData.data,
//         status: 'pending',
//         updatedAt: new Date()
//       })
//       .returning()

//     if (
//       validatedData.data.role === 'user' &&
//       validatedData.data.organizationId
//     ) {
//       await db.insert(userOrganizations).values({
//         userId: newUser.id,
//         organizationId: validatedData.data.organizationId,
//         role: 'user'
//       })
//     }

//     revalidatePath('/users')
//     return {
//       success: true,
//       message: 'User created successfully',
//       redirect: '/users'
//     }
//   } catch (error) {
//     console.error('Error creating user:', error)
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
//   const currentUser = await verifySession()
//   const id = formData.get('id') as string

//   if (!hasPermission(currentUser, 'users', 'update')) {
//     return {
//       success: false,
//       message: 'Unauthorized to update users'
//     }
//   }

//   const rawData = {
//     id,
//     name: (formData.get('name') as string) || null,
//     email: formData.get('email') as string,
//     role: formData.get('role') as (typeof ROLES)[number]
//   }

//   // Check if the current user has permission to change to this role
//   if (
//     (rawData.role === 'owner' && currentUser.role !== 'owner') ||
//     (rawData.role === 'admin' && currentUser.role === 'user')
//   ) {
//     return {
//       success: false,
//       message: 'Unauthorized to change user to this role'
//     }
//   }

//   const validatedData = schema.extend({ id: z.string() }).safeParse(rawData)

//   if (!validatedData.success) {
//     return {
//       success: false,
//       message: 'Please fix the errors in the form',
//       errors: validatedData.error.flatten().fieldErrors,
//       inputs: rawData
//     }
//   }

//   try {
//     await db
//       .update(users)
//       .set({
//         name: validatedData.data.name,
//         email: validatedData.data.email,
//         role: validatedData.data.role,
//         updatedAt: new Date()
//       })
//       .where(eq(users.id, id))

//     revalidatePath('/users')
//     return {
//       success: true,
//       message: 'User updated successfully',
//       redirect: '/users'
//     }
//   } catch (error) {
//     console.error('Error updating user:', error)
//     return {
//       success: false,
//       message: 'An unexpected error occurred. Please try again.',
//       inputs: rawData
//     }
//   }
// }

// async function deleteAction(
//   _: ActionResponse | null,
//   formData: FormData
// ): Promise<ActionResponse> {
//   const currentUser = await verifySession()
//   const id = formData.get('id') as string

//   try {
//     // Get the user to delete
//     const userToDelete = await db.query.users.findFirst({
//       where: eq(users.id, id)
//     })

//     if (!userToDelete) {
//       return {
//         success: false,
//         message: 'User not found'
//       }
//     }

//     // Prevent users from deleting themselves
//     if (currentUser.id === id) {
//       return {
//         success: false,
//         message: 'Cannot delete your own account'
//       }
//     }

//     // Check role-based permissions
//     if (currentUser.role !== 'owner') {
//       return {
//         success: false,
//         message: 'Only owners can delete users'
//       }
//     }

//     // Owners can delete any user except other owners
//     if (userToDelete.role === 'owner') {
//       return {
//         success: false,
//         message: 'Cannot delete other owners'
//       }
//     }

//     // Delete user's organization associations first
//     await db.delete(userOrganizations).where(eq(userOrganizations.userId, id))

//     // Then delete the user
//     await db.delete(users).where(eq(users.id, id))

//     revalidatePath('/users')
//     return {
//       success: true,
//       message: 'User deleted successfully'
//     }
//   } catch (error) {
//     console.error('Error deleting user:', error)
//     return {
//       success: false,
//       message: 'An unexpected error occurred while deleting the user'
//     }
//   }
// }

// export { createAction, updateAction, deleteAction }
