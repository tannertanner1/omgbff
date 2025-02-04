'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { auth, signIn } from '@/lib/auth'
import type { ActionResponse } from './types'

const schema = z.object({
  email: z.string().email('Invalid email')
})

export async function login(
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const session = await auth()
  if (session) redirect('/')

  try {
    const rawData = {
      email: formData.get('email') as string
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

    const result = await signIn('resend', {
      email: validatedData.data.email,
      redirect: false,
      redirectTo: '/'
    })

    if (result?.error) {
      return {
        success: false,
        message: 'Failed to send authentication email'
      }
    }

    return {
      success: true,
      message: 'Check your inbox to continue'
    }
  } catch (error) {
    console.error('Authentication error: ', error)
    return {
      success: false,
      message: 'An unexpected error occurred'
    }
  }
}

/**
 * @see https://v0.dev/chat/CiFWYqPHKvT?b=b_0...&f=0
 * @see https://youtu.be/KhO4VjaYSXU?si=CWlmzn0osAe4rW2v
 */
