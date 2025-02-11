'use server'

import { revalidatePath } from 'next/cache'
import { eq, and } from 'drizzle-orm'
import { db } from '@/db'
import { invoices, userOrganizations } from '@/db/schema'
import * as z from 'zod'
import { STATUSES, type Status } from '@/data/invoice-statuses'
import { Action, type ActionResponse } from '@/types/forms'
import { verifySession } from '@/lib/dal'
import { hasPermission, type User } from '@/lib/abac'

const schema = z.object({
  organizationId: z.string().min(1, 'Organization required'),
  customerId: z.string().min(1, 'Customer required'),
  value: z.number().min(1, 'Value must be at least $1'),
  status: z.enum(STATUSES),
  description: z
    .string()
    .max(32, { message: 'Name must be at most 32 characters' })
    .optional()
})

const { FormData } = Action(schema)

async function createAction(
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const user: User = await verifySession()
  const organizationId = formData.get('organizationId') as string

  // Check if the user is associated with the organization
  const userOrganization = await db.query.userOrganizations.findFirst({
    where: and(
      eq(userOrganizations.userId, user.id),
      eq(userOrganizations.organizationId, organizationId)
    )
  })

  if (!userOrganization) {
    return {
      success: false,
      message: 'User is not associated with this organization'
    }
  }

  // Allow invoice creation if the user is associated with the organization
  const canCreateInvoice = await hasPermission(user, 'invoices', 'create', {
    id: '',
    customerId: formData.get('customerId') as string,
    userId: user.id,
    organizationId,
    value: Number(formData.get('value')),
    description: formData.get('description') as string,
    status: formData.get('status') as Status,
    createdAt: new Date(),
    updatedAt: new Date()
  })

  if (!canCreateInvoice) {
    return {
      success: false,
      message: 'Unauthorized to create invoices'
    }
  }

  const rawData = {
    description: formData.get('description') as string,
    value: Number(formData.get('value')),
    status: formData.get('status') as string,
    organizationId: formData.get('organizationId') as string,
    customerId: formData.get('customerId') as string
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

  // Check if the user is admin or owner when setting a non-default status
  if (
    validatedData.data.status !== 'open' &&
    userOrganization.role !== 'admin' &&
    userOrganization.role !== 'owner'
  ) {
    validatedData.data.status = 'open' // Set status to 'open' for non-admin/non-owner users
  }

  try {
    const [invoice] = await db
      .insert(invoices)
      .values({
        ...validatedData.data,
        userId: user.id
      })
      .returning()

    revalidatePath(`/${user.id}/organizations/${rawData.organizationId}`)

    return {
      success: true,
      message: 'Invoice created successfully',
      redirect: `/${user.id}/organizations/${rawData.organizationId}`
    }
  } catch (error) {
    console.error('Error creating invoice:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      inputs: rawData
    }
  }
}

async function updateAction(
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const user: User = await verifySession()
  const organizationId = formData.get('organizationId') as string

  if (
    !(await hasPermission(user, 'invoices', 'update', {
      id: formData.get('id') as string,
      customerId: formData.get('customerId') as string,
      userId: user.id,
      organizationId: formData.get('organizationId') as string,
      value: Number(formData.get('value')),
      description: formData.get('description') as string,
      status: formData.get('status') as Status,
      createdAt: new Date(),
      updatedAt: new Date()
    }))
  ) {
    return {
      success: false,
      message: 'Unauthorized to update invoices'
    }
  }

  const rawData = {
    id: formData.get('id') as string,
    description: formData.get('description') as string,
    value: Number(formData.get('value')),
    status: formData.get('status') as string,
    customerId: formData.get('customerId') as string,
    organizationId: formData.get('organizationId') as string
  }

  const validatedData = schema.extend({ id: z.string() }).safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      message: 'Please fix the errors in the form',
      errors: validatedData.error.flatten().fieldErrors,
      inputs: rawData
    }
  }

  // Check if the user is admin or owner when updating the status
  const userOrganization = await db.query.userOrganizations.findFirst({
    where: and(
      eq(userOrganizations.userId, user.id),
      eq(userOrganizations.organizationId, organizationId)
    )
  })

  if (
    !userOrganization ||
    (userOrganization.role !== 'admin' && userOrganization.role !== 'owner')
  ) {
    const currentInvoice = await db.query.invoices.findFirst({
      where: eq(invoices.id, validatedData.data.id)
    })

    if (currentInvoice && currentInvoice.status !== validatedData.data.status) {
      return {
        success: false,
        message: 'Only admins and owners can update invoice status',
        inputs: rawData
      }
    }
  }

  try {
    await db
      .update(invoices)
      .set({
        description: validatedData.data.description,
        value: validatedData.data.value,
        status: validatedData.data.status,
        customerId: validatedData.data.customerId,
        updatedAt: new Date()
      })
      .where(eq(invoices.id, validatedData.data.id))

    revalidatePath(`/${user.id}/organizations/${rawData.organizationId}`)

    return {
      success: true,
      message: 'Invoice updated successfully',
      redirect: `/${user.id}/organizations/${rawData.organizationId}`
    }
  } catch (error) {
    console.error('Error updating invoice:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      inputs: rawData
    }
  }
}

