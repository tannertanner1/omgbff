'use server'

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { users } from '@/db/schema/users'
// import { customers, invoices, type Status } from '@/db/schema/invoices'
import { customers, invoices } from '@/db/schema/invoices'
import { status } from '@/data/invoice-status'

import { schema } from './schema'
import { ActionResponse } from './types'
import { Resend } from 'resend'
import { InvoiceEmail } from '@/lib/emails/invoice-email'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'

const resend = new Resend(process.env.AUTH_RESEND_KEY)

export async function create(
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }

  const userId = session.user.id

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

    // Get user's organization
    const [user] = await db
      .select({ organizationId: users.organizationId })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!user?.organizationId) {
      return {
        success: false,
        message: 'User is not associated with an organization',
        inputs: rawData
      }
    }

    // Create customer first
    const [customer] = await db
      .insert(customers)
      .values({
        name: name || '',
        email,
        userId: userId,
        organizationId: user.organizationId
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
        customerId: customer.id,
        userId: userId, // Add this line
        // status: 'open' as Status
        status: 'open' as status
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
      react: InvoiceEmail({ invoiceId: invoice.id })
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
