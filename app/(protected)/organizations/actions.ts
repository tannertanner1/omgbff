'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { organizations, userOrganizations } from '@/db/schema/users'
import { auth } from '@/lib/auth'
import type { Role } from '@/data/system-roles'

const schema = z.object({
  name: z.string().min(1, { message: 'Name required' })
})

export async function createAction(formData: FormData) {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }

  const validatedData = schema.parse({
    name: formData.get('name')
  })

  try {
    const [org] = await db
      .insert(organizations)
      .values({
        name: validatedData.name
      })
      .returning()

    await db.insert(userOrganizations).values({
      userId: session.user.id,
      organizationId: org.id,
      role: 'owner' as Role
    })

    revalidatePath('/organizations')
    return { success: true, organizationId: org.id }
  } catch (error) {
    console.error('Error creating organization:', error)
    return {
      success: false,
      message: 'Failed to create organization',
      inputs: { name: validatedData.name }
    }
  }
}

// 'use server'

// import { redirect } from 'next/navigation'
// import { revalidatePath } from 'next/cache'
// import { z } from 'zod'
// import { eq } from 'drizzle-orm'
// import { db } from '@/db'
// import { organizations, userOrganizations } from '@/db/schema/users'
// import { auth } from '@/lib/auth'
// import type { Role } from '@/data/system-roles'

// const schema = z.object({
//   name: z.string().min(1, { message: 'Name required' })
// })

// export async function createAction(formData: FormData) {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   const validatedData = schema.parse({
//     name: formData.get('name')
//   })

//   try {
//     const [org] = await db
//       .insert(organizations)
//       .values({
//         name: validatedData.name,
//         creatorId: session.user.id
//       })
//       .returning()

//     await db.insert(userOrganizations).values({
//       userId: session.user.id,
//       organizationId: org.id,
//       role: 'owner' as Role
//     })

//     revalidatePath('/organizations')
//     return { success: true, organizationId: org.id }
//   } catch (error) {
//     console.error('Error creating organization:', error)
//     return {
//       success: false,
//       message: 'Failed to create organization',
//       inputs: { name: validatedData.name }
//     }
//   }
// }

// 'use server'

// import { redirect } from 'next/navigation'
// import { revalidatePath } from 'next/cache'
// import { z } from 'zod'
// import { eq } from 'drizzle-orm'
// import { db } from '@/db'
// import { organizations, userOrganizations } from '@/db/schema/users'
// import { auth } from '@/lib/auth'
// import { hasPermission } from '@/lib/abac'
// import type { Role } from '@/data/system-roles'

// const schema = z.object({
//   name: z.string().min(1, { message: 'Name required' })
// })

// export async function createAction(formData: FormData) {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   if (!hasPermission(session.user, 'organizations', 'create')) {
//     throw new Error('Permission denied')
//   }

//   const validatedData = schema.parse({
//     name: formData.get('name')
//   })

//   try {
//     const [org] = await db
//       .insert(organizations)
//       .values({
//         name: validatedData.name
//       })
//       .returning()

//     await db.insert(userOrganizations).values({
//       userId: session.user.id,
//       organizationId: org.id,
//       role: 'owner' as Role
//     })

//     revalidatePath('/organizations')
//     return { success: true, organizationId: org.id }
//   } catch (error) {
//     console.error('Error creating organization:', error)
//     return {
//       success: false,
//       message: 'Failed to create organization',
//       inputs: { name: validatedData.name }
//     }
//   }
// }

// export async function updateAction(formData: FormData) {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   const validatedData = schema.parse({
//     name: formData.get('name')
//   })

//   const id = formData.get('id') as string

//   const org = await db.query.organizations.findFirst({
//     where: eq(organizations.id, id)
//   })

//   if (!org || !hasPermission(session.user, 'organizations', 'update', org)) {
//     throw new Error('Permission denied')
//   }

//   await db
//     .update(organizations)
//     .set({ name: validatedData.name })
//     .where(eq(organizations.id, id))

//   revalidatePath('/organizations')
//   return { success: true }
// }

// export async function deleteAction(formData: FormData) {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   const id = formData.get('id') as string

//   const org = await db.query.organizations.findFirst({
//     where: eq(organizations.id, id)
//   })

//   if (!org || !hasPermission(session.user, 'organizations', 'delete', org)) {
//     throw new Error('Permission denied')
//   }

