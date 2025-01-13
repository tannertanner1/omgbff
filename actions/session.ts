'use server'

import { auth } from '@/lib/auth'

export async function getSession() {
  try {
    const session = await auth()
    console.log('Server session:', session) // Debug log
    return session
  } catch (error) {
    console.error('Session error:', error)
    return null
  }
}
