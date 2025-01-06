// 'use server'

// import { signIn } from '@/lib/auth'

// export async function signin(formData: FormData) {
//   console.log(formData)
//   await signIn('resend', formData)
// }

'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { auth, signIn } from '@/lib/auth'
import type { ActionResponse } from '@/types/auth'

const emailSchema = z.object({
  email: z.string().email('Invalid email address')
})

export async function signin(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const session = await auth()

  // If user is already authenticated, return success
  if (session) {
    redirect('/dashboard')
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  try {
    const rawData = {
      email: formData.get('email') as string
    }

    // Validate the form data
    const validatedData = emailSchema.safeParse(rawData)

    if (!validatedData.success) {
      return {
        success: false,
        message: 'Please fix the errors in the form',
        errors: validatedData.error.flatten().fieldErrors
      }
    }

    const signInResult = await signIn('resend', {
      email: validatedData.data.email,
      redirect: false
    })

    if (signInResult?.error) {
      return {
        success: false,
        message: 'Failed to send authentication email. Please try again.'
      }
    }

    return {
      success: true,
      message: 'Check your inbox to continue.'
    }
  } catch (error) {
    console.error('Authentication error: ', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.'
    }
  }
}

/** @see https://v0.dev/chat/CiFWYqPHKvT?b=b_0...&f=0 */