//   await db.delete(organizations).where(eq(organizations.id, id))

//   revalidatePath('/organizations')
//   return { success: true }
// }

// "use server"

// import { redirect } from "next/navigation"
// import { revalidatePath } from "next/cache"
// import { z } from "zod"
// import { eq } from "drizzle-orm"
// import { db } from "@/db"
// import { organizations, userOrganizations } from "@/db/schema/users"
// import { auth } from "@/lib/auth"
// import { hasPermission } from "@/lib/abac"
// import type { Role } from "@/data/system-roles"

// const schema = z.object({
//   name: z.string().min(1, { message: "Name required" }),
// })

// export async function createAction(formData: FormData) {
//   const session = await auth()
//   if (!session) {
//     redirect("/login")
//   }

//   if (!hasPermission(session.user, "organizations", "create")) {
//     throw new Error("Permission denied")
//   }

//   const validatedData = schema.parse({
//     name: formData.get("name"),
//   })

//   try {
//     const [org] = await db
//       .insert(organizations)
//       .values({
//         name: validatedData.name,
//         creatorId: session.user.id,
//       })
//       .returning()

//     await db.insert(userOrganizations).values({
//       userId: session.user.id,
//       organizationId: org.id,
//       role: "owner",
//     })

//     revalidatePath("/organizations")
//     return { success: true, organizationId: org.id }
//   } catch (error) {
//     console.error("Error creating organization:", error)
//     return {
//       success: false,
//       message: "Failed to create organization",
//       inputs: { name: validatedData.name },
//     }
//   }
// }

// export async function updateAction(formData: FormData) {
//   const session = await auth()
//   if (!session) {
//     redirect("/login")
//   }

//   const validatedData = schema.parse({
//     name: formData.get("name"),
//   })

//   const id = formData.get("id") as string

//   const org = await db.query.organizations.findFirst({
//     where: eq(organizations.id, id),
//   })

//   if (!org || !hasPermission(session.user, "organizations", "update", org)) {
//     throw new Error("Permission denied")
//   }

//   await db.update(organizations).set({ name: validatedData.name }).where(eq(organizations.id, id))

//   revalidatePath("/organizations")
//   return { success: true }
// }

// export async function deleteAction(formData: FormData) {
//   const session = await auth()
//   if (!session) {
//     redirect("/login")
//   }

//   const id = formData.get("id") as string

//   const org = await db.query.organizations.findFirst({
//     where: eq(organizations.id, id),
//   })

//   if (!org || !hasPermission(session.user, "organizations", "delete", org)) {
//     throw new Error("Permission denied")
//   }

//   await db.delete(organizations).where(eq(organizations.id, id))

//   revalidatePath("/organizations")
//   return { success: true }
// }

// "use server"

// import { redirect } from "next/navigation"
// import { revalidatePath } from "next/cache"
// import { z } from "zod"
// import { eq } from "drizzle-orm"
// import { db } from "@/db"
// import { organizations, userOrganizations } from "@/db/schema/users"
// import { auth } from "@/lib/auth"
// import { hasPermission } from "@/lib/abac"

// const schema = z.object({
//   name: z.string().min(1, { message: "Name required" }),
// })

// export async function createAction(formData: FormData) {
//   const session = await auth()
//   if (!session) {
//     redirect("/login")
//   }

//   if (!hasPermission(session.user, "organizations", "create")) {
//     throw new Error("Permission denied")
//   }

//   const validatedData = schema.parse({
//     name: formData.get("name"),
//   })

//   try {
//     const [org] = await db
//       .insert(organizations)
//       .values({
//         name: validatedData.name,
//         creatorId: session.user.id,
//       })
//       .returning()

//     await db.insert(userOrganizations).values({
//       userId: session.user.id,
//       organizationId: org.id,
//       role: "owner",
//     })

//     revalidatePath("/organizations")
//     return { success: true, organizationId: org.id }
//   } catch (error) {
//     console.error("Error creating organization:", error)
//     return {
//       success: false,
//       message: "Failed to create organization",
//       inputs: { name: validatedData.name },
//     }
//   }
// }

// export async function updateAction(formData: FormData) {
//   const session = await auth()
//   if (!session) {
//     redirect("/login")
//   }

//   const validatedData = schema.parse({
//     name: formData.get("name"),
//   })

