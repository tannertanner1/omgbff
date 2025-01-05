'use server'

import { signIn } from '@/lib/auth'

export async function signin(formData: FormData) {
  console.log(formData)
  await signIn('resend', formData)
}
