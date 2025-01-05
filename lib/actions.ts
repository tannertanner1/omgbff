'use server'

import { signIn } from '@/lib/auth'
import { z } from 'zod'
import { db } from '@/lib/db'
import { users } from '@/lib/schema'
import { eq } from 'drizzle-orm'
// import { verifyUserExists } from "@/lib/dal";

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address')
})

const signinSchema = z.object({
  email: z.string().email('Invalid email address')
})

export type ActionState = {
  error: string | null
  success: boolean
  message: string | null
}

async function signup(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get('name') as string
  const email = formData.get('email') as string

  const result = signupSchema.safeParse({ name, email })

  if (!result.success) {
    return {
      error: result.error.issues[0].message,
      success: false,
      message: null
    }
  }

  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email)
    })

    if (existingUser) {
      return {
        error: 'An account with this email already exists. Please log in.',
        success: false,
        message: null
      }
    }

    await db.insert(users).values({ name, email })

    const signUpResult = await signIn('resend', { email, redirect: false })

    if (signUpResult?.error) {
      return { error: signUpResult.error, success: false, message: null }
    }

    return {
      error: null,
      success: true,
      message: 'Check your inbox to continue.'
    }
  } catch (error) {
    console.error('Sign up error: ', error)
    return {
      error: 'Failed to create account. Please try again.',
      success: false,
      message: null
    }
  }
}

async function signin(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = formData.get('email') as string
  const callbackUrl = formData.get('callbackUrl') as string | undefined

  const result = signinSchema.safeParse({ email })

  if (!result.success) {
    return {
      error: result.error.issues[0].message,
      success: false,
      message: null
    }
  }

  try {
    // await verifyUserExists(email);

    const signInResult = await signIn('resend', {
      email,
      redirect: false,
      callbackUrl: callbackUrl || '/account'
    })

    if (signInResult?.error) {
      return { error: signInResult.error, success: false, message: null }
    }

    return {
      error: null,
      success: true,
      message: 'Check your inbox to continue.'
    }
  } catch (error) {
    console.error('Log in error: ', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
      message: null
    }
  }
}

export { signup, signin }