//   const id = formData.get("id") as string

//   const org = await db.query.organizations.findFirst({
//     where: eq(organizations.id, id),
//   })

//   if (!org || !hasPermission(session.user, "organizations", "update", org)) {
//     throw new Error("Permission denied")
//   }

//   await db.update(organizations).set({ name: validatedData.name }).where(eq(organizations.id, id))

//   revalidatePath("/organizations")
//   return { success: true }
// }

// export async function deleteAction(formData: FormData) {
//   const session = await auth()
//   if (!session) {
//     redirect("/login")
//   }

//   const id = formData.get("id") as string

//   const org = await db.query.organizations.findFirst({
//     where: eq(organizations.id, id),
//   })

//   if (!org || !hasPermission(session.user, "organizations", "delete", org)) {
//     throw new Error("Permission denied")
//   }

//   await db.delete(organizations).where(eq(organizations.id, id))

//   revalidatePath("/organizations")
//   return { success: true }
// }

// 'use server'

// import { redirect } from 'next/navigation'
// import { revalidatePath } from 'next/cache'
// import { z } from 'zod'
// import { eq } from 'drizzle-orm'
// import { db } from '@/db'
// import { organizations, userOrganizations } from '@/db/schema/users'
// import { auth } from '@/lib/auth'

// const schema = z.object({
//   name: z.string().min(1, { message: 'Name required' })
// })

// async function createAction(formData: FormData) {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   const validatedData = schema.parse({
//     name: formData.get('name')
//   })

//   try {
//     const [org] = await db
//       .insert(organizations)
//       .values({
//         name: validatedData.name
//       })
//       .returning()

//     await db.insert(userOrganizations).values({
//       userId: session.user.id,
//       organizationId: org.id,
//       role: 'owner'
//     })

//     revalidatePath('/organizations')
//     return { success: true, organizationId: org.id }
//   } catch (error) {
//     console.error('Error creating organization:', error)
//     return {
//       success: false,
//       message: 'Failed to create organization',
//       inputs: { name: validatedData.name }
//     }
//   }
// }

// async function updateAction(formData: FormData) {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   const validatedData = schema.parse({
//     name: formData.get('name')
//   })

//   const id = formData.get('id') as string

//   await db
//     .update(organizations)
//     .set({ name: validatedData.name })
//     .where(eq(organizations.id, id))

//   revalidatePath('/organizations')
//   return { success: true }
// }

// async function deleteAction(formData: FormData) {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   const id = formData.get('id') as string

//   await db.delete(organizations).where(eq(organizations.id, id))

//   revalidatePath('/organizations')
//   return { success: true }
// }

// export { createAction, updateAction, deleteAction }

// 'use server'

// import { redirect } from 'next/navigation'
// import { revalidatePath } from 'next/cache'
// import { z } from 'zod'
// import { eq } from 'drizzle-orm'
// import { db } from '@/db'
// import { organizations, userOrganizations } from '@/db/schema/users'
// import { auth } from '@/lib/auth'

// const schema = z.object({
//   name: z.string().min(1, { message: 'Name required' })
// })

// async function createAction(formData: FormData) {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   const validatedData = schema.parse({
//     name: formData.get('name')
//   })

//   const [organization] = await db.transaction(async tx => {
//     const [org] = await tx
//       .insert(organizations)
//       .values({
//         name: validatedData.name
//       })
//       .returning()

//     await tx.insert(userOrganizations).values({
//       userId: session.user.id,
//       organizationId: org.id,
//       role: 'owner'
//     })

//     return [org]
//   })

//   revalidatePath('/organizations')
//   return { success: true, organizationId: organization.id }
// }

// async function updateAction(formData: FormData) {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   const validatedData = schema.parse({
//     name: formData.get('name')
//   })

//   const id = formData.get('id') as string

//   await db
//     .update(organizations)
//     .set({ name: validatedData.name })
//     .where(eq(organizations.id, id))

//   revalidatePath('/organizations')
//   return { success: true }
// }

// async function deleteAction(formData: FormData) {
//   const session = await auth()
//   if (!session) {
//     redirect('/login')
//   }

//   const id = formData.get('id') as string

//   await db.delete(organizations).where(eq(organizations.id, id))

//   revalidatePath('/organizations')
//   return { success: true }
// }

// export { createAction, updateAction, deleteAction }
