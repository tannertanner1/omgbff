'use server'

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { customers } from '@/db/schema/invoices'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { customerSchema } from './schema'
import { ActionResponse } from './types'

export async function createCustomer(
  organizationId: string,
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }

  const rawData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string
  }

  const validatedData = customerSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      message: 'Please fix the errors in the form',
      errors: validatedData.error.flatten().fieldErrors,
      inputs: rawData
    }
  }

  try {
    const { name, email } = validatedData.data

    await db.insert(customers).values({
      name,
      email,
      organizationId,
      userId: session.user.id
    })

    revalidatePath(`/${session.user.id}/${organizationId}`)
    return { success: true, message: 'Customer created successfully' }
  } catch (error) {
    console.error('Customer creation error:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      inputs: rawData
    }
  }
}

export async function updateCustomer(
  organizationId: string,
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }

  const rawData = {
    id: formData.get('id') as string,
    name: formData.get('name') as string,
    email: formData.get('email') as string
  }

  const validatedData = customerSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      message: 'Please fix the errors in the form',
      errors: validatedData.error.flatten().fieldErrors,
      inputs: rawData
    }
  }

  try {
    const { name, email } = validatedData.data
    const id = parseInt(rawData.id, 10)

    await db.update(customers).set({ name, email }).where(eq(customers.id, id))

    revalidatePath(`/${session.user.id}/${organizationId}`)
    return { success: true, message: 'Customer updated successfully' }
  } catch (error) {
    console.error('Customer update error:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      inputs: rawData
    }
  }
}

export async function deleteCustomer(
  organizationId: string,
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }

  const id = formData.get('id') as string
  if (!id) {
    return { success: false, message: 'ID is required' }
  }

  try {
    await db.delete(customers).where(eq(customers.id, parseInt(id, 10)))

    revalidatePath(`/${session.user.id}/${organizationId}`)
    return { success: true, message: 'Customer deleted successfully' }
  } catch (error) {
    console.error('Customer delete error:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.'
    }
  }
}
