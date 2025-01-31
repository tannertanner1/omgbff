'use server'

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { organizations } from '@/db/schema'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { schema } from './schema'
import { hasPermission } from '@/lib/abac'
import type { ActionResponse } from './types'

async function createAction(
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }

  if (!hasPermission(session.user, 'organizations', 'create')) {
    return {
      success: false,
      message: 'Unauthorized',
      errors: {},
      inputs: { name: formData.get('name') as string }
    }
  }

  const rawData = {
    name: formData.get('name') as string
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
    const [organization] = await db
      .insert(organizations)
      .values({
        name: validatedData.data.name
      })
      .returning()

    revalidatePath(`/${session.user.id}/organizations`)
    return {
      success: true,
      message: 'Organization created successfully',
      organizationId: organization.id
    }
  } catch (error) {
    console.error('Error creating organization:', error)
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
  const session = await auth()
  if (!session) {
    redirect('/login')
  }

  const id = formData.get('id') as string
  if (!hasPermission(session.user, 'organizations', 'update')) {
    return {
      success: false,
      message: 'Unauthorized',
      errors: {},
      inputs: { name: formData.get('name') as string }
    }
  }

  const rawData = {
    name: formData.get('name') as string
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
    await db
      .update(organizations)
      .set({
        name: validatedData.data.name,
        updatedAt: new Date()
      })
      .where(eq(organizations.id, id))

    revalidatePath(`/${session.user.id}/organizations`)
    return {
      success: true,
      message: 'Organization updated successfully'
    }
  } catch (error) {
    console.error('Error updating organization:', error)
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
  const session = await auth()
  if (!session) {
    redirect('/login')
  }

  const id = formData.get('id') as string
  if (!hasPermission(session.user, 'organizations', 'delete')) {
    return {
      success: false,
      message: 'Unauthorized'
    }
  }

  try {
    await db.delete(organizations).where(eq(organizations.id, id))
    revalidatePath(`/${session.user.id}/organizations`)
    return {
      success: true,
      message: 'Organization deleted successfully'
    }
  } catch (error) {
    console.error('Error deleting organization:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.'
    }
  }
}

export { createAction, updateAction, deleteAction }

// 'use server'

// import { auth } from '@/lib/auth'
// import { redirect } from 'next/navigation'
// import { db } from '@/db'
// import { organizations, userOrganizations } from '@/db/schema/users'
// import { revalidatePath } from 'next/cache'
// import type { Role } from '@/data/system-roles'
// import { schema } from './schema'
// import { hasPermission } from '@/lib/abac'
// import type { ActionResponse } from './types'

// export async function createAction(
//   _: ActionResponse | null,
//   formData: FormData
// ): Promise<ActionResponse> {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   if (!hasPermission(session.user, 'organizations', 'create')) {
//     return {
//       success: false,
//       message: 'Unauthorized',
//       errors: {},
//       inputs: { name: formData.get('name') as string }
//     }
//   }

//   const validatedData = schema.safeParse({
//     name: formData.get('name')
//   })

//   if (!validatedData.success) {
//     return {
//       success: false,
//       message: 'Please fix the errors in the form',
//       errors: validatedData.error.flatten().fieldErrors,
//       inputs: { name: formData.get('name') as string }
//     }
//   }

//   try {
//     const [organization] = await db
//       .insert(organizations)
//       .values({
//         name: validatedData.data.name
//       })
//       .returning()

//     await db.insert(userOrganizations).values({
//       userId: session.user.id,
//       organizationId: organization.id,
//       role: 'owner' as Role
//     })

//     revalidatePath(`/${session.user.id}/organizations`)
//     return {
//       success: true,
//       message: 'Organization created successfully',
//       organizationId: organization.id,
//       redirect: `/${session.user.id}/organizations/${organization.id}`,
//       errors: {},
//       inputs: { name: validatedData.data.name }
//     }
//   } catch (error) {
//     console.error('Error creating organization:', error)
//     return {
//       success: false,
//       message: 'An unexpected error occurred. Please try again.',
//       errors: {},
//       inputs: { name: validatedData.data.name }
//     }
//   }
// }

// 'use server'
// import { auth } from '@/lib/auth'
// import { db } from '@/db'
// import { organizations } from '@/db/schema'
// import { schema } from './schema'
// import type { ActionResponse, FormData } from './types'

// export async function createAction(
//   prevState: any,
//   formData: FormData
// ): Promise<ActionResponse> {
//   const session = await auth()
//   if (!session) {
//     return {
//       success: false,
//       message: 'You must be logged in to create an organization',
//       errors: {},
//       inputs: { name: formData.get('name') as string }
//     }
//   }

//   const validatedData = schema.safeParse(Object.fromEntries(formData))

//   if (validatedData.success) {
//     try {
//       const [organization] = await db
//         .insert(organizations)
//         .values({
//           name: validatedData.data.name,
//           userId: session.user.id
//         })
//         .returning()

//       return {
//         success: true,
//         message: 'Organization created successfully',
//         organizationId: organization.id,
//         redirect: `/${session.user.id}/organizations/${organization.id}`,
//         errors: {},
//         inputs: { name: validatedData.data.name }
//       }
//     } catch (error) {
//       return {
//         success: false,
//         message: 'Failed to create organization',
//         errors: { name: ['An unexpected error occurred'] },
//         inputs: { name: validatedData.data.name }
//       }
//     }
//   } else {
//     return {
//       success: false,
//       message: 'Failed to create organization',
//       errors: validatedData.error.flatten().fieldErrors,
//       inputs: { name: formData.get('name') as string }
//     }
//   }
// }
