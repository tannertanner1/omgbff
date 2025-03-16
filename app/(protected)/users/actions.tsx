'use server'

import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
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

    let userId: string

    if (existingUser) {
      userId = existingUser.id

      // Add to organization if not already a member
      const existingUserOrg = await db.query.userOrganizations.findFirst({
        where: fields =>
          eq(fields.userId, existingUser.id) &&
          eq(fields.organizationId, validatedData.data.organizationId)
      })

      if (!existingUserOrg) {
        await db.insert(userOrganizations).values({
          userId: existingUser.id,
          organizationId: validatedData.data.organizationId,
          role: validatedData.data.role
        })
      } else {
        // User is already in this organization
        return {
          success: false,
          message: 'User is already a member of this organization',
          inputs: rawData
        }
      }
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

      userId = newUser.id

      // Add user to organization
      await db.insert(userOrganizations).values({
        userId: newUser.id,
        organizationId: validatedData.data.organizationId,
        role: validatedData.data.role
      })
    }

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

    // Use NextAuth's built-in email provider to send the verification/login email
    // for both new and existing users
    await signIn('resend', {
      email: validatedData.data.email,
      redirect: false,
      redirectTo: `/organizations/${validatedData.data.organizationId}`
    })

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

// @note before

// 'use server'

// import { revalidatePath } from 'next/cache'
// import { eq } from 'drizzle-orm'
// import * as z from 'zod'
// import { db } from '@/db'
// import { users, userOrganizations, customers, invitations } from '@/db/schema'
// import { Action, type ActionResponse } from '@/types/forms'
// import { verifySession } from '@/lib/dal'
// import { hasPermission } from '@/lib/abac'
// import { ROLES } from '@/data/system-roles'
// import { signIn } from '@/lib/auth'

// const schema = z.object({
//   name: z.string().optional().nullable(),
//   email: z.string().email('Required'),
//   role: z.enum(ROLES),
//   organizationId: z.string().min(1, 'Required')
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

//     let userId: string

//     if (existingUser) {
//       userId = existingUser.id
//       // Add to organization if not already a member
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

//     // Create invitation record
//     await db.insert(invitations).values({
//       userId: currentUser.id, // This is the inviter
//       organizationId: validatedData.data.organizationId,
//       email: validatedData.data.email,
//       token: crypto.randomUUID(),
//       expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
//       role: validatedData.data.role
//     })

//     // Use NextAuth's built-in email provider to send the verification/login email
//     // Pass the current user's email as the inviter
//     await signIn('resend', {
//       email: validatedData.data.email,
//       redirect: false,
//       redirectTo: `/organizations/${validatedData.data.organizationId}`
//     })

//     revalidatePath('/users')
//     return {
//       success: true,
//       message: 'User invited successfully',
//       redirect: '/users'
//     }
//   } catch (error) {
//     console.error('Error creating/inviting user:', error)
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

// @note YE

// 'use server'

// import { revalidatePath } from 'next/cache'
// import { eq } from 'drizzle-orm'
// import * as z from 'zod'
// import { db } from '@/db'
// import { users, userOrganizations, customers, organizations } from '@/db/schema'
// import { Action, type ActionResponse } from '@/types/forms'
// import { verifySession } from '@/lib/dal'
// import { hasPermission } from '@/lib/abac'
// import { ROLES } from '@/data/system-roles'
// import { signIn } from '@/lib/auth'

// const schema = z.object({
//   name: z.string().optional().nullable(),
//   email: z.string().email('Required'),
//   role: z.enum(ROLES),
//   organizationId: z.string().min(1, 'Required')
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
//       // If user exists, just add them to the organization if not already a member
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

//       // Add user to organization
//       await db.insert(userOrganizations).values({
//         userId: newUser.id,
//         organizationId: validatedData.data.organizationId,
//         role: validatedData.data.role
//       })
//     }

//     // Get organization name for email
//     const organization = await db.query.organizations.findFirst({
//       where: eq(organizations.id, validatedData.data.organizationId),
//       columns: { name: true }
//     })

//     // Use NextAuth's built-in email provider to send the verification/login email
//     const host =
//       process.env.NODE_ENV === 'development'
//         ? 'localhost:3000'
//         : 'omgbff.vercel.app'
//     const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'

//     // Let NextAuth handle the token creation and verification
//     // Use redirectTo to specify where the user should go after authentication
//     await signIn('resend', {
//       email: validatedData.data.email,
//       redirect: false,
//       redirectTo: `/organizations/${validatedData.data.organizationId}`
//     })

//     revalidatePath('/users')
//     return {
//       success: true,
//       message: 'User invited successfully',
//       redirect: '/users'
//     }
//   } catch (error) {
//     console.error('Error creating/inviting user:', error)
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

// @note email auth hell

// 'use server'

// import { revalidatePath } from 'next/cache'
// import { eq } from 'drizzle-orm'
// import * as z from 'zod'
// import { db } from '@/db'
// import { users, userOrganizations, customers, organizations } from '@/db/schema'
// import { Action, type ActionResponse } from '@/types/forms'
// import { verifySession } from '@/lib/dal'
// import { hasPermission } from '@/lib/abac'
// import { ROLES } from '@/data/system-roles'
// import { Resend } from 'resend'
// import InviteEmail from '@/emails/invite-email'

// const resend = new Resend(process.env.AUTH_RESEND_KEY)

// const schema = z.object({
//   name: z.string().optional().nullable(),
//   email: z.string().email('Required'),
//   role: z.enum(ROLES),
//   organizationId: z.string().min(1, 'Required')
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

//       // Update user status to active if it was pending
//       if (existingUser.status === 'pending') {
//         await db
//           .update(users)
//           .set({ status: 'active', updatedAt: new Date() })
//           .where(eq(users.id, existingUser.id))
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

//       // Add user to organization
//       await db.insert(userOrganizations).values({
//         userId: newUser.id,
//         organizationId: validatedData.data.organizationId,
//         role: validatedData.data.role
//       })

//       // Get organization name for email
//       const organization = await db.query.organizations.findFirst({
//         where: eq(organizations.id, validatedData.data.organizationId),
//         columns: { name: true }
//       })

//       // Create a special login URL with redirectTo parameter
//       const host =
//         process.env.NODE_ENV === 'development'
//           ? 'localhost:3000'
//           : 'omgbff.vercel.app'
//       const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'

//       // Include the redirectTo parameter to go directly to the organization page
//       const redirectTo = encodeURIComponent(
//         `/organizations/${validatedData.data.organizationId}`
//       )
//       const url = `${protocol}://${host}/login?redirectTo=${redirectTo}`

//       await resend.emails.send({
//         from: process.env.AUTH_RESEND_EMAIL!,
//         to: validatedData.data.email,
//         subject: `Invitation to join ${organization?.name || 'our organization'}`,
//         react: InviteEmail({ url })
//       })
//     }

//     revalidatePath('/users')
//     return {
//       success: true,
//       message: 'User invited successfully',
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
