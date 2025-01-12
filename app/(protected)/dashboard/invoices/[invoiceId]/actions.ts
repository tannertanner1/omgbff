'use server'

import { auth } from '@/lib/auth'
import { db } from '@/db'
import { invoices } from '@/db/schema/invoices'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateInvoiceStatus(prevState: any, formData: FormData) {
  const session = await auth()
  if (!session) {
    return {
      success: false,
      message: 'You must be logged in to update invoices'
    }
  }

  const invoiceId = formData.get('invoiceId') as string
  const status = formData.get('status') as
    | 'open'
    | 'paid'
    | 'void'
    | 'uncollectible'

  try {
    await db
      .update(invoices)
      .set({ status })
      .where(eq(invoices.id, parseInt(invoiceId)))

    revalidatePath(`/dashboard/invoices/${invoiceId}`)
    return {
      success: true,
      message: 'Invoice status updated successfully',
      status
    }
  } catch (error) {
    console.error('Error updating invoice status:', error)
    return {
      success: false,
      message: 'Failed to update invoice status',
      status: prevState.status
    }
  }
}

export async function deleteInvoice(prevState: any, formData: FormData) {
  const session = await auth()
  if (!session) {
    return {
      success: false,
      message: 'You must be logged in to delete invoices'
    }
  }

  const invoiceId = formData.get('invoiceId') as string

  try {
    await db.delete(invoices).where(eq(invoices.id, parseInt(invoiceId)))

    redirect('/dashboard/invoices')
  } catch (error) {
    console.error('Error deleting invoice:', error)
    return { success: false, message: 'Failed to delete invoice' }
  }
}

// @note idek

// 'use server'

// import { auth } from '@/lib/auth'
// import { db } from '@/db'
// import { invoices } from '@/db/schema/invoices'
// import { eq } from 'drizzle-orm'
// import { revalidatePath } from 'next/cache'
// import { redirect } from 'next/navigation'
// import { Status } from '@/db/schema/invoices'

// export async function updateInvoiceStatus(prevState: any, formData: FormData) {
//   const session = await auth()
//   if (!session?.user?.id) {
//     return {
//       success: false,
//       message: 'You must be logged in to update invoices'
//     }
//   }

//   const invoiceId = formData.get('invoiceId') as string
//   const status = formData.get('status') as Status

//   try {
//     await db
//       .update(invoices)
//       .set({ status })
//       .where(eq(invoices.id, parseInt(invoiceId)))

//     revalidatePath(`/dashboard/invoices/${invoiceId}`)
//     return {
//       success: true,
//       message: 'Invoice status updated successfully',
//       status
//     }
//   } catch (error) {
//     console.error('Error updating invoice status:', error)
//     return {
//       success: false,
//       message: 'Failed to update invoice status',
//       status: prevState.status
//     }
//   }
// }

// export async function deleteInvoice(prevState: any, formData: FormData) {
//   const session = await auth()
//   if (!session?.user?.id) {
//     return {
//       success: false,
//       message: 'You must be logged in to delete invoices'
//     }
//   }

//   const invoiceId = formData.get('invoiceId') as string

//   try {
//     await db.delete(invoices).where(eq(invoices.id, parseInt(invoiceId)))

//     redirect('/dashboard/invoices')
//   } catch (error) {
//     console.error('Error deleting invoice:', error)
//     return { success: false, message: 'Failed to delete invoice' }
//   }
// }

// 'use server'

// import { auth } from '@/lib/auth'
// import { db } from '@/db'
// import { invoices } from '@/db/schema/invoices'
// import { eq } from 'drizzle-orm'
// import { revalidatePath } from 'next/cache'
// import { redirect } from 'next/navigation'

// export async function updateInvoiceStatus(prevState: any, formData: FormData) {
//   const session = await auth()
//   if (!session?.user?.id) {
//     return {
//       success: false,
//       message: 'You must be logged in to update invoices'
//     }
//   }

//   const invoiceId = formData.get('invoiceId') as string
//   const status = formData.get('status') as
//     | 'open'
//     | 'paid'
//     | 'void'
//     | 'uncollectible'

//   try {
//     await db
//       .update(invoices)
//       .set({ status })
//       .where(eq(invoices.id, parseInt(invoiceId)))

//     revalidatePath(`/invoices/${invoiceId}`)
//     return {
//       success: true,
//       message: 'Invoice status updated successfully',
//       status
//     }
//   } catch (error) {
//     console.error('Error updating invoice status:', error)
//     return {
//       success: false,
//       message: 'Failed to update invoice status',
//       status: prevState.status
//     }
//   }
// }

// export async function deleteInvoice(prevState: any, formData: FormData) {
//   const session = await auth()
//   if (!session?.user?.id) {
//     return {
//       success: false,
//       message: 'You must be logged in to delete invoices'
//     }
//   }

//   const invoiceId = formData.get('invoiceId') as string

//   try {
//     await db.delete(invoices).where(eq(invoices.id, parseInt(invoiceId)))

//     redirect('/dashboard')
//   } catch (error) {
//     console.error('Error deleting invoice:', error)
//     return { success: false, message: 'Failed to delete invoice' }
//   }
// }
