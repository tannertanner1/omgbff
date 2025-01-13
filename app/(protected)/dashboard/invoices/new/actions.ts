'use server'

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { customers, invoices } from '@/db/schema/invoices'
import { schema } from './schema'
import { ActionResponse } from './types'
import { Resend } from 'resend'
import { InvoiceEmail } from '@/lib/emails/invoice-email'
import { revalidatePath } from 'next/cache'

const resend = new Resend(process.env.AUTH_RESEND_KEY)

export async function create(
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const session = await auth()
  if (!session) {
    return {
      success: false,
      message: 'You must be logged in to create invoices'
    }
  }

  // const userId = session.user.id
  const userId = '9be1014c-7160-4c75-b8f8-ce2e3cd1bd96'

  const rawData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    value: formData.get('value') as string,
    description: formData.get('description') as string
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

  let result
  try {
    const { name, email, value, description } = validatedData.data

    // Create customer first
    const [customer] = await db
      .insert(customers)
      .values({
        name: name || '',
        email,
        userId: userId
      })
      .returning({
        id: customers.id
      })

    // Create invoice
    const [invoice] = await db
      .insert(invoices)
      .values({
        value: Math.floor(Number.parseFloat(value) * 100),
        description,
        userId: userId,
        customerId: customer.id,
        status: 'open'
      })
      .returning({
        id: invoices.id
      })

    result = invoice

    // Send email
    await resend.emails.send({
      from: process.env.AUTH_RESEND_EMAIL as string,
      to: [email],
      subject: 'New Invoice',
      react: InvoiceEmail({ invoiceId: result.id })
    })

    revalidatePath('/dashboard/invoices')
  } catch (error) {
    console.error('Invoice creation error:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      inputs: rawData
    }
  }

  // Redirect outside of try/catch
  redirect(`/dashboard/invoices/${result.id}`)
}
