'use server'

import { db } from '@/db'
import { organizations, users } from '@/db/schema/users'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { schema } from './schema'
import type { ActionResponse } from './types'
import { eq } from 'drizzle-orm'

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

  try {
    const validatedData = schema.safeParse(rawData)

    if (!validatedData.success) {
      return {
        success: false,
        message: 'Please fix the errors in the form',
        errors: validatedData.error.flatten().fieldErrors,
        inputs: rawData
      }
    }

    const [organization] = await db
      .insert(organizations)
      .values({
        name: validatedData.data.name
      })
      .returning()

    // Update the user's organizationId
    await db
      .update(users)
      .set({ organizationId: organization.id })
      .where(eq(users.id, session.user.id))

    revalidatePath('/dashboard/organizations')

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
