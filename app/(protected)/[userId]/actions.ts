'use server'

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { organizations, users } from '@/db/schema/users'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { ActionResponse } from './types'

export async function createOrganization(
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }

  const rawData = {
    name: formData.get('name') as string
  }

  if (!rawData.name) {
    return {
      success: false,
      message: 'Please fix the errors in the form',
      errors: {
        name: ['Name is required']
      },
      inputs: rawData
    }
  }

  try {
    const [organization] = await db
      .insert(organizations)
      .values({
        name: rawData.name
      })
      .returning()

    // Update the user's organizationId
    await db
      .update(users)
      .set({ organizationId: organization.id })
      .where(eq(users.id, session.user.id))

    revalidatePath(`/${session.user.id}`)
    return {
      success: true,
      message: 'Organization created successfully',
      inputs: { name: '' }
    }
  } catch (error) {
    console.error('Error creating organization:', error)
    return {
      success: false,
      message: 'An unexpected error occurred',
      inputs: rawData
    }
  }
}

export async function updateOrganization(formData: FormData) {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }

  const id = formData.get('id') as string
  const name = formData.get('name') as string
  if (!id || !name) {
    return { error: 'ID and name are required' }
  }

  try {
    await db.update(organizations).set({ name }).where(eq(organizations.id, id))

    revalidatePath(`/${session.user.id}`)
    return { success: true }
  } catch (error) {
    console.error('Error updating organization:', error)
    return { error: 'Failed to update organization' }
  }
}

export async function deleteOrganization(formData: FormData) {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }

  const id = formData.get('id') as string
  if (!id) {
    return { error: 'ID is required' }
  }

  try {
    await db.delete(organizations).where(eq(organizations.id, id))

    revalidatePath(`/${session.user.id}`)
    return { success: true }
  } catch (error) {
    console.error('Error deleting organization:', error)
    return { error: 'Failed to delete organization' }
  }
}

// @note thot it was work... but idk fucc

// 'use server'

// import { auth } from '@/lib/auth'
// import { redirect } from 'next/navigation'
// import { db } from '@/db'
// import { organizations } from '@/db/schema/users'
// import { revalidatePath } from 'next/cache'
// import { eq } from 'drizzle-orm'

// export async function createOrganization(formData: FormData) {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   const name = formData.get('name') as string
//   if (!name) {
//     return { error: 'Name is required' }
//   }

//   try {
//     await db.insert(organizations).values({
//       name
//     })

//     revalidatePath(`/${session.user.id}`)
//     return { success: true }
//   } catch (error) {
//     console.error('Error creating organization:', error)
//     return { error: 'Failed to create organization' }
//   }
// }

// export async function updateOrganization(formData: FormData) {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   const id = formData.get('id') as string
//   const name = formData.get('name') as string
//   if (!id || !name) {
//     return { error: 'ID and name are required' }
//   }

//   try {
//     await db.update(organizations).set({ name }).where(eq(organizations.id, id))

//     revalidatePath(`/${session.user.id}`)
//     return { success: true }
//   } catch (error) {
//     console.error('Error updating organization:', error)
//     return { error: 'Failed to update organization' }
//   }
// }

// export async function deleteOrganization(formData: FormData) {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   const id = formData.get('id') as string
//   if (!id) {
//     return { error: 'ID is required' }
//   }

//   try {
//     await db.delete(organizations).where(eq(organizations.id, id))

//     revalidatePath(`/${session.user.id}`)
//     return { success: true }
//   } catch (error) {
//     console.error('Error deleting organization:', error)
//     return { error: 'Failed to delete organization' }
//   }
// }

// "use server"

// import { auth } from "@/lib/auth"
// import { redirect } from "next/navigation"
// import { db } from "@/db"
// import { organizations } from "@/db/schema/users"
// import { revalidatePath } from "next/cache"
// import { eq } from "drizzle-orm"

// export async function createOrganization(formData: FormData) {
//   const session = await auth()
//   if (!session) {
//     redirect("/login")
//   }

//   const name = formData.get("name") as string
//   if (!name) {
//     return { error: "Name is required" }
//   }

//   try {
//     await db.insert(organizations).values({
//       name,
//       userId: session.user.id,
//     })

//     revalidatePath(`/${session.user.id}`)
//     return { success: true }
//   } catch (error) {
//     console.error("Error creating organization:", error)
//     return { error: "Failed to create organization" }
//   }
// }

// export async function updateOrganization(formData: FormData) {
//   const session = await auth()
//   if (!session) {
//     redirect("/login")
//   }

//   const id = formData.get("id") as string
//   const name = formData.get("name") as string
//   if (!id || !name) {
//     return { error: "ID and name are required" }
//   }

