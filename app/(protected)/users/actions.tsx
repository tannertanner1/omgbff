'use server'

import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import * as z from 'zod'
import { db } from '@/db'
import { users, userOrganizations } from '@/db/schema'
import { Action, type ActionResponse } from '@/types/forms'
import { verifySession } from '@/lib/dal'
import { hasPermission } from '@/lib/abac'
import { ROLES } from '@/data/system-roles'

const schema = z.object({
  name: z.string().optional(),
  email: z.string().email('Required'),
  role: z.enum(ROLES),
  organizationId: z.string().optional()
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

  // Ensure 'user' role is associated with an organization
  if (rawData.role === 'user' && !rawData.organizationId) {
    return {
      success: false,
      message: 'Users with "user" role must be associated with an organization'
    }
  }

  const validatedData = schema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      message: 'Please fix the errors in the form',
      errors: validatedData.error.flatten().fieldErrors,
      inputs: rawData
    }
  }

  try {
    const [newUser] = await db
      .insert(users)
      .values({
        ...validatedData.data,
        status: 'pending',
        updatedAt: new Date()
      })
      .returning()

    if (
      validatedData.data.role === 'user' &&
      validatedData.data.organizationId
    ) {
      await db.insert(userOrganizations).values({
        userId: newUser.id,
        organizationId: validatedData.data.organizationId,
        role: 'user'
      })
    }

    revalidatePath('/users')
    return {
      success: true,
      message: 'User created successfully',
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

  // Basic permission check
  if (!hasPermission(currentUser, 'users', 'delete')) {
    return {
      success: false,
      message: 'Unauthorized to delete users'
    }
  }

  try {
    // Get the user to delete with their organizations
    const userToDelete = await db.query.users.findFirst({
      where: eq(users.id, id),
      with: {
        userOrganizations: {
          with: {
            organization: true
          }
        }
      }
    })

    if (!userToDelete) {
      return {
        success: false,
        message: 'User not found'
      }
    }

    // Prevent users from deleting themselves
    if (currentUser.id === id) {
      return {
        success: false,
        message: 'Cannot delete your own account'
      }
    }

    // Get current user's organizations if they have 'user' role
    let currentUserOrgs: string[] = []
    if (currentUser.role === 'user') {
      const orgs = await db.query.userOrganizations.findMany({
        where: eq(userOrganizations.userId, currentUser.id),
        columns: {
          organizationId: true
        }
      })
      currentUserOrgs = orgs.map(org => org.organizationId)
    }

    // Role-based deletion rules
    if (currentUser.role === 'owner') {
      // Owners can't delete other owners
      if (userToDelete.role === 'owner') {
        return {
          success: false,
          message: 'Cannot delete other owners'
        }
      }
    } else if (currentUser.role === 'admin') {
      // Admins can only delete users with 'user' role
      if (userToDelete.role !== 'user') {
        return {
          success: false,
          message: 'Admins can only delete users with User role'
        }
      }
    } else if (currentUser.role === 'user') {
      // Users can only delete other users in shared organizations
      if (userToDelete.role !== 'user') {
        return {
          success: false,
          message: 'Users can only delete other users'
        }
      }

      // Check if they share any organizations
      const sharedOrgs = userToDelete.userOrganizations.filter(uo =>
        currentUserOrgs.includes(uo.organizationId)
      )

      if (sharedOrgs.length === 0) {
        return {
          success: false,
          message: 'Can only delete users in shared organizations'
        }
      }
    }

    // If all checks pass, delete the user
    await db.delete(userOrganizations).where(eq(userOrganizations.userId, id))
    await db.delete(users).where(eq(users.id, id))

    revalidatePath('/users')
    return {
      success: true,
      message: 'User deleted successfully',
      redirect: '/users'
    }
  } catch (error) {
    console.error('Error deleting user:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.'
    }
  }
}

// async function deleteAction(
//   _: ActionResponse | null,
//   formData: FormData
// ): Promise<ActionResponse> {
//   const currentUser = await verifySession()
//   const id = formData.get('id') as string

//   // Basic permission check
//   if (!hasPermission(currentUser, 'users', 'delete')) {
//     return {
//       success: false,
//       message: 'Unauthorized to delete users'
//     }
//   }

//   try {
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

//     // Simplified role-based deletion rules:
//     // 1. Owners can delete anyone except themselves
//     // 2. Admins can delete users but not owners or other admins
//     // 3. Users cannot delete anyone
//     if (currentUser.role === 'owner') {
//       // Owners can delete anyone except themselves (already checked above)
//       await db.delete(userOrganizations).where(eq(userOrganizations.userId, id))
//       await db.delete(users).where(eq(users.id, id))
//     } else if (currentUser.role === 'admin' && userToDelete.role === 'user') {
//       // Admins can only delete users
//       await db.delete(userOrganizations).where(eq(userOrganizations.userId, id))
//       await db.delete(users).where(eq(users.id, id))
//     } else {
//       return {
//         success: false,
//         message: 'Unauthorized to delete this user'
//       }
//     }

//     revalidatePath('/users')
//     return {
//       success: true,
//       message: 'User deleted successfully',
//       redirect: '/users'
//     }
//   } catch (error) {
//     console.error('Error deleting user:', error)
//     return {
//       success: false,
//       message: 'An unexpected error occurred. Please try again.'
//     }
//   }
// }

export { createAction, updateAction, deleteAction }

// @note

// 'use server'

// import { revalidatePath } from 'next/cache'
// import { eq } from 'drizzle-orm'
// import * as z from 'zod'
// import { db } from '@/db'
// import { users } from '@/db/schema'
// import { Action, type ActionResponse } from '@/types/forms'
// import { verifySession } from '@/lib/dal'
// import { hasPermission } from '@/lib/abac'
// import { ROLES } from '@/data/system-roles'

// const schema = z.object({
//   name: z.string().optional(),
//   email: z.string().email('Required'),
//   role: z.enum(ROLES)
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
//     name: (formData.get('name') as string) || null,
//     email: formData.get('email') as string,
//     role: formData.get('role') as (typeof ROLES)[number]
//   }

//   // Validate role based on current user's permissions
//   if (rawData.role === 'owner' && user.role !== 'owner') {
//     rawData.role = 'admin' // Downgrade to admin if not owner
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
//         status: 'pending', // Always set to pending
//         updatedAt: new Date()
//       })
//       .returning()

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
//   const user = await verifySession()
//   const id = formData.get('id') as string

//   if (!hasPermission(user, 'users', 'update')) {
//     return {
//       success: false,
//       message: 'Unauthorized to update'
//     }
//   }

//   const rawData = {
//     id,
//     name: (formData.get('name') as string) || null,
//     email: formData.get('email') as string,
//     role: formData.get('role') as (typeof ROLES)[number]
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

//   // First check basic delete permission
//   if (!hasPermission(currentUser, 'users', 'delete')) {
//     return {
//       success: false,
//       message: 'Unauthorized to delete users'
//     }
//   }

//   try {
//     // Get the user to be deleted
//     const userToDelete = await db.query.users.findFirst({
//       where: (users, { eq }) => eq(users.id, id)
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

//     // Only owners can delete other users
//     // Users cannot delete owners or admins
//     if (
//       currentUser.role !== 'owner' &&
//       (userToDelete.role === 'owner' || userToDelete.role === 'admin')
//     ) {
//       return {
//         success: false,
//         message: 'Unauthorized to delete users with higher roles'
//       }
//     }

//     await db.delete(users).where(eq(users.id, id))

//     revalidatePath('/users')
//     return {
//       success: true,
//       message: 'User deleted successfully',
//       redirect: '/users'
//     }
//   } catch (error) {
//     console.error('Error deleting user:', error)
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
// import { eq } from 'drizzle-orm'
// import * as z from 'zod'
// import { db } from '@/db'
// import { users } from '@/db/schema'
// import { Action, type ActionResponse } from '@/types/forms'
// import { verifySession } from '@/lib/dal'
// import { hasPermission } from '@/lib/abac'
// import { ROLES } from '@/data/system-roles'

// const schema = z.object({
//   name: z.string().optional(),
//   email: z.string().email('Required'),
//   role: z.enum(ROLES)
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
//     name: (formData.get('name') as string) || null,
//     email: formData.get('email') as string,
//     role: formData.get('role') as (typeof ROLES)[number]
//   }

//   // Validate role based on current user's permissions
//   if (rawData.role === 'owner' && user.role !== 'owner') {
//     rawData.role = 'admin' // Downgrade to admin if not owner
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
//         status: 'pending', // Always set to pending
//         updatedAt: new Date()
//       })
//       .returning()

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
//   const user = await verifySession()
//   const id = formData.get('id') as string

//   if (!hasPermission(user, 'users', 'update')) {
//     return {
//       success: false,
//       message: 'Unauthorized to update'
//     }
//   }

//   const rawData = {
//     id,
//     name: (formData.get('name') as string) || null,
//     email: formData.get('email') as string,
//     role: formData.get('role') as (typeof ROLES)[number]
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
//   const user = await verifySession()
//   const id = formData.get('id') as string

//   if (!hasPermission(user, 'users', 'delete')) {
//     return {
//       success: false,
//       message: 'Unauthorized to delete'
//     }
//   }

//   try {
//     await db.delete(users).where(eq(users.id, id))

//     revalidatePath('/users')
//     return {
//       success: true,
//       message: 'User deleted successfully',
//       redirect: '/users'
//     }
//   } catch (error) {
//     console.error('Error deleting user:', error)
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
// import { eq } from 'drizzle-orm'
// import * as z from 'zod'
// import { db } from '@/db'
// import { users } from '@/db/schema'
// import { Action, type ActionResponse } from '@/types/forms'
// import { verifySession } from '@/lib/dal'
// import { hasPermission } from '@/lib/abac'
// import { ROLES } from '@/data/system-roles'

// const schema = z.object({
//   email: z.string().email('Email required'),
//   role: z.enum(ROLES)
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
//       message: 'Unauthorized to create users'
//     }
//   }

//   const rawData = {
//     email: formData.get('email') as string,
//     role: formData.get('role') as (typeof ROLES)[number]
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
//         updatedAt: new Date()
//       })
//       .returning()

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
//     email: formData.get('email') as string,
//     role: formData.get('role') as (typeof ROLES)[number]
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

//   if (!hasPermission(currentUser, 'users', 'delete')) {
//     return {
//       success: false,
//       message: 'Unauthorized to delete users'
//     }
//   }

//   try {
//     await db.delete(users).where(eq(users.id, id))

//     revalidatePath('/users')
//     return {
//       success: true,
//       message: 'User deleted successfully',
//       redirect: '/users'
//     }
//   } catch (error) {
//     console.error('Error deleting user:', error)
//     return {
//       success: false,
//       message: 'An unexpected error occurred. Please try again.'
//     }
//   }
// }

// export { createAction, updateAction, deleteAction }
