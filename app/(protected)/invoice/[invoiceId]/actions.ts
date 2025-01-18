'use server'

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { customers, invoices } from '@/db/schema/invoices'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { invoiceSchema } from './schema'
import { ActionResponse } from './types'
import { Resend } from 'resend'
import { InvoiceEmail } from '@/emails/invoice-email'
import { Status } from '@/data/invoice-statuses'

const resend = new Resend(process.env.AUTH_RESEND_KEY)

export async function createInvoice(
  organizationId: string,
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }

  const rawData = {
    customerId: formData.get('customerId') as string,
    amount: formData.get('amount') as string,
    description: formData.get('description') as string
  }

  const validatedData = invoiceSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      message: 'Please fix the errors in the form',
      errors: validatedData.error.flatten().fieldErrors,
      inputs: rawData
    }
  }

  try {
    const { customerId, amount, description } = validatedData.data

    const [invoice] = await db
      .insert(invoices)
      .values({
        customerId: parseInt(customerId, 10),
        value: Math.floor(Number.parseFloat(amount) * 100),
        description,
        userId: session.user.id,
        status: 'open'
      })
      .returning()

    // Send email
    const customer = await db
      .select()
      .from(customers)
      .where(eq(customers.id, parseInt(customerId, 10)))
      .limit(1)
      .then(res => res[0])

    if (customer) {
      await resend.emails.send({
        from: process.env.AUTH_RESEND_EMAIL as string,
        to: [customer.email],
        subject: 'New Invoice',
        react: InvoiceEmail({ invoiceId: invoice.id })
      })
    }

    revalidatePath(`/${session.user.id}/${organizationId}`)
    return { success: true, message: 'Invoice created successfully' }
  } catch (error) {
    console.error('Invoice creation error:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      inputs: rawData
    }
  }
}

export async function updateInvoice(
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
    customerId: formData.get('customerId') as string,
    amount: formData.get('amount') as string,
    description: formData.get('description') as string,
    status: formData.get('status') as Status
  }

  const validatedData = invoiceSchema.safeParse({
    customerId: rawData.customerId,
    amount: rawData.amount,
    description: rawData.description
  })

  if (!validatedData.success) {
    return {
      success: false,
      message: 'Please fix the errors in the form',
      errors: validatedData.error.flatten().fieldErrors,
      inputs: rawData
    }
  }

  try {
    const { customerId, amount, description } = validatedData.data

    await db
      .update(invoices)
      .set({
        customerId: parseInt(customerId, 10),
        value: Math.floor(Number.parseFloat(amount) * 100),
        description,
        status: rawData.status
      })
      .where(eq(invoices.id, parseInt(rawData.id, 10)))

    revalidatePath(`/${session.user.id}/${organizationId}`)
    return { success: true, message: 'Invoice updated successfully' }
  } catch (error) {
    console.error('Invoice update error:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      inputs: rawData
    }
  }
}

export async function deleteInvoice(
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
    await db.delete(invoices).where(eq(invoices.id, parseInt(id, 10)))

    revalidatePath(`/${session.user.id}/${organizationId}`)
    return { success: true, message: 'Invoice deleted successfully' }
  } catch (error) {
    console.error('Invoice delete error:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.'
    }
  }
}