//   try {
//     await db
//       .update(organizations)
//       .set({ name })
//       .where(eq(organizations.id, id))

//     revalidatePath(`/${session.user.id}`)
//     return { success: true }
//   } catch (error) {
//     console.error("Error updating organization:", error)
//     return { error: "Failed to update organization" }
//   }
// }

// export async function deleteOrganization(formData: FormData) {
//   const session = await auth()
//   if (!session) {
//     redirect("/login")
//   }

//   const id = formData.get("id") as string
//   if (!id) {
//     return { error: "ID is required" }
//   }

//   try {
//     await db.delete(organizations).where(eq(organizations.id, id))

//     revalidatePath(`/${session.user.id}`)
//     return { success: true }
//   } catch (error) {
//     console.error("Error deleting organization:", error)
//     return { error: "Failed to delete organization" }
//   }
// }

// 'use server'

// import { auth } from '@/lib/auth'
// import { redirect } from 'next/navigation'
// import { db } from '@/db'
// import { organizations } from '@/db/schema/users'
// import { revalidatePath } from 'next/cache'
// import { eq } from 'drizzle-orm'

// export async function createOrganization(formData: FormData) {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   const name = formData.get('name') as string
//   if (!name) {
//     return { error: 'Name is required' }
//   }

//   try {
//     await db.insert(organizations).values({
//       name,
//       userId: session.user.id
//     })

//     revalidatePath(`/${session.user.id}`)
//     return { success: true }
//   } catch (error) {
//     console.error('Error creating organization:', error)
//     return { error: 'Failed to create organization' }
//   }
// }

// export async function updateOrganization(formData: FormData) {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   const id = formData.get('id') as string
//   const name = formData.get('name') as string
//   if (!id || !name) {
//     return { error: 'ID and name are required' }
//   }

//   try {
//     await db.update(organizations).set({ name }).where(eq(organizations.id, id))

//     revalidatePath(`/${session.user.id}`)
//     return { success: true }
//   } catch (error) {
//     console.error('Error updating organization:', error)
//     return { error: 'Failed to update organization' }
//   }
// }

// export async function deleteOrganization(formData: FormData) {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   const id = formData.get('id') as string
//   if (!id) {
//     return { error: 'ID is required' }
//   }

//   try {
//     await db.delete(organizations).where(eq(organizations.id, id))

//     revalidatePath(`/${session.user.id}`)
//     return { success: true }
//   } catch (error) {
//     console.error('Error deleting organization:', error)
//     return { error: 'Failed to delete organization' }
//   }
// }

// @note literally fuc idk

// 'use server'

// import { auth } from '@/lib/auth'
// import { redirect } from 'next/navigation'
// import { db } from '@/db'
// import { organizations, users } from '@/db/schema/users'
// import { schema } from './schema'
// import type { ActionResponse } from './types'
// import { eq } from 'drizzle-orm'
// import { revalidatePath } from 'next/cache'

// export async function createAction(
//   _: ActionResponse | null,
//   formData: FormData
// ): Promise<ActionResponse> {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   const userId = session.user.id

//   const rawData = {
//     name: formData.get('name') as string
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

//   let result
//   try {
//     const { name } = validatedData.data

//     // Create organization
//     const [organization] = await db
//       .insert(organizations)
//       .values({
//         name
//       })
//       .returning({
//         id: organizations.id
//       })

//     // Update the user's organizationId
//     await db
//       .update(users)
//       .set({ organizationId: organization.id })
//       .where(eq(users.id, userId))

//     result = organization

//     revalidatePath(`/${userId}`)
//   } catch (error) {
//     console.error('Organization creation error:', error)
//     return {
//       success: false,
//       message: 'An unexpected error occurred. Please try again.',
//       inputs: rawData
//     }
//   }

//   // Redirect outside of try/catch to match invoice pattern
//   redirect(`/${userId}/${result.id}`)
// }

// export async function updateAction(
//   organizationId: string,
//   role: 'owner' | 'admin' | 'user'
// ): Promise<ActionResponse> {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   try {
//     await db.update(users).set({ role }).where(eq(users.id, session.user.id))

//     revalidatePath(`/${session.user.id}/${organizationId}`)
//     return {
//       success: true,
//       message: 'Organization role updated successfully',
//       inputs: { name: '' }
//     }
//   } catch (error) {
//     console.error('Error updating organization role:', error)
//     return {
//       success: false,
//       message: 'Failed to update organization role',
//       inputs: { name: '' }
//     }
//   }
// }

// export async function deleteAction(
//   organizationId: string
// ): Promise<ActionResponse> {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   try {
//     await db.delete(organizations).where(eq(organizations.id, organizationId))
//     revalidatePath(`/${session.user.id}`)
//     return {
//       success: true,
//       message: 'Organization deleted successfully',
//       inputs: { name: '' }
//     }
//   } catch (error) {
//     console.error('Error deleting organization:', error)
//     return {
//       success: false,
//       message: 'Failed to delete organization',
//       inputs: { name: '' }
//     }
//   }
// }