async function deleteAction(
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const user: User = await verifySession()
  const id = formData.get('id') as string
  const organizationId = formData.get('organizationId') as string

  if (
    !(await hasPermission(user, 'invoices', 'delete', {
      id,
      customerId: '',
      userId: user.id,
      organizationId,
      value: 0,
      description: '',
      status: 'open' as Status,
      createdAt: new Date(),
      updatedAt: new Date()
    }))
  ) {
    return {
      success: false,
      message: 'Unauthorized to delete invoices'
    }
  }

  try {
    await db.delete(invoices).where(eq(invoices.id, id))

    revalidatePath(`/${user.id}/organizations/${organizationId}`)

    return {
      success: true,
      message: 'Invoice deleted successfully',
      redirect: `/${user.id}/organizations/${organizationId}`
    }
  } catch (error) {
    console.error('Error deleting invoice:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.'
    }
  }
}

export { createAction, updateAction, deleteAction }

// 'use server'

// import { revalidatePath } from 'next/cache'
// import { eq, and } from 'drizzle-orm'
// import { db } from '@/db'
// import { invoices, userOrganizations } from '@/db/schema'
// import * as z from 'zod'
// import { STATUSES, type Status } from '@/data/invoice-statuses'
// import { Action, type ActionResponse } from '@/types/forms'
// import { verifySession } from '@/lib/dal'
// import { hasPermission, type User } from '@/lib/abac'

// const schema = z.object({
//   organizationId: z.string().min(1, 'Organization required'),
//   customerId: z.string().min(1, 'Customer required'),
//   value: z.number().min(1, 'Value must be at least $1'),
//   status: z.enum(STATUSES),
//   description: z
//     .string()
//     .max(32, { message: 'Name must be at most 32 characters' })
//     .optional()
// })

// const { FormData } = Action(schema)

// async function createAction(
//   _: ActionResponse | null,
//   formData: FormData
// ): Promise<ActionResponse> {
//   const user: User = await verifySession()
//   const organizationId = formData.get('organizationId') as string

//   // Check if the user is associated with the organization
//   const userOrganization = await db.query.userOrganizations.findFirst({
//     where: and(
//       eq(userOrganizations.userId, user.id),
//       eq(userOrganizations.organizationId, organizationId)
//     )
//   })

//   if (!userOrganization) {
//     return {
//       success: false,
//       message: 'User is not associated with this organization'
//     }
//   }

//   // Allow invoice creation if the user is associated with the organization
//   const canCreateInvoice = await hasPermission(user, 'invoices', 'create', {
//     id: '',
//     customerId: formData.get('customerId') as string,
//     userId: user.id,
//     organizationId,
//     value: Number(formData.get('value')),
//     description: formData.get('description') as string,
//     status: formData.get('status') as Status,
//     createdAt: new Date(),
//     updatedAt: new Date()
//   })

//   if (!canCreateInvoice) {
//     return {
//       success: false,
//       message: 'Unauthorized to create invoices'
//     }
//   }

//   const rawData = {
//     description: formData.get('description') as string,
//     value: Number(formData.get('value')),
//     status: formData.get('status') as string,
//     organizationId: formData.get('organizationId') as string,
//     customerId: formData.get('customerId') as string
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

//   // Check if the user is admin or owner when setting a non-default status
//   if (
//     validatedData.data.status !== 'open' &&
//     userOrganization.role !== 'admin' &&
//     userOrganization.role !== 'owner'
//   ) {
//     return {
//       success: false,
//       message: 'Access denied: Admin only',
//       inputs: rawData
//     }
//   }

//   try {
//     const [invoice] = await db
//       .insert(invoices)
//       .values({
//         ...validatedData.data,
//         userId: user.id
//       })
//       .returning()

