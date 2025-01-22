'use server'

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { customers } from '@/db/schema/invoices'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import type { ActionResponse } from './types'

const schema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  organizationId: z.string().min(1, { message: 'Organization ID is required' })
})

export async function createCustomer(
  userId: string,
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }

  // Verify the user is performing action for their own account
  if (session.user.id !== userId) {
    throw new Error('Unauthorized')
  }

  const validatedData = schema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    organizationId: formData.get('organizationId')
  })

  if (!validatedData.success) {
    return {
      success: false,
      message: 'Please fix the errors in the form',
      errors: validatedData.error.flatten().fieldErrors,
      inputs: {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        organizationId: formData.get('organizationId') as string
      }
    }
  }

  try {
    await db.insert(customers).values({
      name: validatedData.data.name,
      email: validatedData.data.email,
      userId: userId,
      organizationId: formData.get('organizationId') as string
    })

    revalidatePath(`/${userId}/customers`)
    return { success: true, message: 'Customer created successfully' }
  } catch (error) {
    console.error('Error creating customer:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      inputs: validatedData.data
    }
  }
}

// "use server"

// import { auth } from "@/lib/auth"
// import { redirect } from "next/navigation"
// import { db } from "@/db"
// import { customers } from "@/db/schema/invoices"
// import { revalidatePath } from "next/cache"
// import { z } from "zod"
// import type { ActionResponse } from "./types"

// const schema = z.object({
//   name: z.string().min(1, { message: "Name is required" }),
//   email: z.string().email({ message: "Invalid email address" }),
// })

// export async function createCustomer(
//   userId: string,
//   _: ActionResponse | null,
//   formData: FormData,
// ): Promise<ActionResponse> {
//   const session = await auth()
//   if (!session) {
//     redirect("/login")
//   }

//   // Verify the user is performing action for their own account
//   if (session.user.id !== userId) {
//     throw new Error("Unauthorized")
//   }

//   const validatedData = schema.safeParse({
//     name: formData.get("name"),
//     email: formData.get("email"),
//   })

//   if (!validatedData.success) {
//     return {
//       success: false,
//       message: "Please fix the errors in the form",
//       errors: validatedData.error.flatten().fieldErrors,
//       inputs: {
//         name: formData.get("name") as string,
//         email: formData.get("email") as string,
//       },
//     }
//   }

//   try {
//     await db.insert(customers).values({
//       name: validatedData.data.name,
//       email: validatedData.data.email,
//       userId: userId,
//     })

//     revalidatePath(`/${userId}/customers`)
//     return { success: true, message: "Customer created successfully" }
//   } catch (error) {
//     console.error("Error creating customer:", error)
//     return {
//       success: false,
//       message: "An unexpected error occurred. Please try again.",
//       inputs: validatedData.data,
//     }
//   }
// }