// @note fuck? idek....

// 'use server'

// import { auth } from '@/lib/auth'
// import { db } from '@/db'
// import { organizations, users } from '@/db/schema/users'
// import { and, eq } from 'drizzle-orm'
// import { revalidatePath } from 'next/cache'
// import { redirect } from 'next/navigation'

// export type OrganizationResponse = {
//   success: boolean
//   message: string
//   role?: string
// }

// export async function updateOrganizationRole(
//   prevState: OrganizationResponse | null,
//   formData: FormData
// ): Promise<OrganizationResponse> {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   const organizationId = formData.get('organizationId') as string
//   const role = formData.get('role') as 'owner' | 'admin' | 'user'

//   try {
//     await db
//       .update(users)
//       .set({ role })
//       .where(
//         and(
//           eq(users.organizationId, organizationId),
//           eq(users.id, session.user.id)
//         )
//       )

//     revalidatePath(`/dashboard/organizations/${organizationId}`)
//     return {
//       success: true,
//       message: 'Organization role updated successfully',
//       role
//     }
//   } catch (error) {
//     console.error('Error updating organization role:', error)
//     return {
//       success: false,
//       message: 'Failed to update organization role',
//       role: prevState?.role
//     }
//   }
// }

// export async function deleteOrganization(formData: FormData) {
//   const session = await auth()
//   if (!session) {
//     throw new Error('You must be logged in to delete organizations')
//   }

//   const organizationId = formData.get('organizationId') as string

//   try {
//     await db.delete(organizations).where(eq(organizations.id, organizationId))
//     revalidatePath('/dashboard/organizations')
//     return { success: true }
//   } catch (error) {
//     console.error('Error deleting organization:', error)
//     return { success: false, error: 'Failed to delete organization' }
//   }
// }

// @note before...

// 'use server'

// import { db } from '@/db'
// import { organizations, users } from '@/db/schema/users'
// import { auth } from '@/lib/auth'
// import { redirect } from 'next/navigation'
// import { revalidatePath } from 'next/cache'
// import { schema } from './schema'
// import type { ActionResponse } from './types'
// import { eq } from 'drizzle-orm'

// export async function create(
//   _: ActionResponse | null,
//   formData: FormData
// ): Promise<ActionResponse> {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   const rawData = {
//     name: formData.get('name') as string
//   }

//   try {
//     const validatedData = schema.safeParse(rawData)

//     if (!validatedData.success) {
//       return {
//         success: false,
//         message: 'Please fix the errors in the form',
//         errors: validatedData.error.flatten().fieldErrors,
//         inputs: rawData
//       }
//     }

//     const [organization] = await db
//       .insert(organizations)
//       .values({
//         name: validatedData.data.name
//       })
//       .returning()

//     // Update the user's organizationId
//     await db
//       .update(users)
//       .set({ organizationId: organization.id })
//       .where(eq(users.id, session.user.id))

//     revalidatePath('/dashboard/organizations')

//     return {
//       success: true,
//       message: 'Organization created successfully',
//       inputs: { name: '' }
//     }
//   } catch (error) {
//     console.error('Error creating organization:', error)
//     return {
//       success: false,
//       message: 'An unexpected error occurred',
//       inputs: rawData
//     }
//   }
// }

// 'use server'

// import { db } from '@/db'
// import { organizations } from '@/db/schema/users'
// import { auth } from '@/lib/auth'
// import { revalidatePath } from 'next/cache'
// import { schema } from './schema'
// import type { ActionResponse } from './types'

// export async function createOrganization(
//   _: ActionResponse | null,
//   formData: FormData
// ): Promise<ActionResponse> {
// const session = await auth()
// if (!session) {
//   redirect('/login')
// }

//   const rawData = {
//     name: formData.get('name') as string
//   }

//   try {
//     const validatedData = schema.safeParse(rawData)

//     if (!validatedData.success) {
//       return {
//         success: false,
//         message: 'Please fix the errors in the form',
//         errors: validatedData.error.flatten().fieldErrors,
//         inputs: rawData
//       }
//     }

//     const [organization] = await db
//       .insert(organizations)
//       .values({
//         name: validatedData.data.name
//       })
//       .returning()

//     revalidatePath('/dashboard/organizations')

//     return {
//       success: true,
//       message: 'Organization created successfully',
//       inputs: { name: '' }
//     }
//   } catch (error) {
//     console.error('Error creating organization:', error)
//     return {
//       success: false,
//       message: 'An unexpected error occurred',
//       inputs: rawData
//     }
//   }
// }