//     revalidatePath(`/${user.id}/organizations/${rawData.organizationId}`)

//     return {
//       success: true,
//       message: 'Invoice created successfully',
//       redirect: `/${user.id}/organizations/${rawData.organizationId}`
//     }
//   } catch (error) {
//     console.error('Error creating invoice:', error)
//     return {
//       success: false,
//       message: 'An unexpected error occurred. Please try again.',
//       inputs: rawData
//     }
//   }
// }

// async function updateAction(
//   _: ActionResponse | null,
//   formData: FormData
// ): Promise<ActionResponse> {
//   const user: User = await verifySession()
//   const organizationId = formData.get('organizationId') as string

//   if (
//     !(await hasPermission(user, 'invoices', 'update', {
//       id: formData.get('id') as string,
//       customerId: formData.get('customerId') as string,
//       userId: user.id,
//       organizationId: formData.get('organizationId') as string,
//       value: Number(formData.get('value')),
//       description: formData.get('description') as string,
//       status: formData.get('status') as Status,
//       createdAt: new Date(),
//       updatedAt: new Date()
//     }))
//   ) {
//     return {
//       success: false,
//       message: 'Unauthorized to update invoices'
//     }
//   }

//   const rawData = {
//     id: formData.get('id') as string,
//     description: formData.get('description') as string,
//     value: Number(formData.get('value')),
//     status: formData.get('status') as string,
//     customerId: formData.get('customerId') as string,
//     organizationId: formData.get('organizationId') as string
//   }

//   const validatedData = schema.extend({ id: z.string() }).safeParse(rawData)

//   if (!validatedData.success) {
//     return {
//       success: false,
//       message: 'Please fix the errors in the form',
//       errors: validatedData.error.flatten().fieldErrors,
//       inputs: rawData
//     }
//   }

//   // Check if the user is admin or owner when updating the status
//   const userOrganization = await db.query.userOrganizations.findFirst({
//     where: and(
//       eq(userOrganizations.userId, user.id),
//       eq(userOrganizations.organizationId, organizationId)
//     )
//   })

//   if (
//     !userOrganization ||
//     (userOrganization.role !== 'admin' && userOrganization.role !== 'owner')
//   ) {
//     const currentInvoice = await db.query.invoices.findFirst({
//       where: eq(invoices.id, validatedData.data.id)
//     })

//     if (currentInvoice && currentInvoice.status !== validatedData.data.status) {
//       return {
//         success: false,
//         message: 'Only admins and owners can update invoice status',
//         inputs: rawData
//       }
//     }
//   }

//   try {
//     await db
//       .update(invoices)
//       .set({
//         description: validatedData.data.description,
//         value: validatedData.data.value,
//         status: validatedData.data.status,
//         customerId: validatedData.data.customerId,
//         updatedAt: new Date()
//       })
//       .where(eq(invoices.id, validatedData.data.id))

//     revalidatePath(`/${user.id}/organizations/${rawData.organizationId}`)

//     return {
//       success: true,
//       message: 'Invoice updated successfully',
//       redirect: `/${user.id}/organizations/${rawData.organizationId}`
//     }
//   } catch (error) {
//     console.error('Error updating invoice:', error)
//     return {
//       success: false,
//       message: 'An unexpected error occurred. Please try again.',
//       inputs: rawData
//     }
//   }
// }

// async function deleteAction(
//   _: ActionResponse | null,
//   formData: FormData
// ): Promise<ActionResponse> {
//   const user: User = await verifySession()
//   const id = formData.get('id') as string
//   const organizationId = formData.get('organizationId') as string

//   if (
//     !(await hasPermission(user, 'invoices', 'delete', {
//       id,
//       customerId: '',
//       userId: user.id,
//       organizationId,
//       value: 0,
//       description: '',
//       status: 'open' as Status,
//       createdAt: new Date(),
//       updatedAt: new Date()
//     }))
//   ) {
//     return {
//       success: false,
//       message: 'Unauthorized to delete invoices'
//     }
//   }

//   try {
//     await db.delete(invoices).where(eq(invoices.id, id))

//     revalidatePath(`/${user.id}/organizations/${organizationId}`)

//     return {
//       success: true,
//       message: 'Invoice deleted successfully',
//       redirect: `/${user.id}/organizations/${organizationId}`
//     }
//   } catch (error) {
//     console.error('Error deleting invoice:', error)
//     return {
//       success: false,
//       message: 'An unexpected error occurred. Please try again.'
//     }
//   }
// }

// export { createAction, updateAction, deleteAction }
