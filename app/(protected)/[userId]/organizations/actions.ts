'use server'

import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/abac'
import { db } from '@/db'
import { organizations } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const actionSchema = z.object({
  name: z.string().min(1).max(255)
})

export async function createAction(formData: FormData) {
  const session = await auth()
  if (!session) {
    return { error: 'Unauthorized' }
  }

  if (!hasPermission(session.user, 'organizations', 'create')) {
    return { error: 'Permission denied' }
  }

  const validatedFields = actionSchema.safeParse({
    name: formData.get('name')
  })

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  try {
    await db.insert(organizations).values({
      name: validatedFields.data.name,
      createdAt: new Date()
    })
  } catch (error) {
    return { error: 'Database Error' }
  }

  revalidatePath(`/${session.user.id}/organizations`)
  redirect(`/${session.user.id}/organizations`)
}

export async function updateAction(formData: FormData) {
  const session = await auth()
  if (!session) {
    return { error: 'Unauthorized' }
  }

  const id = formData.get('id') as string

  if (!hasPermission(session.user, 'organizations', 'update')) {
    return { error: 'Permission denied' }
  }

  const validatedFields = actionSchema.safeParse({
    name: formData.get('name')
  })

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  try {
    await db
      .update(organizations)
      .set({
        name: validatedFields.data.name,
        updatedAt: new Date()
      })
      .where(eq(organizations.id, id))
  } catch (error) {
    return { error: 'Database Error' }
  }

  revalidatePath(`/${session.user.id}/organizations`)
  redirect(`/${session.user.id}/organizations`)
}

export async function deleteAction(formData: FormData) {
  const session = await auth()
  if (!session) {
    return { error: 'Unauthorized' }
  }

  const id = formData.get('id') as string

  if (!hasPermission(session.user, 'organizations', 'delete')) {
    return { error: 'Permission denied' }
  }

  try {
    await db.delete(organizations).where(eq(organizations.id, id))
  } catch (error) {
    return { error: 'Database Error' }
  }

  revalidatePath(`/${session.user.id}/organizations`)
  redirect(`/${session.user.id}/organizations`)
}
